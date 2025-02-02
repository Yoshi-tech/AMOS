import React from "react";

const AboutPage = () => {
  return (
    <div
      style={{
        margin: "20px auto",
        padding: "20px",
        maxWidth: "90%", // Ensure it fits within the screen
        width: "800px", // Cap the width for larger screens
        backgroundColor: "#2f2f2f", // Dark gray
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
        color: "#d3d3d3", // Light gray
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "20px", color: "#64c261" }}>
        Welcome to A.M.O.S.
      </h1>
      <p
        style={{
          fontSize: "1.1rem",
          lineHeight: "1.8",
          textAlign: "justify",
          color: "#d3d3d3",
        }}
      >
        A.M.O.S. (Adaptable Modular Organization System) is a revolutionary
        system designed to help you manage, visualize, and organize your
        workspace efficiently. Whether you're working on projects, organizing
        inventory, or just trying to bring structure to your workflow, A.M.O.S.
        is here to adapt to your needs.
      </p>
      <div style={{ marginTop: "20px" }}>
        <button
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: "#64c261", // Light green
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#4e7f4c")} // Dark green on hover
          onMouseOut={(e) => (e.target.style.backgroundColor = "#64c261")} // Back to light green
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
