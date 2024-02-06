'use client'

import { useHookstate } from '@hookstate/core'
import { redirect } from 'next/navigation'

import { useEffect } from 'react';
import { initialStore } from './store';
import MainPage from "./MainPage";

export default function Home() {
  const store = useHookstate(initialStore);
  useEffect(() => {
    if (localStorage.getItem('appData') === null) {
      localStorage.setItem(
        'appData',
        JSON.stringify({
          'jwt': null,
          'login': false,
          'password': null,
        }));
    }
    const localData = JSON.parse(localStorage.getItem('appData'));
    if (localData.jwt !== null) {
      redirect('/profile')
    }
  }, [store.jwtToken.value])
  if (store.jwtToken.value === null) {
    return (
      <MainPage />
    );
  }
}
