// src/index.ts
// start file of project
import express from 'express';
import { userSignUp, userSignIn, adminSignIn} from './routs/auth';
import { connectTODB } from './db/models';
import { userAuthMiddleware } from './middleware/userAuthMiddleware';
import { adminAuthMiddleware } from './middleware/adminAuthMiddleware';
import { userRouter } from './routs/user';
import cookieparser from 'cookie-parser';
import { adminRouter } from './routs/admin';
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieparser());
app.get('/', (req, res) => {
    res.send('Welcome to the Travel Plan API!');
});

// Routes
app.use('/user/signup', userSignUp);
app.use('/user/signin', userSignIn);

// @ts-ignore
app.use('/user',userAuthMiddleware, userRouter);

app.use('/admin/signin', adminSignIn);
// @ts-ignore
app.use('/admin', adminAuthMiddleware, adminRouter);


app.listen(PORT, () => {
    connectTODB();
    console.log(`Server is running on port ${PORT}`);
});