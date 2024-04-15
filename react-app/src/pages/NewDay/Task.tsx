import React from "react";
import { Button } from "react-bootstrap";

interface TaskProps {
  task: string;
  index: number;
  isSelected: boolean;
  isDaily: boolean;
  onDailyTask: (index: number) => void;
  onDeleteTask: (index: number) => void;
  onMenuClick: (index: number) => void;
}

const Task: React.FC<TaskProps> = ({
  task,
  index,
  isSelected,
  isDaily,
  onDailyTask,
  onDeleteTask,
  onMenuClick,
}) => (
  <div
    onClick={() => onMenuClick(index)}
    className={
      "menu-item" +
      (isSelected ? " selected" : "") +
      (isDaily ? " daily-task" : "")
    }
  >
    <span>{task}</span>
    <div>
      {!isDaily && (
        <Button variant="outline-primary" onClick={() => onDailyTask(index)}>
          D
        </Button>
      )}
      <Button variant="outline-danger" onClick={() => onDeleteTask(index)}>
        X
      </Button>
    </div>
  </div>
);

export default Task;
