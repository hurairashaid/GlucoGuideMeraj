import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import Footer from "./Footer";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { BaseURL } from "../apiBaseURL/BaseURL";
import image from "../assets/signUpBackground.jpg";
const SignUp = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [height, setHeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [diabetics, setDiabetics] = useState("");
  const [prediabetics, setPrediabetics] = useState("");
  const [lifestyle, setLifestyle] = useState("");
  const [active, setActive] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const formControlStyle = {
    width: "100%",
    marginBottom: "16px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
  };

  const selectStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  const navigate = useNavigate();
  //Register Patient
  const registerPatient = async (e) => {
    e.preventDefault();
    //Check if fields are empty
    if (
      !name ||
      !age ||
      !weight ||
      !email ||
      !password ||
      !height ||
      !diabetics ||
      !prediabetics ||
      !lifestyle ||
      !active ||
      !bloodSugar
    ) {
      toast.error("Please fill in all the fields");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${BaseURL}/signup`, {
        name: name,
        age: age,
        weight: weight,
        email: email,
        password: password,
        height: height,
        haveDiabetes: diabetics,
        havePreDiabetes: prediabetics,
        lifeStyle: lifestyle,
        areYouActive: active,
        checkBPdialy: bloodSugar,
      });
      console.log(res.data);
      const token = res.data.token;
      console.log(token, "LOGIN");
      const loginToken = localStorage.setItem("token", JSON.stringify(token));
      // toast.success("Registration Successful");
      if (token) {
        navigate("/dashboard/patientHome");
      }
    } catch (error) {
      setLoading(false);
      console.log("error: ", error);
    }
  };
  return (
    <>
      {/* <!-- Section: Design Block --> */}
      <section className="">
        {/* <!-- Jumbotron --> */}
        <div className="px-4 py-5 px-md-5 text-center h-100 text-lg-start">
          <div className="container">
            <div className="row gx-lg-5 align-items-center">
              <div className="col-lg-6 mb-5 mb-lg-0">
                {/* <h1 className="my-5 display-3 fw-bold ls-tight">
                  Gluco Guide <br />
                  <span className="text-primary">
                    Your personal health assistant
                  </span>
                </h1>
                <p style={{ color: "hsl(217, 10%, 50.8%)" }}>
                  Gluco Guide is a digital health companion designed to help you
                  manage your health effectively. By tracking your blood
                  pressure, sugar levels, and other vital information, it
                  provides personalized insights and dietary recommendations.
                </p> */}
                <img width={"100%"} src={image} alt="Image Not Found" />
              </div>
              <div className="col-lg-6 mb-5 mb-lg-0">
                <div className="card shadow">
                  <div className="card-body py-5 px-md-5">
                    {/* <!-- 2 column grid layout with text inputs for the first and last names --> */}
                    <div className="row">
                      <h1
                        className="display-5 fw-bold ls-tight text-center "
                        style={{ color: "purple" }}
                      >
                        Sign Up
                      </h1>
                      <p className="text-center fw-bold">
                        Register Your Account
                      </p>
                    </div>
                    <form onSubmit={(e) => registerPatient(e)}>
                      {/* <!-- Name input --> */}
                      <div data-mdb-input-init className="form-outline mb-4">
                        <TextField
                          onChange={(e) => setName(e.target.value)}
                          fullWidth
                          label="Name"
                          variant="outlined"
                        />
                      </div>
                      {/* <!-- Age and Weight input --> */}
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        {/* Age Field */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            onChange={(e) => setAge(e.target.value)}
                            autoComplete="given-name"
                            name="age"
                            type="number"
                            fullWidth
                            id="age"
                            label="Age"
                            autoFocus
                          />
                        </Grid>
                        {/* Weight Field */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            onChange={(e) => setWeight(e.target.value)}
                            fullWidth
                            type="number"
                            id="weight"
                            label="Weight"
                            name="weight"
                            autoComplete="family-name"
                          />
                        </Grid>
                      </Grid>

                      {/* <!-- Height input --> */}
                      <div data-mdb-input-init className="form-outline mb-4">
                        <TextField
                          onChange={(e) => setHeight(e.target.value)}
                          fullWidth
                          type="number"
                          label="Height"
                          variant="outlined"
                        />
                      </div>
                      {/* //Patient History Block */}
                      <div>
                        {/* Diabetics & Prediabetics */}
                        <div
                          style={{
                            display: "flex",
                            gap: "16px",
                            marginBottom: "24px",
                          }}
                        >
                          {/* Diabeties */}
                          <div style={formControlStyle}>
                            <label style={labelStyle} htmlFor="diabetics">
                              Do You Have Diabeties?
                            </label>
                            <select
                              id="diabetics"
                              value={diabetics}
                              onChange={(e) => setDiabetics(e.target.value)}
                              style={selectStyle}
                            >
                              <option value="" disabled defaultValue>
                                Select
                              </option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                              <option value="Probably">Not Sure</option>
                            </select>
                          </div>
                          {/* PreDiabetics */}
                          <div style={formControlStyle}>
                            <label style={labelStyle} htmlFor="prediabetics">
                              Do You Have Prediabeties?
                            </label>
                            <select
                              id="prediabetics"
                              value={prediabetics}
                              onChange={(e) => setPrediabetics(e.target.value)}
                              style={selectStyle}
                            >
                              <option value="" disabled defaultValue>
                                Select
                              </option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                              <option value="Probably">Not Sure</option>
                            </select>
                          </div>
                        </div>
                        {/* Lifestyle & Active */}
                        <div
                          style={{
                            display: "flex",
                            gap: "16px",
                            marginBottom: "24px",
                          }}
                        >
                          {/* Active Field */}
                          <div style={formControlStyle}>
                            <label style={labelStyle} htmlFor="active">
                              Are you Active?
                            </label>
                            <select
                              id="active"
                              value={active}
                              onChange={(e) => setActive(e.target.value)}
                              style={selectStyle}
                            >
                              <option value="" disabled defaultValue>
                                Select
                              </option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                              <option value="Probably">Sometime</option>
                            </select>
                          </div>
                        </div>

                        {/* Do you check your blood sugar regularly */}
                        <div style={formControlStyle}>
                          <label style={labelStyle} htmlFor="bloodSugar">
                            Do you check your blood sugar regularly?
                          </label>
                          <select
                            id="bloodSugar"
                            value={bloodSugar}
                            onChange={(e) => setBloodSugar(e.target.value)}
                            style={selectStyle}
                          >
                            <option value="" disabled defaultValue>
                              Select
                            </option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="Probably">sometimes</option>
                          </select>
                        </div>
                        {/* Lifestyle Field */}
                        <div style={formControlStyle}>
                          <label style={labelStyle} htmlFor="lifestyle">
                            Whats Your Lifestyle?
                          </label>
                          <textarea
                            id="lifestyle"
                            value={lifestyle}
                            onChange={(e) => setLifestyle(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "8px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              resize: "vertical", // Allow vertical resizing
                              minHeight: "100px", // Minimum height for the textarea
                            }}
                          />
                        </div>
                      </div>
                      {/* <!-- Email input --> */}
                      <div data-mdb-input-init className="form-outline mb-4">
                        <TextField
                          onChange={(e) => setEmail(e.target.value)}
                          fullWidth
                          label="Email"
                          variant="outlined"
                        />
                      </div>
                      {/* <!-- Password input --> */}
                      <div data-mdb-input-init className="form-outline mb-4">
                        <TextField
                          onChange={(e) => setPassword(e.target.value)}
                          fullWidth
                          type="password"
                          label="Password"
                          variant="outlined"
                        />
                      </div>
                      {/* <!-- Submit button --> */}
                      <Button
                        variant="contained"
                        type="submit"
                        data-mdb-button-init
                        data-mdb-ripple-init
                        disabled={loading}
                        className="btn btn-block mb-4"
                        style={{ backgroundColor: "purple" }}
                      >
                        {loading ? "Loading..." : "Sign Up"}
                      </Button>
                    </form>
                    <div>
                      <p>
                        Already have an account?{" "}
                        <Link
                          style={{ color: "purple" }}
                          to="/login"
                          className=" text-decoration-none"
                        >
                          Login
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Jumbotron --> */}
      </section>
      {/* //Footer Component */}
      <Footer />
      {/* Toastify */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default SignUp;
