import React, { useState, useEffect } from "react";
import { Button, FormControl } from "react-bootstrap";
import "./custom.css";

interface NewDayComponentProps {
  dayName: string;
}

function NewDayComponent({ dayName }: NewDayComponentProps) {
  const [task, setTask] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);
  const [tasks, setTasks] = useState<string[]>([]);

  useEffect(() => {
    console.log("dayName:", dayName);
  }, [dayName]);

  const handleAddTask = () => {
    setShowInput(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  const handleConfirmTask = () => {
    if (task.trim() !== "") {
      setTasks([...tasks, task]);
      setTask("");
      setShowInput(false);
    }
  };

  return (
    <>
      <div className="day-name">{dayName}</div>
      <div className="grid-container">
        <div className="menu">
          <div className="menu-header">
            {!showInput && (
              <Button variant="primary" onClick={handleAddTask}>
                Add task
              </Button>
            )}
            {showInput && (
              <React.Fragment>
                <FormControl
                  type="text"
                  placeholder="Enter task..."
                  value={task}
                  onChange={handleInputChange}
                />
                <Button variant="primary" onClick={handleConfirmTask}>
                  Confirm
                </Button>
              </React.Fragment>
            )}
          </div>
          <div className="menu-items">
            {tasks.map((task, index) => (
              <div className="menu-item" key={index}>
                {task}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default NewDayComponent;
