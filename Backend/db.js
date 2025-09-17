const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/IMS";

const connectToMongo = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Mongo Successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connectToMongo;