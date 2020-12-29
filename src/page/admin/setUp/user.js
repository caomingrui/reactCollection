import React, {memo, useEffect, useState} from "react";
import Table, { MultiLayerTable } from '../template/table'
import {Space} from "antd";
import { useColums, iconCreate } from '@/utils/data/tabelColumns';

const ActionTable = (text, record, ind) => (
    <Space size="middle">
        <a onClick={() => {}}> Change </a>
        <a onClick={() => {}}> Delete </a>
    </Space>
);

// 测试 用户假数据
const userData = [
    {
        key: 1,
        name: '张三',
        permissions: '游客',
        account: '132030',
        password: '******',
        time: '2020'
    },
];

export default memo((props) => {
    const {data, screenColumns, screenRender} = useColums();
    const [tabelData, setTabelData] = useState(); // 表格规则

    useEffect(() => {
        console.log("user组件挂载完成之后执行:");
        setTabelData(screenRender('user', 'action', ActionTable));
    },[]);

    return (
        <>
            <Table columns={tabelData} data={userData}></Table>
        </>
    );
});
