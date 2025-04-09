import jwt from 'jsonwebtoken';
import express from 'express';
import { Response,Request} from 'express';

const adminRouter = express.Router();
import { Travelplans } from '../db/models';

adminRouter.post('/add', async (req:Request, res:Response) => {
    const { name, description, price, destination } = req.body;
    try {
        const travelplan = new Travelplans({
            name,
            description,
            price,
            destination,
            travelplanid: Math.floor(Math.random() * 1000000) // Random ID for travel plan
        });
        await travelplan.save();
        res.status(200).json({ message: 'Travel plan added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// @ts-ignore
adminRouter.delete('/delete', async (req:Request, res:Response) => {
    const { travelplanid } = req.body;
    try {
        const travelplan = await Travelplans.findOneAndDelete({ travelplanid :travelplanid });
        if (!travelplan) {
            return res.status(404).json({ error: 'Travel plan not found' });
        }
        res.status(200).json({ message: 'Travel plan deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}
);
export { adminRouter };