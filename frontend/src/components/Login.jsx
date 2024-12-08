import { Button, hexToRgb, TextField } from "@mui/material";
import React, { useState } from "react";
import Footer from "./Footer";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { BaseURL } from "../apiBaseURL/BaseURL";
import image from '../assets/gluco-guide-image.jpg'
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const loginPatient = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all the fields");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${BaseURL}/login`, {
        email: email,
        password: password,
      });
      console.log(res);
      const token = res.data.token;
      console.log(token, "LOGIN");
      const loginToken = localStorage.setItem("token", JSON.stringify(token));
      if(!token){
        toast.error("Invalid Credentials")
        setLoading(false)
      }
      if (token) {
        navigate("/dashboard/patientHome");
      } 
    } catch (error) {
      setLoading(false);
      console.log(error);
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
                  <span style={{ color: "purple" }}>
                    Your personal health assistant
                  </span>
                </h1>
                <p style={{ color: "hsl(217, 10%, 50.8%)" }}>
                  Gluco Guide is a digital health companion designed to help you
                  manage your health effectively. By tracking your blood
                  pressure, sugar levels, and other vital information, it
                  provides personalized insights and dietary recommendations.
                </p> */}
                <img
                  width={"100%"}
                  height={"100%"}
                  src={image}
                  alt="Image Not Found"
                />
              </div>

              <div className="col-lg-6 mb-5 mb-lg-0">
                <div className="card shadow">
                  <div className="card-body py-5 px-md-5">
                    <form onSubmit={(e) => loginPatient(e)}>
                      {/* <!-- 2 column grid layout with text inputs for the first and last names --> */}
                      <div className="row">
                        <h1
                          className="display-5 fw-bold ls-tight text-center"
                          style={{ color: "purple" }}
                        >
                          Login
                        </h1>
                        <p className="text-center fw-bold">
                          Enter Your Credentials
                        </p>
                      </div>
                      {/* <!-- Email input --> */}
                      <div data-mdb-input-init className="form-outline mb-4">
                        <TextField
                          onChange={(e) => setEmail(e.target.value)}
                          fullWidth
                          type="email"
                          label="Email"
                          variant="outlined"
                        />
                      </div>
                      {/* <!-- Password input --> */}
                      <div data-mdb-input-init className="form-outline mb-4">
                        <TextField
                          fullWidth
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          label="Password"
                          variant="outlined"
                        />
                      </div>
                      {/* <!-- Submit button --> */}
                      <Button
                        variant="contained"
                        disabled={loading}
                        type="submit"
                        data-mdb-button-init
                        data-mdb-ripple-init
                        className="btn btn-block mb-4"
                        style={{ backgroundColor: "purple" }}
                      >
                        {loading ? "Loading..." : "Login"}
                      </Button>
                    </form>
                    <div>
                      <p>
                        Don't have an account?{" "}
                        <Link
                          to="/signup"
                          className="text-decoration-none"
                          style={{ color: "purple" }}
                        >
                          Sign Up
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

export default Login;
