import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class EventNav extends Component {
    constructor(props){
        super(props);
    }

    render(){
        let menu = null;
        let redirectVar = null; 
        if(sessionStorage.getItem('user')){
            
            let role = JSON.parse(sessionStorage.getItem('user')).role;
            if(role == 'company'){
                redirectVar = <Redirect to="/event/viewevent"/>
            }else{
                redirectVar = <Redirect to="/event/eventSearch"/>
                menu = (<nav class="navbar navbar-default navbar-static-top" style={{"margin-top":"-20px"}}>
                        <div class="container-fluid">
                        <ul class="nav navbar-nav navbar-right">
                        <li><Link to="/event/eventSearch">Events Search</Link></li>
                        <li><Link to="/event/appliedevent">Applied Events</Link></li>
                        </ul>
                        </div>
                        </nav>)
            }
        }
        return(
            <div>
            {redirectVar}
            {menu}
            </div>
        )
    }
        
    

}

export default EventNav;