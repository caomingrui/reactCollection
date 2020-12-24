import * as Icon from '@ant-design/icons';
import React, {useState, useEffect, useReducer, useContext, memo} from 'react';
import axios from "axios";

// 动态icon
export const iconCreate = (name) => {
    if (name != 'setTwoToneColor' && name != '') {
        return React.createElement(Icon && (Icon)[name], {
            style: {fontSize: '16px', color: '#d7a28f'}
        });
    }
}

// 表格头总数据集
export const columnsData = [
    {
        key: '1',
        tabel: 'route',
        val: [
            {
                title: '菜单名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '路径',
                dataIndex: 'path',
                key: 'path',
                width: '12%',
            },
            {
                title: 'Action',
                key: 'action',
                render: () => {}
            }
        ]
    },

    {
        key: '2',
        tabel: 'icon',
        val: [
            {
                title: '菜单名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '菜单图标',
                dataIndex: 'icon',
                key: 'icon',
                render: (text) =>  iconCreate(text)
            },
            {
                title: '路径',
                dataIndex: 'path',
                key: 'path',
                width: '12%',
            },
            {
                title: 'Action',
                key: 'action',
                render: () => {}
            },
        ]
    },

    {
        key: '3',
        tabel: 'columns',
        val: [
            {
                title: '模块名称',
                dataIndex: 'tabel',
                key: 'tabel',
            },
            {
                title: '模块id',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: '模块规则',
                dataIndex: 'val',
                key: 'val',
            },
            {
                title: '模块规则',
                dataIndex: 'val1',
                key: 'val1',
            },
            {
                title: 'Action',
                key: 'action',
                render: () => {}
            },
        ]
    }
];

const columsFun = (state, action) => {
    state = action;
    return state;
}

/**
 * 处理表格规则的钩子
 * */
export const useColums = (props) => {
    const [colData, setColData] = useReducer(columsFun, columnsData);

    // 匹配对应规则
    const screenColumns = (tabel) => {
        const arr = [];
        let index = 0;
        const arrData = [...colData];
        arrData.map((res, ind) => {
            if (res.tabel == tabel) {
                arr.push(res.val);
                index = ind;
            }
        });
        return [colData[index].val, index];
    }

    // 匹配不同render
    const screenRender = (tabel, key, call, boo = true) => {
        const [columns, index] = screenColumns(tabel);
        const arr = boo?JSON.parse(JSON.stringify(colData)): [...colData];
        if (key != 'icon') {
            arr[1].val[1].render = (text) => iconCreate(text);
        }
        columns.map((res, ind) => {
            if ( res.key == key ) {
                arr[index].val[ind].render = call;
                setColData(arr);
            }
        })
        return arr[index].val
    }

    return {
        colData,
        screenColumns,
        screenRender,
    }
}
