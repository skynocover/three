import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import { AppProvider } from './appcontext';

import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { AppContext, blockSettings } from './appcontext';
import Blocks from './components/Blocks';
import DashBoard from './components/DashBoard';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function App() {
  const appCtx = React.useContext(AppContext);
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const [mount, setMount] = React.useState<boolean>(true);
  React.useEffect(() => {
    setMount(false);
    setTimeout(() => setMount(true), 300);
  }, [appCtx.refresh]);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={380} style={{ background: 'white' }}>
        <DashBoard />
      </Sider>
      {mount && (
        <Layout>
          <Content>
            <Blocks />
          </Content>
        </Layout>
      )}
    </Layout>
  );
}
