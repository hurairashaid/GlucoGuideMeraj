const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    profilePic: {
      type: String,
    },
    haveDiabetes: {
      type: String,
      enum: ["Yes", "No", "Probably"],
    },
    havePreDiabetes: {
      type: String,
      enum: ["Yes", "No", "Probably"],
    },
    lifeStyle: {
      type: String,
    },
    areYouActive: {
      type: String,
      enum: ["Yes", "No", "Probably"],
    },
    checkBPdialy: {
      type: String,
      enum: ["Yes", "No", "Probably"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
