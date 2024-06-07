"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Create an instance of Express application
const app = (0, express_1.default)();
// Middleware to parse incoming JSON and text requests
app.use(express_1.default.json());
app.use(express_1.default.text());
// Middleware to parse incoming URL-encoded requests
app.use(express_1.default.urlencoded({ extended: true }));
// Middleware to enable Cross-Origin Resource Sharing (CORS) with credentials support
app.use((0, cors_1.default)({
    origin: "https://ct-trip-buddy.vercel.app",
    credentials: true,
}));
// Middleware to parse cookies from incoming requests
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.json({ message: "A travel buddy matching server" });
});
// Mounting the router middleware at the /api base path
app.use("/api", routes_1.default);
// Middleware to handle global errors
app.use(globalErrorHandler_1.default);
// Middleware to handle 404 Not Found errors
app.use(notFound_1.default);
exports.default = app;
