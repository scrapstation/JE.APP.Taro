import { Button, Image, Text, View } from "@tarojs/components";
import { useEffect, useState } from "react";
import { API } from '../../api/index';
import { ConsigneeItemResponse } from "../../../src/api/client";
import { AtIcon } from "taro-ui";
import Taro, { navigateTo } from '@tarojs/taro';
import styles from './index.module.scss'
import classNames from "classnames";

const Payment: React.FC = () => {
    const [consignee, setConsignee] = useState<ConsigneeItemResponse>(new ConsigneeItemResponse());
    const [bottomUnsafeHeight, setBottomUnsafeHeight] = useState<number>(0);
    useEffect(() => {
        Taro.eventCenter.on("selectConsignee", handleConsigneeChange)
        const getRecommendedConsignee = async () => {
            const systemInfo = (await Taro.getSystemInfo())
            console.log(systemInfo.screenHeight - systemInfo.safeArea.bottom)
            setBottomUnsafeHeight(systemInfo.screenHeight - systemInfo.safeArea.bottom)
            setConsignee(await API.consigneeClient.getRecommended())
        }
        getRecommendedConsignee()
    }, [])

    const handleConsigneeChange = async (consigneeId: string) => {
        setConsignee(await API.consigneeClient.getById(consigneeId))
    }

    const toSelectConsigneePage = () => {
        navigateTo({
            url: '/pages/consignee/index'
        })
    }

    return (
        <>
            <View style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <View style={{ flex: 1, overflow: "auto" }}>
                    <View onClick={() => toSelectConsigneePage()} className={classNames(styles.card, styles.consignee)} >
                        <View style={{ flex: 1 }}>
                            <View className={styles.address}>{`${consignee.simpleAddress} ${consignee.houseNumber}`}</View>
                            <View className={styles.contact}>{`${consignee.name} ${consignee.mobile}`}</View>
                        </View>
                        <View>
                            <AtIcon value='chevron-right' size='24' color="#C8C8C8" onClick={() => { }}></AtIcon>
                        </View>
                    </View>
                    <View className={classNames(styles.card, styles.order)}>
                        <View className={styles.title}>商品详情</View>
                        <View style={{ fontSize: 12, color: '#999' }}>请注意商品数量</View>
                        <View style={{ marginTop: 20 }}>
                            {
                                [1, 2].map(x => {
                                    return (
                                        <View style={{ display: 'flex', flexWrap: 'wrap', marginTop: 10 }}>
                                            <View style={{ display: 'flex', alignItems: 'center' }}>
                                                <Image lazyLoad mode='aspectFill' src="https://dave-canteen.oss-accelerate.aliyuncs.com/products/ad77d309-fd75-4c54-a888-f3f90b77110c.png" style={{ width: 64, height: 64 }}></Image>
                                            </View>
                                            <View style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', overflow: 'auto', wordWrap: 'break-word', marginLeft: 10 }}>
                                                <View style={{ fontSize: 16 }}>嫩爆柠</View>
                                                <View style={{ fontSize: 14, color: '#999' }}>500ml 常温</View>
                                            </View>
                                            <View style={{ minWidth: 40, textAlign: 'right' }}>
                                                <View style={{ fontSize: 16, fontWeight: 'bold' }}>￥21</View>
                                                <View style={{ fontSize: 14, color: '#999' }}>x1</View>
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
                        <View style={{ marginTop: 20, marginBottom: 20 }}>
                            <Text style={{ fontSize: 16 }}>备注</Text>
                            <Text style={{ fontSize: 14, float: 'right', color: '#999' }}>包装 配送 口味要求</Text>
                        </View>
                        <View style={{ overflow: 'auto', marginTop: 20 }}>
                            <Text style={{ fontSize: 14, float: 'right' }}>共 8 件商品，小计 ￥68</Text>
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
                    <Button type="primary" style={{ backgroundColor: '#DBA871', color: "#fff", borderRadius: 0, width: 100 }} className={styles.btn}>支付</Button>
                </View>
                <View style={{ height: bottomUnsafeHeight, backgroundColor: '#FFF' }}></View>
            </View>
        </>
    )
}

export default Payment