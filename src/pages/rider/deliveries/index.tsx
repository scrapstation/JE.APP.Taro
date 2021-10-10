import { Text, View } from "@tarojs/components";
import React from "react";
import { SearchRiderDeliveryTaskResponse } from "../../../../src/api/client";
import { AtButton, AtTabBar } from "taro-ui";

export type DeliveriesProps = {
    deliveries: SearchRiderDeliveryTaskResponse[],
};
const Deliveries: React.FC<DeliveriesProps> = (props) => {
    return (
        <View>
            {props.deliveries.map(x => {
                return (
                    <View style={{ margin: 15, borderRadius: 5, backgroundColor: '#fff', padding: 15, boxShadow: '4px 4px 20px #f3f3f3' }}>
                        <View style={{ textAlign: 'right', color: '#626675', lineHeight: 0.5 }}>
                            · · ·
                        </View>
                        <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>还剩<Text style={{ color: 'red' }}> 8 </Text>分钟</View>
                            <View>#8952</View>
                        </View>
                        <View style={{ fontSize: 18, marginTop: 10, fontWeight: 'bold' }}>
                            {x.simpleAddress}{x.houseNumber}
                        </View>
                        <View style={{ color: '#626675', marginTop: 10 }}>
                            {x.name}{x.mobile}
                        </View>
                        <AtButton type='primary' customStyle={{ marginTop: 10 }} >
                            我已送达
                        </AtButton>
                    </View>
                )
            })}
        </View>
    )
}

export default Deliveries;