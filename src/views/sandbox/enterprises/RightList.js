import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch, Pagination, Breadcrumb } from 'antd'
import axios from 'axios'
import {
    SearchOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import StorageUtil from '../../../util/StorageUtil'
const { confirm } = Modal
export default function RightList(props) {
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        getModuleList()
    }, [])
    const getModuleList = () => {
        axios.get("/device/system/user/getModuleFunctionTree", { "headers": { "token": StorageUtil.localStorageGet("token").token } })
        .then(res => {
            const list = res.data.data
            //防止后台传过来空children[]
            list.forEach(item => {
                if (item.children && item.children.length === 0) {
                    item.children = ""
                }
            })
            setDataSource(list)
        }).catch(err => {
            console.log(err)
        })
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '模块名称',
            dataIndex: 'name'
        },
        {
            title: '模块路径',
            dataIndex: 'path',
            render: (path) => {
                return <Tag color="orange">{path}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                //console.log(item)
                return <div>
                    {/* <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />&nbsp;&nbsp; */}
                    <Popover content={<Switch checked={item.isshow} onChange={() => switchMethod(item)}></Switch>} title="配置项" trigger={item.type !== 1 ? '' : 'click'}>
                        <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.type !== 1} />
                    </Popover>
                </div>
            }
        }
    ];
    const confirmMethod = (item) => {
        Modal.confirm({
            title: '确定删除?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                deleteMethod(item)
            },
            onCancel() {

            }
        });
    }
    const deleteMethod = (item) => {
        // console.log(item)
        axios.post("/device/system/user/deleteModule", { id: item.id },
            {
                headers: {
                    "Content-Type": "application/json;",
                    token: JSON.parse(localStorage.getItem("token")).token
                }
            }).then(res => {
                //刷新列表
                getModuleList()
                //setDataSource(dataSource.filter(data=>data.id!==item.id))
                //刷新菜单树
            }).catch(err => {
                console.log(err)
            })
    }
    const switchMethod = (item) => {
        axios.put("/device/system/user/isShowModule", { id: item.id, isshow: item.isshow ? 0 : 1 },
            {
                headers: {
                    "Content-Type": "application/json;",
                    token: JSON.parse(localStorage.getItem("token")).token
                }
            }).then(res => {
                console.log(res)
                item.isshow = item.isshow === 1 ? 0 : 1
                setDataSource([...dataSource])
                //刷新列表
                //getModuleList()
                //setDataSource(dataSource.filter(data=>data.id!==item.id))
                //刷新菜单树
                //props.history.push("/home")
            }).catch(err => {
                console.log(err)
            })
    }
    return (
        <div>
            <Breadcrumb style={{ margin: '10px 0', fontSize: 15 }}>
                <Breadcrumb.Item>企业信息管理</Breadcrumb.Item>
                <Breadcrumb.Item>模块管理</Breadcrumb.Item>
            </Breadcrumb>
            <Table dataSource={dataSource} columns={columns} rowKey={columns => columns.id} pagination={{ position: ['none','none'] }}/>
        </div>
    )
}
