import React, { useState } from "react";
import { Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface HomeComponentProps {
  onMenuClick: (dayName: string) => void;
  days: string[];
  setDays: React.Dispatch<React.SetStateAction<string[]>>;
}

function HomeComponent({ onMenuClick, days, setDays }: HomeComponentProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [showInput, setShowInput] = useState<boolean>(false);

  const handleAddDay = () => {
    setShowInput(true);
  };

  const handleConfirmDay = () => {
    if (startDate) {
      const formattedDate = startDate.toLocaleDateString();
      setDays([...days, formattedDate]);
      setStartDate(null); // Resetujemy wybraną datę
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
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
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
