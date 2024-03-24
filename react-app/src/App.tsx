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
  const [dailyTasks, setDailyTasks] = useState<string[]>([]); // Przechowuje listę dziennych zadań dla wszystkich dni

  const handleNavbarItemClick = (component: "Home" | "NewDay") => {
    setDisplayedComponent(component);
  };

  const handleMenuItemClick = (dayName: string) => {
    console.log("Kliknięto element menu:", dayName);
    setDayName(dayName);
    setDisplayedComponent("NewDay");
  };

  // Aktualizacja listy dziennych zadań w całej aplikacji
  const handleDailyButtonClick = (dailyTask: string[]) => {
    console.log("Zapisano task jako daily", dailyTask);
    setDailyTasks((prevDailyTasks) => [
      ...prevDailyTasks,
      ...dailyTask.filter((task) => !prevDailyTasks.includes(task)),
    ]); // Dodaj nowe zadania dziennie do istniejących
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
            dailyTasks={dailyTasks} // Przekazanie listy dziennych zadań do HomeComponent
          />
        )}
        {displayedComponent === "NewDay" && (
          <NewDayComponent
            dailyTasks={dailyTasks}
            onButtonClick={handleDailyButtonClick}
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
