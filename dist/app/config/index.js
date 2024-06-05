"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from the .env file located in the project root directory
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
// Export an object containing the configuration properties
exports.default = {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    bcrypt_salt_round: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    jwt_refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    reset_password_secret: process.env.RESET_PASSWORD_SECRET,
    reset_password_token_expires_in: process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN,
    frontend_base_uri: process.env.FRONTEND_BASE_URI,
    email_address: process.env.EMAIL_ADDRESS,
    app_pass: process.env.APP_PASS,
    super_admin_email_address: process.env.SUPER_ADMIN_EMAIL_ADDRESS,
    super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
    super_admin_name: process.env.SUPER_ADMIN_NAME,
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
