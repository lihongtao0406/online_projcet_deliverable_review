import React from 'react';
import {
  Grid,
  makeStyles,
  TextField,
  Typography,
  Button
} from '@material-ui/core';
import { Redirect } from 'react-router';
import AppBarLoggedIn from '../components/appbarloggedin';
import axios from 'axios';
import { StoreContext } from '../utils/store';

const InviteCheck = function () {
  const [go, setGo] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [projectId, setProjectId] = React.useState(-1);
  const [password, setPassword] = React.useState('');
  const context = React.useContext(StoreContext);

  const handleJump = () => {
    const payload = {
      project_id: projectId,
      password: password
    }
    axios.post(`${context.url}/proj/project/invite_check`,
      payload, 
      { headers:{ 
        'Content-Type': 'application/json'}
      })
      .then((response) => {
        console.log(response);
        if (response.status !== 200) {
          
          throw Error('Bad response.');
        }
      setGo(true);
      setError(false);
      })
      .catch((error) => {
        setError(true);
        console.log(error);
      });
  }
  const idHandler = (e) => {
    setProjectId(e.target.value);
  }
  const passwordHandler = (e) => {
    setPassword(e.target.value);
    setError(false);
  }

  return (
    <>
      {go &&
        <Redirect to = {`/projectreview/projectreview?projectId=${projectId}`} />
      }
      {!go &&
        <>
          <AppBarLoggedIn /><br/>
          <Grid
            container
            direction = "column"
            justify = "center"
            alignItems = "center"
          >
            <Typography
              varient = "h6"
            >
              🔐 Please Enter Project's ID and Password to Access It
            </Typography><br/>
            <TextField
              label = "Project ID"
              variant = "outlined"
              onChange = {idHandler}
              error = {error}
            >
            </TextField><br/>
            <TextField
              label = "Password"
              variant = "outlined"
              type = "password"
              onChange = {passwordHandler}
              error = {error}
            >
            </TextField><br/>
            <Button
              variant='contained'
              onClick={handleJump}
              color='primary'
            >
              Confirm
            </Button>
          </Grid>
        </>
      }
    </>
  );
}

export default InviteCheck;
