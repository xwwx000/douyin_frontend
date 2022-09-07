import React, { useState } from 'react'

export default function App() {

  //useState的参数为初始状态值，返回了一个长度为2的数组，第一个元素就是我们类组件里的state对象，第二个元素是个函数，作用相当于类组件里用的setState。这两个元素的名字随便是什么都可以
  const [state, setState] = useState({ text: "", checked: false });
  const [name,setName] = useState({a:1,b:"abc"});
  //此函数的参数为整个state的部分内容，在调用setState的时候，用这个部分内容更新对应的老的内容
  console.log(state)
  console.log(name)
  const add = ()=>{
    setName({a:2,b:"abcd"})
  }
  return (
    <div>
      <input
        type="text"
        value={state.text}
        onChange={e =>
          setState({
            text: e.target.value
          })
        }
      />
      <button onClick={()=>{
        add()
      }}>点击</button>
    </div>

  );
/*

  //useState的参数为初始状态值，返回了一个长度为2的数组，第一个元素就是我们类组件里的state对象，第二个元素是个函数，作用相当于类组件里用的setState。这两个元素的名字随便是什么都可以
  const [state, setState] = useState({ text: "", checked: false });
  //此函数的参数为整个state的部分内容，在调用setState的时候，用这个部分内容更新对应的老的内容
  console.log(state)
  const updateState = partialState =>
    setState(oldState => ({
      ...oldState,
      ...partialState
    }));
  return (
    <div>
      <input
        type="text"
        value={state.text}
        onChange={e =>
          updateState({
            text: e.target.value
          })
        }
      />
      <input
        type="checkbox"
        checked={state.checked}
        onChange={() => updateState({ checked: !state.checked })}
      />
      <ul>
        <li>{state.text}</li>
        <li>{state.checked.toString()}</li>
      </ul>
    </div>
  );
  */
}
