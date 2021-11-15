import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import StarMark from '../components/startmark';
import Paper from '@material-ui/core/Paper';
import OutlinedCard from '../components/OutlinedCard';
import AppBarLoggedIn from '../components/appbarloggedin';
import clsx from 'clsx';
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from '@material-ui/core/IconButton';
import Like from '../components/startmark';
import './comment.css';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import StarRateIcon from '@material-ui/icons/StarRate';
import {
  BrowserRouter as Router,
  Switch,
  useLocation,
  // Route,
  Link,
} from "react-router-dom";
import { StoreContext } from '../utils/store';
import PaginationLink from '../components/Pagination' 
import { MemoryRouter, Route } from 'react-router';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
const BASE_URL = 'http://127.0.0.1:5000';
const useStyles = makeStyles((theme) => ({
  root: {
    // display: 'flex',
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  title: {
    flexGrow: 1,
  },
  searchButtonGrid: {
    display: 'flex',
    'align-items': 'center',
  },
  searchButton: {
    width: '100%',
  },
  content: {
    flexGrow: 1,
    // height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(2),
    // paddingBottom: theme.spacing(4),
  },
  searchResults: {
    margin: theme.spacing(4)
  },
  star:{
    marginBottom:'-8px',
    color:'gold'
  },
  seperate:{
    border: '1px solid #ccc'
  },
  profile_link:{
    "&:visited": {
      color: 'blue',
    }
  }
}));
export default function Comment(props) {
    const classes = useStyles();
    //const context = useContext(StoreContext);
    const UserId = localStorage.getItem('UserId');
    //const [UserId,setUserId] = context.UserId;
    const { comment } = props;
    console.log(comment);
    // console.log(props);
    return comment.map((items,index)=>{
      return (
        <>
         <div className='seperate'/>
          <Card key={index} className='comment_part'>
            <div className='firstrow'>
              <div className='first_1'> 
                <div className="projectscore">
                  <strong>Document Rating</strong><StarRateIcon className={classes.star}/>:  {items.score}&nbsp;&nbsp;<span className="fontcolor">by</span>
                </div>   
              </div>
              <div className='first_2'>
                {items.time}
              </div>
            </div> 
            <div className='secondrow'>
              <div className='comment_name'>
                <Link to={`/profile/${items.reviewer_id}`} style={{ textDecoration: 'none' }} className={classes.profile_link}>
                  {items.reviewer_name}:
                </Link>
              </div>
              <div>
                <Like 
                comment_id={items.comment_id}
                user_id={UserId}
                proj_id={props.proj_id}
                />
              </div>
            </div>
            <div className='thirdrow'>
              {items.content}
            </div>          
          </Card>      
        </>
      )
    });
  }
  Comment.propTypes = {
    proj_id: PropTypes.number,
  }
  
