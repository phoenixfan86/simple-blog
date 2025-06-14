"use client"

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "@/lib/redux/userSlice";
import { RootState } from "@/lib/redux/store";
import { z } from "zod";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "@/lib/firestore";

const registrationSchema = z.object({
  username: z.string().min(3, "Мінімум 3 символи"),
  email: z.string().email(),
});

const loginSchema = z.object({
  username: z.string().min(3),
});

const UserAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const db = getFirestore(app);

  const handleRegister = async () => {
    try {
      registrationSchema.parse({ username, email });
      const userRef = doc(db, "users", username);
      await setDoc(userRef, { username, email });

      dispatch(login({ username, email }));
      setError("");
      setShowForm(false);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
      } else {
        setError("Помилка реєстрації");
      }
    }
  };

  const handleLogin = async () => {
    try {
      loginSchema.parse({ username });

      const userRef = doc(db, "users", username);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as { username: string; email: string };
        dispatch(login({ username: data.username, email: data.email }));
        setError("");
        setShowForm(false);
      } else {
        setError("Користувача не знайдено");
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
      } else {
        setError("Помилка входу");
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };
  const handleCancel = () => {
    setShowForm(false)
  };

  if (user.username) {
    return (
      <div className="flex gap-2 flex-col sm:flex-row items-center text-xs">
        <div className="flex gap-2">
          <span>Привіт,</span>
          <span className="mr-1 sm:mr-3 md:mr-5 font-semibold">{user.username}</span>
        </div>
        <button onClick={handleLogout} className="btn !text-white bg-gray-500 hover:bg-gray-400">Вийти</button>
      </div>
    );
  }

  return (
    <div className="">
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="btn">Увійти</button>
      )}

      {showForm && (
        <div className="absolute top-full right-1 ring-zinc-300 w-full md:w-auto flex flex-col gap-5 items-center px-5 py-4 bg shadow-xl">
          <div className="flex items-center gap-1 md:gap-2">
            <button onClick={() => setIsRegister(false)} className="btn">Вхід</button>
            <span>або</span>
            <button onClick={() => setIsRegister(true)} className="btn">Реєстрація</button>
          </div>
          <span className="text-zinc-500">Введіть данні користувача</span>


          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="userInput my-3"
          />

          {isRegister && (
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="userInput"
            />
          )}

          <div className="flex gap-3 mt-6">
            <button onClick={handleCancel} className="delBtn ">
              Скасувати
            </button>
            <button onClick={isRegister ? handleRegister : handleLogin} className="btn border-1  hover:border-cyan-700">
              {isRegister ? "Зареєструватись" : "Увійти"}
            </button>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default UserAuth;
