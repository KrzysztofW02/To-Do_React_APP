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
  const [dailyTasks, setDailyTasks] = useState<string[]>([]);

  const handleNavbarItemClick = (component: "Home" | "NewDay") => {
    setDisplayedComponent(component);
  };

  const handleMenuItemClick = (dayName: string) => {
    console.log("Kliknięto element menu:", dayName);
    setDayName(dayName);
    setDisplayedComponent("NewDay");
  };

  const handleDeleteTask = (index: number) => {
    const updatedTasks = (days[dayName] || []).filter((_, i) => i !== index);
    setDays((prevDays) => ({
      ...prevDays,
      [dayName]: updatedTasks,
    }));

    const taskToDelete = (days[dayName] || [])[index];

    const updatedDailyTasks = dailyTasks.filter((task) => task == taskToDelete);
    setDailyTasks(updatedDailyTasks);
  };

  const handleDailyButtonClick = (dailyTask: string[]) => {
    console.log("Zapisano task jako daily", dailyTask);
    setDailyTasks((prevDailyTasks) => [
      ...prevDailyTasks,
      ...dailyTask.filter((task) => !prevDailyTasks.includes(task)),
    ]);
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
            dailyTasks={dailyTasks}
          />
        )}
        {displayedComponent === "NewDay" && (
          <NewDayComponent
            dailyTasks={dailyTasks}
            onButtonClick={handleDailyButtonClick}
            dayName={dayName}
            tasks={days[dayName] || []}
            updateTasks={(newTasks) => updateTasksForDay(dayName, newTasks)}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </div>
    </>
  );
}

export default App;
