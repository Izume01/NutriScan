import { databases } from "./appwriteConfig";
import { ID } from "appwrite";
import { Query } from 'appwrite';
const DB_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = import.meta.env.VITE_COLLECTION_ID;
const LOGS_ID = import.meta.env.VITE_LOGGING_ID;

export const createUserDoc = async (userId: string, data: object) => {
  return await databases.createDocument(DB_ID, COLLECTION_ID, userId, {
    ...data,
  });
};

type EmissionData = {
  userId: string;
  type: string;
  value: number;
  unit: string;
  emission: number;
  date: string;
  description : string;
  category : string;
};

export const createEmissionLog = async (data: EmissionData) => {
  try {
    const document = await databases.createDocument(
      DB_ID,
      LOGS_ID,
      ID.unique(), 
      data

    );
    return document;
  } catch (error) {
    console.error("Error creating emission log:", error);
    throw error;
  }
};


export const getUserEmissions = async (userId: string) => {
  try {
    const result = await databases.listDocuments(DB_ID, LOGS_ID, [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
    ]);
    return result.documents;
  } catch (error) {
    console.error("Error fetching emissions:", error);
    throw error;
  }
};
