import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { SingleChat } from "./SingleChat";

export const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="stretch"
      flexDir="column"
      bg={bgColor}
      w={{ base: "100%", md: "68%" }}
      borderRadius={{ base: "none", md: "lg" }}
      borderWidth={{ base: 0, md: "1px" }}
      h={{ base: "calc(100vh - 60px)", md: "calc(100vh - 80px)" }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

