import { Button, Image, Text, View } from "@tarojs/components";
import { useState } from "react";
import { API } from '../../api/index';
import { ConsigneeItemResponse, CreateOrderRequest, ItemOfCreateOrderRequest } from "../../../src/api/client";
import { AtIcon } from "taro-ui";
import Taro, { navigateBack, navigateTo, switchTab, useDidShow, useReady } from '@tarojs/taro';
import styles from './index.module.scss'
import classNames from "classnames";
import { CardItem } from "../index";
import tryFetch from "../../../src/utils/tryfetch";

const Payment: React.FC = () => {
    const [consigneeLoading, setConsigneeLoading] = useState<boolean>(true)
    const [consignee, setConsignee] = useState<ConsigneeItemResponse>(new ConsigneeItemResponse());
    const [bottomUnsafeHeight, setBottomUnsafeHeight] = useState<number>(0);
    const [cart, setCart] = useState<CardItem[]>([]);
    const [remark, setRemark] = useState<string>('')

    useDidShow(() => {
        const storedCart: CardItem[] = Taro.getStorageSync('cart') || []
        if (storedCart.length === 0) {
            navigateBack()
            return;
        }
        setCart(storedCart)
    })
    useReady(() => {
        Taro.eventCenter.on("selectConsignee", handleConsigneeChange)
        Taro.eventCenter.on("submitRemark", handleSubmitRemark)
        const getRecommendedConsignee = async () => {
            const systemInfo = (await Taro.getSystemInfo())
            console.log(systemInfo.screenHeight - systemInfo.safeArea.bottom)
            setBottomUnsafeHeight(systemInfo.screenHeight - systemInfo.safeArea.bottom)
            const recommendedConsignee = await API.consigneeClient.getRecommended()
            setConsignee(recommendedConsignee)
            setConsigneeLoading(false)
        }
        setTimeout(() => {
            getRecommendedConsignee()
        }, 500)
        console.log('useReady')
    })

    const handleConsigneeChange = async (consigneeId: string) => {
        setConsigneeLoading(true)
        const consigneeInfo = await API.consigneeClient.getById(consigneeId)
        setTimeout(() => {
            setConsignee(consigneeInfo)
            setConsigneeLoading(false)
        }, 300)
    }

    const toSelectConsigneePage = () => {
        navigateTo({
            url: '/pages/consignee/index'
        })
    }

    const toRemarkPage = () => {
        navigateTo({
            url: `/pages/payment/remark/index?remark=${remark}`
        })
    }

    const handleSubmitRemark = (remark: string) => {
        setRemark(remark)
    }

    const pay = async () => {
        const orderId = await tryFetch(API.orderClient.create(new CreateOrderRequest({
            consigneeId: consignee.id,
            createOrderItems: cart.map((x) => new ItemOfCreateOrderRequest({ skuId: x.skuId, quantity: x.number })),
            remark: remark
        })), true)
        const payinfo = await tryFetch(API.orderClient.pay(orderId), true)
        try {
            await Taro.requestPayment({
                timeStamp: payinfo.timeStamp!,
                nonceStr: payinfo.nonceStr!,
                package: payinfo.package!,
                // @ts-ignore
                signType: payinfo.signType!,
                paySign: payinfo.paySign!,
            })
        } finally {
            await switchTab({
                url: `/pages/order/index`
            })
        }
    }

    const getRemark = () => {
        if (remark) {
            if (remark.length > 10) {
                return remark.substring(0, 10) + "..."
            }
            return remark
        } else {
            return '包装 配送 口味要求'
        }
    }

    return (
        <>
            <View style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <View style={{ flex: 1, overflow: "auto" }}>
                    <View onClick={() => toSelectConsigneePage()} className={classNames(styles.card, styles.consignee)} >
                        {consigneeLoading &&
                            <View style={{ width: '100%', textAlign: 'center', height: 40 }}>
                                <AtIcon className={styles.loading} customStyle={{ lineHeight: '40px' }} value='loading' size='30' color='#999'></AtIcon>
                            </View>
                        }
                        {!consigneeLoading &&
                            <>
                                <View style={{ flex: 1 }}>
                                    <View className={styles.address}>{`${consignee.simpleAddress} ${consignee.houseNumber}`}</View>
                                    <View className={styles.contact}>{`${consignee.name} ${consignee.mobile}`}</View>
                                </View>
                                <View>
                                    <AtIcon value='chevron-right' size='24' color="#C8C8C8" onClick={() => { }}></AtIcon>
                                </View>
                            </>
                        }
                    </View>
                    <View className={classNames(styles.card, styles.order)}>
                        <View className={styles.title} >商品详情</View>
                        <View style={{ fontSize: 12, color: '#999' }} >请注意商品数量</View>
                        <View style={{ marginTop: 20 }}>
                            {
                                cart.map(cartItem => {
                                    return (
                                        <View style={{ display: 'flex', flexWrap: 'wrap', marginTop: 10 }}>
                                            <View style={{ display: 'flex', alignItems: 'center' }}>
                                                <Image lazyLoad mode='aspectFill' src={cartItem.image} style={{ width: 64, height: 64 }}></Image>
                                            </View>
                                            <View style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', overflow: 'auto', wordWrap: 'break-word', marginLeft: 10 }}>
                                                <View style={{ fontSize: 16 }}>{cartItem.productName}</View>
                                                <View style={{ fontSize: 14, color: '#999' }}>{cartItem.mark}</View>
                                            </View>
                                            <View style={{ minWidth: 40, textAlign: 'right' }}>
                                                <View style={{ fontSize: 16, fontWeight: 'bold' }}>￥{cartItem.skuPrice}</View>
                                                <View style={{ fontSize: 14, color: '#999' }}>x{cartItem.number}</View>
                                            </View>
                                        </View>)
                                })
                            }
                        </View>
                        <View style={{ marginTop: 20, marginBottom: 20 }}>
                            <Text style={{ fontSize: 16 }}>配送费</Text>
                            <Text style={{ fontSize: 14, float: 'right' }}>￥2</Text>
                        </View>
                        <View style={{ marginTop: 20, marginBottom: 20 }}>
                            <Text style={{ fontSize: 16 }}>优惠券</Text>
                            <Text style={{ fontSize: 14, float: 'right', color: '#999' }}>暂无可用</Text>
                        </View>
                        <View style={{ marginTop: 20, marginBottom: 20 }} onClick={() => toRemarkPage()}>
                            <Text style={{ fontSize: 16 }}>备注</Text>
                            <Text style={{ fontSize: 14, float: 'right', color: '#999' }}>{getRemark()}</Text>
                        </View>
                        <View style={{ overflow: 'auto', marginTop: 20 }}>
                            <Text style={{ fontSize: 14, float: 'right' }}>共 {cart.reduce((arr, x) => arr + x.number, 0)} 件商品，小计 ￥{cart.reduce((arr, x) => arr + (x.skuPrice * x.number), 0)}</Text>
                        </View>
                    </View>

                    <View className={classNames(styles.card)}>
                        <View>
                            <Text style={{ fontSize: 16 }}>支付方式</Text>
                            <View style={{ display: 'inline-block', float: 'right' }}>
                                <View style={{ display: 'flex', alignItems: 'center' }}>
                                    <Image style={{ width: 14, height: 14 }} src={require('../../static/images/payment/weixin-pay.png')}></Image>
                                    <Text style={{ fontSize: 14, marginLeft: 5 }}>微信支付</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: '#FFF', display: 'flex', alignItems: 'center' }}>
                    <View style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Text style={{ marginRight: 5, fontSize: 12, color: '#999' }}>合计</Text>
                        <Text style={{ marginRight: 20, fontWeight: 'bold' }}>￥21</Text>
                    </View>
                    <Button type="primary" style={{ backgroundColor: '#DBA871', color: "#fff", borderRadius: 0, width: 100 }} className={styles.btn} onClick={() => pay()}>支付</Button>
                </View>
                <View style={{ height: bottomUnsafeHeight, backgroundColor: '#FFF' }}></View>
            </View>
        </>
    )
}

export default Payment