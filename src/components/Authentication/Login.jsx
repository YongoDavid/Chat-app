import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Text,
  Divider,
  HStack,
  useColorModeValue,
  Box,
  Heading,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { Eye, EyeOff, Mail, LogIn } from 'lucide-react';
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();
  const buttonBg = useColorModeValue("blue.500", "blue.400");
  const buttonHoverBg = useColorModeValue("blue.600", "blue.500");

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };

      const { data } = await axios.post(
        "https://vikash-chat-app.onrender.com/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      window.location.reload();
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  return (
    <Box w="full" maxW="400px" mx="auto" px={4}>
      <VStack spacing={6} w="full" mt={8}>
        <Heading as="h1" size="xl" textAlign="center" mb={2}>
          Welcome Back
        </Heading>
        <Text fontSize="md" color="gray.600" textAlign="center" mb={4}>
          Sign in to continue to Chat App
        </Text>

        <Button
          w="full"
          h="12"
          variant="outline"
          leftIcon={<Mail size={18} />}
          onClick={() => {}}
          _hover={{ color: "gray.600" }}
        >
          Continue with Google
        </Button>

        <HStack w="full">
          <Divider />
          <Text fontSize="sm" color="gray.500" px={4}>
            OR
          </Text>
          <Divider />
        </HStack>

        <FormControl>
          <FormLabel>Email Address</FormLabel>
          <InputGroup>
            <Input
              size="lg"
              value={email}
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              pr="4.5rem"
            />
            <InputRightElement width="4.5rem" h="100%">
              <Mail color="gray.300" />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <InputGroup size="lg">
            <Input
              value={password}
              type={show ? "text" : "password"}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              pr="4.5rem"
            />
            <InputRightElement width="4.5rem" h="100%">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => setShow(!show)}
                variant="ghost"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          w="full"
          h="12"
          bg={buttonBg}
          color="white"
          _hover={{ bg: buttonHoverBg }}
          onClick={submitHandler}
          isLoading={loading}
          leftIcon={<LogIn size={18} />}
        >
          Login
        </Button>

        <Button
          w="full"
          h="12"
          variant="outline"
          onClick={() => {
            setEmail("guest01@gmail.com");
            setPassword("guest01");
          }}
        >
          Use Guest Credentials
        </Button>

        <Text fontSize="sm" textAlign="center">
          Don't have an account?{" "}
          <Link color={buttonBg} fontWeight="medium" href="/signup">
            Sign up
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

