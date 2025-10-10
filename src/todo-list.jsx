
import React from 'react';

function RenderTotalCount(props) {
  return (
    <div>{props.todoItem.length}</div>
  );
}

function RenderInputToAddTodo(props) {
  const [todoItem, setTodo] = React.useState('');

  const handleAddTodo = () => {
    if (todoItem.trim() !== '') {
      props.onAddTodo(todoItem);
      setTodo('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddTodo();
    }
  };

  const handleValueChange = (event) => {
    setTodo(event.target.value);
  };

  return (
    <div>
      <input type="text" placeholder="Add a new todo" value={todoItem} onChange={handleValueChange} onKeyPress={handleKeyPress} />
      <button onClick={handleAddTodo}>Add</button>
    </div>
  )
}

  function RenderList(props) {

    const handleDelteToDo = (index) => {
      props.onDeleteTodo(index);
    };

    const handleTaskDone = (index) => {
      props.handleToggle(index);
    };

    return (
      <div>
        {props.todoList && props.todoList.length > 0 && (
          <ul>
            {props.todoList.map((item, index) => (
              <li key={index}>{item.text}
                <button onClick={() => { handleDelteToDo(index) }}>Delete</button>
                <button onClick={() => { handleTaskDone(index) }}>{item.completed ? 'undo' : 'done'}</button>
              </li>
            ))}
          </ul>
        )}  
      </div>
    );
  }

function TodoList() {
  const [todoList, setTodoList] = React.useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  React.useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todoList));
  }, [todoList]);

  const onAddTodo = (newTodo) => {
    if (!newTodo || newTodo.trim() === '') return;
    newTodo = { text: newTodo, completed: false };
    setTodoList([...todoList, newTodo]);
  };

  const onDeleteTodo = (todoIndex) => {
    if (todoIndex < 0 || todoIndex >= todoList.length) return;
    const updatedList = todoList.filter((_, index) => index !== todoIndex);
    setTodoList(updatedList);
  };

  const handleToggle = (todoIndex) => {
    if (todoIndex < 0 || todoIndex >= todoList.length) return;
    const updatedList = todoList.map((item, index) => {
      if (index === todoIndex) {
        return {...item, completed: !item.completed}
      }
      return item
    });
    setTodoList(updatedList);
  };

  return (
    <div>
      <h1>Todo List</h1>
      <RenderTotalCount todoItem={todoList} />
      <RenderInputToAddTodo onAddTodo={onAddTodo} />
      <RenderList todoList={todoList} onDeleteTodo={onDeleteTodo} handleToggle={handleToggle}/>
    </div>
  )
}

export default TodoList;