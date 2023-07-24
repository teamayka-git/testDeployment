
import { OrderSaleReportListDto, StatesListDto } from './states.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ModelNames } from 'src/common/model_names';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelWeightResponseFormat } from 'src/model_weight/model_weight_response_format';
import { OrderSalesMain } from 'src/tableModels/order_sales_main.model';
import { Employee } from 'src/tableModels/employee.model';
import { Departments } from 'src/tableModels/departments.model';
import { ProcessMaster } from 'src/tableModels/processMaster.model';
import { States } from 'src/tableModels/states.model';
import { SubCategories } from 'src/tableModels/sub_categories.model';
import { Generals } from 'src/tableModels/generals.model';

@Injectable()
export class TestAaaService {
  constructor(
    @InjectModel(ModelNames.STATES) private readonly statesModel: Model<States>,


    @InjectModel(ModelNames.ORDER_SALES_MAIN)
    private readonly orderSaleMainModel: Model<OrderSalesMain>,
    @InjectModel(ModelNames.EMPLOYEES)
    private readonly employeeModel: mongoose.Model<Employee>,
    @InjectModel(ModelNames.DEPARTMENT)
    private readonly departmentModel: mongoose.Model<Departments>,
    @InjectModel(ModelNames.PROCESS_MASTER)
    private readonly processMasterModel: mongoose.Model<ProcessMaster>,
    @InjectModel(ModelNames.SUB_CATEGORIES)
    private readonly subCategoryModel: Model<SubCategories>,
    @InjectModel(ModelNames.GENERALS)
    private readonly generalsModel: Model<Generals>,



    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}
  async stateList(dto: StatesListDto) {
    var dateTime = new Date().getTime();
    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();
    try {
      var arrayAggregation = [];

      if (dto.searchingText != '') {
        //todo
        arrayAggregation.push({
          $match: {
            $or: [
              { _name: new RegExp(dto.searchingText, 'i') },
              { _code: new RegExp(`^${dto.searchingText}$`, 'i') },
            ],
          },
        });
      }
      if (dto.stateIds.length > 0) {
        var newSettingsId = [];
        dto.stateIds.map((mapItem) => {
          newSettingsId.push(new mongoose.Types.ObjectId(mapItem));
        });
        arrayAggregation.push({ $match: { _id: { $in: newSettingsId } } });
      }
      arrayAggregation.push({ $match: { _status: { $in: dto.statusArray } } });

      switch (dto.sortType) {
        case 0:
          arrayAggregation.push({ $sort: { _id: dto.sortOrder } });
          break;
        case 1:
          arrayAggregation.push({ $sort: { _status: dto.sortOrder ,_id: dto.sortOrder } });
          break;
        case 2:
          arrayAggregation.push({ $sort: { _name: dto.sortOrder ,_id: dto.sortOrder } });
          break;
        case 3:
          arrayAggregation.push({ $sort: { _code: dto.sortOrder ,_id: dto.sortOrder } });
          break;
      }

      if (dto.skip != -1) {
        arrayAggregation.push({ $skip: dto.skip });
        arrayAggregation.push({ $limit: dto.limit });
      }

      var result = await this.statesModel
        .aggregate(arrayAggregation)
        .session(transactionSession);

      var totalCount = 0;
      if (dto.screenType.includes(0)) {
        //Get total count
        var limitIndexCount = arrayAggregation.findIndex(
          (it) => it.hasOwnProperty('$limit') === true,
        );
        if (limitIndexCount != -1) {
          arrayAggregation.splice(limitIndexCount, 1);
        }
        var skipIndexCount = arrayAggregation.findIndex(
          (it) => it.hasOwnProperty('$skip') === true,
        );
        if (skipIndexCount != -1) {
          arrayAggregation.splice(skipIndexCount, 1);
        }
        arrayAggregation.push({
          $group: { _id: null, totalCount: { $sum: 1 } },
        });

        var resultTotalCount = await this.statesModel
          .aggregate(arrayAggregation)
          .session(transactionSession);
        if (resultTotalCount.length > 0) {
          totalCount = resultTotalCount[0].totalCount;
        }
      }

      const responseJSON = {
        message: 'success',
        data: { list: result, totalCount: totalCount },
      };
  
      await transactionSession.commitTransaction();
      await transactionSession.endSession();
      return responseJSON;
    } catch (error) {
      await transactionSession.abortTransaction();
      await transactionSession.endSession();
      throw error;
    }
  }


  
  async orderReportList(dto: OrderSaleReportListDto) {
    var dateTime = new Date().getTime();
    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();
    try {
      var arrayAggregation = [];

      // if (dto.searchingText != '') {
      //   //todo
      //   arrayAggregation.push({
      //     $match: {
      //       $or: [
      //         { _name: new RegExp(dto.searchingText, 'i') },
      //         { _uid: dto.searchingText },
      //         { _referenceNumber: dto.searchingText },
      //       ],
      //     },
      //   });
      // }
      if (dto.orderSaleUids.length > 0) {
        var arrayTemp = [];
        dto.orderSaleUids.forEach((eachElement) => {
          arrayTemp.push(new RegExp(`^${eachElement}$`, 'i'));
        });

        arrayAggregation.push({
          $match: {
            _uid: { $in: arrayTemp },
          },
        });
      }

      if (dto.dueStartDate != -1 && dto.dueEndDate != -1) {
        arrayAggregation.push({
          $match: {
            _dueDate: { $lte: dto.dueEndDate, $gte: dto.dueStartDate },
          },
        });
      }
      if (dto.createdDateStartDate != -1 && dto.createdDateEndDate != -1) {
        arrayAggregation.push({
          $match: {
            _createdAt: {
              $lte: dto.createdDateEndDate,
              $gte: dto.createdDateStartDate,
            },
          },
        });
      }

      if (dto.referenceIds.length > 0) {
        var arrayTemp = [];
        dto.referenceIds.forEach((eachElement) => {
          arrayTemp.push(new RegExp(`^${eachElement}$`, 'i'));
        });

        arrayAggregation.push({
          $match: {
            _referenceNumber: { $in: arrayTemp },
          },
        });
      }
      if (dto.types.length > 0) {
        arrayAggregation.push({
          $match: { _type: { $in: dto.types } },
        });
      }

      if (dto.orderSaleIds.length > 0) {
        var newSettingsId = [];
        dto.orderSaleIds.map((mapItem) => {
          newSettingsId.push(new mongoose.Types.ObjectId(mapItem));
        });
        arrayAggregation.push({ $match: { _id: { $in: newSettingsId } } });
      }

      if (dto.shopIds.length > 0) {
        var newSettingsId = [];
        dto.shopIds.map((mapItem) => {
          newSettingsId.push(new mongoose.Types.ObjectId(mapItem));
        });
        arrayAggregation.push({
          $match: { _shopId: { $in: newSettingsId } },
        });
      }
      if (dto.orderHeadIds.length > 0) {
        var newSettingsId = [];
        dto.orderHeadIds.map((mapItem) => {
          newSettingsId.push(new mongoose.Types.ObjectId(mapItem));
        });
        arrayAggregation.push({
          $match: { _orderHeadId: { $in: newSettingsId } },
        });
      }

      if (dto.workStatus.length > 0) {
        arrayAggregation.push({
          $match: { _workStatus: { $in: dto.workStatus } },
        });
      }
      if (dto.isProductGenerated.length > 0) {
        arrayAggregation.push({
          $match: { _isProductGenerated: { $in: dto.isProductGenerated } },
        });
      }
      if (dto.isInvoiceGenerated.length > 0) {
        arrayAggregation.push({
          $match: { _isInvoiceGenerated: { $in: dto.isInvoiceGenerated } },
        });
      }

      if (
        dto.cityIds.length > 0 ||
        dto.branchIds.length > 0 ||
        dto.relationshipManagerIds.length > 0
      ) {
        const shopMongoCheckPipeline = () => {
          const pipeline = [];
          pipeline.push({
            $match: {
              $expr: { $eq: ['$_id', '$$shopId'] },
            },
          });
          if (dto.cityIds.length > 0) {
            var newSettingsId = [];
            dto.cityIds.map((mapItem) => {
              newSettingsId.push(new mongoose.Types.ObjectId(mapItem));
            });
            pipeline.push({ $match: { _cityId: { $in: newSettingsId } } });
          }

          if (dto.branchIds.length > 0) {
            var newSettingsId = [];
            dto.branchIds.map((mapItem) => {
              newSettingsId.push(new mongoose.Types.ObjectId(mapItem));
            });
            pipeline.push({ $match: { _branchId: { $in: newSettingsId } } });
          }
          if (dto.relationshipManagerIds.length > 0) {
            var newSettingsId = [];
            dto.relationshipManagerIds.map((mapItem) => {
              newSettingsId.push(new mongoose.Types.ObjectId(mapItem));
            });
            pipeline.push({
              $match: { _relationshipManagerId: { $in: newSettingsId } },
            });
          }

          pipeline.push({ $project: { _id: 1 } });

          return pipeline;
        };

        arrayAggregation.push(
          {
            $lookup: {
              from: ModelNames.SHOPS,
              let: { shopId: '$_shopId' },
              pipeline: shopMongoCheckPipeline(),
              as: 'mongoCheckShopList',
            },
          },
          {
            $match: { mongoCheckShopList: { $ne: [] } },
          },
        );
      }

      //delivery

      if (
        (dto.deliveryCompleteEndDate != -1 &&
          dto.deliveryCompleteStartDate != -1) ||
        dto.deliveryExecutiveIds.length != 0 ||
        dto.deliveryStatus.length != 0
      ) {
        var listMatchDeliveryTable = [];
        listMatchDeliveryTable.push({
          $match: {
            $expr: {
              $eq: ['$_id', '$$deliveryId'],
            },
          },
        });

        if (
          dto.deliveryCompleteEndDate != -1 &&
          dto.deliveryCompleteStartDate != -1
        ) {
          listMatchDeliveryTable.push({
            $match: {
              _deliveryAcceptedAt: {
                $lte: dto.deliveryCompleteEndDate,
                $gte: dto.deliveryCompleteStartDate,
              },
            },
          });
        }

        if (dto.deliveryStatus.length != 0) {
          listMatchDeliveryTable.push({
            $match: { _workStatus: { $in: dto.deliveryStatus } },
          });
        }

        if (dto.deliveryExecutiveIds.length != 0) {
          var newSettingsId = [];
          dto.deliveryExecutiveIds.map((mapItem) => {
            newSettingsId.push(new mongoose.Types.ObjectId(mapItem));
          });
          listMatchDeliveryTable.push({
            $match: { _employeeId: { $in: newSettingsId } },
          });
        }

        listMatchDeliveryTable.push({
          $project: {
            _id: 1,
          },
        });

        arrayAggregation.push(
          {
            $lookup: {
              from: ModelNames.ORDER_SALES_ITEMS,
              let: { orderSaleId: '$_id' },
              pipeline: [
                {
                  $match: {
                    _status: 1,
                    $expr: { $eq: ['$_orderSaleId', '$$orderSaleId'] },
                  },
                },
                {
                  $project: {
                    _id: 1,
                  },
                },

                {
                  $lookup: {
                    from: ModelNames.INVOICE_ITEMS,
                    let: { orderSaleItemId: '$_id' },
                    pipeline: [
                      {
                        $match: {
                          _status: 1,
                          $expr: {
                            $eq: ['$_orderSaleItemId', '$$orderSaleItemId'],
                          },
                        },
                      },
                      {
                        $project: {
                          _invoiceId: 1,
                        },
                      },

                      {
                        $lookup: {
                          from: ModelNames.INVOICES,
                          let: { invoiceId: '$_invoiceId' },
                          pipeline: [
                            {
                              $match: {
                                _status: 1,
                                $expr: { $eq: ['$_id', '$$invoiceId'] },
                              },
                            },
                            {
                              $project: {
                                _id: 1,
                              },
                            },

                            {
                              $lookup: {
                                from: ModelNames.DELIVERY_ITEMS,
                                let: { invoiceId: '$_id' },
                                pipeline: [
                                  {
                                    $match: {
                                      _status: 1,
                                      $expr: {
                                        $eq: ['$_invoiceId', '$$invoiceId'],
                                      },
                                    },
                                  },
                                  {
                                    $project: {
                                      _deliveryId: 1,
                                    },
                                  },

                                  {
                                    $lookup: {
                                      from: ModelNames.DELIVERY,
                                      let: { deliveryId: '$_deliveryId' },
                                      pipeline: listMatchDeliveryTable,
                                      as: 'mongoCheckDelivery',
                                    },
                                  },
                                  {
                                    $match: { mongoCheckDelivery: { $ne: [] } },
                                  },
                                ],
                                as: 'mongoCheckDeliveryItems',
                              },
                            },
                            {
                              $match: { mongoCheckDeliveryItems: { $ne: [] } },
                            },
                          ],
                          as: 'mongoCheckInvoice',
                        },
                      },
                      {
                        $match: { mongoCheckInvoice: { $ne: [] } },
                      },
                    ],
                    as: 'mongoCheckInvoiceItems',
                  },
                },
                {
                  $match: { mongoCheckInvoiceItems: { $ne: [] } },
                },
              ],
              as: 'mongoCheckOrdersaleItems',
            },
          },
          {
            $match: { mongoCheckOrdersaleItems: { $ne: [] } },
          },
        );
      }

      if (
        dto.deliveryAssignedStartDate != -1 ||
        dto.deliveryAssignedEndDate != -1 ||
        dto.logisticsPartnerIds.length != 0
      ) {
        var logisticsPartnerIdsMongo = [];

        if (dto.logisticsPartnerIds.length > 0) {
          dto.logisticsPartnerIds.map((mapItem) => {
            logisticsPartnerIdsMongo.push(new mongoose.Types.ObjectId(mapItem));
          });
        }

        const orderSaleItemsMongoCheckPipeline = () => {
          const pipeline = [];
          pipeline.push({
            $match: {
              _status: 1,
              $expr: { $eq: ['$_orderSaleId', '$$orderSaleId'] },
            },
          });

          const invoiceItemsMongoCheckPipeline = () => {
            const pipeline = [];
            pipeline.push({
              $match: {
                $expr: { $eq: ['$_orderSaleItemId', '$$orderSaleItemId'] },
              },
            });

            const invoiceItemsInvoiceDetailsMongoCheckPipeline = () => {
              const pipeline = [];
              pipeline.push({
                $match: {
                  $expr: { $eq: ['$_id', '$$invoiceId'] },
                },
              });

              const invoiceItemsInvoiceDetailsDeliveryTempMongoCheckPipeline =
                () => {
                  const pipeline = [];
                  pipeline.push({
                    $match: {
                      // _status: 1,
                      $expr: { $eq: ['$_invoiceId', '$$invoiceIdForDelTemp'] },
                    },
                  });

                  if (dto.deliveryAssignedStartDate != -1) {
                    pipeline.push({
                      $match: {
                        _assignedAt: {
                          $gte: dto.deliveryAssignedStartDate,
                          $ne: 0,
                        },
                      },
                    });
                  }

                  if (dto.deliveryAssignedEndDate != -1) {
                    pipeline.push({
                      $match: {
                        _assignedAt: {
                          $lte: dto.deliveryAssignedEndDate,
                          $ne: 0,
                        },
                      },
                    });
                  }
                  if (logisticsPartnerIdsMongo.length != 0) {
                    pipeline.push({
                      $match: {
                        _deliveryProviderId: { $in: logisticsPartnerIdsMongo },
                      },
                    });
                  }
                  pipeline.push({ $project: { _id: 1 } });
                  return pipeline;
                };

              pipeline.push(
                {
                  $lookup: {
                    from: ModelNames.DELIVERY_TEMP,
                    let: { invoiceIdForDelTemp: '$_id' },
                    pipeline:
                      invoiceItemsInvoiceDetailsDeliveryTempMongoCheckPipeline(),
                    as: 'deliveryTempList',
                  },
                },
                {
                  $match: { deliveryTempList: { $ne: [] } },
                },
              );

              pipeline.push({ $project: { _id: 1 } });
              return pipeline;
            };

            pipeline.push(
              {
                $lookup: {
                  from: ModelNames.INVOICES,
                  let: { invoiceId: '$_invoiceId' },
                  pipeline: invoiceItemsInvoiceDetailsMongoCheckPipeline(),
                  as: 'invoiceDetails',
                },
              },
              {
                $unwind: {
                  path: '$invoiceDetails',
                },
              },
            );

            pipeline.push({ $project: { _id: 1 } });
            return pipeline;
          };

          pipeline.push(
            {
              $lookup: {
                from: ModelNames.INVOICE_ITEMS,
                let: { orderSaleItemId: '$_id' },
                pipeline: invoiceItemsMongoCheckPipeline(),
                as: 'mongoCheckInvoiceList',
              },
            },
            {
              $match: { mongoCheckInvoiceList: { $ne: [] } },
            },
          );

          pipeline.push({ $project: { _id: 1 } });
          return pipeline;
        };

        arrayAggregation.push(
          {
            $lookup: {
              from: ModelNames.ORDER_SALES_ITEMS,
              let: { orderSaleId: '$_id' },
              pipeline: orderSaleItemsMongoCheckPipeline(),
              as: 'mongoCheckOrderItemsDeliveryAssignList',
            },
          },
          {
            $match: { mongoCheckOrderItemsDeliveryAssignList: { $ne: [] } },
          },
        );
      }

      //product

      if (
        dto.netWeightStart != -1 ||
        dto.netWeightEnd != -1 ||
        dto.huids.length != 0 ||
        dto.productCreatedStartDate != -1 ||
        dto.productCreatedEndDate != -1 ||
        (dto.invoiceDateStartDate != -1 && dto.invoiceDateEndDate != -1) ||
        dto.invoiceUids.length != 0
      ) {
        const orderSaleItemsMongoCheckPipeline = () => {
          const pipeline = [];
          pipeline.push({
            $match: {
              _status: 1,
              $expr: { $eq: ['$_orderSaleId', '$$orderSaleId'] },
            },
          });
          if (
            dto.netWeightStart != -1 ||
            dto.netWeightEnd != -1 ||
            dto.productCreatedStartDate != -1 ||
            dto.productCreatedEndDate != -1 ||
            dto.huids.length != 0
          ) {
            const orderSaleItemsProductMongoCheckPipeline = () => {
              const pipeline = [];
              pipeline.push({
                $match: {
                  _status: 1,
                  $expr: { $eq: ['$_orderItemId', '$$orderSaleItemId'] },
                },
              });

              if (dto.netWeightStart != -1) {
                pipeline.push({
                  $match: {
                    _netWeight: { $gte: dto.netWeightStart },
                  },
                });
              }

              if (dto.productCreatedStartDate != -1) {
                pipeline.push({
                  $match: {
                    _createdAt: { $gte: dto.productCreatedStartDate },
                  },
                });
              }

              if (dto.productCreatedEndDate != -1) {
                pipeline.push({
                  $match: {
                    _createdAt: { $lte: dto.productCreatedEndDate },
                  },
                });
              }

              if (dto.netWeightEnd != -1) {
                pipeline.push({
                  $match: {
                    _netWeight: { $lte: dto.netWeightEnd },
                  },
                });
              }

              if (dto.huids.length != 0) {
                var arrayTemp = [];
                dto.huids.forEach((eachElement) => {
                  arrayTemp.push(new RegExp(`^${eachElement}$`, 'i'));
                });

                pipeline.push({
                  $match: {
                    _huId: { $in: arrayTemp },
                  },
                });
              }

              pipeline.push({ $project: { _id: 1 } });
              return pipeline;
            };

            pipeline.push(
              {
                $lookup: {
                  from: ModelNames.PRODUCTS,
                  let: { orderSaleItemId: '$_id' },
                  pipeline: orderSaleItemsProductMongoCheckPipeline(),
                  as: 'mongoCheckProductlist',
                },
              },
              {
                $match: { mongoCheckProductlist: { $ne: [] } },
              },
            );
          }

          if (
            (dto.invoiceDateStartDate != -1 && dto.invoiceDateEndDate != -1) ||
            dto.invoiceUids.length != 0
          ) {
            const invoiceItemsMongoCheckPipeline = () => {
              const pipeline = [];
              pipeline.push({
                $match: {
                  $expr: { $eq: ['$_orderSaleItemId', '$$orderSaleItemId'] },
                },
              });

              const invoiceItemsInvoiceDetailsMongoCheckPipeline = () => {
                const pipeline = [];
                pipeline.push({
                  $match: {
                    $expr: { $eq: ['$_id', '$$invoiceId'] },
                  },
                });

                if (
                  dto.invoiceDateStartDate != -1 &&
                  dto.invoiceDateEndDate != -1
                ) {
                  pipeline.push({
                    $match: {
                      _createdAt: {
                        $gte: dto.invoiceDateStartDate,
                        $lte: dto.invoiceDateEndDate,
                      },
                    },
                  });
                }
                if (dto.invoiceUids.length != 0) {
                  var arrayTemp = [];
                  dto.invoiceUids.forEach((eachElement) => {
                    arrayTemp.push(new RegExp(`^${eachElement}$`, 'i'));
                  });

                  pipeline.push({
                    $match: {
                      _uid: { $in: arrayTemp },
                    },
                  });
                }

                pipeline.push({ $project: { _id: 1 } });
                return pipeline;
              };

              pipeline.push(
                {
                  $lookup: {
                    from: ModelNames.INVOICES,
                    let: { invoiceId: '$_invoiceId' },
                    pipeline: invoiceItemsInvoiceDetailsMongoCheckPipeline(),
                    as: 'invoiceDetails',
                  },
                },
                {
                  $unwind: {
                    path: '$invoiceDetails',
                  },
                },
              );

              pipeline.push({ $project: { _id: 1 } });
              return pipeline;
            };

            pipeline.push(
              {
                $lookup: {
                  from: ModelNames.INVOICE_ITEMS,
                  let: { orderSaleItemId: '$_id' },
                  pipeline: invoiceItemsMongoCheckPipeline(),
                  as: 'mongoCheckInvoiceList',
                },
              },
              {
                $match: { mongoCheckInvoiceList: { $ne: [] } },
              },
            );
          }

          pipeline.push({ $project: { _id: 1 } });
          return pipeline;
        };

        arrayAggregation.push(
          {
            $lookup: {
              from: ModelNames.ORDER_SALES_ITEMS,
              let: { orderSaleId: '$_id' },
              pipeline: orderSaleItemsMongoCheckPipeline(),
              as: 'mongoCheckOrderItemsList',
            },
          },
          {
            $match: { mongoCheckOrderItemsList: { $ne: [] } },
          },
        );
      }

      if (
        dto.orderProcessMasterIds.length != 0 &&
        dto.orderSetProcessOrderStatus.length != 0
      ) {
        var mongoProcessMasterIdsArray = [];
        dto.orderProcessMasterIds.forEach((eachItem) => {
          mongoProcessMasterIdsArray.push(
            new mongoose.Types.ObjectId(eachItem),
          );
        });

        const orderSaleSetProcessPipeline = () => {
          const pipeline = [];
          pipeline.push({
            $match: {
              _status: 1,
              $expr: { $eq: ['$_orderSaleId', '$$orderSaleId'] },
            },
          });

          pipeline.push({
            $match: {
              _processId: { $in: mongoProcessMasterIdsArray },
              _orderStatus: { $in: dto.orderSetProcessOrderStatus },
            },
          });

          pipeline.push({ $project: { _id: 1 } });
          return pipeline;
        };

        arrayAggregation.push(
          {
            $lookup: {
              from: ModelNames.ORDER_SALE_SET_PROCESSES,
              let: { orderSaleId: '$_id' },
              pipeline: orderSaleSetProcessPipeline(),
              as: 'mongoCheckProcessMasterWithWorkStatus',
            },
          },
          {
            $match: { mongoCheckProcessMasterWithWorkStatus: { $ne: [] } },
          },
        );
      }

      if (
        dto.orderSetProcessWorkerIds.length != 0 ||
        dto.orderSetProcessOrderStatus.length != 0 ||
        (dto.processAssignStartDate != -1 && dto.processAssignEndDate != -1) ||
        (dto.processWorkCompletedStartDate != -1 &&
          dto.processWorkCompletedEndDate != -1) ||
        (dto.processWorkStartDate != -1 && dto.processWorkEndDate != -1)
      ) {
        var mongoWorkerIdsArray = [];
        dto.orderSetProcessWorkerIds.forEach((eachItem) => {
          mongoWorkerIdsArray.push(new mongoose.Types.ObjectId(eachItem));
        });
        const orderSaleSetProcessPipeline = () => {
          const pipeline = [];
          pipeline.push({
            $match: {
              _status: 1,
              $expr: { $eq: ['$_orderSaleId', '$$orderSaleId'] },
            },
          });
          if (dto.orderSetProcessWorkerIds.length != 0) {
            pipeline.push({
              $match: {
                _userId: { $in: mongoWorkerIdsArray },
              },
            });
          }
          if (dto.orderSetProcessOrderStatus.length != 0) {
            pipeline.push({
              $match: {
                _orderStatus: { $in: dto.orderSetProcessOrderStatus },
              },
            });
          }

          if (
            dto.processAssignStartDate != -1 &&
            dto.processAssignEndDate != -1
          ) {
            pipeline.push({
              $match: {
                _workAssignedTime: {
                  $gte: dto.processAssignStartDate,
                  $lte: dto.processAssignEndDate,
                },
              },
            });
          }

          if (
            dto.processWorkCompletedStartDate != -1 &&
            dto.processWorkCompletedEndDate != -1
          ) {
            pipeline.push({
              $match: {
                _workCompletedTime: {
                  $gte: dto.processWorkCompletedStartDate,
                  $lte: dto.processWorkCompletedEndDate,
                },
              },
            });
          }

          if (dto.processWorkStartDate != -1 && dto.processWorkEndDate != -1) {
            pipeline.push({
              $match: {
                _workStartedTime: {
                  $gte: dto.processWorkStartDate,
                  $lte: dto.processWorkEndDate,
                },
              },
            });
          }

          pipeline.push({ $project: { _id: 1 } });
          return pipeline;
        };

        arrayAggregation.push(
          {
            $lookup: {
              from: ModelNames.ORDER_SALE_SET_PROCESSES,
              let: { orderSaleId: '$_id' },
              pipeline: orderSaleSetProcessPipeline(),
              as: 'mongoCheckWorkerWithWorkStatus',
            },
          },
          {
            $match: { mongoCheckWorkerWithWorkStatus: { $ne: [] } },
          },
        );
      }

      if (dto.subCategoryIds.length > 0) {
        var newSettingsId = [];
        dto.subCategoryIds.map((mapItem) => {
          newSettingsId.push(new mongoose.Types.ObjectId(mapItem));
        });
        arrayAggregation.push(
          {
            $lookup: {
              from: ModelNames.ORDER_SALES_ITEMS,
              let: { orderId: '$_id' },
              pipeline: [
                {
                  $match: {
                    _status: 1,
                    $expr: { $eq: ['$_orderSaleId', '$$orderId'] },
                  },
                },
                {
                  $match: {
                    _subCategoryId: { $in: newSettingsId },
                  },
                },
                {
                  $project: {
                    _id: 1,
                  },
                },
              ],
              as: 'mongoCheckSubItems',
            },
          },
          {
            $match: { mongoCheckSubItems: { $ne: [] } },
          },
        );
      }

      if (dto.setProcessOrderStatus.length != 0) {
        arrayAggregation.push(
          {
            $lookup: {
              from: ModelNames.ORDER_SALE_SET_PROCESSES,
              let: { orderId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$_orderSaleId', '$$orderId'] },
                  },
                },
                {
                  $match: {
                    _orderStatus: { $in: dto.setProcessOrderStatus },
                  },
                },
                {
                  $project: {
                    _id: 1,
                  },
                },
              ],
              as: 'mongoCheckSetProcessList',
            },
          },
          {
            $match: { mongoCheckSetProcessList: { $ne: [] } },
          },
        );
      }

      arrayAggregation.push({ $match: { _status: { $in: dto.statusArray } } });

      switch (dto.sortType) {
        case 0:
          arrayAggregation.push({ $sort: { _id: dto.sortOrder } });
          break;
        case 1:
          arrayAggregation.push({
            $sort: { _status: dto.sortOrder, _id: dto.sortOrder },
          });
          break;
        case 2:
          arrayAggregation.push({
            $sort: { _dueDate: dto.sortOrder, _id: dto.sortOrder },
          });
          break;
      }

      arrayAggregation.push(
        new ModelWeightResponseFormat().orderSaleMainTableResponseFormat(
          0,
          dto.responseFormat,
        ),
      );

      //imp
      if (dto.agingStartCount != -1 || dto.agingEndCount != -1) {
        arrayAggregation[arrayAggregation.length - 1].$project.aging = {
          $dateDiff: {
            startDate: { $toDate: '$_createdAt' },
            endDate: { $toDate: dateTime },
            unit: 'day',
          },
        };

        arrayAggregation.push({ $match: { _workStatus: { $ne: 35 } } });

        if (dto.agingStartCount != -1) {
          arrayAggregation.push({
            $match: {
              aging: { $gte: dto.agingStartCount },
            },
          });
        }
        if (dto.agingEndCount != -1) {
          arrayAggregation.push({
            $match: {
              aging: { $lte: dto.agingEndCount },
            },
          });
        }
      }

      if (dto.skip != -1) {
        arrayAggregation.push({ $skip: dto.skip });
        arrayAggregation.push({ $limit: dto.limit });
      }

      const isorderSaleSetProcess = dto.screenType.includes(105);
      const isorderSaleSetProcessPipeline = () => {
        const orderSaleSetProcessUserPipeline = () => {
          const pipeline = [];
          pipeline.push(
            {
              $match: {
                $expr: { $eq: ['$_id', '$$userId'] },
              },
            },
            new ModelWeightResponseFormat().userTableResponseFormat(
              1090,
              dto.responseFormat,
            ),
          );

          const isorderSaleSetProcessUserGlobalGallery =
            dto.screenType.includes(110);
          if (isorderSaleSetProcessUserGlobalGallery) {
            pipeline.push(
              {
                $lookup: {
                  from: ModelNames.GLOBAL_GALLERIES,
                  let: { globalGalleryId: '$_globalGalleryId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$globalGalleryId'] },
                      },
                    },
                    new ModelWeightResponseFormat().globalGalleryTableResponseFormat(
                      1100,
                      dto.responseFormat,
                    ),
                  ],
                  as: 'globalGalleryDetails',
                },
              },
              {
                $unwind: {
                  path: '$globalGalleryDetails',
                  preserveNullAndEmptyArrays: true,
                },
              },
            );
          }
          return pipeline;
        };

        const pipeline = [];
        pipeline.push({
          $match: {
            _status: 1,
            $expr: { $eq: ['$_orderSaleId', '$$orderSaleSetProcess'] },
          },
        });

        pipeline.push(
          new ModelWeightResponseFormat().orderSaleSetProcessTableResponseFormat(
            1050,
            dto.responseFormat,
          ),
        );
        const isorderSaleSetProcessProcessMaster = dto.screenType.includes(108);
        if (isorderSaleSetProcessProcessMaster) {
          pipeline.push(
            {
              $lookup: {
                from: ModelNames.PROCESS_MASTER,
                let: { processId: '$_processId' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', '$$processId'] } } },
                  new ModelWeightResponseFormat().processMasterTableResponseFormat(
                    1080,
                    dto.responseFormat,
                  ),
                ],
                as: 'processDetails',
              },
            },
            {
              $unwind: {
                path: '$processDetails',
                preserveNullAndEmptyArrays: true,
              },
            },
          );

          const isorderSaleSetProcessUser = dto.screenType.includes(109);
          if (isorderSaleSetProcessUser) {
            pipeline.push(
              {
                $lookup: {
                  from: ModelNames.USER,
                  let: { userId: '$_userId' },
                  pipeline: orderSaleSetProcessUserPipeline(),
                  as: 'userDetails',
                },
              },
              {
                $unwind: {
                  path: '$userDetails',
                  preserveNullAndEmptyArrays: true,
                },
              },
            );
          }
        }

        const isorderSaleSetSubProcess = dto.screenType.includes(110);
        if (isorderSaleSetSubProcess) {
          const isorderSaleSetProcessPipeline = () => {
            const pipeline = [];
            pipeline.push(
              {
                $match: {
                  _status: 1,
                  $expr: {
                    $eq: ['$_orderSaleSetProcessId', '$$setProcess'],
                  },
                },
              },
              new ModelWeightResponseFormat().orderSaleSetSubProcessTableResponseFormat(
                1100,
                dto.responseFormat,
              ),
            );
            const isorderSaleSetSubProcessMaster = dto.screenType.includes(111);
            if (isorderSaleSetSubProcessMaster) {
              pipeline.push(
                {
                  $lookup: {
                    from: ModelNames.SUB_PROCESS_MASTER,
                    let: { processId: '$_subProcessId' },
                    pipeline: [
                      {
                        $match: { $expr: { $eq: ['$_id', '$$processId'] } },
                      },
                      new ModelWeightResponseFormat().subProcessMasterTableResponseFormat(
                        1110,
                        dto.responseFormat,
                      ),
                    ],
                    as: 'subProcessDetails',
                  },
                },
                {
                  $unwind: {
                    path: '$subProcessDetails',
                    preserveNullAndEmptyArrays: true,
                  },
                },
              );
            }
            const isorderSaleSetSubProcessUserPopulate =
              dto.screenType.includes(112);
            if (isorderSaleSetSubProcessUserPopulate) {
              const orderSaleSetSubProcessUserPipeline = () => {
                const pipeline = [];
                pipeline.push(
                  {
                    $match: {
                      $expr: { $eq: ['$_id', '$$userId'] },
                    },
                  },
                  new ModelWeightResponseFormat().userTableResponseFormat(
                    1120,
                    dto.responseFormat,
                  ),
                );

                const isorderSaleSetSubProcessUserGlobalGalleryPopulate =
                  dto.screenType.includes(113);
                if (isorderSaleSetSubProcessUserGlobalGalleryPopulate) {
                  pipeline.push(
                    {
                      $lookup: {
                        from: ModelNames.GLOBAL_GALLERIES,
                        let: { globalGalleryId: '$_globalGalleryId' },
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $eq: ['$_id', '$$globalGalleryId'],
                              },
                            },
                          },

                          new ModelWeightResponseFormat().globalGalleryTableResponseFormat(
                            1130,
                            dto.responseFormat,
                          ),
                        ],
                        as: 'globalGalleryDetails',
                      },
                    },
                    {
                      $unwind: {
                        path: '$globalGalleryDetails',
                        preserveNullAndEmptyArrays: true,
                      },
                    },
                  );
                }
                return pipeline;
              };

              pipeline.push(
                {
                  $lookup: {
                    from: ModelNames.USER,
                    let: { userId: '$_userId' },
                    pipeline: orderSaleSetSubProcessUserPipeline(),
                    as: 'userDetails',
                  },
                },
                {
                  $unwind: {
                    path: '$userDetails',
                    preserveNullAndEmptyArrays: true,
                  },
                },
              );
            }

            return pipeline;
          };

          pipeline.push({
            $lookup: {
              from: ModelNames.ORDER_SALE_SET_SUB_PROCESSES,
              let: { setProcess: '$_id' },
              pipeline: isorderSaleSetProcessPipeline(),
              as: 'orderSaleSetSubProcessList',
            },
          });
        }

        return pipeline;
      };

      if (isorderSaleSetProcess) {
        arrayAggregation.push({
          $lookup: {
            from: ModelNames.ORDER_SALE_SET_PROCESSES,
            let: { orderSaleSetProcess: '$_id' },
            pipeline: isorderSaleSetProcessPipeline(),
            as: 'setProcessList',
          },
        });
      }
      if (dto.screenType.includes(120)) {
        const orderSaleShopOrderHeadPipeline = () => {
          const pipeline = [];
          pipeline.push(
            {
              $match: {
                $expr: { $eq: ['$_id', '$$userId'] },
              },
            },
            new ModelWeightResponseFormat().userTableResponseFormat(
              1200,
              dto.responseFormat,
            ),
          );
          if (dto.screenType.includes(121)) {
            pipeline.push(
              {
                $lookup: {
                  from: ModelNames.GLOBAL_GALLERIES,
                  let: { globalGalleryId: '$_globalGalleryId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$_id', '$$globalGalleryId'],
                        },
                      },
                    },
                    new ModelWeightResponseFormat().globalGalleryTableResponseFormat(
                      1210,
                      dto.responseFormat,
                    ),
                  ],
                  as: 'globalGalleryDetails',
                },
              },
              {
                $unwind: {
                  path: '$globalGalleryDetails',
                  preserveNullAndEmptyArrays: true,
                },
              },
            );
          }
          return pipeline;
        };
        arrayAggregation.push(
          {
            $lookup: {
              from: ModelNames.USER,
              let: { userId: '$_orderHeadId' },
              pipeline: orderSaleShopOrderHeadPipeline(),
              as: 'orderHeadDetails',
            },
          },
          {
            $unwind: {
              path: '$orderHeadDetails',
              preserveNullAndEmptyArrays: true,
            },
          },
        );
      }
      if (dto.screenType.includes(103)) {
        arrayAggregation.push(
          {
            $lookup: {
              from: ModelNames.ROOT_CAUSES,
              let: { rootCauseId: '$_rootCauseId' },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$rootCauseId'] } } },
                new ModelWeightResponseFormat().rootcauseTableResponseFormat(
                  1030,
                  dto.responseFormat,
                ),
              ],
              as: 'rootCauseDetails',
            },
          },
          {
            $unwind: {
              path: '$rootCauseDetails',
              preserveNullAndEmptyArrays: true,
            },
          },
        );
      }
      const isorderSaleHistories = dto.screenType.includes(104);

      if (isorderSaleHistories) {
        const orderSaleHistoriesPipeline = () => {
          const pipeline = [];

          pipeline.push(
            {
              $match: {
                _status: 1,
                $expr: {
                  $eq: ['$_orderSaleId', '$$orderSaleId'],
                },
              },
            },
            new ModelWeightResponseFormat().orderSaleHistoryTableResponseFormat(
              1040,
              dto.responseFormat,
            ),
          );

          const isorderSaleHistoriesDeliveryProvider =
            dto.screenType.includes(133);
          if (isorderSaleHistoriesDeliveryProvider) {
            pipeline.push(
              {
                $lookup: {
                  from: ModelNames.DELIVERY_PROVIDER,
                  let: { deliveryProviderId: '$_deliveryProviderId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$deliveryProviderId'] },
                      },
                    },
                    new ModelWeightResponseFormat().deliveryProviderTableResponseFormat(
                      1330,
                      dto.responseFormat,
                    ),
                  ],
                  as: 'deliveryProviderDetails',
                },
              },
              {
                $unwind: {
                  path: '$deliveryProviderDetails',
                  preserveNullAndEmptyArrays: true,
                },
              },
            );
          }

          const isorderSaleHistoriesUser = dto.screenType.includes(114);

          if (isorderSaleHistoriesUser) {
            const orderSaleHistoriesUserPipeline = () => {
              const pipeline = [];
              pipeline.push(
                { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
                new ModelWeightResponseFormat().userTableResponseFormat(
                  1140,
                  dto.responseFormat,
                ),
              );

              const isorderSaleHistoriesUserGlobalGallery =
                dto.screenType.includes(115);
              if (isorderSaleHistoriesUserGlobalGallery) {
                pipeline.push(
                  {
                    $lookup: {
                      from: ModelNames.GLOBAL_GALLERIES,
                      let: { globalGalleryId: '$_globalGalleryId' },
                      pipeline: [
                        {
                          $match: {
                            $expr: { $eq: ['$_id', '$$globalGalleryId'] },
                          },
                        },
                        new ModelWeightResponseFormat().globalGalleryTableResponseFormat(
                          1150,
                          dto.responseFormat,
                        ),
                      ],
                      as: 'globalGalleryDetails',
                    },
                  },
                  {
                    $unwind: {
                      path: '$globalGalleryDetails',
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                );
              }

              return pipeline;
            };

            pipeline.push(
              {
                $lookup: {
                  from: ModelNames.USER,
                  let: { userId: '$_userId' },
                  pipeline: orderSaleHistoriesUserPipeline(),
                  as: 'userDetails',
                },
              },
              {
                $unwind: {
                  path: '$userDetails',
                  preserveNullAndEmptyArrays: true,
                },
              },
            );

            const isorderSaleHistoriescreatedUser =
              dto.screenType.includes(116);
            if (isorderSaleHistoriescreatedUser) {
              const orderSaleHistoriesCreatedUserUserPipeline = () => {
                const pipeline = [];
                pipeline.push(
                  { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },

                  new ModelWeightResponseFormat().userTableResponseFormat(
                    1160,
                    dto.responseFormat,
                  ),
                );
                const isorderSaleHistoriescreatedUserGlobalGallery =
                  dto.screenType.includes(117);
                if (isorderSaleHistoriescreatedUserGlobalGallery) {
                  pipeline.push(
                    {
                      $lookup: {
                        from: ModelNames.GLOBAL_GALLERIES,
                        let: { globalGalleryId: '$_globalGalleryId' },
                        pipeline: [
                          {
                            $match: {
                              $expr: { $eq: ['$_id', '$$globalGalleryId'] },
                            },
                          },
                          new ModelWeightResponseFormat().globalGalleryTableResponseFormat(
                            1170,
                            dto.responseFormat,
                          ),
                        ],
                        as: 'globalGalleryDetails',
                      },
                    },
                    {
                      $unwind: {
                        path: '$globalGalleryDetails',
                        preserveNullAndEmptyArrays: true,
                      },
                    },
                  );
                }
                return pipeline;
              };

              pipeline.push(
                {
                  $lookup: {
                    from: ModelNames.USER,
                    let: { userId: '$_createdUserId' },
                    pipeline: orderSaleHistoriesCreatedUserUserPipeline(),
                    as: 'createdUserDetails',
                  },
                },
                {
                  $unwind: {
                    path: '$createdUserDetails',
                    preserveNullAndEmptyArrays: true,
                  },
                },
              );
            }
          }
          return pipeline;
        };

        arrayAggregation.push({
          $lookup: {
            from: ModelNames.ORDER_SALE_HISTORIES,
            let: { orderSaleId: '$_id' },
            pipeline: orderSaleHistoriesPipeline(),
            as: 'orderSaleHistories',
          },
        });
      }

      const isorderSaledocuments = dto.screenType.includes(101);

      if (isorderSaledocuments) {
        const orderSaleDocumentsPipeline = () => {
          const pipeline = [];
          pipeline.push(
            {
              $match: {
                _status: 1,
                $expr: { $eq: ['$_orderSaleId', '$$orderSaleIdId'] },
              },
            },
            new ModelWeightResponseFormat().orderSaleDocumentsTableResponseFormat(
              1010,
              dto.responseFormat,
            ),
          );

          const isorderSaledocumentsGlobalGallery =
            dto.screenType.includes(118);

          if (isorderSaledocumentsGlobalGallery) {
            pipeline.push(
              {
                $lookup: {
                  from: ModelNames.GLOBAL_GALLERIES,
                  let: { globalGalleryId: '$_globalGalleryId' },
                  pipeline: [
                    {
                      $match: { $expr: { $eq: ['$_id', '$$globalGalleryId'] } },
                    },

                    new ModelWeightResponseFormat().globalGalleryTableResponseFormat(
                      1180,
                      dto.responseFormat,
                    ),
                  ],
                  as: 'globalGalleryDetails',
                },
              },
              {
                $unwind: {
                  path: '$globalGalleryDetails',
                  preserveNullAndEmptyArrays: true,
                },
              },
            );
          }
          return pipeline;
        };

        arrayAggregation.push({
          $lookup: {
            from: ModelNames.ORDER_SALES_DOCUMENTS,
            let: { orderSaleIdId: '$_id' },
            pipeline: orderSaleDocumentsPipeline(),
            as: 'orderSaleDocumentList',
          },
        });
      }

      const isorderSaleshop = dto.screenType.includes(102);

      if (isorderSaleshop) {
        const orderSaleShopPipeline = () => {
          const pipeline = [];
          pipeline.push(
            { $match: { $expr: { $eq: ['$_id', '$$shopId'] } } },
            new ModelWeightResponseFormat().shopTableResponseFormat(
              1020,
              dto.responseFormat,
            ),
          );
          const isorderSaleshopGlobalGallery = dto.screenType.includes(119);
          if (isorderSaleshopGlobalGallery) {
            pipeline.push(
              {
                $lookup: {
                  from: ModelNames.GLOBAL_GALLERIES,
                  let: { globalGalleryId: '$_globalGalleryId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$globalGalleryId'] },
                      },
                    },
                    new ModelWeightResponseFormat().globalGalleryTableResponseFormat(
                      1190,
                      dto.responseFormat,
                    ),
                  ],
                  as: 'globalGalleryDetails',
                },
              },
              {
                $unwind: {
                  path: '$globalGalleryDetails',
                  preserveNullAndEmptyArrays: true,
                },
              },
            );
          }

          const isorderSaleshopCity = dto.screenType.includes(134);
          if (isorderSaleshopCity) {
            pipeline.push(
              {
                $lookup: {
                  from: ModelNames.CITIES,
                  let: { cityId: '$_cityId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$cityId'] },
                      },
                    },
                    new ModelWeightResponseFormat().cityTableResponseFormat(
                      1340,
                      dto.responseFormat,
                    ),
                  ],
                  as: 'cityDetails',
                },
              },
              {
                $unwind: {
                  path: '$cityDetails',
                  preserveNullAndEmptyArrays: true,
                },
              },
            );
          }

          const isorderSaleshopBranch = dto.screenType.includes(130);
          if (isorderSaleshopBranch) {
            pipeline.push(
              {
                $lookup: {
                  from: ModelNames.BRANCHES,
                  let: { branchId: '$_branchId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$branchId'] },
                      },
                    },
                    new ModelWeightResponseFormat().branchTableResponseFormat(
                      1300,
                      dto.responseFormat,
                    ),
                  ],
                  as: 'branchDetails',
                },
              },
              {
                $unwind: {
                  path: '$branchDetails',
                  preserveNullAndEmptyArrays: true,
                },
              },
            );
          }

          const isorderSaleshopRelationshipManager =
            dto.screenType.includes(122);
          if (isorderSaleshopRelationshipManager) {
            const orderSaleShopOrderHeadPipeline = () => {
              const pipeline = [];
              pipeline.push(
                {
                  $match: {
                    $expr: { $eq: ['$_id', '$$userId'] },
                  },
                },
                new ModelWeightResponseFormat().userTableResponseFormat(
                  1220,
                  dto.responseFormat,
                ),
              );

              const isorderSaleshopRelationshipManagerGlobalGallery =
                dto.screenType.includes(123);
              if (isorderSaleshopRelationshipManagerGlobalGallery) {
                pipeline.push(
                  {
                    $lookup: {
                      from: ModelNames.GLOBAL_GALLERIES,
                      let: { globalGalleryId: '$_globalGalleryId' },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $eq: ['$_id', '$$globalGalleryId'],
                            },
                          },
                        },
                        new ModelWeightResponseFormat().globalGalleryTableResponseFormat(
                          1230,
                          dto.responseFormat,
                        ),
                      ],
                      as: 'globalGalleryDetails',
                    },
                  },
                  {
                    $unwind: {
                      path: '$globalGalleryDetails',
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                );
              }
              return pipeline;
            };
            pipeline.push(
              {
                $lookup: {
                  from: ModelNames.USER,
                  let: { userId: '$_relationshipManagerId' },
                  pipeline: orderSaleShopOrderHeadPipeline(),
                  as: 'relationshipManagerDetails',
                },
              },
              {
                $unwind: {
                  path: '$relationshipManagerDetails',
                  preserveNullAndEmptyArrays: true,
                },
              },
            );
          }

          return pipeline;
        };

        arrayAggregation.push(
          {
            $lookup: {
              from: ModelNames.SHOPS,
              let: { shopId: '$_shopId' },
              pipeline: orderSaleShopPipeline(),
              as: 'shopDetails',
            },
          },
          {
            $unwind: {
              path: '$shopDetails',
              preserveNullAndEmptyArrays: true,
            },
          },
        );
      }

      const isorderSaleItems = dto.screenType.includes(124);
      if (isorderSaleItems) {
        const orderSaleItemsPipeline = () => {
          const pipeline = [];
          pipeline.push(
            {
              $match: {
                _status: 1,
                $expr: { $eq: ['$_orderSaleId', '$$mainId'] },
              },
            },

            new ModelWeightResponseFormat().orderSaleItemsTableResponseFormat(
              1240,
              dto.responseFormat,
            ),
          );

          const isorderSalesItemsProduct = dto.screenType.includes(125);
          if (isorderSalesItemsProduct) {
            pipeline.push(
              {
                $lookup: {
                  from: ModelNames.PRODUCTS,
                  let: { productId: '$_productId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$_id', '$$productId'],
                        },
                      },
                    },
                    new ModelWeightResponseFormat().productTableResponseFormat(
                      1250,
                      dto.responseFormat,
                    ),
                  ],
                  as: 'productDetails',
                },
              },
              {
                $unwind: {
                  path: '$productDetails',
                  preserveNullAndEmptyArrays: true,
                },
              },
            );
          }

          const isorderSalesItemsInVoiceItems = dto.screenType.includes(131);
          if (isorderSalesItemsInVoiceItems) {
            const invoiceItemsPipeline = () => {
              const pipeline = [];
              pipeline.push(
                {
                  $match: {
                    _status: 1,
                    $expr: {
                      $eq: ['$_orderSaleItemId', '$$invoiceItemId'],
                    },
                  },
                },
                new ModelWeightResponseFormat().invoiceItemsTableResponseFormat(
                  1310,
                  dto.responseFormat,
                ),
              );

              const isorderSalesItemsInVoiceItemsInvoiceDetails =
                dto.screenType.includes(132);
              if (isorderSalesItemsInVoiceItemsInvoiceDetails) {
                const invoiceItemsDeliveryTempPipeline = () => {
                  const pipeline = [];

                  pipeline.push(
                    {
                      $match: {
                        $expr: {
                          $eq: ['$_id', '$$invoiceId'],
                        },
                      },
                    },
                    new ModelWeightResponseFormat().invoiceTableResponseFormat(
                      1320,
                      dto.responseFormat,
                    ),
                  );

                  const isorderSalesItemsInVoiceItemsInvoiceDeliveryTempDetails =
                    dto.screenType.includes(135);
                  if (isorderSalesItemsInVoiceItemsInvoiceDeliveryTempDetails) {
                    pipeline.push(
                      {
                        $lookup: {
                          from: ModelNames.DELIVERY_TEMP,
                          let: { invoiceDeliveryTempId: '$_id' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $eq: [
                                    '$_invoiceId',
                                    '$$invoiceDeliveryTempId',
                                  ],
                                },
                              },
                            },
                            new ModelWeightResponseFormat().deliveryTempTableResponseFormat(
                              1350,
                              dto.responseFormat,
                            ),
                          ],
                          as: 'deliveryTempDetails',
                        },
                      },
                      {
                        $unwind: {
                          path: '$deliveryTempDetails',
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                    );
                  }
                  return pipeline;
                };

                pipeline.push(
                  {
                    $lookup: {
                      from: ModelNames.INVOICES,
                      let: { invoiceId: '$_invoiceId' },
                      pipeline: invoiceItemsDeliveryTempPipeline(),
                      as: 'invoiceDetails',
                    },
                  },
                  {
                    $unwind: {
                      path: '$invoiceDetails',
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                );
              }

              return pipeline;
            };

            pipeline.push(
              {
                $lookup: {
                  from: ModelNames.INVOICE_ITEMS,
                  let: { invoiceItemId: '$_id' },
                  pipeline: invoiceItemsPipeline(),
                  as: 'invoiceItemDetails',
                },
              },
              {
                $unwind: {
                  path: '$invoiceItemDetails',
                  preserveNullAndEmptyArrays: true,
                },
              },
            );
          }

          const isorderSalesItemsDesign = dto.screenType.includes(126);
          if (isorderSalesItemsDesign) {
            pipeline.push(
              {
                $lookup: {
                  from: ModelNames.PRODUCTS,
                  let: { designId: '$_designId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$_id', '$$designId'],
                        },
                      },
                    },
                    new ModelWeightResponseFormat().productTableResponseFormat(
                      1260,
                      dto.responseFormat,
                    ),
                  ],
                  as: 'designDetails',
                },
              },
              {
                $unwind: {
                  path: '$designDetails',
                  preserveNullAndEmptyArrays: true,
                },
              },
            );
          }

          const isorderSalesItemsSubCategory = dto.screenType.includes(127);
          if (isorderSalesItemsSubCategory) {
            const orderSaleSubCategoryPipeline = () => {
              const pipeline = [];
              pipeline.push(
                {
                  $match: {
                    $expr: {
                      $eq: ['$_id', '$$subCategoryId'],
                    },
                  },
                },
                new ModelWeightResponseFormat().subCategoryTableResponseFormat(
                  1270,
                  dto.responseFormat,
                ),
              );

              const isorderSalesItemsSubCategoryCategory =
                dto.screenType.includes(128);
              if (isorderSalesItemsSubCategoryCategory) {
                const orderSaleSubCategoryPipeline = () => {
                  const pipeline = [];
                  pipeline.push(
                    {
                      $match: {
                        $expr: {
                          $eq: ['$_id', '$$categoryId'],
                        },
                      },
                    },
                    new ModelWeightResponseFormat().categoryTableResponseFormat(
                      1280,
                      dto.responseFormat,
                    ),
                  );

                  const isorderSalesItemsSubCategoryCategoryGroup =
                    dto.screenType.includes(129);
                  if (isorderSalesItemsSubCategoryCategoryGroup) {
                    pipeline.push(
                      {
                        $lookup: {
                          from: ModelNames.GROUP_MASTERS,
                          let: { groupId: '$_groupId' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $eq: ['$_id', '$$groupId'],
                                },
                              },
                            },
                            new ModelWeightResponseFormat().groupMasterTableResponseFormat(
                              1290,
                              dto.responseFormat,
                            ),
                          ],
                          as: 'groupDetails',
                        },
                      },
                      {
                        $unwind: {
                          path: '$groupDetails',
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                    );
                  }

                  return pipeline;
                };

                pipeline.push(
                  {
                    $lookup: {
                      from: ModelNames.CATEGORIES,
                      let: { categoryId: '$_categoryId' },
                      pipeline: orderSaleSubCategoryPipeline(),
                      as: 'categoryDetails',
                    },
                  },
                  {
                    $unwind: {
                      path: '$categoryDetails',
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                );
              }

              return pipeline;
            };

            pipeline.push(
              {
                $lookup: {
                  from: ModelNames.SUB_CATEGORIES,
                  let: { subCategoryId: '$_subCategoryId' },
                  pipeline: orderSaleSubCategoryPipeline(),
                  as: 'subCategoryDetails',
                },
              },
              {
                $unwind: {
                  path: '$subCategoryDetails',
                  preserveNullAndEmptyArrays: true,
                },
              },
            );
          }

          return pipeline;
        };

        arrayAggregation.push({
          $lookup: {
            from: ModelNames.ORDER_SALES_ITEMS,
            let: { mainId: '$_id' },
            pipeline: orderSaleItemsPipeline(),
            as: 'orderItemsList',
          },
        });
      }

      var resultWorkets = [];
      var resultProcessMasters = [];
      var resultSubCategory = [];

      if (dto.screenType.includes(107)) {
        var resultDepartment = await this.departmentModel.find({
          _code: 1003,
          _status: 1,
        });
        if (resultDepartment.length == 0) {
          throw new HttpException(
            'Department not found',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        resultWorkets = await this.employeeModel.aggregate([
          {
            $match: {
              _departmentId: new mongoose.Types.ObjectId(
                resultDepartment[0]._id,
              ),
              _status: 1,
            },
          },

          {
            $project: {
              _id: 1,
              _name: 1,
              _email: 1,
              _mobile: 1,
              _uid: 1,
              _globalGalleryId: 1,
              _processMasterId: 1,
            },
          },
          {
            $lookup: {
              from: ModelNames.GLOBAL_GALLERIES,
              let: { globalGalleryId: '$_globalGalleryId' },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$globalGalleryId'] } } },
              ],
              as: 'globalGalleryDetails',
            },
          },
          {
            $unwind: {
              path: '$globalGalleryDetails',
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: ModelNames.USER,
              let: { employeeId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$_employeeId', '$$employeeId'] },
                  },
                },
              ],
              as: 'userDetails',
            },
          },
          {
            $unwind: {
              path: '$userDetails',
              preserveNullAndEmptyArrays: true,
            },
          },
        ]);
      }
      if (dto.screenType.includes(100)) {
        resultProcessMasters = await this.processMasterModel.find({
          _status: 1,
        });
      }

      var result = await this.orderSaleMainModel
        .aggregate(arrayAggregation)
        .session(transactionSession);

      var totalCount = 0;
      if (dto.screenType.includes(0)) {
        //Get total count
        var limitIndexCount = arrayAggregation.findIndex(
          (it) => it.hasOwnProperty('$limit') === true,
        );
        if (limitIndexCount != -1) {
          arrayAggregation.splice(limitIndexCount, 1);
        }
        var skipIndexCount = arrayAggregation.findIndex(
          (it) => it.hasOwnProperty('$skip') === true,
        );
        if (skipIndexCount != -1) {
          arrayAggregation.splice(skipIndexCount, 1);
        }
        arrayAggregation.push({
          $group: { _id: null, totalCount: { $sum: 1 } },
        });

        var resultTotalCount = await this.orderSaleMainModel
          .aggregate(arrayAggregation)
          .session(transactionSession);
        if (resultTotalCount.length > 0) {
          totalCount = resultTotalCount[0].totalCount;
        }
      }

      if (dto.screenType.includes(500)) {
        var pipeline = [];
        pipeline.push({
          $match: {
            _status: 1,
          },
        });
        pipeline.push(
          new ModelWeightResponseFormat().subCategoryTableResponseFormat(
            5000,
            dto.responseFormat,
          ),
        );

        resultSubCategory = await this.subCategoryModel.aggregate(pipeline);
      }
      var generalSetting = [];
      if (dto.screenType.includes(501)) {
        generalSetting = await this.generalsModel.aggregate([
          {
            $match: {
              _code: 1022,
            },
          },
        ]);
      }

      const responseJSON = {
        message: 'success',
        data: {
          list: result,
          totalCount: totalCount,
          workers: resultWorkets,
          processMasters: resultProcessMasters,
          subCategory: resultSubCategory,
          generalSetting: generalSetting,
        },
      };
  
      await transactionSession.commitTransaction();
      await transactionSession.endSession();
      return responseJSON;
    } catch (error) {
      await transactionSession.abortTransaction();
      await transactionSession.endSession();
      throw error;
    }
  }
}
