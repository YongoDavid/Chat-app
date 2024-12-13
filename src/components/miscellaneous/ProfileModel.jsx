import { ViewIcon } from "@chakra-ui/icons";
import {
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  Text,
  VStack,
  HStack,
  Box,
  Switch,
  Button,
  Grid,
  GridItem,
  Divider,
} from "@chakra-ui/react";
import { BsCameraVideo, BsTelephone } from "react-icons/bs";
import { RiUserUnfollowLine, RiFlag2Line, RiDeleteBin6Line } from "react-icons/ri";

export const ProfileModel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
          aria-label="View Profile"
        />
      )}
      
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        size="sm"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="xl" maxH="85vh" overflow="auto">
          <ModalHeader fontSize="lg" fontWeight="medium" pb={2}>
            Contact info
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody p={0}>
            <VStack spacing={6} align="stretch">
              {/* Profile Section */}
              <VStack px={6} spacing={3} align="center">
                <Image
                  borderRadius="full"
                  boxSize="120px"
                  src={user?.pic}
                  alt={user?.name}
                  objectFit="cover"
                />
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold">
                    {user?.name}
                  </Text>
                  <Text fontSize="sm" color="green.500">
                    Online
                  </Text>
                </VStack>
                
                <HStack spacing={4}>
                  <IconButton
                    aria-label="Video Call"
                    icon={<BsCameraVideo />}
                    variant="ghost"
                    rounded="full"
                    size="lg"
                  />
                  <IconButton
                    aria-label="Voice Call"
                    icon={<BsTelephone />}
                    variant="ghost"
                    rounded="full"
                    size="lg"
                  />
                </HStack>
              </VStack>

              {/* About Section */}
              <Box px={6}>
                <Text fontWeight="bold" mb={2}>
                  About
                </Text>
                <Text color="gray.600">
                  {user?.about || "Hello! My name is " + user?.name}
                </Text>
              </Box>

              {/* Settings Section */}
              <VStack px={6} spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text>Mute notifications</Text>
                  <Switch colorScheme="blue" />
                </HStack>
                <HStack justify="space-between">
                  <Text>Disappearing messages</Text>
                  <Text color="gray.500">Off</Text>
                </HStack>
              </VStack>

              {/* Action Buttons */}
              <VStack px={6} pb={6} spacing={3} align="stretch">
                <Divider />
                <Button
                  leftIcon={<RiUserUnfollowLine />}
                  variant="ghost"
                  colorScheme="red"
                  justifyContent="flex-start"
                  fontWeight="normal"
                >
                  Block {user?.name}
                </Button>
                <Button
                  leftIcon={<RiFlag2Line />}
                  variant="ghost"
                  colorScheme="red"
                  justifyContent="flex-start"
                  fontWeight="normal"
                >
                  Report {user?.name}
                </Button>
                <Button
                  leftIcon={<RiDeleteBin6Line />}
                  variant="ghost"
                  colorScheme="red"
                  justifyContent="flex-start"
                  fontWeight="normal"
                >
                  Delete chat
                </Button>
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
