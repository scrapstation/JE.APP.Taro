import { Image, Text, View } from "@tarojs/components";
import React from "react";
import { useSelector } from "react-redux";
import { RiderGetSummaryResponse } from "src/api/client";
import { ConnectState } from "src/models/connect";
import { UserModelState } from "src/models/user";
import './index.scss'
import defaultUserAvator from '/src/static/images/my/user.png'
import lv1Svg from '/src/static/images/my/rider/level-1.svg'
import NumberMotion from "./components/NumberMotion";

export type PersonalProps = {
    summary: RiderGetSummaryResponse
};
const Personal: React.FC<PersonalProps> = (props) => {
    const { currentUser, isLogin } = useSelector<ConnectState, UserModelState>(x => x.user)
    return (
        <View className="main">
            <View className="rider-info-card">
                <Image className='avatar' src={currentUser ? currentUser!.avator! : defaultUserAvator} ></Image>
                <View className="base-info">
                    <View className="nickname">Hi,汤姆可</View>
                    <View className="viptips">今天是你在戴夫小卖部的第67天</View>
                </View>
                <Image className='level' src={lv1Svg} ></Image>
            </View>
            <View className="account-info">
                <View>
                    <View> ￥<NumberMotion number={98} /> </View>
                    <View> 今日收入 </View>
                </View>
                <View>
                    <View> ￥<NumberMotion number={8487} /> </View>
                    <View>  钱包 </View>
                </View>
                <View>
                    <View> <NumberMotion number={0} /> </View>
                    <View>  今日配送 </View>
                </View>
                <View>
                    <View> <NumberMotion number={987} /> </View>
                    <View>  累计配送 </View>
                </View>
            </View>
        </View>
    )
}

export default Personal;