import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom';
import axios from 'axios'
import { connect } from 'react-redux';
import './index.css'
import StorageUtil from '../../util/StorageUtil'
import {
  HomeOutlined,
  UserOutlined,
  InsertRowBelowOutlined,
  ProjectOutlined,
  SettingOutlined,
  BarcodeOutlined,
  BarsOutlined
} from '@ant-design/icons';
import MenuItem from 'antd/lib/menu/MenuItem';
const { Sider } = Layout;
const { SubMenu } = Menu;

function SideMenu(props) {

  const [menu, setMenu] = useState([])
  useEffect(() => {
    axios.get("/douyin/system/user/menu", { "headers": { "token":StorageUtil.localStorageGet("token").token } })
      .then(res => {
        if(res.data.data == undefined){
          setMenu([])
        }else{
          setMenu(res.data.data)
        }
      }).catch(err => {
        setMenu([])
        console.log("错误:",err)
      })
  }, [])
  const renderMenu = (menu) => {
    return menu.map(item => {
      if (item.children?.length > 0) {
        return <SubMenu key={item.path} icon={iconList[item.icon]} title={item.name}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      return <MenuItem key={item.path} icon={item.children || item.path === "/home" ? iconList[item.icon] : null} onClick={() => {
        props.history.push(item.path)
      }}>{item.name}</MenuItem>
    })
  }
  const iconList = {
    "home": <HomeOutlined />,
    "enterprises" : <UserOutlined />,
    "bussiness":<InsertRowBelowOutlined />,
    "platform":<ProjectOutlined />,
    "goods":<BarcodeOutlined />,
    "data-report":<BarsOutlined />
  }
  const selectKeys = props.location.pathname
  const openKeys = ["/" + selectKeys.split("/")[1]]

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
        <div className="ant-pro-sider-logo"><img src={require('../../image/logo.png')} style={{height:40}}/>{props.isCollapsed===false?<h1>天机智投</h1>:""}</div>
        <div style={{ flex: 1, "overflow": "auto" }}>
          <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}
const mapStateToProps = ({CollapsedReducer:{isCollapsed}})=>{
  return {
    isCollapsed
  }
}
export default connect(mapStateToProps)(withRouter(SideMenu))