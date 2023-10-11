import { useCallback, useEffect, useState } from "react";

// Initialize a timer variable to manage automatic logout
let logoutTimer;

export const useAuth = () => {
  // Define state variables to manage authentication
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  // Define a login function to set user authentication
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);

    // Calculate the token expiration date, or set it to one hour from now
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);

    setTokenExpirationDate(tokenExpirationDate);

    // Store user data in local storage for persistent authentication
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  // Define a logout function to clear user authentication
  const logout = useCallback(() => {
    setToken(false);
    setTokenExpirationDate(null);
    setUserId(null);

    // Remove user data from local storage
    localStorage.removeItem("userData");
  }, []);

  // Use useEffect to manage the automatic logout timer
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [logout, token, tokenExpirationDate]);

  // Use useEffect to check for and restore user authentication from local storage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  // Return the authentication state and functions
  return { token, userId, login, logout };
};
