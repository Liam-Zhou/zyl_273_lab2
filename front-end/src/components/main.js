import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login/Login';
import Navbar from './Nav/Navbar';
import Student from './Student/student';
import Signup from './Login/Signup';
import Profile from './Profile/sProfile';
import cProfile from './Profile/cProfile';

import JobNav from './Nav/JobNav'
import viewJob from './Job/viewJob';
import postJob from './Job/postJob';
import jobSearch from './Job/jobSearch';
import appliedJob from './Job/appliedJob';

import EventNav from './Nav/EventNav';
import viewEvent from './Event/viewEvent';
import searchEvent from './Event/searchEvent';
import appliedEvent from './Event/appliedEvent';


//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/" component={Navbar}/>
                <Route path="/home" component={Login}/>
                <Route path="/login" component={Login}/>
                <Route path="/students" component={Student}/>
                
                <Route path="/signup" component={Signup}/>
                <Route path='/sprofile' component={Profile}/>
                <Route path='/cprofile' component={cProfile}/>

                <Route path="/job" component={JobNav}/>
                <Route path="/job/viewJob" component={viewJob}/>
                <Route path="/job/postJob" component={postJob}/>
                <Route path="/job/jobSearch" component={jobSearch}/>
                <Route path="/job/appliedJob" component={appliedJob}/>

                <Route path="/event" component={EventNav}/>
                <Route path="/event/viewevent" component={viewEvent}/>
                <Route path="/event/eventSearch" component={searchEvent}/>
                <Route path="/event/appliedevent" component={appliedEvent}/>
                

            </div>
        )
    }
}
//Export The Main Component
export default Main;