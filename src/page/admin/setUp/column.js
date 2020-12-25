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
    const [routers, setRouters] = useContext(AppColumns); // 总 admin 路由规则
    const [bounState, setBounState] = useState(false); // 弹框状态
    const [lineData, setLineData] = useState({val: []}); // 当前操作数据
    const formColums = useRef(null);// 注册表单ref
    const [saveState, setSaveState] = useState(); // 保存表单前回显数据

    // 弹框确认
    const bouncConfirm = () => {
        setBounState(false);
    }


    const changeBut = (text) => {
        setBounState(true);
        setLineData(text);

        // 拼凑表单键值对
        let obj = {};
        text.val.map((res, ind) => {
            obj['title' + (ind + 1)] = text.val[ind].title;
            obj['dataIndex' + (ind + 1)] = text.val[ind].dataIndex;
        });

        // 保存表单前回显数据
        setSaveState(obj);

        setTimeout(() => {
            formColums.current.setFieldsValue(obj);
        }, 100);
    }

    // 伪提交
    const onSubmitColumns = () => {
        // console.log(saveState)
        // console.log(formColums.current.getFieldsValue());
        const diffArr = compareObject(formColums.current.getFieldsValue());

        let arr = [...routers];
            function eachArr(list) {
                list.map((res, ind) => {
                    if (res.key == lineData.key) {

                        // 存在改动
                        if (diffArr.length>0) {
                            console.log(diffArr)
                            diffArr.map(diffRes => {
                                if (diffRes.ind%2==0) {
                                    const num = parseInt(diffRes.ind/2);
                                    res.val[num].title = diffRes.val;
                                }
                                else {
                                    const num = parseInt(diffRes.ind/2);
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
    }

    // 暴力比较对象寻找差异ind
    const compareObject = (tabelData) => {
        const diffArr = [];
        Object.keys(saveState).map((res, ind) => {
            if (saveState[res] != tabelData[res]) {
                const obj = {};
                obj.ind = ind;
                obj.val = tabelData[res];
                diffArr.push(obj);
            }
        });
        return diffArr;
    }

    // 抽离 表单数据
    const pullAwayData = (data) => {
        console.log(data)
        const arr = [];
        Object.keys(data).map((res, ind) => {
            if (ind%2==0) {
                let obj = {title: data[res],
                    dataIndex: data[Object.keys(data)[ind + 1]],
                    key: (data[res]=='Action')?'action': (data[Object.keys(data)[ind + 1]])}; // 暂写死的
                arr.push(obj)
            }
        })
        return arr;
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
    const ColumnsChange = (text) => {
        return (
            <Space size="middle">
                <a onClick={() => {changeBut(text)}}> Change </a>
            </Space>
        );
    }

    // 删除对应表单列
    const deleteLineData = (ind) => {
        console.log(ind);
        let arr = lineData;
        let notDelArr = [];
        if (lineData.val.length>0) {
            [...arr.val].map((res, index) => {
                if (res.key == ind) {
                    console.log(index)
                    // delete [...arr.val][index];
                    // arr.val.splice(index, 1);
                    // arr.val.slice(index, index+1)
                }
                else {
                    notDelArr.push(res);
                }
            })
            // arr.val.splice((ind - 1), 1);
            console.log(arr.val)
            arr.val = notDelArr
            console.log(arr)
            setLineData({val: []})
        }
        setTimeout(() => {
            setLineData(arr)
        }, 100)
    }

    useEffect(() => {
        console.log("columns组件挂载完成之后执行:");
        setTimeout(() => {
            screenRender('columns', 'val', testColumns, false);
            setColumns(screenRender('columns', 'action', ColumnsChange, false));
        }, 200);
    },[]);

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
                                        <Form.Item label="dataIndex" name={'dataIndex' + (ind + 1)} rules={(ind+1)<lineData.val.length?[{ required: true, message: 'Please input your child menu dataIndex'+ ind +'!' }]: ''}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={2} onClick={() => {deleteLineData(res.key)}}>
                                        <DeleteOutlined />
                                        {lineData.val[lineData.val.length - 1].title}
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
                                <Button htmlType="submit"  type="primary" onClick={onSubmitColumns} style={{marginRight: '20px'}}>
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
