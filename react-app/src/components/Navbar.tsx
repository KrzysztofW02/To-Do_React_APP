import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../custom.css";

interface NavbarProps {
  onNavbarItemClick: (component: "Home" | "NewDay") => void;
}

function NavbarFunction({ onNavbarItemClick }: NavbarProps) {
  return (
    <Navbar expand="lg" className="custom-navbar sticky-top">
      <Container>
        <Navbar.Brand className="navbar-text" href="#home">
          To-Do App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              className="navbar-text"
              href="#home"
              onClick={() => onNavbarItemClick("Home")}
            >
              Home
            </Nav.Link>

            <Nav.Link
              className="navbar-text"
              href="#link"
              onClick={() => onNavbarItemClick("NewDay")}
            >
              My day
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarFunction;
