import React, { useState, useEffect } from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import "./custom.css";

interface NewDayComponentProps {
  dayName: string;
  tasks: string[];
  updateTasks: (newTasks: string[]) => void;
}

function NewDayComponent({
  dayName,
  tasks,
  updateTasks,
}: NewDayComponentProps) {
  const [task, setTask] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleAddTask = () => {
    if (task.trim() !== "") {
      updateTasks([...tasks, task]);
      setTask("");
    }
  };

  const handleDeleteTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    updateTasks(updatedTasks);

    const updatedSelectedItems = selectedItems.filter((item) => item !== index);
    setSelectedItems(updatedSelectedItems);
  };

  const handleMenuClick = (index: number) => {
    const isSelected = selectedItems.includes(index);

    if (isSelected) {
      const updatedSelectedItems = selectedItems.filter(
        (item) => item !== index
      );
      setSelectedItems(updatedSelectedItems);
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const handleClearTasks = () => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(0, tasks.length);
    updateTasks(updatedTasks);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  return (
    <>
      <div className="day-name">{dayName}</div>
      <div className="grid-container">
        <div className="menu">
          <div className="menu-header">
            <FormControl
              type="text"
              placeholder="Enter task..."
              value={task}
              onChange={handleInputChange}
            />
            <Button variant="primary" onClick={handleAddTask}>
              Add
            </Button>
          </div>
          <div className="menu-items">
            {tasks.map((task, index) => (
              <div
                onClick={() => handleMenuClick(index)}
                className={
                  "menu-item" +
                  (selectedItems.includes(index) ? " selected" : "")
                }
                key={index}
              >
                {task}

                <Button
                  variant="danger"
                  onClick={() => handleDeleteTask(index)}
                >
                  X
                </Button>
              </div>
            ))}
          </div>
          {tasks.length > 1 && (
            <Button
              className="clear-button"
              variant="info"
              onClick={handleClearTasks}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default NewDayComponent;
