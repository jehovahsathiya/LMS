import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { Container, Typography } from "@mui/material";

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com",role:"admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com",role:"user" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const handleEdit = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleSave = () => {
    setUsers(
      users.map((user) => (user.id === editUser.id ? editUser : user))
    );
    setShowModal(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Table striped bordered hover>
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
            <tr key={user.id}>

              <td>{user.id}</td>
              <td>{user.role}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(user)}>
                   Edit
                </Button>{"    "}
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                   Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
                onChange={(e) =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
              />
            </Form.Group>


            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editUser?.email || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={editUser?.role || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserManagement;
