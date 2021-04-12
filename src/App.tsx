import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';

import { Layout, Menu, Breadcrumb } from 'antd';

import { AppContext, blockSettings } from './appcontext';
import Blocks from './components/Blocks';
import DashBoard from './components/DashBoard';

const { Header, Content, Footer, Sider } = Layout;

export default function App() {
  const appCtx = React.useContext(AppContext);
  const [mount, setMount] = React.useState<boolean>(true);
  React.useEffect(() => {
    setMount(false);
    setTimeout(() => setMount(true), 100);
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
