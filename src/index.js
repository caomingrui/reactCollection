// import React, {Suspense, useEffect, useState} from 'react';
import React, {Suspense, useEffect, useState, useReducer} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import Homes, {Home} from "./page/home";
import reportWebVitals from './reportWebVitals';
import Test from "./test";


import { Home } from './page/home/index'

import { states } from "./utils/publicData";

import {Router, Route, Switch, Redirect} from 'react-router';
import { createHashHistory } from 'history';

import { ParentCont } from './page/index'
import {NotFound} from "./page/404/notFound";
import { Ind } from "./page/collectPlay";

import { renderRoutes } from 'react-router-config'
import { HashRouter } from 'react-router-dom'
import routes, { isState } from "./route";
import "@/utils/tool"
import FrontendAuth from "@/utils/route"

import adminRoutes from "./route/adminRoute";
import { columnsData } from '@/utils/data/tabelColumns';
import {AppContext} from "./page/admin";
import { AppRoute, AppColumns } from '@/utils/manage/ContextState'


const hashHistory = createHashHistory();

const ParentContMemo = React.memo(ParentCont);

const myReducer = (state, action) => {
    state = action;
    return state;
}

const routeMess = "[{\"path\":\"/User\",\"name\":\"User\",\"auth\":true,\"component\":{\"_payload\":{\"_status\":-1}},\"key\":\"2\",\"routePath\":\"test/A\",\"icon\":\"UserOutlined\",\"children\":[{\"path\":\"/User/Tom\",\"name\":\"Tom\",\"key\":\"21\",\"auth\":true,\"component\":{\"_payload\":{\"_status\":-1}},\"routePath\":\"test/A\",\"icon\":\"UserOutlined\"},{\"path\":\"/User/Bill\",\"name\":\"Bill\",\"key\":\"22\",\"auth\":true,\"component\":{\"_payload\":{\"_status\":-1}},\"routePath\":\"test/A\",\"icon\":\"UserOutlined\"},{\"path\":\"/User/Alex\",\"name\":\"Alex\",\"key\":\"23\",\"auth\":true,\"component\":{\"_payload\":{\"_status\":-1}},\"routePath\":\"test/A\",\"icon\":\"UserOutlined\"}]},{\"path\":\"/User/Tom\",\"name\":\"Tom\",\"key\":\"21\",\"auth\":true,\"component\":{\"_payload\":{\"_status\":-1}},\"routePath\":\"test/A\",\"icon\":\"UserOutlined\"}]";

const CmrTest = (props) => {
    const [state, setState] = useReducer(myReducer, adminRoutes);
    const [tabelCol, setTabelCol] = useReducer(myReducer, columnsData);

    localStorage.setItem('adminRoute', JSON.stringify(state));
    if (localStorage.getItem('routeMess')==null) {
        localStorage.setItem('routeMess', routeMess);
    }
    return (
        <>
            <AppRoute.Provider value={[state, setState]}>
                <AppColumns.Provider value={[tabelCol, setTabelCol]}>
                    { props.children }
                </AppColumns.Provider>
            </AppRoute.Provider>
        </>
    )
}

ReactDOM.render(
    <div>
        {/*<Router history={ hashHistory }>*/}
        {/*    <Switch>*/}
        {/*        /!*<Route path="/login/:value" component={ ParentCont }  exact></Route>*!/*/}
        {/*        /!*<Route path="/a" component={ Test }  exact></Route>*!/*/}
        {/*        /!*<Route path="/b" component={ Homes }  exact></Route>*!/*/}
        {/*        /!*<Route path="/home" component={ Home }  ></Route>*!/*/}
        {/*        <Route path="/col" component={ Ind } exact></Route>*/}
        {/*        <Route path="/404" component={ NotFound }  ></Route>*/}
        {/*        <Redirect from="/*" to="/404"/>*/}
        {/*    </Switch>*/}
        {/*</Router>*/}
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
