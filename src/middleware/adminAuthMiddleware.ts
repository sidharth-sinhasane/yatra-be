import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decoded : any = jwt.verify(token, process.env.ADMIN_JWT_SECREAT as string);
        if (!decoded) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (decoded.username != process.env.ADMIN_USERNAME) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // @ts-ignore
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

export { adminAuthMiddleware };