import React, { useEffect, useState, useRef } from 'react'
import { Table, Button, Modal, Breadcrumb, Switch, message } from 'antd'
import axios from 'axios'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import UserForm from '../../../components/user_manager/UserForm';
import UserSearchForm from '../../../components/user_manager/UserSearchForm';
import StorageUtil from '../../../util/StorageUtil'
import style from '../../css/table.module.css'
export default function UserList(props) {
  const addForm = useRef(null)
  const updateForm = useRef(null)
  const searchForm = useRef(null)
  //用户列表数据
  const [userListData, setUserListData] = useState([])
  const [isAddvisible, setIsAddVisible] = useState(false)
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)
  const [deptData, setDeptData] = useState([])
  const [deptValue, setDeptValue] = useState()
  //角色列表
  const [roleData, setRoleData] = useState([])
  const [page, setPage] = useState({
    total: 0, // 总页数
    current: 1, // 当前页码
    pageSize: 8 // 每页数据条数
  });
  //查询条件
  const [searchFormData, setSearchFormData] = useState({userName:"",sortField:"",ascDesc:""})
  const [curUpdateUserData, setCurUpdateUserData] = useState(null)
  useEffect(() => {
    getUserList()
  }, [searchFormData]);
  /*****************************************************************
   * 获取角色列表
   ****************************************************************/
  useEffect(() => {
    axios.get("/douyin/system/role/getRoleList",
      {
        "params": { pageNo: 1, pageSize: 1000 },
        "headers": { "token":StorageUtil.localStorageGet("token").token }
      })
      .then(res => {
        const list = res.data.data.list
        setRoleData(list)
      }).catch(err => {
        console.log(err)
      })
  }, []);
  /*****************************************************************
   * 获取部门列表
   ****************************************************************/
  useEffect(() => {
    axios.get("/douyin/system/dept/deptListWithTree",
      {
        "headers": { "token":StorageUtil.localStorageGet("token").token }
      })
      .then(res => {
        const list = res.data.data
        setDeptData(list)
      }).catch(err => {
        console.log(err)
      })
  }, []);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '用户代码',
      dataIndex: 'userCode',
      sorter: true
    },
    {
      title: '用户名称',
      dataIndex: 'userName'
    },
    {
      title: '用户类型',
      // 'userType'
      render: (item) => {
        if (item.userType === 10) {
          return "操作员"
        } else if (item.userType === 99) {
          return "管理员"
        } else {
          return "普通用户"
        }
      }
    },
    {
      title: '用户状态',
      render: (item) => {
        return <div>
          <Switch checked={item.status} disabled={item.userCode === 'admin' ? true : false} onChange={() => switchMethod(item)}></Switch>
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
          <Button type="danger" title='删除' disabled={item.userCode === 'admin' ? true : false} shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />&nbsp;&nbsp;
          <Button type="primary" title='编辑' disabled={item.userCode === 'admin' ? true : false} shape="circle" icon={<EditOutlined />} onClick={() => editMethod(item)} />
        </div>
      }
    }
  ];
  /**************************************
   * 获取用户列表
   **************************************/
  const getUserList = () => {
    let params = { "pageNo": page.current, "pageSize": page.pageSize, "userName": "" }
    let userName = searchFormData.userName
    let sortField = searchFormData.sortField
    let ascDesc = searchFormData.ascDesc

    if (userName && userName.length > 0) {
      params = { ...params, userName: userName }
    }

    if (sortField && ascDesc!==undefined && sortField.length > 0) {
      params = { ...params, sortField: sortField }
    }

    if (ascDesc && ascDesc!==undefined && ascDesc.length > 0) {
      params = { ...params, ascDesc: ascDesc }
    }

    axios.get("/douyin/system/user/getUserList",
      {
        "params": params,
        "headers": { "token": StorageUtil.localStorageGet("token").token }
      })
      .then(res => {
        const list = res.data.data.list
        setUserListData(list)
        setPage(res.data.data.pagination)
      }).catch(err => {
        console.log(err)
      })
  };
  /**************************************
   * 搜索页面传值
   **************************************/
  const getSearchData = (value) => {
    if (value.userName !== undefined && value.userName.length > 0) {
      setSearchFormData({ ...searchFormData, userName: value.userName })
    } else {
      setSearchFormData({ ...searchFormData, userName: "" })
    }
  }
  /******************************************
   * 修改用户
   *****************************************/
  const editMethod = (item) => {
    searchForm.current.resetFields()
    setCurUpdateUserData(item)
    setTimeout(() => {
      setIsUpdateVisible(true)
      updateForm.current.setFieldsValue(item)
    }, 0)
  };
  /**************************************
   * 删除用户
   **************************************/
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
 
  /**************************************
   * 更新用户状态
   **************************************/
  const switchMethod = (item) => {
    axios.put("/douyin/system/user/setStatus", { id: item.id, status: item.status ? 0 : 1 },
      {
        headers: {
          "Content-Type": "application/json;",
          token: StorageUtil.localStorageGet("token").token
        }
      }).then(res => {
        if (res.data.code === 0) {
          // item.isshow = item.isshow === 1 ? 0 : 1
          // setDataSource([...dataSource])
          //刷新列表
          setSearchFormData({ ...searchFormData })
          message.success({
            content: "更新状态成功",
            style: {
              marginTop: '50vh',
            }
          })
        } else {
          message.warning({
            content: "更新状态失败",
            style: {
              marginTop: '50vh',
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
  }
  const deptOnChange = (value) => {
    setDeptValue(value);
  };
/*********************************************
 * 保存新增用户
 *********************************************/
  const saveAddUser = () => {
    addForm.current.validateFields().then(values => {
      setIsAddVisible(false)
      // setDataSource([...dataSource,{

      // }])
      axios.post("/douyin/system/user/addUser",
        { userCode: values.userCode, userName: values.userName, deptId: values.deptId, userType: values.userType,allowsRoles:values.allowsRoles },
        {
          headers: {
            "Content-Type": "application/json;",
            token:StorageUtil.localStorageGet("token").token
          }
        }).then(res => {
          addForm.current.resetFields()
          if (res.data.code === 0) {
            setSearchFormData({...searchFormData})
            message.success({
              content: "新增用户成功",
              style: {
                marginTop: '50vh',
              }
            })
          } else {
            message.warning({
              content: "新增用户失败",
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
   /**************************************
   * 删除用户
   **************************************/
    const deleteMethod = (item) => {
      axios.delete("/douyin/system/user/deleteUser",
        {
          //后端作为对象来封装
          data: {
            id: item.id
          },
          //参数放到url中传递
          // params: {
          //   id: item.id
          // },
          headers: {
            token: StorageUtil.localStorageGet("token").token
          }
        }).then(res => {
          if (res.data.code === 0) {
            setTimeout(() => {
              setPage({...page,current: 1,pageSize: 8})
              //刷新列表
              setSearchFormData({ ...searchFormData })
            }, 0)
            message.success('删除用户成功');
          } else {
            message.warning('删除用户失败');
          }
          //setDataSource(dataSource.filter(data=>data.id!==item.id))
        }).catch(err => {
          console.log(err)
        })
    }
  /*********************************************
   * 保存修改用户
   *********************************************/
  const saveUpdateUser = () => {
    setIsUpdateVisible(false)
    updateForm.current.validateFields().then(values => {
      // setDataSource([...dataSource,{

      // }])
      axios.put("/douyin/system/user/updateUser",
        { id:curUpdateUserData.id,userCode: values.userCode, userName: values.userName, deptId: values.deptId, userType: values.userType,allowsRoles:values.allowsRoles },
        {
          headers: {
            "Content-Type": "application/json;",
            token: StorageUtil.localStorageGet("token").token
          }
        }).then(res => {
          updateForm.current.resetFields()
          if (res.data.code === 0) {
            //刷新列表
            setSearchFormData({...searchFormData})
            message.success({
              content: "修改用户成功",
              style: {
                marginTop: '50vh',
              }
            })
          } else {
            message.warning({
              content: "修改用户失败",
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
  const showAddUserForm = () => {
    //清空搜索栏
    searchForm.current.resetFields()
    setIsAddVisible(true)
  }
  return (
    <div>
      <Breadcrumb style={{ margin: '10px 0', fontSize: 15 }}>
        <Breadcrumb.Item>企业信息管理</Breadcrumb.Item>
        <Breadcrumb.Item>用户管理</Breadcrumb.Item>
      </Breadcrumb>
      <UserSearchForm ref={searchForm} getSearchData={getSearchData} searchData={searchFormData} />
      <Button type="primary" style={{ "margin": 10, "marginLeft": 0 }} onClick={showAddUserForm}><PlusOutlined />新增用户</Button>
      <Table dataSource={userListData} columns={columns} rowKey={columns => columns.id}
        onChange={(pagination, filters, sorter) => {
          setSearchFormData({ ...searchFormData,"sortField":sorter.field,"ascDesc":sorter.order})
        }}
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
            setSearchFormData({ ...searchFormData })
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

      <Modal
        width={1000}
        visible={isAddvisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          addForm.current.resetFields()
          setIsAddVisible(false)
        }}
        onOk={saveAddUser}
      >
        <UserForm ref={addForm} deptData={deptData} roleData={roleData} />
      </Modal>
      <Modal
        width={1000}
        visible={isUpdateVisible}
        title="修改用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          updateForm.current.resetFields()
          setIsUpdateVisible(false)
        }}
        onOk={saveUpdateUser}
      >
        <UserForm ref={updateForm} deptData={deptData} roleData={roleData} curUpdateUserData={curUpdateUserData} />
      </Modal>
    </div>
  )
}
