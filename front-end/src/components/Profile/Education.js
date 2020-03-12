import config from '../../config/basicConfig'
import React, {Component} from 'react';
import majors from '../../config/major'
import '../../App.css';
import axios from 'axios';

let host = config.host;
let port = config.back_end_port;
let url = host + ':' + port;


class EducationPart extends Component{
    constructor(props){
        super(props);
        this.state = {
            educationlist:[],
            read_style:[],
            edit_style:[],
            index_now:null,

            listlength:[],

            showadd:'block',
            showbutton:'block',

            AddEduMessage:'',
            updateEduMessage:''
        }

        this.addEduBox = this.addEduBox.bind(this)
        this.cancelEduBox = this.cancelEduBox.bind(this)

        this.InfoEdit = this.InfoEdit.bind(this)
        this.cancel = this.cancel.bind(this)
        this.delete = this.delete.bind(this)

        this.submit = this.submit.bind(this)
        this.update = this.update.bind(this)
    }
    componentWillMount(){
        let getInfoUrl = ''
        let user = ''
        if(this.props.stu_id){
            getInfoUrl = url + '/profile/getStuEduInfo?id='+this.props.stu_id
            this.setState({
                showadd:'none',
                showbutton:'none'
            })
        }else{
            if(sessionStorage.getItem('user')){
                user =  JSON.parse(sessionStorage.getItem('user'));
                getInfoUrl = url + '/profile/getStuEduInfo?id='+user.id
           }
        }
     axios.defaults.withCredentials = true;
     axios.get(getInfoUrl)
     .then(response => {
         if(response.status === 200){
             console.log('response.data',response.data)
             if(response.data){
                 let educations = response.data;
                 let length = educations.length;
                 let read = [];let edit = [];
                 for(let i = 0; i<length; i++){
                     read[i] = 'block';
                     edit[i] = 'none';
                 }
                 this.setState({
                    educationlist: educations,
                    read_style: read,
                    edit_style: edit
                 })
                 
             }else{

             }
            }else{
                
            }
        })
    }
    

    addEduBox(){
        let index_now = this.state.index_now
        this.cancel(index_now)
        this.setState({
            listlength:[1]
        })
    }
    cancelEduBox(){
        this.setState({
            listlength:[]
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
    submit(e){
        e.preventDefault();
        let user =  JSON.parse(sessionStorage.getItem('user'));

        let param = {
            id:user.id,
            collegeName:e.target.name.value,
            location:e.target.location.value,
            degree: e.target.degree.value,
            major: e.target.major.value,
            passingyear:e.target.passingyear.value,
            cgpa:e.target.cgpa.value
        }
        axios.defaults.withCredentials = true;
        axios.post(url + '/profile/addStudentEdu',param)
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data != 'success'){
                        this.setState({
                            AddEduMessage : response.data
                        })
                    }else{
                        alert('success!!');
                        this.componentWillMount();
                        this.setState({
                            listlength:[],
                            AddEduMessage:''
                        })
                    }
                }else{
                    
                }
            })


    }
    delete(eduid){
        axios.defaults.withCredentials = true;
        axios.delete(url + '/profile/deleteStuEdu?id='+eduid)
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data != 'success'){
                        this.setState({
                            updateEduMessage : response.data
                        })
                    }else{
                        alert('delete success!!');
                        this.componentWillMount();
                    }
                }})
    }
    update(e){
        e.preventDefault();
        let index = this.state.index_now;

        let paramdata = {
            eduid: e.target['id'+index].value,
            collegename: e.target['name'+index].value,
            location: e.target['location'+index].value,
            degree: e.target['degree'+index].value,
            major: e.target['major'+index].value,
            passingyear: e.target['passingyear'+index].value,
            cgpa: e.target['cgpa'+index].value
        }
        console.log('update data',paramdata)
        axios.defaults.withCredentials = true;
        axios.put(url + '/profile/updateStuEdu',paramdata)
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data != 'success'){
                        this.setState({
                            updateEduMessage : response.data
                        })
                    }else{
                        alert('update success!!');
                        this.componentWillMount();
                        }
                    }else{
                    
                    }
                })
    }
    render(){
        return(
            <div class = "profile_education_card">
                <h3 >Education</h3>
                {/* show education list */}
                {this.state.educationlist.map( (education,index) => (
                    <div class = "education_box" id = {index}>
                        <form onSubmit={this.update}>
                        <button type = "button" style = {{'display':this.state.showbutton}} onClick = {()=>this.InfoEdit(index)} class = "glyphicon glyphicon-edit edit-right"></button>
                        <p style = {{'display':this.state.read_style[index]}}>ID:<h4 class='inline'>{education.id}</h4></p>
                        <p style = {{'display':this.state.edit_style[index]}}>ID:<input type="text"  name={"id"+(index)} defaultValue={education.id}  disabled/></p>
                       
                        <p style = {{'display':this.state.read_style[index]}}>College Name:<h4 class='inline'>{education.collegeName}</h4></p>
                        <p style = {{'display':this.state.edit_style[index]}}>College Name: <input type="text" class="" name={"name"+(index)} defaultValue={education.collegeName}/></p>
                        
                        <p style = {{'display':this.state.read_style[index]}}>Location:<h4 class='inline'>{education.location}</h4></p>
                        <p style = {{'display':this.state.edit_style[index]}}>Location: <input type="text" class="" name={"location"+(index)} defaultValue={education.location} /></p>
                        
                        <p style = {{'display':this.state.read_style[index]}}>Degree:<h4 class='inline'>{education.degree}</h4></p>
                        <p style = {{'display':this.state.edit_style[index]}}>Degree: 
                        <label class="radio-inline" style = {{'margin-left':'5px'}}>
                                <input type="radio" name={"degree"+(index)}  value="bachelor" checked="checked"/> bachelor
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name={"degree"+(index)}  value="master"/> master
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name={"degree"+(index)}  value="doctor"/> doctor
                            </label>
                        </p>

                    <p style = {{'display':this.state.read_style[index]}}>Major:<h4 class='inline'>{education.major}</h4></p>
                    <p style = {{'display':this.state.edit_style[index]}}>Major: <input type="text" class="" name={"major"+(index)} defaultValue={education.major} /></p>
                    
                    <p style = {{'display':this.state.read_style[index]}}>Year of Passing:<h4 class='inline'>{education.passingYear}</h4></p>
                    <p style = {{'display':this.state.edit_style[index]}}>Year of Passing: <input type="text" class="" name={"passingyear"+(index)} defaultValue={education.passingYear} /></p>
                    
                    <p style = {{'display':this.state.read_style[index]}}>current CGPA:<h4 class='inline'>{education.cGPA}</h4></p>
                    <p style = {{'display':this.state.edit_style[index]}}>current CGPA: <input type="number" class="" name={"cgpa"+(index)} step="0.01" defaultValue={education.cGPA} /></p>
                    
                    <div class='img' style = {{'display':this.state.edit_style[index],'margin-bottom':'10px'}}>
                        <button type="submit" class='btn btn-success'>update</button>
                        <button type="reset" style = {{'margin-left':'40px'}} onClick = {()=>this.cancel(index)} class='btn btn-info'>cancel</button>
                        <button type="button" style = {{'margin-left':'40px'}} class='btn btn-danger' onClick = {()=>this.delete(education.id)}>delete</button>
                    </div>
                    <p >{this.state.updateEduMessage}</p>
                    </form>
                    </div>
                ))}

                {/* add new education */}
                {
                 this.state.listlength.map(() => (
                    <div class = "education_box">
                    <form onSubmit={this.submit}>
                    <p class = "">College Name: <input type="text" class="" name="name"  required/></p>
                    <p class = "">Location: <input type="text" class="" name="location"  required/></p>
                    <p class = "">Degree: 
                        <label class="radio-inline" style = {{'margin-left':'5px'}}>
                                <input type="radio" name="degree"  value="bachelor" checked="checked"/> bachelor
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="degree"  value="master"/> master
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="degree"  value="doctor"/> doctor
                            </label>
                    </p>
                    <p class = "">Major: 
                    <select ref = "" name="major" >
                        {
                            majors.map((m) =>(
                                <option  value={m} >{m}</option>
                            ))
                        }
                    </select>  
                    </p>
                    <p class = "">Year of Passing: <input type="text" class="" name="passingyear"  required/></p>
                    <p class = "">current CGPA: <input type="number" class="" name="cgpa" step="0.01" required/></p>
                    {/* <input   type="text" class="" name="name"  placeholder={"name:  "}/> */}
                    <div class='img' style = {{'margin-bottom':'10px'}}>
                        <button type="submit" class='btn btn-success'>save</button>
                        <button type="reset" style = {{'margin-left':'150px'}} class='btn btn-danger'>reset</button>
                    </div>
                    <p >{this.state.AddEduMessage}</p>
                    </form>
                    </div>
                 ))
                }

                <p style = {{'display':this.state.showadd}} class='img'>Want add more education?&nbsp;&nbsp;
                <a onClick = {this.addEduBox} class="navbar-link">add</a>
                &nbsp;&nbsp;or&nbsp;&nbsp;
                <a onClick = {this.cancelEduBox}>cancel</a>
                </p>
            </div>
        )
    }
}
export default EducationPart;
