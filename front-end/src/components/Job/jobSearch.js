import React, {Component} from 'react';
import config from '../../config/basicConfig'
import '../../App.css';
import axios from 'axios';

let host = config.host;
let port = config.back_end_port;
let url = host + ':' + port;

class jobSearch extends Component{
    constructor(props){
        super(props);
        this.state={
            joblist:[],
            job:{},
            showButton:'none',
            applymessage:''
        }
        this.search = this.search.bind(this)
        this.getDetail = this.getDetail.bind(this)
        this.showCancel = this.showCancel.bind(this)
        this.apply = this.apply.bind(this)
        this.companyProfile = this.companyProfile.bind(this)
    }
    componentWillMount(){
        axios.defaults.withCredentials = true;
        axios.get(url + '/job/searchJob')
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data.length == 0){
                        alert(response.data)
                    }else{
                        this.setState({
                            joblist:response.data
                        })
                    }
                }else{
                    
                }})
    }
    search(e){
        e.preventDefault();
        let paramdata = {
            name:e.target.nameOrTitle.value,
            location:e.target.location.value,
            category:e.target.category.value,
        }
        axios.defaults.withCredentials = true;
        axios.get(url + '/job/searchJob?name='+paramdata.name+'&&location='+paramdata.location+'&&category='+paramdata.category)
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data.length == 0){
                        alert('no such jobs!')
                        this.setState({
                            joblist:[],
                            job:{}
                        })

                    }else{
                        this.setState({
                            
                            joblist:response.data
                        })
                    }
                }else{
                    
                }})

    }
    apply(e){
        e.preventDefault();
        let file = e.target.file.files[0]
        console.log('file',file)
        if(sessionStorage.getItem('user')){
           let stu_id = JSON.parse(sessionStorage.getItem('user')).id;
           let job_id = this.state.job.id;
           let param = {
                stu_id:stu_id,
                job_id:job_id
           }
           let params = new FormData();
           params.append('stu_id',param.stu_id)
           params.append('job_id',param.job_id)
           params.append('file',file)

           axios.defaults.withCredentials = true;
           axios.post(url + '/job/applyJob',params,{headers: {'Content-Type': 'multipart/form-data'}})
               .then(response => {
                   if(response.data == 'success'){
                       console.log('response.data',response.data)
                        alert("success")

                   }else{
                    this.setState({
                        applymessage:response.data
                       })
                   }})
        }
    }

    getDetail(job){
        this.setState({
            showButton:"block",
            job:job,
            applymessage:''
        })
    }
    showCancel(){
        this.setState({
            showButton:"none",
            job:{}
        })
    }

    companyProfile(){
        let company_id = this.state.job.company_id;
        this.props.history.push("/cprofile", {
            com_id:company_id
            });
    }

    render(){
        return (
            <div>
            
            <div class="col-md-12 ">
                <div class = 'profile_card' style = {{'margin-left': '0px'}}>
                    <form onSubmit={this.search} class='img' style = {{'width': '70%'}}>
                    <input type="text" class="" name="nameOrTitle" placeholder="Name or Title"></input>
                    
                    <input type="text" class="" style = {{'margin-left':'30px'}} name="location" placeholder="Location"/>

                    
                    <label class="radio-inline" style = {{'margin-left':'30px'}}>
                                <input type="radio" name="category"  value="fulltime"/> full time
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="category"  value="parttime"/> part time
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="category"  value="intern"/> intern
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="category"  value="oncampus"/> on campus
                            </label>
                    
                    <button type="submit" class="glyphicon glyphicon-search "style = {{'margin-left':'30px'}}></button>
                    </form>
                </div>
            </div>


            <div class="col-md-6">
                <div class = 'profile_card' style = {{'margin-left': '0px'}}>
                    <h2>Job List</h2>
                    {this.state.joblist.map( (job,index) => (
                    <div class = "education_box" >
                        <button type = "button" style = {{}} onClick = {()=>this.getDetail(job)} class = "glyphicon glyphicon-triangle-right edit-right">detail</button>
                        <p style = {{}}>ID:<h4 class='inline'>{job.id}</h4></p>
                        <p style = {{}}>Company Name:<h4 class='inline'>{job.name}</h4></p>
                        <p style = {{}}>Job Title:<h4 class='inline'>{job.jobTitle}</h4></p>
                        <p style = {{}}>Location:<h4 class='inline'>{job.location}</h4></p>
                        <p style = {{}}>Category:<h4 class='inline'>{job.category}</h4></p>
                         
                        <p >{this.state.updateEduMessage}</p>
                    </div>
                ))}

                </div>
            </div>

            <div class="col-md-6">
                <div class = 'profile_card' style = {{'margin-left': '0px'}}>
                <h2>Job Detail</h2>
                <form onSubmit={this.apply}>
                <p style = {{}}>Company Name:<a class='inline' onClick = {this.companyProfile}>{this.state.job.name}</a></p>
                <p style = {{}}>Posting Date:<h4 class='inline'>{this.state.job.postingDate}</h4></p>
                <p style = {{}}>Deadline:<h4 class='inline'>{this.state.job.deadline}</h4></p>
                <p style = {{}}>Salary:<h4 class='inline'>{this.state.job.salary}</h4></p>
                <p style = {{}}>Description:<h4 class='inline'>{this.state.job.description}</h4></p>
                <input type="file" accept=".pdf" name="file" id="file" style = {{'display':this.state.showButton}} required/>

                <div class='img' style = {{'margin-top':'10px','margin-bottom':'10px','display':this.state.showButton}} >
                    <button type = 'submit' class='btn btn-success'>apply</button>
                    <button type = 'reset' style = {{'margin-left':'50px'}} onClick = {this.showCancel} class='btn btn-danger'>cancel</button>
                </div>
                <div><h4>{this.state.applymessage}</h4></div> 
                </form>
                </div>
            </div>
                    
            </div>
        )
    }
}
export default jobSearch;