import React, { useState, useEffect } from "react";
import { Button, FormControl } from "react-bootstrap";
import Task from "./Task";
import "../../custom.css";
import axios from "axios";

interface NewDayComponentProps {
  dayName: string;
  dailyTasks: string[];
  tasks: string[];
  onButtonClick: (dailyTasks: string[]) => void;
  updateTasks: (newTasks: string[]) => void;
  onDeleteTask: (index: number) => void;
}

const NewDayComponent: React.FC<NewDayComponentProps> = ({
  dayName,
  dailyTasks,
  tasks,
  updateTasks,
  onButtonClick,
  onDeleteTask,
}) => {
  const [task, setTask] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    setTask("");
    if (dailyTasks && dailyTasks.length > 0) {
      onButtonClick(dailyTasks);
    }
  }, [dayName]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/days/" + dayName
        );
        const taskNames = response.data.tasks.map(
          (task: { name: string }) => task.name
        );
        updateTasks(taskNames);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, [dayName]);

  const saveTask = async (
    task: string,
    isDaily: boolean,
    isSelected: boolean
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/days/" + dayName + "/tasks",
        {
          task: {
            name: task,
            isDaily: isDaily,
            isSelected: isSelected,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTask = () => {
    if (task.trim() !== "") {
      const newTasks = [...tasks, task];
      updateTasks(newTasks);
      saveTask(
        task,
        dailyTasks.includes(task),
        selectedItems.includes(tasks.length)
      );
      setTask("");
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

  const handleDailyTask = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
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
              <Task
                key={index}
                task={task}
                index={index}
                isSelected={selectedItems.includes(index)}
                isDaily={dailyTasks.includes(task)}
                onDailyTask={(event) => handleDailyTask(event, index)}
                onDeleteTask={onDeleteTask}
                onMenuClick={handleMenuClick}
              />
            ))}
            {dailyTasks.map((task, index) => (
              <Task
                task={task}
                index={tasks.length + index}
                isSelected={selectedItems.includes(tasks.length + index)}
                isDaily={true}
                onDailyTask={(event) => handleDailyTask(event, index)}
                onDeleteTask={onDeleteTask}
                onMenuClick={handleMenuClick}
              />
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
};

export default NewDayComponent;
