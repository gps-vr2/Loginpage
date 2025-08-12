import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// define expected shape of token payload if you want stronger types
export interface TokenPayload {
  email?: string;
  hashedPassword?: string;
  id?: number;
  name?: string;
  [key: string]: any;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // helpful logging for debugging (remove or lower log-level in production)
    console.log('[auth] headers:', {
      authorization: req.headers['authorization'],
      host: req.headers['host']
    });

    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return res.status(400).json({ error: 'Malformed Authorization header. Expected: Bearer <token>' });
    }

    const token = parts[1];
    if (!process.env.JWT_SECRET) {
      console.error('[auth] JWT_SECRET is not set!');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        console.error('[auth] token verify error:', err && err.message);
        // return useful client-visible message for debugging (avoid leaking secrets)
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      // decoded might be object | string; ensure we have an object
      if (!decoded || typeof decoded !== 'object') {
        return res.status(401).json({ error: 'Invalid token payload' });
      }

      // Optionally validate required fields in token
      const payload = decoded as TokenPayload;
      // e.g. ensure hashedPassword present if your downstream code expects it:
      // if (!payload.hashedPassword) {
      //   return res.status(401).json({ error: 'Token missing required registration info' });
      // }

      req.user = payload;
      next();
    });
  } catch (error: any) {
    console.error('[auth] unexpected error:', error?.message || error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
