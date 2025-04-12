import {databases} from './appwriteConfig'

const DB_ID = import.meta.env.DB_ID
const COLLECTION_ID = import.meta.env.COLLECTION_ID

export const createUserDoc = async (userId: string, data: object) => {
    return await databases.createDocument(DB_ID, COLLECTION_ID, userId, {
      ...data,
    });
  };