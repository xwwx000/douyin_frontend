import React, {useEffect, useState } from 'react'
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { connect } from 'react-redux';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import StorageUtil from '../../util/StorageUtil'
const { Header } = Layout;
function TopHeader(props) {
  //const [collapsed, setCollapsed] = useState(false)
  const changeCollapsed = () => {
    //setCollapsed(!collapsed)
    console.log(props)
    //发布
    props.changeCollapsed()
  }
  const user = StorageUtil.localStorageGet("token")
  const [job, setJob] = useState(false)
  useEffect(() => {
    switch(user.user.userType){
      case 10:
        setJob('操作员');
        break;
      case 99:
        setJob('管理员');
        break;
      default:
        setJob('普通用户');
    }
  }, []);
  const menu = (
    <Menu>
      <Menu.Item key="user">
        {job}
      </Menu.Item>
      <Menu.Item danger onClick={() => {
        localStorage.removeItem("token")
        props.history.replace("/login")
      }} key="logout">退出</Menu.Item>
    </Menu>
  )
  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {
        props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
      }
      <div style={{ float: "right" }}>
        <span>欢迎-<span style={{ color: "#1890ff" }}>{user.user.userName}</span></span>
        <Dropdown overlay={menu}>
          {/* <Avatar size="small" icon={<UserOutlined />} /> */}
          <a>
            <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
          </a>
        </Dropdown>
      </div>
    </Header>
  )
}
const mapStateToProps = ({CollapsedReducer:{isCollapsed}})=>{
  return {
    isCollapsed
  }
}
const mapDispatchToProps = {
  changeCollapsed(){
    return {
      type:"change_collapsed",
      payload:""
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)((withRouter)(TopHeader))
