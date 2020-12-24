import React, { useState, useEffect, useReducer, useContext } from 'react';
import {
    Table,
    Switch,
    Space,
    Tag,
    Modal,
    Button,
    Card,
    Col,
    Row,
    message,
    Drawer,
    Form,
    Input,
    Select,
    DatePicker
} from 'antd';
import 'antd/dist/antd.css'
import moment from 'moment';

import {dataList as list} from '../../utils/data/collectPlay'
import {getStorage} from "../../utils/myHooks";

import { AppContext, DetailedData, footer, Option, RangePicker, ChildCont } from "./index"
import { setStorage } from "../../utils/myHooks";


const stateData = {
    currentData: {da: '', TimeTabel: [{}]}
};

const todosReducer = (state, action) => {
    console.log(state)
    console.log(action)
    state = action;
    console.log(state)
    return {
        ...state
    };
}

// 表格内容
export const TreeData = (props) => {
    const [checkStrictly, setCheckStrictly] = React.useState(false);
    const [timeDate, setTimeDate] = useContext(AppContext);
    const [detailTableData, setDetailTableData] = useContext(ChildCont);
    const [boolValue, setBoolValue] = useState(false);
    const [visible, setVisible] = useState(false);// 弹框状态

    const [state, setState] = useReducer(todosReducer, {da: '123', TimeTabel: [{type: 'red', child: [{}, {}]}]});
    // const [state, setState] = useState({da: '123', TimeTabel: [{}]}); 弹框组件 取不到值 供组件生命周期赋值测试用
    const [DrawerState, DrawerSetState] = useState(false);
    const [changeData, setChangeData] = useState(null);
    const [ind, setInd] = useState(); // 当前列表点击索引

    // 删除单条数据
    const delect = (index) => {
        const data = [...timeDate]; // 不能直接操作 timeDate 哦
        data.splice(index, 1);
        props.article(data);
    }

    // 查看详细单条数据
    const view = (text) => {
        // setState('');
        setState(text);
        setVisible(true);
    }

    // 修改
    const changeTable = (text, index) => {
        console.log(text);
        setChangeData(text);
        setInd(index);
        DrawerSetState(true);
    }

    const syncMess = (text) => {
        console.log(text)
        props.test({
            value: moment(text),
            selectedValue: moment(text),
        });
    }

    const columns = [
        {
            title: 'Time',
            dataIndex: 'da',
            key: 'da',
            render: text => <a onClick={() => { syncMess(text) }}>{text}</a>,
        },
        {
            title: 'Child',
            dataIndex: 'action',
            key: 'action',
            render: (text, record, index) => {
                return (
                    <a onClick={() => {
                        console.log(record.TimeTabel)
                        // props.detailTable(record.TimeTabel)
                        setDetailTableData('')
                        setDetailTableData(record.TimeTabel)
                    }}> 莫挨老子 </a>
                )
            }
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        // {
        //     title: 'Tags',
        //     key: 'tags',
        //     dataIndex: 'tags',
        //     render: tags => (
        //         <>
        //             {tags.map(tag => {
        //                 let color = tag.length > 5 ? 'geekblue' : 'green';
        //                 if (tag === 'loser') {
        //                     color = 'volcano';
        //                 }
        //                 return (
        //                     <Tag color={color} key={tag}>
        //                         {tag.toUpperCase()}
        //                     </Tag>
        //                 );
        //             })}
        //         </>
        //     ),
        // },
        {
            title: 'Action',
            key: 'action',
            render: (text, record, index) => (
                <Space size="middle">
                    <a>Invite {record.name}</a>
                    <a onClick={() => { view(text) }}> View </a>
                    <a onClick={() => { changeTable(text, index) }}> Change </a>
                    <a onClick={() => { delect(index) }}>Delete</a>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        if(boolValue) {
            console.log("开始:")
            console.log(timeDate)
            setBoolValue(false);
        }
        setBoolValue(true);
    })

    useEffect(() => {
        console.log("组件挂载完成之后执行:")
        console.log(timeDate)
    },[])

    useEffect(() => {
        if(boolValue){
            console.log("组件更新")
            console.log(timeDate)
            setBoolValue(false);
        }
        setBoolValue(true);
    })

    useEffect(() => {
        if(boolValue) {
            console.log("----------------依赖更新-----------------")
            console.log(timeDate)
            props.article(timeDate)
            setBoolValue(false);
        }
        setBoolValue(true);
    },[timeDate])

    return (
        <div>
            <Model visible={visible} setVisible={setVisible} dataList={state}></Model>
            <Table columns={columns} dataSource={timeDate} rowKey={record => record.da} />
            <DrawerForm state={ DrawerState } setStates={ DrawerSetState } setTimeDate={ setTimeDate }
                        directionTyle="left" current={changeData} timeDate={ timeDate } index={ ind }></DrawerForm>
        </div>
    );
}

// 修改抽屉
// 抽屉填写表单
export class DrawerForm extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);

    }
    state = {
        visible: this.props.state,
        config: {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
        },
        rangeConfig: {
            rules: [{ type: 'array', required: true, message: 'Please select time!' }],
        },
        placement: this.props.directionTyle
    };

    componentWillMount() {
        // console.log('Component WILL MOUNT!')
        console.log(this.formRef.current)
    }
    componentDidMount() {
        // console.log('Component DID MOUNT!')
        console.log(this.formRef.current)
    }
    componentWillReceiveProps(newProps) {
        // console.log('Component WILL RECEIVE PROPS!')
        console.log(this.formRef.current)
    }
    shouldComponentUpdate(newProps, newState) {
        // console.log(this.formRef.current)
        return true;
    }
    componentWillUpdate(nextProps, nextState) {
        // console.log('Component WILL UPDATE!');
        console.log(this.formRef.current)
    }
    componentDidUpdate(prevProps, prevState) {
        // console.log('Component DID UPDATE!')
        if (this.formRef.current != null) {
            this.assignmentForm();
        }
    }
    componentWillUnmount() {
        // console.log('Component WILL UNMOUNT!')
        console.log(this.formRef.current)
    }

    getOwner = (val) => {
        if (val == 'green') {
            return '100%';
        }
        else if (val == 'blue') {
            return '75%';
        }
        else if (val == 'red') {
            return '50%';
        }
        else {
            return '0%'
        }
    }

    toGetOwner = (val) => {
        alert(val)
        if (val == '100%') {
            return 'green';
        }
        else if (val == '75%') {
            return 'blue';
        }
        else if (val == '50%') {
            return 'red';
        }
        else {
            return 'gray'
        }
    }

    // 表单数据回显
    assignmentForm = () => {
        let cur = this.props.current;
        let data = {
            name: cur.TimeTabel[0].child[0].cont,
            timeDifference: [moment(cur.TimeTabel[0].timeStart), moment(cur.TimeTabel[0].timeEnd)],
            owner: this.getOwner(cur.TimeTabel[0].type),
            description: cur.TimeTabel[0].child[1].cont,
            time: moment(cur.da)
        }
        this.formRef.current.setFieldsValue( data );
    }

    // 测试生命周期监听状态阶段
    // testData = () => {
    //     console.log(this.formRef.current);
    // }

    onClose = () => {
        this.setState({
            value: ''
        })
        this.props.setStates(false)
        this.formRef.current.resetFields()
    };

    // 表单提交
    onSubmint = () => {
        console.log('我提交了？？');
        let data = [...this.props.timeDate];
        let path = this.formRef.current.getFieldsValue();
        const time = path.time.format('YYYY-MM-DD'); // 创建时间
        const detailed_time = path.time.format('YYYY-MM-DD HH:mm:ss');// 详细时间
        let changeState = false;
        let changeData;

        let TimeTabel = {};

        TimeTabel = {'type': path.owner, 'child': [], 'timeStart': path.timeDifference[0].format('YYYY-MM-DD HH:mm:ss'),
            'timeEnd': path.timeDifference[1].format('YYYY-MM-DD HH:mm:ss'), 'time': detailed_time}; // 一层
        const cont = {'cont': path.name};
        TimeTabel.child.push(cont); // 二层时间节点 --- 后续优化
        if (path.description) { // 存在备注处理 -- 后续优化
            const contObj = {}
            contObj.cont = path.description;
            TimeTabel.child.push(contObj);
        }
        let obj = {da: time, TimeTabel: [TimeTabel]};

        data.splice(this.props.index,1, obj)

        console.log(data)
        this.props.setTimeDate(data);
        console.log(this.props.timeDate)
        this.onClose()
    }

    // name input chang data
    cahngeDataName = (e) => {
        this.setState(() => ({
            value: e.target.value
        }))
    }

    // 表单提交
    onCheck = async () => {
        console.log(this.refs.addForm)
        try {
            const values = await this.formRef.current.validateFields();
            console.log('Success:', values);
            console.log('提交校验成功');
            this.onSubmint();
            message.success('提交校验成功');
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            console.log('提交校验失败');
            message.error('提交校验失败');
        }
    }

    render() {
        // if (this.props.state) {
        //     console.log('哦豁我出来了')
        //     this.testData()
        // }
        return (
            <>
                <Drawer
                    title="Create a new account"
                    width={720}
                    onClose={this.onClose}
                    visible={this.props.state}
                    placement={this.state.placement}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Form layout="vertical" hideRequiredMark ref={this.formRef} initialValues={{'name': 'hahah'}}>
                        <Row gutter={16}>
                            <Col span={16}>
                                <Form.Item
                                    name="name"
                                    label="Play one"
                                    rules={[{ required: true, message: 'Please enter user name' }]}
                                >
                                    <Input placeholder="Please enter complete content" onChange={this.cahngeDataName} value={this.state.value}
                                           ref={myInput=>this.myInput=myInput} />
                                </Form.Item>
                            </Col>
                            <Col span={16}>
                                <Form.Item name="timeDifference" label="RangePicker[showTime]" {...this.state.rangeConfig}>
                                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={16}>
                                <Form.Item
                                    name="owner"
                                    label="Owner"
                                    rules={[{ required: true, message: 'Please select an owner' }]}
                                >
                                    <Select placeholder="Please select an owner">
                                        <Option value="green">100%</Option>
                                        <Option value="blue">75%</Option>
                                        <Option value="red">50%</Option>
                                        <Option value="gray">0%</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="description"
                                    label="Description"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'please enter url description',
                                        },
                                    ]}
                                >
                                    <Input.TextArea rows={4} placeholder="please enter url description" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="time" label="DatePicker[showTime]" {...this.state.config}>
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                                </Form.Item>

                            </Col>
                        </Row>
                        <div style={footer}>
                            <div></div>
                            <div>
                                <Button onClick={this.onClose} style={{marginRight: '20px'}}>
                                    Cancel
                                </Button>
                                <Button htmlType="submit" type="primary" onClick={this.onCheck} style={{marginRight: '20px'}}>
                                    Submit
                                </Button>
                            </div>
                        </div>

                    </Form>
                </Drawer>
            </>
        );
    }
}


// 表格弹框
const Model = (props) => {
    console.log(props.dataList)
    const [state, setState] = useState(props.dataList);
    const [boolValue, setBoolValue] = useState(false);

    useEffect(() => {
        if(boolValue) {
            console.log("开始tk:")
            setBoolValue(false);
        }
        setBoolValue(true);
    })

    useEffect(() => {
        console.log("组件挂载完成之后执行tk:")
    },[])

    useEffect(() => {
        if(boolValue){
            console.log("组件更新tk")
            setBoolValue(false);
        }
        setBoolValue(true);
    })

    useEffect(() => {
        if(boolValue) {
            console.log("依赖更新tk")
            setBoolValue(false);
            setState(props.dataList)
        }
        setBoolValue(true);
    },[props.dataList])

    const hideModal = () => {
        props.setVisible(false);
    }

    console.log(state.TimeTabel)
    return (
        <>
            <Modal
                title="Modal"
                visible={props.visible}
                onOk={hideModal}
                onCancel={hideModal}
                okText="确认"
                cancelText="取消"
                width="1000px"
            >
                <p>{ state.da }</p>
                <div className="site-card-wrapper">
                    <Row gutter={16}>
                        {
                            state.TimeTabel.map((res, ind) => {
                                return (
                                    <Col span={12} key={ ind }>
                                        <Card title={res.child[0].cont} bordered={false}>
                                            <DetailedData dataList={[res]}></DetailedData>
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </div>
            </Modal>
        </>
    );
}
