
const initialState = {
    user:{},
    userList:[]
  };
  
  function loginReducer(state = initialState, action) {
      if (action.type === 'LOGIN') {
        console.log("processing in reducer")
        let x =  Object.assign( {},state, {
          user: action.payload.user
        });
        
        return x 
      }
      if (action.type === 'LOGOUT') {
        console.log("processing in reducer")
        let x =  Object.assign( {},state, {
          message:'',
          user:{},
          profiledata:
            {
              basic : {},
              education : [],
              work_experience : []
            },
          userList:state.userList
        });
        console.log('x',x)
        return x 
      }
      if (action.type === 'ADDUSER') {
  
        let newuser = action.payload
        let x =  Object.assign( {},state,state.userList.push(newuser));
        console.log('x',x)
        return x 
      }
      return state;
    }
    
  export default loginReducer;