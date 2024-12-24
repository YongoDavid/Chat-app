import { Box, Container, Flex, useColorModeValue, useBreakpointValue } from "@chakra-ui/react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const showFullLayout = useBreakpointValue({ base: false, md: true });
  const bgColor = useColorModeValue("blue.500", "blue.600");
  const contentBgColor = useColorModeValue("white", "gray.800");

  if (!showFullLayout) {
    // On mobile, we'll just render the children without the layout
    return <Box p={4}>{children}</Box>;
  }

  return (
    <Container maxW="7xl" p={{ base: 4, md: 8 }}>
      <Flex minH="100vh" align="center" justify="center">
        <Flex
          direction={{ base: "column", md: "row" }}
          w="full"
          maxW="1200px"
          mx="auto"
          boxShadow="xl"
          rounded="2xl"
          overflow="hidden"
        >
          {/* Brand Section */}
          <Box
            w={{ base: "full", md: "40%" }}
            bg={bgColor}
            color="white"
            p={8}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
          >
            <Box
              fontSize="6xl"
              fontWeight="bold"
              mb={6}
              transform="translateY(-8px)"
            >
              CA
            </Box>
            <Box fontSize="3xl" fontWeight="medium" mb={4}>
              Welcome to Chatty App
            </Box>
            <Box opacity={0.8}>
              Connect with friends and family instantly!
            </Box>
          </Box>

          {/* Auth Content */}
          <Box
            w={{ base: "full", md: "60%" }}
            bg={contentBgColor}
            p={{ base: 8, md: 12 }}
          >
            {children}
          </Box>
        </Flex>
      </Flex>
    </Container>
  );
};

