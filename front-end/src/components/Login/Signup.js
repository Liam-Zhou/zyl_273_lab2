import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import config from '../../config/basicConfig'

//Define a Signup Component
class Signup extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            emailId : "",
            password : "",
            name : "",
            location : "",
            collegeName : "",
            role : "",
            hidden1 : "hidden",
            hidden2 : "hidden",
            message : null,
            lead : ''
        }
        //Bind the handlers to this class
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.emailIdChangeHandler = this.emailIdChangeHandler.bind(this);
        this.locationChangeHandler = this.locationChangeHandler.bind(this);
        this.collegeNameChangeHandler = this.collegeNameChangeHandler.bind(this);
        this.roleChangeHandler = this.roleChangeHandler.bind(this);

        this.submitInfo = this.submitInfo.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
    }

    //username change handler to update state variable with the text entered by the user
    nameChangeHandler = (e) => {
        this.setState({
            name : e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    emailIdChangeHandler = (e) => {
        this.setState({
            emailId : e.target.value
        })
    }
    locationChangeHandler = (e) => {
        this.setState({
            location : e.target.value
        })
    }
    collegeNameChangeHandler = (e) => {
        this.setState({
            collegeName : e.target.value
        })
    }


    roleChangeHandler = (e) => {
        let role = e.target.value
        this.setState({
            role : role
        })
        
        if(role == 'student'){
            this.setState({
                hidden1 : "text",
                hidden2 : "hidden",
                location : ''
            })
        }else{
            this.setState({
                hidden1 : "hidden",
                hidden2 : "text",
                collegeName : ''
            })
        }
    }
    //submit Login handler to send a request to the node backend
    submitInfo = (e) => {
        //prevent page from refresh
        e.preventDefault();
        if(this.state.name && this.state.password && this.state.role && this.state.emailId){
            
            const data = {
                name : this.state.name,
                password : this.state.password,
                emailId : this.state.emailId,
                location : this.state.location,
                collegeName : this.state.collegeName,
                role : this.state.role
            }
            let host = config.host;
            let port = config.back_end_port;
            let url = host + ':' + port;
            //make a post request with the user data
            axios.post(url + '/signup/',data)
                .then(response => {
                    console.log("Status Code : ",response.status);
                    if(response.status === 200){
                        console.log('response.data',response.data)
                        if(response.data != 'success'){
                            this.setState({
                                message : response.data
                            })
                        }else{
                            //this.props.history.push('/login','sign up success!!')
                            alert('sign up success!!')
                            this.setState({
                                lead : <Redirect to= "/login"/>
                            })
                            
                        }
                    }else{
                        
                    }
                });
            }else{
                this.setState({
                    message : "no empty please!"
                })
            }
    }

    render(){
        //redirect based on successful login
        let host = config.host;
        let port = config.front_end_port;
        let url = host + ':' + port;
        return(
            <div>
                {this.state.lead}
            <div class="container">
                
                <div class="maincenter">
                    <div class="loginform">
                        <div align ="center">
                            <p>Please register your information</p>
                        </div>
                            <div class="form-group">
                               <input onChange = {this.nameChangeHandler}  type="text" class="form-control" name="name" placeholder="name"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.emailIdChangeHandler}  type="text" class="form-control" name="email" placeholder="EmailId"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.passwordChangeHandler}  type="password" class="form-control" name="password" placeholder="Password"/>
                            </div>
                            <div class="form-group" >
                                <input onChange = {this.locationChangeHandler} type = {this.state.hidden2}  class="form-control" name="location" placeholder="Location"/>
                            </div>
                            <div class="form-group" >
                                <input onChange = {this.collegeNameChangeHandler} type = {this.state.hidden1} class="form-control" name="collegename" placeholder="College name"/>
                            </div>


                            <label class="radio-inline">
                                <input type="radio" name="role"  onChange={this.roleChangeHandler} value="student"/> student
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="role"  onChange={this.roleChangeHandler} value="company"/> company
                            </label>
                            <button onClick = {this.submitInfo} class="button">Signup</button>                 
                            <div><h4>{this.state.message}</h4></div>
                        </div>
                        <div class='signin'>
                        <p >already have an account? <a href={url + '/login'} class="navbar-link">signin</a></p>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default Signup;