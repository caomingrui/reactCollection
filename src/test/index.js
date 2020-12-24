import React from 'react';
import Child from "./child";
import PropTypes from 'prop-types';
import PublicData from "./publicData";
import PublicDatas from "../utils/publicData";
import { Child1 } from "./child"
import { Child2 } from "./child";

class But1 extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <button disabled>按钮1</button>
        )
    }
}

class But2 extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <button disabled>按钮2</button>
        )
    }
}

class Test2 extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let button;
        if (this.props.showState) {
            button = <But1></But1>
        }
        else {
            button = <But2></But2>
        }

        return (
            <div>
                { button }
            </div>
        )
    }
}

class Child5 extends PublicDatas {
    constructor(props) {
        super(props);

        this.a = this.getData('name')
    }

    render() {
        return (
            <div>
                { this.getData('name') }
                多个{ this.getData(['gg', 'aa']) }
                <p onClick={ () => {this.setData('name', 'caocao'); this.setState({a: this.getData('name')})}}>测试： 莫挨老子2.5</p>
                <div ></div>
            </div>
        )
    }
}

class Child6 extends PublicDatas {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                { this.getData('name') }
                <p onClick={ () => {this.setData('name', 'mingming'); console.log(this.getData('name')) }}>测试： 莫挨老子2.1</p>
                <div ></div>
            </div>
        )
    }
}

class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chilsMsg: ''
        }
        this.list = [{'name': '老王', 'old': '20'}, {'name': '老王吧', 'old': '22'},];
        this.showState = true;
    }

    getChildrenMsg = (result, msg) => {
        this.setState({
            data: msg
        })
    }

    render() {
        return (
            <div>嘤嘤嘤 + { this.props.name }
                <div>
                    { this.state.chilsMsg }
                    <Child parent = { this }  arr = {this.list[0]}></Child>
                    {
                        this.list.map(res => {
                            return (
                                <p key={res.name}> {res.name} == {res.old} </p>
                            )
                        })
                    }
                    <p></p>
                    <p></p>
                    { this.showState == true ? "true":"false" }
                    <div onClick={ () => {this.showState = !this.showState; this.setState({  data: this.showState });} }>莫挨老子</div>
                    {
                        this.showState?<But1/>: <But2></But2>
                    }
                    <p>--------------</p>
                    <Test2 showState={this.showState}></Test2>
                </div>
                测试:
                {
                    // <div onClick={ () => {PublicData()}}>莫挨老子2.0</div>
                }
                <Child5/>
                <Child6/>
                <Child1></Child1>
                <Child2></Child2>
            </div>
        )
    }
}

Test.propTypes = {
    name: PropTypes.string
}

Test.defaultProps = {
    name: '曹明睿'
}

export default Test;
