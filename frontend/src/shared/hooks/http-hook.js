import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  // State to manage loading
  const [isLoading, setIsLoading] = useState(false);

  // State to manage errors
  const [error, setError] = useState();

  // Ref to store and manage active HTTP requests
  const activeHttpRequest = useRef([]);

  // Function to send an HTTP request
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      // Create an AbortController to potentially cancel this request
      const httpAbortCtrl = new AbortController();
      activeHttpRequest.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal, // Associates the request with the controller
        });

        const responseData = await response.json();

        // Remove the abort controller from the active list
        activeHttpRequest.current = activeHttpRequest.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        // If the response is not okay (e.g., status code 4xx or 5xx), throw an error
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);

        // Return the response data
        return responseData;
      } catch (err) {
        // If the error is not an "AbortError," set the error state
        if (err.name !== "AbortError") {
          setIsLoading(false);
          setError(err.message);
          throw err;
        }
      }
    },
    []
  );

  // Function to clear the error state
  const clearError = () => {
    setError(null);
  };

  // Effect to clean up and abort any active requests when the component unmounts
  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  // Return the loading state, error state, sendRequest function, and clearError function
  return { isLoading, error, sendRequest, clearError };
};
