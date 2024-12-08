const express = require("express");
const router = express.Router();
const {
  handleUserSignUp,
  handleUserLogin,
  uploadMedicalDocument,
  handleEditProfile,
  handleViewProfile,
  getAllDocuments,
  handleUserVerify,
  handleDeleteDocument,
} = require("../controllers/user_controller");
const {
  handleInputBP,
  getAllBPdata,
  healthhistory,
} = require("../controllers/bp_controller");
const upload = require("../middleware/multer.js");
const {
  handleCreateAppointment,
  getAllAppointment,
  handleUpdateAppointment,
  handleDeleteAppointment,
} = require("../controllers/appointment-controller.js");

router.route("/signup").post(handleUserSignUp);
router.route("/login").post(handleUserLogin);

// BP controller routes
router.route("/inputbp").post(handleInputBP);
router.route("/bphistory").get(getAllBPdata);
router.route("/healthhistory").get(healthhistory);

// medical document upload route
router
  .route("/uploaddocument")
  .post(
    upload.fields([{ name: "medicalDocument", maxCount: 1 }]),
    uploadMedicalDocument
  );

// get all documentsbphistory
router.route("/getdocuments").get(getAllDocuments);

// View profile route
router.route("/viewprofile").get(handleViewProfile);

// Edit profile route
router
  .route("/editprofile")
  .post(
    upload.fields([{ name: "profilePic", maxCount: 1 }]),
    handleEditProfile
  );

// appointment routes
router.route("/appointment").post(handleCreateAppointment);
router.route("/appointment").get(getAllAppointment);
router.route("/appointment/:id").patch(handleUpdateAppointment);
router.route("/appointment/:id").delete(handleDeleteAppointment);

// medical document delete route
router.route("/document/:id").delete(handleDeleteDocument);

module.exports = router;
