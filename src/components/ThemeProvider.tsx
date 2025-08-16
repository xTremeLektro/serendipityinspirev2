"use client";

import { ReactNode } from "react";

interface ClientThemeProviderProps {
  children: ReactNode;
}

const ClientThemeProvider: React.FC<ClientThemeProviderProps> = ({ children }) => children;

export default ClientThemeProvider;