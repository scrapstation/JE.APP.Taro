import { API } from '@/api';
import { OrderCouponItemRepsonse } from '@/api/client';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useReady, useRouter } from '@tarojs/taro';
import React, { useEffect, useState } from 'react';

// type SelectCouponPropType = {
//   selected: string[];
// };
export default (() => {
  const router = useRouter();
  const [coupons, setCoupons] = useState<OrderCouponItemRepsonse[]>([]);
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
    <View>
      {coupons.map((x) => (
        <View onClick={() => handleClick(x.id)}>{JSON.stringify(x)}</View>
      ))}
    </View>
  );
}) as React.FC;
