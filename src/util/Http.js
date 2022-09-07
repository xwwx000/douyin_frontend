import axios from "axios";
import {store} from '../redux/store'
axios.defaults.baseURL = "http://127.0.0.1:9090"

axios.interceptors.request.use(function(config){
    //在拦截器中加载数据查询loading窗口
    store.dispatch({
        type:"change_loading",
        payload:true
    })
    return config;
},function(error){
    return Promise.reject(error);
});

axios.interceptors.response.use(function(response){
    //在拦截器中获得响应后关闭loading窗口
    store.dispatch({
        type:"change_loading",
        payload:false
    })
    return response;
},function(error){
    //在拦截器中获得响应后关闭loading窗口
    store.dispatch({
        type:"change_loading",
        payload:false
    })
    return Promise.reject(error);
});