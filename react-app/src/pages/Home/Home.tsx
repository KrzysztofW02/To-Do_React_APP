import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

interface HomeComponentProps {
  onMenuClick: (dayName: string, dailyTasks: string[]) => void;
  days: Record<string, string[]>;
  setDays: (newDays: Record<string, string[]>) => void;
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

  useEffect(() => {
    axios
      .get("http://localhost:5000/days")
      .then((response) => {
        const fetchedDays = response.data;
        const transformedDays: Record<string, string[]> = {};
        for (const dayObj of fetchedDays) {
          transformedDays[dayObj.day] = [];
        }
        setDays(transformedDays);
      })
      .catch((error) => {
        console.error("Error fetching days:", error);
      });
  }, []);

  const handleAddDay = () => {
    setShowInput(true);
  };

  const handleConfirmDay = () => {
    if (startDate) {
      const day = startDate.getDate();
      const month = startDate.getMonth() + 1;
      const year = startDate.getFullYear();

      const formattedDate = `${day < 10 ? "0" + day : day}-${
        month < 10 ? "0" + month : month
      }-${year}`;

      setDays({
        ...days,
        [formattedDate]: [],
      });
      setStartDate(null);
      setShowInput(false);

      axios
        .post("http://localhost:5000/days", {
          day: formattedDate,
        })
        .then((response) => console.log(response.data))
        .catch((error) => console.error("Error:", error));
    }
  };

  const handleMenuClick = (dayName: string) => {
    onMenuClick(dayName, dailyTasks);

    axios
      .get(`http://localhost:5000/days/${dayName}`)
      .then((response) => {
        console.log(response.data);
        // Here you can handle the data for the specific day
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleDeleteDay = (dayName: string) => {
    console.log("Usunieto element menu:", dayName);
    const { [dayName]: deletedDay, ...updateDays } = days;
    setDays(updateDays);

    axios
      .delete(`http://localhost:5000/days/${dayName}`)
      .then((response) => console.log(response.data))
      .catch((error) => console.error("Error:", error));
  };

  const handleClearAllDays = () => {
    setDays({});

    axios
      .delete("http://localhost:5000/days")
      .then((response) => console.log(response.data))
      .catch((error) => console.error("Error:", error));
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
                dateFormat="dd-MM-yyyy"
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
