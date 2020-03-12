import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class JobNav extends Component {
    constructor(props){
        super(props);
    }

    render(){
        let menu = null;
        let redirectVar = null; 
        if(sessionStorage.getItem('user')){
            
            let role = JSON.parse(sessionStorage.getItem('user')).role;
            if(role == 'company'){
                redirectVar = <Redirect to="/job/viewJob"/>
                menu = (<ul class="nav navbar-nav navbar-right">
                        <li><Link to="/job/viewJob">View My Posted Jobs</Link></li>
                        <li><Link to="/job/postJob">Post Jobs</Link></li></ul>)
            }else{
                redirectVar = <Redirect to="/job/jobSearch"/>
                menu = (<ul class="nav navbar-nav navbar-right">
                <li><Link to="/job/jobSearch">Jobs Search</Link></li>
                <li><Link to="/job/appliedJob">Applied Job</Link></li>
                </ul>)
            }
        }
        return(
            <div>
                {redirectVar}
            <nav class="navbar navbar-default navbar-static-top" style={{"margin-top":"-20px"}}>
                <div class="container-fluid">
                        {menu}
                </div>
            </nav>
        </div>
        )
    }
        
    

}

export default JobNav;