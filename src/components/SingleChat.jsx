import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Text,
  Flex,
  IconButton,
  Input,
  Spinner,
  useToast,
  Avatar,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowLeft, Send, Phone, Video, MoreVertical } from 'lucide-react';
import axios from "axios";
import Lottie from "react-lottie";
import io from "socket.io-client";
import { ScrollableChat } from "./ScrollableChat";
import { ProfileModel } from "./miscellaneous/ProfileModel";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import animationData from "../animations/typing.json";

const ENDPOINT = "https://vikash-chat-app.onrender.com";

let socket, selectedChatCompare;

export const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();
  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
  const messagesEndRef = useRef(null);

  // Move all useColorModeValue calls here
  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const inputBgColor = useColorModeValue("gray.100", "gray.700");
  const chatBgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("gray.600", "gray.400");
  const headerBgColor = useColorModeValue("white", "gray.800");
  const subTextColor = useColorModeValue("gray.500", "gray.400");
  const placeholderColor = useColorModeValue("gray.500", "gray.400");
  const messageTextColor = useColorModeValue("gray.600", "gay.600");

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `https://vikash-chat-app.onrender.com/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async () => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
            "Access-Control-Allow-Origin": "*",
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "https://vikash-chat-app.onrender.com/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT, {
      transports: ['websocket', 'polling', 'flashsocket']
    });
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.off("setup");
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    const handleNewMessage = (newMessageReceived) => {
      if (
        !selectedChatCompare || 
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    };

    socket.on("message received", handleNewMessage);

    return () => {
      socket.off("message received", handleNewMessage);
    };
  }, [selectedChatCompare, notification, fetchAgain]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <Flex direction="column" h="100%" position="relative" bg={bgColor}>
      {selectedChat ? (
        <>
          <Flex 
            align="center" 
            justify="space-between" 
            p={4} 
            borderBottom="1px" 
            borderColor={borderColor}
            position={{ base: "fixed", md: "static" }}
            top={0}
            left={0}
            right={0}
            bg={headerBgColor}
            zIndex={10}
          >
            <HStack spacing={3}>
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowLeft size={20} />}
                onClick={() => setSelectedChat("")}
                aria-label="Back"
                variant="ghost"
                color={iconColor}
              />
              <Avatar 
                size="sm" 
                name={!selectedChat.isGroupChat 
                  ? getSender(user, selectedChat.users) 
                  : selectedChat.chatName
                } 
                src={!selectedChat.isGroupChat 
                  ? getSenderFull(user, selectedChat.users).pic 
                  : undefined
                }
              />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="sm" color={textColor}>
                  {!selectedChat.isGroupChat
                    ? getSender(user, selectedChat.users)
                    : selectedChat.chatName}
                </Text>
                <Text fontSize="xs" color={subTextColor}>
                  {selectedChat.isGroupChat ? `${selectedChat.users.length} members` : "Online"}
                </Text>
              </VStack>
            </HStack>
            <HStack>
              <IconButton
                icon={<Phone size={18} />}
                aria-label="Voice Call"
                variant="ghost"
                size="sm"
                color={iconColor}
              />
              <IconButton
                icon={<Video size={18} />}
                aria-label="Video Call"
                variant="ghost"
                size="sm"
                color={iconColor}
              />
              {selectedChat.isGroupChat ? (
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                >
                  <IconButton
                    icon={<MoreVertical size={18} />}
                    aria-label="More options"
                    variant="ghost"
                    size="sm"
                    color={iconColor}
                  />
                </UpdateGroupChatModal>
              ) : (
                <ProfileModel user={getSenderFull(user, selectedChat.users)}>
                  <IconButton
                    icon={<MoreVertical size={18} />}
                    aria-label="More options"
                    variant="ghost"
                    size="sm"
                    color={iconColor}
                  />
                </ProfileModel>
              )}
            </HStack>
          </Flex>

          <Flex direction="column" pt={{ base: 0 , md: 0 }} h="calc(100vh - 60px)" overflow="hidden">
            <Box 
              flex={1} 
              overflowY="auto" 
              p={3} 
              pt={{ base: "20px", md: 3 }}
              bg={chatBgColor} 
              position="relative"
            >
              {loading ? (
                <Flex justify="center" align="center" h="100%">
                  <Spinner size="xl" color={textColor} />
                </Flex>
              ) : (
                <VStack spacing={3} align="stretch">
                  <ScrollableChat messages={messages} messageTextColor={messageTextColor} />
                  <div ref={messagesEndRef} />
                </VStack>
              )}
            </Box>

            <Box p={3} borderTop="1px" borderColor={borderColor} bg={headerBgColor}>
              {isTyping && (
                <Lottie
                  options={defaultOptions}
                  width={70}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                />
              )}
              <Flex>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={typingHandler}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  bg={inputBgColor}
                  color={textColor}
                  borderRadius="full"
                  mr={2}
                  _placeholder={{ color: placeholderColor }}
                />
                <IconButton
                  colorScheme="blue"
                  aria-label="Send message"
                  icon={<Send size={18} />}
                  onClick={sendMessage}
                  isRound
                />
              </Flex>
            </Box>
          </Flex>
        </>
      ) : (
        <Flex align="center" justify="center" h="100%" bg={bgColor}>
          <Text fontSize="xl" fontWeight="medium" color={textColor}>
            Select a chat to start messaging
          </Text>
        </Flex>
      )}
    </Flex>
  );
};