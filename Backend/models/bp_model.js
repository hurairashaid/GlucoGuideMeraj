const mongoose = require("mongoose");

const bpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    systolic: {
      type: Number,
      required: true,
    },
    diastolic: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const BPModel = mongoose.model("BPModel", bpSchema);
module.exports = BPModel;
