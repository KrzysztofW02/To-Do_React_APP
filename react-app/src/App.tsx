import React, { useState } from "react";
import NavbarFunction from "./components/Navbar";
import NewDayComponent from "./components/NewDay";
import HomeComponent from "./components/Home";

function App() {
  const [displayedComponent, setDisplayedComponent] = useState<
    "Home" | "NewDay"
  >("Home");
  const [dayName, setDayName] = useState<string>("");
  const [days, setDays] = useState<Record<string, string[]>>({});

  const handleNavbarItemClick = (component: "Home" | "NewDay") => {
    setDisplayedComponent(component);
  };

  const handleMenuItemClick = (dayName: string) => {
    console.log("Kliknięto element menu:", dayName);
    setDayName(dayName);
    setDisplayedComponent("NewDay");
  };

  const updateTasksForDay = (dayName: string, newTasks: string[]) => {
    setDays((prevDays) => ({
      ...prevDays,
      [dayName]: newTasks,
    }));
  };

  return (
    <>
      <div>
        <NavbarFunction onNavbarItemClick={handleNavbarItemClick} />
      </div>
      <div>
        {displayedComponent === "Home" && (
          <HomeComponent
            onMenuClick={handleMenuItemClick}
            days={days}
            setDays={setDays}
          />
        )}
        {displayedComponent === "NewDay" && (
          <NewDayComponent
            dayName={dayName}
            tasks={days[dayName] || []}
            updateTasks={(newTasks) => updateTasksForDay(dayName, newTasks)}
          />
        )}
      </div>
    </>
  );
}

export default App;
