import * as nodemailer from 'nodemailer';

// export enum GlobalConfig {
// }
export const GlobalConfig = () => ({
  JWT_SECRET_KEY: String(process.env.JWT_SECRET_KEY),
  // THUMB_SIZE: Number(process.env.THUMB_SIZE),
  // PORT_CHAT_SOCKET: Number(process.env.PORT_CHAT_SOCKET),
  // DUMMY_MONGODB_ID: '0000000F000F0F00000FFFF0',
  // DEFAULT_EMAIL_TRANSPORTER: nodemailer.createTransport({
  //   service: process.env.DEFAULT_EMAIL_SERVICE, //smtp.gmail.com  //in place of service use host...
  //   secure: false, //true
  //   port: Number(process.env.DEFAULT_EMAIL_PORT), //465
  //   auth: {
  //     user: process.env.DEFAULT_EMAIL_ID,
  //     pass: process.env.DEFAULT_EMAIL_PASS,
  //   },
  //   tls: {
  //     rejectUnauthorized: false,
  //   },
  // }),

  // TWILIO_SMS_GATEWAY_ACCOUNT_SID: String(
  //   process.env.TWILIO_SMS_GATEWAY_ACCOUNT_SID,
  // ),
  // TWILIO_SMS_GATEWAY_AUTH_TOKEN: String(
  //   process.env.TWILIO_SMS_GATEWAY_AUTH_TOKEN,
  // ),
  // TWILIO_SMS_GATEWAY_SERVICE_SID: String(
  //   process.env.TWILIO_SMS_GATEWAY_SERVICE_SID,
  // ),
  // FIREBASE_FCM_SERVER_KEY: String(process.env.FIREBASE_FCM_SERVER_KEY),

  // RESPONSE_RESTRICT_DEFAULT_COUNT: 20000,
  // RESPONSE_RESTRICT_RESPONSE: 'Response restrict count exceeded, ',

  // SUPER_ADMIN_PERMISSIONS: [
  //   '4!A#4?2',
  //   '4!B#4',
  //   '4!C#1?2?4',
  //   '2#1?2?3?4',
  //   '1!A#1?2?3?4',
  //   '1!B#1?2?3?4',
  //   '1!C#1?2?3?4',
  //   '1!D#1?2?3?4',
  //   '1!E#1?2?3?4',
  //   '1!F#1?2?3?4',
  //   '1!G#1?2?3?4',
  //   '1!H#1?2?3?4',
  //   '1!I#1?2?3?4',
  //   '1!J#1?2?3?4',
  //   '1!K#1?2?3?4',
  //   '1!L#1?2?3?4',
  //   '1!M#1?2?3?4',
  //   '1!N#1?2?3?4',
  //   '1!O#1?2?3?4',
  //   '1!P#1?2?3?4',
  //   '1!Q#1?2?3?4',
  //   '1!R#1?2?3?4',
  //   '1!S#1?2?3?4',
  //   '1!T#1?2?3?4',
  //   '1!V#1?2?3?4',
  //   '1!W#1?2?3?4',
  //   '1!X#1?2?3?4',
  //   '1!Y#1?2?3?4',
  //   '1!Z#1?2?3?4',
  //   '1!AA#1?2?3?4',
  //   '1!AB#1?2?3?4',
  //   '1!AC#1?2?3?4',
  //   '1!AE#1?2?3?4',
  //   '1!AF#19?4',
  //   '12#1?11?13?12?4',
  //   '5#5',
  //   '10#6?7?8?9?10?4',
  //   '11#1?4',
  //   '9#1?18?14?15?16?17',
  //   '8#2?4',
  //   '3#1?2?3?4',
  //   '7#2?4',
  //   '6#2?4',
  //   '14#19',
  // ],
});
