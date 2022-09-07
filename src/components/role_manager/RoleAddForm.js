import React, { forwardRef,useState } from 'react'
import { Form, Input,InputNumber } from 'antd'

const RoleAddForm = forwardRef((props, ref) => {
    return (
        <div>
            <Form
                name="rForm"
                ref={ref}
                layout="vertical"
            >
                <Form.Item
                    name="roleName"
                    label="角色名称"
                    rules={[{ required: true, message: '请输入角色名称!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="sort"
                    label="顺序号"
                    rules={[{ required: true, message: '请输入顺序号!' }]}
                >
                    <InputNumber/>
                </Form.Item>
            </Form>
        </div>
    )
})
export default RoleAddForm
