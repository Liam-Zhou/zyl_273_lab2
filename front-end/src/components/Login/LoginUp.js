import React, {Component} from 'react';
import '../../App.css';
import { connect } from "react-redux";
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import config from '../../config/basicConfig'

//Define a Login Component
class LoginUp extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //const mes = props.location.state
        this.state = {
            email : "",
            password : "",
            role : "",
            message:''
        }
        //Bind the handlers to this class
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.roleChangeHandler = this.roleChangeHandler.bind(this);
    }
    componentWillMount(){
    }

    emailChangeHandler = (e) => {
        this.setState({
            email : e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
    }

    roleChangeHandler = (e) => {
        this.setState({
            role : e.target.value
        })
    }
    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
        //prevent page from refresh
        e.preventDefault();
        
        if(this.state.email && this.state.password && this.state.role){
            
            const data = {
                email : this.state.email,
                password : this.state.password,
                role : this.state.role
            }
            let host = config.host;
            let port = config.back_end_port;
            let url = host + ':' + port;

            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post(url + '/login/',data)
                .then(response => {
                    console.log("Status Code : ",response.status);
                    if(response.status === 200){
                        console.log('response.data',response.data)
                        if(response.data == 'noinfo'){
                                this.setState({
                                    message : "no such account!"
                        })
                    }
                        if(response.data == 'mysql error'){
                            this.setState({
                                message : "sorry database error!"
                        })
                    }
                        if(response.data.id){
                            let data = JSON.stringify(response.data)
                            sessionStorage.setItem('user',data)
                            this.setState({
                                email : "",
                                password : "",
                                role : '',
                                message : 'success'
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
        let redirectVar = null;
        if(cookie.load('cookie')||sessionStorage.getItem('user')){
            let role = JSON.parse(sessionStorage.getItem('user')).role;
            if(role == 'student'){
                redirectVar = <Redirect to= "/job/jobSearch"/>
            }
            if(role == 'company'){
                redirectVar = <Redirect to= "/job/viewJob"/>
            }
            
        }
        // if(sessionStorage.getItem('user')){
        //     redirectVar = <Redirect to= "/"/>
        // }
        return(
            <div class="loginform">
                        <div>
                            {redirectVar}
                        <div align ="center">
                            <p>Please enter your information</p>
                        </div>
                            <div class="form-group">
                                <input onChange = {this.emailChangeHandler}  type="text" class="form-control" name="email" placeholder="Email"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.passwordChangeHandler}  type="password" class="form-control" name="password" placeholder="Password"/>
                            </div>
                            <label class="radio-inline">
                                <input type="radio" name="role"  onChange={this.roleChangeHandler} value="student"/> student
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="role"  onChange={this.roleChangeHandler} value="company"/> company
                            </label>
                            <button onClick = {this.submitLogin} class="button">Login</button> 
                            </div>  
                            <div><h4>{this.state.message}</h4></div>  
            </div>            
                            
        )
    }
}
export default LoginUp;