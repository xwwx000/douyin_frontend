import React, { forwardRef,useState } from 'react'
import { Form, Input,InputNumber } from 'antd'

const RoleUpdateForm = forwardRef((props, ref) => {
    return (
        <div>
            <Form
                name="rForm"
                ref={ref}
                layout="vertical"
            >
                <Form.Item
                    name="id"
                    label="角色id"
                    
                >
                    <Input disabled={true} value={props.roleData?props.roleData.id:null}/>
                </Form.Item>
                <Form.Item
                    name="roleName"
                    label="角色名称"
                    rules={[{ required: true, message: '请输入角色名称!' }]}
                >
                    <Input value={props.roleData?props.roleData.roleName:null}/>
                </Form.Item>
                <Form.Item
                    name="sort"
                    label="顺序号"
                    rules={[{ required: true, message: '请输入顺序号!' }]}
                >
                    <InputNumber value={props.roleData?props.roleData.sort:null}/>
                </Form.Item>
            </Form>
        </div>
    )
})
export default RoleUpdateForm
