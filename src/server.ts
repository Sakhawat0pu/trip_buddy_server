import { Server } from "http";
import app from "./app";
import config from "./app/config";

// Declare a variable to hold the server instance
let server: Server;

// Define an asynchronous function named main to start the server
async function main() {
	try {
		// Start the server and listen on the specified port
		server = app.listen(config.port, () => {
			console.log(`Listening on port ${config.port}`);
		});
	} catch (err) {
		// Handle any errors that occur during server startup
		console.log(err);
	}
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
