import React, {Component} from 'react';
import majors from '../../config/major'
import config from '../../config/basicConfig'
import '../../App.css';
import axios from 'axios';

let host = config.host;
let port = config.back_end_port;
let url = host + ':' + port;

class Student extends Component{
    constructor(props){
        super(props);
        this.state={
            stulist:[]
        }
        this.search = this.search.bind(this)
        this.studentProfile = this.studentProfile.bind(this)
    }
    componentWillMount(){
        axios.defaults.withCredentials = true;
        axios.get(url + '/student/studentList')
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data.length == 0){
                        alert('no such student!')
                        this.setState({
                            stulist:[]
                        })

                    }else{
                        this.setState({
                            stulist:response.data
                        })
                    }
                }else{
                    
                }})
    }

    search(e){
        e.preventDefault();
        let paramdata = {
            name:e.target.Name.value,
            major:e.target.Major.value,
            skill:e.target.Skill.value,
        }
        axios.defaults.withCredentials = true;
        axios.get(url + '/student/studentList?name='+paramdata.name+'&&major='+paramdata.major+'&&skill='+paramdata.skill)
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data.length == 0){
                        alert('no such student!')
                        this.setState({
                            stulist:[]
                        })

                    }else{
                        this.setState({
                            stulist:response.data
                        })
                    }
                }else{
                    
                }})
        
    }

    studentProfile(id){
        this.props.history.push("/sprofile", {
            stu_id:id
        });
    }


    render(){
        return(
            <div class="col-md-12 ">
                <div class = "cprofile_card img" style = {{'width':'100%'}}>
                <h3 class="center">Students List </h3>

                <form onSubmit={this.search} class='img' style = {{'width': '43%'}}>
                <input type="text" class="" name="Name" placeholder="Student/College Name" style = {{'width': '28%'}}></input>
                
                
                <input type="text" class="" style = {{'margin-left':'30px'}} name="Skill" placeholder="Skill"/>
                <select  style = {{'margin-left':'30px'}} ref = "" name="Major" >
                    <option  value="" >All</option>
                        {
                            majors.map((m) =>(
                                <option  value={m} >{m}</option>
                            ))
                        }
                </select>
                <button type="submit" class="glyphicon glyphicon-search "style = {{'margin-left':'30px'}}></button>
                </form>
                </div>

                    {this.state.stulist.map( (stu,index) => (
                    <div class = "education_box" >
                        <p style = {{}}>Student Id:<h4 class='inline'>{stu.id}</h4></p>
                        <p style = {{}}>Student Name:<a onClick = {()=>this.studentProfile(stu.id)}><h4 class='inline'>{stu.name}</h4></a></p>
                        <p style = {{}}>College Name:<h4 class='inline'>{stu.collegeName}</h4></p>
                        <p style = {{}}>Skills:<h4 class='inline'>{stu.skills}</h4></p>
                    </div>
                ))}
            </div>
        )
    }

}

export default Student;