// src/App.jsx

// import dependencies
import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import {
  Link,
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Cookies from "universal-cookie";
import { fetchUsers } from "./api.jsx";
import Dashboard from "./components/Dashboard.jsx";
import LandingPage from "./components/LandingPage.jsx";
import Login from "./components/Login.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import Register from "./components/Register.jsx";

// create a new cookie instance
const cookies = new Cookies();

const App = () => {
  // state for user data
  const [user, setUser] = useState(null);

  // use effect to fetch user data
  useEffect(() => {
    const token = cookies.get("TOKEN");
    if (token) {
      fetchUsers().then((data) => setUser(data));
    }
  }, []);

  // handle logout
  const handleLogout = () => {
    cookies.remove("TOKEN");
    setUser(null);
    // reload page for navbar links to be rendered correctly
    window.location.reload();
  };

  // render the app
  return (
    <div>
      <Router>
        <Navbar
          bg="dark"
          variant="dark"
          style={{ zIndex: 10, position: "relative" }}
        >
          <Container>
            <Navbar.Brand as={Link} to="/">
              Cool Tech
            </Navbar.Brand>
            <Nav className="me-auto">
              {cookies.get("TOKEN") ? (
                <>
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <Link to="/" className="nav-link" onClick={handleLogout}>
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </>
              )}
            </Nav>
            {user && (
              <Navbar.Text className="text-light ms-auto">
                <span style={{ fontFamily: "cursive" }}>
                  Welcome, {user.username}!
                </span>
                <span style={{ color: "lightgrey", fontSize: "smaller" }}>
                  {" "}
                  ({user.role})
                </span>
              </Navbar.Text>
            )}
          </Container>
        </Navbar>
        <Container fluid style={{ padding: 0, margin: 0 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Dashboard user={user} />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

// export App component
export default App;
