import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditNoteIcon from "@mui/icons-material/EditNote";
import axios from "axios";
import { BaseURL } from "../apiBaseURL/BaseURL";
import { toast, ToastContainer } from "react-toastify";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function EditProfile() {
  //States
  const [name, setName] = React.useState("");
  const [age, setAge] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [profilePic, setProfilePic] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  //Edit Profile Function
  const editProfile = async (event) => {
    event.preventDefault();
    //Getting token from local storage
    const token = JSON.parse(localStorage.getItem("token"));
    console.log("token", token);
    if (!name || !age || !weight || !height || !profilePic) {
      toast.error("All Fields are Required");
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${BaseURL}/user/editprofile`,
        {
          name: name,
          age: age,
          weight: weight,
          height: height,
          profilePic: profilePic,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === "failed") {
        setLoading(false);
      } else {
        toast.success("Profile Edited Successfully");
        setLoading(false);
      }
      console.log(res.data);
      setRefresh(!refresh);
    } catch (error) {
      setLoading(false);
      console.log("error: ", error);
    }
  };

  React.useEffect(() => {
    const data = JSON.parse(localStorage.getItem("profile data"));
    console.log(
      "profile data",
      JSON.parse(localStorage.getItem("profile data"))
    );
    setName(data?.name);
    setAge(data?.age);
    setWeight(data?.weight);
    setHeight(data?.height);
    // setProfilePic(data?.profilePic);
  }, [refresh]);
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <EditNoteIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Edit Profile
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={editProfile}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              {/* //Name Field */}
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setName(e.target.value)}
                  required
                  value={name}
                  label="Name"
                  fullWidth
                  id="name"
                  name="name"
                  autoComplete="name"
                />
              </Grid>
              {/* //Age Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  onChange={(e) => setAge(e.target.value)}
                  name="age"
                  value={age}
                  required
                  fullWidth
                  id="age"
                  type="number"
                  label="Age"
                  autoFocus
                />
              </Grid>
              {/* //Weight Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  onChange={(e) => setWeight(e.target.value)}
                  fullWidth
                  id="weight"
                  value={weight}
                  label="Weight"
                  type="number"
                  name="weight"
                />
              </Grid>
              {/* //Height Field */}
              <Grid item xs={12}>
                <TextField
                  required
                  onChange={(e) => setHeight(e.target.value)}
                  fullWidth
                  value={height}
                  type="number"
                  id="height"
                  label="height"
                  name="height"
                />
              </Grid>
              {/* //Upload Profile Picture */}
              <Grid item xs={12}>
                <TextField
                  required
                  onChange={(e) => setProfilePic(e.target.files[0])}
                  fullWidth
                  name="profilePic"
                  // value={profilePic}
                  type="file"
                  id="password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          </Box>
        </Box>
      </Container>
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
    </ThemeProvider>
  );
}
