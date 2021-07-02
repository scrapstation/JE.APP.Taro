import type { Effect } from 'dva-core';
import Taro from '@tarojs/taro';
import { Reducer } from 'react';
import { AccountInfoResponse, GetWechatUserInfo } from '../api/client';
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
    *login(_, { call, put }) {
      const getLoginInfo = async () => {
        const [wechatLoginResult, userProfile] = await Promise.all([Taro.login({}), Taro.getUserProfile({ desc: '用于完善会员资料' })]);
        const apiLoginResult = await API.authClient.auth(new GetWechatUserInfo({ code: wechatLoginResult.code, rawData: userProfile.rawData, signature: userProfile.signature }));
        return apiLoginResult.token;
      };
      const token = yield call(getLoginInfo);
      Taro.setStorageSync('token', token);
      yield put({ type: 'saveLogin' });
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
