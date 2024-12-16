import { Box, Button, Flex, Stack, Text, Skeleton, useToast, useColorModeValue, VStack, Avatar, HStack } from "@chakra-ui/react";
import { UserRoundPlus, CheckCheck, ChevronRight } from 'lucide-react';
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import { GroupChatModal } from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { motion } from "framer-motion";

export const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");
  const selectedBgColor = useColorModeValue("blue.50", "blue.900");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");
  const dateColor = useColorModeValue("gray.500", "gray.500");

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      const { data } = await axios.get(
        "https://vikash-chat-app.onrender.com/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  const filteredChats = chats?.filter((chat) =>
    chat.isGroupChat
      ? chat.chatName.toLowerCase().includes(searchTerm.toLowerCase())
      : getSender(loggedUser, chat.users)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return messageDate.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: '2-digit' });
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Flex
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontWeight="bold">Chats</Text>
        <GroupChatModal>
          <Button
            variant="ghost"
            size="sm"
            p={2}
            _hover={{ bg: 'gray.100' }}
          >
            <UserRoundPlus size={24} />
          </Button>
        </GroupChatModal>
      </Flex>
      <VStack
        spacing={0}
        align="stretch"
        w="100%"
        h="calc(100% - 140px)"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "gray.300",
            borderRadius: "24px",
          },
        }}
      >
        {chats ? (
          filteredChats.map((chat) => (
            <motion.div
              key={chat._id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? selectedBgColor : bgColor}
                color={textColor}
                px={4}
                py={3}
                borderBottom="1px"
                borderColor="gray.100"
                transition="all 0.2s"
                _hover={{
                  bg: selectedChat === chat ? selectedBgColor : hoverBgColor,
                }}
              >
                <HStack spacing={3} align="start">
                  <Avatar 
                    size="md" 
                    name={!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                    src={chat.isGroupChat ? null : chat.users.find(u => u._id !== loggedUser?._id)?.pic}
                  />
                  <Box flex="1">
                    <Flex justify="space-between" align="center" mb={1}>
                      <Text fontWeight="bold" fontSize="md">
                        {!chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName}
                      </Text>
                      <Text fontSize="xs" color={dateColor}>
                        {chat.latestMessage ? formatDate(chat.latestMessage.createdAt) : ''}
                      </Text>
                    </Flex>
                    {chat.latestMessage && (
                      <HStack spacing={1} align="center">
                        <CheckCheck size={16} color="#63B3ED" />
                        <Text fontSize="sm" color={mutedTextColor} noOfLines={1}>
                          {chat.latestMessage.content}
                        </Text>
                      </HStack>
                    )}
                  </Box>
                  <ChevronRight size={18} color="#CBD5E0" />
                </HStack>
              </Box>
            </motion.div>
          ))
        ) : (
          <Stack spacing={4} p={4}>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} height="70px" borderRadius="lg" />
            ))}
          </Stack>
        )}
      </VStack>
    </Box>
  );
};

