import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
} from "@mui/material";
import { BaseURL } from "../apiBaseURL/BaseURL";

const PatientProfile = () => {
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const getProfileData = async () => {
      const token = JSON.parse(localStorage.getItem("token"));
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
    getProfileData();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom color="secondary">
        Patient Profile
      </Typography>
      <Grid container justifyContent="center">
        <Grid
          style={{ display: "flex", justifyContent: "center" }}
          item
          xs={12}
          md={6}
          textAlign="center"
          justifyContent="center"
        >
          <Avatar
            src={profileData.profilePic}
            alt="Profile Picture"
            sx={{ width: 150, height: 150, mb: 3 }}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <CardContent>
              <Typography variant="h6" color="secondary">
                Name: {profileData.name}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Age: {profileData.age}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Weight: {profileData.weight}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Height: {profileData.height}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Diabetes Status: {profileData.haveDiabetes}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Prediabetes Status: {profileData.havePreDiabetes}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Are you active: {profileData.areYouActive}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Do you check BP daily: {profileData.checkBPdialy}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Your lifestyle: {profileData.lifeStyle}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientProfile;
