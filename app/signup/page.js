'use client'

import { useState } from "react";
import { useGlobalState } from "@/app/store";
import { useRouter } from "next/navigation";
export default function Signup() {
  const globalState = useGlobalState();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');

  function handleSubmitRegistaration() {
    signupUser(userName, userPassword);
  }

  async function signupUser(name, password) {
    const sign = await globalState.apiSignup(name, password);
    console.log(sign);
    if (sign.status === 200) {
      globalState.apiAuth(userName, userPassword);
      router.push('/profile')
    }
  }
  return (
    <main>
      <h1 className="page-title">Давайте добавим нового пользователя</h1>
      <form className="form mt-6">
        <label className="mb-4">
          <span className="form-label">username: </span>
          <input
            className="form-input"
            type="text"
            placeholder="Введите имя пользователя"
            onChange={(event) => setUserName(event.target.value)}
            required />
        </label>
        <label className="mb-6">
          <span className="form-label">password: </span>
          <input
            className="form-input"
            type="password"
            placeholder="Введите свой пароль"
            onChange={(event) => setUserPassword(event.target.value)}
            required />
        </label>
        <div className="form-buttons">
          <button
            type="button"
            onClick={handleSubmitRegistaration}
            className="form-button bg-purple-950">
            Зарегистрироваться</button>
        </div>
      </form>
    </main>
  )
}