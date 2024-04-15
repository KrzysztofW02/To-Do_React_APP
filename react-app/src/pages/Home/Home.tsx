import React, { useState } from "react";
import { Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface HomeComponentProps {
  onMenuClick: (dayName: string, dailyTasks: string[]) => void;
  days: Record<string, string[]>;
  setDays: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  dailyTasks: string[];
}

function HomeComponent({
  onMenuClick,
  days,
  setDays,
  dailyTasks,
}: HomeComponentProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [showInput, setShowInput] = useState<boolean>(false);

  const handleAddDay = () => {
    setShowInput(true);
  };

  const handleConfirmDay = () => {
    if (startDate) {
      const formattedDate = startDate.toLocaleDateString();
      setDays({
        ...days,
        [formattedDate]: [],
      });
      setStartDate(null);
      setShowInput(false);
    }
  };

  const handleMenuClick = (dayName: string) => {
    onMenuClick(dayName, dailyTasks);
  };

  const handleDeleteDay = (dayName: string) => {
    console.log("Usunieto element menu:", dayName);
    const { [dayName]: deletedDay, ...updateDays } = days;
    setDays(updateDays);
  };

  const handleClearAllDays = () => {
    setDays({});
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleConfirmDay();
    }
  };

  return (
    <div className="grid-container">
      <div className="menu">
        <div className="menu-header">
          {!showInput && (
            <Button variant="outline-success" onClick={handleAddDay}>
              Add New Day
            </Button>
          )}
          {showInput && (
            <React.Fragment>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                placeholderText="Click here to select a date"
                onKeyDown={handleKeyPress}
              />
              <Button variant="outline-success" onClick={handleConfirmDay}>
                Confirm
              </Button>
            </React.Fragment>
          )}
        </div>
        <div className="menu-items">
          {Object.keys(days).map((day, index) => (
            <div
              className="menu-item"
              key={index}
              onClick={() => handleMenuClick(day)}
            >
              {day}
              <Button
                variant="outline-danger"
                onClick={(e) => {
                  e.stopPropagation(); //To avoid entering day when u click on button
                  handleDeleteDay(day);
                }}
              >
                X
              </Button>
            </div>
          ))}
          {Object.keys(days).length > 1 && (
            <Button
              variant="outline-danger"
              onClick={handleClearAllDays}
              style={{ marginTop: "10px" }}
            >
              Clear All Days
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeComponent;
