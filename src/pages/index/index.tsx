import { View, Image, Swiper, SwiperItem, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { API } from '../../../src/api';
import { BaseInfoVoOfStoreInfoResponse, CategoryInfoVoOfStoreInfoResponse } from '../../../src/api/client';
import './index.scss';
import { useDispatch, useSelector } from 'react-redux';
import { ConnectState } from '@/models/connect';
import { UserModelState } from '@/models/user';
import haversine from 'haversine-distance';
import ProductList from './components/ProductList';
import PageLoading from '@/components/PageLoading';

export type CardItem = {
  productId: string;
  skuId: string;
  productName: string;
  skuPrice: number;
  number: number;
  image: string;
  mark?: string;
};
const Index: React.FC = () => {
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<Taro.getLocation.SuccessCallbackResult | undefined>();
  const [store, setStore] = useState<BaseInfoVoOfStoreInfoResponse>(new BaseInfoVoOfStoreInfoResponse());
  const [categories, setCategories] = useState<Array<CategoryInfoVoOfStoreInfoResponse>>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const locationResult = await Taro.getLocation({ type: 'wgs84' });
      setLocation(locationResult);
      const data = await API.storeClient.getStoreById('B1FD5A56-93A4-59A4-33E0-3A01161DD34D');
      setCategories(data.categoryInfo!);
      setStore(data.baseInfo!);
      setTimeout(() => {
        setIsPageLoading(false);
      }, 1000);
    };
    fetchCategories();
  }, []);
  return (
    <View className='container'>
      {isPageLoading && <PageLoading />}
      <View style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,.06)', zIndex: 1 }}>
        <View className='store'>
          <View className='title'>
            <View style={{ fontSize: 17 }}>{store.name}</View>
            <View style={{ marginTop: 5, fontSize: 13, color: '#999' }}> 距离您{location && haversine([location.latitude, location.longitude], [store.latitude, store.longitude]).toFixed(0)}m</View>
          </View>
        </View>
        <Swiper autoplay vertical circular style={{ height: 20, paddingLeft: 15 }}>
          <SwiperItem className='test'>
            <Image style={{ borderRadius: 2, height: 14, marginRight: 5, width: 13 }} src='https://go.cdn.heytea.com/2021/07/21/tmp/3b9b01a954824daca50323fba4881563.jpg' />
            <Text className='test1'>糯糯入茶，清新不腻。用经典定制茶底中和软萌米糯糯的饱满口感，碰撞出清新不腻的糯糯茶。</Text>
          </SwiperItem>
          <SwiperItem className='test'>
            <Image style={{ borderRadius: 2, height: 14, marginRight: 5, width: 13 }} src='https://go.cdn.heytea.com/2021/07/21/tmp/3b9b01a954824daca50323fba4881563.jpg' />
            <Text className='test1'>糯糯入茶，清新不腻。用经典定制茶底中和软萌米糯糯的饱满口感，碰撞出清新不腻的糯糯茶。</Text>
          </SwiperItem>
          <SwiperItem className='test'>
            <Image style={{ borderRadius: 2, height: 14, marginRight: 5, width: 13 }} src='https://go.cdn.heytea.com/2021/07/21/tmp/3b9b01a954824daca50323fba4881563.jpg' />
            <Text className='test1'>糯糯入茶，清新不腻。用经典定制茶底中和软萌米糯糯的饱满口感，碰撞出清新不腻的糯糯茶。</Text>
          </SwiperItem>
        </Swiper>
      </View>
      <ProductList categories={categories} />
    </View>
  );
};

export default Index;
