import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  Wrap,
  WrapItem,
  InputGroup,
  InputLeftElement,
  Divider,
} from "@chakra-ui/react";
import { Search, Users, X } from 'lucide-react';
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { motion, AnimatePresence } from "framer-motion";

export const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const { data } = await axios.get(
        `https://vikash-chat-app.onrender.com/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length < 2) {
      toast({
        title: "Please fill all the fields",
        description: "Group name and at least 2 users are required",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const { data } = await axios.post(
        `https://vikash-chat-app.onrender.com/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered size="md">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="xl" bg="white">
          <ModalHeader
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            pb={2}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <Input
                  placeholder="Group Chat Name"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                  size="lg"
                  borderRadius="md"
                />
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Search size={20} color="gray" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search users to add"
                    onChange={(e) => handleSearch(e.target.value)}
                    size="lg"
                    borderRadius="md"
                  />
                </InputGroup>
              </FormControl>

              <Box>
                <Text fontWeight="semibold" mb={2}>
                  Selected Users:
                </Text>
                <Wrap spacing={2}>
                  <AnimatePresence>
                    {selectedUsers.map((u) => (
                      <motion.div
                        key={u._id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <WrapItem>
                          <HStack
                            bg="blue.100"
                            color="blue.800"
                            px={3}
                            py={1}
                            borderRadius="full"
                            spacing={2}
                          >
                            <Avatar
                              size="xs"
                              name={u.name}
                              src={u.pic}
                            />
                            <Text fontSize="sm">{u.name}</Text>
                            <Box
                              as="button"
                              onClick={() => handleDelete(u)}
                              _hover={{ color: "red.500" }}
                            >
                              <X size={16} />
                            </Box>
                          </HStack>
                        </WrapItem>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Wrap>
              </Box>

              <Box maxH="200px" overflowY="auto">
                <Text fontWeight="semibold" mb={2}>
                  Search Results:
                </Text>
                <VStack align="stretch" spacing={2}>
                  {loading ? (
                    <Text textAlign="center">Loading...</Text>
                  ) : (
                    searchResult.map((user) => (
                      <HStack
                        key={user._id}
                        onClick={() => handleGroup(user)}
                        cursor="pointer"
                        bg="gray.100"
                        p={2}
                        borderRadius="md"
                        transition="all 0.2s"
                        _hover={{ bg: "gray.200" }}
                      >
                        <Avatar size="sm" name={user.name} src={user.pic} />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="semibold">{user.name}</Text>
                          <Text fontSize="xs" color="gray.500">
                            {user.email}
                          </Text>
                        </VStack>
                      </HStack>
                    ))
                  )}
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleSubmit}
              colorScheme="blue"
              leftIcon={<Users size={20} />}
              isDisabled={!groupChatName || selectedUsers.length < 2}
            >
              Create Group Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

