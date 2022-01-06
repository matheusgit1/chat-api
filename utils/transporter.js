const nodemailer = require("nodemailer")
const mailConfig = require("./mailConfig.json")

var transport = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  auth: {
    user: mailConfig.auth.user,
    pass: mailConfig.auth.pass
  }
});

module.exports = transport