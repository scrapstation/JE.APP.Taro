import { ScrollView, View } from "@tarojs/components";
import { useEffect, useState } from "react";
import { API } from '../../api/index';
import { ConsigneeItemResponse } from "../../../src/api/client";
import { AtButton, AtDivider, AtIcon } from "taro-ui";
import Taro, { navigateTo, useDidShow, EventChannel, useRouter } from '@tarojs/taro';
import './index.scss'



const Payment: React.FC = () => {
    const r = useRouter()
    const [consignee, setConsignee] = useState<ConsigneeItemResponse>(new ConsigneeItemResponse());
    useEffect(() => {
        const getRecommendedConsignee = async () => {
            setConsignee(await API.consigneeClient.getRecommended())
        }
        getRecommendedConsignee()
    }, [])

    const toSelectConsigneePage = () => {
    }

    return (
        <>
            <View style={{ margin: 10, padding: 10, backgroundColor: '#FFF', borderRadius: 5, display: 'flex', alignItems: 'center' }} >
                <View style={{ flex: 1 }}>
                    <View style={{ fontSize: 15 }}>{`${consignee.simpleAddress} ${consignee.houseNumber}`}</View>
                    <View style={{ fontSize: 14, color: '#C8C8C8', marginTop: 10 }}>{`${consignee.name} ${consignee.mobile}`}</View>
                </View>
                <View>
                    <AtIcon value='chevron-right' size='24' color="#C8C8C8" onClick={() => { }}></AtIcon>
                </View>
            </View>
        </>
    )
}

export default Payment