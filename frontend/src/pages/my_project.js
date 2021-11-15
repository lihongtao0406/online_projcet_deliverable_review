import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import OutlinedCard from '../components/OutlinedCard';
import AppBarLoggedIn from '../components/appbarloggedin';
import {
  BrowserRouter as Router,
  Switch,
  useLocation,
  // Route, 
  Link as Link,
} from "react-router-dom";
import { StoreContext } from '../utils/store';
import PaginationLink from '../components/Pagination' 
import { MemoryRouter, Route } from 'react-router';
 
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

}));

export default function Dashboard() {
  let location = useLocation();
  const classes = useStyles();
  const context = useContext(StoreContext);
  const [cards, setCards] = context.cards;
  const [MpPage, setMpPage] = context.MpPage;
  // const [UserId, setUserId] = context.UserId;
  const UserId = window.localStorage.getItem("UserId");
  const [MpCards, setMpCards] = useState([]);
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);  
  const [ProjIdToDel, setProjIdToDel] = useState(-1);
  const [update, setUpdate] = useState(0);
  const [Subtitle, setSubtitle] = useState('Manage my documents: ');
  // console.log(props); 
  useEffect(()=>{
    console.log("Current page: MyProject", MpPage);
  }, [MpPage]);
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  const axios = require('axios');
  const requesturl = "http://127.0.0.1:5000/proj/project/myProject/" + UserId;
  const deleteurl = "http://127.0.0.1:5000/proj/project/management";  
  useEffect(()=>{
    axios.get(requesturl)
      .then(function(response){
        console.log(response.data);
        return response.data;
      })
      .then(function(data){
        console.log(data.result);
        return data.result;
      })
      .then(function(result){
        console.log(result);
        if(result.length > 0){
          setMpCards(result);
        }else{
          setSubtitle("No ducument yet. Click the button above to share your idea :)")
        }
      })
      .then(function(){
        console.log(MpCards);
        console.log('success');
      })
  },[]);
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBarLoggedIn />
      <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <div className={classes.heroContent}>
          <Container className={classes.container} maxWidth="lg">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              My Documents
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Manage My Documents Here :)
            </Typography>
            <div className={classes.heroButtons}>
              <div style={{ paddingBottom: 80, textAlign: 'center'}}>
                <Button m="auto" variant="contained" color="secondary" component={Link} to={'/projectupload'}>Add New Document</Button>
              </div>
              <Grid container spacing={2} justify="center">
                <Grid item sx={2}>
                  <div />
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="h5" align="left" color="textSecondary" paragraph>
                    {Subtitle}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={3} justify="center">
                {MpCards.slice((page - 1) * 5, page * 5).map((card, idx) => (
                    <Grid item className="searchResults" xs={10}>
                      <OutlinedCard 
                      title={card.title} 
                      author={card.user_name} 
                      summary={card.summary} 
                      rate={card.average_score} 
                      projectId={card.project_id} 
                      delButton={true}
                      public={card.public}
                      update = {update} />
                    </Grid>
                  ))}
                  <Grid item xs={12} />
                  {MpCards.length > 0 && <Grid item>
                    <PaginationLink maxpage={parseInt(MpCards.length / 5 - 1) + 1} route='/myproject'></PaginationLink>
                  </Grid>}
              </Grid>
            </div>
          </Container>
        </div>
      </main>
    </div>
  );
}
