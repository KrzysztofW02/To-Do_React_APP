import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./custom.css";

interface NavbarProps {
  onNavbarItemClick: (component: "Home" | "NewDay") => void;
}

function NavbarFunction({ onNavbarItemClick }: NavbarProps) {
  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand href="#home">To-Do App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home" onClick={() => onNavbarItemClick("Home")}>
              My Day
            </Nav.Link>
            <Nav.Link href="#link" onClick={() => onNavbarItemClick("NewDay")}>
              To-Do
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarFunction;
