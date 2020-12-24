import React, {memo} from "react";
import Table, { MultiLayerTable } from '../template/table'
import {Space} from "antd";

const columns = [
    {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '角色权限',
        dataIndex: 'path',
        key: 'path',
        width: '12%',
    },
    {
        title: '账号',
        dataIndex: 'path',
        key: 'path',
        width: '12%',
    },
    {
        title: '密码',
        dataIndex: 'path',
        key: 'path',
        width: '12%',
    },
    {
        title: '最近上线时间',
        dataIndex: 'path',
        key: 'path',
        width: '12%',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record, ind) => (
            <Space size="middle">
                <a onClick={() => {}}> Change </a>
                <a onClick={() => {}}> Delete </a>
            </Space>
        ),
    },
];

export default memo((props) => {

    return (
        <>
            <Table columns={columns} ></Table>
        </>
    );
});
