import React, { useState, useEffect } from "react";
import { Button, FormControl } from "react-bootstrap";
import "./custom.css";

interface NewDayComponentProps {
  dayName: string;
  dailyTasks: string[];
  tasks: string[];
  onButtonClick: (dailyTasks: string[]) => void;
  updateTasks: (newTasks: string[]) => void;
  onDeleteTask: (index: number) => void;
}

function NewDayComponent({
  dayName,
  dailyTasks,
  tasks,
  updateTasks,
  onButtonClick,
  onDeleteTask,
}: NewDayComponentProps) {
  const [task, setTask] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    setSelectedItems([]);
  }, [tasks, dayName]);

  useEffect(() => {
    setSelectedItems([]);
    setTask("");
    if (dailyTasks && dailyTasks.length > 0) {
      onButtonClick(dailyTasks);
    }
  }, [dayName]);

  const handleAddTask = () => {
    if (task.trim() !== "") {
      const newTasks = [...tasks, task];
      updateTasks(newTasks);
      setTask("");

      const updatedSelectedItems = selectedItems.map(
        (index) => index + tasks.length
      );
      setSelectedItems(updatedSelectedItems);
    }
  };

  const handleMenuClick = (index: number) => {
    const isSelected = selectedItems.includes(index);

    if (!isSelected) {
      setSelectedItems([...selectedItems, index]);
    } else {
      const updatedSelectedItems = selectedItems.filter(
        (item) => item !== index
      );
      setSelectedItems(updatedSelectedItems);
    }
  };

  const handleDailyTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    updateTasks(updatedTasks);
    const taskToMove = tasks[index];
    const isAlreadyDailyTask = dailyTasks.includes(taskToMove);

    if (!isAlreadyDailyTask) {
      const updatedDailyTasks = [...dailyTasks, taskToMove];
      onButtonClick(updatedDailyTasks);
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
            <Button variant="outline-success" onClick={handleAddTask}>
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
                  {!dailyTasks.includes(task) && (
                    <Button
                      variant="outline-primary"
                      onClick={() => handleDailyTask(index)}
                    >
                      D
                    </Button>
                  )}
                  <Button
                    variant="outline-danger"
                    onClick={() => onDeleteTask(index)}
                  >
                    X
                  </Button>
                </div>
              </div>
            ))}
            {dailyTasks.map((task, index) => (
              <div
                onClick={() => handleMenuClick(tasks.length + index)}
                className={
                  "menu-item" +
                  (selectedItems.includes(tasks.length + index)
                    ? " selected"
                    : "") +
                  " daily-task"
                }
                key={index}
              >
                <span>{task}</span>
                <div>
                  <Button
                    variant="danger"
                    onClick={() => onDeleteTask(tasks.length + index)}
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
              variant="primary"
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
