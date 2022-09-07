import React from 'react'
//设置缓存
let localStorageSet = (key, data, expire) => {
    const obj = {
        data: data,
        time: Date.now(),
        expire: new Date().getTime() + expire
    };
    localStorage.setItem(key, JSON.stringify(obj));
};
//读取缓存
let localStorageGet = (key) => {
    const storage = localStorage.getItem(key);
    const nowTime = new Date().getTime();
    let result = null;
    if (storage) {
        const obj = JSON.parse(storage);
        if (nowTime < obj.expire) {
            result = obj.data;
            localStorageSet("token", obj.data, expireTime)
        } else {
            localStorage.removeItem(key);
        }
    }
    return result;
};
//1小时超时
let expireTime = 3600 * 1000;
export default {
    localStorageSet: localStorageSet,
    localStorageGet: localStorageGet,
    expireTime:expireTime
}