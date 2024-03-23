import React, { useState, useEffect } from "react";
import { Button, FormControl } from "react-bootstrap";
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
  const [dailyTasks, setDailyTasks] = useState<string[]>([]);

  useEffect(() => {
    setSelectedItems([]);
  }, [tasks]);

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
    const isDailyTask = dailyTasks.includes(tasks[index]);

    if (!isSelected && !isDailyTask) {
      setSelectedItems([...selectedItems, index]);
    } else {
      const updatedSelectedItems = selectedItems.filter(
        (item) => item !== index
      );
      setSelectedItems(updatedSelectedItems);
    }
  };

  const handleDailyTask = (index: number) => {
    const taskToMove = tasks[index];
    const isAlreadyDailyTask = dailyTasks.includes(taskToMove);

    if (isAlreadyDailyTask) {
      const updatedDailyTasks = dailyTasks.filter(
        (task) => task !== taskToMove
      );
      setDailyTasks(updatedDailyTasks);
    } else {
      setDailyTasks([...dailyTasks, taskToMove]);
    }
  };

  const handleClearTasks = () => {
    const updatedTasks = tasks.filter((task) => dailyTasks.includes(task));
    updateTasks(updatedTasks);
    setSelectedItems([]);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddTask();
    }
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
              onKeyDown={handleKeyPress}
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
                  (selectedItems.includes(index) ? " selected" : "") +
                  (dailyTasks.includes(task) ? " daily-task" : "")
                }
                key={index}
              >
                <span>{task}</span>
                <div>
                  <Button
                    variant="warning"
                    onClick={() => handleDailyTask(index)}
                  >
                    D
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteTask(index)}
                  >
                    X
                  </Button>
                </div>
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
