import React, {Component} from 'react';
import '../../App.css';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import config from '../../config/basicConfig'
import axios from 'axios';

let host = config.host;
let port = config.back_end_port;
let url = host + ':' + port;

class cProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            basic:{},
            read_style_button:'block',
            read_style:'block',
            edit_style:'none',
            id:'',

            Cread_style_button:'block',
            Cread_style:'block',
            Cedit_style:'none',

            ComInfoMessage:'',
            ComContactMessage:''
        }

        this.handleBasicSubmit = this.handleBasicSubmit.bind(this)
        this.handleContactSubmit = this.handleContactSubmit.bind(this)

        this.InfoEdit = this.InfoEdit.bind(this)
        this.cancel = this.cancel.bind(this)

        this.CInfoEdit = this.CInfoEdit.bind(this)
        this.Ccancel = this.Ccancel.bind(this)
    }
    componentWillMount(){
        let getInfoUrl = ''
        let user = ''

        if(JSON.parse(sessionStorage.getItem('user')).role == 'company'){
            user =  JSON.parse(sessionStorage.getItem('user'));
            
            getInfoUrl = url + '/profile/getComBasicInfo?id='+user.id
            this.setState({id:user.id})
        }else{
            if(this.props.location.state){
                const com_id = this.props.location.state.com_id
                getInfoUrl = url + '/profile/getComBasicInfo?id='+com_id
                this.setState({
                    id:com_id,
                    read_style_button:'none',
                    Cread_style_button:'none'
                })
            }
            
        }
        axios.defaults.withCredentials = true;
        axios.get(getInfoUrl)
        .then(response => {
            if(response.status === 200){
                console.log('response.data',response.data)
                if(response.data){
                    let userdata = response.data
                    this.setState({
                        basic: userdata
                    })
                    
                }else{
                }
            }else{
                
            }
        })

    }
    InfoEdit(){
        this.setState({
            read_style_button:'none',
            read_style:'none',
            edit_style:'block',
        })
    }
    cancel(){
        this.setState({
            read_style_button:'block',
            read_style:'block',
            edit_style:'none',
        })
    }
    CInfoEdit(){
        this.setState({
            Cread_style_button:'none',
            Cread_style:'none',
            Cedit_style:'block',
        })
    }
    Ccancel(){
        this.setState({
            Cread_style_button:'block',
            Cread_style:'block',
            Cedit_style:'none',
        })
    }

    handleBasicSubmit(e){
        e.preventDefault();
        let paramdata = {
            id: this.state.basic.id,
            avatar: e.target.avatar.files[0],
            name: e.target.name.value,
            location: e.target.location.value,
            des:e.target.des.value,
        }
        let params = new FormData();
        params.append('id',paramdata.id)
        params.append('avatar',paramdata.avatar)
        params.append('name',paramdata.name)
        params.append('location',paramdata.location)
        params.append('des',paramdata.des)

        axios.defaults.withCredentials = true;
        axios.post(url + '/job/updatecombasic',params,{headers: {'Content-Type': 'multipart/form-data'}})
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data != 'success'){
                        this.setState({
                            ComInfoMessage : response.data
                        })
                    }else{
                        alert('update success!!');
                        this.componentWillMount();
                        this.setState({
                            read_style_button : 'block',
                            read_style :'block',
                            edit_style : 'none'
                        })
                        let sessionuser = JSON.parse(sessionStorage.getItem('user'));
                        sessionuser.name = paramdata.name;
                        sessionStorage.setItem('user',JSON.stringify(sessionuser));

                    }
                }else{
                    
                }})
    }
    handleContactSubmit(e){
        e.preventDefault();
        let paramdata = {
            id: this.state.basic.id,
            phone: e.target.phone.value,
            email: e.target.email.value
        }
        axios.defaults.withCredentials = true;
        axios.put(url + '/profile/updatecomcontact',paramdata)
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    if(response.data != 'success'){
                        this.setState({
                            ComContactMessage : response.data
                        })
                    }else{
                        alert('update success!!');
                        this.componentWillMount();
                        this.setState({
                            Cread_style_button:'block',
                            Cread_style :'block',
                            Cedit_style : 'none'
                        })
                    }
                }else{
                    
                }})
    }

    render(){
        let redirectVar = null;
        if(cookie.load('cookie')||sessionStorage.getItem('user')){
            
        }else{
            redirectVar = <Redirect to= "/login"/>
        }
        let n = this.state.id;
        n = Number(n);
        let img = require(`../../img/Cuser/${n}`)

    return(
        <div>
            {redirectVar}
            <div class="img">
            {/* basic section */}
                <div class = "cprofile_card img" style = {{'width':'100%'}}>
                <img style = {{'width':'30%'}} class='img' src={img} alt="." ></img>
                
                <form onSubmit={this.handleBasicSubmit}  class='img'>
                <input type="file" accept="image/*" name="avatar" id="file" style = {{'display':this.state.edit_style}}/>

                <button type = "button" style = {{'display':this.state.read_style_button}} onClick = {this.InfoEdit} class = "glyphicon glyphicon-edit edit-right"></button>
                        <p style = {{'display':this.state.read_style}} class='imgWid80'>Name:<h4 class='inline'>{this.state.basic.name}</h4></p>
                        <p style = {{'display':this.state.edit_style  }} class='imgWid80'>Name:<input type="text"  name="name" defaultValue={ this.state.basic.name } /></p>
                       
                        <p style = {{'display':this.state.read_style  }} class='imgWid80'>Location:<h4 class='inline'>{ this.state.basic.location}</h4></p>
                        <p style = {{'display':this.state.edit_style  }} class='imgWid80'>Location: <input type="text" class="" name="location" defaultValue={this.state.basic.location}/></p>
                        
                        <p style = {{'display':this.state.read_style ,'margin-bottom':'10px' }} class='imgWid80'>Description:<h4 class='inline'>{ this.state.basic.description}</h4></p>
                        <p style = {{'display':this.state.edit_style,'margin-bottom':'10px'  }} class='imgWid80'>Decription: <input type="text" class="" name="des" defaultValue={this.state.basic.description}/></p>
                    
                    <div class='img' style = {{'display':this.state.edit_style,'margin-bottom':'10px'}}>
                        <button type="submit" class='btn btn-success'>update</button>
                        <button type="reset" style = {{'margin-left':'40px'}} onClick = {this.cancel} class='btn btn-info'>cancel</button>
                    </div>
                    <p style = {{'display':this.state.edit_style}}>{this.state.ComInfoMessage}</p>
                </form>
                </div>
            {/* contact section */}
                <div class = "cprofile_card img" style = {{'width':'100%','margin-top':'20px','margin-bottom':'20px'}}>
                <h3 class = "center">Contact Information</h3>
                <form onSubmit={this.handleContactSubmit}  class='img'>
                <button type = "button" style = {{'display':this.state.Cread_style_button}} onClick = {this.CInfoEdit} class = "glyphicon glyphicon-edit edit-right"></button>
                        <p style = {{'display':this.state.Cread_style}} class='imgWid80'>Phone:<h4 class='inline'>{this.state.basic.phone}</h4></p>
                        <p style = {{'display':this.state.Cedit_style }} class='imgWid80'>Phone:<input type="text"  name="phone" defaultValue={ this.state.basic.phone } /></p>
                       
                        <p style = {{'display':this.state.Cread_style ,'margin-bottom':'10px'}} class='imgWid80'>Email:<h4 class='inline'>{ this.state.basic.email}</h4></p>
                        <p style = {{'display':this.state.Cedit_style ,'margin-bottom':'10px'}} class='imgWid80'>Email: <input type="text" class="" name="email" defaultValue={this.state.basic.email}/></p>
                        
                    <div class='img' style = {{'display':this.state.Cedit_style,'margin-bottom':'10px'}}>
                        <button type="submit" class='btn btn-success'>update</button>
                        <button type="reset" style = {{'margin-left':'40px'}} onClick = {this.Ccancel} class='btn btn-info'>cancel</button>
                    </div>
                    <p style = {{'display':this.state.Cedit_style}}>{this.state.ComContactMessage}</p>
                </form>
                </div>
            </div>

        </div>
        )
    }
}

export default cProfile;