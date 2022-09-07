import React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from '../views/login/Login'
import Detail from '../views/other/Detail'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import StorageUtil from '../util/StorageUtil'
import {ConfigProvider} from 'antd'
import cn from 'antd/es/locale/zh_CN'
import Monitor from '../views/monitor/Monitor'
export default function App() {
    function isAuth() {
       // return localStorage.getItem("token")
       return StorageUtil.localStorageGet("token")
    }
    return (
        <ConfigProvider locale={cn}>
        <HashRouter>
            <Switch>
                <Route path="/monitor" component={Monitor} />
                <Route path="/login" component={Login} />
                <Route path="/detail" component={Detail}/>
                <Route path="/" render={() =>
                    isAuth() ? <NewsSandBox /> : <Redirect to="/login" />
                } />
            </Switch>
        </HashRouter>
        </ConfigProvider>
    )
}
