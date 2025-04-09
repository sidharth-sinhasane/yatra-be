import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { Users } from '../db/models';

// Middleware to check if the user is authenticated
const userAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const secret = process.env.USER_JWT_SECREAT;
        if (!secret) {
            throw new Error('JWT secret not found');
        }
        const decoded: any = jwt.verify(token, secret);
        const user = await Users.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // @ts-ignore
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

export { userAuthMiddleware };