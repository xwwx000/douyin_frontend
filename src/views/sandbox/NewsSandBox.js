import React from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import { Layout } from 'antd';
import './NewsSandBox.css'
import ContentRoute from '../../components/sandbox/ContentRoute'
import Foot from '../foot/Foot';
const { Content,Footer } = Layout;
export default function NewsSandBox() {
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 10,
            minHeight: 280,
            overflow:"auto"
          }}
        >
          <ContentRoute/>
        </Content>
        <Footer style={{ textAlign: 'center',padding:"10px" }}>Ant Design ©2022 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  )
}
