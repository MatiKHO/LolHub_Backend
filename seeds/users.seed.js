require("dotenv").config();
require("../config/db.config");

const mongoose = require("mongoose");

const User = require("../models/User.model");

const users = require("../users.json");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/lol_hub";

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.info(`*** Connected to the database ${mongoose.connection.db.databaseName} ***`);
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1); 
  });



mongoose.connection.once("open", () => {
  console.info(
    `*** Connected to the database ${mongoose.connection.db.databaseName} ***`
  );

  mongoose.connection.db
    .dropCollection("users")
    .then(() => {
      console.info("DB has been cleared");

      return User.create(users);
    })
    .then((createdUsers) => {
      console.log("Users created");
    })
    .catch((err) => console.error(err))
    .finally(() => {
      mongoose.connection.close().then(function () {
        console.log("Mongoose disconnected");
        process.exit(0);
      });
    });
});

