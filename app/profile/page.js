'use client'
import { useHookstate } from '@hookstate/core'
import { initialStore, useGlobalState } from '@/app/store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ErrorLogin from './ErrorLogin';

export default function Profile() {
  const router = useRouter();
  const globalState = useGlobalState();
  const state = useHookstate(initialStore);
  const [links, setLinks] = useState([]);
  const [order, setOrder] = useState('');
  const [offset, setOffset] = useState(0);
  const [urlValue, setUrlValue] = useState('');
  const [orderState, setOrderState] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem('appData'));
    console.log(localData)
    state.jwtToken.set(localData.jwt);
    state.loginState.set(localData.login)
    getTableData(state.jwtToken.value, order, offset)
    if (localData.jwt === null) {
      localStorage.setItem('appData',
        JSON.stringify({
          'jwt': state.jwtToken.value,
          'login': true,
        }));
    }
  }, [offset, order])


  async function getTableData(jwt, order, offset) {
    const tableData = await globalState.apiGetData(jwt, order, offset);
    if (order === '') {
      setLinks(tableData.sort((a, b) => parseFloat(b.id) - parseFloat(a.id)));
    }
    setLinks(tableData);
  }

  async function squeezeLink() {
    const squeeze = await globalState.apiSquezze(urlValue);
    if (squeeze.status === 200) {
      getTableData(state.jwtToken.value, '', offset);
      setError('');
    }
    if (squeeze.status === 422) {
      setError('Ошибка, неверный формат ссылки')
    }
    setUrlValue('');
  }
  function redirectHandle() {
    getTableData(state.jwtToken.value, '', offset);
  }

  function handlePrevClick() {
    if (offset >= 10) {
      setOffset(offset - 10)
    }
  }
  function handleNextClick() {
    if (offset < state.totalCount.value) {
      setOffset(offset + 10)
    }
  }
  function handleSortSet(event) {
    setOrderState(!orderState)
    if (event.target.id === 'short') {
      if (orderState) return setOrder('asc_short')
      else return setOrder('desc_short')
    }
    if (event.target.id === 'counter') {
      if (orderState) return setOrder('asc_counter')
      else return setOrder('desc_counter')
    }
    if (event.target.id === 'target') {
      if (orderState) return setOrder('asc_target')
      else return setOrder('desc_target')
    }
    console.log(order);
  }

  function handleLogout() {
    router.push('/')
    state.loginState.set(false);
    state.jwtToken.set(null);
    localStorage.setItem('appData',
      JSON.stringify({
        'jwt': null,
        'login': false,
      }));
  }

  const listLinks = links.map(link =>
    <tr
      key={link.id}
      className="hover:bg-slate-400/20"
    >
      <td className="table-td text-center">{link.id}</td>
      <td className="table-td text-center">{link.short}</td>
      <td className="table-td">
        <a
          href={`https://front-test.hex.team/s/${link.short}`}
          onClick={redirectHandle}
          target="_blank"
          id={link.short}>{link.target}</a>
      </td>
      <td className="table-td text-center">{link.counter}</td>
    </tr>
  )

  if (state.loginState.value === true) {
    return (
      <main>
        <div className="profile-header flex justify-between items-center">
          <h1 className="page-title">Список сокращенных сылок</h1>
          <button
            type="button"
            className="form-button bg-red-950"
            onClick={handleLogout}>Выйти</button>
        </div>
        <form className="form mb-6 flex-row">
          <input
            type="text"
            className='form-input mr-6'
            value={urlValue}
            onChange={(event) => setUrlValue(event.target.value)}
            minLength={4}
            placeholder="Введите URL"
            required
          />
          <button
            className="form-button"
            type="button"
            onClick={squeezeLink}
            disabled={urlValue.length < 4}>Сократить</button>
        </form>
        <p className="mb-6 text-red-600 font-bold">{error}</p>
        <table className='table'>
          <thead>
            <tr>
              <th className='table-td'>ID</th>
              <th className='table-td cursor-pointer' id="short" onClick={handleSortSet}>SHORT</th>
              <th className='table-td cursor-pointer' id="target" onClick={handleSortSet}>TARGET</th>
              <th className='table-td cursor-pointer' id="counter" onClick={handleSortSet}>COUNTER</th>
            </tr>
          </thead>
          <tbody>
            {listLinks}
          </tbody>
        </table>
        <ul className="pagination">
          <button
            type="button"
            className="pagination-button"
            onClick={handlePrevClick}
            disabled={offset < 10}
          >Назад</button>
          <button
            type='button'
            className='pagination-button'
            onClick={handleNextClick}
            disabled={state.totalCount.value <= 10 || (offset + 10) > state.totalCount.value}>Вперед</button>
        </ul>
      </main>
    )
  }
  else {
    return (
      <ErrorLogin />
    )
  }
}