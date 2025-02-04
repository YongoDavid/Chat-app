  // Chatapp nav area  and Side Drawer
import {
  Box,
  Input,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  useToast,
  Spinner,
  IconButton,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import {ColorModeToggle} from '../ColorModeToggle';
import { Search, UserSearch , Bell, User, LogOut,X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { ChatLoading } from "../ChatLoading";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import { ProfileModel } from "./ProfileModel";
import { UserListItem } from "../UserAvatar/UserListItem";

export function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const bgColor = useColorModeValue("white", "gray.800");

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter a search term",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
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
        description: "Failed to load search results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const { data } = await axios.post(
        `https://vikash-chat-app.onrender.com/api/chat`,
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setLoadingChat(false);
    }
  };
 

  return (
    <>
      <Box
        bg={bgColor}
        w="100%"
        p={2}
        borderWidth="1px"
        borderBottomWidth="1px"
        borderColor="gray.200"
      >
        <Flex justify="space-between" align="center">
          <HStack>
            <IconButton
              icon={ <UserSearch/>}
              aria-label="Search Users"
              onClick={onOpen}
              variant="ghost"
            />
            <Text fontSize="xl" fontWeight="bold" display={{ base: "none", md: "flex" }}>
              Chat App
            </Text>
          </HStack>

          <Text fontSize="xl" fontWeight="bold" display={{ base: "flex", md: "none" }}>
            Chat App
          </Text>

          <HStack spacing={2}>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Notifications"
                icon={
                  <Box position="relative">
                    {/* <Bell /> */}
                    <NotificationBadge
                      count={notification.length}
                      effect={Effect.SCALE}
                      style={{ position: 'absolute', top: -5, right: -5 }}
                    />
                  </Box>
                }
                variant="ghost"
              />
              <MenuList>
                {!notification.length && <MenuItem>No New Messages</MenuItem>}
                {notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <ColorModeToggle />
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="User menu"
                icon={<User />}
                variant="ghost"
              />
              <MenuList>
                <ProfileModel user={user}>
                  <MenuItem icon={<User size={18} />}>My Profile</MenuItem>
                </ProfileModel>
                <MenuDivider />
                <MenuItem icon={<LogOut size={18} />} onClick={logoutHandler}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Flex justify="space-between" align="center">
              Search Users
              {/* <IconButton
                icon={<X />}
                onClick={onClose}
                variant="ghost"
                aria-label="Close drawer"
              /> */}
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              <HStack w="100%">
                <Input
                  placeholder="Name or Email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <IconButton
                  icon={<Search size="20px" />}
                  onClick={handleSearch}
                  aria-label="Search"
                />
              </HStack>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
              {loadingChat && <Spinner />}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

