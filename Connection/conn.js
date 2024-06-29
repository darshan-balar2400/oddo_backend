const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then((success) => {
    console.log("successfully connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB");
  });
