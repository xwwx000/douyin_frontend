import React, { useEffect, useState, useRef } from 'react'
import { Table, Button, Modal, Breadcrumb, Switch, message } from 'antd'
import axios from 'axios'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    PlusOutlined
} from '@ant-design/icons';
import StorageUtil from '../../../util/StorageUtil'
export default function DeviceList() {
    //设备列表
    const [deviceListData, setDeviceListData] = useState([])
    const [page, setPage] = useState({
        total: 0, // 总页数
        current: 1, // 当前页码
        pageSize: 8 // 每页数据条数
      });
    useEffect(() => {
        getDeviceList()
    }, []);
    /**************************************
     * 获取设备列表
     **************************************/
    const getDeviceList = () => {
        let params = { "pageNo": page.current, "pageSize": page.pageSize, "deviceName": "" }

        axios.get("/device/system/device/getDeviceList",
            {
                "params": params,
                "headers": { "token": StorageUtil.localStorageGet("token").token }
            })
            .then(res => {
                const list = res.data.data.list
                setDeviceListData(list)
                setPage(res.data.data.pagination)
            }).catch(err => {
                console.log(err)
            })
    };
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '设备代码',
            dataIndex: 'deviceCode',
            sorter: true
        },
        {
            title: '设备名称',
            dataIndex: 'deviceName'
        },
        {
            title: '设备类型',
            // 'deviceType'
            render: (item) => {
                if (item.deviceType === 10) {
                    return "自主机器人"
                } else if (item.deviceType === 99) {
                    return "轨道机器人"
                } else {
                    return "水下机器人"
                }
            }
        },
        {
            title: '设备状态',
            render: (item) => {
                return <div>
                    <Switch checked={item.status}></Switch>
                </div>
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createTime'
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button type="danger" title='删除' shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />&nbsp;&nbsp;
                    <Button type="primary" title='编辑' shape="circle" icon={<EditOutlined />} onClick={() => editMethod(item)} />
                </div>
            }
        }
    ];
    /******************************************
   * 修改设备
   *****************************************/
    const editMethod = (item) => {

    };
    /**************************************
     * 删除设备
     **************************************/
    const confirmMethod = (item) => {
        Modal.confirm({
            title: '确定删除?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            okText: '确认',
            cancelText: '取消',
            onOk() {

            },
            onCancel() {

            }
        });
    }
    return (
        <div>
        <Breadcrumb style={{ margin: '10px 0', fontSize: 15 }}>
          <Breadcrumb.Item>业务管理</Breadcrumb.Item>
          <Breadcrumb.Item>设备终端管理</Breadcrumb.Item>
        </Breadcrumb>
        <Button type="primary" style={{ "margin": 10, "marginLeft": 0 }}><PlusOutlined />新增设备</Button>
        <Table dataSource={deviceListData} columns={columns} rowKey={columns => columns.id}
          pagination={{
            position: ['bottomRight'],
            showQuickJumper: true,
            // size: 'small',
            defaultCurrent: 1,
            total: page.total,
            pageSize: page.pageSize,
            current: page.current,
            pageSizeOptions:[8,10,20,30,50],
            showSizeChanger: true,
            showTotal: total => `共${total}条`,
            onChange: (pageNo, pageSize) => {
              setPage({ ...page, current: pageNo, pageSize: pageSize })
            },
            locale: {
              jump_to: '跳至',
              page: '页',
              items_per_page: '条/页',
              prev_page: '上一页',
              next_page: '下一页',
            }
          }}
        />
      </div>
    )
}