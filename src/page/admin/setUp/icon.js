import React, {memo, useState, useEffect, useContext} from "react";
import Table, { MultiLayerTable } from '../template/table';
import styled from 'styled-components';
import { useColums, iconCreate } from '@/utils/data/tabelColumns';
import { AppRoute } from '@/utils/manage/ContextState';
import {Space} from "antd";
import Popout from '../template/popout';
import * as Icon from '@ant-design/icons';

const CheckIcon = styled.div`
  width: 100%;
  max-height: 250px;
  overflow-y: scroll;
  display: flex;
  flex-wrap: wrap;
  
  ::-webkit-scrollbar {
     display: none; /* Chrome Safari */
  }
    
    >.icon-fu {
      width: 40px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      
      >span {
        font-size: 22px !important;
        transition: .2s;
        cursor: pointer;
      }
    }
    
    >.icon-fu:hover {
      background: #53acff;
       
      >span {
        font-size: 24px !important;
        color: #5f64c5 !important;
      }
    }
`;
const ChangeFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 25px;
  
  >div {
    border: 1px dashed #6ae7cb;
    border-radius: 5px;
    padding: 6px;
  
    >span {
      font-size: 25px !important;
    }
  }
`;

export default memo((props) => {
    const {data, screenColumns, screenRender} = useColums();
    const [tabelData, setTabelData] = useState();
    const [routers, setRouters] = useContext(AppRoute); // 总 admin 路由数据
    const [bounState, setBounState] = useState(false); // 弹框状态
    const [lineIcon, setLineIcon] = useState({icon: ''}); // 当前选中icon 所有信息
    const [checkIcon, setCheckIcon] = useState('SettingOutlined'); // 选中的icon

    // 弹框确认按钮
    const bouncConfirm = () => {
        const arr = [...routers];
        function eachArr(list) {
            list.map((res, ind) => {
                if (res.key == lineIcon.key) {
                    res.icon = checkIcon;
                }
                else {
                    if (res.children) {
                        eachArr(res.children);
                    }
                }
            });
        }
        eachArr(arr);
        setRouters(arr);
        localStorage.setItem('adminRoute', JSON.stringify(arr));
        setBounState(false);
    }

    // 操作修改
    const ActionChange = (text) => {
        console.log(text);
        setLineIcon(text);
        setBounState(true);
    }

    // 操作栏删除
    const ActionDelete = (text, record, ind) => {
        const arr = [...routers];
        function eachArr(list) {
            list.map((res, ind) => {
                if (res.key == text.key) {
                    res.icon = 'LoadingOutlined';
                }
                else {
                    if (res.children) {
                        eachArr(res.children);
                    }
                }
            });
        }
        eachArr(arr);
        setRouters(arr);
        localStorage.setItem('adminRoute', JSON.stringify(arr));
    }

    // 表格操作栏
    const ActionTable = (text, record, ind) => {
        return (
            <>
                <Space size="middle">
                    <a onClick={() => {ActionChange(text)}}> Change </a>
                    <a onClick={() => {ActionDelete(text, record, ind)}}> Delete </a>
                </Space>
            </>
        )
    }

    useEffect(() => {
        console.log("icon组件挂载完成之后执行:");
        setTabelData('');
        setTimeout(() => {
            setTabelData(screenRender('icon', 'action', ActionTable));
        }, 200);
    },[]);

    return (
        <>
            <Popout popoutBut={[bouncConfirm]} popout={[bounState, setBounState]} width={600}>
                <CheckIcon>
                    {
                        Object.keys(Icon).map((res, ind) => {
                            if (ind < 782) {
                                return (
                                    <div key={res} className="icon-fu" onClick={() => {setCheckIcon(res)}}>
                                        {iconCreate(res)}
                                    </div>
                                )
                            }
                        })
                    }
                </CheckIcon>
                <ChangeFooter>
                    <div> { iconCreate(lineIcon.icon) } </div>
                    <span> * 变更为 * </span>
                    <div> { iconCreate(checkIcon) } </div>
                </ChangeFooter>
            </Popout>
            <MultiLayerTable columns={tabelData} data={routers}></MultiLayerTable>
        </>
    );
});
