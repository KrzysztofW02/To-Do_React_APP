import { createStore, compose } from 'redux';

const SET_DISPLAYED_COMPONENT = 'SET_DISPLAYED_COMPONENT';
const SET_DAY_NAME = 'SET_DAY_NAME';
const SET_DAYS = 'SET_DAYS';
const SET_DAILY_TASKS = 'SET_DAILY_TASKS';
const UPDATE_TASKS_FOR_DAY = 'UPDATE_TASKS_FOR_DAY';
const DELETE_TASK = 'DELETE_TASK';

export const setDisplayedComponent = (component: "Home" | "NewDay") => ({
  type: SET_DISPLAYED_COMPONENT,
  payload: component,
});

export const setDayName = (dayName: string) => ({
  type: SET_DAY_NAME,
  payload: dayName,
});

export const setDays = (days: Record<string, string[]>) => ({
  type: SET_DAYS,
  payload: days,
});

export const setDailyTasks = (dailyTasks: string[]) => ({
  type: SET_DAILY_TASKS,
  payload: dailyTasks,
});

export const updateTasksForDay = (dayName: string, tasks: string[]) => ({
  type: UPDATE_TASKS_FOR_DAY,
  payload: { dayName, tasks },
});

export const deleteTask = (index: number) => ({
  type: DELETE_TASK,
  payload: index,
});

const initialState = {
  displayedComponent: "Home",
  dayName: "",
  days: {},
  dailyTasks: [],
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_DISPLAYED_COMPONENT:
      return { ...state, displayedComponent: action.payload };
    case SET_DAY_NAME:
      return { ...state, dayName: action.payload };
    case SET_DAYS:
      return { ...state, days: action.payload };
    case SET_DAILY_TASKS:
      return { ...state, dailyTasks: action.payload };
    case UPDATE_TASKS_FOR_DAY:
      return { ...state, days: { ...state.days, [action.payload.dayName]: action.payload.tasks } };
    case DELETE_TASK:
      return { ...state, dailyTasks: state.dailyTasks.filter((_, i) => i !== action.payload) };
    default:
      return state;
  }
};

// Define RootState type
export type RootState = ReturnType<typeof reducer>;

// Add Redux DevTools extension support
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  reducer,
  composeEnhancers()
);