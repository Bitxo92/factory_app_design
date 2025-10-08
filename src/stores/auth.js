import { writable } from "svelte/store";
import { browser } from "$app/environment";

// Initialize store with value from localStorage if available
const storedUser = browser ? localStorage.getItem("user") : null;
export const user = writable(storedUser ? JSON.parse(storedUser) : null);

// Subscribe to user changes and update localStorage
if (browser) {
  user.subscribe((value) => {
    if (value) {
      localStorage.setItem("user", JSON.stringify(value));
    } else {
      localStorage.removeItem("user");
    }
  });
}

export const login = (
  /** @type {string} */ username,
  /** @type {string} */ password
) => {
  // Hardcoded credentials
  if (username === "Carlos" && password === "abc123.") {
    const userData = { username: "Carlos", name: "Carlos" };
    user.set(userData);
    return true;
  }
  return false;
};

export const logout = () => {
  user.set(null);
};
