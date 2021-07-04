import { View, Image, Button } from "@tarojs/components"
import React, { useEffect } from "react";
import { CardItem } from "../..";
import CartPopup, { CartPopupRefs } from "./CartPopup";
import "./index.scss"

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
            <View className="cart-bar">
                {/* <uni-transition :mode-class="['slide-bottom']" :show="!!cartNum" :styles="cartBarStyles"> */}
                <View className="left">
                    <View className="detail-action" onClick={() => cartPopupRef.current?.open()}>
                        <Image src={require('../../../../static/images/index/icon_shopping_bag.png')} className="shopbag-btn"></Image>
                        <View className="badge">{props.cart.reduce((arr, x) => arr + x.number, 0)}</View>
                    </View>
                    <View className="price">￥{props.cart.reduce((arr, x) => arr + (x.skuPrice * x.number), 0)}</View>
                </View>
                <Button type="primary" className="right" onClick={() => props.onPay()}>结算</Button>
                {/* </uni-transtion> */}
            </View>
            <CartPopup ref={cartPopupRef} cart={props.cart} onAdd={(item) => props.onAdd(item)} onMinus={(skuId) => props.onMinus(skuId)} onClear={() => props.onClear()} />
        </View>
    )
}
export default CartBar
