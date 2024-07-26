// src/components/Users.jsx

// import dependencies
import React, { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownHeader,
  Modal,
  Table,
} from "react-bootstrap";
// import icons
import {
  FaFolderMinus,
  FaFolderPlus,
  FaUserEdit,
  FaUserMinus,
  FaUserPlus,
} from "react-icons/fa";
import {
  assignDivision,
  assignOU,
  changeRole,
  fetchOUs,
  fetchUsers,
  unassignDivision,
  unassignOU,
} from "../api.jsx";

const Users = () => {
  // state for users, organisational units, selected user and modal settings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState({ admin: [], management: [], normal: [] });
  // initialise as an array
  const [OUs, setOUs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOU, setSelectedOU] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [showModal, setShowModal] = useState(false);

  // fetch users on mount
  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers({
          normal: usersData.normal || [],
          management: usersData.management || [],
          admin: usersData.admin || [],
        });
      } catch (err) {
        setError(err.message || "Failed to fetch users");
      }
    };
    fetchUsersData();
  }, []);

  // fetch organisational units on mount
  useEffect(() => {
    const fetchOUsData = async () => {
      try {
        const ouData = await fetchOUs();
        // ensure OUs is an array
        setOUs(
          Array.isArray(ouData.organisationalUnits)
            ? ouData.organisationalUnits
            : []
        );
      } catch (err) {
        setError(err.message || "Failed to fetch organisational units");
      } finally {
        setLoading(false);
      }
    };
    fetchOUsData();
  }, []);

  // handle loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // open modal and set action
  const handleOpenModal = (user, action) => {
    setSelectedUser(user);
    setModalAction(action);
    setShowModal(true);
  };

  // close modal and reset state
  const handleCloseModal = () => {
    // hide the modal
    setShowModal(false);

    // clear the selected user
    setSelectedUser(null);
    // clear the selected OU
    setSelectedOU(null);
    // clear the selected division
    setSelectedDivision(null);
    // clear the new role
    setNewRole("");
    // clear the modal action
    setModalAction("");
  };

  // refresh users data
  const refreshUsersData = async () => {
    try {
      const usersData = await fetchUsers();
      setUsers({
        normal: usersData.normal,
        management: usersData.management,
        admin: usersData.admin,
      });

      // reset modal state
      handleCloseModal();
    } catch (error) {
      console.error("Error refreshing users data:", error);
    }
  };

  // handle actions for divisions and OUs
  const handleAction = async () => {
    // user corresponding with edit action
    if (selectedUser) {
      try {
        switch (modalAction) {
          // assign user to division in an OU
          case "assignDivision":
            if (selectedDivision && selectedOU) {
              await assignDivision({
                userName: selectedUser.username,
                ouName: selectedOU,
                divisionName: selectedDivision,
              });
            }
            break;

          // unassign user from division in an OU
          case "unassignDivision":
            if (selectedDivision && selectedOU) {
              await unassignDivision({
                userName: selectedUser.username,
                ouName: selectedOU,
                divisionName: selectedDivision,
              });
            }
            break;

          // change user role
          case "changeRole":
            if (newRole && newRole !== selectedUser.role) {
              await changeRole({
                selectedUserName: selectedUser.username,
                selectedRole: newRole,
              });
            }
            break;

          // assign user to an OU
          case "assignOU":
            if (selectedOU) {
              await assignOU({
                userName: selectedUser.username,
                ouName: selectedOU,
              });
            }
            break;

          // unassign user from an OU
          case "unassignOU":
            if (selectedOU) {
              await unassignOU({
                userName: selectedUser.username,
                ouName: selectedOU,
              });
            }
            break;
          // else
          default:
            break;
        }

        // reset states
        handleCloseModal();
        // refresh data
        refreshUsersData();
      } catch (error) {
        console.error(`Error handling ${modalAction}:`, error);
      }
    }
  };

  // render modal content based on action
  const renderModalContent = () => {
    if (!selectedUser) return null;

    switch (modalAction) {
      case "assignDivision":
        // display modal for assigning user to a division
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                Assign <i>{selectedUser.username}</i> to division of OU
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* show dropdown to select organisational unit */}
              <DropdownHeader>Organisational Unit:</DropdownHeader>
              <Dropdown onSelect={(ou) => setSelectedOU(ou)}>
                <Dropdown.Toggle variant="dark">
                  {selectedOU ? selectedOU : "Select OU"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {OUs.length === 0 ? (
                    <Dropdown.Item disabled>
                      No organisational units available.
                    </Dropdown.Item>
                  ) : (
                    OUs.map((ou) => (
                      <Dropdown.Item key={ou.ouName} eventKey={ou.ouName}>
                        {ou.ouName}
                      </Dropdown.Item>
                    ))
                  )}
                </Dropdown.Menu>
              </Dropdown>

              {/* show dropdown to select division based on selected OU */}
              {selectedOU && (
                <Dropdown
                  onSelect={(division) => setSelectedDivision(division)}
                >
                  <DropdownHeader>Division:</DropdownHeader>
                  <Dropdown.Toggle variant="dark">
                    {selectedDivision ? selectedDivision : "Select Division"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {OUs.find((ou) => ou.ouName === selectedOU)?.divisions
                      ?.length === 0 ? (
                      <Dropdown.Item disabled>
                        No divisions available.
                      </Dropdown.Item>
                    ) : (
                      OUs.find(
                        (ou) => ou.ouName === selectedOU
                      )?.divisions?.map((division) => (
                        <Dropdown.Item
                          key={division.divisionName}
                          eventKey={division.divisionName}
                        >
                          {division.divisionName}
                        </Dropdown.Item>
                      ))
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button variant="success" onClick={handleAction}>
                Assign
              </Button>
            </Modal.Footer>
          </>
        );

      case "unassignDivision":
        // display modal for unassigning user from a division
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                Unassign <i>{selectedUser.username}</i> from division of OU
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* show dropdown to select organisational unit */}
              <DropdownHeader>Organisational Unit:</DropdownHeader>
              <Dropdown onSelect={(ou) => setSelectedOU(ou)}>
                <Dropdown.Toggle variant="dark">
                  {selectedOU ? selectedOU : "Select OU"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {selectedUser.organisationalUnits.length === 0 ? (
                    <Dropdown.Item disabled>
                      User is not assigned to any organisational units.
                    </Dropdown.Item>
                  ) : (
                    selectedUser.organisationalUnits.map((ou) => (
                      <Dropdown.Item key={ou.ouName} eventKey={ou.ouName}>
                        {ou.ouName}
                      </Dropdown.Item>
                    ))
                  )}
                </Dropdown.Menu>
              </Dropdown>

              {/* show dropdown to select division based on selected OU */}
              {selectedOU && (
                <Dropdown
                  onSelect={(division) => setSelectedDivision(division)}
                >
                  <DropdownHeader>Division:</DropdownHeader>
                  <Dropdown.Toggle variant="dark">
                    {selectedDivision ? selectedDivision : "Select Division"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {selectedUser.organisationalUnits.find(
                      (ou) => ou.ouName === selectedOU
                    )?.divisions?.length === 0 ? (
                      <Dropdown.Item disabled>
                        No divisions available.
                      </Dropdown.Item>
                    ) : (
                      selectedUser.organisationalUnits
                        .find((ou) => ou.ouName === selectedOU)
                        ?.divisions?.map((division) => (
                          <Dropdown.Item
                            key={division.divisionName}
                            eventKey={division.divisionName}
                          >
                            {division.divisionName}
                          </Dropdown.Item>
                        ))
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button variant="danger" onClick={handleAction}>
                Unassign
              </Button>
            </Modal.Footer>
          </>
        );

      case "changeRole":
        // display modal for changing user's role
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                Change <i>{selectedUser.username}'s</i> Role:
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Dropdown onSelect={setNewRole}>
                <Dropdown.Toggle variant="dark">
                  {newRole ? newRole : "Select Role"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {["normal", "management", "admin"].map((role) => (
                    <Dropdown.Item
                      key={role}
                      eventKey={role}
                      disabled={role === selectedUser.role}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button variant="warning" onClick={handleAction}>
                Change
              </Button>
            </Modal.Footer>
          </>
        );

      case "assignOU":
        // display modal for assigning user to an organisational unit
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                Assign <i>{selectedUser.username}</i> to Organisational Unit:
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Dropdown
                onSelect={(ou) => {
                  setSelectedOU(ou);
                }}
              >
                <Dropdown.Toggle variant="dark">
                  {selectedOU ? selectedOU : "Select OU"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {OUs.length === 0 ? (
                    <Dropdown.Item disabled>
                      No organisational units available.
                    </Dropdown.Item>
                  ) : (
                    OUs.map((ou) => (
                      <Dropdown.Item key={ou.ouName} eventKey={ou.ouName}>
                        {ou.ouName}
                      </Dropdown.Item>
                    ))
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button variant="success" onClick={handleAction}>
                Assign
              </Button>
            </Modal.Footer>
          </>
        );

      case "unassignOU":
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                Unassign <i>{selectedUser.username}</i> from Organisational
                Unit:
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Dropdown
                onSelect={(ou) => {
                  setSelectedOU(ou);
                }}
              >
                <Dropdown.Toggle variant="dark">
                  {selectedOU ? selectedOU : "Select OU"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {selectedUser.organisationalUnits.length === 0 ? (
                    <Dropdown.Item disabled>
                      User is not assigned to any organisational units.
                    </Dropdown.Item>
                  ) : (
                    selectedUser.organisationalUnits.map((ou) => (
                      <Dropdown.Item key={ou.ouName} eventKey={ou.ouName}>
                        {ou.ouName}
                      </Dropdown.Item>
                    ))
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button variant="danger" onClick={handleAction}>
                Unassign
              </Button>
            </Modal.Footer>
          </>
        );
      default:
        return null;
    }
  };

  // render users in table format
  return (
    <div>
      <Table
        className="table-dark"
        striped
        bordered
        hover
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            {/* column headings */}
            <th>Username</th>
            <th>Email</th>
            <th>Organisational Units</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* group by user role */}
          {["admin", "management", "normal"].map((role) => (
            <React.Fragment key={role}>
              {users[role].length > 0 ? (
                <>
                  <tr>
                    <td colSpan="4">
                      <strong>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </strong>
                    </td>
                  </tr>
                  {/* loop through user details */}
                  {users[role].map((user) => (
                    <tr key={user.username}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        {/* display OUs user is assigned to */}
                        {user.organisationalUnits &&
                        user.organisationalUnits.length === 0
                          ? "User is not assigned to any organisational units."
                          : user.organisationalUnits.map((ou) => (
                              <div key={ou.ouName}>
                                <strong>
                                  <i>{ou.ouName}</i>
                                </strong>
                                <br />
                                {/* display divisions within OU that user is assigned to */}
                                {ou.divisions && ou.divisions.length === 0
                                  ? "User is not assigned to any divisions within this organisational unit."
                                  : ou.divisions.map((division) => (
                                      <span key={division.divisionName}>
                                        <ul style={{ textAlign: "left" }}>
                                          <li>{division.divisionName}</li>
                                        </ul>
                                      </span>
                                    ))}
                                <hr />
                              </div>
                            ))}
                      </td>
                      <td>
                        {/* buttons for managing user access */}
                        <div className="action-buttons">
                          {/* button to assign user to division within an OU */}
                          <Button
                            variant="success"
                            className="action-button"
                            onClick={() =>
                              handleOpenModal(user, "assignDivision")
                            }
                          >
                            <FaFolderPlus />
                          </Button>
                          <br />
                          <br />
                          {/* button to unassign user from division within an OU */}
                          <Button
                            variant="secondary"
                            className="action-button"
                            onClick={() =>
                              handleOpenModal(user, "unassignDivision")
                            }
                          >
                            <FaFolderMinus />
                          </Button>
                          <br />
                          <br />
                          {/* button to change user role */}
                          <Button
                            variant="warning"
                            className="action-button"
                            onClick={() => handleOpenModal(user, "changeRole")}
                          >
                            <FaUserEdit />
                          </Button>
                          <br />
                          <br />
                          {/* button to assign user to an OU */}
                          <Button
                            variant="primary"
                            className="action-button"
                            onClick={() => handleOpenModal(user, "assignOU")}
                          >
                            <FaUserPlus />
                          </Button>
                          <br />
                          <br />
                          {/* button to unassign user from an OU */}
                          <Button
                            variant="danger"
                            className="action-button"
                            onClick={() => handleOpenModal(user, "unassignOU")}
                          >
                            <FaUserMinus />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr key={role}>
                  <td colSpan="4">No users found for role: {role}</td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>

      {/* render modals */}
      <Modal show={showModal} onHide={handleCloseModal}>
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default Users;
