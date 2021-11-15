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
import {
  BrowserRouter as Router,
  Switch,
  useHistory,
  Route,
  Link as RLink,
} from "react-router-dom";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { StoreContext } from '../utils/store';



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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    // margin: theme.spacing(1),
    // minWidth: 120,
    width: '100%',
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const context = useContext(StoreContext);
  const [UserId, setUserId] = context.UserId;
  const [UserName,setUserName] = context.UserName;
  const fields = context.fields;
  const degrees = [
    "Bachelor",
    "Master",
    "PhD"
  ];
  const [CurrentDegree, setCurrentDegree] = useState('');
  const [CurrentMajor, setCurrentMajor] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  var storage = window.localStorage;
  // const handleFieldChange = (e) => {
  //   setCurrentField(e.target.value);
  // }
  // const handleMajorChange = (e) => {
  //   setCurrentMajor(e.target.value);
  // }  
  const history = useHistory();
  const axios = require('axios');
  const signupurl = "http://localhost:5000/auth/signup";
  const signup = () => {
    // console.log(password);
    // console.log(email);
    axios.post(signupurl, {
      email: email,
      name: FirstName + ' ' + LastName,
      password: password,
      major: CurrentMajor,
      degree: CurrentDegree,
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
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={e=>setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={e=>setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={e=>setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={e=>setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Major</InputLabel>
              <Select
                // value={age}
                onChange={e=>setCurrentMajor(e.target.value)}
                label="Major"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {fields.map((field, idx) => (
                  <MenuItem value={field}>{field}</MenuItem>
                ))}
              </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Degree</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                // value={age}
                onChange={e=>setCurrentDegree(e.target.value)}
                label="Degree"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {degrees.map((degree, idx) => (
                  <MenuItem value={degree}>{degree}</MenuItem>
                ))}
              </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={signup}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}