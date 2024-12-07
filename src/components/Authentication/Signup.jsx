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
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash, FaImage } from "react-icons/fa";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const buttonBg = useColorModeValue("blue.500", "blue.400");
  const buttonHoverBg = useColorModeValue("blue.600", "blue.500");

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "vikash-chat-app");
      data.append("cloud_name", "dtg6gsqzk");
      fetch("https://api.cloudinary.com/v1_1/dtg6gsqzk/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
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
        "https://vikash-chat-app.onrender.com/api/user",
        { name, email, password, pic },
        config
      );

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
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
        Sign up with Google
      </Button>

      <HStack w="full">
        <Divider />
        <Text fontSize="sm" color="gray.500" px={4}>
          OR
        </Text>
        <Divider />
      </HStack>

      <FormControl>
        <FormLabel>Full Name</FormLabel>
        <Input
          size="lg"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Email Address</FormLabel>
        <Input
          size="lg"
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Password</FormLabel>
        <InputGroup size="lg">
          <Input
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

      <FormControl>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="lg">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
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

      <FormControl>
        <FormLabel>Profile Picture</FormLabel>
        <Box
          position="relative"
          border="2px dashed"
          borderColor="gray.200"
          rounded="lg"
          p={4}
          textAlign="center"
        >
          <Input
            type="file"
            height="100%"
            width="100%"
            position="absolute"
            top="0"
            left="0"
            opacity="0"
            aria-hidden="true"
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
          <VStack spacing={2}>
            <Icon as={FaImage} w={6} h={6} color="gray.400" />
            <Text color="gray.500">Click to upload or drag and drop</Text>
            <Text fontSize="sm" color="gray.400">
              PNG, JPG up to 10MB
            </Text>
          </VStack>
        </Box>
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
        Create Account
      </Button>
    </VStack>
  );
};

