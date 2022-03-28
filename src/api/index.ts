import axios from 'axios';
import mpAdapter from 'axios-miniprogram-adapter';
import Taro from '@tarojs/taro';
import { AuthClient, ConsigneeClient, AccountClient, OrderClient, RiderClient, StoreClient, CouponClient, RefundClient } from './client';

// @ts-ignore
axios.defaults.adapter = mpAdapter;
axios.interceptors.request.use(
  (config) => {
    config.withCredentials = true; // 允许携带token ,这个是解决跨域产生的相关问题
    config.timeout = 6000;
    config.headers = {
      Authorization: 'Bearer ' + Taro.getStorageSync('token'),
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const apiurl1 = 'https://api-dev-daveshop-wechat.chinacloudsites.cn';
const apiurl = 'http://localhost:4888';
export const API = {
  authClient: new AuthClient(apiurl, axios),
  consigneeClient: new ConsigneeClient(apiurl, axios),
  accountClient: new AccountClient(apiurl, axios),
  orderClient: new OrderClient(apiurl, axios),
  riderClient: new RiderClient(apiurl, axios),
  storeClient: new StoreClient(apiurl, axios),
  couponClient: new CouponClient(apiurl, axios),
  refundClient: new RefundClient(apiurl, axios),
};
