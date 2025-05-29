import { Box, Heading, SimpleGrid, Button, Spinner, Text, Flex, Spacer } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserProfileCard from '../components/UserProfileCard';

function DashboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Assuming your server is running on port 3000 and client on 5173 (default Vite)
        // You might need to configure proxy in vite.config.js for /api calls
        const response = await axios.get('http://localhost:3001/api/users');
        setUsers(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />;
  }

  if (error) {
    return <Text color="red.500">Error fetching users: {error}</Text>;
  }

  return (
    <Box p={5}>
        <Flex mb={5} alignItems="center">
            <Heading>User Dashboard</Heading>
            <Spacer />
            <Button as={RouterLink} to="/create-user" colorScheme="teal">
                Create New User
            </Button>
        </Flex>
      
      {users.length === 0 ? (
        <Text>No users found. Click "Create New User" to add some!</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {users.map((user) => (
            <UserProfileCard key={user.id || user._id} user={user} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}

export default DashboardPage; 