import React, { useState, useContext, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { StoreContext } from '../utils/store';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  Link as RLink,
} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const context = useContext(StoreContext);
  const [UserId, setUserId] = context.UserId;
  const [UserName,setUserName] = context.UserName;
  const history = useHistory();
  const axios = require('axios');
  const loginurl = "http://localhost:5000/auth/login";
  var storage = window.localStorage;
  const login = () => {
    // console.log(password);
    // console.log(email);
    axios.post(loginurl, {
      email: email,
      password: password,
    })
    .then((data)=>{
      console.log(data.request.response);
      const succeedmsg = JSON.parse(data.request.response);
      setUserId(succeedmsg.user_id);
      setUserName(succeedmsg.user_name);
      storage.setItem("UserId",succeedmsg.user_id);
      storage.setItem("UserName", succeedmsg.user_name);
      // storage.getItem("porjectID") ? history.push(`/projectreview?projectId=${storage.getItem("porjectID")}`) : history.push('/Dashboard');
      history.push('/Dashboard');
    })
    .catch((err)=>{
      var errmsg = JSON.parse(err.request.response);
      // console.log(errmsg, typeof(errmsg));
      console.log(errmsg.message);
      alert(errmsg.message);
    })
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={e=>setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={e=>setPassword(e.target.value)}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            // component={RLink}
            // to={"/Dashboard"}
            // type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={login}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                {/* Forgot password? */}
              </Link>
            </Grid>
            <Grid item>
              <Link href="signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}