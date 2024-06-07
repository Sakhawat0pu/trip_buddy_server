import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";

// Define types for origin and callback
type Origin = string | undefined;

type Callback = (err: Error | null, allow: boolean) => void;

interface CorsOptions {
	origin: (origin: Origin, callback: Callback) => void;
	credentials?: boolean;
}

// Create an instance of Express application
const app: Application = express();
//http://localhost:3000

// Middleware to parse incoming JSON and text requests
app.use(express.json());
app.use(express.text());
// Middleware to parse incoming URL-encoded requests
app.use(express.urlencoded({ extended: true }));
// Middleware to enable Cross-Origin Resource Sharing (CORS) with credentials support
// app.use(
// 	cors({
// 		origin: ["https://ct-trip-buddy.vercel.app"],
// 		credentials: true,
// 	})
// );
// List of allowed origins
const allowedOrigins = [
	"http://localhost:3000",
	"https://ct-trip-buddy.vercel.app",
];

// CORS options with types
const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		// `origin` will be a string representing the origin of the request or `undefined` if the request has no origin header
		if (!origin) {
			// Allow requests with no origin (like mobile apps or curl requests)
			return callback(null, true);
		}

		if (allowedOrigins.includes(origin)) {
			// Allow the request if the origin is in the allowed list
			return callback(null, true);
		} else {
			// Reject the request if the origin is not in the allowed list
			return callback(new Error("Not allowed by CORS"), false);
		}
	},
	credentials: true, // Allow cookies to be included in CORS requests
};

// Apply the CORS middleware to all routes
app.use(cors(corsOptions));

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
