import React, { useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import "./custom.css";

function GridComponent() {
  const [task, setTask] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);
  const [tasks, setTasks] = useState<string[]>([]);

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
  );
}

export default GridComponent;
