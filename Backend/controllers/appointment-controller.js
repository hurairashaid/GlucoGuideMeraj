const AppointmentModel = require("../models/appointment-model");
const jwt = require("jsonwebtoken");

const handleCreateAppointment = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    const { doctor, address, date, time } = req.body;

    if ((!doctor, !address, !date, !time)) {
      return res.json({ status: "failed", msg: "all fields are required" });
    }

    const appointment = await AppointmentModel.create({
      userId: _id,
      doctor: doctor,
      address: address,
      date: date,
      time: time,
    });

    res.json({ status: "success", data: appointment });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const getAllAppointment = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    const appointments = await AppointmentModel.find({ userId: _id });

    res.json({ status: "success", data: appointments });
  } catch (error) {
    res.json({ error: error.message });
  }
};
const handleUpdateAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const { doctor, address, date, time } = req.body;

    const appointment = await AppointmentModel.findOneAndUpdate(
      { _id: id },
      { doctor: doctor, address: address, date: date, time: time },
      { new: true }
    );

    res.json({ status: "suucessfully updated", data: appointment });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const handleDeleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteAppointment = await AppointmentModel.findByIdAndDelete(id);

    if (!deleteAppointment) {
      return res.json({ message: "Appointment not found" });
    }

    res.json({ msg: "suucessfully deleted", data: deleteAppointment });
  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = {
  handleCreateAppointment,
  getAllAppointment,
  handleUpdateAppointment,
  handleDeleteAppointment,
};
