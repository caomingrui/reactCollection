import React, { useState , useContext, useReducer, useEffect } from 'react';
import PublicDatas from "../../utils/publicData";
import axios from 'axios'
import { AppContext } from './public-cont'
import { useRequestHooks, useClickRequest, publicState, reducer, initState, initReducer, requestAllTest } from './myHooks'
import { Form, Input, Button, Checkbox, Modal, Space } from 'antd'
import 'antd/dist/antd.css'

export default class HooksTest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cont: 0
        }
    }

    hookClick = () => {
        this.state.cont ++ ;
        this.setState({
            cont: this.state.cont
        })
    }

    render() {
       return (
           <div onClick={ this.hookClick }>hook - test - { this.state.cont }</div>
       )
    }
}


export function HooksTest2() {

    const [ cont, setCont ] = useState(0);
    const { username } = useContext(AppContext);

    return (
        <div onClick={ () => setCont( 2 ) }>hook - test - { cont } - 2??{ username }</div>
    )
}

export function HooksTest3() {

    const [ cont, setCont ] = useState(0);
    const { username } = useContext(AppContext);

    return (
        <div onClick={ () => setCont( 2 ) }>hook - test - { cont } - 3? { username }</div>
    )
}

const fun = (state, action) => {
    console.log(state);
    console.log(action)
    state.da = action.da
    return state
}


export function HooksTest4() {
    const [state, dispatch] = useReducer(fun, { da: 'hah' });
    console.log(state)
    console.log(state.da)
    return (
        <div >
            <p>useReducer()：action 钩子</p>
            <button onClick={() => dispatch({ da: 'xixi' })}> -点这里 useReducer- { state.da } </button>
        </div>
    )
}

export function HooksTest5() {

    const [ data, setData ] = useState();

    let da = '我是值哦';
    useEffect(() => {
        console.log(da);
        axios.get('/data/users')
            .then(res => {
                console.log(res);
                setData(res.data);
            })
    }, [da])

    return (
        <div >
            <p>useEffect 副作用钩子</p>
            <button > -点这里 useEffect-  </button>
        </div>
    )
}

export function HooksTest6(props) {

    const [ state, data ] = useRequestHooks('caomingrui', '/data/users');
    console.log(props);
    return (
        <div >
            <p>自个的hooks</p>
            <button > -点这里 useEffect-  - { state }</button>
        </div>
    )
}

export function HooksTest7() {

    const [ state, data ] = useClickRequest('/data/users');
    console.log(data)
    const clickTest7 = () => {
        state('/data/users')
    }
    return (
        <div >
            <p>自个的hooks2.0123123</p>
            <button onClick={clickTest7}> -点这里 HooksTest7- </button>
        </div>
    )
}

const TodosDispatch = React.createContext(null);
const todosReducer = (state, action) => {
    console.log('测试plush')
    console.log(action)
    state = action;
    return state
}

export function HooksTest8() {
    const [todos, dispatch] = useReducer(todosReducer);
    console.log(todos)
    return (
        <div>
            值 -- {  } --
            <TodosDispatch.Provider value={dispatch}>
                <Child1 todos={todos} />
                <Child2 todos={todos}/>
            </TodosDispatch.Provider>
        </div>
    )
}

function Child1(props) {
    const dispatch = useContext(TodosDispatch);
    console.log('hooks ----------------');
    console.log(dispatch);
    console.log('hooks ----------------');

    function handleClick() {
        dispatch({ type: 'add', text: 'hello' });
    }
    return  (
        <div onClick={handleClick}>子组件1号</div>
    )
}



const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const Demo = (props) => {
    const onFinish = values => {
        console.log('Success:', values);
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    if (!props.state) return null
    return (
        <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

function Info(props) {
    if (props.state) {
        return (
            <div>
                我出来了
            </div>
        )
    }
    else {
        return (
            <div>我消失了</div>
        )
    }
}

function Child2(props) {
    console.log(props)
    const [state, setState] = useState(false);

    return  (
        <div>
            <Demo state={state}></Demo>
            <Button type="primary" onClick={ () => setState( !state ) } ghost>
                Primary
            </Button>
            <Info state={state}></Info>
            <Child2.ChildChild></Child2.ChildChild>
            <ChildStore></ChildStore>
        </div>
    )
}

function ChildStore() {
    const [state, dispatch] = useReducer(reducer, publicState);
    console.log(state)

    return (
        <div>我是儿砸2.0 --- 测试 <button onClick={ () => {dispatch({type: 'name', data: '曹明睿'})} }> store </button> - { publicState.name } - </div>
    )
}

const contextText = React.createContext({});
function Module1() {
    const [state, dispatch] = useReducer(reducer, publicState);
    const [da, set] = useState({name: publicState.name});
    const test = () => {
        requestAllTest('/data/users')
            .then(res => {
                console.log(res);
                set( res.data )
            })
    }

    return (
        <div>
            <p>我是组件1</p>
            <button onClick={ test }>组件1 { publicState.name }</button>
            <p>----------------</p>
            <contextText.Provider value={ [dispatch, da] }>
                <Module2 da={ state }></Module2>
                <Module3 da={ state }></Module3>
            </contextText.Provider>
        </div>
    );
}

function Module2() {
    const [dispatch, state] = useContext(contextText);

    const changeClick = () => dispatch({type: 'name', data: '既实惠还管饱'})

    return (
        <div>
            <p>我是组件2 { state.name }  <button onClick={ changeClick }>change</button> { publicState.name }</p>
        </div>
    );
}

function Module3() {

    return (
        <div>
            <p>我是组件3</p>
        </div>
    );
}

Child2.ChildChild = () => {

    return (
        <div>我是儿砸 --- 测试 <Module1></Module1> </div>
    )
}