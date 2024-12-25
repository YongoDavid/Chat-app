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
  Divider,
  useColorModeValue,
  useBreakpointValue,
  Flex,
} from "@chakra-ui/react";
import { Eye, Video, Phone, UserMinus, Flag, Trash2, ChevronRight, Bell, Clock } from 'lucide-react';

export const ProfileModel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {children ? (
        <Box onClick={onOpen}>{children}</Box>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<Eye />}
          onClick={onOpen}
          aria-label="View Profile"
          variant="ghost"
        />
      )}
      
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        size={isMobile ? "full" : "sm"}
        scrollBehavior={isMobile ? "inside" : "outside"}
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent 
          borderRadius={isMobile ? "none" : "xl"} 
          my={0}
          maxH={isMobile ? "100vh" : "85vh"} 
          h={isMobile ? "100vh" : "auto"}
          bg={bgColor}
        >
          <Flex direction="column" h="full">
            <ModalHeader 
              fontSize="lg" 
              fontWeight="medium" 
              pb={2}
              position="sticky"
              top={0}
              zIndex={10}
              bg={bgColor}
              borderBottom="1px solid"
              borderColor="gray.200"
            >
              Contact info
              <ModalCloseButton />
            </ModalHeader>
            
            <ModalBody p={0} overflowY="auto" flex={1}>
              <VStack spacing={6} align="stretch" pb={isMobile ? 16 : 0}>
                {/* Profile Section */}
                <VStack px={isMobile ? 4 : 6} pt={4} spacing={3} align="center">
                  <Image
                    borderRadius="full"
                    boxSize="120px"
                    src={user?.pic}
                    alt={user?.name}
                    objectFit="cover"
                  />
                  <VStack spacing={1}>
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                      {user?.name}
                    </Text>
                    <Text fontSize="sm" color="green.500">
                      Online
                    </Text>
                  </VStack>
                  
                  <HStack spacing={4}>
                    <IconButton
                      aria-label="Video Call"
                      icon={<Video size={24} />}
                      variant="ghost"
                      rounded="full"
                      size="lg"
                    />
                    <IconButton
                      aria-label="Voice Call"
                      icon={<Phone size={24} />}
                      variant="ghost"
                      rounded="full"
                      size="lg"
                    />
                  </HStack>
                </VStack>

                {/* About Section */}
                <Box px={isMobile ? 4 : 6} py={2}>
                  <Text fontWeight="bold" mb={2} color={textColor}>
                    About
                  </Text>
                  <Text color={mutedTextColor}>
                    {user?.about || `Hello! My name is ${user?.name}`}
                  </Text>
                </Box>

                {/* Settings Section */}
                <VStack px={isMobile ? 4 : 6} py={2} spacing={4} align="stretch">
                  {isMobile ? (
                    <>
                      <HStack justify="space-between" 
                        as={Button} 
                        variant="ghost" 
                        w="full" 
                        justifyContent="space-between" 
                        px={0}
                        rightIcon={<ChevronRight size={20} />}
                      >
                        <HStack>
                          <Bell size={20} />
                          <Text>Mute notifications</Text>
                        </HStack>
                        <Switch colorScheme="blue" size="sm" />
                      </HStack>
                      <HStack justify="space-between" 
                        as={Button} 
                        variant="ghost" 
                        w="full" 
                        justifyContent="space-between"
                        px={0}
                        rightIcon={<ChevronRight size={20} />}
                      >
                        <HStack>
                          <Clock size={20} />
                          <Text>Disappearing messages</Text>
                        </HStack>
                        <Text fontSize="sm" color={mutedTextColor}>Off</Text>
                      </HStack>
                    </>
                  ) : (
                    <>
                      <HStack justify="space-between">
                        <Text>Mute notifications</Text>
                        <Switch colorScheme="blue" />
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Disappearing messages</Text>
                        <Text color="gray.500">Off</Text>
                      </HStack>
                    </>
                  )}
                </VStack>

                {/* Action Buttons */}
                <VStack px={isMobile ? 4 : 6} pb={6} spacing={3} align="stretch">
                  <Divider />
                  <Button
                    leftIcon={<UserMinus size={20} />}
                    variant="ghost"
                    colorScheme="red"
                    justifyContent="flex-start"
                    fontWeight="normal"
                  >
                    Block {user?.name}
                  </Button>
                  <Button
                    leftIcon={<Flag size={20} />}
                    variant="ghost"
                    colorScheme="red"
                    justifyContent="flex-start"
                    fontWeight="normal"
                  >
                    Report {user?.name}
                  </Button>
                  <Button
                    leftIcon={<Trash2 size={20} />}
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
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

