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
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
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
    <VStack spacing={6} w="full">
      <Button
        w="full"
        h="12"
        variant="outline"
        leftIcon={<Icon as={FaGoogle} />}
        onClick={() => {}}
        _hover={{ bg: "gray.50" }}
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
        <Input
          size="lg"
          value={email}
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Password</FormLabel>
        <InputGroup size="lg">
          <Input
            value={password}
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="3rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShow(!show)}
              variant="ghost"
            >
              <Icon as={show ? FaEyeSlash : FaEye} />
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
      >
        Login
      </Button>

      <Button
        w="full"
        h="12"
        variant="outline"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Use Guest Credentials
      </Button>
    </VStack>
  );
};

