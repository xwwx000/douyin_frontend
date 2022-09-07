import React, { forwardRef, useState } from 'react'
import { Form, Input, InputNumber } from 'antd'

const DeptUpdateForm = forwardRef((props, ref) => {

    return (
        <div>
            <Form
                name="dForm"
                ref={ref}
                layout="vertical"
            >
                <Form.Item
                    name="id"
                    label="id"
                >
                    <Input disabled={true}/>
                </Form.Item>
                <Form.Item
                    name="deptName"
                    label="部门名称"
                    rules={[{ required: true, message: '请输入部门名称!' }]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="manager"
                    label="负责人"
                    rules={[{ required: true, message: '请输入负责人!' }]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="telphone"
                    label="电话"
                    rules={[{ required: true, message: '请输入电话!' }]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="sort"
                    label="顺序号"
                    rules={[{ required: true, message: '请输入顺序号!' }]}
                >
                    <InputNumber />
                </Form.Item>
            </Form>
        </div>
    )
})
export default DeptUpdateForm
