// File: src/db/models.ts
// Description: This file contains the database connection and schema definitions for the application.
const mongoose = require('mongoose');
const { Schema } = mongoose;

const connectTODB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

const userschema = new Schema({
    username: { type: String, required: true ,unique: true },
    password: { type: String, required: true },
    travelplans: [
        {
        travelplanid: { type: Schema.Types.ObjectId, required: true , ref: 'TravelPlan'},
        startdate: { type: Date, required: true },
        startlocation: { type: String, required: true }
        }
    ]
});

const travelschema = new Schema({
    travelplanid: { type: Number, required: true ,unique: true },
    destinaiton : { type: String, required: true },
    price : { type: Number, required: true },
    name : { type: String, required: true },
    description : { type: String, required: true }
});

const Users = mongoose.model('User', userschema);
const Travelplans = mongoose.model('TravelPlan', travelschema);

export { connectTODB, Users, Travelplans };