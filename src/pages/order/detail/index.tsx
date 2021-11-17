import { Button, Image, Text, View } from "@tarojs/components"
import { useRouter } from "@tarojs/taro"
import { useReady } from "@tarojs/taro"
import moment from "moment"
import { useState } from "react"
import tryFetch from "../../../../src/utils/tryfetch"
import { AtCountdown, AtDivider } from "taro-ui"
import { API } from "../../../../src/api"
import { OrderResponse, StatusEnumOfOrder } from "../../../../src/api/client"
import getStatusText from "../common"
import './index.scss'
import Taro from '@tarojs/taro';



const OrderDetail: React.FC = () => {
    const router = useRouter()
    const [isReady, setIsReady] = useState<boolean>(false)
    const [order, setOrder] = useState<OrderResponse>(new OrderResponse())
    useReady(async () => {
        console.log(OrderResponse.fromJS(JSON.parse(router.params.order!)))
        setOrder(OrderResponse.fromJS(JSON.parse(router.params.order!)))
        setIsReady(true)
    })
    const getOrder = async (orderId: string) => {
        setOrder(await API.orderClient.getById(orderId))
    }
    const pay = async (orderId: string) => {
        const payinfo = await tryFetch(API.orderClient.pay(orderId), true)
        await Taro.requestPayment({
            timeStamp: payinfo.timeStamp!,
            nonceStr: payinfo.nonceStr!,
            package: payinfo.package!,
            // @ts-ignore
            signType: payinfo.signType!,
            paySign: payinfo.paySign!,
        })
    }
    const renderStatusArea = (order: OrderResponse) => {
        return (
            <>
                <View className="">
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                        {getStatusText(order.status)}
                        {order.status === StatusEnumOfOrder.PendingPayment && ` ￥${order.amount}`}
                    </Text>
                </View>
                <View style={{ marginTop: 5 }}>
                    {order.status == StatusEnumOfOrder.PendingPayment &&
                        <View>
                            <AtCountdown
                                className="at-countdown"
                                format={{ hours: ':', minutes: ':', seconds: '' }}
                                seconds={moment(order.expireTime).diff(moment.now(), 'seconds')}
                                isShowHour={false}
                                onTimeUp={() => { getOrder(order.id) }}
                            />
                            <Text style={{ color: '#999' }}>后订单将会自动取消</Text>
                        </View>
                    }
                    {order.status !== StatusEnumOfOrder.PendingPayment && <Text style={{ color: '#999', fontSize: 12 }}>感谢您的支持，欢迎再次光临</Text>}
                </View>
                <View style={{ marginTop: 10 }}>
                    {order.status == StatusEnumOfOrder.PendingPayment &&
                        <>
                            <Button type="primary" size="mini" style={{ margin: '0 0 0 5px', backgroundColor: '#fff', color: "#999", borderRadius: 2, border: "1px solid #999" }} onClick={() => { }}>取消订单</Button>
                            <Button type="primary" size="mini" style={{ margin: '0 0 0 5px', backgroundColor: '#fff', color: "#DBA871", borderRadius: 2, border: "1px solid #DBA871" }} onClick={() => pay(order.id)}>去支付</Button>
                        </>
                    }
                    {order.status !== StatusEnumOfOrder.PendingPayment &&
                        <>
                            <Button type="primary" size="mini" style={{ margin: '0 0 0 5px', backgroundColor: '#fff', color: "#DBA871", borderRadius: 2, border: "1px solid #DBA871" }} onClick={() => { }}>再来一单</Button>
                        </>
                    }
                </View>
            </>
        )
    }

    const renderOrderItems = (order: OrderResponse) => {
        return (
            order.orderItems!.map(item => {
                return (
                    <View style={{ display: 'flex', flexWrap: 'wrap', marginTop: 5, marginBottom: 5 }}>
                        <View style={{ display: 'flex', alignItems: 'center' }}>
                            <Image lazyLoad mode='aspectFill' src={item.imgUrl!} style={{ width: 64, height: 64 }}></Image>
                        </View>
                        <View style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', overflow: 'auto', wordWrap: 'break-word', marginLeft: 10 }}>
                            <View style={{ fontSize: 16 }}>{item.snapshotName}</View>
                            <View style={{ fontSize: 14, color: '#999' }}>{item.snapshotAttributeItemNames}</View>
                        </View>
                        <View style={{ minWidth: 40, textAlign: 'right' }}>
                            <View style={{ fontSize: 16, fontWeight: 'bold' }}>￥{item.price}</View>
                            <View style={{ fontSize: 14, color: '#999' }}>x{item.quantity}</View>
                        </View>
                    </View>
                )
            }))
    }
    return (
        <>
            {isReady &&
                <>
                    <View style={{ margin: 10 }}>
                        <View style={{ textAlign: 'center', backgroundColor: '#FFF', padding: 20 }}>
                            {renderStatusArea(order)}
                        </View>
                    </View>
                    <View style={{ margin: 10 }}>
                        <View style={{ backgroundColor: '#FFF', padding: 10, display: 'flex', flexDirection: 'column' }}>
                            {renderOrderItems(order)}
                            <View style={{ overflow: 'auto', marginTop: 20 }}>
                                <Text style={{ fontSize: 14, float: 'right' }}>共 {order.orderItems!.reduce((arr, x) => arr + x.quantity, 0)} 件商品，合计 ￥{order.actualPayment}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: '#FFF', margin: 10, padding: 0 }}>
                        <View style={{ margin: 10, display: 'inline-block' }}>订单信息</View>
                        <AtDivider height={0.5} customStyle={{ margin: '0 15px', width: 'unset' }} lineColor='#fafafa'></AtDivider>
                        <View style={{ lineHeight: '24px', margin: 10, fontSize: 12, display: 'inline-block' }}>
                            <View><Text style={{ color: '#999' }}>下单时间:  </Text>7/29 9:49</View>
                            <View><Text style={{ color: '#999' }}>订单编号:  </Text>84616798487919</View>
                            <View><Text style={{ color: '#999' }}>备注信息:  </Text>的味道</View>
                        </View>
                    </View>
                </>
            }

        </>
    )
}
export default OrderDetail