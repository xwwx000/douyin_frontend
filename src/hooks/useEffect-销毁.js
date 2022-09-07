import React, { useEffect } from 'react'

export default function App() {
  useEffect(()=>{
    window.onreset = ()=>{
        console.log("resize")
    }
    var timer = setInterval(()=>{
        console.log("111")
    },1000)

    //销毁位置
    /**
     * 如果[]中有依赖，每次更新和销毁的时候执行。
     * 如果[]中没有依赖，在销毁的时候执行
     */
    return ()=>{
        window.onresize = null
        clearInterval(timer)
    }
  },[])  
  return (
    <div>App</div>
  )
}
