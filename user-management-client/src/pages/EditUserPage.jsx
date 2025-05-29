import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserForm from '../components/UserForm';
import { getUser, updateUser } from '../lib/api';

const EditUserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUser(userId);
        setUser(userData);
        setError('');
      } catch (err) {
        setError('Failed to fetch user details. ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleUpdateUser = async (userData) => {
    try {
      await updateUser(userId, userData);
      navigate('/'); // Redirect to dashboard after update
    } catch (error) {
      console.error("Failed to update user:", error);
      // UserForm will display specific error messages
      throw error; // Re-throw to be caught by UserForm's error handling
    }
  };

  if (loading) return <p className="text-center mt-8">Loading user details...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!user) return <p className="text-center mt-8">User not found.</p>;

  return (
    <div>
      <UserForm existingUser={user} onSubmit={handleUpdateUser} isEditMode={true} />
    </div>
  );
};

export default EditUserPage; 