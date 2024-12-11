import { useEffect } from "react";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { Login } from "../components/Authentication/Login";
import { Signup } from "../components/Authentication/Signup";
import { AuthLayout } from "../components/Authentication/AuthLayout";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <AuthLayout>
      <Tabs isFitted variant="unstyled">
        <TabList mb={8}>
          <Tab
            _selected={{
              color: "blue.500",
              borderBottom: "2px solid",
              fontWeight: "semibold",
            }}
          >
            Login
          </Tab>
          <Tab
            _selected={{
              color: "blue.500",
              borderBottom: "2px solid",
              fontWeight: "semibold",
            }}
          >
            Sign Up
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <Login />
          </TabPanel>
          <TabPanel px={0}>
            <Signup />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </AuthLayout>
  );
};

