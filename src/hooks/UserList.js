import React, { useState,useEffect } from 'react'
import axios from 'axios';
export default function UserList() {
    const [searchFormData,setSearchFormData] = useState({"userName":""})
    const [userListData,setUserListData] = useState([])
    function search(){
        setSearchFormData({...setSearchFormData})
    }
    const userChange = (value)=>{
        setSearchFormData({...searchFormData,"userName":value})
    }
    useEffect(() => {
        console.log("searchFormData",searchFormData)
        axios.get("/device/system/dept/deptListWithTree",
          {
            "headers": { "token": JSON.parse(localStorage.getItem("token")).token }
          })
          .then(res => {
            const list = res.data.data
            setUserListData(list)
          }).catch(err => {
            console.log(err)
          })
      }, [searchFormData]);
  return (
    <div>
        用户名称:<input value={searchFormData && searchFormData.userName} onChange={(evt)=>{
            userChange(evt.target.value)
        }}/>
        <button onClick={()=>{
            search()
        }}>查询</button>
    </div>
  )
}
