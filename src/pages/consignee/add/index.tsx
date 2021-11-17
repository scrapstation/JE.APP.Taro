import { useState } from 'react';
import { CreateConsigneeRequest, ICreateConsigneeRequest, ModifyConsigneeRequest } from '../../../api/client';
import { AtButton, AtCheckbox, AtDivider, AtInput } from 'taro-ui';
import styles from './index.module.scss';
import Taro, { useReady, useRouter } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { API } from '../../../api';

const AddConsignee: React.FC = () => {
    const router = useRouter()
    const [editId, setEditId] = useState<string>();
    const [consignee, setConsignee] = useState<ICreateConsigneeRequest>(new CreateConsigneeRequest());
    useReady(() => {
        if (router.params.consignee) {
            const editConsigneeInfo = ModifyConsigneeRequest.fromJS(JSON.parse(router.params.consignee))
            setConsignee(editConsigneeInfo)
            setEditId(editConsigneeInfo.id)
            Taro.setNavigationBarTitle({ title: '修改地址' })
        } else {
            Taro.setNavigationBarTitle({ title: '添加地址' })
        }
    })
    const choseAddress = async () => {
        const result = await Taro.chooseLocation({});
        setConsignee({
            ...consignee,
            simpleAddress: result.name,
            fullAddress: result.address,
            latitude: Number(result.latitude),
            longitude: Number(result.longitude),
        });
    };
    const save = async () => {
        if (!consignee.name) {
            Taro.showToast({ title: '请输入正确的联系人', icon: 'none' })
            return
        }
        const mobileError = consignee.mobile?.length !== 11
        if (mobileError) {
            Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
            return
        }
        if (!consignee.simpleAddress) {
            Taro.showToast({ title: '请选择地址', icon: 'none' })
            return
        }
        const houseNumberError = (consignee.houseNumber?.length || 0) < 3
        if (houseNumberError) {
            Taro.showToast({ title: '请填写详细的门牌号', icon: 'none' })
            return
        }
        if (editId) {
            await API.consigneeClient.modify(ModifyConsigneeRequest.fromJS({ ...consignee, id: editId }))
        } else {
            await API.consigneeClient.create(new CreateConsigneeRequest(consignee));
        }
        Taro.navigateBack()
    };
    return (
        <>
            <AtInput name='name' title='联系人' type='text' placeholder='请输入收货人的姓名' border={false} value={consignee.name} onChange={(value) => setConsignee({ ...consignee, name: value as string })} />
            <AtDivider height={0.5} customStyle={{ margin: '0 15px', width: 'unset' }} lineColor='#fafafa'></AtDivider>
            <AtInput name='mobile' title='手机号' type='phone' placeholder='请输入收货手机号码' border={false} value={consignee.mobile} onChange={(value) => setConsignee({ ...consignee, mobile: value as string })} />
            <AtDivider height={0.5} customStyle={{ margin: '0 15px', width: 'unset' }} lineColor='#fafafa'></AtDivider>
            <View
                catchMove
                onClick={(e) => {
                    e.stopPropagation();
                    choseAddress();
                }}
            >
                <AtInput value={consignee.simpleAddress} name='value2' title='地址' type='text' placeholder='请选择地址' border={false} onChange={() => { }} />
            </View>
            <AtDivider height={0.5} customStyle={{ margin: '0 15px', width: 'unset' }} lineColor='#fafafa'></AtDivider>
            <AtInput name='houseNumber' title='门牌号' type='text' placeholder='例：24号楼507室' border={false} value={consignee.houseNumber} onChange={(value) => setConsignee({ ...consignee, houseNumber: value as string })} />
            <AtDivider height={0.5} customStyle={{ margin: '0 15px', width: 'unset' }} lineColor='#fafafa'></AtDivider>
            <AtCheckbox className={styles.redio} customStyle={{ border: '0' }} options={[{ value: true, label: '设为默认地址' }]} selectedList={consignee.isDefault ? [true] : []} onChange={() => setConsignee({ ...consignee, isDefault: !consignee.isDefault })} />
            <AtDivider height={0.5} customStyle={{ margin: '0 15px', width: 'unset' }} lineColor='#fafafa'></AtDivider>
            <AtButton type='primary' customStyle={{ margin: '10px 24rpx' }} onClick={() => save()}>
                保存
            </AtButton>
        </>
    );
};

export default AddConsignee;
