import React, { useState } from 'react';
import PublicDatas from "../../utils/publicData";
import './public-cont.sass'
import axios from 'axios'
import { states } from "../../utils/publicData";
import { Router, Route, Redirect, Switch } from 'react-router';
import { createHashHistory } from 'history';
import Homes from "../../page/home";
import Test from "../../test";
import App from "../../App";

import  HooksTest, { HooksTest2, HooksTest3, HooksTest4, HooksTest5, HooksTest6, HooksTest7, HooksTest8 }  from './hook'

import { ParentCont } from '../../page/index'

export const AppContext = React.createContext({});

const hashHistory = createHashHistory();

// class But extends PublicDatas {
//     constructor(props) {
//         super(props);
//     }
//
//     associat = () => {
//         this.props.parent.getHomeMsg(this, '');
//     }
//
//     render() {
//         let but;
//         if (this.getData('lineData') == "cao") {
//             return (
//                 but = <button >发送请求</button>
//             )
//         }
//         else {
//             return (
//                 but = <button>不发送</button>
//             )
//         }
//         return (
//             <div>
//                 { but }
//             </div>
//         )
//     }
// }

function click() {
    console.log('hahahah')
    axios.get('/data/users')
        .then(res => {
            console.log(res);

        })
}

class But2 extends PublicDatas {
    constructor(props) {
        super(props);
        console.log(props)
        let da = ''
    }

    but2Click = () => {
        this.props.parent.getBut2Msg(this, '');
    }

    requestTest = () => {
        axios.get('/data/users')
            .then(res => {
                console.log(res);
                this.da = res;
                this.props.parent.da = res.data;
                console.log(this.props)
            })
    }

    render() {
        return (
            <div onClick={ this.but2Click }>
                <button onClick={ this.requestTest }>请求2号</button>
            </div>
        )
    }
}


class But3 extends PublicDatas {
    constructor(porps) {
        super(porps);
        console.log(porps)
    }

    render() {
        return (
            <button onClick={ this.props.parent.testClick }>
                测试
            </button>
        )
    }
}

function But(props) {

    console.log(props)
    let but;
    if (props.lineData == "cao") {
        but = <button onClick={click}>发送请求</button>
    }
    else {
        but = <p>不发送</p>
    }

    return (
        <div>
            { but }
        </div>
    )
}

function BuTest(props) {

    function abc() {
        console.log(props)
        props.history.push('/App');
        console.log('我应该跳转了吧哈哈哈')
    }

    return (
        <button onClick={abc}> 点一下玩一年 </button>
    )
}

let matchList = {
    'Homes': Homes,
    'test': Test,
    'App': App
}

states.routeList.map(res => {
    for (let i in matchList) {
        if (res.com === i) {
            res.cont = matchList[i]
        }
    }
})

function SlotTest(props) {
    console.log('广告')
    console.log(props)
    console.log('广告')
    return (
        <div>
            <p>我是插槽哦</p>
            { props.children[1] }
            { props.children.filter(item => item.ref === 'title') }
        </div>
    )
}

class PublicCont extends PublicDatas {
    constructor(props) {
        super(props);
        console.log('publicCont---------------------')
        console.log(props)
        console.log('publicCont---------------------')
        this.list = [{'val': 'haha', 'key': 'cao'}, {'val': 'haha', 'key': 'ming'}, {'val': 'haha', 'key': 'rui'}];
        this.da = '';
        this.name = '我是Hook - useContext 传值 ... 嘿嘿'
    }


    associat = () => {
        this.props.parent.getHomeMsg(this, '');
    }

    getBut2Msg = (result, msg) => {
        this.setState({
            state: msg
        })
    }


    testClick = () => {
        let obj = [
            {'path': '/', 'com': 'Homes', 'cont': ''},
            {'path': '/test', 'com': 'test', 'cont': ''},
            {'path': '/Homes', 'com': 'Homes', 'cont': ''}
        ]
        this.setData('routeList', obj);
        console.log(this.getData('routeList'));
    }

    render() {
        return (
            <div className='public-cont' onClick={ this.associat }>
                123123{ this.getData('lineData') }
                <p >数据已到: { this.da.name }</p>
                <But lineData={ this.getData('lineData') }></But>
                <But2 parent = { this }></But2>
                <But3 parent = { this }></But3>
                <div onClick={ () => {this.setData('testRouteInter', false)}}>修改状态</div>
                <SlotTest>
                    <a href="">船新版本等你开启</a>
                    <div onClick={ () => {this.name = '装备不花一分钱，开局一只狗，装备全靠捡'} }>开局一只狗</div>
                    <a href="">装备全靠捡</a>
                    <div ref="title" name="title">具名插槽 - 诶嘿 - 就是我</div>
                </SlotTest>

                <p>------------ 分割线 ----------------</p>
                <HooksTest></HooksTest>


                <AppContext.Provider value={{
                    username:  this.name
                }}>
                    <HooksTest2></HooksTest2>
                    <HooksTest3></HooksTest3>
                    <HooksTest4></HooksTest4>
                    <HooksTest5></HooksTest5>
                    <HooksTest6 cont={ this }></HooksTest6>
                    <HooksTest7 ></HooksTest7>
                    <HooksTest8></HooksTest8>
                </AppContext.Provider>

                <Router history={ hashHistory }>
                    <Switch>
                        <Route path="/login" component={ ParentCont }  exact></Route>
                    {
                        states.routeList.map(res => (
                        <Route path={ res.path } component={ res.cont }  key={ res.path } exact></Route>
                        ))
                    }

                     <Route path="/testjump" render={()=> this.getData("testRouteInter")?<BuTest></BuTest>:<Redirect to="/homeCont"/>}/>
                     <Redirect from="/*" to="/homeCont"/>
                     {/*<Route path="/test" component={ Test }></Route>*/}
                     {/*<Route path="/Home" component={ Homes }></Route>*/}
                </Switch>
             </Router>

            </div>
        )
    }
}

export default PublicCont