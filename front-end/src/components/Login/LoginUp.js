import React, {Component} from 'react';
import '../../App.css';
//import {login} from '../../js/actions/index'
import f from '../../js/actions/index'
import { connect } from "react-redux";
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import config from '../../config/basicConfig'

//Define a Login Component
class LoginUp1 extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //const mes = props.location.state
        this.state = {
            message:''
        }
        //Bind the handlers to this class
        this.submitLogin = this.submitLogin.bind(this);
    }
    componentWillMount(){
    }

    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
        //prevent page from refresh
        e.preventDefault();
        let email = e.target.email.value;
        let password = e.target.password.value;
        let role = e.target.role.value;
        
        if(email && password && role){
            
            const data = {
                email : email,
                password : password,
                role : role
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
                        if(response.data == 'Invalid Credentials'){
                            this.setState({
                                message : "no such account!"
                        })
                    }
                        if(response.data.id){
                            let data = JSON.stringify(response.data)
                            this.props.login({user:JSON.parse(data)})
                            sessionStorage.setItem('user',data)
                            this.setState({
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
        return(
            <div class="loginform">
                        <div>
                            {redirectVar}
                        <div align ="center">
                            <p>Please enter your information</p>
                        </div>
                        <form onSubmit={this.submitLogin}>
                            <div class="form-group">
                                <input   type="text" class="form-control" name="email" placeholder="Email"/>
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-control" name="password" placeholder="Password"/>
                            </div>
                            <label class="radio-inline">
                                <input type="radio" name="role"  value="student"/> student
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="role" value="company"/> company
                            </label>
                            <button  class="button">Login</button> 
                        </form>
                            </div>  
                            <div><h4>{this.state.message}</h4></div>  
                            
            </div>            
                            
        )
    }
}
function mapDispatchToProps(dispatch) {
    return {
        login: data => dispatch(f.login(data))
    };
  }
const LoginUp = connect( null,mapDispatchToProps)(LoginUp1);
export default LoginUp;