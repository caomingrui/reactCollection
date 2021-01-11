import React, {useState, useEffect, useReducer, useContext, memo} from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import * as Icon from '@ant-design/icons';
import {BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import {Test1, Test2, Test3} from "../testMixins";
import adminRoutes from "../../route/adminRoute";
import FancyRoute from "../../utils/FancyRoute";
import { Storage } from './mixins/storage';
import styled from 'styled-components';
import { AppRoute, AppColor } from '@/utils/manage/ContextState';
import header from './ resources/img/header.jpg'
import 'antd/dist/antd.css'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const HeaderStyle = styled.div`
  display: flex;
  width: calc(100% - 40px);
  justify-content: space-between;
  padding: 0 20px;
  
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
`;

const BreadCrumbsStyle = styled.div`
  width: 100%;
  background: #ffffff;
  padding: 10px 25px;
  min-height: 100px;
  //box-shadow: 0 2px 8px #f0f1f2;
  background-color: ${ props => props.breadCrumbsColor + '!important' };
`;

const ConfigColor = styled.span`
    color: red;
    background-color: ${ props => props.sidebarColor + '!important' };

          .ant-layout-sider, .ant-menu.ant-menu-dark, .ant-layout-sider-trigger{
            background-color: ${ props => props.sidebarColor + '!important' };
          }
      
          .ant-menu-dark .ant-menu-inline.ant-menu-sub {
            background-color: ${ props => props.sidebarAnColor + '!important' };
          }
    
          .ant-menu-dark.ant-menu-dark:not(.ant-menu-horizontal) .ant-menu-item-selected {
            background-color: ${ props => props.checkBarColor + '!important' };
          }
`

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
        storage: Storage(),
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
        const { navLeftColor, sidebarColor, sidebarAnColor, checkBarColor, navColor, breadCrumbsColor, contentColor } = this.props.totalColor;
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <ConfigColor sidebarColor={sidebarColor} sidebarAnColor={sidebarAnColor} checkBarColor={checkBarColor}>
                    <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse} >
                        <div className="logo" />
                        <div style={{width: '100%', height: '64px', background: navLeftColor}} ></div>

                        <Menu theme="dark" defaultSelectedKeys={this.state.SelectedKeys} defaultOpenKeys={this.state.OpenKeys} mode="inline" >
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
                                Files {navLeftColor}
                            </Menu.Item>
                        </Menu>
                    </Sider>
                </ConfigColor>
                <Layout className="site-layout">
                    <Header style={{ padding: 0, borderRadius: '1px', background: navColor, boxShadow: '0 1px 4px rgba(0,21,41,.08)', position: 'relative' }} >
                        <HeaderStyle >
                            <span></span>
                            <div>
                                <NavUser></NavUser>
                            </div>
                        </HeaderStyle>
                    </Header>
                    <Content style={{ margin: '0 0px', background: contentColor }}>
                        <BreadCrumbsStyle breadCrumbsColor={breadCrumbsColor}>
                            <Breadcrumb style={{ margin: '0px 0' }}>
                                <Breadcrumb.Item>{ this.state.fatherName }</Breadcrumb.Item>
                                <Breadcrumb.Item>{ this.state.childName }</Breadcrumb.Item>
                            </Breadcrumb>
                        </BreadCrumbsStyle>
                        <div className="site-layout-background" id="container" style={{ padding: 24, minHeight: 360}}>
                            { this.props.children }
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        );
    }
}

const NavUserStyle = styled.div`
  .user-mess {
    padding: 0 5px;
    cursor: pointer;
    transition: .4s;
    
    img {
      margin-right: 6px;
    }
  }
  
  .user-mess:hover {
    background: #f7f7f7;
  }
`;

// 头部用户栏
const NavUser = () => {

    return (
        <NavUserStyle>
            <div className="user-mess">
                <img src={header} alt=""/>
                <span>React Hooks</span>
            </div>
        </NavUserStyle>
    );
};

export const AppContext = React.createContext({});

export default memo((props) => {
    const [routers, setRouters] = useContext(AppRoute);
    const [state, setState] = useState(routers);
    const [boolValue, setBoolValue] = useState(false);
    const [totalColor, setTotalColor] = useContext(AppColor);

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
                <SiderDemo state={adminRoutes} route={props.match.path} totalColor={totalColor}>
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
