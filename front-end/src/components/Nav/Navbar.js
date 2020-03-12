import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

//create the Navbar Component
class Navbar extends Component {
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
        sessionStorage.removeItem('user');
    }
    render(){
        //if Cookie is set render Logout Button
        let navLogin = null;
        let redirectVar = null;
        if(sessionStorage.getItem('user')){
            console.log("Able to read cookie");
            let url = '/'
            let data = JSON.parse(sessionStorage.getItem('user'));
            if(data.role == 'student'){url = '/sprofile'}
            if(data.role == 'company'){url = '/cprofile'}
            navLogin = (
                <div class="btn btn-group nav navbar-nav navbar-right">
                <button type="button" class="btn btn-default dropdown-toggle " data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="glyphicon glyphicon-home"></span> user <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" >
                <li><Link to={url} onClick = {this.handleuserpage}><span class="glyphicon glyphicon-user"></span>profile</Link></li>
                    <li role="separator" class="divider"></li>
                    <li><Link to="/" onClick = {this.handleLogout}><span class="glyphicon glyphicon-remove-sign"></span>Logout</Link></li>
                </ul>
                </div>
            );
        }else{
            cookie.remove('cookie', { path: '/' })
            //redirectVar = <Redirect to="/"/>
            navLogin = (
                        <li><Link to="/login"><span class="glyphicon glyphicon-log-in"></span> Login</Link></li>
            )
        }
        
        if(sessionStorage.getItem('user')){
            redirectVar = <Redirect to="/home"/>
        }
        return(
            <div>
                {redirectVar}
                
            <nav class="navbar navbar-default navbar-static-top" style = {{"z-index":'9999'}}>
                <div class="container-fluid">
                    <div class="navbar-header">
                        <Link class="navbar-brand" to="/job">Handshake</Link>
                    </div>
                    <ul class="nav navbar-nav navbar-right">
                        <li><Link to="/job">Job</Link></li>
                        <li><Link to="/students">Students</Link></li>
                        <li><Link to="/event">Events</Link></li>
                        {navLogin}
                    </ul>
                    
                </div>
            </nav>
        </div>
        )
    }
}

export default Navbar;