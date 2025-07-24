import { toast } from "react-hot-toast";

/**
 * A wrapper around the native fetch API that centralizes request logic,
 * error handling, and automatic redirection on authentication failure.
 * @param {string} url The URL to fetch.
 * @param {object} options The options for the fetch request.
 * @returns {Promise<any>} The JSON response from the server.
 */
export const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    // If the token is invalid or expired, the server returns 401
    if (response.status === 401) {
      toast.error("Session expired. Please log in again.");
      // Redirect to the login page. This forces a full page reload,
      // clearing any client-side state.
      window.location.href = "/login";
      // Throw an error to stop the promise chain
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      let errorMessage;
      try {
        // Attempt to parse the error response as JSON
        const errorData = await response.json();
        errorMessage = errorData.message || "An unknown server error occurred.";
      } catch (e) {
        // If the response body is not JSON, use the status text as a fallback
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // If the response has no content (like a 204)
    if (response.status === 204) {
        return null;
    }

    return await response.json();
  } catch (error) {
    // Re-throw the error to be caught by the component's catch block
    // This allows for component-specific error handling if needed.
    throw error;
  }
};