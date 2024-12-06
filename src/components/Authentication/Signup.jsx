import { Button, FormControl, FormLabel, Input, InputGroup, InputRightAddon, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react';
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setShow(!show);
  }
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
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
          console.log(data);
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
        position: "bottom"
      })
      setLoading(false);
      return;
    }
  }
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
// console.log(name, email, password, pic);
      const { data } = await axios.post(
        "https://vikash-chat-app.onrender.com/api/user",
        { name, email, password, pic },
        config
      );
// console.log(data);
      toast({
        title: "Registration Successfull",
        status: "Success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem('userInfo', JSON.stringify(data));

      setLoading(false);
      navigate('/chats')
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
   }
  }

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name </FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email </FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password </FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement>
            <Button h="1.75rem" size="sm" onClick={handleClick} >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmpassword" isRequired>
        <FormLabel>Confirm Password </FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Your Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic" isRequired>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button colorScheme="blue" w="100%" mt="15" onClick={submitHandler} isLoading={loading}>
        Sign Up
      </Button>
    </VStack>
  );
}
