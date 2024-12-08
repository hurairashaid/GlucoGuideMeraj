import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import PatientHomePage from "../patientComponents/PatientHomePage";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import SelectDate from "../patientComponents/SelectDate";
import { Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import PatientProfile from "../patientComponents/PatientProfile";
import EditProfile from "../patientComponents/EditProfile";
import axios from "axios";
import { BaseURL } from "../apiBaseURL/BaseURL";
import UploadMedicalDocument from "../patientComponents/UploadMedicalDocument";
import DietarySuggestion from "../patientComponents/DietarySuggestion";
import Appointment from "../patientComponents/Appointment";
import Prediction from "../patientComponents/Prediction";
import Contact from "../patientComponents/Contact";
import Faqs from "../patientComponents/Faqs";

const routes = [
  {
    name: "Home",
    path: "patientHome",
    element: <PatientHomePage />,
  },
  {
    name: "Calender",
    path: "selectDate",
    element: <SelectDate />,
  },
  {
    name: "Prediction",
    path: "prediction",
    element: <Prediction />,
  },
  {
    name: "Upload Medical Documents",
    path: "uploadmedicaldocuments",
    element: <UploadMedicalDocument />,
  },
  {
    name: "Dietary Suggestions",
    path: "dietarySuggestions",
    element: <DietarySuggestion />,
  },
  {
    name: "Appointment",
    path: "appointment",
    element: <Appointment />,
  },
  {
    name: "Frequently Asked Question",
    path: "faqs",
    element: <Faqs />,
  },
  {
    name: "Contact Us",
    path: "contact",
    element: <Contact />,
  },
];

const profileRoutes = [
  {
    name: "My Profile",
    path: "profile",
    element: <PatientProfile />,
  },
];

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [selectedRoute, setSelectedRoute] = React.useState("");
  const [profileData, setProfileData] = React.useState({});
  const [open, setOpen] = React.useState(false);
  //Decoding the token
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  const profileDataLocalStorage = localStorage.setItem(
    "profile data",
    JSON.stringify(profileData)
  );
  //Getting profile data from Api
  const getProfile = async () => {
    //Getting token from local storage
    const token = JSON.parse(localStorage.getItem("token"));
    // console.log("token", token);
    try {
      const res = await axios.get(`${BaseURL}/viewprofile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res.data.data);
      setProfileData(res.data.data);
    } catch (error) {
      console.log("error: ", error);
    }
  };
  React.useEffect(() => {
    getProfile();
  }, []);

  React.useEffect(() => {
    // Retrieve the saved route name from localStorage when the component mounts
    const savedRoute = localStorage.getItem("selectedRoute");
    if (savedRoute) {
      setSelectedRoute(savedRoute);
    }
  }, []);

  const handleRouteClick = (routeName) => {
    setSelectedRoute(routeName);
    localStorage.setItem("selectedRoute", routeName); // Save the selected route name to localStorage
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();
  const navigateHandler = (path) => {
    navigate(path);
  };
  const placeholderPic = "https://via.placeholder.com/100";
  const imageUrl =
    profileData && profileData.profilePic
      ? profileData.profilePic
      : placeholderPic;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        style={{ backgroundColor: "purple" }}
        position="fixed"
        open={open}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div"></Typography>
          <Typography variant="h6" noWrap component="div">
            {selectedRoute ? `${selectedRoute} Page` : "Patient Dashboard"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <img
          className="rounded-pill"
          src={imageUrl}
          alt="Profile Picture"
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            marginLeft: "30%",
          }} // Optional styling
        />
        <p className="text-center fw-bold">{profileData.name}</p>
        <div className="d-flex justify-content-center">
          <Button
            variant="outlined"
            className="w-auto"
            style={{ color: "purple" }}
          >
            <Link
              type="button"
              className="text-decoration-none"
              to="/dashboard/editprofile"
              style={{ color: "purple" }}
            >
              Edit Profile
            </Link>
          </Button>
        </div>
        <List>
          {/* //Mapping the routes for the admin dashboard */}
          {routes.map((route, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigateHandler(route.path);
                  handleRouteClick(route.name);
                }}
              >
                <ListItemIcon>
                  {index === 0 && (
                    <i
                      style={{ fontSize: "25px" }}
                      className="fa-solid fa-house"
                    ></i>
                  )}
                  {index === 1 && (
                    <i
                      style={{ fontSize: "25px" }}
                      className="fa-solid fa-calendar-check"
                    ></i>
                  )}
                  {index === 2 && (
                    <i
                      style={{ fontSize: "25px" }}
                      className="fa-solid fa-clock-o"
                    ></i>
                  )}
                  {index === 3 && (
                    <>
                      <i
                        style={{ fontSize: "25px" }}
                        className="fa-solid fa-file"
                      ></i>
                    </>
                  )}
                  {index === 4 && (
                    <>
                      <i
                        style={{ fontSize: "25px" }}
                        className="fa-solid fa-bowl-food"
                      ></i>
                    </>
                  )}
                  {index === 5 && (
                    <>
                      <i
                        style={{ fontSize: "25px" }}
                        className="fa-solid fa-sticky-note"
                      ></i>
                    </>
                  )}

                  {index === 6 && (
                    <>
                      <i
                        style={{ fontSize: "25px" }}
                        className="fa-solid fa-question-circle"
                      ></i>
                    </>
                  )}
                  {index === 7 && (
                    <>
                      <i
                        style={{ fontSize: "25px" }}
                        className="fa-solid fa-phone"
                      ></i>
                    </>
                  )}
                </ListItemIcon>
                <ListItemText primary={route.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* //Dividers */}
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        {/* //Dividers */}
        <List>
          {/* //Mapping the routes for the Profile dashboard */}
          {profileRoutes.map((route, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigateHandler(route.path);
                  handleRouteClick(route.name);
                }}
              >
                <ListItemIcon>
                  {index === 0 && (
                    <i
                      style={{ fontSize: "25px" }}
                      className="fa-solid fa-user"
                    ></i>
                  )}
                </ListItemIcon>
                <ListItemText primary={route.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* //Logout button */}
        <Button
          sx={{
            margin: "auto",
            display: "block",
            marginTop: "20px",
            backgroundColor: "purple",
          }}
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("profile data");
            localStorage.removeItem("MLModelData");
            localStorage.removeItem("selectedRoute");
            localStorage.removeItem("email");
            navigate("/login");
          }}
          variant="contained"
        >
          Logout
        </Button>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {/* // Routes for the admin dashboard */}
        <Routes>
          <Route path="/patientHome" element={<PatientHomePage />} />
          <Route path="/selectDate" element={<SelectDate />} />
          <Route path="/prediction" element={<Prediction />} />

          <Route path="/profile" element={<PatientProfile />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route
            path="/Uploadmedicaldocuments"
            element={<UploadMedicalDocument />}
          />
          <Route path="/dietarySuggestions" element={<DietarySuggestion />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faqs" element={<Faqs />} />
        </Routes>
      </Main>
    </Box>
  );
}
