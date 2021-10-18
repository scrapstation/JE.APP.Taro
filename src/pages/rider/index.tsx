import React, { useEffect, useState } from "react";
import { API } from "../../../src/api";
import { AtMessage, AtTabBar } from "taro-ui";
import Deliveries from "./deliveries";
import Personal from "./personal";
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import { RiderDeliveringTasksItemResponse, RiderGetSummaryResponse } from "../../../src/api/client";
import './index.scss'
import { View } from "@tarojs/components";

const Rider: React.FC = () => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [deliveries, setDeliveries] = useState<RiderDeliveringTasksItemResponse[]>([])
    const [summary, setSummary] = useState<RiderGetSummaryResponse>(new RiderGetSummaryResponse())
    const handleTabbarClick = async (index) => {
        if (index == 1) {
            await handleScan()
        } else {
            setCurrentPageIndex(index)
        }
    }

    const handleScan = async () => {
        const scanResult = await Taro.scanCode({ onlyFromCamera: true, scanType: ['qrCode'] })
        await API.riderClient.taskOrder(scanResult.result)
        Taro.atMessage({
            'message': '接单成功，赶快去配送吧',
            'type': 'info',
        })
        setCurrentPageIndex(0)
        fetchTasks()
    }

    const fetchTasks = async () => {
        const tasks = await API.riderClient.getAllDeliveringTasks()
        setDeliveries(tasks)
    }

    const fetchSummary = async () => {
        setSummary(await API.riderClient.getSummary())
    }

    useEffect(() => {
        fetchTasks()
        fetchSummary()
    }, [])

    usePullDownRefresh(async () => {
        await fetchTasks();
        setTimeout(() => {
            Taro.atMessage({
                'message': '刷新成功',
                'type': 'info',
                duration: 500
            })
            Taro.stopPullDownRefresh()
        }, 500)
    })
    return (
        <>
            <AtMessage />
            <View style={{ marginBottom: 120 }}>
                {currentPageIndex == 0 &&
                    <Deliveries deliveries={deliveries} />
                }
                {currentPageIndex == 2 &&
                    <Personal summary={summary} />
                }
            </View>
            <AtTabBar
                fixed
                tabList={[
                    { title: '当前配送', iconType: 'bullet-list', text: 'new' },
                    { title: '接单', iconType: 'camera' },
                    { title: '我的', iconType: 'folder', text: '100', max: 99 }
                ]}
                onClick={(index) => handleTabbarClick(index)}
                current={currentPageIndex}
            />
        </>
    )
}

export default Rider;