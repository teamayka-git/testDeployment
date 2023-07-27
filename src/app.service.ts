import { Injectable } from '@nestjs/common';
import * as process from 'node:process';


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Worldd!';
  }
  async testParallelLog() {
    console.log('testParallelLog start');

    var dateTime = new Date().getTime();
    try {
      const responseJSON = {
        message: 'success log',
        data: {},
      };

      console.log('testParallelLog end');

      return responseJSON;
    } catch (error) {
      throw error;
    }
  }
  async testParallelBulk() {
    console.log('testParallelBulk start');
    var dateTime = new Date().getTime();
    try {
      for (var i = 0; i < 3000000000; i++) {
        if (i % 1000000 == 0) {
          console.log(`testParallelBulk doing ${i}`);
        }
      }

      const responseJSON = {
        message: 'success bulk',
        data: {},
      };

      console.log('testParallelBulk end');

      return responseJSON;
    } catch (error) {
      throw error;
    }
  }

  
  async getCpuCount() {
    var dateTime = new Date().getTime();
    try {
   
const numCPUs = parseInt(process.argv[2] || "1");

      const responseJSON = {
        message: `success cpu count :${numCPUs}`,
        data: {},
      };

      

      return responseJSON;
    } catch (error) {
      throw error;
    }
  }
}
