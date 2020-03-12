import React, {Component} from 'react';
import config from '../../config/basicConfig'
import majors from '../../config/major'
import '../../App.css';
import axios from 'axios';
import TimePicker from 'timepicker.js';

let host = config.host;
let port = config.back_end_port;
let url = host + ':' + port;

class viewEvent extends Component{
    constructor(props){
        super(props);
        this.state={
            eventlist:[],
            event_id_now:'',
            studentlist:[],

            addEventMessage:'',
            listlength:[]

        }
        this.addEduBox = this.addEduBox.bind(this)
        this.cancelEduBox = this.cancelEduBox.bind(this)
        this.submit = this.submit.bind(this)
        this.getStulist = this.getStulist.bind(this)
        this.studentProfile = this.studentProfile.bind(this)
    }

    componentWillMount(){
        let getInfoUrl = ''
        let user = ''
        if(sessionStorage.getItem('user')){
             user =  JSON.parse(sessionStorage.getItem('user'));
             getInfoUrl = url + '/event/getEventList?id='+user.id
        }
        axios.defaults.withCredentials = true;
        axios.get(getInfoUrl)
        .then(response => {
            if(response.status === 200){
                console.log('response.data',response.data)
                if(response.data){
                    let event = response.data;
                    this.setState({
                        eventlist:event
                    })
                }else{

                }
            }
        })


    }
    addEduBox(){
        this.setState({
            listlength:[1]
        })
    }
    cancelEduBox(){
        this.setState({
            listlength:[]
        })
    }
    submit(e){
        e.preventDefault();
        let user =  JSON.parse(sessionStorage.getItem('user'));

        let param = {
            id:user.id,
            eventName:e.target.name.value,
            des:e.target.des.value,
            time:e.target.time.value,
            date:e.target.date.value,
            location:e.target.location.value,
            eligibility: e.target.eligibility.value
        }
    
    axios.defaults.withCredentials = true;
    axios.post(url + '/event/addEvent',param)
        .then(response => {
            if(response.status === 200){
                console.log('response.data',response.data)
                if(response.data != 'success'){
                    this.setState({
                        addEventMessage : response.data
                    })
                }else{
                    alert('success!!');
                    this.componentWillMount();
                    this.setState({
                        listlength:[],
                        addEventMessage:''
                    })
                }
            }else{
                
            }
        })
    }
    getStulist(id){
        this.setState({
            event_id_now:id
        })
        let getInfoUrl = url + '/event/getStuList?id='+id;
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
    studentProfile(id){
        this.props.history.push("/sprofile", {
            stu_id:id
        });
    }

    render(){
        return (
            <div>
                <div class="col-md-6">
                <div class = 'profile_card' style = {{'margin-left': '0px'}}>
                    <h2>Posted Events</h2>
                    {this.state.eventlist.map( (event,index) => (
                    <div class = "education_box" >
                        <button type = "button" style = {{}} onClick = {()=>this.getStulist(event.id)} class = "glyphicon glyphicon-triangle-right edit-right">studentlist</button>
                        <p style = {{}}>ID:<h4 class='inline'>{event.id}</h4></p>
                        
                        <p style = {{}}>Event Name:<h4 class='inline'>{event.name}</h4></p>
                        
                        <p style = {{}}>Date:<h4 class='inline'>{new Date(event.time).getFullYear()+'/'+new Date(event.time).getMonth()+
                            '/'+new Date(event.time).getDate()+'  '+new Date(event.time).getHours()+':'+new Date(event.time).getMinutes()
                        }</h4></p>
                        
                        <p style = {{}}>Location:<h4 class='inline'>{event.location}</h4></p>
                        
                        <p style = {{}}>Description:<h4 class='inline'>{event.description}</h4></p>
                        
                        <p style = {{}}>Eligibility:<h4 class='inline'>{event.eligibility}</h4></p>
                        
                    </div>
                ))}

                    {/* add new education */}
                    {
                 this.state.listlength.map(() => (
                    <div class = "education_box">
                    <form onSubmit={this.submit}>
                    <p class = "">Event Name: <input type="text" class="" name="name"  required/></p>
                    <p class = "">Description: <input type="text" class="" name="des"  required/></p>
                    <p class = "">Time: <input type="time" name="time" required/></p>
                    {/* <p class = "">Time: <input  type="text" id="time" placeholder="Time" required/></p> */}
                    <p class = "">Date: <input type="date" class="" name="date"  required/></p>
                    <p class = "">Location: <input type="text" class="" name="location"  required/></p>
                    <p class = "">Eligibility: 
                    <select ref = "" name="eligibility" >
                    <option  value="All" >All</option>
                        {
                            majors.map((m) =>(
                                <option  value={m} >{m}</option>
                            ))
                        }
                    </select>        
                    </p>
                    
                    {/* <input   type="text" class="" name="name"  placeholder={"name:  "}/> */}
                    <div class='img' style = {{'margin-bottom':'10px'}}>
                        <button type="submit" class='btn btn-success'>save</button>
                        <button type="reset" style = {{'margin-left':'150px'}} class='btn btn-danger'>reset</button>
                    </div>
                    <p >{this.state.AddEventMessage}</p>
                    </form>
                    </div>
                        ))
                    }
                    <p  class='img'>Want add more events?&nbsp;&nbsp;
                    <a onClick = {this.addEduBox} class="navbar-link">add</a>
                    &nbsp;&nbsp;or&nbsp;&nbsp;
                    <a onClick = {this.cancelEduBox}>cancel</a>
                    </p>
                </div>
                </div>


                <div class="col-md-6">
                <div class = 'profile_card' style = {{'margin-left': '0px'}}>
                <h2>student list</h2>
                <table class="table">
                            <thead>
                                <tr>
                                    <th>Stu_id</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>

                                {this.state.studentlist.map((stu,index)=>(
                                        <tr>
                                            <td>{stu.student_id}</td>
                                            <td><a onClick = {()=>this.studentProfile(stu.student_id)}>{stu.name}</a></td>
                                            <td>{stu.email}</td>
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

export default viewEvent;