import { ref, set, get } from "firebase/database";
import { db } from "@/lib/firebase";

export const addUser = async (userId: string, data: any) => {
  await set(ref(db, `users/${userId}`), data);
};

export const getUser = async (userId: string) => {
  const snapshot = await get(ref(db, `users/${userId}`));
  return snapshot.exists() ? snapshot.val() : null;
};
