import React, { forwardRef } from 'react'
import {
    Form,
    Input,
    Row,
    Col,
    Button,
} from 'antd';
const UserSearchForm = forwardRef((props, ref) => {
    const [form] = Form.useForm();
    const onFinish = (values) => {
        props.getSearchData(values)
    };
    return (
        <div style={{ "width": "98%" }}>
            <Form
                form={form}
                ref={ref}
                name="advanced_search"
                className="ant-advanced-search-form"
                onFinish={onFinish}
            >
                <Row gutter={24}>
                    <Col span={8} key="c1">
                        <Form.Item
                            name="userName"
                            label="用户名称"
                        >
                            <Input style={{"width":"200px"}} value={props.searchData.userName}/>
                        </Form.Item>
                    </Col>
                    <Col span={8} key="c2">
                        <Button type="primary" htmlType="submit">
                            查询
                        </Button>
                        <Button
                            style={{ margin: '0 8px' }}
                            onClick={() => {
                                form.resetFields();
                            }}
                        >
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
})

export default UserSearchForm