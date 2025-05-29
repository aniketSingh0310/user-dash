import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    useToast,
    FormErrorMessage,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  
  function CreateUserPage() {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      // profilePicture: '' // Will handle file uploads later if needed
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: null }));
      }
    };
  
    const validateForm = () => {
      const newErrors = {};
      if (!formData.name.trim()) newErrors.name = "Name is required.";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required.";
      } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
        newErrors.email = "Email is invalid.";
      }
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of Birth is required.";
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
        await axios.post("/api/users", formData);
        toast({
          title: "User created.",
          description: "We've created the user for you.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/"); // Navigate back to dashboard after successful creation
      } catch (err) {
        console.error("Error creating user:", err);
        const apiErrorMessage =
          err.response?.data?.message ||
          "Could not create user. Please try again.";
        setErrors((prev) => ({ ...prev, form: apiErrorMessage }));
        toast({
          title: "Error creating user.",
          description: apiErrorMessage,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <Box p={5} maxWidth="600px" margin="auto">
        <Heading mb={5}>Create New User</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.name} isRequired>
              <FormLabel htmlFor="name">Full Name</FormLabel>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>
  
            <FormControl isInvalid={!!errors.email} isRequired>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
  
            <FormControl isInvalid={!!errors.phone}>
              <FormLabel htmlFor="phone">Phone Number</FormLabel>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>
  
            <FormControl isInvalid={!!errors.dateOfBirth} isRequired>
              <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.dateOfBirth}</FormErrorMessage>
            </FormControl>
  
            {/* TODO: Add profile picture upload (Firebase integration) */}
  
            {errors.form && (
              <Text color="red.500" mt={2}>
                {errors.form}
              </Text>
            )}
  
            <Button
              mt={4}
              colorScheme="teal"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Submitting"
            >
              Create User
            </Button>
          </VStack>
        </form>
      </Box>
    );
  }
  
  export default CreateUserPage;