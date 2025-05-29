import { Box, Image, Text, Heading, VStack, HStack, Tag, Avatar, Button, Spacer, Flex } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

// Helper function to calculate age
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

function UserProfileCard({ user }) {
  if (!user) {
    return null; // Or some placeholder/loading state
  }

  const { id, _id, name, email, phone, dateOfBirth, profilePicture, followers, following } = user;
  const userId = id || _id; // Handle both MongoDB _id and potential SQL id
  const age = dateOfBirth ? calculateAge(dateOfBirth) : 'N/A';

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} boxShadow="md" display="flex" flexDirection="column" height="100%">
      <VStack spacing={4} align="stretch" flexGrow={1}>
        <HStack justifyContent="space-between" alignItems="flex-start">
            <Avatar size="xl" name={name} src={profilePicture || 'https://bit.ly/broken-link'} />
            <VStack align="start" flexGrow={1} ml={3}>
                 <Heading size="md">{name || 'User Name'}</Heading>
                 <Text fontSize="sm" color="gray.500" wordBreak="break-all">{email || 'user@example.com'}</Text>
            </VStack>
        </HStack>

        <Text><strong>Phone:</strong> {phone || 'N/A'}</Text>
        <Text><strong>Date of Birth:</strong> {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : 'N/A'}</Text>
        <Text><strong>Age:</strong> {age}</Text>

        <HStack spacing={4} mt={2} justifyContent="space-around">
          <Box textAlign="center">
            <Text fontSize="xl" fontWeight="bold">{followers ? followers.length : 0}</Text>
            <Text fontSize="sm" color="gray.600">Followers</Text>
          </Box>
          <Box textAlign="center">
            <Text fontSize="xl" fontWeight="bold">{following ? following.length : 0}</Text>
            <Text fontSize="sm" color="gray.600">Following</Text>
          </Box>
        </HStack>
      </VStack>

      <Flex mt={4} justifyContent="flex-end">
        {/* TODO: Add Follow/Unfollow button functionality */}
        <Button as={RouterLink} to={`/edit-user/${userId}`} size="sm" colorScheme="blue" ml={2}>
            Edit Profile
        </Button>
      </Flex>
    </Box>
  );
}

export default UserProfileCard; 