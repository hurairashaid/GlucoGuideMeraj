import React, { useEffect, useState } from "react";
import { Button, TextField, Container, Box, List } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { BaseURL } from "../apiBaseURL/BaseURL";
import { toast, ToastContainer } from "react-toastify";

const UploadMedicalDocument = () => {
  const [medicalDocument, setMedicalDocument] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const addDocument = async (e) => {
    e.preventDefault();
    if (!medicalDocument) {
      toast.error("Please select a document to upload");
      return;
    }
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.post(
        `${BaseURL}/user/uploaddocument`,
        { medicalDocument },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Document Added Successfully");
      setLoading(false);
      setMedicalDocument(""); // Clear the selected document
      getAllDocuments(); // Refresh the list of documents
      console.log(res.data);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const getAllDocuments = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.get(`${BaseURL}/user/getdocuments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDocuments(res.data.data);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const deleteDocument = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      await axios.delete(`${BaseURL}/document/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDocuments((prevDocuments) =>
        prevDocuments.filter((document) => document._id !== id)
      );
      toast.success("Document Deleted Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to Delete Document");
    }
  };

  useEffect(() => {
    getAllDocuments();
  }, [refresh]);

  return (
    <Container className="mt-5">
      <Box
        className="text-center"
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <form onSubmit={(e) => addDocument(e)}>
          <h2 className="mb-4">Upload Medical Document</h2>
          <TextField
            onChange={(e) => setMedicalDocument(e.target.files[0])}
            fullWidth
            name="profilePic"
            type="file"
            id="password"
          />
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={loading}
            style={{ padding: "10px 20px", marginTop: 37 }}
          >
            {loading ? "Uploading..." : "Upload Document"}
          </Button>
        </form>
      </Box>
      {/* Displaying the uploaded documents */}
      <Box
        className="mt-4"
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 className="mb-4">Uploaded Documents</h3>
        <List>
          {documents?.map((e, i) => (
            <div key={i}>
              <h4>{i + 1} Medical Document</h4>
              <div className="row">
                <div className="col-md-4">
                  <img width={"100%"} src={e.document} alt="" />
                  <Button
                    onClick={() => deleteDocument(e._id)}
                    variant="contained"
                    sx={{ mt: 3 }}
                    color="error"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </List>
      </Box>
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
    </Container>
  );
};

export default UploadMedicalDocument;