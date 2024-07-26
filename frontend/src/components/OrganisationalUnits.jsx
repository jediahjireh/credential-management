// src/components/OrganisationalUnits.jsx

// import dependencies
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Modal, Table } from "react-bootstrap";
import { addCredential, fetchOUs, updateCredentials } from "../api.jsx";

const OrganisationalUnits = ({ user }) => {
  // check user role
  const isAdmin = user?.role === "admin";
  const isNormal = user?.role === "normal";
  const isManagement = user?.role === "management";

  // determine user permissions
  const updateCredentialsPermissions = isAdmin || isManagement;
  const registeredUserPermissions = isNormal || isAdmin || isManagement;

  // set states

  // organisational units
  const [ous, setOUs] = useState([]);
  // organisational units
  const [selectedOU, setSelectedOU] = useState(null);
  // selected division
  const [selectedDivision, setSelectedDivision] = useState(null);
  // appropriate modal view render
  const [modalType, setModalType] = useState("add");
  // modal visibility
  const [showModal, setShowModal] = useState(false);
  // form data
  const [formData, setFormData] = useState({});

  // use effect to fetch organisational units
  useEffect(() => {
    fetchOUs().then((data) => setOUs(data.organisationalUnits));
  }, []);

  // handle modal input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle form submission based on modal type
  const handleSubmit = async (e) => {
    e.preventDefault();

    // check for unique credential name if user is adding a credential
    if (modalType === "add") {
      // check within the selected division only
      const isNameUnique = selectedDivision.credentials.every(
        (credential) => credential.credentialName !== formData.name
      );

      if (!isNameUnique) {
        alert(
          "The credential name must be unique within the selected division."
        );
        // stop submission if the name is not unique
        return;
      }
    }

    // store result of API call
    let response;

    // add or update credentials based on modal type
    if (modalType === "add") {
      response = await addCredential({
        inputOuName: formData.ouName,
        inputDivisionName: formData.divisionName,
        inputCredentialName: formData.name,
        inputCredentialUsername: formData.username,
        inputCredentialEmail: formData.email,
        inputCredentialPassword: formData.password,
      });
    } else if (modalType === "update") {
      response = await updateCredentials({
        inputOuName: formData.ouName,
        inputDivisionName: formData.divisionName,
        inputCredentialName: formData.name,
        inputCredentialUsername: formData.username,
        inputCredentialEmail: formData.email,
        inputCredentialPassword: formData.password,
      });
    }

    if (response.success) {
      // fetch and update organisational units without resetting selected OU and division
      fetchOUs().then((data) => {
        setOUs(data.organisationalUnits);
        // maintain selected OU and division if possible
        const updatedSelectedOU = data.organisationalUnits.find(
          (ou) => ou.ouName === selectedOU.ouName
        );

        if (updatedSelectedOU) {
          setSelectedOU(updatedSelectedOU);
          const updatedSelectedDivision = updatedSelectedOU.divisions.find(
            (division) =>
              division.divisionName === selectedDivision.divisionName
          );
          setSelectedDivision(updatedSelectedDivision || null);
        } else {
          setSelectedOU(null);
          setSelectedDivision(null);
        }
      });

      // hide modal
      setShowModal(false);
      alert(
        "The credential repository has been successfully updated with details of your entry."
      );
      setFormData({});
    }
  };

  // handle click to edit a credential
  const handleEditClick = (credential) => {
    setFormData({
      ouName: selectedOU?.ouName,
      divisionName: selectedDivision?.divisionName,
      name: credential.credentialName,
      username: credential.credentialUsername,
      email: credential.credentialEmail,
      password: credential.credentialPassword,
    });
    setModalType("update");
    setShowModal(true);
  };

  // handle cancel click
  const handleCancelClick = () => {
    setFormData({});
    setShowModal(false);
  };

  // render dashboard
  return (
    <div>
      {/* normal, management and admin roles have access to this component's tab */}
      {registeredUserPermissions && (
        <>
          {/* dropdown to select an OU */}
          <Form.Group controlId="ouSelect">
            <Form.Control
              as="select"
              className="text-center"
              onChange={(e) => {
                const ouName = e.target.value;
                setSelectedOU(ous.find((ou) => ou.ouName === ouName));
                // reset selected division
                setSelectedDivision(null);
              }}
              value={selectedOU ? selectedOU.ouName : ""}
            >
              <option value="" disabled>
                {selectedOU
                  ? "Organisational Units:"
                  : "Select an organisational unit"}
              </option>
              {ous.map((ou) => (
                <option key={ou.ouName} value={ou.ouName}>
                  {ou.ouName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* if an OU is selected, show its divisions */}
          {selectedOU ? (
            <div>
              {selectedOU.divisions.length > 0 && (
                <>
                  <br />
                  <p>Divisions</p>
                  {selectedOU.divisions.map((division) => (
                    <Card key={division.divisionName} className="mb-2">
                      <Card.Header
                        onClick={() => setSelectedDivision(division)}
                        style={{ cursor: "pointer" }}
                      >
                        {division.divisionName}
                      </Card.Header>
                      {selectedDivision === division && (
                        <Card.Body>
                          <h6>Credentials</h6>
                          <div className="table-responsive">
                            <Table
                              striped
                              bordered
                              hover
                              className="ouTable align-middle"
                            >
                              <thead>
                                <tr className="text-center">
                                  <th>Name</th>
                                  <th>Email</th>
                                  <th>Username</th>
                                  <th>Password</th>
                                  {updateCredentialsPermissions && (
                                    <th>Edit</th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {division.credentials.length > 0 ? (
                                  division.credentials.map((credential) => (
                                    <tr key={credential.credentialName}>
                                      <td>{credential.credentialName}</td>
                                      <td>{credential.credentialEmail}</td>
                                      <td>{credential.credentialUsername}</td>
                                      <td>{credential.credentialPassword}</td>
                                      {updateCredentialsPermissions && (
                                        <td>
                                          <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() =>
                                              handleEditClick(credential)
                                            }
                                          >
                                            Update
                                          </Button>
                                        </td>
                                      )}
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={5} className="text-center">
                                      <i>No credentials found.</i>
                                    </td>
                                  </tr>
                                )}
                                <tr>
                                  <td colSpan={5}>
                                    <Button
                                      variant="primary"
                                      style={{ width: "100%" }}
                                      onClick={() => {
                                        setFormData({
                                          ouName: selectedOU.ouName,
                                          divisionName: division.divisionName,
                                        });
                                        setModalType("add");
                                        setShowModal(true);
                                      }}
                                    >
                                      Add New Credential
                                    </Button>
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </Card.Body>
                      )}
                    </Card>
                  ))}
                </>
              )}
              {selectedOU.divisions.length === 0 && (
                <>
                  <br />
                  <p>
                    <i>No divisions found.</i>
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              <br />
              <p>
                <i>
                  Select an organisational unit to view divisions and their
                  credentials here.
                </i>
              </p>
            </>
          )}

          {/* modal for adding or updating credentials */}
          <Modal show={showModal} onHide={handleCancelClick}>
            <Modal.Header closeButton>
              <Modal.Title style={{ textAlign: "center", width: "100%" }}>
                {modalType === "add" ? "Add Credential" : "Update Credential"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    // credential name cannot be changed once it is set
                    readOnly={modalType === "update"}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="ouName">
                  <Form.Label>Organisational Unit</Form.Label>
                  <Form.Control
                    type="text"
                    name="ouName"
                    value={formData.ouName || ""}
                    readOnly
                  />
                </Form.Group>
                <Form.Group controlId="divisionName">
                  <Form.Label>Division</Form.Label>
                  <Form.Control
                    type="text"
                    name="divisionName"
                    value={formData.divisionName || ""}
                    readOnly
                  />
                </Form.Group>
                <br />
                <Button
                  variant="primary"
                  type="submit"
                  style={{ width: "100%" }}
                >
                  {modalType === "add" ? "Add" : "Update"}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
};

// export component
export default OrganisationalUnits;
