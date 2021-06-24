import { View, Image, Navigator } from "@tarojs/components";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ConnectState } from "src/models/connect";
import { UserModelState } from "src/models/user";
import { AtButton, AtList, AtListItem, AtTag } from "taro-ui";
import { AccountInfoResponse } from "../../api/client";
import "./index.scss"

export type PersonalProps = {
    dispatch: Dispatch;
    user: UserModelState;
};

const Personal: React.FC<PersonalProps> = (props) => {
    const { currentUser, isLogin } = props.user
    return (
        <View className='container'>
            <Image className='header-img' src={require('../../static/images/my/header-bg.jpg')} mode='widthFix'></Image>
            <View className='content'>
                <View className='member-card'>
                    <View className='info'>
                        <View className='title'>
                            <View className='wenyue-font'>{isLogin ? `你好, ${currentUser?.nickName}` : "请先登录哟~"}</View>
                        </View>
                        <Image src={isLogin ? currentUser!.avator! : 'https://wx.qlogo.cn/mmopen/vi_32/Hx7MFkCEmZVHziaTTiaHSiaCs4ApnH5CD0nYOhOg1nYUUMYtxMXkL6L4VL5icRfO5w4LGzW5ib0FZicwj2MficyYfZgCw/132'} className='avatar'></Image>
                        {!isLogin &&
                            <AtTag onClick={() => props.dispatch({ type: "user/login" })} size='small' active type='primary' className='login-button'>点击登录</AtTag>
                        }
                        {isLogin &&
                            <View className='badage'>
                                Lv1
                            </View>
                        }
                    </View>
                    <View className='row'>
                        <Navigator className='grid' open-type='navigate' url='/pages/integrals/mall'>
                            <Image src={require('../../static/images/my/me_icon_points.png')}></Image>
                            <View className='value'>63</View>
                            <View className='title'>积分商城</View>
                        </Navigator>
                        <View className='grid' hover-className='opacity-6'>
                            <Image src={require('../../static/images/my/me_icon_quan.png')}></Image>
                            <View className='value'>0</View>
                            <View className='title'>喜茶劵</View>
                        </View>
                        <Navigator className='grid' open-type='navigate' url='/pages/my/wallet'>
                            <Image src={require('../../static/images/my/me_icon_wallet.png')}></Image>
                            <View className='value'>0.00</View>
                            <View className='title'>钱包</View>
                        </Navigator>
                    </View>
                </View >
            </View >
            <AtList>
                <AtListItem title='标题文字' />
            </AtList>
            {/* <list-cell hover arrow >
        <View className="list-cell-wrapper">
            <View View="title">会员码</View>
            <View className="subtitle">门店扫码积分、喜茶钱包和阿喜有礼卡支持</View>
        </View>
		</list - cell >
		<list-cell hover arrow>
			<View className="list-cell-wrapper">
				<View View="title">兑换中心</View>
				<View className="subtitle">兑换星球会员、喜茶券和阿喜有礼卡</View>
			</View>
		</list-cell>
		<list-cell hover arrow>
			<View className="list-cell-wrapper">
				<View View="title">星球封面</View>
			</View>
		</list-cell>
		<list-cell hover arrow>
			<View className="list-cell-wrapper">
				<View View="title">联系客服</View>
			</View>
		</list-cell>
		<list-cell hover arrow>
			<View className="list-cell-wrapper">
				<View View="title">消息中心</View>
			</View>
		</list-cell>
		<list-cell hover arrow last>
			<View className="list-cell-wrapper">
				<View View="title">更多</View>
			</View>
		</list-cell> */}
        </View >
    )
}

export default connect(({ user }: ConnectState) => ({ user }))(Personal);