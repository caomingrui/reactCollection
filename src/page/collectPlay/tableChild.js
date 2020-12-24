import React, {useContext, useEffect, useReducer, useState} from "react";
import { AppContext, DetailedData, footer, Option, RangePicker, ChildCont } from "./index"
import moment from "moment";
import {Space, Table} from "antd";
import {DrawerForm} from "./table";
import styled from 'styled-components';

const todosReducer = (state, action) => {
    state = action;
    return {
        ...state
    };
}

export const TableChild = (props) => {

    const [timeDate, setTimeDate] = useContext(AppContext);
    const [detailTableData, setDetailTableData] = useContext(ChildCont);
    const [boolValue, setBoolValue] = useState(false);
    const [data, setData] = useState();

    const columns = [
        {
            title: 'type',
            dataIndex: 'type',
            key: 'type',
            render: text => <a>{text}</a>,
        },
        {
            title: 'title',
            dataIndex: 'child',
            key: 'child',
            render: text => <a> {text[0].cont} </a>
        },
        {
            title: 'text',
            dataIndex: 'child',
            key: 'child',
            render: text => <a> {text.length>1?text[1].cont: ''} </a>
        },
        {
            title: 'timeStart',
            dataIndex: 'timeStart',
            key: 'timeStart',
            render: text => <a> {text} </a>
        },
        {
            title: 'timeEnd',
            dataIndex: 'timeEnd',
            key: 'timeEnd',
            render: text => <a> {text} </a>
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a>Change</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        if(boolValue) {
            console.log("子详情表格数据初始化")
            console.log('0---------------')
            console.log(props.detailTableData)
            setData([])
            console.log(data)
            console.log('0---------------')
            setBoolValue(false);
        }
        setBoolValue(true);
    })

    useEffect(() => {
        console.log("子详情表格数据组件挂载完成之后执行:")
    },[])

    useEffect(() => {
        if(boolValue){
            console.log("子详情表格数据组件更新执行")
            setData(props.detailTableData)
            setBoolValue(false);
        }
        setBoolValue(true);
    })

    useEffect(() => {
        if(boolValue) {
            console.log("子详情表格数据跟新")
            setBoolValue(false);
        }
        setBoolValue(true);
    },[props.detailTableData])

    return(
        <div>
            { props.detailTableData?props.detailTableData.length: '' } - { data?data.length:'' } - { detailTableData?detailTableData.length: '' }
            <Table columns={columns} dataSource={detailTableData} rowKey={record => (record.timeStart + record.timeEnd)} />
        </div>
    );
}
