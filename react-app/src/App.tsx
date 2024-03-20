import React, { useState } from "react";
import NavbarFunction from "./components/Navbar";
import NewDayComponent from "./components/NewDay";
import HomeComponent from "./components/Home";

function App() {
  const [displayedComponent, setDisplayedComponent] = useState<
    "Home" | "NewDay"
  >("Home");
  const [dayName, setDayName] = useState<string>("");

  const handleNavbarItemClick = (component: "Home" | "NewDay") => {
    setDisplayedComponent(component);
  };

  const handleMenuItemClick = (dayName: string) => {
    console.log("Kliknięto element menu:", dayName);
    setDayName(dayName);
    setDisplayedComponent("NewDay");
  };

  console.log(dayName);

  return (
    <>
      <div>
        <NavbarFunction onNavbarItemClick={handleNavbarItemClick} />
      </div>
      <div>
        {displayedComponent === "Home" && (
          <HomeComponent onMenuClick={handleMenuItemClick} />
        )}
        {displayedComponent === "NewDay" && (
          <NewDayComponent dayName={dayName} />
        )}
      </div>
    </>
  );
}

export default App;
