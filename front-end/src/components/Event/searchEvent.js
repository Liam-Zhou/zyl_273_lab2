import React, {Component} from 'react';
import config from '../../config/basicConfig'
import '../../App.css';
import axios from 'axios';

let host = config.host;
let port = config.back_end_port;
let url = host + ':' + port;

class searchEvent extends Component{
    constructor(props){
        super(props);
        this.state={
            eventlist:[],
            event:{},
            showButton:'none',
            applymessage:''
        }
        this.search = this.search.bind(this)
        this.getDetail = this.getDetail.bind(this)
        this.showCancel = this.showCancel.bind(this)
        this.apply = this.apply.bind(this)
    }

    componentWillMount(){
        axios.defaults.withCredentials = true;
        axios.get(url + '/event/searchEvent')
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data.length == 0){
                        alert(response.data)
                    }else{
                        this.setState({
                            eventlist:response.data
                        })
                    }
                }else{
                    
                }})
    }
    search(e){
        e.preventDefault();
        let name = e.target.name.value;
        axios.defaults.withCredentials = true;
        axios.get(url + '/event/searchEvent?name='+name)
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data.length == 0){
                        alert('no such jobs!')
                        this.setState({
                            eventlist:[],
                            event:{}
                        })

                    }else{
                        this.setState({
                            eventlist:response.data
                        })
                    }
                }else{
                    
                }})
    }
    getDetail(event){
        let eligibility = event.eligibility;
        if(sessionStorage.getItem('user')){
        let stu_id = JSON.parse(sessionStorage.getItem('user')).id;

        if(eligibility == 'All'){
            this.setState({
                event:event,
                showButton:"block",
                applymessage:''
            })
        }else{
            axios.defaults.withCredentials = true;
            axios.get(url + '/event/getMajor?id='+stu_id)
                .then(response => {
                    if(response.status === 200){
                        console.log('response.data',response.data)
                        if(response.data.length == 0){
                            alert('you must fill your education information !')
                        }else{
                            let marjors = response.data;
                            let flag = 0;
                            marjors.map((m) =>{
                                if(m.major == eligibility){
                                    flag = 1;
                                    this.setState({
                                        event:event,
                                        showButton:"block",
                                        applymessage:''
                                    })
                                }
                            })
                            if(flag == 0){
                                this.setState({
                                    event:event,
                                    showButton:"none",
                                    applymessage:''
                                })
                            }
                        }
                    }else{
                        
                    }})
        }
        }
        
    }
    showCancel(){
        this.setState({
            showButton:"none"
        })
    }

    apply(){
        if(sessionStorage.getItem('user')){
           let stu_id = JSON.parse(sessionStorage.getItem('user')).id;
           let event_id = this.state.event.id;
           let param = {
                stu_id:stu_id,
                event_id:event_id
           }
           axios.defaults.withCredentials = true;
           axios.post(url + '/event/applyEvent',param)
               .then(response => {
                   if(response.data == 'success'){
                       console.log('response.data',response.data)
                        alert("success")
                   }else{
                    this.setState({
                        applymessage:response.data
                       })
                   }})
        }
    }


    render(){
        return(
            <div>
                <div class="col-md-12 ">
                <div class = 'profile_card' style = {{'margin-left': '0px'}}>
                    <form onSubmit={this.search} class='img center' style = {{'width': '70%'}}>
                    <input type="text" class="" name="name" placeholder="Event Name"></input>
                    <button type="submit" class="glyphicon glyphicon-search "style = {{'margin-left':'30px'}}></button>
                </form>
                </div>
                </div>
                <div class="col-md-6">
                <div class = 'profile_card' style = {{'margin-left': '0px'}}>
                    <h2>Event List</h2>
                    {this.state.eventlist.map( (event,index) => (
                    <div class = "education_box" >
                        <button type = "button" style = {{}} onClick = {()=>this.getDetail(event)} class = "glyphicon glyphicon-triangle-right edit-right">detail</button>
                        <p style = {{}}>ID:<h4 class='inline'>{event.id}</h4></p>
                        <p style = {{}}>Event Name:<h4 class='inline'>{event.name}</h4></p>
                        <p style = {{}}>Event Time:<h4 class='inline'>{new Date(event.time).getFullYear()+'/'+new Date(event.time).getMonth()+
                            '/'+new Date(event.time).getDate()+'  '+new Date(event.time).getHours()+':'+new Date(event.time).getMinutes()
                        }</h4></p>
                        <p style = {{}}>Location:<h4 class='inline'>{event.location}</h4></p>
                         
                    </div>
                        ))}

                </div>
            </div>

            <div class="col-md-6">
                <div class = 'profile_card' style = {{'margin-left': '0px'}}>
                <h2>Event Detail</h2>
                <p style = {{}}>Company Name:<h4 class='inline'>{this.state.event.companyname}</h4></p>
                <p style = {{}}>Description:<h4 class='inline'>{this.state.event.description}</h4></p>
                <p style = {{}}>Eligibility:<h4 class='inline'>{this.state.event.eligibility}</h4></p>
                <div class='img' style = {{'margin-top':'10px','margin-bottom':'10px','display':this.state.showButton}} >
                    <button onClick = {this.apply} class='btn btn-success'>apply</button>
                    <button style = {{'margin-left':'50px'}} onClick = {this.showCancel} class='btn btn-danger'>cancel</button>
                </div>
                <div><h4>{this.state.applymessage}</h4></div> 
                </div>
            </div>


            </div>
        )
    }

}
export default searchEvent;