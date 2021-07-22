import { ScrollView, View } from "@tarojs/components";
import { useState } from "react";
import { API } from '../../api/index';
import { ConsigneeItemResponse } from "src/api/client";
import { AtButton, AtDivider, AtIcon } from "taro-ui";
import './index.scss'
import Taro, { useDidShow } from '@tarojs/taro';

const toAddPage = () => {
    Taro.navigateTo({
        url: '/pages/consignee/add/index'
    })
}
const toEditPage = (consigneeItem: ConsigneeItemResponse) => (
    Taro.navigateTo({
        url: `/pages/consignee/add/index?consignee=${JSON.stringify(consigneeItem)}`
    })
)

const back = (consigneeId: string) => {
    Taro.eventCenter.trigger('selectConsignee', consigneeId)
    // navigateBack()
}

const renderConsigneeItem = (consigneeItem: ConsigneeItemResponse) => {
    return (
        <View onClick={() => back(consigneeItem.id)} style="background-color:#FFF;padding:15px;display:flex;align-items:center;">
            <View style={{ flex: 1 }}>
                <View style={{ fontSize: 15 }}>{`${consigneeItem.simpleAddress} ${consigneeItem.houseNumber}`}</View>
                <View style={{ fontSize: 14, color: '#C8C8C8', marginTop: 10 }}>{`${consigneeItem.name} ${consigneeItem.mobile}`}</View>
            </View>
            <View>
                <AtIcon value='edit' size='16' onClick={() => toEditPage(consigneeItem)}></AtIcon>
            </View>
        </View>
    )
}

const Consignee: React.FC = () => {
    const [consignees, setConsignees] = useState<ConsigneeItemResponse[]>([]);
    useDidShow(() => {
        const fetchConsignee = async () => {
            const data = await API.consigneeClient.getAll();
            setConsignees(data)
        };
        fetchConsignee();
    })

    return (
        <>
            <ScrollView
                scrollY
                scrollWithAnimation
                scrollTop={0}
                style={{ height: '100%', marginTop: '10px' }}
            >
                <View style={{ backgroundColor: '#FFF' }}>
                    {consignees.map(consignee => {
                        return (
                            <>
                                {renderConsigneeItem(consignee)}
                                <AtDivider height={0.5} customStyle={{ margin: '0 15px', width: 'unset' }} lineColor='#fafafa'></AtDivider>
                            </>
                        )
                    })}
                </View>
                <View style={{ height: 100 }}></View>
            </ScrollView>
            <View style={{ zIndex: 999, position: 'fixed', left: 0, right: 0, bottom: 30 }}>
                <AtButton type='primary' customStyle={{ margin: '0 20px' }} onClick={() => toAddPage()}>添加</AtButton>
            </View>
        </>
    )
}

export default Consignee