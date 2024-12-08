const User = require("../models/user_model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const MedicalDocument = require("../models/medical_documents_model.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");
// const otpGenerator = require("otp-generator");
// const nodemailer = require("nodemailer");
// const { text } = require("express");

const handleUserSignUp = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      weight,
      height,
      haveDiabetes,
      havePreDiabetes,
      lifeStyle,
      areYouActive,
      checkBPdialy,
    } = req.body;

    if (
      (!name,
      !email,
      !password,
      !age,
      !weight,
      !height,
      !haveDiabetes,
      !havePreDiabetes,
      !lifeStyle,
      !areYouActive,
      !checkBPdialy)
    ) {
      return res.json({ status: "failed", msg: "all fields are required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      age: age,
      weight: weight,
      height: height,
      haveDiabetes: haveDiabetes,
      havePreDiabetes: havePreDiabetes,
      lifeStyle: lifeStyle,
      areYouActive: areYouActive,
      checkBPdialy: checkBPdialy,
    });

    const { _id } = user;

    if (user) {
      const token = jwt.sign({ _id, name }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      return res.json({ msg: "successfully sugn up", token: token });
    }
  } catch (error) {
    res.json({ err: error.message });
  }
};

const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ msg: "all fields are required" });
    }
    const user = await User.findOne({
      email: email,
    });
    const { _id, name } = user;
    if (user) {
      const validated = await bcrypt.compare(password, user.password);
      if (validated) {
        const token = jwt.sign({ _id, name }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });
        return res.json({ msg: "successfully login", token: token });
      } else {
        return res.json({ msg: "email or password is incorrect" });
      }
    } else {
      return res.json({ msg: "email or password is incorrect" });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

const uploadMedicalDocument = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    const medicalDocumentLocalPath = req.files?.medicalDocument[0]?.path;
    const medicalDocument = await uploadOnCloudinary(medicalDocumentLocalPath);

    const document = await MedicalDocument.create({
      userId: _id,
      document: medicalDocument.url,
    });

    res.json({ data: document });
  } catch (error) {
    res.json({ status: "failed", msg: error.message });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    const allDocuments = await MedicalDocument.find({ userId: _id });

    res.json({ status: "success", data: allDocuments });
  } catch (error) {
    res.json({ status: "failed", msg: error.message });
  }
};

const handleViewProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    const user = await User.findById({ _id: _id });
    res.json({ data: user });
  } catch (error) {
    res.json({ status: "failed", msg: error.message });
  }
};

const handleEditProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    const { name, age, height, weight } = req.body;
    const profilePicLocalPath = req.files?.profilePic[0]?.path;
    const profilePic = await uploadOnCloudinary(profilePicLocalPath);

    const user = await User.findByIdAndUpdate(
      { _id: _id },
      {
        name: name,
        age: age,
        height: height,
        weight: weight,
        profilePic: profilePic.url,
      }
    );

    res.json({ data: user });
  } catch (error) {
    res.json({ status: "failed", msg: error.message });
  }
};

const handleDeleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteDocument = await MedicalDocument.findByIdAndDelete(id);

    if (!deleteDocument) {
      return res.json({ message: "document not found" });
    }

    res.json({ msg: "suucessfully deleted" });
  } catch (error) {
    res.json({ status: "failed", msg: error.message });
  }
};

module.exports = {
  handleUserSignUp,
  handleUserLogin,
  uploadMedicalDocument,
  getAllDocuments,
  handleEditProfile,
  handleViewProfile,
  handleDeleteDocument,
};
