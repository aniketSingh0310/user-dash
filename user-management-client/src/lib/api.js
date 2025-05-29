const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

export const getUser = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to create user' }));
    throw new Error(errorData.message || 'Failed to create user');
  }
  return response.json();
};

export const updateUser = async (id, userData) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update user' }));
    throw new Error(errorData.message || 'Failed to update user');
  }
  return response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  return response.json();
};

export const followUser = async (followerId, followingId) => {
  const response = await fetch(`${API_URL}/users/follow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ followerId, followingId }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to follow user' }));
    throw new Error(errorData.message || 'Failed to follow user');
  }
  return response.json();
};

export const unfollowUser = async (followerId, followingId) => {
  const response = await fetch(`${API_URL}/users/unfollow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ followerId, followingId }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to unfollow user' }));
    throw new Error(errorData.message || 'Failed to unfollow user');
  }
  return response.json();
}; 