import axios from "axios"; // Ensure axios is imported
import { BaseURL } from "../apiBaseURL/BaseURL";

// Define getContactInfo as an async arrow function
export const RetrieveMLResult = async () => {
  try {
    // Retrieve and parse the token from localStorage
    const token = JSON.parse(localStorage.getItem("token"));
    // Make the GET request with the token in the Authorization header
    const res = await axios.get(`${BaseURL}/user/healthhistory`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const mlResult = await MLPerdictionFunc(res.data.data);
    return mlResult;
  } catch (error) {
    // Log any errors that occur
    console.error("Error fetching contact information:", error);

    // Optionally, you might want to return an error message or value
    return null;
  }
};

const MLPerdictionFunc = async (propsdata) => {
  try {
    const res = await axios.post("http://98.70.75.99/mlmodelapi/predict", {
      data: propsdata,
    });
    return JSON.parse(res.data.result);
  } catch (error) {
    console.log("error: ", error);
    if (error.response.status === 500) {
      return [];
    }
  }
};
