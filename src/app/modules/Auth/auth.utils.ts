import jwt, { JwtPayload, Secret } from "jsonwebtoken";

// Function to create a JWT token
const createToken = (
	jwtPayload: { email: string },
	secretKey: string,
	expiresIn: string
) => {
	return jwt.sign(jwtPayload, secretKey, { expiresIn });
};

// Function to verify a JWT token
const verifyToken = (token: string, secretKey: Secret) => {
	return jwt.verify(token, secretKey) as JwtPayload;
};

export const jwtHelpers = {
	createToken,
	verifyToken,
};
