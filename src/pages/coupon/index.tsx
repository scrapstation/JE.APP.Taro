import { API } from '@/api';
import { CouponTypeEnumOfCoupon, LoadCouponRequest, LoadCouponResponse } from '@/api/client';
import { Text, View } from '@tarojs/components';
import { useReady } from '@tarojs/taro';
import { useState } from 'react';
import { AtButton } from 'taro-ui';
import './index.scss';

const renderCouponItem = (name: string, num: number, unit: string, limitText: string, effectiveTimeRange: string) => {
  return (
    <View className='left' style={{ backgroundColor: '#FFF', display: 'flex', margin: 15, padding: '12px 10px', borderRadius: 8, alignItems: 'center' }}>
      <View style={{ width: 75, marginRight: 0, color: '#daa871', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <View>
          <Text className='neutra-font' style={{ fontSize: num < 100 ? 32 : 28 }}>
            {num}
          </Text>
          <Text style={{ fontSize: 13, fontWeight: 500 }}>{unit}</Text>
        </View>
        <View className='limit-text' style={{ fontSize: limitText.length < 10 ? 11 : 10, color: '#dda25e' }}>
          {limitText}
        </View>
      </View>
      <View style={{ flex: 1, margin: '0 10px' }}>
        <View className='info-name'>{name}</View>
        <View className='info-expire'>{effectiveTimeRange}</View>
      </View>
      <View style={{ margin: '0' }}>
        <AtButton type='primary' size='small' customStyle={{ color: '#fff', borderRadius: 50, fontSize: 13, width: 64, height: 26, lineHeight: '26px' }} onClick={() => {}}>
          去使用
        </AtButton>
      </View>
    </View>
  );
};
export default () => {
  const [coupons, setCoupons] = useState<LoadCouponResponse[]>([]);
  const [loadStatus, setLoadStatus] = useState<'more' | 'loading' | 'noMore'>('more');
  useReady(() => {
    init();
  });
  const init = async () => {
    try {
      setLoadStatus('loading');
      const queriedCoupons = await API.couponClient.loadOrder(new LoadCouponRequest());
      setLoadStatus(queriedCoupons.length < 10 ? 'noMore' : 'more');
      setCoupons(queriedCoupons);
    } catch (error) {
      setLoadStatus('more');
    }
  };
  return coupons.map((x) => {
    switch (x.type) {
      case CouponTypeEnumOfCoupon.Discount:
        const discountPercentText = x.discountPercent % 10 === 0 ? x.discountPercent / 10 : x.discountPercent;
        return renderCouponItem(x.name!, discountPercentText, '折', `满${x.discountLimitAmount}元可用`, x.effectiveTimeRange!);
      case CouponTypeEnumOfCoupon.FullReduction:
        return renderCouponItem(x.name!, x.fullReductionDiscountAmount, '元', `满${x.fullReductionLimitAmount}元可用`, x.effectiveTimeRange!);
      default:
        break;
    }
  });
};
