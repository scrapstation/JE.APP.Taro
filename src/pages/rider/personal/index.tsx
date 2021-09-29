import { View } from "@tarojs/components";
import React from "react";
import { AtTabBar } from "taro-ui";

export type PersonalProps = {
};
const Personal: React.FC<PersonalProps> = (props) => {
    return (
        <View>
            <View style={{ marginBottom: 20 }}>
                今日收入: 198元
            </View>
            <View>
                今日配送：98单
            </View>
        </View>
    )
}

export default Personal;