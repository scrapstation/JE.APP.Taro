import { Button, View, Image } from "@tarojs/components";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ConnectState } from "src/models/connect";
import { UserModelState } from "src/models/user";
import { AccountInfoResponse } from "../../api/client";
import { API } from "../../api/index";

export type PersonalProps = {
    dispatch: Dispatch;
    user: UserModelState;
};

const Personal: React.FC<PersonalProps> = (props) => {
    const getUserInfo = async () => {
        setAccountInfo(await API.accountClient.getAccountInfo())
    }
    const login = () => {
        props.dispatch({
            type: 'user/login',
            callback: () => {
                console.log('ok')
            }
        });
    }

    const [accountInfo, setAccountInfo] = useState<AccountInfoResponse>()
    return (
        <View className='container'>
            {props.user.currentUser?.nickName}
            <Image src={accountInfo?.avator || ""} />
            <Button onClick={login}>login</Button>
            <Button onClick={getUserInfo}>login</Button>
        </View>
    )
}

export default connect(({ user }: ConnectState) => ({ user }))(Personal);