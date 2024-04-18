import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  store,
  setDisplayedComponent,
  setDayName,
  setDays,
  setDailyTasks,
  updateTasksForDay,
  deleteTask,
  RootState,
} from "./store";
import NavbarFunction from "./components/Navbar";
import NewDayComponent from "./pages/NewDay/NewDay";
import HomeComponent from "./pages/Home/Home";

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const displayedComponent = useSelector(
    (state: RootState) => state.displayedComponent
  );
  const dayName = useSelector((state: RootState) => state.dayName);
  const days = useSelector((state: RootState) => state.days);
  const dailyTasks = useSelector((state: RootState) => state.dailyTasks);

  const handleNavbarItemClick = (component: "Home" | "NewDay") => {
    dispatch(setDisplayedComponent(component));
  };

  const handleMenuItemClick = (dayName: string) => {
    console.log("Kliknięto element menu:", dayName);
    dispatch(setDayName(dayName));
    dispatch(setDisplayedComponent("NewDay"));
  };

  return (
    <div>
      <NavbarFunction onNavbarItemClick={handleNavbarItemClick} />
      {displayedComponent === "Home" && (
        <HomeComponent
          onMenuClick={handleMenuItemClick}
          days={days}
          setDays={(newDays) => dispatch(setDays(newDays))}
          dailyTasks={dailyTasks}
        />
      )}
      {displayedComponent === "NewDay" && (
        <NewDayComponent
          dayName={dayName}
          dailyTasks={dailyTasks}
          onButtonClick={(dailyTasks) => dispatch(setDailyTasks(dailyTasks))}
          tasks={days[dayName] || []}
          updateTasks={(newTasks) =>
            dispatch(updateTasksForDay(dayName, newTasks))
          }
          onDeleteTask={(index) => dispatch(deleteTask(index))}
        />
      )}
    </div>
  );
}

export default App;
