import React, { useState } from "react";

const LoginRegisterForm = ({ onLogin }) => {
  const [formType, setFormType] = useState("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint =
        formType === "login"
          ? "http://localhost:8080/login"
          : "http://localhost:8080/registry";

      const body =
        formType === "login"
          ? { username, password }
          : { email, username, password };

      console.log("Request payload:", body);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Inform the server that we're sending JSON
        },
        credentials: "include", // Allow cookies
        body: JSON.stringify(body), // Send the correct payload
      });

      console.log("Raw response:", response);

      if (!response.ok) {
        // Handle non-2xx responses
        const responseText = await response.text(); // Read response as text
        console.error("Error response text:", responseText);
        throw new Error(
          responseText || `Request failed with status ${response.status}`
        );
      }

      // If the server sends no body or plain text, skip JSON parsing
      const contentType = response.headers.get("Content-Type");
      let data = null;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json(); // Parse JSON if Content-Type is application/json
      } else {
        console.log("Server returned non-JSON response or empty body");
        data = await response.text(); // Fallback to text if not JSON
      }

      console.log(
        formType === "login" ? "Login successful:" : "Registration successful:",
        data
      );

      if (formType === "login" && onLogin) {
        onLogin(data); // Pass user data to the parent
      } else if (formType === "register") {
        alert("Registration successful! You can now log in.");
        setFormType("login"); // Switch to login form
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1>{formType === "login" ? "Login" : "Register"}</h1>
      <form onSubmit={handleSubmit}>
        {formType === "register" && (
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", margin: "8px 0" }}
            />
          </div>
        )}
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />
        </div>
        <button
          type="submit"
          style={{ padding: "10px 20px", margin: "10px 0" }}
        >
          {formType === "login" ? "Login" : "Register"}
        </button>
      </form>
      <p>
        {formType === "login"
          ? "Don't have an account?"
          : "Already have an account?"}
        <button
          onClick={() =>
            setFormType(formType === "login" ? "register" : "login")
          }
          style={{
            marginLeft: "10px",
            background: "none",
            border: "none",
            color: "blue",
            cursor: "pointer",
          }}
        >
          {formType === "login" ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default LoginRegisterForm;
