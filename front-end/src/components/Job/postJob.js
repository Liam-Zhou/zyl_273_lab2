import React, {Component} from 'react';
import '../../App.css';
import config from '../../config/basicConfig'
import axios from 'axios';
import { Redirect } from 'react-router';

let host = config.host;
let port = config.back_end_port;
let url = host + ':' + port;

class postJob extends Component{
    constructor(props){
        super(props);
        this.state = {
            today:new Date().getTime(),
            addMessage:'',
            lead:''
        }
        this.validSalary = this.validSalary.bind(this)
        this.submit = this.submit.bind(this)
    }
    componentWillMount(){
        let today = new Date()
        let year = today.getFullYear();
        let month = today.getMonth();
        let day = today.getDate();
        today = year+'-'+month+'-'+day;
        console.log('today',today)
        this.setState({
            today:today
        })
    }
    validSalary(e){
        e.preventDefault();
        if(e.target.value < 0 ){
            alert('the salary must bigger than 0');
            e.target.value = 0;
        }
        
    }
    submit(e){
        e.preventDefault();
        let user = JSON.parse(sessionStorage.getItem('user'));
        let paramdata = {
            id:user.id,
            title: e.target.title.value,
            postingDate: e.target.postingDate.value,
            deadline: e.target.deadline.value,
            location: e.target.location.value,
            salay: e.target.salay.value,
            description: e.target.description.value,
            category: e.target.category.value,
        }
        axios.defaults.withCredentials = true;
        axios.post(url + '/job/addJob',paramdata)
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data != 'success'){
                        this.setState({
                            addMessage : response.data
                        })
                    }else{
                        alert('update success!!');
                        this.setState({
                            lead:<Redirect path = '/job/viewJob'/>
                        })
                    }
                }else{
                    
                }})


    }


    render(){
        return (
            <div>
                {this.state.lead}
                <div class="img">
                    <div class = "cprofile_card img" style = {{'width':'100%'}}>
                        <h3 class='img center'>Fill Your New Posting Job</h3>
                        <br></br>
                    <form onSubmit={this.submit}  class='img'>
                        <p class='img' style = {{'width':'70%'}}>Job Title:<input type="text" name="title"></input></p>
                        <p class='img' style = {{'width':'70%','margin-top':'10px'}}>Posting Date:<input type="test" name="postingDate" defaultValue = {this.state.today} disabled></input></p>
                        <p class='img' style = {{'width':'70%','margin-top':'10px'}}>Deadline:<input type="date" name="deadline"></input></p>
                        <p class='img' style = {{'width':'70%','margin-top':'10px'}}>Location:<input type="text" name="location"></input></p>
                        <p class='img' style = {{'width':'70%','margin-top':'10px'}}>Salary:<input type="number" name="salay" onKeyUp={this.validSalary} onClick={this.validSalary}></input></p>
                        <p class='img' style = {{'width':'70%','margin-top':'10px'}}>Description:<input type="text" name="description"></input></p>
                        <p class='img' style = {{'width':'120%','margin-top':'10px'}}>Category:
                        <label class="radio-inline" style = {{'margin-left':'5px'}}>
                                <input type="radio" name="category"  value="fulltime" checked="checked"/> full time
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="category"  value="parttime"/> part time
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="category"  value="intern"/> intern
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="category"  value="oncampus"/> on campus
                            </label>
                        </p>

                        <div class='img' style = {{'margin-top':'10px','margin-bottom':'10px'}}>
                            <button type="submit" class='btn btn-success'>save</button>
                            <button type="reset" style = {{'margin-left':'50px'}} onClick = {this.basicCancel} class='btn btn-danger'>reset</button>
                        </div>
                        
                    </form>
                    </div>
                </div>
                    
            </div>
        )
    }
}

export default postJob;