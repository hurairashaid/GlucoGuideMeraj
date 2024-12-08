import * as React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { BaseURL } from "../apiBaseURL/BaseURL";

function Prediction() {
  const [allHealthHistoryDetails, setAllHealthHistoryDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [MLModelData, setMLModelData] = useState({ level: "" });
  const progressValue = Number(MLModelData.percentage); // Default progress value
  const size = 130; // Size of CircularProgress

  useEffect(() => {
    // Function to fetch health history data
    const fetchHealthHistory = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        // Ensure token exists and is valid
        if (token) {
          const decoded = jwtDecode(token); // Decode token if needed
          const res = await axios.get(`${BaseURL}/user/healthhistory`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setAllHealthHistoryDetails(res.data.data);
        } else {
          console.error("Token not found");
          setLoading(false); // Stop loading if token is missing
        }
      } catch (error) {
        console.error("Error fetching health history:", error);
        setLoading(false); // Stop loading on error
      }
    };

    fetchHealthHistory();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  useEffect(() => {
    // Function to fetch prediction based on health history data
    const fetchPrediction = async () => {
      if (allHealthHistoryDetails.length === 0) return; // Ensure data is available

      try {
        console.log("Sending request with data:", allHealthHistoryDetails);

        const res = await axios.post(
          "http://98.70.75.99/mlmodelapi/predict",
          {
            data: allHealthHistoryDetails,
          }
        );

        console.log("Received response:", res.data);

        // Parse and handle the result
        const result = JSON.parse(res.data.result);
        setMLModelData(result);
        localStorage.setItem("MLModelData", JSON.stringify(result));
      } catch (error) {
        console.error("Error during API call:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [allHealthHistoryDetails]); // Dependency array includes `allHealthHistoryDetails`

  const getMessage = (level) => {
    console.log(level);

    switch (level) {
      case "low":
        return "According to your given details as per our system prediction Your doing well , please continue sticking to your routine to make your blood sugar is low!";
      case "medium":
        return "According to your given details as per our system prediction your blood sugar is not at risk today but it is still have to take precaution and be safe";
      case "high":
        return "According to your given details as per our system prediction, your at risk , reduce glucose intake , as per suggestion you can book an appointment with doctors in your area your our appointments section.";
      case "very high":
        return "According to your given details as per our system prediction , Your at high risk , please book an appointment using our website and keep your Human insulin (Myxredlin, Humulin R U-100, Novolin R) solution on you at all time";

      default:
        return "We are not able to judge your level";
    }
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ position: "relative", display: "flex" }}>
          <CircularProgress
            style={{ height: `${size}px`, width: `${size}px`, color: "purple" }}
            variant="determinate"
            value={progressValue}
            sx={{ size: size }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: size,
              height: size,
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
              fontSize={20}
            >
              {MLModelData.percentage}%
            </Typography>
          </Box>
        </Box>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 40,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          style={{
            width: "70%",
            fontSize: "26px",
            fontWeight: "Bold",
            textAlign: "center",
          }}
        >
          {loading
            ? "Generating Results....."
            : `Based on your data, you have ${MLModelData.level} chances of diabetes`}
        </Typography>
        <Typography
          style={{ width: "70%", fontSize: "26px", textAlign: "center" }}
        >
          {loading ? "" : getMessage(MLModelData.level)}
        </Typography>
      </div>
    </>
  );
}

Prediction.propTypes = {
  allHealthHistoryDetails: PropTypes.array.isRequired, // Ensure this is passed correctly
};

export default Prediction;
