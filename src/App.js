import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Form, Button, ListGroup, InputGroup, FormControl, FormLabel } from 'react-bootstrap';

import './App.css';

// class TodoNote {
//   constructor(todoText, dueDate, priority) {
//     this.todoText = todoText;
//     this.dueDate = dueDate || 'NaN-NaN-NaN';
//     this.priority = priority || 'Medium';
//   }
// }

const TodoItem = ({ todo, onEdit, onDelete, onModify, onAssign }) => {

  const handleDue = () => {
    const newDueDate = prompt('Enter new due date (dd-mm-yyyy)', todo.dueDate);
    if (newDueDate) {
      onModify(todo.dueDate, newDueDate);
    }
  };

  const handleEdit = () => {
    const newTodoText = prompt('Enter new todo text', todo.todoText);
    if (newTodoText) {
      onEdit(todo.todoText, newTodoText);
    }
  };

  const handleDelete = () => {
    onDelete(todo.todoText);
  };

  const handlePriority = (event, todoText) => {
    const newPriority = event.target.value;
    onAssign(todoText, newPriority);
  };

  const priorityColors = {
    'High': '#7A474F',
    'Medium': '#474F7A',
    'Low': '#477A4F'
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center" style={{ backgroundColor: priorityColors[todo.priority] }}>
      <div className="todo-text float-start">{todo.todoText}</div>
      <div className="d-flex align-items-center">
        <div className="btn-group btn-group-sm" role="group">
          <button className="due-date btn btn-info btn-sm" onClick={handleDue}>
            {todo.dueDate !== 'NaN-NaN-NaN' ? `Due Date: ${todo.dueDate}` : `Set Due Date`}
          </button>
          <button type="button" className="btn btn-success btn-sm edit" onClick={handleEdit}>Edit</button>
          <select className="btn btn-warning dropdown-toggle" value={todo.priority} onChange={(e) => handlePriority(e, todo.todoText)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button type="button" className="btn btn-danger btn-sm delete" onClick={handleDelete}>X</button>
        </div>
      </div>
    </li>
  );
};

const App = () => {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState('');
  const [dueDateInput, setDueDateInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!todos.length) {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }
    } else {
      const newTodos = [...todos];
      newTodos.sort((a, b) => {
        const priorityOrder = ['High', 'Medium', 'Low'];
        return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
      });
      setTodos(newTodos);
      localStorage.setItem('todos', JSON.stringify(newTodos));
    }
  }, [todos]);

  const addTodo = (todoText, dueDate, priority) => {
    if (todoText.trim() !== '') {
      const newTodo = { id: Date.now(), todoText, dueDate, priority };
      setTodos([...todos, newTodo]);
      setTodoInput('');
    }
  };
  const deleteTodo = (todoText) => {
    const newTodos = todos.filter(todo => todo.todoText !== todoText);
    setTodos(newTodos);
  };

  const editTodo = (oldTodoText, newTodoText) => {
    const newTodos = todos.map(todo => todo.todoText === oldTodoText ? { ...todo, todoText: newTodoText } : todo);
    setTodos(newTodos);
  };

  const modifyDate = (oldDueDate, newDueDate) => {
    const newTodos = todos.map(todo => todo.dueDate === oldDueDate ? { ...todo, dueDate: newDueDate } : todo);
    setTodos(newTodos);
  };

  const assignPriority = (todoText, newPriority) => {
    const newTodos = todos.map(todo => todo.todoText === todoText ? { ...todo, priority: newPriority } : todo);
    setTodos(newTodos);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (todoInput.trim() !== '') {
      addTodo(todoInput, dueDateInput, 'Medium');
      console.log("Created new todo");
      setTodoInput('');
      setDueDateInput('');
    }
    e.target.reset();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const results = todos.filter(todo => todo.todoText.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchResults(results);
  };

  return (
    <div className="wrapper">
      <div className="mask gradient-custom-3">
        <Container id="form-container">
          <h1 className="text-center mb-4 py-3">
            <img src={`${process.env.PUBLIC_URL}/logo.svg`} width="112" height="112" alt="Logo" color="#492E87" className="bi bi-clipboard2-check-fill" />
            <br />
            Must Do's
          </h1>
          <Form id="todo-form" className="mb-3" onSubmit={handleFormSubmit}>
            <Row>
              <InputGroup className="mb-3">
                <Col xs={10}>
                  <FormLabel htmlFor="todo-input">ToDo Note</FormLabel>
                  <FormControl type="text" id="todo-input" placeholder="Enter a new ToDo" onChange={(e) => setTodoInput(e.target.value)} />
                </Col>
                <Col xs={2}>
                  <FormLabel htmlFor="due-date-input">Due Date (Optional)</FormLabel>
                  <FormControl type="date" id="due-date-input" onChange={(e) => setDueDateInput(e.target.value)} />
                </Col>
              </InputGroup>
            </Row>
            <Row>
              <Col>
                <Button type="submit" className="btn btn-primary">Add ToDo</Button>
              </Col>
            </Row>
          </Form>
          <Form id="search-form" className="form-inline mb-3" onSubmit={handleSearchSubmit}>
            <InputGroup className="mb-3">
              <Col xs={10}>
                <FormControl id="searchInput" type="search"
                  placeholder="Enter text to search" aria-label="Search"
                  value={searchTerm} onChange={handleSearchChange} />
              </Col>
              <Col xs={2}>
                <Button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</Button>
              </Col>
            </InputGroup>
          </Form>
        </Container>
        <Container id="list-container">
          <h2 className="text-center mb-4 p-3">ToDo List</h2>
          <ListGroup id="todo-list" className="mt-3">
            {
              searchResults.length > 0 ? todos.filter(todo => searchResults.includes(todo)).map(todo => (
                <TodoItem key={todo.id} todo={todo} onEdit={editTodo} onDelete={deleteTodo} onModify={modifyDate} onAssign={assignPriority} />
              )) : todos.map(todo => (
                <TodoItem key={todo.id} todo={todo} onEdit={editTodo} onDelete={deleteTodo} onModify={modifyDate} onAssign={assignPriority} />
              ))
            }
          </ListGroup>
        </Container>
      </div>
    </div>
  );
}

export default App; 