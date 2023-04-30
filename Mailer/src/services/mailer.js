import * as nodemailer from "nodemailer";
import path from "path";
import { QueryTypes } from "sequelize";
import { config } from "dotenv";
import { queryMailContents } from "../utils/queryMailContents.js";
import db from "../config/database.js";

config();

function formatDate(date) {
  date = new Date(date);
  var day = date.getDate().toString().padStart(2, "0");
  var month = (date.getMonth() + 1).toString().padStart(2, "0");
  var year = date.getFullYear();
  return day + "/" + month + "/" + year;
}

export async function getMailContents() {
  try {
    const mailContents = await db.connection.query(queryMailContents, {
      type: QueryTypes.SELECT,
    });
    return mailContents;
  } catch (error) {
    console.log(error);
    return {
      error,
      message: "Failed to query mail contents",
    };
  }
}

export async function sendEmail() {
  const emails = [];
  let process = [];
  let json;
  json = await getMailContents();
  const email_password = process.env.EMAIL_PASSWORD;

  if (json.length == 0) {
    console.log("No late processes.");
    return true;
  }
  if (!email_password) {
    console.log("CAPJU_EMAIL_PASSWORD is blank.");
    return false;
  }

  json.forEach((item) => {
    emails.push(item.email);
  });

  let emailFilter = emails.filter(
    (email, idx) => emails.indexOf(email) === idx
  );

  for (let i = 0; i < emails.length; i++) {
    json.forEach((item) => {
      if (emailFilter[i] === item.email) {
        process.push(item);
      }
    });

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: email_password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const __dirname = path.resolve();
    const message = {
      from: process.env.EMAIL_USER,
      to: emailFilter[i],
      subject: "CAPJU - relatório de processos atrasados",
      text: "Olá, esse é um e-mail automático para informar os processos atrasados.",
      html: `
              <!DOCTYPE html>
              <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
            <style type="text/css">
              * {
                box-sizing: border-box;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
              }
              body {
                font-family: Helvetica;
                -webkit-font-smoothing: antialiased;
              }
              h2 {
                text-align: center;
                font-size: 18px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: white;
                padding: 30px 0;
              }
              /* Table Styles */
              .table-wrapper {
                margin: 10px 70px 70px;
                box-shadow: 0px 35px 50px rgba(0, 0, 0, 0.2);
              }
              .fl-table {
                border-radius: 5px;
                font-size: 12px;
                font-weight: normal;
                border: none;
                border-collapse: collapse;
                width: 70%;
                max-width: 100%;
                white-space: nowrap;
                background-color: #f8f8f8;
              }
              .fl-table td,
              .fl-table th {
                text-align: center;
                padding: 8px;
              }
              .fl-table td {
                border-right: 1px solid #f8f8f8;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="table-wrapper">
              <p>Olá, segue a lista de processos atrasados até a data de envio deste e-mail.</p>
              <table class="fl-table">
                <thead>
                  <tr>
                    <th style="background: #363c7a; color: #ffffff">Fluxo</th>
                    <th style="background: #138f4a; color: #ffffff">Processo</th>
                    <th style="background: #363c7a; color: #ffffff">Etapa</th>
                    <th style="background: #138f4a; color: #ffffff">Data de inicio</th>
                    <th style="background: #363c7a; color: #ffffff">
                      Duração (em dias)
                    </th>
                    <th style="background: #138f4a; color: #ffffff">
                      Tempo atrasado (em dias)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${process
                    .map((flow) => {
                      return `
                    <tr>
                      <td>${flow.flow}</td>
                      <td>${flow.process_record}</td>
                      <td>${flow.stage}</td>
                      <td>${formatDate(flow.start_date)}</td>
                      <td>${flow.stage_duration}</td>
                      <td>${flow.delay_days}</td>
                    </tr>
                    `;
                    })
                    .join("")}
                </tbody>
              </table>
              <figure>
                <img style="width:130px" src="cid:capju" />
                <img style="width:130px" src="cid:UnB" />
                <img style="width:130px" src="cid:justica_federal" />
              </figure>
            </div>
          </body>
        </html>`,
      attachments: [
        {
          filename: "capju.png",
          path: __dirname + "/src/assets/capju.png",
          cid: "capju",
        },
        {
          filename: "justica_federal.png",
          path: __dirname + "/src/assets/justica_federal.png",
          cid: "justica_federal",
        },
        {
          filename: "UnB.png",
          path: __dirname + "/src/assets/UnB.png",
          cid: "UnB",
        },
      ],
    };
    try {
      transport.sendMail(message);
      process = [];
    } catch (err) {
      console.log("Error occurred. " + err.message);
      return false;
    }
  }
  return true;
}
