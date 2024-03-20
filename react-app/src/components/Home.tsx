import React, { useState } from "react";
import { Button, FormControl } from "react-bootstrap";

interface HomeComponentProps {
  onMenuClick: (dayName: string) => void;
}

function HomeComponent({ onMenuClick }: HomeComponentProps) {
  const [day, setDay] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);
  const [days, setDays] = useState<string[]>([]);

  const handleAddDay = () => {
    setShowInput(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDay(event.target.value);
  };

  const handleConfirmDay = () => {
    if (day.trim() !== "") {
      setDays([...days, day]);
      setDay("");
      setShowInput(false);
    }
  };

  const handleMenuClick = (dayName: string) => {
    onMenuClick(dayName);
  };

  return (
    <div className="grid-container">
      <div className="menu">
        <div className="menu-header">
          {!showInput && (
            <Button variant="primary" onClick={handleAddDay}>
              Add New Day
            </Button>
          )}
          {showInput && (
            <React.Fragment>
              <FormControl
                type="text"
                placeholder="Enter name (e.g. date of day)"
                value={day}
                onChange={handleInputChange}
              />
              <Button variant="primary" onClick={handleConfirmDay}>
                Confirm
              </Button>
            </React.Fragment>
          )}
        </div>
        <div className="menu-items">
          {days.map((day, index) => (
            <div
              className="menu-item"
              key={index}
              onClick={() => handleMenuClick(day)}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeComponent;
