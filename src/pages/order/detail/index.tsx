import { Button, View } from "@tarojs/components"
import { useReady } from "@tarojs/taro"
import { useState } from "react"
import { AtCountdown } from "taro-ui"
import { API } from "../../../../src/api"
import { OrderStatusEnum, PaymentStatusEnum, SearchOrderRequest, SearchOrderResponse } from "../../../../src/api/client"
import getStatusText from "../common"
import './index.scss'

const OrderDetail: React.FC = () => {
    const [order, setOrder] = useState<SearchOrderResponse>(new SearchOrderResponse())
    useReady(async () => {
        setOrder((await API.orderClient.search(new SearchOrderRequest({ pageIndex: 1, pageSize: 20 }))).list![0])
    })
    return (
        <>
            <View style={{ textAlign: 'center' }}>
                <View className="neutra-font">
                    {getStatusText(order.status)}
                    {order.status === OrderStatusEnum.InPayment && ` ￥${order.amount}`}
                </View>
                <View>
                    <AtCountdown
                        className="at-countdown"
                        format={{ hours: ':', minutes: ':', seconds: '' }}
                        seconds={10}
                        isShowHour={false}
                        onTimeUp={() => { console.log("计时结束") }}
                    />后订单将会自动取消
                </View>
                <View>
                    <Button type="primary" size="mini" style={{ margin: '0 0 0 5px', backgroundColor: '#fff', color: "#999", borderRadius: 2, border: "1px solid #999" }} onClick={() => { }}>取消订单</Button>
                    <Button type="primary" size="mini" style={{ margin: '0 0 0 5px', backgroundColor: '#fff', color: "#DBA871", borderRadius: 2, border: "1px solid #DBA871" }} onClick={() => { }}>去支付</Button></View>
            </View>
        </>
    )
}
export default OrderDetail