import Link from "next/link";
import { useHookstate } from '@hookstate/core'

import { initialStore, useGlobalState } from "./store";
import { useState } from 'react';

export default function MainPage() {
  const globalState = useGlobalState();
  const state = useHookstate(initialStore);
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');

  async function getUserData(name, password) {
    const data = await globalState.apiAuth(name, password);
    if (data.status === 200) {
      state.jwtToken.set(data.data.access_token)
      localStorage.setItem('appData',
        JSON.stringify({
          'jwt': data.data.access_token,
          'login': true,
        }));
    }
    if (data.status === 400) {
      setError('Проверьте написание логина и пароля')
    }
  }
  function handleSubmitLogin() {

    initialStore.username.set(userName);
    initialStore.password.set(userPassword)
    getUserData(state.username.value, state.password.value)
  }

  return (
    <main>
      <section className="mb-4">
        <h1 className="page-title">Сервис сокращения ссылок</h1>
        <p>Тестовое задание для компании ООО Гексагон</p>
        <p>Чтобы воспользоваться сервисом нужно войти или зарегистрироваться</p>
      </section>
      <h2 className="page-subtitle">Форма входа</h2>
      <form className="form">
        <label className="mb-4">
          <span className="form-label">username: </span>
          <input
            className="form-input"
            type="text"
            placeholder="Введите имя пользователя"
            onChange={(event) => setUserName(event.target.value)}
            minLength={1}
            required />
        </label>
        <label className="mb-6">
          <span className="form-label">password: </span>
          <input
            className="form-input"
            type="password"
            placeholder="Введите свой пароль"
            onChange={(event) => setUserPassword(event.target.value)}
            minLength={1}
            required />
        </label>
        <p className="mb-6 text-red-600 font-bold">{error}</p>
        <div className="form-buttons">
          <button className="form-button" type="button" onClick={handleSubmitLogin}>Войти</button>
          <Link href="signup" className="form-button bg-purple-950">Зарегистрироваться</Link>
        </div>
      </form>
    </main>
  )
}