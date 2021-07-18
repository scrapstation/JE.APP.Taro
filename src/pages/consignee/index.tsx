import { ScrollView, View } from "@tarojs/components";
import { useEffect, useState } from "react";
import { API } from '../../api/index';
import { ConsigneeItemResponse } from "src/api/client";
import { AtButton, AtDivider, AtIcon } from "taro-ui";
import './index.scss'


const renderConsigneeItem = (consigneeItem: ConsigneeItemResponse) => {
    return (
        <View style="background-color:#FFF;padding:15px;display:flex;align-items:center;">
            <View style={{ flex: 1 }}>
                <View style={{ fontSize: 15 }}>{consigneeItem.simpleAddress}</View>
                <View style={{ fontSize: 14, color: '#C8C8C8', marginTop: 10 }}>{`${consigneeItem.name} ${consigneeItem.mobile}`}</View>
            </View>
            <View>
                <AtIcon value='edit' size='16' ></AtIcon>
            </View>
        </View>
    )
}

const Consignee: React.FC = () => {
    const [consignees, setConsignees] = useState<ConsigneeItemResponse[]>([]);
    useEffect(() => {
        const fetchConsignee = async () => {
            const data = await API.consigneeClient.getAll();
            setConsignees(data)
        };
        fetchConsignee();
    }, [])
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
                <AtButton type='primary' customStyle={{ margin: '0 20px' }}>添加</AtButton>
            </View>
        </>
    )
}

export default Consignee