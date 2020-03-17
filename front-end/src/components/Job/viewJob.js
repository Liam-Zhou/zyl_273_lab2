import React, {Component} from 'react';
import config from '../../config/basicConfig'
import '../../App.css';
import axios from 'axios';
import PDF from 'react-pdf-js';

let host = config.host;
let port = config.back_end_port;
let url = host + ':' + port;


class viewJob extends Component{
    constructor(props){
        super(props);
        this.state={
            joblist:[],
            job_id_now:'',
            studentlist:[],
            updateStatuMessage:'',
            filePath:'',
            //pdf_show:'none'
        }
        this.getStulist = this.getStulist.bind(this)
        this.changestatus = this.changestatus.bind(this)
        this.studentProfile = this.studentProfile.bind(this)
        this.checkResume = this.checkResume.bind(this)
        this.pdfCancel = this.pdfCancel.bind(this)
    }
    componentWillMount(){
        let getInfoUrl = ''
        let user = ''
        if(sessionStorage.getItem('user')){
             user =  JSON.parse(sessionStorage.getItem('user'));
             getInfoUrl = url + '/job/getJobList?id='+user.id
        }
        axios.defaults.withCredentials = true;
        axios.get(getInfoUrl)
        .then(response => {
            if(response.status === 200){
                console.log('response.data',response.data)
                if(response.data){
                    let jobs = response.data;
                    this.setState({
                        joblist:jobs
                    })
                }else{

                }
            }
        })

    }

    getStulist(id){
        this.setState({
            job_id_now:id,
            filePath:''
        })
        let getInfoUrl = url + '/job/getStuList?id='+id;
        axios.defaults.withCredentials = true;
        axios.get(getInfoUrl)
        .then(response => {
            if(response.status === 200){
                console.log('response.data',response.data)
                if(response.data){
                    let ss = response.data;
                    this.setState({
                        studentlist:ss
                    })
                }else{

                }
            }
        })
    }

    changestatus(stu,index){
        
        let status = this.refs['s'+index].value
        let stu_id = stu.student_id
        let job_id = this.state.job_id_now
        let para = {
            status:status,
            stu_id:stu_id,
            job_id:job_id
        }
        let getInfoUrl = url + '/job/changeStatus';
        axios.defaults.withCredentials = true;
        axios.put(getInfoUrl,para)
        .then(response => {
            if(response.status === 200){
                if(response.data != 'success'){
                    alert(response.data)
                }else{
                    alert('update success!!');
                    this.componentWillMount();
                }
            }
        })

        console.log('para',para)

    }
    studentProfile(id){
        this.props.history.push("/sprofile", {
            stu_id:id
        });
    }
    checkResume(stu){
        let stu_id = stu.student_id
        let job_id = this.state.job_id_now
        let fileName = stu_id+'-'+job_id
        let img = require(`../../files/${fileName}`);
        
        let show = <div><h3>Resume:</h3>
        <PDF file = {img} ></PDF> <br></br>
        <button onClick = {this.pdfCancel}>cancel</button>
        </div>

        this.setState({
            filePath:show
        })
    }
    pdfCancel(){
        this.setState({
            filePath:''
        })
    }

    render(){
        return (
            <div>

            <div class="col-md-6">
                <div class = 'profile_card' style = {{'margin-left': '0px'}}>
                    <h2>Posted Jobs</h2>
                    {this.state.joblist.map( (job,index) => (
                    <div class = "education_box" >
                        <button type = "button" style = {{}} onClick = {()=>this.getStulist(job._id)} class = "glyphicon glyphicon-triangle-right edit-right">studentlist</button>
                        <p style = {{}}>ID:<h4 class='inline'>{job._id}</h4></p>
                        
                        <p style = {{}}>Job Title:<h4 class='inline'>{job.jobTitle}</h4></p>
                        
                        <p style = {{}}>Posting Date:<h4 class='inline'>{job.postingDate}</h4></p>
                        
                        <p style = {{}}>Deadline:<h4 class='inline'>{job.deadline}</h4></p>
                        
                        <p style = {{}}>Location:<h4 class='inline'>{job.location}</h4></p>
                        
                        <p style = {{}}>Salary:<h4 class='inline'>{job.salary}</h4></p>
                        
                        <p style = {{}}>Description:<h4 class='inline'>{job.description}</h4></p>
                        
                        <p style = {{}}>Category:<h4 class='inline'>{job.category}</h4></p>
                        
                        <p >{this.state.updateEduMessage}</p>
                    </div>
                ))}

                </div>
            </div>

            <div class="col-md-6">
                <div class = 'profile_card' style = {{'margin-left': '0px'}}>
                <h2>student list</h2>
                
                 {this.state.filePath}
                
                <table class="table">
                            <thead>
                                <tr>
                                    <th>Stu_id</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Resume</th>
                                    <th>Status</th>
                                    <th>operation</th>
                                </tr>
                            </thead>
                            <tbody>

                                {this.state.studentlist.map((stu,index)=>(
                                        <tr>
                                            <td>{stu.student_id}</td>
                                            <td><a onClick = {()=>this.studentProfile(stu.student_id)}>{stu.name}</a></td>
                                            <td>{stu.email}</td>
                                            <td><button onClick={()=>this.checkResume(stu,index)}>check Resume</button></td>
                                            <td>
                                                <select ref = {'s'+index} defaultValue={stu.status} name={"status"+index} >
                                                <option name="s" value="pending">Pending</option>
                                                <option name="s" value="reviewed">Reviewed</option>
                                                <option name="s" value="declined">Declined</option>
                                                </select>
                                            </td>
                                            <td><button onClick={()=>this.changestatus(stu,index)}>save status</button></td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                </div>
            </div>
                    
            </div>
        )
    }
}

export default viewJob;