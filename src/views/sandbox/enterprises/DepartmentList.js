import React, { useEffect, useState, useRef } from 'react'
import { Table, Button, Modal, Breadcrumb, Tree, message } from 'antd'
import axios from 'axios'
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import DeptAddForm from '../../../components/dept_manager/DeptAddForm';
import DeptUpdateForm from '../../../components/dept_manager/DeptUpdateForm';
import StorageUtil from '../../../util/StorageUtil'
export default function Department(props) {
  //查询条件
  const [searchFormData, setSearchFormData] = useState({ deptName: "" })
  //部门列表数据
  const [dataSource, setDataSource] = useState([])
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)
  const [pid, setPid] = useState(0)
  const [curData, setCurData] = useState(null)
  const addForm = useRef(null)
  const updateForm = useRef(null)
  const [page, setPage] = useState({
    total: 0, // 总页数
    current: 1, // 当前页码
    pageSize: 8 // 每页数据条数
  });
  useEffect(() => {
    let params = { "pageNo": page.current, "pageSize": page.pageSize }
    axios.get("/douyin/system/dept/getDeptList",
      {
        "params": params,
        "headers": { "token": StorageUtil.localStorageGet("token").token }
      })
      .then(res => {
        console.log(res)
        const list = res.data.data.list
        setDataSource(list)
        setPage(res.data.data.pagination)
      }).catch(err => {
        console.log(err)
      })
  }, [searchFormData]);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '部门名称',
      dataIndex: 'deptName'
    },
    {
      title: '负责人',
      dataIndex: 'manager'
    },
    {
      title: '电话',
      dataIndex: 'telphone'
    },
    {
      title: '顺序',
      dataIndex: 'sort'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
    {
      title: '操作',
      render: (item) => {
        //console.log(item)
        return <div>
          <Button type="danger" title='删除' disabled={item.id === '1'} shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />&nbsp;&nbsp;
          <Button type="primary" title='编辑' shape="circle" icon={<EditOutlined />} onClick={() => editMethod(item)} />&nbsp;&nbsp;
          <Button type="primary" shape="round" onClick={() => addMyMethod(item)}><PlusOutlined />增加同级部门</Button>&nbsp;&nbsp;
          <Button type="primary" shape="round" onClick={() => addSoonMethod(item)}><PlusOutlined />增加下级部门</Button>
        </div>
      }
    }
  ];
  /*********************************************************
   * 删除部门
   ********************************************************/
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
    axios.delete("/douyin/system/dept/deleteDept",
      {
        //后端作为对象来封装
        data: {
          id: item.id
        },
        headers: {
          token: StorageUtil.localStorageGet("token").token
        }
      }).then(res => {
        console.log(res)
        if (res.data.code === 0) {

          setTimeout(() => {
            setPage({ ...page, current: 1, pageSize: 8 })
            //刷新列表
            setSearchFormData({ ...searchFormData })
          }, 0)
          message.success('删除部门成功');
        } else {
          message.warning('删除部门失败');
        }
      }).catch(err => {
        console.log(err)
      })
  }
  //增加同级部门
  const addMyMethod = (item) => {
    setTimeout(() => {
      setIsAddVisible(true)
      setPid(item.pid)
    }, 0)
  }
  //增加下级部门
  const addSoonMethod = (item) => {
    setTimeout(() => {
      setIsAddVisible(true)
      setPid(item.id)
    }, 0)
  }
  const saveAddDept = () => {
    addForm.current.validateFields().then(values => {
      setIsAddVisible(false)
      axios.post("/douyin/system/dept/addDept",
        { deptName: values.deptName, manager: values.manager, telphone: values.telphone, sort: values.sort, pid: pid },
        {
          headers: {
            "Content-Type": "application/json;",
            token:StorageUtil.localStorageGet("token").token
          }
        }).then(res => {
          console.log(res)
          addForm.current.resetFields()
          if (res.data.code === 0) {
            //刷新列表
            setSearchFormData({ ...searchFormData })
            message.success({
              content: "增加部门成功",
              style: {
                marginTop: '50vh',
              }
            })
          } else {
            message.warning({
              content: "增加部门失败",
              style: {
                marginTop: '50vh',
              }
            })
          }
        }).catch(err => {
          console.log(err)
        })
    }).catch(err => {
      console.log(err)
    })
  }
  /*********************************************************
  * 修改部门
  ********************************************************/
  const editMethod = (item) => {
    setCurData(item)
    setTimeout(() => {
      setIsUpdateVisible(true)
      updateForm.current.setFieldsValue(item)
    }, 0)
  };
  const saveUpdateDept = () => {
    updateForm.current.validateFields().then(values => {
      setIsUpdateVisible(false)
      axios.post("/douyin/system/dept/updateDept",
        { id: values.id, deptName: values.deptName, manager: values.manager, telphone: values.telphone, sort: values.sort },
        {
          headers: {
            "Content-Type": "application/json;",
            token: StorageUtil.localStorageGet("token").token
          }
        }).then(res => {
          console.log(res)
          updateForm.current.resetFields()
          if (res.data.code === 0) {
            //刷新列表
            setSearchFormData({ ...searchFormData })
            message.success({
              content: "修改部门成功",
              style: {
                marginTop: '50vh',
              }
            })
          } else {
            message.warning({
              content: "修改部门失败",
              style: {
                marginTop: '50vh',
              }
            })
          }
        }).catch(err => {
          console.log(err)
        })
    }).catch(err => {
      console.log(err)
    })
  }
  return (
    <div>
      <Breadcrumb style={{ margin: '10px 0', fontSize: 15 }}>
        <Breadcrumb.Item>企业信息管理</Breadcrumb.Item>
        <Breadcrumb.Item>组织机构管理</Breadcrumb.Item>
      </Breadcrumb>
      <Table dataSource={dataSource} columns={columns} rowKey={columns => columns.id}
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
            setTimeout(() => {
              setPage({
                ...page,
                current: pageNo, // 当前页码
                pageSize: pageSize // 每页数据条数
              })
              setSearchFormData({ ...searchFormData })
            }, 0)
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
      <Modal title="" visible={false} onOk={null} onCancel={null} okText="确认"
        cancelText="取消">
        <div style={{
          height: 500,
          overflowY: "auto"
        }}>
        </div>
      </Modal>
      <Modal
        width={1000}
        visible={isAddVisible}
        title="新增部门"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          addForm.current.resetFields()
          setIsAddVisible(false)
        }}
        onOk={saveAddDept}
      >
        <DeptAddForm ref={addForm} />
      </Modal>
      <Modal
        width={1000}
        visible={isUpdateVisible}
        title="修改部门"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          updateForm.current.resetFields()
          setIsUpdateVisible(false)
        }}
        onOk={saveUpdateDept}
      >
        <DeptUpdateForm ref={updateForm} />
      </Modal>
    </div>
  )
}
