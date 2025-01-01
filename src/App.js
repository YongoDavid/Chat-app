import React from 'react';
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { AppRoutes } from "./Routes/appRoutes";
import './App.css';

// Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ 
  config,
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.800" : "white",
        color: props.colorMode === "dark" ? "white" : "gray.800",
      },
    }),
  },
  colors
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <div className="App">
        <AppRoutes />
      </div>
    </ChakraProvider>
  );
}

export default App;
