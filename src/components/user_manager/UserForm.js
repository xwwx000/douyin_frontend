import React, { forwardRef,useState } from 'react'
import { Form, Input, Select, TreeSelect } from 'antd'
const { Option } = Select;
const UserForm = forwardRef((props, ref) => {
    const [userTypeData, setUserTypeData] = useState([{
        "id":10,"name":"操作员"},{"id":99,"name":"管理员"},{"id":0,"name":"普通用户"}
      ])
    return (
        <div>
            <Form
                name="uForm"
                ref={ref}
                layout="vertical"
            >
                <Form.Item
                    name="userCode"
                    label="用户代码"
                    rules={[{ required: true, message: '请输入用户代码!' }]}
                >
                    <Input disabled={props.curUpdateUserData?true:false}/>
                </Form.Item>
                <Form.Item
                    name="userName"
                    label="用户名称"
                    rules={[{ required: true, message: '请输入用户名称!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="userType"
                    label="用户类型"
                    rules={[{ required: true, message: '请选择用户类型!' }]}
                >
                    <Select
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="--请选择--"
                    >

                        {
                            userTypeData.map(item =>
                                <Option value={item.id} key={item.id}>{item.name}</Option>
                            )
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name="deptId"
                    label="部门"
                    rules={[{ required: true, message: '请选择部门!' }]}
                >
                    <TreeSelect
                        style={{ width: '100%' }}
                        treeData={props.deptData}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择部门"
                        allowClear
                        treeDefaultExpandAll
                        //onChange={props.deptOnChange}
                        fieldNames={{
                            label: 'deptName',
                            value: 'id'
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name="allowsRoles"
                    label="角色"
                    rules={[{ required: true, message: '请选择角色!' }]}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="--请选择--"
                        onChange={(value) => {
                            //测试form之间调用
                            // ref.current.setFieldsValue({
                            //     dept:""
                            // })
                        }}
                    >
                        {
                            props.roleData.map(item =>
                                item.isAdmin!==1?
                                <Option value={item.id} key={item.id}>{item.roleName}</Option>
                                :null
                            )
                        }
                    </Select>
                </Form.Item>
            </Form>
        </div>
    )
})
export default UserForm
