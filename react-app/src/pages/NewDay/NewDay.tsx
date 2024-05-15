import React, { useState, useEffect } from "react";
import { Button, FormControl } from "react-bootstrap";
import Task from "./Task";
import "../../custom.css";
import axios from "axios";
import { useDispatch } from "react-redux";

import { setDailyTasks } from "../../store";

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

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/days/" + dayName
        );
        const taskNames = response.data.tasks
          .filter((task: { isDaily: boolean }) => !task.isDaily)
          .map((task: { name: string }) => task.name);
        const dailyTaskNames = response.data.tasks
          .filter((task: { isDaily: boolean }) => task.isDaily)
          .map((task: { name: string }) => task.name);
        const selectedTaskIndices = response.data.tasks
          .map((task: { isSelected: boolean }, index: number) =>
            task.isSelected ? index : -1
          )
          .filter((index: number) => index !== -1);
        updateTasks(taskNames);
        dispatch(setDailyTasks([]));
        onButtonClick(dailyTaskNames);
        setSelectedItems(selectedTaskIndices);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, [dayName]);

  onDeleteTask = (index: number) => {
    let taskToDelete;
    let newTasks;
    if (index < tasks.length) {
      taskToDelete = tasks[index];
      newTasks = [...tasks];
      newTasks.splice(index, 1);
      updateTasks(newTasks);
    } else {
      const dailyIndex = index - tasks.length;
      taskToDelete = dailyTasks[dailyIndex];
      const newDailyTasks = [...dailyTasks];
      newDailyTasks.splice(dailyIndex, 1);
      onButtonClick(newDailyTasks);
    }

    axios
      .delete(`http://localhost:5000/days/${dayName}/tasks/${taskToDelete}`)
      .then((response) => console.log(response.data))
      .catch((error) => console.error("Error:", error));
  };

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

  const handleMenuClick = async (index: number) => {
    const isSelected = selectedItems.includes(index);

    if (!isSelected) {
      setSelectedItems([...selectedItems, index]);
    } else {
      const updatedSelectedItems = selectedItems.filter(
        (item) => item !== index
      );
      setSelectedItems(updatedSelectedItems);
    }

    try {
      const taskToUpdate = tasks[index];
      const response = await axios.put(
        `http://localhost:5000/days/${dayName}/tasks/${taskToUpdate}`,
        {
          isSelected: !isSelected,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDailyTask = async (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    const updatedTasks = tasks.filter((_, i) => i !== index);
    updateTasks(updatedTasks);
    const taskToMove = tasks[index];
    const isAlreadyDailyTask = dailyTasks.includes(taskToMove);

    if (!isAlreadyDailyTask) {
      const updatedDailyTasks = [...dailyTasks, taskToMove];
      onButtonClick(updatedDailyTasks);

      try {
        const response = await axios.put(
          `http://localhost:5000/days/${dayName}/tasks/${taskToMove}`,
          {
            isDaily: true,
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
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
                key={index}
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
