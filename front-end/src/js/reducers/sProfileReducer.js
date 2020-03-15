import axios from 'axios';

const initialState = {
    profiledata_basic:{},
    profiledata_education:[],
    profiledata_workexpe:[]
  };
  
  async function sProfileReducer(state = initialState, action) {
      if (action.type === 'GETBASIC') {
        
        let getInfoUrl = action.payload

        axios.defaults.withCredentials = true;
        // let response = await axios.get(getInfoUrl);
        // if(response.status === 200){
        //     console.log('response.data',response.data)
        //     if(response.data){
        //         let userdata = response.data
                

        //         let x =  Object.assign( {},state,{
        //             profiledata_basic: userdata
        //           });
        //           console.log('x',x)
        //           return x 
        //     }else{
        //     }
        // }else{
            
        // }
        axios.get(getInfoUrl).then(response => {
            if(response.status === 200){
                console.log('response.data',response.data)
                if(response.data){
                    let userdata = response.data
                    
                    let x =  Object.assign( {},state,{
                        profiledata_basic: userdata
                      });
                      console.log('x',x)
                      return x 
                }else{
                }
            }else{
                
            }
        })
      }
  
  
      return state;
    }
    
  export default sProfileReducer;