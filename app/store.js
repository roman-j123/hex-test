'use client'
import { hookstate, useHookstate } from '@hookstate/core';
import axios from 'axios';

export const initialStore = hookstate({
  jwtToken: null,
  username: '',
  password: '',
  loginState: false,
  linksArray: [],
  totalCount: 0,
})

export const useGlobalState = () => {
  const state = useHookstate(initialStore);

  return {
    getJwtToken: (data) => {
      state.jwtToken.set(data);
    },
    setUserName: (name) => {
      state.username.set(name);
    },
    changeLoginState: () => {
      state.loginState.set(true);
    },
    apiSignup: async (name, password) => {
      return axios.post(`https://front-test.hex.team/api/register?username=${name}&password=${password}`, {
        username: name,
        password: password
      }, {
        headers: {
          'accept': 'application/json',
          "Referrer-Policy": "strict-origin-when-cross-origin"
        }
      })
    },
    apiAuth: async (name, password) => {
      return await axios.post('https://front-test.hex.team/api/login', {
        username: name,
        password: password
      }, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          state.jwtToken.set(response.data.access_token);
          state.loginState.set(true);
          return response
        })
        .catch((error) => {
          console.log(error.response)
          return error.response
        })
    },
    apiGetData: async (jwt, order, offset) => {
      return await axios.get(`https://front-test.hex.team/api/statistics?${order !== '' ? 'order=' + order : ''}&offset=${offset}&limit=10`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${jwt}`
        }
      })
        .then((response) => {
          state.linksArray.set(response.data);
          state.totalCount.set(response.headers['x-total-count']);
          return response.data
        })
    },
    apiSquezze: async (link) => {
      const encodeLink = encodeURIComponent(link)
      return await axios.post(`https://front-test.hex.team/api/squeeze?link=${encodeLink}`, {}, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${state.jwtToken.value}`
        }
      }).catch((error) => {
        return error.response
      })
    },
  }
}