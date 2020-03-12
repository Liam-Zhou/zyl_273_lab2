import React, {Component} from 'react';
import config from '../../config/basicConfig'
import '../../App.css';
import axios from 'axios';

let host = config.host;
let port = config.back_end_port;
let url = host + ':' + port;

class appliedEvent extends Component{
    constructor(props){
        super(props);
        this.state={
            eventlist:[]
        }
    }

    componentWillMount(){
        let stu_id;
        if(JSON.parse(sessionStorage.getItem('user')).role == 'student'){
            let user =  JSON.parse(sessionStorage.getItem('user'));
            stu_id = user.id
        }
        axios.defaults.withCredentials = true;
        axios.get(url + '/event/getEventofStu?stu_id='+stu_id)
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data.length == 0){
                        alert('no applied event!')
                        this.setState({
                            eventlist:[]
                        })
                    }else{
                        this.setState({
                            eventlist:response.data
                        })
                    }
                }else{
                    
                }})
    }
    render(){
        return(
            
            <div class="img">
                <div class = "cprofile_card img" style = {{'width':'100%'}}>
                <h3 class="center">Applied Event </h3>

                    {this.state.eventlist.map( (event,index) => (
                    <div class = "education_box" >
                        <p style = {{}}>Event Name:<h4 class='inline'>{event.name}</h4></p>
                        <p style = {{}}>Event Time:<h4 class='inline'>{new Date(event.time).getFullYear()+'/'+new Date(event.time).getMonth()+
                            '/'+new Date(event.time).getDate()+'  '+new Date(event.time).getHours()+':'+new Date(event.time).getMinutes()
                        }</h4></p>
                        <p style = {{}}>Location:<h4 class='inline'>{event.location}</h4></p>
                        <p style = {{}}>Description:<h4 class='inline'>{event.description}</h4></p>
                        
                    </div>
                ))}
                </div>
            </div>
        )
    }
}

export default appliedEvent;
