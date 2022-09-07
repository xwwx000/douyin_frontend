import React, { useEffect, useState,useRef } from 'react'
import { Table, Button, Modal, Breadcrumb, Tree, message } from 'antd'
import axios from 'axios'
import {
    DeleteOutlined,
    PlusOutlined,
    EditOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import RoleUpdateForm from '../../../components/role_manager/RoleUpdateForm';
import RoleAddForm from '../../../components/role_manager/RoleAddForm';
import StorageUtil from '../../../util/StorageUtil'
export default function RoleList(props) {
    const addForm = useRef(null)
    const updateForm = useRef(null)
    //查询条件
    const [searchFormData, setSearchFormData] = useState({roleName:""})
    //角色列表
    const [dataSource, setDataSource] = useState([])
    //权限树
    const [rightList, setRightList] = useState([])
    //权限选中项
    const [rightOk, setRightOk] = useState([])
    //选择角色id
    const [roleid, setRoleid] = useState()
    //是否显示权限弹出框
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [rolename, setRolename] = useState()
    const [isUpdateVisible,setIsUpdateVisible] = useState(false)
    const [curData,setCurData] = useState(null)
    const [isAddVisible,setIsAddVisible] = useState(null)
    const [page, setPage] = useState({
        total: 0, // 总页数
        current: 1, // 当前页码
        pageSize: 8 // 每页数据条数
    });
    const [rolefunction,setRoleFunction] = useState([])
    const fun = ["/Enterprises/role/add","/Enterprises/role/delete","/Enterprises/role/update","/Enterprises/role/right"]
    useEffect(() => {
        let params = { "pageNo": page.current, "pageSize": page.pageSize}
        axios.get("/device/system/role/getRoleList",
            {
                "params": params,
                "headers": { "token": StorageUtil.localStorageGet("token").token }
            })
            .then(res => {
                const list = res.data.data.list
                setDataSource(list)
                setPage(res.data.data.pagination)
            }).catch(err => {
                console.log(err)
            })
    }, [searchFormData]);
    useEffect(() => {
        setRoleFunction(StorageUtil.localStorageGet("token").user.modules)
    }, []);

    //负责存放已经选中的临时数组
    let rlist = []
    //获取权限树
    const rightTreeData = (roleId) => {
        axios.get("/device/system/role/getModuleByRoleId",
            {
                "params": { roleId: roleId },
                "headers": { "token": StorageUtil.localStorageGet("token").token }
            })
            .then(res => {
                const list = res.data.data
                setRightList(list)
                rlist = []
                setRightCheckData(list)
                setRightOk(rlist)
            }).catch(err => {
                console.log(err)
            })
    }
    const setRightCheckData = (list) => {
        list.forEach(item => {
            if (item.children) {
                setRightCheckData(item.children)
                if (item.status === 1) {
                    rlist.push(item.id)
                }
            } else {
                if (item.status === 1) {
                    rlist.push(item.id)
                }
            }
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
            title: '角色名称',
            dataIndex: 'roleName'
        },
        {
            title: '顺序号',
            dataIndex: 'sort'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime'
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button type="danger" title='删除' disabled={rolefunction.indexOf(fun[1])<0 || item.isAdmin === 1 ? true : false} shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />&nbsp;&nbsp;
                    <Button type="primary" title='编辑' disabled={rolefunction.indexOf(fun[2])<0 || item.isAdmin === 1 ? true : false} shape="circle" icon={<EditOutlined />} onClick={() => editMethod(item)} />&nbsp;&nbsp;
                    <Button type="primary" title='角色权限' disabled={rolefunction.indexOf(fun[3])<0 || item.isAdmin === 1 ? true : false} shape="circle" icon={<ExclamationCircleOutlined />} onClick={() => rightMethod(item)} />
                </div>
            }
        }
    ];
    const showAddForm = ()=>{
        setIsAddVisible(true)
    }
    const editMethod = (item) => {
        setCurData(item)
        setTimeout(() => {
          setIsUpdateVisible(true)
          updateForm.current.setFieldsValue(item)
        }, 0)
    }
    const rightMethod = (item) => {
        setRoleid(item.id)
        setRolename(item.roleName)
        setIsModalVisible(true)
        //设置权限选中项

        rightTreeData(item.id)
    }
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
    //更新角色权限
    const handleOk = () => {
        setIsModalVisible(false)

        console.log(rightOk)
        axios.put("/device/system/role/updateRoleModule",
            { roleId: roleid, modules: rightOk }, {
            headers: {
                token: StorageUtil.localStorageGet("token").token
            }
        }).then(res => {
            message.success('设置权限成功');
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }
    const handleCancel = () => {
        setIsModalVisible(false)
    }
    const deleteMethod = (item) => {
        axios.delete("/device/system/role/deleteRole",
            {
                //后端作为对象来封装
                // data: {
                //     id: 123,
                //     name: 'Henry',
                // },

                //参数放到url中传递
                params: {
                    roleId: item.id
                },
                headers: {
                    token: StorageUtil.localStorageGet("token").token
                }
            }).then(res => {
                console.log("res",res)
                if (res.data.code === 0) {
                    
                    setTimeout(() => {
                        setPage({...page,current: 1,pageSize: 8})
                        //刷新列表
                        setSearchFormData({ ...searchFormData })
                      }, 0)
                    message.success('删除角色成功');
                  } else {
                    message.warning('删除角色失败');
                  }
            }).catch(err => {
                console.log(err)
            })
    }

    let checkTmpList = []
    //选中事件
    const onCheck = (keys, e) => {

        console.log("选中key", keys.checked)
        let tmpList = []
        tmpList = keys.checked;
        let checkList = []
        //被选中
        if (e.checked === true) {
            //查看是否有children
            if (e.node.children) {
                checkTmpList = []
                checkList = setChildrenChecked(e.node.children)
                checkList.forEach(item => {
                    if(tmpList.some(item1=>item1===item) == false){
                        tmpList.push(item)
                    }
                })
            }
        } else {
            //查看是否有children
            if (e.node.children) {
                checkTmpList = []
                checkList = setChildrenChecked(e.node.children)
            }
            console.log(checkList)
            checkList.forEach(item => {
                tmpList = tmpList.filter(item1 => item1 !== item)
            })
        }
        console.log("处理后选中key", tmpList)
        setRightOk(tmpList)
    }

    const setChildrenChecked = (children) => {
        children.forEach(item => {
            if (item.children) {
                checkTmpList.push(item.id)
                setChildrenChecked(item.children);
            } else {
                checkTmpList.push(item.id)
            }
        })

        return checkTmpList;
    }
    /*********************************************************
     * 保存增加角色
     ********************************************************/
    const saveAddRole=()=>{
        addForm.current.validateFields().then(values => {
            setIsAddVisible(false)
            axios.post("/device/system/role/addRole",
              { roleName: values.roleName,sort:values.sort},
              {
                headers: {
                  "Content-Type": "application/json;",
                  token: StorageUtil.localStorageGet("token").token
                }
              }).then(res => {
                console.log(res)
                addForm.current.resetFields()
                if (res.data.code === 0) {
                  //刷新列表
                  setSearchFormData({...searchFormData})
                  message.success({
                    content: "增加角色成功",
                    style: {
                      marginTop: '50vh',
                    }
                  })
                } else {
                  message.warning({
                    content: "增加角色失败",
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
     * 保存修改角色
     ********************************************************/
    const saveUpdateRole=()=>{
        updateForm.current.validateFields().then(values => {
          setIsUpdateVisible(false)
          axios.put("/device/system/role/updateRole",
            { id:curData.id,roleName: values.roleName,sort:values.sort},
            {
              headers: {
                "Content-Type": "application/json;",
                token:StorageUtil.localStorageGet("token").token
              }
            }).then(res => {
              console.log(res)
              updateForm.current.resetFields()
              if (res.data.code === 0) {
                //刷新列表
                setSearchFormData({...searchFormData})
                message.success({
                  content: "修改角色成功",
                  style: {
                    marginTop: '50vh',
                  }
                })
              } else {
                message.warning({
                  content: "修改角色失败",
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
                <Breadcrumb.Item>角色管理</Breadcrumb.Item>
            </Breadcrumb>
            <Button type="primary" style={{ "margin": 10, "marginLeft": 0 }} onClick={showAddForm} disabled={rolefunction.indexOf(fun[0])<0}><PlusOutlined />新增角色</Button>
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
                        setTimeout(()=>{
                            setPage({...page,
                                current: pageNo, // 当前页码
                                pageSize: pageSize // 每页数据条数
                            })
                            setSearchFormData({ ...searchFormData })
                        },0)
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
                visible={isUpdateVisible}
                title="修改角色"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    updateForm.current.resetFields()
                    setIsUpdateVisible(false)
                }}
                onOk={saveUpdateRole}
            >
                <RoleUpdateForm ref={updateForm} />
            </Modal>
            <Modal
                width={1000}
                visible={isAddVisible}
                title="新增角色"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    addForm.current.resetFields()
                    setIsAddVisible(false)
                }}
                onOk={saveAddRole}
            >
                <RoleAddForm ref={addForm} />
            </Modal>
            <Modal title={rolename} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="确认"
                cancelText="取消">
                <div style={{
                    height: 500,
                    overflowY: "auto"
                }}>
                    {rightList.length > 0 ? (<Tree
                        checkable
                        defaultExpandAll
                        checkStrictly
                        defaultExpandedKeys={[]}
                        defaultSelectedKeys={[]}
                        checkedKeys={rightOk}
                        // onSelect={onSelect}
                        onCheck={onCheck}
                        treeData={rightList}
                        fieldNames={{
                            title: 'name',
                            key: 'id'
                        }}
                    />) : null}
                </div>
            </Modal>
        </div >
    )
}
