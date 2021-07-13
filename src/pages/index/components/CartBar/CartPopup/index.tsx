import { View, Image, ScrollView } from "@tarojs/components";
import React, { PropsWithoutRef, RefAttributes } from "react";
import { useImperativeHandle, useRef, forwardRef, useState } from "react";
import { CardItem } from "src/pages/index";
import { AtFloatLayout } from "taro-ui";
import Action from "../../Action";
import './index.scss'

export type CartPopupProps = {
    cart: CardItem[];
    onAdd: (item: CardItem) => void;
    onMinus: (skuId: string) => void;
    onClear: () => void;
};

export type CartPopupRefs = {
    open: () => void;
};

const CartPopup: React.ForwardRefExoticComponent<PropsWithoutRef<CartPopupProps> & RefAttributes<CartPopupRefs>> = React.forwardRef((props, parentRef) => {
    const [showPopup, setShowPopup] = useState<boolean>(false)
    useImperativeHandle(parentRef, () => {
        // return返回的值就可以被父组件获取到
        return {
            open() {
                setShowPopup(true)
            }
        }
    })

    return (
        <View>
            <AtFloatLayout isOpened={showPopup} onClose={() => setShowPopup(false)} className="popup">
                <View className="cart">
                    <ScrollView scroll-y className="content">
                        <View className="wrapper">
                            <View className="list">
                                {
                                    props.cart.map(item => {
                                        return (
                                            <View className="item">
                                                <View className="left">
                                                    <Image src={item.image} mode='aspectFill' className="image"></Image>
                                                </View>
                                                <View className="right">
                                                    <View className="name-and-materials">
                                                        <View className="name">{item.productName}</View>
                                                        <View className="materials" v-if="item.materials_text">{item.productName}</View>
                                                    </View>
                                                    <View className="price-and-actions">
                                                        <View className="price">￥{item.skuPrice}</View>
                                                        <Action number={item.number} onAdd={() => props.onAdd(item)} onMinus={() => props.onMinus(item.skuId)} isMultiSku={false} onSelectMaterails={() => { }}></Action>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </AtFloatLayout>
        </View>
    )
})
export default CartPopup