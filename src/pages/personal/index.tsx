import { Button, View, Image } from "@tarojs/components";
import React, { useState } from "react";
import Taro from '@tarojs/taro';
import { API } from "../../api/index";
import { AccountInfoResponse, GetWechatUserInfo } from "../../api/client";

const login = async () => {
    const [wechatLoginResult, userProfile] = await Promise.all([Taro.login({}), Taro.getUserProfile({ desc: '用于完善会员资料' })])
    var apiLoginResult = await API.authClient.auth(new GetWechatUserInfo({ code: wechatLoginResult.code, rawData: userProfile.rawData, signature: userProfile.signature }))
    Taro.setStorage({ key: 'token', data: apiLoginResult!.token })
}


const Personal: React.FC = () => {
    const getUserInfo = async () => {
        setAccountInfo(await API.accountClient.getAccountInfo())
    }
    const [accountInfo, setAccountInfo] = useState<AccountInfoResponse>()
    return (
        <View className='container'>
            <Image src={accountInfo?.avator || ""} />
            <Button onClick={login}>login</Button>
            <Button onClick={getUserInfo}>login</Button>
        </View>
    )
}

export default Personal;
