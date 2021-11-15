import { 
  Button,
  Typography,
  TextField,
  Grid,
  makeStyles,
} from '@material-ui/core';
import React from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { StoreContext } from '../utils/store';
import StatusDisplay from './status-display';

const useStyles = makeStyles({
  emailtext: {
    width: '80vw',
    maxWidth: '580px'
  },
});

const InviteViaEmail = function (props) {
  const classes = useStyles();
  const proid = props.project_id;
  const [email, setEmail] = React.useState('');
  const [loadingStatus, setLoadingStatus] = React.useState('');
  
  const context = React.useContext(StoreContext);

  const emailHandler = (e) => {
    setEmail(e.target.value);
  }
  const sendHandler = () => {
    const payload = {
      email: email,
      project_id: proid
    }
    axios.post(`${context.url}/proj/project/invite`,
      payload, 
      { headers:{ 
        'Content-Type': 'application/json'}
      })
      .then((response) => {
        console.log(response);
        if (response.status !== 200) {
          throw Error('Bad response.');
        }
        setLoadingStatus('done');
      })
      .catch((error) => {
        console.log(error);
        setLoadingStatus('error');
      });
  }

  return (
    <>
      <Typography
        variant = "h6"
      >
        This project is set up as <b>Private</b>. Let's invite reviewers here👇
      </Typography><br/>
      <TextField
        className={classes.emailtext}
        label = "Reviewers' email addresses (Please separate with commas)"
        variant = "outlined"
        fullWidth
        multiline = "true"
        rows = "4"
        helperText = "Invited reviewers will recieve an email with project ID and password"
        onChange = {emailHandler}
      ></TextField><br />
      <Grid
        container
        direction = "row"
        justify = "center"
        alignItems = "center"
      >
        <Button
          id='sendButton'
          onClick={sendHandler}
          color="secondary"
        >
          Send Invite email
        </Button>
        <StatusDisplay status={loadingStatus}></StatusDisplay>
      </Grid>
      <br />
    </>
  );
}

InviteViaEmail.propTypes = {
  project_id: propTypes.any.isRequired,
}

export default InviteViaEmail;
