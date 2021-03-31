import React from 'react'
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap'


const Header = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto ml-10">
        <Button as={Link} to="/">Election</Button>
        <Button as={Link} to="/admin" disabled>Admin panel</Button>
        </Nav>
        <Nav>
        <Button as={Link} to="/about" variant="warning">About</Button>
        </Nav>
    </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;