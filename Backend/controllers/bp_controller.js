const BPModel = require("../models/bp_model");
const jwt = require("jsonwebtoken");

const handleInputBP = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    const { systolic, diastolic, date } = req.body;

    if (!systolic || !diastolic) {
      return res.json({ status: "failed", msg: "all fields are required" });
    }

    const userBP = await BPModel.create({
      userId: _id,
      systolic: systolic,
      diastolic: diastolic,
      date: date,
    });

    res.json({ data: userBP });
  } catch (error) {
    res.json({ status: "failed", error: error.message });
  }
};

const getAllBPdata = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    const BPdata = await BPModel.find({ userId: _id });
    res.json({ status: "success", data: BPdata });
  } catch (error) {
    res.json({ status: "failed", error: error.message });
  }
};

const healthhistory = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    const healthHistory = await BPModel.find({ userId: _id });

    const newArray = healthHistory.map((data) => {
      const { systolic, diastolic } = data;
      const container = [systolic, diastolic];
      return container;
    });

    res.json({ status: "success", data: newArray });
  } catch (error) {
    res.json({ status: "failed", error: error.message });
  }
};

module.exports = { handleInputBP, getAllBPdata, healthhistory };
