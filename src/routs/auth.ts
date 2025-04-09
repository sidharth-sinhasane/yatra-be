import express from 'express';
import e, { Request, Response } from 'express';
import { Travelplans, Users } from '../db/models';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
dotenv.config();

const userSignUp = express.Router();
const userSignIn = express.Router();

const adminSignIn = express.Router();
// @ts-ignore
userSignUp.post('/', async (req: Request, res: Response) => {
    const username:string = req.body.username;
    const password:string = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    const existingUser =await Users.findOne({ username:username });
    console.log("username", username, existingUser);
    if(existingUser){
        return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({ username:username, password:hashedPassword ,Travelplans:[]});
    try {
        await newUser.save();
        return res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }

});

// @ts-ignore
userSignIn.post('/', async (req: Request, res: Response) => {
    const username:string = req.body.username;
    const password:string = req.body.password;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    const existingUser = await Users.findOne({ username :username});
    if (!existingUser) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }
    const secreat = process.env.USER_JWT_SECREAT;
    if (!secreat) {
        return res.status(500).json({ error: 'Server error' });
    }
    const token = jwt.sign({ id: existingUser._id }, secreat, { expiresIn: '1h' });
    return res.status(200).json({ token });
});


// @ts-ignore
adminSignIn.post('/', async (req: Request, res: Response) => {
    const curUsername:string = req.body.username;
    const curPassword:string = req.body.password;
    if (!curPassword || !curUsername) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    if (!username || !password) {
        return res.status(500).json({ error: 'Server error' });
    }
    if (curUsername !== username || curPassword !== password) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    const secreat = process.env.ADMIN_JWT_SECREAT;
    if (!secreat) {
        return res.status(500).json({ error: 'Server error' });
    }
    const token = jwt.sign({ username }, secreat, { expiresIn: '1h' });
    return res.status(200).json({ token });
});

export { userSignUp, userSignIn, adminSignIn};