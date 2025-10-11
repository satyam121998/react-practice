import './App.css';
import PractiseApp from './practise-app';
import TodoList from './todo-list';
import UserManagement from './user-management';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PractiseApp />} />
        <Route path="/todo" element={<TodoList />} />
        <Route path="/user" element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
