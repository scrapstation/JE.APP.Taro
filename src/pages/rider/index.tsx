import React, { useEffect, useState } from "react";
import { API } from "../../../src/api";
import { AtMessage, AtTabBar } from "taro-ui";
import Deliveries from "./deliveries";
import Personal from "./personal";
import Taro from '@tarojs/taro';
import { SearchRiderDeliveryTaskRequest, SearchRiderDeliveryTaskResponse } from "../../../src/api/client";
import './index.scss'

const Rider: React.FC = () => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [deliveries, setDeliveries] = useState<SearchRiderDeliveryTaskResponse[]>([])
    const handleTabbarClick = async (index) => {
        if (index == 1) {
            await handleScan()
        } else {
            setCurrentPageIndex(index)
        }
    }

    const handleScan = async () => {
        const scanResult = await Taro.scanCode({ onlyFromCamera: true, scanType: ['qrCode'] })
        // await API.riderClient.taskOrder(scanResult.result)
        Taro.atMessage({
            'message': '接单成功，赶快去配送吧',
            'type': 'info',
        })
        setCurrentPageIndex(0)
        fetchTasks()
    }

    const fetchTasks = async () => {
        const tasks = await API.riderClient.searchDelivery(new SearchRiderDeliveryTaskRequest({ pageIndex: 1, pageSize: 20 }))
        setDeliveries(tasks.list!)
    }

    useEffect(() => {
        fetchTasks()
    }, [])
    return (
        <>
            <AtMessage />
            {currentPageIndex == 0 &&
                <Deliveries deliveries={deliveries} />
            }
            {currentPageIndex == 2 &&
                <Personal />
            }
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