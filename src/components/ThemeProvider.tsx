"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import { ReactNode } from "react";

interface ClientThemeProviderProps {
  children: ReactNode;
}

const ClientThemeProvider: React.FC<ClientThemeProviderProps> = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

export default ClientThemeProvider;