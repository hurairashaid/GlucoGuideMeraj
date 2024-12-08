import React, { useEffect, useState } from "react";
import image from "../assets/mainimage.png";
import axios from "axios";
import { BaseURL } from "../apiBaseURL/BaseURL";
import { jwtDecode } from "jwt-decode";

const PatientHomePage = () => {
  const [MLModelData, setMLModelData] = useState(""); // State for ML Model Data
  const [allHealthHistoryDetails, setAllHealthHistoryDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({});
  const token = JSON.parse(localStorage.getItem("token"));
  const decoded = jwtDecode(token);

  const fadeInStyle = {
    animation: "fadeIn 2s ease-in-out",
  };

  const slideInStyle = {
    animation: "slideIn 1.5s ease-in-out",
  };

  const allHealthHistory = async () => {
    try {
      const res = await axios.get(`${BaseURL}/user/healthhistory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllHealthHistoryDetails(res.data.data);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const MLPerdictionFunc = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://98.70.75.99/mlmodelapi/predict", {
        data: allHealthHistoryDetails,
      });

      setMLModelData(JSON.parse(res.data.result));
      localStorage.setItem("MLModelData", JSON.stringify(res.data.result));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error: ", error);
    }
  };

  const userData = async () => {
    try {
      const res = await axios.get(`${BaseURL}/user/viewprofile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileData(res.data.data);
      localStorage.setItem("profile data", JSON.stringify(res.data.data));
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    allHealthHistory();
    userData();
  }, []);

  useEffect(() => {
    MLPerdictionFunc();
  }, [allHealthHistoryDetails]);

  return (
    <div style={fadeInStyle} className="container mt-5">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={image}
          alt="Gluco Guide"
          className="img-fluid"
          style={{ ...slideInStyle, marginRight: "20px" }}
        />
        <div>
          <h1 className="mb-4">Welcome to Gluco Guide</h1>
          <p className="lead">
            Thank you <b>{profileData.name}</b> for visiting our AI Assistant
          </p>
          <p className="lead">
            {loading
              ? "Generating Results....."
              : `Based on your data, you have ${MLModelData.level} chances of diabetes`}
          </p>
          <b>Note:</b>
          <span>The result is based on the data you inserted.</span>
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
};

export default PatientHomePage;
