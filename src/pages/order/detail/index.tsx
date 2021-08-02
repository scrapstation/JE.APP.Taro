import { Button, Text, View } from "@tarojs/components"
import { useRouter } from "@tarojs/taro"
import { useReady } from "@tarojs/taro"
import moment from "moment"
import { useState } from "react"
import tryFetch from "../../../../src/utils/tryfetch"
import { AtCountdown } from "taro-ui"
import { API } from "../../../../src/api"
import { OrderStatusEnum, OrderResponse } from "../../../../src/api/client"
import getStatusText from "../common"
import './index.scss'
import Taro from '@tarojs/taro';



const OrderDetail: React.FC = () => {
    const router = useRouter()
    const [order, setOrder] = useState<OrderResponse>(new OrderResponse())
    useReady(async () => {
        setOrder(OrderResponse.fromJS(JSON.parse(router.params.order!)))
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
                    <Text style={{ fontWeight: 'bold' }}>
                        {getStatusText(order.status)}
                        {order.status === OrderStatusEnum.InPayment && ` ￥${order.amount}`}
                    </Text>
                </View>
                <View style={{ marginTop: 5 }}>
                    {order.status == OrderStatusEnum.InPayment &&
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
                    {order.status !== OrderStatusEnum.InPayment && <Text style={{ color: '#999', fontSize: 12 }}>感谢您的支持，欢迎再次光临</Text>}
                </View>
                <View style={{ marginTop: 10 }}>
                    {order.status == OrderStatusEnum.InPayment &&
                        <>
                            <Button type="primary" size="mini" style={{ margin: '0 0 0 5px', backgroundColor: '#fff', color: "#999", borderRadius: 2, border: "1px solid #999" }} onClick={() => { }}>取消订单</Button>
                            <Button type="primary" size="mini" style={{ margin: '0 0 0 5px', backgroundColor: '#fff', color: "#DBA871", borderRadius: 2, border: "1px solid #DBA871" }} onClick={() => pay(order.id)}>去支付</Button>
                        </>
                    }
                    {order.status !== OrderStatusEnum.InPayment &&
                        <>
                            <Button type="primary" size="mini" style={{ margin: '0 0 0 5px', backgroundColor: '#fff', color: "#DBA871", borderRadius: 2, border: "1px solid #DBA871" }} onClick={() => { }}>再来一单</Button>
                        </>
                    }
                </View>
            </>
        )
    }
    return (
        <>
            <View style={{ margin: 10 }}>
                <View style={{ textAlign: 'center', backgroundColor: '#FFF', padding: 20 }}>
                    {renderStatusArea(order)}
                </View>
            </View>
        </>
    )
}
export default OrderDetail