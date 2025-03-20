import React, { createContext, useState, useContext } from "react";

// Create the context
const PopOverContext = createContext();

// Create a provider component
export const PopOverProvider = ({ children }) => {
  const [showPopOver, setShowPopOver] = useState(false); // Renamed

  return (
    <PopOverContext.Provider value={{ showPopOver, setShowPopOver }}>
      {children}
    </PopOverContext.Provider>
  );
};

// Create a custom hook to use the context
export const usePopOver = () => {
  const context = useContext(PopOverContext);
  if (!context) {
    throw new Error("usePopOver must be used within a PopOverProvider");
  }
  return context;
};
