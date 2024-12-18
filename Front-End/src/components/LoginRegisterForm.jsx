import React, { useState } from "react";

const LoginRegisterForm = ({ onLogin }) => {
  const [formType, setFormType] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login button clicked");
    if (onLogin) {
      // Ensure onLogin is defined
      onLogin(); // Invoke the parent callback
    } else {
      console.error("onLogin is not defined!");
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
