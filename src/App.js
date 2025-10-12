import './App.css';
import PractiseApp from './practise-app';
import TodoList from './todo-list';
import UserManagement from './user-management';
import UserManagementWithContext from './user-management-context-api';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PractiseApp />} />
        <Route path="/todo" element={<TodoList />} />
        <Route path="/user" element={<UserManagement />} />
        <Route path="/user-context" element={<UserManagementWithContext />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
