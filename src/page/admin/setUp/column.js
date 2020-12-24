import React, {memo, useState, useEffect, useContext, useRef} from "react";
import Table, { MultiLayerTable } from '../template/table';
import { useColums, iconCreate } from '@/utils/data/tabelColumns';
import { AppColumns } from '@/utils/manage/ContextState';
import {Button, Col, Form, Input, Row, Space} from "antd";
import Popout from '../template/popout';

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


    // 弹框确认
    const bouncConfirm = () => {
        setBounState(false);
    }

    const changeBut = (text) => {
        console.log(text);
        setBounState(true);
        setLineData(text);

        // 拼凑表单键值对
        let obj = {};
        text.val.map((res, ind) => {
            obj['title' + (ind + 1)] = text.val[ind].title;
            obj['dataIndex' + (ind + 1)] = text.val[ind].dataIndex;
        });

        setTimeout(() => {
            formColums.current.setFieldsValue(obj);
        }, 100);
    }

    // 伪提交
    const onSubmitColumns = () => {
        console.log(formColums.current.getFieldsValue());
        console.log(routers)
        let arr = JSON.parse(JSON.stringify(routers));
        console.log(pullAwayData(formColums.current.getFieldsValue()));
        console.log(lineData)
            function eachArr(list) {
                list.map((res, ind) => {
                    if (res.key == lineData.key) {
                        console.log(res)
                        res.val = pullAwayData(formColums.current.getFieldsValue());
                    }
                    else {
                        if (res.children) {
                            eachArr(res.children);
                        }
                    }
                });
            }
            eachArr(arr);
            console.log(arr);
            // setRouters('')
            // setRouters(arr);


            // localStorage.setItem('adminRoute', JSON.stringify(arr));
            // arr[2].val[2].dataIndex = 'jdk';
            // arr[2].val[2].title = '莫挨老子';
            // setRouters(arr)
    }

    // 抽离 表单数据
    const pullAwayData = (data) => {
        const arr = [];
        Object.keys(data).map((res, ind) => {
            if (ind%2==0) {
                let obj = {title: data[res], dataIndex: data[Object.keys(data)[ind + 1]]}; // 暂写死的
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
                                    <Col span={12}>
                                        <Form.Item label="title" name={'title' + (ind + 1)} rules={[{ required: true, message: 'Please input your menu title' + ind + '}!' }]}>
                                            <Input value={res.title} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="dataIndex" name={'dataIndex' + (ind + 1)} rules={(ind+1)<lineData.val.length?[{ required: true, message: 'Please input your child menu dataIndex'+ ind +'!' }]: ''}>
                                            <Input />
                                        </Form.Item>
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
                                    Submit
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
                {
                    lineData.val.map(res => {
                        return (
                            <p key={res.key}>
                                { JSON.stringify(res) }
                            </p>
                        )
                    })
                }
            </Popout>
            <Table columns={tabelColumns} data={routers}></Table>
        </>
    )
});
