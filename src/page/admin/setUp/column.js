import React, {memo, useState, useEffect, useContext, useRef} from "react";
import Table, { MultiLayerTable } from '../template/table';
import { useColums, iconCreate } from '@/utils/data/tabelColumns';
import { AppColumns } from '@/utils/manage/ContextState';
import {Button, Col, Form, Input, Row, Space} from "antd";
import Popout from '../template/popout';
import { DeleteOutlined } from '@ant-design/icons';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

export default memo(() => {
    const {data, screenColumns, screenRender} = useColums();
    const [tabelColumns, setColumns] = useState();
    const [routers, setRouters] = useContext(AppColumns);          // 总 admin 路由规则
    const [bounState, setBounState] = useState(false);   // 弹框状态
    const [lineData, setLineData] = useState({val: []}); // 当前操作数据
    const formColums = useRef(null);                     // 注册表单ref
    const [saveState, setSaveState] = useState();                  // 保存表单前回显数据

    // 弹框确认
    const bouncConfirm = () => {
        setBounState(false);
    }

    // change 事件
    const changeBut = (text, col,index) => {
        setBounState(true);
        setLineData(text);

        // 表单回显
        tabelEcho(text.val);
    }

    // 表单数值回显
    const tabelEcho = (data) => {
        // 拼凑表单键值对
        let obj = {};
        data.map((res, ind) => {
            obj['title' + (ind + 1)] = data[ind].title;
            obj['dataIndex' + (ind + 1)] = data[ind].dataIndex;
        });

        // 保存表单前回显数据
        setSaveState(obj);

        setTimeout(() => {
            formColums.current.setFieldsValue(obj);
        }, 100);
    }

    // 伪提交
    const onSubmitColumns = () => {
        const diffArr = compareObject(formColums.current.getFieldsValue());

        let arr = [...routers];
            function eachArr(list) {
                list.map((res, ind) => {
                    if (res.key == lineData.key) {

                        // 存在改动
                        if (diffArr.length>0) {
                            diffArr.map(diffRes => {
                                if (diffRes.ind%2==0) {
                                    const num = parseInt(diffRes.ind / 2);
                                    res.val[num].title = diffRes.val;
                                }
                                else {
                                    const num = parseInt(diffRes.ind / 2);
                                    res.val[num].dataIndex = diffRes.val;
                                }
                            })
                        }

                    }
                    else {
                        if (res.children) {
                            eachArr(res.children);
                        }
                    }
                });
            }

            eachArr(arr);
            setRouters(arr);
            localStorage.setItem('adminColums', JSON.stringify(arr));
            setBounState(false);
            TestColumns();
    }

    // 暴力比较对象寻找差异ind
    const compareObject = (tabelData) => {
        const diffArr = [];
        Object.keys(tabelData).map((res, ind) => {
            if (saveState[res] != tabelData[res]) {
                const obj = {};
                obj.ind = ind;
                obj.val = tabelData[res];
                diffArr.push(obj);
            }
        });
        return diffArr;
    }

    // 规则字符串化
    const testColumns = (text) => {
        return (
            <p>
                { JSON.stringify(text) }
            </p>
        );
    }

    // 规则操作块
    const ColumnsChange = (text, col, index) => {
        return (
            <Space size="middle">
                <a onClick={() => {changeBut(text, col, index)}}> Change </a>
            </Space>
        );
    }

    // 删除对应表单列
    const deleteLineData = (ind) => {
        let arr = lineData;
        let notDelArr = [];
        if (lineData.val.length > 0) {
            [...arr.val].map((res, index) => {
                if (res.key == ind) {
                    console.log(index);
                }
                else {
                    notDelArr.push(res);
                }
            })
            arr.val = notDelArr;
        }
        setLineData({val: []}); // 防止缓存
        setLineData(arr);
        tabelEcho(lineData.val);      // 表单回显
    }

    // 添加列
    const addList = () => {
        console.log(lineData)
        let listArr = lineData;
        const key = new Date();
        console.log(key)
        listArr.val.push({
            title: "",
            dataIndex: "",
            key: key
        });
        console.log(listArr);
        setLineData({val: []});
        setTimeout(() => {
            setLineData(listArr);
        }, 100)
        console.log(lineData)
    }

    useEffect(() => {
        console.log("columns组件挂载完成之后执行:");
        TestColumns();
    },[]);

    // 测试强制刷新表格
    const TestColumns = () => {
        setColumns([]);
        setTimeout(() => {
            screenRender('columns', 'val', testColumns, false);
            setColumns(screenRender('columns', 'action', ColumnsChange, false));
        });
    }

    console.log(formColums)
    return (
        <>
            <Popout popoutBut={[bouncConfirm]} popout={[bounState, setBounState]} width={600}>
                <Form  {...layout} ref={formColums} >

                    {
                        lineData.val.map((res, ind) => {
                            return (
                                <Row gutter={16} key={res.key}>
                                    <Col span={11}>
                                        <Form.Item label="title" name={'title' + (ind + 1)} rules={[{ required: true, message: 'Please input your menu title' + ind + '}!' }]}>
                                            <Input value={res.title} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={11}>
                                        <Form.Item label="dataIndex" name={'dataIndex' + (ind + 1)} >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={2} onClick={() => {deleteLineData(res.key)}}>
                                        <DeleteOutlined />
                                    </Col>
                                </Row>
                            )
                        })
                    }

                    <Row gutter={16}>
                        <Col span={12}>
                            <div style={{textAlign: 'center'}}>
                                <Button style={{marginRight: '20px'}}>
                                    Cancel
                                </Button>
                                <Button htmlType="submit"  type="primary" onClick={addList} style={{marginRight: '20px'}}>
                                    Add
                                </Button>
                                <Button htmlType="submit"  type="primary" onClick={onSubmitColumns} style={{marginRight: '20px'}}>
                                    Submit
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Popout>
            <Table columns={tabelColumns} data={routers}></Table>
        </>
    )
});
