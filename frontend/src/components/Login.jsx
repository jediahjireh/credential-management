// src/components/Login.jsx

// import dependencies
import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { loginUser } from "../api.jsx";

// cookie package that helps share variable across application
import Cookies from "universal-cookie";
// new cookie instance
const cookies = new Cookies();

const Login = () => {
  // state for form data and error message
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);

  // handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser(formData);

    if (data.success) {
      // make cookie available on all pages
      cookies.set("TOKEN", data.token, {
        path: "/",
      });
      // redirect user to the dashboard and refresh webpage
      window.location.href = "/dashboard";
      // notify user of login attempt result
      alert("User successfully logged in!");
    } else {
      setError(data.message);
    }
  };

  // render the login form
  return (
    <div className="login-form bg-dark text-white min-vh-100">
      <h2>Login to the management system:</h2>
      <br />
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <br />
        <Button variant="primary" type="submit" style={{ width: "50%" }}>
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
