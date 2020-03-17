import React, {Component} from 'react';
import '../../App.css';
import BasicPart from './Basic'
import EducationPart from './Education'
import WorkPart from './Work'
import {Redirect} from 'react-router';
import cookie from 'react-cookies';



class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            stu_id:''
        }
    }
    componentWillMount(){
        if(this.props.location.state){
            const stu_id = this.props.location.state.stu_id
            this.setState({
                stu_id:stu_id
            })
        }
        
    }

    render(){
        let redirectVar = null;
        if(cookie.load('cookie')||sessionStorage.getItem('user')){
            
        }else{
            redirectVar = <Redirect to= "/login"/>
        }
    return(
        <div>
            {redirectVar}
            {/* left section */}
            <BasicPart stu_id={this.state.stu_id}/>

            {/* right section */}
            <div class="col-md-8">

            {/* education section */}
            <EducationPart stu_id={this.state.stu_id}/>

            {/* work experience section */}

            <WorkPart stu_id={this.state.stu_id}/>
                
            </div>

        </div>
        )
    }
}

export default Profile;