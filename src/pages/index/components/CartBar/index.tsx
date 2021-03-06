import { View, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React from 'react';
import { CardItem } from '../..';
import CartPopup, { CartPopupRefs } from './CartPopup';
import './index.scss';

export type CartBarProps = {
  cart: CardItem[];
  onAdd: (item: CardItem) => void;
  onMinus: (skuId: string) => void;
  onClear: () => void;
  onPay: () => void;
  onDetail: () => void;
};

const CartBar: React.FC<CartBarProps> = (props) => {
  const cartPopupRef = React.createRef<CartPopupRefs>();
  return (
    <View>
      <View className={['cart-bar', props.cart.length == 0 && 'cart-bar-hidden'].join(' ')}>
        <View className='left'>
          <View className='detail-action' onClick={() => cartPopupRef.current?.open()}>
            <Image src={'https://daveshop-taro.oss-cn-beijing.aliyuncs.com/images/index/icon_shopping_bag.png'} className='shopbag-btn'></Image>
            <View className='badge'>{props.cart.reduce((arr, x) => arr + x.number, 0)}</View>
          </View>
          <View className='price'>￥{props.cart.reduce((arr, x) => arr + x.skuPrice * x.number, 0).toFixed(2)}</View>
        </View>
        <Button type='primary' className='right' onClick={() => props.onPay()}>
          结算
        </Button>
      </View>
      {props.cart.length > 0 && <CartPopup ref={cartPopupRef} cart={props.cart} onAdd={(item) => props.onAdd(item)} onMinus={(skuId) => props.onMinus(skuId)} onClear={() => props.onClear()} />}
    </View>
  );
};
export default CartBar;
