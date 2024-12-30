import {
  Box,
  Flex,
  Stack,
  Text,
  Skeleton,
  useToast,
  useColorModeValue,
  VStack,
  Avatar,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { CheckCheck, ChevronRight, Search } from 'lucide-react';
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
// import { GroupChatModal } from "./miscellaneous/GroupChatModal";
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
        position: "bottom",
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
      bg={bgColor}
      w={{ base: "100%", md: "31%" }}
      borderRadius={{ base: "none", md: "lg" }}
      borderWidth={{ base: "0", md: "1px" }}
      h={{ base: "100vh", md: "auto" }}
    >
      <Flex
        p={3}
        fontSize={{ base: "20px", md: "24px" }}
        fontFamily="Work sans"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        borderBottomWidth="1px"
        borderColor="gray.200"
      >
        {/* CHAT MAIN PAGE   */}
        {/* <Text fontWeight="bold">Chats</Text> */}
        {/* <GroupChatModal>
          <IconButton
            variant="ghost"
            icon={<UserRoundPlus size={24} />}
            aria-label="New Group Chat"
            _hover={{ bg: 'gray.100' }}
          />
        </GroupChatModal> */}
        <InputGroup size="md" px={4} py={2}>
          <InputLeftElement pointerEvents="none">
            <Search color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderRadius="full"
          />
        </InputGroup>
      </Flex>

      <VStack
        spacing={0}
        align="stretch"
        w="100%"
        flex={1}
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
              whileTap={{ scale: 0.98 }}
            >
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? selectedBgColor : bgColor}
                color={textColor}
                px={4}
                py={3}
                borderBottomWidth="1px"
                borderColor="gray.100"
                transition="all 0.2s"
                _hover={{
                  bg: selectedChat === chat ? selectedBgColor : hoverBgColor,
                }}
              >
                <HStack spacing={3} align="center">
                  <Avatar 
                    size="md" 
                    name={!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                    src={chat.isGroupChat ? null : chat.users.find(u => u._id !== loggedUser?._id)?.pic}
                  />
                  <Box flex="1" overflow="hidden">
                    <Flex justify="space-between" align="center" mb={1}>
                      <Text fontWeight="bold" fontSize="md" isTruncated>
                        {!chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName}
                      </Text>
                      <Text fontSize="xs" color={dateColor} flexShrink={0} ml={2}>
                        {chat.latestMessage ? formatDate(chat.latestMessage.createdAt) : ''}
                      </Text>
                    </Flex>
                    {chat.latestMessage && (
                      <HStack spacing={1} align="center">
                        <CheckCheck size={14} color="#63B3ED" flexShrink={0} />
                        <Text fontSize="sm" color={mutedTextColor} isTruncated>
                          {chat.latestMessage.content}
                        </Text>
                      </HStack>
                    )}
                  </Box>
                  <ChevronRight size={18} color="#CBD5E0" flexShrink={0} />
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

