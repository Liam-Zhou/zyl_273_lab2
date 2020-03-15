
  let getbasic = (payload) =>{
    return { type: 'GETBASIC', payload};
  }
  
  let f = {};
  f.getbasic = getbasic;
  export default f ;