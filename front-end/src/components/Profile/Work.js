import config from '../../config/basicConfig'
import React, {Component} from 'react';
import '../../App.css';
import { connect } from "react-redux";
import axios from 'axios';

let host = config.host;
let port = config.back_end_port;
let url = host + ':' + port;



class WorkPart extends Component{
    constructor(props){
        super(props);
        this.state = {
            worklist:[],
            read_style:[],
            edit_style:[],
            index_now:null,

            listlength:[],

            showbutton:'block',
            showadd:'block',

            AddWorkMessage:'',
            updateWorkMessage:'',
            
        }
        this.addWorkBox = this.addWorkBox.bind(this)
        this.cancelWorkBox = this.cancelWorkBox.bind(this)
        this.InfoEdit = this.InfoEdit.bind(this)
        this.cancel = this.cancel.bind(this)

        this.update = this.update.bind(this)
        this.submit = this.submit.bind(this)
        this.delete = this.delete.bind(this)
    }

    componentWillMount(){
        let getInfoUrl = ''
        let user = ''

        if(this.props.stu_id){
            getInfoUrl = url + '/profile/getStuWorkInfo?id='+this.props.stu_id
            this.setState({
                showadd:'none',
                showbutton:'none'
            })
        }else{
            if(sessionStorage.getItem('user')){
                user =  JSON.parse(sessionStorage.getItem('user'));
                getInfoUrl = url + '/profile/getStuWorkInfo?id='+user.id
           }
        }
        
        
             axios.defaults.withCredentials = true;
             axios.get(getInfoUrl)
             .then(response => {
                 if(response.status === 200){
                     console.log('response.data',response.data)
                     if(response.data){
                         let experiences = response.data;
                         let length = experiences.length;
                         let read = [];let edit = [];
                         for(let i = 0; i<length; i++){
                             read[i] = 'block';
                             edit[i] = 'none';
                         }
                         this.setState({
                            worklist: experiences,
                            read_style: read,
                            edit_style: edit
                         })
                         
                     }else{
        
                     }
                    }else{
                        
                    }
                })
    }

    update(e){
        e.preventDefault();
        let index = this.state.index_now;

        let paramdata = {
            workid: e.target['id'+index].value,
            companyname: e.target['name'+index].value,
            location: e.target['location'+index].value,
            title: e.target['title'+index].value,
            startdate: e.target['startDate'+index].value,
            enddate: e.target['endDate'+index].value,
            des: e.target['des'+index].value
        }
        console.log('update data',paramdata)
        axios.defaults.withCredentials = true;
        axios.put(url + '/profile/updateStuWork',paramdata)
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data != 'success'){
                        this.setState({
                            updateWorkMessage : response.data
                        })
                    }else{
                        alert('update success!!');
                        this.componentWillMount();
                        }
                    }else{
                    
                    }
                })
    }
    InfoEdit(index){
        let read = this.state.read_style;
        let edit = this.state.edit_style;
        for(let i = 0;i < read.length ; i++){
            if(i == index){
                read[i] = 'none';
                edit[i] = 'block';
            }else{
                read[i] = 'block';
                edit[i] = 'none';
            }
        }
        this.setState({
            read_style:read,
            edit_style:edit,
            index_now:index,
            listlength:[]
        })
    }
    cancel(index){
        let read = this.state.read_style;
        let edit = this.state.edit_style;
        read[index] = 'block';
        edit[index] = 'none';
        this.setState({
            read_style:read,
            edit_style:edit,
            index_now:null,
        })
    }
    delete(id){
        axios.defaults.withCredentials = true;
        axios.delete(url + '/profile/deleteStuWork?id='+id)
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data != 'success'){
                        this.setState({
                            updateWorkMessage : response.data
                        })
                    }else{
                        alert('delete success!!');
                        this.componentWillMount();
                    }
                }})
    }
    
    
    submit(e){
        e.preventDefault();
        let user =  JSON.parse(sessionStorage.getItem('user'));
        let param = {
            id:user.id,
            companyName:e.target.name.value,
            location:e.target.location.value,
            title: e.target.title.value,
            startdate: e.target.startdate.value,
            enddate:e.target.enddate.value,
            des:e.target.description.value
        }
        console.log('param',param)
        axios.defaults.withCredentials = true;
        axios.post(url + '/profile/addStuWork',param)
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data != 'success'){
                        this.setState({
                            AddWorkMessage : response.data
                        })
                    }else{
                        alert('success!!');
                        this.componentWillMount();
                        this.setState({
                            listlength:[],
                            AddWorkMessage:''
                        })
                    }
                }else{
                    
                }
            })


    }
    addWorkBox(){
        let index_now = this.state.index_now
        this.cancel(index_now)
        this.setState({
            listlength:[1]
        })
    }
    cancelWorkBox(){
        this.setState({
            listlength:[]
        })
    }

    render(){
        return(
            <div class = "profile_education_card" style = {{'margin-top':'30px','margin-bottom':'90px'}}>
                <h3>work experience</h3>

                {/* show work experience list */}
                {this.state.worklist.map( (work,index) => (
                    <div class = "education_box" id = {index}>
                        <form onSubmit={this.update}>
                        <button type = "button" style = {{'display':this.state.showbutton}} onClick = {()=>this.InfoEdit(index)} class = "glyphicon glyphicon-edit edit-right"></button>
                        <p style = {{'display':this.state.read_style[index]}}>ID:<h4 class='inline'>{work.id}</h4></p>
                        <p style = {{'display':this.state.edit_style[index]}}>ID:<input type="text"  name={"id"+(index)} defaultValue={work.id}  disabled/></p>
                       
                        <p style = {{'display':this.state.read_style[index]}}>Company Name:<h4 class='inline'>{work.companyName}</h4></p>
                        <p style = {{'display':this.state.edit_style[index]}}>Company Name: <input type="text" class="" name={"name"+(index)} defaultValue={work.companyName}/></p>
                        
                        <p style = {{'display':this.state.read_style[index]}}>Title:<h4 class='inline'>{work.title}</h4></p>
                        <p style = {{'display':this.state.edit_style[index]}}>Title: <input type="text" class="" name={"title"+(index)} defaultValue={work.title} /></p>
                    
                        <p style = {{'display':this.state.read_style[index]}}>Location:<h4 class='inline'>{work.location}</h4></p>
                        <p style = {{'display':this.state.edit_style[index]}}>Location: <input type="text" class="" name={"location"+(index)} defaultValue={work.location} /></p>

                        <p style = {{'display':this.state.read_style[index]}}>Start Date:<h4 class='inline'>{work.startDate}</h4></p>
                        <p style = {{'display':this.state.edit_style[index]}}>Start Date: <input type="date" class="" name={"startDate"+(index)} defaultValue={work.startDate} /></p>

                        <p style = {{'display':this.state.read_style[index]}}>End Date:<h4 class='inline'>{work.endDate}</h4></p>
                        <p style = {{'display':this.state.edit_style[index]}}>End Date: <input type="date" class="" name={"endDate"+(index)} defaultValue={work.endDate} /></p>

                        <p style = {{'display':this.state.read_style[index]}}>Description:<h4 class='inline'>{work.description}</h4></p>
                        <p style = {{'display':this.state.edit_style[index]}}>Description: <input type="text" class="" name={"des"+(index)} defaultValue={work.description} /></p>


                    <div class='img' style = {{'display':this.state.edit_style[index],'margin-bottom':'10px'}}>
                        <button type="submit" class='btn btn-success'>update</button>
                        <button type="reset" style = {{'margin-left':'40px'}} onClick = {()=>this.cancel(index)} class='btn btn-info'>cancel</button>
                        <button type="button" style = {{'margin-left':'40px'}} class='btn btn-danger' onClick = {()=>this.delete(work.id)}>delete</button>
                    </div>
                    <p >{this.state.updateWorkMessage}</p>
                    </form>
                    </div>
                ))}

                {/* add new work experience */}
                {
                 this.state.listlength.map((item,index) => (
                    <div class = "education_box" >
                    <form onSubmit={this.submit}>
                    <p class = "">Company Name: <input type="text" class="" name="name"  required/></p>
                    <p class = "">Title: <input type="text" class="" name="title"  required/></p>
                    
                    <p class = "">Location: <input type="text" class="" name="location"  required/></p>
                    <p class = "">Start Date: <input type="date" class="" name="startdate"  required/></p>
                    <p class = "">End Date: <input type="date" class="" name="enddate"  required/></p>
                    <p class = "">Description: <input type="text" class="" name="description"  required/></p>
                    {/* <input   type="text" class="" name="name"  placeholder={"name:  "}/> */}
                    <div class='img' style = {{'margin-bottom':'10px'}}>
                        <button type="submit" class='btn btn-success'>save</button>
                        <button type="reset" style = {{'margin-left':'150px'}} class='btn btn-danger'>reset</button>
                    </div>
                    <p >{this.state.AddWorkMessage}</p>
                    </form>
                    </div>
                 ))
                }

                <p style = {{'display':this.state.showadd}} class='img'>Want add more work experience?&nbsp;&nbsp;
                <a onClick = {this.addWorkBox} class="navbar-link">add</a>
                &nbsp;&nbsp;or&nbsp;&nbsp;
                <a onClick = {this.cancelWorkBox}>cancel</a>
                </p>
            </div>
            )
        }
    }
    
    export default WorkPart;