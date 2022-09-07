import React,{useState} from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Login.css';
import Foot from '../foot/Foot';
import StorageUtil from '../../util/StorageUtil';
export default function Login(props) {
  const [checked,setChecked] =  useState(localStorage.getItem("remember")?true:false)
  //登录
  const onFinish = (values) => {
    axios.post("/douyin/auth/token/system_login",
      { username: values.username, password: values.password }, {}).then(res => {
        if (res.data.length === 0 || res.data.code === -1) {
          message.warning({
            content: "用户名密码错误",
            style: {
              marginTop: '70vh',
            }
          })
          return;
        }
        //localStorage.setItem("token", JSON.stringify(res.data.data))
        StorageUtil.localStorageSet("token", res.data.data,StorageUtil.expireTime)
        localStorage.setItem("douyin_username",values.username)
        props.history.replace("/")
      }).catch(err => {
        console.log(err)
      })
  };
  function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
    if(e.target.checked){
      localStorage.setItem("remember",true)

    }else{
      localStorage.removeItem("remember")

    }
    setChecked(e.target.checked)
  }
  const initUsername = ()=>{
    var username = ""
    if(localStorage.getItem("remember")){
      username = localStorage.getItem("douyin_username")
    }
    return username
  }
  return (
    <div className="login">
      <div className='formContainer'>
        <div className='logintitle'>天机智投</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            initialValue={initUsername()}
            rules={[{ required: true, message: '请输入用户!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户"/>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="请输入密码"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" noStyle>
              <Checkbox style={{ color: 'white' }} onChange={onChange} checked={checked}>记住用户</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Foot />
    </div>
  )
}
