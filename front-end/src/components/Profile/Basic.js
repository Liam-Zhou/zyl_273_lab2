import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import config from '../../config/basicConfig'
import fs from 'fs'
//let fs = require('fs');


let host = config.host;
let port = config.back_end_port;
let url = host + ':' + port;
//Define a Login Component
class BasicPart extends Component{
    //call the constructor method
    constructor(props){
        super(props);
        //const mes = props.location.state
        this.state = {
            basic:{
            },
            id:'',

            basic_edit_style_btn:'block',
            basic_edit_style : 'block',
            basic_button_style : 'none',

            skill_edit_style_btn:'block',
            skill_edit_style : 'block',
            skill_button_style : 'none',

            contact_edit_style_btn:'block',
            contact_edit_style : 'block',
            contact_button_style : 'none',


            BasicInfoMessage : '',
            SkillInfoMessage : '',
            ContactInfoMessage : ''
        }
        //Bind the handlers to this class
        this.basicInfoEdit = this.basicInfoEdit.bind(this);
        this.basicCancel = this.basicCancel.bind(this);

        this.skillInfoEdit = this.skillInfoEdit.bind(this);
        this.skillCancel = this.skillCancel.bind(this);

        this.contactInfoEdit = this.contactInfoEdit.bind(this);
        this.contactCancel = this.contactCancel.bind(this);


        this.handleBasicSubmit = this.handleBasicSubmit.bind(this);
        this.handleSkillSubmit = this.handleSkillSubmit.bind(this);
        this.handleContactSubmit = this.handleContactSubmit.bind(this);
    }
    componentWillMount(){
        let getInfoUrl = ''
        let user = ''
        if(this.props.stu_id){
            getInfoUrl = url + '/profile/getStuBasicInfo?id='+this.props.stu_id
            this.setState({
                id:this.props.stu_id,
                basic_edit_style_btn:'none',
                skill_edit_style_btn:'none',
                contact_edit_style_btn:'none'
            })
        }else{
            if(sessionStorage.getItem('user')){
                user =  JSON.parse(sessionStorage.getItem('user'));
                getInfoUrl = url + '/profile/getStuBasicInfo?id='+user.id;
                this.setState({
                    id:user.id
                })
            }
        }

        axios.defaults.withCredentials = true;
        axios.get(getInfoUrl).then(response => {
            if(response.status === 200){
                console.log('response.data',response.data)
                if(response.data){
                    let userdata = response.data
                    this.setState({
                        basic: userdata
                    })
                }else{
                }
            }else{
                
            }
        })
    }

    basicInfoEdit(){
        this.setState({
            basic_edit_style_btn:'none',
            basic_edit_style :'none',
            basic_button_style : 'block'
        })
    }
    basicCancel(){
        this.setState({
            basic_edit_style_btn:'block',
            basic_edit_style :'block',
            basic_button_style : 'none'
        })
    }
    skillInfoEdit(){
        this.setState({
            basic_edit_style_btn:'none',
            skill_edit_style : 'none',
            skill_button_style : 'block'
        })
    }
    skillCancel(){
        this.setState({
            basic_edit_style_btn :'block',
            skill_edit_style : 'block',
            skill_button_style : 'none'
        })
    }

    contactInfoEdit(){
        this.setState({
            contact_edit_style_btn:'none',
            contact_edit_style : 'none',
            contact_button_style : 'block'
        })
    }
    contactCancel(){
        this.setState({
        contact_edit_style_btn:'block',
        contact_edit_style : 'block',
        contact_button_style : 'none'
        })
    }

    handleBasicSubmit(e){
        e.preventDefault();
        let file = e.target.avatar.files[0]
        console.log('file',file)
        let paramdata = {
            id: this.state.basic.id,
            avatar: e.target.avatar.files[0],
            name: e.target.name.value,
            dateOfBirth: e.target.dateOfBirth.value,
            city:e.target.city.value,
            state:e.target.state.value,
            country:e.target.country.value,
            carrerObj:e.target.carrerObj.value
        }

        let params = new FormData();
        params.append('id',paramdata.id)
        params.append('avatar',paramdata.avatar)
        params.append('name',paramdata.name)
        params.append('dateOfBirth',paramdata.dateOfBirth)
        params.append('city',paramdata.city)
        params.append('state',paramdata.state)
        params.append('country',paramdata.country)
        params.append('carrerObj',paramdata.carrerObj)


        axios.defaults.withCredentials = true;

        axios.post(url + '/profile/StudentbasicInfo',params,{headers: {'Content-Type': 'multipart/form-data'}})
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data != 'success'){
                        this.setState({
                            BasicInfoMessage : response.data
                        })
                    }else{
                        alert('update success!!');
                        this.componentWillMount();
                        this.setState({
                            basic_edit_style_btn:'block',
                            basic_edit_style :'block',
                            basic_button_style : 'none'
                        })
                        let sessionuser = JSON.parse(sessionStorage.getItem('user'));
                        sessionuser.name = paramdata.name;
                        sessionStorage.setItem('user',JSON.stringify(sessionuser));

                    }
                }else{
                    
                }
            })
        

    }

    handleSkillSubmit(e){
        e.preventDefault();
        let skills = e.target.skills.value;
        let id = this.state.basic.id;
        let paramdata = {
            skills : skills,
            id : id
        }
        axios.defaults.withCredentials = true;
        axios.post(url + '/profile/StudentSkillsInfo',paramdata)
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data != 'success'){
                        this.setState({
                            SkillInfoMessage : response.data
                        })
                    }else{
                        alert('update success!!');
                        this.componentWillMount();
                        this.setState({
                            basic_edit_style_btn : 'block',
                            skill_edit_style :'block',
                            skill_button_style : 'none'
                        })
                        }
                    }else{
                    
                    }
                })

    }
    handleContactSubmit(e){
        e.preventDefault();
        let phone = e.target.phone.value;
        let email = e.target.email.value;

        let id = this.state.basic.id;
        let paramdata = {
            phone : phone,
            email : email,
            id : id
        }
        axios.defaults.withCredentials = true;
        axios.post(url + '/profile/StudentcontactInfo',paramdata)
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data != 'success'){
                        this.setState({
                            SkillInfoMessage : response.data
                        })
                    }else{
                        alert('update success!!');
                        this.componentWillMount();
                        this.setState({
                            contact_edit_style_btn:'block',
                            contact_edit_style :'block',
                            contact_button_style : 'none'
                        })
                        }
                    }else{
                    
                    }
                })
    }


render(){
    let skills = []
    if(this.state.basic.skills){
       let s = this.state.basic.skills;
       skills = s.split(",");
    }
    let n = this.state.id;
    n = Number(n);
    let img = require(`../../img/user/${n}`);

    return(
    <div class="col-md-4">
        {/* basic information section */}
        <div class = "profile_card">
        <div >
        <img class='img' src={img} alt="." ></img>
        <button style = {{'display':this.state.basic_edit_style_btn}} onClick = {this.basicInfoEdit} class = "glyphicon glyphicon-edit edit-right"></button>
        </div>
        
        <form onSubmit={this.handleBasicSubmit} >

        <input type="file" accept="image/*" name="avatar" id="file" style = {{'display':this.state.basic_button_style}}/>

        <h3 style = {{'display':this.state.basic_edit_style}} class = "center">Name: {this.state.basic.name}</h3>
        <input  style = {{'display':this.state.basic_button_style}} type="text" class="form-control" name="name" defaultValue={this.state.basic.name} placeholder={"name:  "}disabled/>
        
        <p style = {{'display':this.state.basic_edit_style}} class = "center">Date of Birth: {this.state.basic.birth}</p>
        <input  style = {{'display':this.state.basic_button_style}} type="date" class="form-control" name="dateOfBirth"defaultValue={this.state.basic.birth} placeholder={"date of birth  "}/>
       
        <p style = {{'display':this.state.basic_edit_style}} class = "center">City:{this.state.basic.city}</p>
        <input  style = {{'display':this.state.basic_button_style}} type="text" class="form-control" name="city" defaultValue={this.state.basic.city} placeholder={"city:   "}/>
       
        <p style = {{'display':this.state.basic_edit_style}} class = "center">State:{this.state.basic.state}</p>
        <input  style = {{'display':this.state.basic_button_style}} type="text" class="form-control" name="state" defaultValue={this.state.basic.state} placeholder={"state  "}/>
       
        <p style = {{'display':this.state.basic_edit_style}} class = "center">Country:{this.state.basic.country}</p>
        <input style = {{'display':this.state.basic_button_style}} type="text" class="form-control" name="country" defaultValue={this.state.basic.country} placeholder={"country  "}/>
       
        <p style = {{'display':this.state.basic_edit_style}} class = "center">Career Objective:{this.state.basic.careerObject}</p>
        <input style = {{'display':this.state.basic_button_style}} type="text" class="form-control" name="carrerObj" defaultValue={this.state.basic.careerObject} placeholder={"carrer Objct  "}/>
       
        <div class='img' style = {{'display':this.state.basic_button_style}}>
            <button type="submit" class='btn btn-success'>save</button>
            <button type="reset" style = {{'margin-left':'50px'}} onClick = {this.basicCancel} class='btn btn-danger'>cancel</button>
        </div>
        <p style = {{'display':this.state.basic_button_style}}>{this.state.BasicInfoMessage}</p>
        </form>
       
        </div>

        {/* skillset section */}
        <div class = "profile_card">
        <h3 class = "center">skillset
        <button style = {{'display':this.state.skill_edit_style_btn}}  onClick = {this.skillInfoEdit} class = "glyphicon glyphicon-edit edit-right"></button>
        </h3>
        
        {skills.map(skill => (
             <span class="label label-info img" style = {{'display':this.state.skill_edit_style,'width':'30%','marginBottom':'5px'}}>{skill}</span>
        ))}

        <form onSubmit={this.handleSkillSubmit} >
        <input style = {{'display':this.state.skill_button_style}} type="text" class="form-control" name="skills" defaultValue={this.state.basic.skills} placeholder={"skills:(use comma)"}/>
       
        <div class='img' style = {{'display':this.state.skill_button_style}}>
        <button  type="submit" class='btn btn-success' >save</button>
        <button  type="reset" onClick = {this.skillCancel} style = {{'margin-left':'50px'}} class='btn btn-danger'>cancel</button>
        </div>
        <p style = {{'display':this.state.basic_button_style}}>{this.state.SkillInfoMessage}</p>
        </form>
        </div>

        {/* contact inofrmation section */}
        <div class = "profile_card">
        <h3 class = "center">contact Information
         <button style = {{'display':this.state.contact_edit_style_btn}}  onClick = {this.contactInfoEdit} class = "glyphicon glyphicon-edit edit-right"></button>
        </h3>
        <p class = "center" style = {{'display':this.state.contact_edit_style}}>Phone Number:{this.state.basic.phone}</p>
        <p class = "center" style = {{'display':this.state.contact_edit_style}}>Email:{this.state.basic.email}</p>

        <form onSubmit={this.handleContactSubmit} >
        <input  style = {{'display':this.state.contact_button_style}} type="text" class="form-control" name="phone" defaultValue={this.state.basic.phone} placeholder={"phone number:  "}/>
        <input  style = {{'display':this.state.contact_button_style}} type="text" class="form-control" name="email" defaultValue={this.state.basic.email} placeholder={"email:  "}disabled/>
        <p style = {{'display':this.state.contact_button_style}}>{this.state.ContactInfoMessage}</p>
        

        <div class='img' style = {{'display':this.state.contact_button_style}}>
        <button type="submit" class='btn btn-success'>save</button>
        <button type="reset" style = {{'margin-left':'50px'}} onClick = {this.contactCancel} class='btn btn-danger'>cancel</button>
        </div>
        </form>
        </div>
    </div>
    )
}
}
export default BasicPart;