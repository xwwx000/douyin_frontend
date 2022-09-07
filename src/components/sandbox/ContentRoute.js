import React, { useEffect,useState } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Spin } from 'antd'
import { connect } from 'react-redux'
import Home from '../../views/sandbox/home/Home'
import RightList from '../../views/sandbox/enterprises/RightList'
import RoleList from '../../views/sandbox/enterprises/RoleList'
import UserList from '../../views/sandbox/enterprises/UserList'
import DepartmentList from '../../views/sandbox/enterprises/DepartmentList'
import DeviceList from '../../views/sandbox/enterprises/DeviceList'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import StorageUtil from '../../util/StorageUtil'
import axios from 'axios'

const LocalRouterMap = {
    "/home": Home,
    "/Enterprises/user": UserList,
    "/Enterprises/role": RoleList,
    "/Enterprises/right": RightList,
    "/Enterprises/department": DepartmentList,
    "/Bussiness/device": DeviceList    
}
function ContentRoute(props) {

    const [UserRouteList, setUserRouteList] = useState([])
    console.log( StorageUtil.localStorageGet("token").token)
    useEffect(() => {
        axios.get("/device/system/user/getModulesByUser"
            , { "headers": { "token": StorageUtil.localStorageGet("token").token } })
            .then(res => {
                setUserRouteList(res.data.data)
            }).catch(err => {
                console.log(err)
            })
    }, [])
    const checkRout = (item) =>{
        //console.log(item.url);
        //return true;
        return LocalRouterMap[item.url]
    }
    return (
        <Spin size="large" tip="Loading..." spinning={props.isLoading}>
        <Switch>
            {/* <Route path="/home" component={Home} />
            <Route path="/Enterprises/user" component={UserList} />
            <Route path="/Enterprises/role" component={RoleList} />
            <Route path="/Enterprises/right" component={RightList} /> */}
            {
                UserRouteList.map(item => 
                    {
                        if(checkRout(item)){
                            return <Route path={item.url} key={item.url} component={LocalRouterMap[item.url]} exact/>
                        }
                        return null
                    }
                )
            }
            <Redirect from="/" to="/home" exact />
            {
                UserRouteList.length>0&&<Route path="*" component={NoPermission} />
            }
        </Switch>
        </Spin>
    )
}
const mapStateToProps = ({LoadingReducer:{isLoading}})=>{
    return {
        isLoading
    }
}
export default connect(mapStateToProps)(ContentRoute)