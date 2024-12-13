import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Stack,
  Text,
  Skeleton,
  useToast,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import {ChatLoading} from "./ChatLoading";
import {GroupChatModal} from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { motion } from "framer-motion";



export const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const selectedBgColor = useColorModeValue("blue.500", "blue.600");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  const fetchChats = async () => {
    // console.log(user._id);
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
        title: "Error Occured!",
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
    // eslint-disable-next-line
  }, [fetchAgain]);

  const filteredChats = chats?.filter((chat) =>
    chat.isGroupChat
      ? chat.chatName.toLowerCase().includes(searchTerm.toLowerCase())
      : getSender(loggedUser, chat.users)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
  );


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
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            colorScheme="blue"
          >
            Group Chat
          </Button>
        </GroupChatModal>
      </Flex>
      <VStack
        spacing={2}
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? selectedBgColor : bgColor}
                color={selectedChat === chat ? "white" : textColor}
                px={2}
                py={4}
                borderRadius="lg"
                transition="all 0.3s"
                _hover={{
                  bg: selectedChat === chat ? selectedBgColor : hoverBgColor,
                }}
                boxShadow={selectedChat === chat ? "md" : "none"}
              >
                <Text fontWeight="bold">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs" color={mutedTextColor}>
                    <Text as="span" fontWeight="bold">
                      {chat.latestMessage.sender.name}:{" "}
                    </Text>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            </motion.div>
          ))
        ) : (
          <Stack>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} height="60px" />
            ))}
          </Stack>
        )}
      </VStack>
    </Box>
  );
};
