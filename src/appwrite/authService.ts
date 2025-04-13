import { account } from "./appwriteConfig";
import { OAuthProvider } from "appwrite";
import { ID } from "appwrite";
import { useAuthStore } from "../Store/authStore";

export const registerUser = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const user = await account.create(ID.unique(), email, password, name);
    useAuthStore.getState().setUser(user);
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const user = await account.createEmailPasswordSession(email, password);
    useAuthStore.getState().setUser(user); // Store user in Zustand
    return user;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const oauthLogin = async (provider: OAuthProvider) => {
  return account.createOAuth2Session(provider, window.location.origin + '/home');
};

// Export OAuthProvider type from appwrite
export { OAuthProvider } from "appwrite";

export const getUser = async () => {
  try {
    const user = await account.get();
    useAuthStore.getState().setUser(user); // Store user in Zustand
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const getCurrentSession = async () => {
  try {
    return await account.getSession('current');
  } catch (error) {
    console.error("Error getting current session:", error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
    useAuthStore.getState().logout(); // Clear user from Zustand
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};
