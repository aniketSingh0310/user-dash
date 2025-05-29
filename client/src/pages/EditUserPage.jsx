import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Spinner,
  Text,
  FormErrorMessage,
  Flex,
  Spacer,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Container
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';

function EditUserPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const cancelRef = useRef();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    // profilePicture: '' // Will handle file uploads later if needed for Firebase
  });
  const [initialData, setInitialData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const response = await axios.get(`/api/users/${userId}`); // Uses /api prefix
        const userData = response.data;
        // Format dateOfBirth for input type='date' which expects YYYY-MM-DD
        if (userData.dateOfBirth) {
          userData.dateOfBirth = new Date(userData.dateOfBirth).toISOString().split('T')[0];
        }
        setFormData(userData);
        setInitialData(userData); 
      } catch (err) {
        console.error("Error fetching user:", err);
        const errMsg = err.response?.data?.message || "Could not fetch user data. Please ensure the user ID is correct and the server is running.";
        setFetchError(errMsg);
        toast({
          title: 'Error Fetching User',
          description: errMsg,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) {
      fetchUser();
    }
  }, [userId, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required.';
    // Add more specific validation for phone if needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
        toast({
            title: "Validation Error",
            description: "Please check the form for errors.",
            status: "error",
            duration: 5000,
            isClosable: true,
        });
        return;
    }
    setIsSubmitting(true);
    try {
      const changedData = {};
      for (const key in formData) {
        // Ensure we only send fields that are part of the core User model if necessary
        // or if the backend can handle extra fields gracefully.
        if (formData[key] !== initialData[key] && Object.prototype.hasOwnProperty.call(initialData, key)) {
             changedData[key] = formData[key];
        }
      }
      // If dateOfBirth wasn't changed but was initially null/undefined, and now it is an empty string from form,
      // ensure it's set to null to avoid DB errors for empty string dates.
      if (changedData.dateOfBirth === '' && (initialData.dateOfBirth === null || initialData.dateOfBirth === undefined)) {
        changedData.dateOfBirth = null;
      }

      if (Object.keys(changedData).length === 0) {
        toast({
            title: "No changes made.",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
        setIsSubmitting(false);
        return;
      }

      await axios.put(`/api/users/${userId}`, changedData); // Uses /api prefix
      toast({
        title: 'User Updated',
        description: "User details have been successfully updated.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/'); // Navigate back to dashboard
    } catch (err) {
      console.error("Error updating user:", err);
      const apiErrorMessage = err.response?.data?.message || "Could not update user. Please try again.";
      setErrors(prev => ({...prev, form: apiErrorMessage }));
      toast({
        title: 'Error Updating User',
        description: apiErrorMessage,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/users/${userId}`); // Uses /api prefix
      toast({
        title: 'User Deleted',
        description: "The user has been successfully deleted.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/');
    } catch (err) {
      console.error("Error deleting user:", err);
      toast({
        title: 'Error Deleting User',
        description: err.response?.data?.message || "Could not delete user. Please try again.",
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      onAlertClose();
    }
  };

  if (isLoading) {
    return <Flex justify="center" align="center" minH="80vh"><Spinner size="xl" /></Flex>;
  }

  if (fetchError) {
    return (
        <Container centerContent p={5}>
            <Heading color="red.500" mb={4}>Error</Heading>
            <Text mb={4}>{fetchError}</Text>
            <Button as={RouterLink} to="/" colorScheme="teal">
                Go to Dashboard
            </Button>
        </Container>
    );
  }

  return (
    <Box p={5} maxWidth={{ base: "100%", md: "700px" }} margin="auto">
      <Flex mb={5} alignItems="center">
        <Heading size={{base: "lg", md: "xl"}}>Edit User: {initialData.name || ''}</Heading>
        <Spacer />
        <Button colorScheme="red" onClick={onAlertOpen} isLoading={isDeleting} size={{base: "sm", md: "md"}}>
          Delete User
        </Button>
      </Flex>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!!errors.name} isRequired>
            <FormLabel htmlFor="name">Full Name</FormLabel>
            <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email} isRequired>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.phone}>
            <FormLabel htmlFor="phone">Phone Number</FormLabel>
            <Input id="phone" name="phone" type="tel" value={formData.phone || ''} onChange={handleChange} />
            <FormErrorMessage>{errors.phone}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.dateOfBirth} isRequired>
            <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
            <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth || ''} onChange={handleChange} />
            <FormErrorMessage>{errors.dateOfBirth}</FormErrorMessage>
          </FormControl>

          {/* TODO: Add profile picture upload (Firebase integration) */}
          <Box mt={4} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
            <Heading size="sm" mb={2}>Manage Following</Heading>
            <Text color="gray.500"> (Feature to add/remove followed users will be here soon)</Text>
          </Box>

          {errors.form && (
            <Text color="red.500" mt={2} textAlign="center">{errors.form}</Text>
          )}

          <Button 
            mt={6} 
            colorScheme="teal" 
            type="submit" 
            isLoading={isSubmitting} 
            loadingText="Saving..."
            size={{base: "sm", md: "md"}}
            >
            Save Changes
          </Button>
        </VStack>
      </form>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent mx={4}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Deletion
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete user "{initialData.name || 'this user'}"? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose} isDisabled={isDeleting} size={{base: "sm", md: "md"}}>
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleDelete} 
                ml={3} 
                isLoading={isDeleting} 
                loadingText="Deleting..."
                size={{base: "sm", md: "md"}}
                >
                Delete User
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default EditUserPage;
