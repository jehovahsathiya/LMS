import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { Container, Typography } from "@mui/material";
import Sidebar from "../Cart/Dashboard/sidebar";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    password: "",
    phone: "",
    userType: "user",
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/allUser");
      const formattedUsers = res.data.map((user, index) => ({
        ...user,
        id: index + 1,
        email: user.username,
        role: user.userType,
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    console.log(id);
    
    if (window.confirm("Are you sure you want to delete this user?")) {

      axios.delete(`http://localhost:5000/user/${id}`)
        .then((response) => { 
          console.log("User deleted successfully:", response.data);
          alert("User deleted successfully");
          fetchUsers(); // Refresh the user list after deletion
        })  
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleSave = () => {
    setUsers(users.map((user) => (user.id === editUser.id ? editUser : user)));
    setShowEditModal(false);
  };

  const handleAddUser = async () => {
    const payload = {
      ...newUser,
      uniqueId: new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14),
      cart: [],
      borrowed: [],
    };
    try {
      await axios.post("http://localhost:5000/register", payload);
      alert("User added successfully");
      fetchUsers();
      setNewUser({ name: "", username: "", password: "", phone: "", userType: "user" });
      setShowAddModal(false);
    } catch (error) {
      alert("Error adding user");
      console.error(error);
    }
  };

  return (
    <>
      <Sidebar />
      <Container style={{ marginTop: "20px" }}>
        <Typography variant="h4" gutterBottom className="text-center">
          User Management
        </Typography>

        <div className="d-flex justify-content-end mb-3">
          <Button variant="success" onClick={() => setShowAddModal(true)}>
            + Add New User
          </Button>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Role</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.id}</td>
                <td>{user.role}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleEdit(user)}>
                    Edit
                  </Button>{" "}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(user._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Add User Modal */}
        <Modal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          centered
          animation
        >
          <Modal.Header closeButton>
            <Modal.Title>Add New User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  value={newUser.userType}
                  onChange={(e) => setNewUser({ ...newUser, userType: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddUser}>
              Add User
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit User Modal */}
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          centered
          animation
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editUser?.name || ""}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editUser?.email || ""}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  value={editUser?.role || ""}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default UserManagement;
