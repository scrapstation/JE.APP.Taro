import { Button, Image, View } from "@tarojs/components"
import { useDidShow } from "@tarojs/taro"
import moment from "moment"
import { useState } from "react"
import { API } from "../../../src/api"
import { SearchOrderRequest, OrderResponse, StatusEnum } from "../../../src/api/client"
import './index.scss'
import Taro from '@tarojs/taro';
import tryFetch from "../../../src/utils/tryfetch"
import getStatusText from "./common"


const Order: React.FC = () => {
    const [orders, setOrders] = useState<OrderResponse[]>([])
    useDidShow(async () => {
        const queryedOrders = await API.orderClient.search(new SearchOrderRequest({ pageIndex: 1, pageSize: 20 }))
        setOrders(queryedOrders.list || [])
    })
    const toOrderDetail = (order: OrderResponse) => {
        Taro.navigateTo({
            url: `/pages/order/detail/index?order=${JSON.stringify(order)}`
        })
    }
    const renderOrderItem = (order: OrderResponse) => {
        return (
            <View style={{ display: 'flex', flexDirection: 'column', marginTop: 10, padding: 10, backgroundColor: '#FFF' }}>
                <View style={{ display: 'flex', justifyContent: 'space-between', }}>
                    <View style={{ fontSize: 14 }}>{moment(order.createdOn).format('YYYY-MM-DD HH:mm:ss')}</View>
                    <View style={{ fontSize: 14, color: '#999' }} onClick={() => toOrderDetail(order)}>{getStatusText(order.status)}</View>
                </View>
                <View style={{ display: 'flex', marginTop: 20 }}>
                    <View style={{ flex: 1, width: '70%', display: 'flex', overflow: 'auto', marginRight: 20 }}>
                        {order.orderItems &&
                            order.orderItems!.map(orderItem => {
                                return (
                                    <Image style="width: 50px; height: 50px; margin-right: 10px; flex-shrink: 0" src={`https://${orderItem.imgUrl!}`}></Image>
                                )
                            })
                        }
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <View>￥{order.actualPayment}</View>
                        <View style={{ fontSize: 12, color: '#999' }}>共{order.orderItems?.length || 0}件</View>
                    </View>
                </View>
                <View style={{ display: "flex", justifyContent: 'flex-end', marginTop: 20 }}>
                    {
                        order.status === StatusEnum.PendingPayment &&
                        <>
                            <Button type="primary" size="mini" style={{ margin: '0 0 0 5px', backgroundColor: '#fff', color: "#999", borderRadius: 2, border: "1px solid #999" }} onClick={() => cancelOrder(order.id)}>取消订单</Button>
                            <Button type="primary" size="mini" style={{ margin: '0 0 0 5px', backgroundColor: '#fff', color: "#DBA871", borderRadius: 2, border: "1px solid #DBA871" }} onClick={() => { pay(order.id) }}>去支付</Button>
                        </>
                    }
                    {

                        order.status !== StatusEnum.PendingPayment &&
                        <Button type="primary" size="mini" style={{ margin: '0 0 0 5px', backgroundColor: '#fff', color: "#DBA871", borderRadius: 2, border: "1px solid #DBA871" }}>再来一单</Button>
                    }
                </View>
            </View >
        )
    }
    const cancelOrder = async (orderId: string) => {
        const result = await Taro.showModal({ content: "取消订单后,退款及优惠券将原路退回，可能出现退款延迟到账" })
        if (result.confirm) {
            await tryFetch(API.orderClient.cancel(orderId), true)
            const queryedOrders = await tryFetch(API.orderClient.search(new SearchOrderRequest({ pageIndex: 1, pageSize: 20 })), true)
            setOrders(queryedOrders.list || [])
        }
    }
    const pay = async (orderId: string) => {
        const payinfo = await tryFetch(API.orderClient.pay(orderId), true)
        await tryFetch(Taro.requestPayment({
            timeStamp: payinfo.timeStamp!,
            nonceStr: payinfo.nonceStr!,
            package: payinfo.package!,
            // @ts-ignore
            signType: payinfo.signType!,
            paySign: payinfo.paySign!,
        }), true)
    }
    return (
        <View style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            {orders.map(order => {
                return renderOrderItem(order)
            })}
            <View style={{ margin: "20px auto", color: '#999', fontSize: 12 }}>没有更多了~</View>
        </View>
    )
}

export default Order