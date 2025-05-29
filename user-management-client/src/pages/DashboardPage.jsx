import React, { useState, useEffect, useCallback } from 'react';
import UserCard from '../components/UserCard';
import { getUsers, deleteUser, followUser, unfollowUser } from '../lib/api';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

// Dummy current user ID - replace with actual auth logic
const CURRENT_USER_ID = 999; 

const DashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userToDelete, setUserToDelete] = useState(null); // For delete confirmation

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const usersData = await getUsers();
      // Simulate checking if current user is following each user
      // In a real app, the backend should ideally provide this information
      const usersWithFollowStatus = usersData.map(u => ({
        ...u,
        // Check if CURRENT_USER_ID is in the user's Followers list
        isFollowedByCurrentUser: u.Followers ? u.Followers.some(follower => follower.id === CURRENT_USER_ID) : false
      }));
      setUsers(usersWithFollowStatus);
      setError('');
    } catch (err) {
      setError('Failed to fetch users. ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setUserToDelete(null); // Close dialog
    } catch (err) {
      setError('Failed to delete user. ' + err.message);
      console.error(err);
    }
  };

  const handleFollowToggle = async (followerId, followingId, isCurrentlyFollowing) => {
    try {
      if (isCurrentlyFollowing) {
        await unfollowUser(followerId, followingId);
      } else {
        await followUser(followerId, followingId);
      }
      // Refetch users to update follow counts and status
      // This is a simple way; more optimized updates are possible
      fetchUsers(); 
    } catch (err) {
      setError('Failed to update follow status. ' + err.message);
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-8">Loading users...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">User Dashboard</h1>
      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users found. Create one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map(user => (
            <UserCard 
              key={user.id} 
              user={user} 
              onDelete={() => setUserToDelete(user)} // Open confirmation dialog
              onFollowToggle={handleFollowToggle}
              isCurrentUserFollowing={user.isFollowedByCurrentUser}
            />
          ))}
        </div>
      )}

      {userToDelete && (
        <Dialog open={!!userToDelete} onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {userToDelete.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                 <Button variant="outline" onClick={() => setUserToDelete(null)}>Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDeleteUser}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DashboardPage; 