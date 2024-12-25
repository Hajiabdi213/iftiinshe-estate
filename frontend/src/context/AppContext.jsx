import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
const UserContext = createContext();

// Provider Component
export const UserProvider = ({ children }) => {
  // Initialize state from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("user-store");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Save currentUser to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user-store", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user-store");
    }
  }, [currentUser]);

  // Actions
  const signInStart = () => setLoading(true);
  const signInSuccess = (user) => {
    setCurrentUser(user);
    setLoading(false);
    setError(null);
  };
  const signInFailure = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  const updateUserStart = () => setLoading(true);
  const updateUserSuccess = (updatedUser) => {
    setCurrentUser(updatedUser);
    setLoading(false);
    setError(null);
  };
  const updateUserFailure = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  const deleteUserStart = () => setLoading(true);
  const deleteUserSuccess = () => {
    setCurrentUser(null);
    setLoading(false);
    setError(null);
    localStorage.removeItem("user-store"); // Remove user from localStorage
  };
  const deleteUserFailure = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  const signOutUserStart = () => setLoading(true);
  const signOutUserSuccess = () => {
    setCurrentUser(null);
    setLoading(false);
    setError(null);
    localStorage.removeItem("user-store"); // Remove user from localStorage
  };
  const signOutUserFailure = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  // Context Value
  const value = {
    currentUser,
    error,
    loading,
    signInStart,
    signInSuccess,
    signInFailure,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutUserStart,
    signOutUserSuccess,
    signOutUserFailure,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom Hook to Use Context
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
