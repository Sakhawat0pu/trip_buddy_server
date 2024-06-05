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
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
// Declare a variable to hold the server instance
let server;
// Define an asynchronous function named main to start the server
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Start the server and listen on the specified port
            server = app_1.default.listen(config_1.default.port, () => {
                console.log(`Listening on port ${config_1.default.port}`);
            });
        }
        catch (err) {
            // Handle any errors that occur during server startup
            console.log(err);
        }
    });
}
main();
// Handle unhandled promise rejections
process.on("unhandledRejection", () => {
    console.log("Unhandled Rejection detected. The server is closing...");
    // Close the server gracefully and exit the process
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// Handle uncaught exceptions
process.on("uncaughtException", () => {
    console.log("Uncaught Exception detected. The server is closing...");
    // Exit the process
    process.exit(1);
});
