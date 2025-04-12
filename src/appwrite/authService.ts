import {account} from './appwriteConfig'
import { OAuthProvider } from 'appwrite';

export const registerUser  = async (email : string , password : string , name : string) => {
    try {
        return await account.create('unique()' , email, password, name); 
    }

    catch (error) {
        console.error('Error registering user:', error);
        throw error; 
    }
}

export const loginUser = async (email : string , password : string) => {
    return await account.createEmailPasswordSession(email, password)
}


export const oauthLogin  = async (provider : OAuthProvider) => {
    return account.createOAuth2Session(provider);
}

export const getUser = async () => {
    try {
        return await account.get();
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error; 
    }
}

export const logoutUser = async () => {
    try {
        return await account.deleteSession('current');
    } catch (error) {
        console.error('Error logging out user:', error);
        throw error; 
    }
}