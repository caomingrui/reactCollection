import React, { useState, useEffect, useReducer, useContext } from 'react';
import { Input, Button } from 'antd';
import './login/css/index.sass'
import {observer, publicState} from "../template/public-cont/myHooks";


import {BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import { createHashHistory } from 'history';


const hashHistory = createHashHistory();

const state = {
    isState: false,
    path: ''
}

const reducer = (state, action) => {
    return {...state, 'data': state[action.change] = action.data}
}

const AppContext = React.createContext({});

/**
 * 父容器
 * */
export const ParentCont  = (props) => {

    const [data, dispatch] = useReducer(reducer, state);

    const [route, setRoute] = useState(state);
    const [boolValue, setBoolValue] = useState(false);

    useEffect(() => {
        if(boolValue) {
            console.log("开始:")
        }
        setBoolValue(true);
    })

    useEffect(() => {
        console.log("组件挂载完成之后执行:")
    },[])

    useEffect(() => {
        if(boolValue){
            console.log("组件更新")
            setBoolValue(false);
        }
        setBoolValue(true);
    })

    useEffect(() => {
        if(boolValue) {
            console.log("依赖更新")
            setBoolValue(false);
        }
        setBoolValue(true);
    },[])

    console.log(route)

    return (
        <div className="parent-cont">

            <div className="cont">
                <div className="cont-left">
                </div>
                <div className="cont-right">
                    <div className="parent-cont-left"></div>
                    <div className="parent-cont-right"></div>
                    <AppContext.Provider value={{ path: 'haha' }}>
                        <Router history={ hashHistory }>
                           <Switch>
                               <Route path="/login" component={ Login }  exact></Route>

                               <Route path="/login" component={ Login } ></Route>

                               <Route path="/Register" component={ Register }  ></Route>
                            </Switch>
                        </Router>
                    </AppContext.Provider>
                </div>
            </div>
        </div>
    )
}

// 登录组件
const Login = () => {
    const [boolValue, setBoolValue] = useState(false);
    const { path } = useContext(AppContext);

    useEffect(() => {
        if(boolValue) {
            console.log("子组件开始 ----")
            setBoolValue(false);
        }
        setBoolValue(true);
    })

    useEffect(() => {
        console.log("子组件挂载完成之后执行 ----")
    },[])

    useEffect(() => {
        if(boolValue){
            console.log("子组件组件更新 ----")
            setBoolValue(false);
        }
        setBoolValue(true);
    })

    useEffect(() => {
        if(boolValue) {
            console.log("子组件依赖更新 ----")
            setBoolValue(false);
        }
        setBoolValue(true);
    },[path])


    return (
        <div className="login">
            <label htmlFor="">Login</label>
            <div>
                <Input placeholder="Basic usage" />
            </div>
            <div>
                <Input placeholder="Basic usage" />
            </div>
            <div>
                <Link to="/Register#/" style={{color:'black'}}>
                    <span>注册</span>
                </Link>

                <Link to="/Register#/" style={{color:'black'}}>
                    <span>忘记密码？</span>
                </Link>
            </div>
            <div>
                <span></span>
                    <Button type="primary" shape="round" size="large">
                        <Link to="/home#/" style={{color:'black'}}>LOGIN</Link>
                    </Button>
                <span></span>
            </div>
        </div>
    )
}

// 注册组件
class Register extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log('第一次开始完成虚拟dom， render结束后内存中有了虚拟dom')

        return (
            <div className="register">
                <label htmlFor="">register { state.path }</label>
                <div>
                    <Input placeholder="Basic usage" />
                </div>
                <div>
                    <Input placeholder="Basic usage" />
                </div>
                <div>
                    <span></span>
                    <Link to="/login#/" style={{color:'black'}}>
                        <span>已有账号登录？</span>
                    </Link>
                    <span></span>
                </div>
                <div>
                    <span></span>
                    <Button type="primary" shape="round" size="large">
                        Create Account
                    </Button>
                    <span></span>
                </div>
            </div>
        )
    }
}
