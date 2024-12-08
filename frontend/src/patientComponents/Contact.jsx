import React from "react";
import aboutpage from "../../src/assets/diabetic.png";

function Contact() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "80%",
          maxWidth: "1200px",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <p>
            We’re here to help you with any questions or support you need. Feel
            free to reach out to us via phone or email, and we’ll get back to
            you as soon as possible.
          </p>
          <p>
            <b>Phone:</b> +971 4 123 4567
          </p>
          <p>
            <b>Email:</b> abytesting31242@gmail.com
          </p>
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "20px",
          }}
        >
          <img
            src={aboutpage} // Replace with your image URL
            alt="Contact"
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
              borderRadius: "8px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Contact;
