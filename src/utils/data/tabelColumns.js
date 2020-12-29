import * as Icon from '@ant-design/icons';
import React, {useState, useEffect, useReducer, useContext, memo} from 'react';

// 动态创建icon
export const iconCreate = (name) => {
    if (name != 'setTwoToneColor' && name != '') {
        return React.createElement(Icon && (Icon)[name], {
            style: {fontSize: '16px', color: '#d7a28f'}
        });
    }
}

// 表格头总数据集
const data = [
    {
        key: '1',
        tabel: 'route',
        hh: 12,
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
        hh: 12,
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
        hh: 12,
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

export const columnsData = JSON.parse(localStorage.getItem('adminColums'))==null?data: JSON.parse(localStorage.getItem('adminColums'));

const columsFun = (state, action) => {
    state = action;
    return state;
}

// 处理表格规则的钩子
export const useColums = (props) => {
    const [colData, setColData] = useReducer(columsFun, columnsData);

    /**
     * 匹配对应规则
     * @param { string } tabel -- 规则对应tabel值
     * @return { Array } [tabel下对应val, tabel所在索引]
     * */
    const screenColumns = (tabel) => {
        const arr = [];
        let index = 0;
        const arrData = [...colData];
        arrData.map((res, ind) => {
            if ( res.tabel == tabel ) {
                arr.push(res.val);
                index = ind;
            }
        });
        return [colData[index].val, index];
    }

    /***
     * 匹配不同render
     * @param { string } tabel -- 规则tabel
     * @param { string } key -- val数组下对应key
     * @param { void } call -- Action 渲染方法
     * @param { boolean } boo -- 是否深浅拷贝 默认深
     * @return { Array } 返回匹配并修改后的val
     */
    const screenRender = (tabel, key, call, boo = true) => {
        const [columns, index] = screenColumns(tabel);
        const arr = boo?JSON.parse(JSON.stringify(colData)): [...colData];
        if ( key != 'icon' ) {
            arr[1].val[1].render = (text) => iconCreate(text);
        }
        columns.map((res, ind) => {
            if ( res.key == key ) {
                arr[index].val[ind].render = call;
                setColData(arr);
            }
        })
        return arr[index].val;
    }

    return {
        colData,
        screenColumns,
        screenRender,
    }
}
