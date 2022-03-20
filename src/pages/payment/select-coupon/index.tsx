import { API } from '@/api';
import { OrderCouponItemRepsonse } from '@/api/client';
import CouponItem from '@/components/CouponItem';
import TabPane from '@/components/Tab/TabPane';
import Tabs from '@/components/Tab/Tabs';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useReady, useRouter } from '@tarojs/taro';
import React, { useEffect, useState } from 'react';
import './index.scss';

export default (() => {
  const router = useRouter();
  const [coupons, setCoupons] = useState<OrderCouponItemRepsonse[]>([]);
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  useReady(async () => {
    const queriedCoupons = await API.orderClient.getCouponsByOrder(router.params.wareFee! as unknown as number);
    setCoupons(queriedCoupons);
  });
  useEffect(() => {}, []);
  const handleClick = (couponId: string) => {
    Taro.eventCenter.trigger('selectCoupon', [couponId]);
    Taro.navigateBack();
  };
  return (
    <Tabs tabList={['可使用', '不可使用']} currentIndex={currentTabIndex} onTabChange={(index) => setCurrentTabIndex(index)}>
      <TabPane index={0} currentIndex={currentTabIndex}>
        {coupons
          .filter((x) => x.available)
          .map((x) => (
            <CouponItem isSelectForOrder baseCouponResponse={x} btnConfig={{ text: '选择', onClickBtn: (couponId) => handleClick(couponId) }}></CouponItem>
          ))}
      </TabPane>
      <TabPane index={1} currentIndex={currentTabIndex}>
        {coupons
          .filter((x) => !x.available)
          .map((x) => (
            <CouponItem reasonConfig={{ isShow: true, texts: x.unavailableReasons! }} isSelectForOrder baseCouponResponse={x} btnConfig={{ text: '选择', onClickBtn: (couponId) => handleClick(couponId) }}></CouponItem>
          ))}
      </TabPane>
    </Tabs>
  );
}) as React.FC;
