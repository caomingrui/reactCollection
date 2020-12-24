import React, {useState, useEffect, useReducer, useContext, memo, useRef } from 'react';
import Table, { MultiLayerTable } from '../template/table'
import {Space, Button, Select, Form, Input, Col, Row, message} from "antd";
import adminRoutes from "../../../route/adminRoute";
import Popout from "../template/popout";
import styled from 'styled-components';
import { AppRoute } from '@/utils/manage/ContextState';
// import { AppRoute } from '../../../index'
import route from "../../../utils/route";
import { useArrOperate } from '@/utils/mixin/hooks'

const RouteTabelBut = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 10px;
`;

const { Option } = Select;

const RouteTable = (setRouters) => {
    const { deleteArr } = useArrOperate();
    const routers = adminRoutes;

    // 警告提示
    const warning = (mess) => {
        message.warning(mess);
    };

    // 删除数据
    const deleteNum = (text, key) => {
        console.log(text.children)
        if (text.children!=undefined) {
            warning('存在子路由无法删除');
        }
        else {
            setRouters(deleteArr(routers, key));
            window.location.reload();
        }
    };

    // 修改路由数据
    const changeRouteNum = (text) => {
        console.log(text);

    }

    return {
        deleteNum,
        changeRouteNum
    }
}


// 路由表格管理
export default memo((props) => {
    const [poputState, setPoputState] = useState(false);
    const [tableData, setTableData] = useState();
    const [routers, setRouters] = useContext(AppRoute);
    const [bouncCont, setBouncCont] = useState(true);
    const [echoData, setEchoData] = useState();

    const columns = [
        {
            title: '菜单名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '路径',
            dataIndex: 'path',
            key: 'path',
            width: '12%',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record, ind) => (
                <Space size="middle">
                    <a onClick={() => {dataEcho(text);}}> Change </a>
                    <a onClick={() => {RouteTable(setRouters).deleteNum(text, record.key)}}> Delete </a>
                </Space>
            ),
        },
    ];

    const dataEcho = (text) => {
        setEchoData(text);
        setPoputState(true);
        setBouncCont(false);
    }

    //弹框确认按钮
    const bouncedConfirm = () => {
        setPoputState(false);
        changeAdminRoute(tableData[0], tableData[1]);
    }

    // 处理表单提示数据
    const changeAdminRoute = (val, key) => {
        if (key == 'push') {
            admintRoutePush(val);
        }
        else if (key == 'add') {
            admintRouteAdd(val);
        }
        else if (key == 'change') {
            adminRouteChange(val);
        }
    }

    /**
     * route push data
     * */
    const admintRoutePush = (data) => {
        let arr = [...routers]
        arr.map((res, ind) => {
            if (res.name == data.username) {
                let route;
                if (data.path!=undefined) {
                    route = { path: '/' + data.pathName, name: data.routeName, routePath: data.path,
                        key: res.key + (res.children.length + 1), auth: true, component: React.lazy(() => import('@/'+ data.path))};
                }
                else {
                    route = { path: '/' + data.pathName, name: data.routeName, routePath: 'test/A',
                        key: res.key + (res.children.length + 1), auth: true, component: React.lazy(() => import('@/test/A'))};
                }
                res.children.push(route);
            }
        });
        setRouters(arr);
        localStorage.setItem('adminRoute', JSON.stringify(arr));
    }

    /**
     * route add data
     * */
    const admintRouteAdd = (data) => {
        console.log(data);
        let arr = [...routers];
        let route;
        if (data.path!=undefined) {
            route =  { path: '/' + data.addMenuName, name: data.addMenuName, routePath: data.path,
                key: arr.length + 1, auth: true, component: React.lazy(() => import('@/'+ data.path)),
                children: [{ path: '/' + data.addMenuName + data.pathName, name: data.pathName, routePath: data.path,
                    key: arr.length + 1 + '1', auth: true, component: React.lazy(() => import('@/'+ data.path))}]
            };
        }
        else {
            route =  { path: '/' + data.addMenuName, name: data.addMenuName, routePath: 'test/A',
                key: arr.length + 1, auth: true, component: React.lazy(() => import('@/test/A')),
                children: [{ path: '/' + data.addMenuName + data.pathName, name: data.pathName, routePath: 'test/A',
                    key: arr.length + 1 + '1', auth: true, component: React.lazy(() => import('@/test/A'))}]
            };
        }
        arr.push(route);
        setRouters(arr);
        localStorage.setItem('adminRoute', JSON.stringify(arr));
        window.location.reload();
    }

    /**
     * change - Route - Data
     * */
    const adminRouteChange = (data) => {
        let arr = [...routers];
        function findKey(da) {
            da.map((res, ind) => {
                if (res.key == data.key) {
                    if (data.path!=undefined) {
                        res.path = '/' + data.pathName;
                        res.name = data.routeName;
                        res.routePath = data.path;
                        res.component = React.lazy(() => import('@/'+ data.path));
                    }
                    else {
                        res.path = '/' + data.pathName;
                        res.name = data.routeName;
                        res.routePath = 'test/A';
                        res.component = React.lazy(() => import('@/test/A'))
                    }
                }
                else {
                    if (res.children) {
                        findKey(res.children);
                    }
                }
            });
        }
        findKey(arr);
        setRouters(arr);
        localStorage.setItem('adminRoute', JSON.stringify(arr));
    }

    return (
        <>
            <RouteTabelBut>
                <Button type="primary" onClick={() => {setPoputState(true);setBouncCont(true);}}> Append </Button>
            </RouteTabelBut>
            <Popout popout={[poputState, setPoputState]} width={800} popoutBut={[bouncedConfirm]}>
                <AppendSubmenu style={bouncCont?{display: 'block'}: {display: 'none'}} setTableData={setTableData}></AppendSubmenu>
                <TableEcho style={!bouncCont?{display: 'block'}: {display: 'none'}} echoData={echoData} setTableData={setTableData}></TableEcho>
            </Popout>
            <MultiLayerTable columns={columns} data={adminRoutes}></MultiLayerTable>
        </>
    )
});

const MenuNavBut = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
`;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const AppendSubmenu = memo((props) => {
    const [boolValue, setBoolValue] = useState(false);
    const [tabState, setTabState] = useState(true);

    const onChange = (value) => {
        console.log(`selected ${value}`);
    };

    const form1 = useRef(null);
    const form2 = useRef(null);

    // 追加提交
    const onSubmitPush = () => {
        console.log(form1.current.getFieldsValue());
        props.setTableData([form1.current.getFieldsValue(), 'push']);
    }

    // 追加清空事件
    const onClosePush = () => {
        form1.current.resetFields();
    }

    // 新增提交
    const onSubmitAdd = () => {
        console.log(form2.current.getFieldsValue());
        props.setTableData([form2.current.getFieldsValue(), 'add']);
    }

    const emptyForm = () => {
        form1.current.resetFields();
        form2.current.resetFields();
    }

    return (
        <div style={ props.style }>
            <MenuNavBut>
                <Button type={tabState?'primary': ''} onClick={() => {setTabState(true);emptyForm();}}> Append submenu </Button>
                <Button type={tabState?'': 'primary'} onClick={() => {setTabState(false);emptyForm();}}> New submenu </Button>
            </MenuNavBut>
            <Form  {...layout} ref={form1} style={tabState?{display: 'block'}: {display: 'none'}} >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="parentMenu" name="username" rules={[{ required: true, message: 'Please input your username!' }]} >
                            <Select showSearch  placeholder="Select a person" optionFilterProp="children"
                                    onChange={onChange} filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {
                                    adminRoutes.map((res, ind) => {
                                        return (
                                            <Option value={res.name} key={ind}>{ res.name }</Option>
                                        );
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="childMenuName" name="routeName" rules={[{ required: true, message: 'Please input your child menu name!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="routePath" name="pathName" rules={[{ required: true, message: 'Please input your routePath!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="templatePath" name="path" >
                            <Input placeholder="default templat 'A' "/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <div style={{textAlign: 'center'}}>
                            <Button style={{marginRight: '20px'}} onClick={onClosePush}>
                                Cancel
                            </Button>
                            <Button htmlType="submit" onClick={onSubmitPush} type="primary" style={{marginRight: '20px'}}>
                                Submit
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>

            <Form  {...layout} ref={form2} style={tabState?{display: 'none'}: {display: 'block'}} >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="addMenuName" name="addMenuName" rules={[{ required: true, message: 'Please input your menu name!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="childMenuName" name="routeName" rules={[{ required: true, message: 'Please input your child menu name!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="routePath" name="pathName" rules={[{ required: true, message: 'Please input your routePath!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="templatePath" name="path" >
                            <Input placeholder="default templat 'A' "/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <div style={{textAlign: 'center'}}>
                            <Button style={{marginRight: '20px'}}>
                                Cancel
                            </Button>
                            <Button htmlType="submit" onClick={onSubmitAdd} type="primary" style={{marginRight: '20px'}}>
                                Submit
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </div>
    );
});


const TableEcho = (props) => {
    const addForm = useRef(null);
    const [boolValue, setBoolValue] = useState(false);

    useEffect(() => {
        if (boolValue) {
            console.log("组件更新执行00000000000000");
            setBoolValue(false);
            funTabelEcho(props.echoData);
        }
        setBoolValue(true);
    })

    // 数据回显
    const funTabelEcho = (data) => {
        if (data!=undefined) {
            addForm.current.setFieldsValue({
                addMenuName: data.name,
                routeName: data.name,
                pathName: data.name,
                path: data.routePath,
            });
        }
    }

    // 修改数据提交
    const onSubmitTable = () => {
        const obj = addForm.current.getFieldsValue();
        obj.key = props.echoData.key;
        props.setTableData([obj, 'change']);
    }

    return (
        <div style={props.style}>
            <Form  {...layout} ref={addForm}  >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="addMenuName" name="addMenuName" rules={[{ required: true, message: 'Please input your menu name!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="childMenuName" name="routeName" rules={[{ required: true, message: 'Please input your child menu name!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="routePath" name="pathName" rules={[{ required: true, message: 'Please input your routePath!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="templatePath" name="path" >
                            <Input placeholder="default templat 'A' "/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <div style={{textAlign: 'center'}}>
                            <Button style={{marginRight: '20px'}}>
                                Cancel
                            </Button>
                            <Button htmlType="submit" type="primary" onClick={() => {onSubmitTable();}} style={{marginRight: '20px'}}>
                                Submit
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}
