import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BaseURL } from "../apiBaseURL/BaseURL";

export default function MyApp() {
  const [value, onChange] = useState(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [bpHistoryData, setBpHistoryData] = useState([]);
  const [filteredBPData, setFilteredBPData] = useState([]);
  const [mlModelData, setMLModelData] = useState(null);
  const [disabilityForAnalyzeButton, setDisabilityForAnalyzeButton] =
    useState(true);
  const [dateEntryCounts, setDateEntryCounts] = useState({});

  useEffect(() => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const formattedDate = value.toLocaleDateString("en-US", options);
    console.log(formattedDate);
  }, [value]);

  useEffect(() => {
    fetchDateEntryCounts();
  }, []);

  const fetchDateEntryCounts = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const res = await axios.get(`${BaseURL}/user/bphistory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const counts = res.data.data.reduce((acc, entry) => {
        const dateStr = new Date(entry.date).toLocaleDateString("en-CA");
        if (!acc[dateStr]) {
          acc[dateStr] = 0;
        }
        acc[dateStr]++;
        return acc;
      }, {});
      setDateEntryCounts(counts);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    setFormattedDate(date.toLocaleDateString("en-US", options));
    setBpHistoryData([]); // Clear previous BP history data
    setMLModelData(null); // Clear previous ML model data
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSystolic("");
    setDiastolic("");
  };

  const handleAddData = async (e) => {
    e.preventDefault();
    if (!systolic || !diastolic) {
      toast.error("Please fill in all the fields");
      return;
    }
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      setLoading(true);
      const res = await axios.post(
        `${BaseURL}/user/inputbp`,
        {
          date: selectedDate,
          systolic: systolic,
          diastolic: diastolic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Successful");
      console.log(res.data, "res.data");

      // Update the entry count for the selected date
      const dateStr = selectedDate.toLocaleDateString("en-CA");
      setDateEntryCounts((prevCounts) => ({
        ...prevCounts,
        [dateStr]: (prevCounts[dateStr] || 0) + 1,
      }));

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error: ", error);
    }
  };

  const handleShowReadings = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    setLoading(true);
    try {
      const res = await axios.get(`${BaseURL}/user/bphistory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filteredData = res.data.data.filter((e) => {
        const entryDate = new Date(e.date).toLocaleDateString("en-CA");
        const selectedDateStr = selectedDate.toLocaleDateString("en-CA");
        return entryDate === selectedDateStr;
      });
      setBpHistoryData(filteredData);
      console.log(filteredData, "filteredBPHistoryData");

      setDisabilityForAnalyzeButton(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error: ", error);
    }
  };

  const handleAnalyzeData = async () => {
    // Filter data for the selected date
    const filteredData = bpHistoryData
      .filter((e) => {
        const entryDate = new Date(e.date).toLocaleDateString("en-CA");
        const selectedDateStr = selectedDate.toLocaleDateString("en-CA");
        return entryDate === selectedDateStr;
      })
      .map((e) => [e.systolic, e.diastolic]);

    setFilteredBPData(filteredData);
    setLoading(true);

    try {
      const res = await axios.post(
        "http://104.214.171.179/mlmodelapi/predict",
        {
          data: filteredData,
        }
      );
      setMLModelData(res.data.result);
      console.log(res.data.result, "MLModelData");

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error: ", error);
    }
  };

  return (
    <>
     <Typography className="text-center" variant="h4" gutterBottom>
          Blood Pressure
        </Typography>
      <Box>
        <Calendar
          className="w-100"
          onClickDay={handleDateClick}
          tileContent={({ date, view }) => {
            const dateStr = date.toLocaleDateString("en-CA");
            const count = dateEntryCounts[dateStr] || 0;
            return view === "month" && count > 0 ? (
              <div style={{ textAlign: "center", marginTop: "5px" }}>
                <span
                className="rounded-circle"
                  style={{
                    backgroundColor: "#3f51b5",
                    color: "#fff",
                    padding: "6px",
                  }}
                >
                  {count}
                </span>
              </div>
            ) : null;
          }}
          style={{
            width: "100%",
            maxWidth: "500px", // Adjust max-width as needed
            height: "800px", // Increase the height of the calendar
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add shadow for elegance
            borderRadius: "12px", // Add border radius for rounded corners
            backgroundColor: "#fff", // White background for the calendar
            padding: "20px", // Padding inside the calendar
          }}
        />
      </Box>

      <Modal open={openModal} onClose={handleModalClose}>
        <Box sx={{ ...modalStyle }} className="custom-scrollbar">
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h6" gutterBottom>
              Enter Blood Pressure Data
            </Typography>
            <IconButton onClick={handleModalClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Typography variant="subtitle1" gutterBottom>
            Selected Date: {formattedDate}
          </Typography>
          <TextField
            fullWidth
            label="Systolic"
            name="systolic"
            type="number"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Diastolic"
            name="diastolic"
            type="number"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddData}
                fullWidth
              >
                Add Data
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleShowReadings}
                fullWidth
              >
                Show Readings
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="info"
                onClick={handleAnalyzeData}
                fullWidth
                disabled={loading || disabilityForAnalyzeButton} // Disable button when loading
              >
                {loading ? <CircularProgress size={24} /> : "Analyze Data"}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="error"
                onClick={handleModalClose}
                fullWidth
              >
                Close
              </Button>
            </Grid>
          </Grid>
          {/* Display filtered BP history data */}
          <div className="container mt-4">
            <Typography variant="h6" gutterBottom>
              Blood Pressure History for {formattedDate}
            </Typography>
            {bpHistoryData.length > 0 ? (
              bpHistoryData.map((e, i) => (
                <div key={i} className="card mb-2">
                  <div className="card-body">
                    <Typography variant="body1">
                      <b>Date:</b>{" "}
                      {new Date(e.date).toLocaleDateString("en-CA")}
                    </Typography>
                    <Typography variant="body1">
                      <b>Systolic:</b> {e.systolic}
                    </Typography>
                    <Typography variant="body1">
                      <b>Diastolic:</b> {e.diastolic}
                    </Typography>
                  </div>
                </div>
              ))
            ) : (
              <Typography variant="body1">
                No data available for the selected date.
              </Typography>
            )}
          </div>
        </Box>
      </Modal>
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
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 500,
  bgcolor: "background.paper",
  borderRadius: 8,
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh", // Set a maximum height for the modal
  overflowY: "auto", // Enable vertical scrolling
  scrollbarWidth: "thin", // For Firefox
  scrollbarColor: "#888 #f1f1f1", // For Firefox
};

// For WebKit browsers (Chrome, Safari)
const customScrollbar = {
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#888",
    borderRadius: "10px",
    border: "2px solid #f1f1f1",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#555",
  },
};
// import { useState } from "react";
// import { Form, Button } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// export default function DatePickerComponent() {
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="text-center mb-4">Select a Date</h2>
//       <Form className="d-flex justify-content-center">
//         <DatePicker
//           selected={selectedDate}
//           onChange={handleDateChange}
//           className="form-control"
//           dateFormat="MMMM d, yyyy"
//         />
//       </Form>
//       <div className="text-center mt-3">
//         <Button variant="primary" onClick={() => alert(`Selected Date: ${selectedDate.toDateString()}`)}>
//           Show Selected Date
//         </Button>
//       </div>
//     </div>
//   );
// }
// import React, { useEffect, useState } from "react";
// import { Form, Modal } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { Button, TextField } from "@mui/material";
// import axios from "axios";
// import { BaseURL } from "../apiBaseURL/BaseURL";
// import { toast, ToastContainer } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// export default function DatePickerComponent() {
//   const navigate = useNavigate();
//   //State
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [showModal, setShowModal] = useState(false);
//   //State For Modal Inputs
//   const [systolic, setSystolic] = useState();
//   const [diastolic, setDiastolic] = useState();
//   // State for Loading
//   const [loading, setLoading] = useState(false);
//   //State for useEffect
//   const [bpData, setBpData] = useState(false);
//   //State for Refresh
//   const [refresh, setRefresh] = useState(false);
//   //State for Blood Pressure History
//   const [bpHistoryData, setBpHistoryData] = useState([]);
//   const [filteredBPData, setFilteredBPData] = useState([]);
//   const [disablilityForAnalayzeButton, setDisablilityForAnalayzeButton] =
//     useState(true); //State for Disablility of Analyze Button
//   const [MLModelData, setMLModelData] = useState(""); //State for ML Model Data
//   //Fuction to handle date change
//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//   };
//   //Function to handle modal close
//   const handleClose = () => setShowModal(false);
//   const handleShow = () => setShowModal(true);

//   //Function to input blood pressure
// const inputBP = async (e) => {
//   e.preventDefault();
//   //Error Validation
//   if (!systolic || !diastolic) {
//     toast.error("Please fill in all the fields");
//     return;
//   }
//   //Getting token from local storage
//   const token = JSON.parse(localStorage.getItem("token"));
//   // console.log("token", token);

//   //API Call
//   try {
//     setLoading(true);
//     const res = await axios.post(
//       `${BaseURL}/user/inputbp`,
//       {
//         date: selectedDate,
//         systolic: systolic,
//         diastolic: diastolic,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     // setRefresh(!refresh);
//     // console.log(res.data);
//     toast.success("Successful");
//     setLoading(false);
//   } catch (error) {
//     setLoading(false);
//     console.log("error: ", error);
//   }
// };
//   //Function to get blood pressure history
// const bpHistory = async () => {
//   const token = JSON.parse(localStorage.getItem("token"));
//   setLoading(true);
//   try {
//     const res = await axios.get(`${BaseURL}/user/bphistory`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     setBpHistoryData(res.data.data);
//     // console.log(res.data.data);
//     setDisablilityForAnalayzeButton(false);
//     setLoading(false);
//   } catch (error) {
//     setLoading(false);
//     console.log("error: ", error);
//   }
// };
//   //ML Model API CALL IN THIS FUNCTION analayzeData()
//   const analayzeData = async () => {
//     const filteredData = bpHistoryData
//       .filter((e) => {
//         const entryDate = new Date(e.date).toLocaleDateString("en-CA");
//         const selectedDateStr = selectedDate.toLocaleDateString("en-CA");
//         return entryDate === selectedDateStr;
//       })
//       .map((e) => [e.systolic, e.diastolic]);
//     setFilteredBPData(filteredData);
//     // console.log("filteredBPData", filteredBPData);
//     // console.log("filteredData", filteredData);
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         "http://104.214.171.179/mlmodelapi/predict",
//         {
//           data: filteredData,
//         }
//       );
//       setMLModelData(res.data.result);
//       // console.log(res.data.result);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       console.log("error: ", error);
//     }
//   };
//   //Styles
//   const containerStyle = {
//     marginTop: "200px",
//     padding: "20px",
//     borderRadius: "10px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     backgroundColor: "#f8f9fa",
//     width: "80%",
//     maxWidth: "600px",
//     height: "auto",
//     margin: "0 auto",
//   };

//   const headerStyle = {
//     textAlign: "center",
//     marginBottom: "20px",
//     color: "#343a40",
//   };

//   const buttonStyle = {
//     marginTop: "20px",
//     backgroundColor: "#007bff",
//     borderColor: "#007bff",
//   };

//   const calendarStyle = {
//     borderRadius: "10px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     backgroundColor: "#ffffff",
//     padding: "10px",
//   };

//   const modalBodyStyle = {
//     maxHeight: "400px",
//     overflowY: "auto",
//     padding: "20px",
//   };

//   return (
//     <div style={containerStyle}>
//       <h3 className="text-center">Instructions:</h3>
//       <p>
//         <h5 className="fw-bold">Select a Date:</h5> Use the date picker to choose the date for which you want
//         to enter your blood pressure readings.
//          <h5 className="fw-bold"> Enter Systolic and Diastolic
//         Values:</h5> Input the systolic value (the higher number) in the designated
//         field. Input the diastolic value (the lower number) in the designated
//         field. <h5 className="fw-bold">Submit the Data:</h5> Once you have entered both values, click the
//         submit button to save your readings for the selected date. By following
//         these instructions, you can accurately record your blood pressure
//         readings in the system.
//       </p>
//       <h2 style={headerStyle}>Select a Date</h2>
//       <Form className="d-flex justify-content-center">
//         <DatePicker
//           selected={selectedDate}
//           onChange={handleDateChange}
//           className="form-control"
//           dateFormat="MMMM d, yyyy"
//           calendarContainer={({ children }) => (
//             <div style={calendarStyle}>{children}</div>
//           )}
//         />
//       </Form>
//       <div className="text-center">
//         <Button variant="contained" sx={{ mt: 3 }} onClick={handleShow}>
//           Show Selected Date
//         </Button>
//       </div>
//       {/* //Modal */}
//       <Modal className="mt-5" show={showModal} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Selected Date</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p className="mb-2">Selected Date: {selectedDate.toDateString()}</p>
//           <form onSubmit={(e) => inputBP(e)}>
//             <TextField
//               fullWidth
//               onChange={(e) => setSystolic(e.target.value)}
//               label="Systolic"
//               type="number"
//               variant="outlined"
//             />
//             <TextField
//               fullWidth
//               onChange={(e) => setDiastolic(e.target.value)}
//               sx={{ mt: 3 }}
//               label="Diastolic"
//               type="number"
//               variant="outlined"
//             />
//             <Button
//               disabled={loading}
//               variant="contained"
//               sx={{ mt: 3, mr: 3 }}
//               type="submit"
//             >
//               {loading ? "Loading..." : "Add Data"}
//             </Button>
//           </form>
//           <Button
//             variant="contained"
//             onClick={bpHistory}
//             sx={{ mt: 2 }}
//             type="submit"
//           >
//             Show History
//           </Button>
//           <Button
//             variant="contained"
//             onClick={analayzeData}
//             sx={{ mt: 2, ml: 3 }}
//             type="submit"
//             disabled={disablilityForAnalayzeButton || loading}
//           >
//             {disablilityForAnalayzeButton
//               ? "Click show history to enable"
//               : "Analyze Data"}
//           </Button>
//           <div>
//             <h3 className="mt-3">ML Model Data</h3>
//             <p>{loading ? "Analayzing data...." : MLModelData}</p>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="contained" color="inherit" onClick={handleClose}>
//             Close
//           </Button>
//         </Modal.Footer>
//         <div className="text-center" style={modalBodyStyle}>
//           <h1>Patient History</h1>
//           {bpHistoryData
//             .filter((e) => {
//               const entryDate = new Date(e.date).toLocaleDateString("en-CA"); // 'en-CA' ensures the format 'YYYY-MM-DD'
//               const selectedDateStr = selectedDate.toLocaleDateString("en-CA");
//               return entryDate === selectedDateStr;
//             })
//             .map((e, i) => {
//               return (
//                 <div className="card" key={i}>
//                   <div className="card-header">History</div>
//                   <div className="card-body">
//                     <h5 className="card-title">
//                       <b>Dated:</b>{" "}
//                       {new Date(e.date).toLocaleDateString("en-CA")}
//                     </h5>
//                     <p className="card-text">
//                       Systolic: {e.systolic} Diastolic: {e.diastolic}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}

//           {bpHistoryData.filter((e) => {
//             const entryDate = new Date(e.date).toLocaleDateString("en-CA");
//             const selectedDateStr = selectedDate.toLocaleDateString("en-CA");
//             return entryDate === selectedDateStr;
//           }).length === 0 && (
//             <div className="card">
//               <div className="card-header">No Data</div>
//               <div className="card-body">
//                 <p className="card-text">
//                   No history data found for the selected date.
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Display filtered data in the desired format */}
//           {/* <h3>Filtered Data (Systolic, Diastolic):</h3>
//           <pre>
//             {JSON.stringify(
//               bpHistoryData
//                 .filter((e) => {
//                   const entryDate = new Date(e.date).toLocaleDateString(
//                     "en-CA"
//                   );
//                   const selectedDateStr =
//                     selectedDate.toLocaleDateString("en-CA");
//                   return entryDate === selectedDateStr;
//                 })
//                 .map((e) => [e.systolic, e.diastolic]),
//               null,
//               2
//             )}
//           </pre> */}
//         </div>
//       </Modal>
//       {/* Toastify */}
//       <ToastContainer
//         position="top-center"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//     </div>
//   );
// }
