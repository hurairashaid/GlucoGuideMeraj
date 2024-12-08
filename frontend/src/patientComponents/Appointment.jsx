import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Modal,
  CircularProgress,
  Alert,
} from "@mui/material";
import { BaseURL } from "../apiBaseURL/BaseURL"; // Import the base URL

const Appointment = () => {
  const [doctorName, setDoctorName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [refresh, setRefresh] = useState(false);
  // Fetch appointments from the API
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const response = await axios.get(`${BaseURL}/appointment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.data);
      setAppointments(response.data.data);
      setRefresh(!refresh);
    } catch (error) {
      setError("Error fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (currentAppointment) {
      setDoctorName(currentAppointment.doctor);
      setClinicAddress(currentAppointment.address);
      setTime(currentAppointment.time);
      setDate(currentAppointment.date);
    }
  }, [currentAppointment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!doctorName || !clinicAddress || !time || !date) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const response = await axios.post(
        `${BaseURL}/appointment`,
        {
          doctor: doctorName,
          address: clinicAddress,
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      setAppointments([...appointments, response.data]);
      setDoctorName("");
      setClinicAddress("");
      setTime("");
      setDate("");
      setSuccess("Appointment added successfully");
      fetchAppointments()
    } catch (error) {
      setError("Error adding appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (appointment) => {
    setCurrentAppointment(appointment);
    setOpenUpdateModal(true);
  };

  const handleDelete = (appointment) => {
    setCurrentAppointment(appointment);
    setOpenDeleteModal(true);
  };

  const handleUpdateSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!doctorName || !clinicAddress || !time || !date) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    const token = JSON.parse(localStorage.getItem("token"));
    console.log("Token:", token); // Debugging token

    try {
      const response = await axios.patch(
        `${BaseURL}/appointment/${currentAppointment._id}`,
        {
          doctor: doctorName,
          address: clinicAddress,
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Update Response:", response.data); // Debugging response

      setAppointments(
        appointments.map((app) =>
          app._id === currentAppointment._id ? response.data : app
        )
      );
      setSuccess("Appointment updated successfully");
      fetchAppointments()
    } catch (error) {
      console.error("Update Error:", error); // Debugging error
      setError("Error updating appointment");
    } finally {
      setLoading(false);
      setOpenUpdateModal(false);
      setDoctorName("");
      setClinicAddress("");
      setTime("");
      setDate("");
    }
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = JSON.parse(localStorage.getItem("token"));
    try {
      await axios.delete(`${BaseURL}/appointment/${currentAppointment._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(appointments.filter((app) => app._id !== currentAppointment._id));
      setSuccess("Appointment deleted successfully");
    } catch (error) {
      setError("Error deleting appointment");
    } finally {
      setLoading(false);
      setOpenDeleteModal(false);
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Appointment
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Doctor Name"
              name="doctorName"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              variant="outlined"
              error={!!error && !doctorName}
              helperText={!!error && !doctorName ? "Doctor Name is required" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Clinic Address"
              name="clinicAddress"
              value={clinicAddress}
              onChange={(e) => setClinicAddress(e.target.value)}
              variant="outlined"
              error={!!error && !clinicAddress}
              helperText={!!error && !clinicAddress ? "Clinic Address is required" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Time"
              name="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!error && !time}
              helperText={!!error && !time ? "Time is required" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!error && !date}
              helperText={!!error && !date ? "Date is required" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save Appointment"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Typography
        variant="h5"
        align="center"
        gutterBottom
        color="secondary"
        sx={{ mt: 5 }}
      >
        All Appointments
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {appointments.map((appointment, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="secondary">
                    Doctor Name: {appointment.doctor}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Clinic Address: {appointment.address}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Time: {appointment.time}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Date: {appointment.date}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdate(appointment)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(appointment)}
                    sx={{ ml: 2 }}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Update Modal */}
      <Modal open={openUpdateModal} onClose={() => setOpenUpdateModal(false)}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6" gutterBottom>
            Update Appointment
          </Typography>
          <TextField
            fullWidth
            label="Doctor Name"
            name="doctorName"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
            error={!!error && !doctorName}
            helperText={!!error && !doctorName ? "Doctor Name is required" : ""}
          />
          <TextField
            fullWidth
            label="Clinic Address"
            name="clinicAddress"
            value={clinicAddress}
            onChange={(e) => setClinicAddress(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
            error={!!error && !clinicAddress}
            helperText={!!error && !clinicAddress ? "Clinic Address is required" : ""}
          />
          <TextField
            fullWidth
            label="Time"
            name="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
            error={!!error && !time}
            helperText={!!error && !time ? "Time is required" : ""}
          />
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
            error={!!error && !date}
            helperText={!!error && !date ? "Date is required" : ""}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </Box>
      </Modal>

      {/* Delete Modal */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete?
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Yes, Delete"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDeleteModal(false)}
            sx={{ ml: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default Appointment;