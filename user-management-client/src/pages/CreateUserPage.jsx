import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../components/UserForm';
import { createUser } from '../lib/api';

const CreateUserPage = () => {
  const navigate = useNavigate();

  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData);
      navigate('/'); // Redirect to dashboard after creation
    } catch (error) {
      console.error("Failed to create user:", error);
      // The UserForm component will display specific error messages
      throw error; // Re-throw to be caught by UserForm's error handling
    }
  };

  return (
    <div>
      <UserForm onSubmit={handleCreateUser} />
    </div>
  );
};

export default CreateUserPage; 