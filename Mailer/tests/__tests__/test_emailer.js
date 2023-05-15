
import nodemailer from "nodemailer";
import db from "../../src/config/database.js";
const Mailer = require("../../src/services/mailer.js");
const mailer = new Mailer();


jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ success: true }),
  }),
}));

const mockGetMailContents = [
  {
    id_flow: 4,
    flow: "fluxo b",
    process_record: "testeemail",
    process: "123456",
    id_stage: 3,
    stage: "etapa c",
    start_date: "2023-01-21T01:06:14.465Z",
    stage_duration: 2,
    email: "pedrozinho@email.com\n",
    delay_days: "4",
  },
  {
    id_flow: 4,
    flow: "fluxo b",
    process_record: "testeemail",
    process: "123456",
    id_stage: 3,
    stage: "etapa c",
    start_date: "2023-01-21T01:06:14.465Z",
    stage_duration: 2,
    email: "pedro@email.com\n",
    delay_days: "4",
  },
  {
    id_flow: 4,
    flow: "fluxo b",
    process_record: "testeemail",
    process: "123456",
    id_stage: 3,
    stage: "etapa c",
    start_date: "2023-01-21T01:06:14.465Z",
    stage_duration: 2,
    email: "gdbbdb@email.com\n",
    delay_days: "4",
  },
];

const mockCreateTransport = jest.fn(() => ({
  sendMail: jest.fn(),
}));

beforeEach(() => {
  jest.resetModules();
});


jest.mock("../../src/config/database.js", () => {
  const connection = {
    query: jest.fn(),
  };

  return {
    connection,
  };
});

describe("getMailContents", () => {
  it("should return mail contents from the database", async () => {
    db.connection.query = jest.fn(() => mockGetMailContents);
    const result = await mailer.getMailContents();
    expect(result).toEqual(mockGetMailContents);
    expect(db.connection.query).toHaveBeenCalledTimes(1);
    expect(db.connection.query).toHaveBeenCalledWith(expect.any(String), {
      type: expect.anything(),
    });
  });

  it("should return an error object when failed to query mail contents", async () => {
    const mockError = new Error("Database connection failed");
    db.connection.query = jest.fn(() => {
      throw mockError;
    });
    const result = await mailer.getMailContents();
    expect(result).toEqual({
      error: mockError,
      message: "Failed to query mail contents",
    });
    expect(db.connection.query).toHaveBeenCalledTimes(1);
    expect(db.connection.query).toHaveBeenCalledWith(expect.any(String), {
      type: expect.anything(),
    });
  });
});

describe("Test for function sendEmail", () => {
  it("should send email correctly", async () => {
    const result = mailer.sendEmail();
    expect(result).toBeTruthy();
  });

  it("should log and return false if password is not set", async () => {
    process.env.EMAIL_PASSWORD = "";
    console.log = jest.fn();
    const result = await mailer.sendEmail();
    expect(console.log).toHaveBeenCalledWith("EMAIL_PASSWORD is blank.");
    expect(result).toBe(false);
    delete process.env.EMAIL_PASSWORD;
  });

  it('should return true when there are no late processes', async () => {
    db.connection.query = jest.fn(() => []);
    jest.spyOn(console, 'log').mockImplementation();

    const result = await mailer.sendEmail();

    expect(result).toBe(true);
    expect(console.log).toHaveBeenCalledWith('No late processes.');
  });
});
