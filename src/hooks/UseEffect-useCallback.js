import React, { useState,useCallback } from 'react'

export default function App() {
    const [text,setText] = useState("")
    /**
     * 加上useCallback()再次渲染页面不会重新创建
     */
    const handleChange = useCallback(
        (evt)=>{
            console.log(text)
            setText(evt.target.value)
        },[text]
    )
  return (
    <div>
        <input onChange={handleChange} value={text}/>
        <span>{text}</span>
    </div>
  )
}
