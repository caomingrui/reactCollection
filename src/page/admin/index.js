import React, {useState, useEffect, useReducer, useContext, memo} from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
// import {
//     SmileOutlined,
//     FileOutlined
// } from '@ant-design/icons';
import * as Icon from '@ant-design/icons';
import {BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import {Test1, Test2, Test3} from "../testMixins";
import adminRoutes from "../../route/adminRoute";
import FancyRoute from "../../utils/FancyRoute";
import { Storage } from './mixins/storage';
import styled from 'styled-components';
import { AppRoute } from '@/utils/manage/ContextState'
// import { AppRoute } from '../../index'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const HeaderStyle = styled.div`
  display: flex;
  width: calc(100% - 40px);
  justify-content: space-between;
  padding: 0 20px;
 
`;

// 动态icon
const iconCreate = (name) => {
    return React.createElement(Icon && (Icon)[name], {
        style: {fontSize: '16px'}
    });
}

class SiderDemo extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        collapsed: false,
        fatherName: '',
        childName: '',
        OpenKeys: '',
        SelectedKeys: '',
        storage: Storage()
    };

    componentWillMount = () => {
        this.setState({
            fatherName: Storage().getBreadcrumb()[0],
            childName: Storage().getBreadcrumb()[1],
            OpenKeys: Storage().getKeys()[0],
            SelectedKeys: Storage().getKeys()[1]
        })
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.fatherName !== prevState.fatherName) {
            this.setState({
                fatherName: Storage().getBreadcrumb()[0],
                childName: Storage().getBreadcrumb()[1],
                OpenKeys: Storage().getKeys()[0],
                SelectedKeys: Storage().getKeys()[1]
            });
        }
    }

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    // 侧边栏跳转 设置数据
    linkGetData = (fatherName, childName) => {
        this.setState({
            fatherName: fatherName.fatherName,
            childName: childName.childName
        });
        this.state.storage.setStor([fatherName, childName]);
    }

    render() {
        const { collapsed } = this.state;
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                    <div className="logo" />
                    <div style={{width: '100%', height: '64px', background: '#8f92d7'}}></div>
                    <Menu theme="dark" defaultSelectedKeys={this.state.SelectedKeys} defaultOpenKeys={this.state.OpenKeys} mode="inline">
                        {
                            this.props.state.map((res, ind) => {
                                return (
                                    <SubMenu key={ res.key } icon={res.icon?iconCreate(res.icon): <Icon.FileOutlined />} title={ res.name } >
                                        {
                                            res.children.map((da, index) => {
                                                return (
                                                    <Menu.Item key={ da.key } icon={da.icon?iconCreate(da.icon): ''}>
                                                        <Link to={`${this.props.route}/${da.name}`} onClick={()=> {this.linkGetData(res, da)}}>{ da.name }</Link>
                                                    </Menu.Item>
                                                )
                                            })
                                        }
                                    </SubMenu>
                                )
                            })
                        }
                        <Menu.Item key="9" icon={<Icon.FileOutlined />}>
                            Files
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header style={{ padding: 0, borderRadius: '1px', background: '#ffffff', boxShadow: '5px 5px 6px #e6e6e6, -5px -5px 6px #ffffff' }} >
                        <HeaderStyle>
                            <span></span>
                            <div>
                                <Icon.SmileOutlined />
                                <img src='../../assters/img/header.jpg' alt=""/>
                            </div>
                        </HeaderStyle>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>{ this.state.fatherName }</Breadcrumb.Item>
                            <Breadcrumb.Item>{ this.state.childName }</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            { this.props.children }
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        );
    }
}

export const AppContext = React.createContext({});

export default memo((props) => {
    const [routers, setRouters] = useContext(AppRoute);
    const [state, setState] = useState(routers);
    const [boolValue, setBoolValue] = useState(false);

    useEffect(() => {
        if(boolValue) {
            console.log("依赖更新了呀")
            setBoolValue(false);
        }
        setBoolValue(true);
    },[routers])

    return (
        <>
            <AppContext.Provider value={[state, setState]}>
                <SiderDemo state={adminRoutes} route={props.match.path}>
                        {
                            routers.map((res, ind) => {
                                return (
                                    <div key={res.key}>
                                            {
                                                res.children.map((da, index) => {
                                                    return (
                                                        <Switch key={da.key}>
                                                            <FancyRoute path={`${props.match.path}/${da.name}`} component={da.component} exact/>
                                                        </Switch>
                                                    )
                                                })
                                            }
                                    </div>
                                )}
                            )
                        }
                </SiderDemo>
            </AppContext.Provider>
        </>
    )
});
