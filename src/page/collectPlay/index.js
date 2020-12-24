import React, { useState, useEffect, useReducer, useContext } from 'react';
import {
    Drawer,
    Form,
    Button,
    Col,
    Row,
    Input,
    Select,
    DatePicker,
    Timeline,
    Calendar,
    Alert,
    Empty,
    Descriptions,
    Modal,
    Space,
    message,
    Table, Switch, Tag
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined  } from '@ant-design/icons';
import moment from 'moment';
import { dataList } from '../../utils/data/collectPlay'
import 'antd/dist/antd.css'
import './Ind.sass'
import { setStorage, getStorage } from "../../utils/myHooks";
import { TreeData } from "./table"
import { TableChild } from "./tableChild"
import styled from 'styled-components';

import {publicState} from "../home/data";

export const { RangePicker } = DatePicker;

// 共享钩子
export const AppContext = React.createContext({});
export const ChildCont = React.createContext({});

const dataTime = {
    value: moment('2017-01-25'),
    selectedValue: moment('2017-01-25')
}

// 日历 时间线 详细数据
let list = dataList;

if (getStorage('timeData') != null) {
    list = JSON.parse(getStorage('timeData'));
}

const todosReducer = (state, action) => {
    state = action;
    return state;
}

export const Ind = () => {
    let state = {
        butDate: false
    }
    const [data, setData] = useState(state);
    const [todos, dispatch] = useReducer(todosReducer, dataTime);
    const [defaulttime, setTime] = useState({
        value: moment('2020-12-25'),
        selectedValue: moment('2020-12-25'),
    })
    const [timeList, setTimeList] = useState(null); // 时间线数据
    const [timeDate, setTimeDate] = useState(list); // 时间总数据
    const [tableState, setTableState] = useState(); // 表单数据显示状态
    const [boolValue, setBoolValue] = useState(false);
    const [detailTableData, setDetailTableData] = useState();

    const test = (da) => {
        console.log(timeDate)
        setTime(da);
        const time = da.value.format('YYYY-MM-DD');
        let timeState = false;
        let TimeTabel;
        timeDate.map( res => {
            setTimeList(null)
            if (res.da == time) {
                timeState = true;
                TimeTabel = res.TimeTabel;
            }
        })

        if (timeState) {
            console.log(TimeTabel)
            setTimeList(TimeTabel)
            console.log(timeList)
        }
        console.log(timeList)
    }

    const article = (e) => {
        console.log('')
        console.log(e)
        setTimeDate('');
        setTimeDate(e);
        setStorage('timeData', JSON.stringify(e));
    }

    const delect = (e) => {
        timeDate.splice(e, 1);
        article(timeDate);
    }

    // 显示详细内容的表单
    const detailTable = (e) => {
        console.log(e);
        setDetailTableData([])
        setDetailTableData(e);
    }

    return (
        <div className="ind">
            <AppContext.Provider value={[timeDate, setTimeDate]}>
                <div className="timeline">
                    <TimeTabel list={ timeList }></TimeTabel>
                </div>
                <div className="ind-cont">
                    <div className="ind-cont-but">
                        <IndCont article={ article } data={ timeDate }></IndCont>
                        <Button type="primary" onClick={() => { setData({butDate: true}) }}> open calendar </Button>
                        <Button type="primary" onClick={() => { setData({butDate: false}) }}> OPEN TABLE </Button>
                    </div>
                    <div>
                        <App state={ data.butDate } test={ test } default={ defaulttime }></App>
                        <ChildCont.Provider value={[detailTableData, setDetailTableData]}>
                            <TableChild detailTableData={detailTableData}></TableChild>
                            <TreeData state={ data.butDate } dataList={ timeDate }
                                      article={ article } delect={delect} test={ test }></TreeData>
                        </ChildCont.Provider>
                    </div>
                </div>
            </AppContext.Provider>
        </div>
    )
}

const IndCont = (props) => {
    const [state, setState] = useState(false);
    const [timeDate, setTimeDate] = useContext(AppContext);

    const add = (e) => {
        props.article(e);
        setTimeDate(e);
    }

    return (
        <div>
            <Button type="primary" onClick={() => {setState(true)}}> OPEN </Button>
            <DrawerForm state={ state } setStates={ setState } timeDate={ timeDate }
                        setTimeDate={ setTimeDate } child={ add } directionTyle="right"></DrawerForm>
        </div>
    )
}

export const { Option } = Select;

// 样式
export const footer = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: '10px 0',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    background: '#ffffff',
    boxShadow: '8px 8px 17px #e0e0e0, -8px -8px 17px #ffffff'
}

// 抽屉填写表单
export class DrawerForm extends React.Component {

    constructor(props) {
        super(props);
    }
    state = {
        visible: this.props.state,
        value: '123123',
        config: {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
        },
        timeDate: this.props.timeDate,
        setTimeDate: this.props.setTimeDate,
        rangeConfig: {
            rules: [{ type: 'array', required: true, message: 'Please select time!' }],
        },
        placement: this.props.directionTyle
    };

    onClose = () => {
        this.setState({
            value: ''
        })
        this.props.setStates(false)
        this.refs.addForm.resetFields()
    };

    // 表单提交
    onSubmint = () => {
        console.log(this.refs.addForm.getFieldsValue())
        const path = this.refs.addForm.getFieldsValue();
        const time = path.time.format('YYYY-MM-DD'); // 创建时间
        const detailed_time = path.time.format('YYYY-MM-DD HH:mm:ss');// 详细时间
        let timeState = false; // 不存在添加处理
        let pushState = false; // 存在追加处理
        let pushData; // 存在当前追加数据
        this.state.timeDate.map(res => {
            // 存在时间处理
            if (res.da == time) {
                pushState = true;
                pushData = res;
                return ;
            }
            if (res.da != time) {
                timeState = true;
                console.log(res)
                return ;
            }
        })

        // 存在追加处理
        if (pushState) {
            console.log('我已经存在了呀')
            let obj = {'type': path.owner, 'child': [], 'timeStart': path.timeDifference[0].format('YYYY-MM-DD HH:mm:ss'),
                'timeEnd': path.timeDifference[1].format('YYYY-MM-DD HH:mm:ss'), 'time': detailed_time};
            const isCont = {'cont': path.name };
            obj.child.push(isCont); // 二层时间节点 --- 后续优化
            if (path.description) { // 存在备注处理 -- 后续优化
                const contObj = {}
                contObj.cont = path.description ;
                obj.child.push(contObj);
            }
            pushData.TimeTabel.push(obj);
            pushState = false;
            this.props.child(this.state.timeDate);
            // this.props.setTimeDate(this.state.timeDate);
            setStorage('timeData', JSON.stringify(this.state.timeDate));
            this.onClose();
            return;
        }

        // 不存在添加处理
        if (timeState) {
            // if () {}
            console.log('我不存在哈')
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
            this.state.timeDate.push(obj);
            this.props.child(this.state.timeDate);
            // this.props.setTimeDate(this.state.timeDate);
            setStorage('timeData', JSON.stringify(this.state.timeDate));
            this.onClose();
            timeState = false;
            return;
        }
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
            const values = await this.refs.addForm.validateFields();
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
                    <Form layout="vertical" hideRequiredMark ref="addForm">
                        <Row gutter={16}>
                            <Col span={16}>
                                <Form.Item
                                    name="name"
                                    label="Play one"
                                    rules={[{ required: true, message: 'Please enter user name' }]}
                                >
                                    <Input placeholder="Please enter complete content" onChange={this.cahngeDataName} value={this.state.value} ref={myInput=>this.myInput=myInput}/>
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


// 时间表格 - 每天或每周
const TimeTabel = (props) => {
    const [state, setState] = useState(false);
    const [todos, dispatch] = useReducer(todosReducer, [{type: 'red', child: [{}, {}]}]);

    const lineClie = (res) => {
        setState(true);
        dispatch([res]);
    }

    if (props.list != null) {
        console.log(todos)
        return (
            <Timeline >
                {
                    props.list.map((res, ind) => {
                        return (
                            <Timeline.Item color={ res.type } key={ind + res} onClick={() => { lineClie(res) }}>
                                {
                                    res.child.map((da, ind) => {
                                        return (
                                            <p key={da.cont}>{ da.cont }</p>
                                        )
                                    })
                                }
                            </Timeline.Item>
                        )
                    })
                }
                <LocalizedModal state={state} setState={setState} dataList={todos}></LocalizedModal>
            </Timeline>
        )
    }
    else {
        return (
            <Empty image={ Empty.PRESENTED_IMAGE_SIMPLE } />
        )
    }
}


// 日历
class App extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        value: this.props.default.value,
        selectedValue: this.props.default.selectedValue,
    };

    onSelect = value => {
        this.setState({
            value,
            selectedValue: value,
        });
        this.props.test({
            value,
            selectedValue: value,
        })
    };

    onPanelChange = value => {
        this.setState({
            value,
            selectedValue: value,
        });
        this.props.test({
            value,
            selectedValue: value,
        })
    };

    render() {
        const { value, selectedValue } = this.state;
        return (
            <>
                <div style={ this.props.state?{display: 'block'}: { display: 'none' } }>
                    <Alert
                        message={`You selected date: ${selectedValue && selectedValue.format('YYYY-MM-DD')}`}
                    />
                    <Calendar value={value} onSelect={this.onSelect} onPanelChange={this.onPanelChange} />
                </div>
            </>
        );
    }
}


// 弹出层 - 时间线点击弹出描述层
class LocalizedModal extends React.Component {
    constructor(props) {
        super(props);
        // console.log(this.props.data)
    }
    state = { visible: this.props.state };

    showModal = () => {
        this.setState({
            visible: true,
        });
        this.props.setState(true);
    };

    hideModal = () => {
        this.setState({
            visible: false,
        });
        this.props.setState(false);
    };

    render() {
        console.log(this.props.dataList)

        return (
            <>
                <Modal
                    title="Modal"
                    visible={this.props.state}
                    onOk={this.hideModal}
                    onCancel={this.hideModal}
                    okText="确认"
                    cancelText="取消"
                    width="700px"
                >
                    <DetailedData dataList={this.props.dataList}></DetailedData>
                </Modal>
            </>
        );
    }
}

const TestStyle = styled.div`
  color: red;
  
  .test1 {
    background: #61dafb;
  }
`;

// 详细内容共用组件
export const DetailedData = (props) => {
    const [boolValue, setBoolValue] = useState(false);

    const typeFilter = (type) => {
        if (type == "green") {
            return "完美"
        }
        else if (type == "blue") {
            return "海阔以"
        }
        else if (type == "red") {
            return "有点糟糕"
        }
        else {
            return "辣鸡"
        }
    }

    useEffect(() => {
        if(boolValue) {
            console.log("开始tk:")
            console.log(props.dataList)
            setBoolValue(false);
        }
        setBoolValue(true);
    })

    useEffect(() => {
        if(boolValue) {
            console.log("依赖更新tk")
            console.log(props.dataList)
            setBoolValue(false);
        }
        setBoolValue(true);
    },[props])

    return (
        <>
            {
                props.dataList.map((res, ind) => {
                    return (
                        <>
                            <Descriptions title="User Message" key={res.type + ind}>
                                <Descriptions.Item label="State" >{ typeFilter(res.type) }</Descriptions.Item>
                                <Descriptions.Item label="TimeStart">{ res.timeStart }</Descriptions.Item>
                                <Descriptions.Item label="TimeEnd">{ res.timeEnd }</Descriptions.Item>
                                <Descriptions.Item label="task">{ res.child[0].cont }</Descriptions.Item>
                                <Descriptions.Item label="describe">{ res.child.length>1?res.child[1].cont: 'null' }</Descriptions.Item>
                                <Descriptions.Item label="Time">{ res.time }</Descriptions.Item>
                            </Descriptions>
                            <TestStyle>
                                123123
                                <div className="test1">
                                    123312 - { process.env.REACT_APP_BASE_API }
                                </div>
                            </TestStyle>
                        </>
                    )
                })
            }
        </>
    )
}
