// src/lib/stores/user.js
import { writable } from "svelte/store";
import { browser } from "$app/environment";

function createUserStore() {
  let initialValue = null;

  if (browser) {
    try {
      const stored = localStorage.getItem("user");
      if (stored) initialValue = JSON.parse(stored);
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
      localStorage.removeItem("user");
    }
  }

  const store = writable(initialValue);

  if (browser) {
    store.subscribe((value) => {
      if (value) {
        localStorage.setItem("user", JSON.stringify(value));
      } else {
        localStorage.removeItem("user");
      }
    });
  }

  return store;
}

export const user = createUserStore();

export const login = (
  /** @type {string} */ username,
  /** @type {string} */ password
) => {
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
