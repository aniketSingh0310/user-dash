import { 
    Box, 
    Image, 
    Text, 
    Heading, 
    VStack, 
    HStack, 
    Avatar, 
    Button, 
    Flex,
    Badge,
    IconButton,
    useColorModeValue
  } from '@chakra-ui/react';
  import { Link as RouterLink } from 'react-router-dom';
  import { EditIcon, PhoneIcon, EmailIcon, CalendarIcon } from '@chakra-ui/icons';
  
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
   
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const statsBg = useColorModeValue('gray.50', 'gray.700');
    
    if (!user) {
      return null;
    }
  
    const { id, _id, name, email, phone, dateOfBirth, profilePicture, followers, following } = user;
    const userId = id || _id;
    const age = dateOfBirth ? calculateAge(dateOfBirth) : 'N/A';
  
    return (
      <Box
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="xl"
        transition="all 0.3s"
        _hover={{ 
          transform: 'translateY(-4px)', 
          boxShadow: '2xl',
          borderColor: 'blue.300'
        }}
        position="relative"
        maxW="400px"
        mx="auto"
      >
       
        <Box
          bgGradient="linear(135deg, blue.400 0%, purple.500 50%, pink.400 100%)"
          h="120px"
          position="relative"
        >
          {/* Edit Button - Floating */}
          <IconButton
            as={RouterLink}
            to={`/edit-user/${userId}`}
            icon={<EditIcon />}
            size="sm"
            colorScheme="whiteAlpha"
            variant="solid"
            position="absolute"
            top={4}
            right={4}
            borderRadius="full"
            _hover={{ bg: 'whiteAlpha.300' }}
          />
          
          
          <Box
            position="absolute"
            bottom="-40px"
            left="50%"
            transform="translateX(-50%)"
          >
            {profilePicture ? (
              <Image 
                src={profilePicture} 
                alt={name}
                borderRadius="full"
                boxSize="80px"
                objectFit="cover"
                border="4px solid"
                borderColor={cardBg}
                fallback={<Avatar size="xl" name={name} border="4px solid" borderColor={cardBg} />}
              />
            ) : (
              <Avatar 
                size="xl" 
                name={name} 
                border="4px solid" 
                borderColor={cardBg}
                bg="blue.500"
              />
            )}
          </Box>
        </Box>
  
       
        <VStack spacing={4} p={6} pt={12} align="stretch">
          
          <VStack spacing={2} textAlign="center">
            <Heading size="lg" fontWeight="700" letterSpacing="-0.5px">
              {name || 'User Name'}
            </Heading>
            
            <VStack spacing={1}>
              <HStack spacing={2} color={textColor} fontSize="sm">
                <EmailIcon boxSize={3} />
                <Text>{email || 'user@example.com'}</Text>
              </HStack>
              
              {phone && (
                <HStack spacing={2} color={textColor} fontSize="sm">
                  <PhoneIcon boxSize={3} />
                  <Text>{phone}</Text>
                </HStack>
              )}
              
              {dateOfBirth && (
                <HStack spacing={2} color={textColor} fontSize="sm">
                  <CalendarIcon boxSize={3} />
                  <Text>{new Date(dateOfBirth).toLocaleDateString()}</Text>
                  <Badge colorScheme="blue" variant="subtle" borderRadius="full" px={2}>
                    {age} years
                  </Badge>
                </HStack>
              )}
            </VStack>
          </VStack>
  
          <Box
            bg={statsBg}
            borderRadius="xl"
            p={4}
            mx={-2}
          >
            <HStack spacing={8} justifyContent="center">
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {followers ? followers.length : 0}
                </Text>
                <Text fontSize="xs" color={textColor} fontWeight="500" textTransform="uppercase" letterSpacing="wide">
                  Followers
                </Text>
              </VStack>
              
              <Box w="1px" h="40px" bg={borderColor} />
              
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                  {following ? following.length : 0}
                </Text>
                <Text fontSize="xs" color={textColor} fontWeight="500" textTransform="uppercase" letterSpacing="wide">
                  Following
                </Text>
              </VStack>
            </HStack>
          </Box>
  
          <HStack spacing={3} pt={2}>
            <Button
              flex={1}
              colorScheme="blue"
              size="md"
              borderRadius="xl"
              fontWeight="600"
              bgGradient="linear(135deg, blue.400, blue.600)"
              _hover={{
                bgGradient: "linear(135deg, blue.500, blue.700)",
                transform: "translateY(-1px)"
              }}
              transition="all 0.2s"
            >
              Follow
            </Button>
            
            </HStack>
        </VStack>
      </Box>
    );
  }
  
  export default UserProfileCard;