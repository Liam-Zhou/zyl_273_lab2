let updateMessage = (payload) => {
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


export  {updateMessage,clearUser,adduser,updatebasic}