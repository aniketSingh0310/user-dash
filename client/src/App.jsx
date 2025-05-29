import { Routes, Route, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link as ChakraLink,
  Container,
} from "@chakra-ui/react";
import DashboardPage from "./pages/DashboardPage";
import CreateUserPage from "./pages/CreateUserPage";
import EditUserPage from "./pages/EditUserPage";

function Navbar() {
  return (
    <Flex
      as="nav"
      bg="gray.800"
      p={4}
      color="white"
      alignItems="center"
      justifyContent="space-between"
      w="100%"
    >
      <ChakraLink
        as={RouterLink}
        to="/"
        fontSize="xl"
        fontWeight="bold"
        _hover={{ textDecoration: "none", color: "gray.300" }}
      >
        User Management
      </ChakraLink>
      <Button
        as={RouterLink}
        to="/create-user"
        colorScheme="teal"
        variant="outline"
        _hover={{ bg: "teal.600", borderColor: "teal.600" }}
      >
        Create User
      </Button>
    </Flex>
  );
}

function App() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Box width={"full"} mx="auto" px={4} py={6} w="100%">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/create-user" element={<CreateUserPage />} />
          <Route path="/edit-user/:userId" element={<EditUserPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
