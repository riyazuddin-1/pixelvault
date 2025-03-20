import { createContext, useState, useContext } from "react";

// Create the context
const SearchContext = createContext();

// Custom hook to use the SearchContext
export const useSearch = () => useContext(SearchContext);

// Context Provider Component
export const SearchProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState({});

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm, searchQuery, setSearchQuery }}>
            {children}
        </SearchContext.Provider>
    );
};
