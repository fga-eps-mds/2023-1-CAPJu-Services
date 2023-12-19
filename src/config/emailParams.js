import 'dotenv/config';

export const emailParams = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.CAPJU_EMAIL_PASSWORD,
  },
};
