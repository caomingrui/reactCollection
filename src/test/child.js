import React from 'react';
import PropTypes from 'prop-types';
import PublicDatas from "../utils/publicData";
const style1 = {
    background:'red',
    width:'200px',
    height:'200px',
    color: 'blue'
}

function ChildTest(prs) {
    return <div>123{ prs.color }123</div>
}

export class Child1 extends PublicDatas {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                { this.getData('name') }
                多个{ this.getData(['gg', 'aa']) }
                <p onClick={ () => {this.setData('name', 'caocao')}}>测试： 莫挨老子2.0</p>
                <div ></div>
            </div>
        )
    }
}

export class Child2 extends PublicDatas {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                { this.getData('name') }
                <p onClick={ () => {this.setData(['gg', 'aa'], 'mingming'); console.log(this.getData('name')) }}>测试： 莫挨老子2.1</p>
                <div ></div>
            </div>
        )
    }
}



class Child3 extends PublicDatas {
    constructor(props) {
        super(props);

    }

    bindInput = (e) => {
        // this.setData('name', e.target.value);
        // this.setState({
        //     name: e.target.value,
        // })

        console.log('aa')

            this.setData('name', e.target.value);

    }

    render() {
        return (
            <div>
                <p>aaaaaaa{ this.getData('lineData') }</p>
                <p onClick={ () => {this.setData('name', 'caocao')} }>快点点老子</p>
                <p onClick={ () => {this.setData('name', 'caocao')}}>测试： 莫挨老子2.2</p>
                <input type="text" onInput={this.bindInput} value={ this.states.text } />
            </div>
        )
    }
}

class Child extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            msg: '指哈哈哈哈哈'
        }
    }

    testClick = () => {
        this.props.parent.getChildrenMsg(this, this.state.msg);
    }

    render() {
        return (
            <div onClick={ this.testClick } style={ style1 }>
                <ChildTest color={style1.color}/>
                <Child1></Child1>
                <Child2></Child2>
                <Child3></Child3>
                <p> {this.props.arr.name} </p>
                子组件</div>
        )
    }
}

export default Child;

