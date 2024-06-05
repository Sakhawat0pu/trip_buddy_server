"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendEmail = (to, html) => __awaiter(void 0, void 0, void 0, function* () {
    const passResetText = `
	Dear User,
	We received a request to reset the password for your account. If you initiated this request, please follow the instructions below to reset your password.
	Please click the link below:
`;
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com", // gmail host name
        port: 587,
        secure: config_1.default.node_env === "production",
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: config_1.default.email_address,
            pass: config_1.default.app_pass,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    yield transporter.sendMail({
        from: `"Health Care" <${config_1.default.email_address}>`, // sender address
        to, // list of receivers
        subject: "Please reset your password in 10 minutes", // Subject line
        text: passResetText, // plain text body
        html, // html body
    });
});
exports.sendEmail = sendEmail;
