import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import config from '../../config/basicConfig'
import LoginUp from'./LoginUp'

//Define a Login Component
class Login extends Component {
    render() {
        let host = config.host;
        let port = config.front_end_port;
        let url = host + ':' + port;
        return(
            <div>
            <div class="container">
                
                <div class="maincenter">
                    <div align ="center">
                        <img class='img' src={require('../../img/handshake.png')} alt="." />
                    </div>
                    
                        <LoginUp/>
                        
                    <div class='signup'>
                        <p class="signup">Don't have an account? <a href={url + '/signup'} class="navbar-link">signup</a></p>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}
//export Login Component
export default Login;