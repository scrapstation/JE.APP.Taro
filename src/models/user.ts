import type { Effect } from 'dva-core';
import Taro from '@tarojs/taro';
import { Reducer } from 'react';
import { AccountInfoResponse } from '../api/client';
import { API } from '../api';
import { useDispatch } from 'react-redux';

export type UserModelState = {
  isLogin: boolean;
  currentUser: AccountInfoResponse | undefined;
};

export type UserModelType = {
  namespace: 'user';
  state: UserModelState;
  effects: {
    login: Effect;
    getCurrentUserInfo: Effect;
  };
  reducers: {
    saveLogin: Reducer<UserModelState, any>;
    saveCurrentUser: Reducer<UserModelState, any>;
  };
};

const user: UserModelType = {
  namespace: 'user',

  state: {
    isLogin: false,
    currentUser: undefined,
  },
  effects: {
    *login({ payload }: { payload: { phoneCode: string | null } | undefined }, { call, put }) {
      try {
        const getLoginInfo = async () => {
          const wechatLoginResult = await Taro.login({})
          const apiLoginResult = await API.authClient.auth(wechatLoginResult.code, payload?.phoneCode ?? null);
          return apiLoginResult.token;
        };
        const token = yield call(getLoginInfo);
        Taro.setStorageSync('token', token);
        yield put({ type: 'saveLogin' });
        return Promise.resolve();
      } catch (error) {
        return Promise.reject();
      }
    },
    *getCurrentUserInfo(_, { call, put }) {
      const getUserInfo = async () => await API.accountClient.getAccountInfo();
      const userInfo = yield call(getUserInfo);
      yield put({ type: 'saveCurrentUser', payload: userInfo });
    },
  },
  reducers: {
    saveLogin(state) {
      return {
        ...state,
        isLogin: true,
      };
    },
    saveCurrentUser(state, { payload }) {
      return {
        ...state,
        isLogin: true,
        currentUser: payload,
      };
    },
  },
};

export default user;
