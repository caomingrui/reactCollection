import React, {memo, useState, useEffect, useContext, useRef} from "react";
import { AppRoute, AppColor } from '@/utils/manage/ContextState';
import styled from 'styled-components';
import Table, { MultiLayerTable } from '../template/table'
import {Space, Button, Select, Form, Input, Col, Row, message} from "antd";

// 颜色对应区域名称
const colorArea = [
    {
        key: 'navLeftColor',
        name: '头部logo 区域'
    },
    {
        key: 'sidebarColor',
        name: '侧边栏整体颜色'
    },
    {
        key: 'sidebarAnColor',
        name: '侧边栏展开颜色'
    },
    {
        key: 'checkBarColor',
        name: '选中侧边栏颜色'
    },
    {
        key: 'navColor',
        name: '头部区域颜色'
    },
    {
        key: 'breadCrumbsColor',
        name: '面包屑区域颜色'
    },
    {
        key: 'contentColor',
        name: '主体内容区域颜色'
    }
];

const ChangeColor = styled.div` 
    width: 23%;
    height: 200px;
    padding: 20px;
    background: ${ props => props.color };
    margin-bottom: 20px;
    color: #333333;
    font-size: 20px;
    box-shadow:  4px 4px 9px ${ props => props.name==='contentColor'?'#ffffff' :props.color };
`;

// 匹配名称
const matchName = (key) => {
    let name = '';
    colorArea.map(res => {
        if (res.key === key) {
            name = res.name;
        }
    })
    return name;
}

export default memo(() => {
    const [totalColor, setTotalColor] = useContext(AppColor);

    return (
        <>
            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                {
                    Object.keys(totalColor).map((res, ind) => {
                        return (
                            <ChangeColor key={res} color={totalColor[res]} name={colorArea[ind].key}>
                                { matchName(res) }
                                <input type="color" value={totalColor[res]} onChange={(e)=> {
                                    let obj = JSON.parse(JSON.stringify(totalColor));
                                    obj[res] = e.target.value;
                                    setTotalColor(obj);
                                    localStorage.setItem('colorData', JSON.stringify(obj));
                                }}/>
                            </ChangeColor>
                        )
                    })
                }
            </div>
        </>
    );
});
