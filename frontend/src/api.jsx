// src/api.jsx
// cookie package
import Cookies from "universal-cookie";
const cookies = new Cookies();
const token = cookies.get("TOKEN");

// fetch user data from API
export const fetchUsers = async () => {
  const response = await fetch("/api/user/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// fetch organisational unit data from API
export const fetchOUs = async () => {
  const response = await fetch("/api/ou/organisational-units", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// add a new credential
export const addCredential = async (data) => {
  const response = await fetch("/api/ou/add-credential", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

// update credentials
export const updateCredentials = async (data) => {
  const response = await fetch("/api/ou/update-credentials", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

// assign a user to an organisational unit
export const assignOU = async (data) => {
  const response = await fetch("/api/ou/assign-ou", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

// assign a user to a division
export const assignDivision = async (data) => {
  const response = await fetch("/api/ou/assign-division", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

// unassign a user from an organisational unit
export const unassignOU = async (data) => {
  const response = await fetch("/api/ou/unassign-ou", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

// unassign a user from a division
export const unassignDivision = async (data) => {
  const response = await fetch("/api/ou/unassign-division", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

// login user
export const loginUser = async (formData) => {
  try {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login request failed:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
};

// register user
export const registerUser = async (data) => {
  const response = await fetch("/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

// change user role
export const changeRole = async (data) => {
  const response = await fetch("/api/user/change-role", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};
