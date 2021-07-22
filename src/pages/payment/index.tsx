import { View } from "@tarojs/components";
import { useEffect, useState } from "react";
import { API } from '../../api/index';
import { ConsigneeItemResponse } from "../../../src/api/client";
import { AtIcon } from "taro-ui";
import Taro, { navigateTo } from '@tarojs/taro';
import './index.scss'



const Payment: React.FC = () => {
    const [consignee, setConsignee] = useState<ConsigneeItemResponse>(new ConsigneeItemResponse());

    useEffect(() => {
        Taro.eventCenter.on("selectConsignee", handleConsigneeChange)
        const getRecommendedConsignee = async () => {
            setConsignee(await API.consigneeClient.getRecommended())
        }
        getRecommendedConsignee()
    }, [])

    const handleConsigneeChange = async (consigneeId: string) => {
        setConsignee(await API.consigneeClient.getById(consigneeId))
    }

    const toSelectConsigneePage = () => {
        navigateTo({
            url: '/pages/consignee/index'
        })
    }

    return (
        <>
            <View onClick={() => toSelectConsigneePage()} style={{ margin: 10, padding: 10, backgroundColor: '#FFF', borderRadius: 5, display: 'flex', alignItems: 'center' }} >
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