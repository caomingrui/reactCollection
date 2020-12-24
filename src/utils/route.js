import React, { useState, useEffect, useReducer, useContext } from 'react';
import { Route, Redirect } from "react-router-dom";
import {renderRoutes} from "react-router-config";
import routes from "../route";
import { useHistory } from "react-router-dom";

export const AppContext = React.createContext({});

// 路由拦截
export default (props) => {
    // const [state, setState] = useState(props.routerConfig)

    const { state, getToken } = useRouteLogic();

    let history = useHistory();

    return (
        <>
            <AppContext.Provider value={[ state, getToken ]}>
                {/*<p onClick={() => { getToken();history.push('/A'); }}> 莫挨老子 - 跳转 - 测试版1.0.0 </p>*/}
                {/*<p onClick={() => { getToken();history.push('/A'); }}> 莫挨老子 - 跳转 - 测试版1.0.0 </p>*/}
                { renderRoutes(state) }
            </AppContext.Provider>
        </>
    )
}

// 路由拦截小勾子 - 待改进
const useRouteLogic = () => {

    const [state, setState] = useState(routes);

    const getToken = () => {
        const isToken = localStorage.getItem('token');
        console.log(isToken);
        if (isToken == 'false') {
            const list = [...state];
            let arr = [];
            list.map((res, ind) => {
                if (!res.auth) {
                    arr.push(list.slice(ind, ind + 1)[0]);
                }
            })
            setState(arr);
        }
    }

    return {
        state,
        getToken
    }
}
