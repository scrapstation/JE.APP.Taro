import { BaseCouponResponse, CouponTypeEnumOfCoupon, StatusEnumOfCoupon } from '@/api/client';
import { View, Text } from '@tarojs/components';
import classNames from 'classnames';
import { useState } from 'react';
import { AtButton } from 'taro-ui';
import './index.scss';

type CouponItemPropsType = {
  baseCouponResponse: BaseCouponResponse;
  btnConfig?: {
    text?: string;
    onClickBtn?: (id: string) => void;
  };
  isSelectForOrder?: boolean;
  reasonConfig?: {
    isShow?: boolean;
    texts?: string[];
  };
};

const getText = (baseCouponResponse: BaseCouponResponse): { unit: string; num: number; limitText: string } => {
  let result: { unit: string; num: number; limitText: string } = {
    unit: '',
    num: 0,
    limitText: '',
  };
  switch (baseCouponResponse.type) {
    case CouponTypeEnumOfCoupon.Discount:
      result.unit = '折';
      result.num = baseCouponResponse.discountPercent % 10 === 0 ? baseCouponResponse.discountPercent / 10 : baseCouponResponse.discountPercent;
      result.limitText = `满${baseCouponResponse.discountLimitAmount}元可用`;
      break;
    case CouponTypeEnumOfCoupon.FullReduction:
      result.unit = '元';
      result.num = baseCouponResponse.fullReductionDiscountAmount;
      result.limitText = `满${baseCouponResponse.orderLimitAmount}元可用`;
      break;
    default:
      break;
  }
  return result;
};

const getIsAvailable = (isSelectForOrder: boolean, status: StatusEnumOfCoupon) => {
  if (status == StatusEnumOfCoupon.Usable) {
    return true;
  }
  if (!isSelectForOrder && status == StatusEnumOfCoupon.NotStart) {
    return true;
  }
  return false;
};
export default ((props) => {
  const { baseCouponResponse } = props;
  const { id, status, name, effectiveTimeRange } = props.baseCouponResponse;
  const { unit, num, limitText } = getText(baseCouponResponse);
  const available = getIsAvailable(props.isSelectForOrder ?? false, status);
  return (
    <View style={{ margin: '15px' }}>
      <View className={classNames('coupon-item', !available ? 'coupon-item-inactive' : '')}>
        <View className='left'>
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
          <AtButton disabled={!available} type='primary' size='small' customStyle={{ color: '#fff', borderRadius: 50, fontSize: 13, width: 64, height: 26, lineHeight: '26px' }} onClick={() => props.btnConfig?.onClickBtn?.(id)}>
            {status == StatusEnumOfCoupon.NotStart && (props.btnConfig?.text ?? '去使用')}
            {status == StatusEnumOfCoupon.Usable && (props.btnConfig?.text ?? '去使用')}
            {status == StatusEnumOfCoupon.Used && (props.btnConfig?.text ?? '已使用')}
            {status == StatusEnumOfCoupon.Expired && (props.btnConfig?.text ?? '已过期')}
          </AtButton>
        </View>
      </View>
      {props.reasonConfig?.isShow && (
        <View style={{ backgroundColor: '#CCC' }}>
          {props.reasonConfig?.texts?.map((x) => (
            <View>{x}</View>
          ))}
        </View>
      )}
    </View>
  );
}) as React.FC<CouponItemPropsType>;
