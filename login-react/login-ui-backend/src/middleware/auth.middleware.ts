import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// We extend the default Request type to include our user payload from the JWT
export interface AuthenticatedRequest extends Request {
  user?: any; 
}

/**
 * Express middleware to authenticate a JWT.
 * It checks for a token in the 'Authorization' header, verifies it,
 * and attaches the decoded payload to the request object as 'user'.
 */
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // Unauthorized if no token is present
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if token is invalid or expired
    }
    req.user = user; // Attach user payload to the request
    next(); // Proceed to the next middleware or route handler
  });
};
