import { View } from "@tarojs/components";
import React from "react";
import { RiderGetSummaryResponse } from "src/api/client";

export type PersonalProps = {
    summary: RiderGetSummaryResponse
};
const Personal: React.FC<PersonalProps> = (props) => {
    return (
        <View>
            <View style={{ marginBottom: 20 }}>
                今日收入: {props.summary.todayExpectedIncome}元
            </View>
            <View>
                今日配送：{props.summary.todayTaskCount}单
            </View>
            <View>
                累计收入：{props.summary.totalIncome}单
            </View>
        </View>
    )
}

export default Personal;