import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Welcome from './pages/welcome'
import Signin from './pages/sign_in'
import Signup from './pages/sign_up'
import Dashboard from './pages/Dashboard'
import MyProject from './pages/my_project'
import ProjectUploadPage from './pages/project-upload-page'
import StoreProvider from './utils/store'
import ProjectReview from './pages/ProjectReview';
import InviteCheck from './pages/invite-check';
import ProfilePage from './pages/profile-page';
function App(){ 
  return (
    <StoreProvider>
      <Router>
        <Switch>
          <Route path="/signin">
            <Signin></Signin>
          </Route>
          <Route path="/signup">
            <Signup></Signup>
          </Route>
          <Route path="/Dashboard">
            <Dashboard></Dashboard>
          </Route>
          <Route path="/myproject">
            <MyProject></MyProject>
          </Route>
          <Route path="/projectupload">
            <ProjectUploadPage></ProjectUploadPage>
          </Route>
          <Route path="/projectreview">
            <ProjectReview></ProjectReview>
          </Route>
          <Route path="/invitecheck">
            <InviteCheck></InviteCheck>
          </Route>
          <Route path="/profile/:userId">
            <ProfilePage></ProfilePage>
          </Route>
          <Route path="/">
            <Welcome></Welcome>
          </Route>
        </Switch>
      </Router>
    </StoreProvider>
  );
}

export default App;
