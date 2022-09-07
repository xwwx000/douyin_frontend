//解构json对象 拿出rights
const {role:{rights}} = JSON.parse(localStorage.getItem("token"))