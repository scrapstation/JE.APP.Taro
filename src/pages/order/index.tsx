import { Button, Image, Text, View } from "@tarojs/components"
import { useDidShow } from "@tarojs/taro"
import { useState } from "react"
import { API } from "../../../src/api"
import { OrderTabEnum, SearchOrderRequest, SearchOrderResponse } from "../../../src/api/client"
import styles from './index.module.scss'
import './index.scss'

const renderOrderItem = (order: SearchOrderResponse) => {
    return (
        <View style={{ display: 'flex', flexDirection: 'column', marginTop: 5, padding: 10, backgroundColor: '#FFF' }}>
            <View style={{ display: 'flex', justifyContent: 'space-between', }}>
                <View>{'2021-07-11 17:08:40'}</View>
                <View>待支付</View>
            </View>
            <View style={{ display: 'flex', marginTop: 20 }}>
                <View style={{ flex: 1, width: '70%', display: 'flex', overflow: 'auto', marginRight: 20 }}>
                    {order.orderItems &&
                        order.orderItems!.map(orderItem => {
                            return (
                                <Image style="width: 40px; height: 40px; margin: 3px; flex-shrink: 0" src={`https://${orderItem.imgUrl!}`}></Image>
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
                <Button type="primary" size="mini" style={{ backgroundColor: '#fff', color: "#DBA871", borderRadius: 2, border: "1px solid #DBA871", width: 100, margin: 0 }}>再来一单</Button>
            </View>
        </View >
    )
}
const Order: React.FC = () => {
    const [orders, setOrders] = useState<SearchOrderResponse[]>([])
    useDidShow(async () => {
        const queryedOrders = await API.orderClient.search(new SearchOrderRequest({ orderTabType: OrderTabEnum.Recently, pageIndex: 1, pageSize: 20 }))
        setOrders(queryedOrders.list || [])
    })
    return (
        <View style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            {orders.map(order => {
                return renderOrderItem(order)
            })}
        </View>
    )
}

export default Order