import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import { Button } from './components/ui/button'; // Assuming shadcn setup
import './App.css'; // You can create this for additional global styles

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <Link to="/" className="text-xl font-bold hover:text-gray-300">User Management</Link>
      <Link to="/create">
        <Button variant="secondary" className='text-black'>Create User</Button>
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      {/* <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<DashboardPage/>} />
          <Route path="/create" element={<CreateUserPage />} />
          <Route path="/edit/:userId" element={<EditUserPage />} />
        </Routes>
      </div> */}
    </Router>
  );
}

export default App; 