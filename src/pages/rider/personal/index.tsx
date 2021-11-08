import { Image, Text, View } from "@tarojs/components";
import React from "react";
import { useSelector } from "react-redux";
import { RiderGetSummaryResponse } from "src/api/client";
import { ConnectState } from "src/models/connect";
import { UserModelState } from "src/models/user";
import './index.scss'
import defaultUserAvator from '/src/static/images/my/user.png'

export type PersonalProps = {
    summary: RiderGetSummaryResponse
};
const Personal: React.FC<PersonalProps> = (props) => {
    const { currentUser, isLogin } = useSelector<ConnectState, UserModelState>(x => x.user)
    return (
        <View className="main">
            <View className="rider-info">
                <View className="top">
                    <View className="base-info">
                        <View className="nickname">汤姆可</View>
                        <View className="viptips">消费满1元可升至VIP.2</View>
                    </View>
                    <View>
                        <Image className='avatar' src={currentUser ? currentUser!.avator! : defaultUserAvator} ></Image>
                    </View>
                </View>
            </View>
            {/* <View style={{ marginBottom: 20 }}>
                今日收入: {props.summary.todayExpectedIncome}元
            </View>
            <View>
                今日配送：{props.summary.todayTaskCount}单
            </View>
            <View>
                累计收入：{props.summary.totalIncome}单
            </View> */}
        </View>
    )
}

export default Personal;