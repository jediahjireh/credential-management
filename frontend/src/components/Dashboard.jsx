// src/components/Dashboard.jsx

// import dependencies
import React from "react";
import { Tab, Tabs } from "react-bootstrap";
// import icons
import { FaFolder, FaUser } from "react-icons/fa";
// import components
import OrganisationalUnits from "./OrganisationalUnits.jsx";
import Users from "./Users.jsx";

const Dashboard = ({ user }) => {
  // check user role
  const isAdmin = user?.role === "admin";
  const isNormal = user?.role === "normal";
  const isManagement = user?.role === "management";

  // determine user permissions
  const organisationalUnitsPermissions = isAdmin || isNormal || isManagement;
  const usersPermissions = isAdmin;

  // render dashboard
  return (
    <div className="dashboard bg-dark text-white min-vh-100">
      <div className="management-tabs">
        {/* render tabs */}
        <Tabs
          defaultActiveKey="organisationalUnits"
          id="dashboard-tabs"
          className="mb-3"
        >
          {/* Organisational Units tab */}
          {organisationalUnitsPermissions && (
            <Tab
              eventKey="organisationalUnits"
              title={
                <>
                  <FaFolder /> Credential Management
                </>
              }
            >
              <OrganisationalUnits user={user} />
            </Tab>
          )}

          {/* Users tab (only for admins) */}
          {usersPermissions && (
            <Tab
              eventKey="users"
              title={
                <>
                  <FaUser /> User Management
                </>
              }
            >
              <Users />
            </Tab>
          )}
        </Tabs>
      </div>
    </div>
  );
};

// export component
export default Dashboard;
