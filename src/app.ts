import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import config from "./app/config";

// Create an instance of Express application
const app: Application = express();
//http://localhost:3000
// https://ct-travel-buddy.netlify.app
// Middleware to parse incoming JSON and text requests
app.use(express.json());
app.use(express.text());
// Middleware to parse incoming URL-encoded requests
app.use(express.urlencoded({ extended: true }));
// Middleware to enable Cross-Origin Resource Sharing (CORS) with credentials support
app.use(
	cors({ origin: "https://ct-travel-buddy.netlify.app", credentials: true })
);
// Middleware to parse cookies from incoming requests
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
	res.json({ message: "A travel buddy matching server" });
});

// Mounting the router middleware at the /api base path
app.use("/api", router);

// Middleware to handle global errors
app.use(globalErrorHandler);
// Middleware to handle 404 Not Found errors
app.use(notFound);

export default app;
