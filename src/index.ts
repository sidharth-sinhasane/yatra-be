// src/index.ts
// start file of project
import express from 'express';
import { userSignUp, userSignIn, adminSignIn} from './routs/auth';
import { connectTODB } from './db/models';
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Travel Plan API!');
});

// Routes
app.use('/user/signup', userSignUp);
app.use('/user/signin', userSignIn);

app.listen(PORT, () => {
    connectTODB();
    console.log(`Server is running on port ${PORT}`);
});