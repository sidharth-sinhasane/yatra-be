// src/routes/user.ts
import express from 'express';
import { Request, Response } from 'express';
import { Users,Travelplans } from '../db/models';

const userRouter = express.Router();
// @ts-ignore
userRouter.post('/view', async (req:Request, res:Response) => {
  // @ts-ignore
  const username: string = req.user.username;

  try {
    const user = await Users.findOne({ username })
      .populate('travelplans._id')
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



// @ts-ignore
userRouter.post('/viewall', async (req:Request, res:Response) => {

  try {
    const allPlans = await Travelplans.find({});
    if (!allPlans) { 
      return res.status(404).json({ error: 'No travel plans found' });
    }
    res.status(200).json({ allPlans });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});


// @ts-ignore
userRouter.post('/book', async (req:Request, res:Response) => {
  try {
    const { travelplanid, startdate, startlocation } = req.body;
    // @ts-ignore
    const username: string = req.user.username;
    if (!travelplanid || !startdate || !startlocation) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const user =await Users.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const travelplan = await Travelplans.findOne({ travelplanid });
    if (!travelplan) {
      return res.status(404).json({ error: 'Travel plan not found' });
    }
    
    user.travelplans.push({
      travelplanid: travelplanid,
      startdate: startdate,
      startlocation: startlocation
    });
    await user.save();
    res.status(200).json({ message: 'Travel plan booked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export { userRouter };
