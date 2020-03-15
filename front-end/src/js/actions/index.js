import f from './sProfileAction'


let login = (payload) => {
  console.log("dispatching the action")
  return { type: 'LOGIN', payload };
}

let clearUser = () =>{
  return { type: 'LOGOUT' };
}

let adduser = (payload) =>{
  return { type: 'ADDUSER', payload};
}

let updatebasic = (payload) =>{
  return { type: 'UPDATEBASIC', payload};
}

f.login = login;
console.log('f',f.login)
export default f;
//export  {login,clearUser,adduser,updatebasic}