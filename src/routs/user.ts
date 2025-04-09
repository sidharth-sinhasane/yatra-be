// src/routes/user.ts
import express from 'express';
import { Request, Response } from 'express';
import { Users } from '../db/models';

const userRouter = express.Router();
// @ts-ignore
userRouter.post('/view', async (req:Request, res:Response) => {
  const username: string = req.body.username;

  try {
    const user = await Users.findOne({ username })
      .populate('travelplans.travelplanid')
      .exec();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const result = user.travelplans.map((plan: any) => ({
      startdate: plan.startdate,
      startlocation: plan.startlocation,
      destination: plan.travelplanid.destination,
      price: plan.travelplanid.price,
      name: plan.travelplanid.name,
      description: plan.travelplanid.description
    }));

    return res.json({ result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default userRouter; 
