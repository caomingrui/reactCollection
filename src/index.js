// import React, {Suspense, useEffect, useState} from 'react';
import React, {Suspense, useEffect, useState, useReducer} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Router, Route, Switch, Redirect} from 'react-router';
import { createHashHistory } from 'history';

import { ParentCont } from './page/index';
import { HashRouter } from 'react-router-dom';
import routes, { isState } from "./route";
import "@/utils/tool"
import FrontendAuth from "@/utils/route"

import adminRoutes from "./route/adminRoute";
import { columnsData } from '@/utils/data/tabelColumns';
import { AppRoute, AppColumns, AppColor } from '@/utils/manage/ContextState'
import colorData from '@/utils/data/colorData'

const hashHistory = createHashHistory();

const ParentContMemo = React.memo(ParentCont);

const myReducer = (state, action) => {
    state = action;
    return state;
}

const routeMess = "[{\"path\":\"/User\",\"name\":\"User\",\"auth\":true,\"component\":{\"_payload\":{\"_status\":-1}},\"key\":\"2\",\"routePath\":\"test/A\",\"icon\":\"UserOutlined\",\"children\":[{\"path\":\"/User/Tom\",\"name\":\"Tom\",\"key\":\"21\",\"auth\":true,\"component\":{\"_payload\":{\"_status\":-1}},\"routePath\":\"test/A\",\"icon\":\"UserOutlined\"},{\"path\":\"/User/Bill\",\"name\":\"Bill\",\"key\":\"22\",\"auth\":true,\"component\":{\"_payload\":{\"_status\":-1}},\"routePath\":\"test/A\",\"icon\":\"UserOutlined\"},{\"path\":\"/User/Alex\",\"name\":\"Alex\",\"key\":\"23\",\"auth\":true,\"component\":{\"_payload\":{\"_status\":-1}},\"routePath\":\"test/A\",\"icon\":\"UserOutlined\"}]},{\"path\":\"/User/Tom\",\"name\":\"Tom\",\"key\":\"21\",\"auth\":true,\"component\":{\"_payload\":{\"_status\":-1}},\"routePath\":\"test/A\",\"icon\":\"UserOutlined\"}]";

// 全局数据共享
const CmrTest = (props) => {
    const [state, setState] = useReducer(myReducer, adminRoutes);
    const [tabelCol, setTabelCol] = useReducer(myReducer, columnsData);
    const [totalColor, setTotalColor] = useReducer(myReducer, colorData);// #8f92d7

    localStorage.setItem('adminRoute', JSON.stringify(state));
    if (localStorage.getItem('routeMess') == null) {
        localStorage.setItem('routeMess', routeMess);
    }
    return (
        <>
            <AppRoute.Provider value={[state, setState]}>
                <AppColumns.Provider value={[tabelCol, setTabelCol]}>
                    <AppColor.Provider value={[totalColor, setTotalColor]}>
                        { props.children }
                    </AppColor.Provider>
                </AppColumns.Provider>
            </AppRoute.Provider>
        </>
    )
}

ReactDOM.render(
    <div>
        <CmrTest>
            <HashRouter>
                <Suspense fallback={<div>123</div>}>
                    <FrontendAuth routerConfig={routes} isState={ isState }></FrontendAuth>
                </Suspense>
            </HashRouter>
        </CmrTest>
    </div>,
    document.getElementById('root')
)

reportWebVitals();
