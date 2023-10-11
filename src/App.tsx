import React, { useState, useEffect } from 'react';
import './App.css';

type TodoItemProps = {
  todo: { text: string; isCompleted: boolean; deadline: string };
  index: number;
  handleDeleteTodo: (index: number) => void;
  handleToggleTodo: (index: number) => void;
  handleSetDeadline: (index: number, deadline: string) => void;
};

type TodoInfo = {
  text: string;
  isCompleted: boolean;
  deadline: string;
};

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  index,
  handleDeleteTodo,
  handleToggleTodo,
  handleSetDeadline,
}) => {
  const [editDeadlineMode, setEditDeadlineMode] = useState(false);
  const [deadlineInput, setDeadlineInput] = useState(
    todo.deadline.replace('T', ' ')
  );

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeadlineInput(e.target.value);
  };

  const handleSetDeadlineClick = () => {
    handleSetDeadline(index, deadlineInput.replace(' ', 'T'));
    setEditDeadlineMode(false);
  };

  const isDeadlineExpired = new Date(todo.deadline) < new Date();
  const isDeadlineNear = !isDeadlineExpired; // 期日が過ぎた場合は"過ぎています"メッセージを表示しない

  const handleDeleteClick = () => {
    handleDeleteTodo(index);
  };

  return (
    <li className={isDeadlineExpired ? 'overdue' : ''}>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => handleToggleTodo(index)}
      />
      <span
        style={{
          textDecoration: todo.isCompleted ? 'line-through' : 'none',
          marginRight: '8px',
          color: isDeadlineExpired ? 'red' : isDeadlineNear ? 'blue' : 'black',
          fontWeight: isDeadlineNear ? 'bold' : 'normal',
        }}
      >
        {todo.text}
      </span>
      {todo.deadline && (
        <>
          {editDeadlineMode ? (
            <input
              type="datetime-local"
              value={deadlineInput}
              onChange={handleDeadlineChange}
            />
          ) : (
            <span
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => setEditDeadlineMode(true)}
            >
              {new Date(todo.deadline).toLocaleString()}
            </span>
          )}
          {editDeadlineMode && (
            <button onClick={handleSetDeadlineClick}>Set Deadline</button>
          )}
        </>
      )}
      <button onClick={handleDeleteClick}>Clear!</button>
      {isDeadlineExpired && !todo.isCompleted && (
        <span>期日が過ぎています！</span>
      )}
    </li>
  );
};

function App() {
  const initialTodos = () => {
    const savedTodos = localStorage.getItem('todos');
    return (savedTodos ? JSON.parse(savedTodos) : []) as TodoInfo[];
  };

  const [todos, setTodos] = useState<TodoInfo[]>(initialTodos);
  const [inputValue, setInputValue] = useState('');
  const [deadlineInput, setDeadlineInput] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [taskCount, setTaskCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(1);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    setTaskCount(todos.length);

    const overdueTasks = todos.filter(
      (todo) => new Date(todo.deadline) < new Date() && !todo.isCompleted
    );
    setOverdueCount(overdueTasks.length);
  }, [todos]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [todos]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = () => {
    const newTodo = { text: inputValue, isCompleted: false, deadline: deadlineInput };
    const duplicatedTodos = Array(duplicateCount).fill(newTodo);

    setTodos((prevTodos) => [...duplicatedTodos, ...prevTodos]);
    setInputValue('');
    setDeadlineInput('');
  };

  const handleDeleteTodo = (index: number) => {
    setTodos((prevTodos) =>
      prevTodos.filter((_, todoIndex) => todoIndex !== index)
    );
  };

  const handleToggleTodo = (index: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo, todoIndex) =>
        todoIndex === index
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo
      )
    );
  };

  const handleSetDeadline = (index: number, deadline: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo, todoIndex) =>
        todoIndex === index ? { ...todo, deadline } : todo
      )
    );
  };

  const sortedTodos = [...todos].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  return (
    <>
      <h1>Todo List</h1>
      <div>
        <p>Now: {currentDateTime.toLocaleString()}</p>
        <p>Total Tasks: {taskCount}</p>
        <p>Overdue Tasks: {overdueCount}</p>
        {taskCount === 0 && <p>やることないよ！</p>}
        {taskCount >= 10 && <p>早く処理してください！</p>}
      </div>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <input
        type="datetime-local"
        value={deadlineInput}
        onChange={(e) => setDeadlineInput(e.target.value)}
      />
      <input
        type="number"
        placeholder="Duplicate Count"
        value={duplicateCount}
        onChange={(e) => setDuplicateCount(Number(e.target.value))}
      />
      <button onClick={handleAddTodo}>Add Task</button>
      <ul>
        {sortedTodos.map((todo, index) => (
          <TodoItem
            key={index}
            todo={todo}
            index={index}
            handleDeleteTodo={handleDeleteTodo}
            handleToggleTodo={handleToggleTodo}
            handleSetDeadline={handleSetDeadline}
            />
            ))}
            </ul>
            </>
            );
            }
            
            export default App;
