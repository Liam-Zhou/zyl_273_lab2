import React, {Component} from 'react';
import config from '../../config/basicConfig'
import '../../App.css';
import axios from 'axios';

let host = config.host;
let port = config.back_end_port;
let url = host + ':' + port;

class appliedJob extends Component{
    constructor(props){
        super(props);
        this.state={
            joblist:[]
        }
        this.search =this.search.bind(this)
    }
    componentWillMount(){
        let stu_id;
        if(JSON.parse(sessionStorage.getItem('user')).role == 'student'){
            let user =  JSON.parse(sessionStorage.getItem('user'));
            stu_id = user.id
        }

        axios.defaults.withCredentials = true;
        axios.get(url + '/job/searchJobByStatus?stu_id='+stu_id)
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data.length == 0){
                        alert('no such jobs!')
                        this.setState({
                            joblist:[]
                        })
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
        let stu_id;
        if(JSON.parse(sessionStorage.getItem('user')).role == 'student'){
            let user =  JSON.parse(sessionStorage.getItem('user'));
            stu_id = user.id
        }
        let status = e.target.status.value;
        axios.defaults.withCredentials = true;
        axios.get(url + '/job/searchJobByStatus?status='+status+'&&stu_id='+stu_id)
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data.length == 0){
                        alert('no such jobs!')
                        this.setState({
                            joblist:[]
                        })
                    }else{
                        this.setState({
                            joblist:response.data
                        })
                    }
                }else{
                    
                }})
    }

    render(){
        return(
            <div class="img">
                <div class = "cprofile_card img" style = {{'width':'100%'}}>
                <h3 class="center">Applied Job </h3>

                <form onSubmit={this.search} class='img' style = {{'width': '55%'}}>
                <label class="radio-inline" style = {{'margin-left':'30px'}}>
                                <input type="radio" name="status"  value="pending"/> Pending
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="status"  value="reviewed"/> Reviewed
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="status"  value="declined"/> Declined
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="status"  value=""/> All
                            </label>
                    
                <button type="submit" class="glyphicon glyphicon-search "style = {{'margin-left':'30px'}}></button>
                </form>

                    {this.state.joblist.map( (job,index) => (
                    <div class = "education_box" >
                        <p style = {{}}>Job Title:<h4 class='inline'>{job.jobTitle}</h4></p>
                        <p style = {{}}>Location:<h4 class='inline'>{job.location}</h4></p>
                        <p style = {{}}>Company Name:<h4 class='inline'>{job.name}</h4></p>
                        <p style = {{}}>Status:<h4 class='inline'>{job.status}</h4></p>
                        <p style = {{}}>Deadline:<h4 class='inline'>{job.deadline}</h4></p>
                        <p style = {{}}>Applied Date:<h4 class='inline'>{job.applied_date}</h4></p>
                        
                        <p >{this.state.updateEduMessage}</p>
                    </div>
                ))}
                </div>
            </div>
        )
    }


}

export default appliedJob;