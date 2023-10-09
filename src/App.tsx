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

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => handleToggleTodo(index)}
      />
      <span
        style={{
          textDecoration: todo.isCompleted ? 'line-through' : 'none',
          marginRight: '8px',
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

      <button onClick={() => handleDeleteTodo(index)}>Clear!</button>
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

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    setTaskCount(todos.length);
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
    setTodos([
      { text: inputValue, isCompleted: false, deadline: deadlineInput },
      ...todos,
    ]);
    setInputValue('');
    setDeadlineInput('');
  };

  const handleDeleteTodo = (index: number) => {
    setTodos((preTodos) =>
      preTodos.filter((_, todoIndex) => todoIndex !== index)
    );
  };

  const handleToggleTodo = (index: number) => {
    setTodos((preTodos) =>
      preTodos.map((todo, todoIndex) =>
        todoIndex === index
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo
      )
    );
  };

  const handleSetDeadline = (index: number, deadline: string) => {
    setTodos((preTodos) =>
      preTodos.map((todo, todoIndex) =>
        todoIndex === index ? { ...todo, deadline } : todo
      )
    );
  };
  return (
    <>
      <h1>Todo List</h1>
      <div>
        <p>Now: {currentDateTime.toLocaleString()}</p>
        <p>Total Tasks: {taskCount}</p>
        {taskCount === 0 && <p>やることないよ！</p>}
        {taskCount >= 10 && <p>早く処理してください！</p>}
      </div>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <input
        type="datetime-local"
        value={deadlineInput}
        onChange={(e) => setDeadlineInput(e.target.value)}
      />
      <button onClick={handleAddTodo}>Add Task</button>
      <ul>
        {todos.map((todo, index) => (
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
