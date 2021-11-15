import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import { CenterFocusStrong } from '@material-ui/icons';
import icon1 from '../pics/field_option.png'
import icon2 from '../pics/review_priority.png'
import icon3 from '../pics/private_share.png'
import icon4 from '../pics/feedback.png'
import icon5 from '../pics/recommend.png'
import icon6 from '../pics/review.png'
import icon7 from '../pics/score.png'

const useStyles = makeStyles((theme) => ({
  signup: {
    margin: theme.spacing(3, 0, 2),
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  signin: {
    margin: theme.spacing(3, 0, 2),
  },
  appName: {
    flexGrow: 1,
  },
  signButton: {
    margin: theme.spacing(1, 0, 1, 2),
  },
  page: {
    height: '100vh',
    // backgroundImage: `url(${mantis_lords})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  body: {
    color: 'black',
    fontSize: '20pt',
    margin: theme.spacing(9),
    // textAlign: 'center',
  },
  gridItem: {
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: '24pt',
    marginTop: theme.spacing(10),
    color: "#000063",
  },
  subTitle: {
    textAlign: 'center',
    fontSize: '15pt',
    marginTop: theme.spacing(-8),
    color: 'gray',
  },
  featureTitle:{
    marginLeft: '10px',
    textAlign: 'center',
    fontSize: '16pt',
    color: "#424242",
  },
  featureText: {
    marginLeft: '10px',
    textAlign: 'center',
    fontSize: '12pt',
    color: "#3f51b5",
    marginTop: theme.spacing(3),
  },
  img: {
    height: '150px',
    width: '150px',
  },
  GridContainer2: {
    textAlign: "center",
  },
  GridContainer1: {
    marginTop: theme.spacing(-15),
  }
}));

function Welcome() {
  const classes = useStyles();
  return (
    <React.Fragment>
    <div  className={classes.page}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <FindInPageIcon className={classes.icon} />
          <Typography className={classes.appName} variant="h6" color="inherit" noWrap>
            PReviewing
          </Typography>
          <Button 
          className={classes.signButton}
          component={Link}
          to={"/signin"}
          variant="contained" 
          color="secondary">
            Sign In
          </Button>
          <Button 
          className={classes.signButton}
          component={Link}
          to={"/signup"}
          variant="contained" 
          color="secondary">
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.body}>
        <Grid container spacing={10} className={classes.GridContainer1}>
          <Grid item xs={12} className={classes.title}>
            Have you ever suffered from not knowing how good your document is? 
          </Grid>
          {/* <Grid item xs={12} className={classes.subTitle}>
            <p>It shouldn’t take 30 emails to schedule a 30-minute </p>
          </Grid> */}
          <Grid item xs={3} className={classes.gridItem}>
            <img className={classes.img} src={icon1}></img>
            <div className={classes.featureTitle}>
              Fields option
            </div>
            <div className={classes.featureText}>
              Set fileds of document to help others know what kind of fileds the document belongs to and make the document easy to search. 
            </div>
          </Grid>
          <Grid item xs={3} className={classes.gridItem}>
            <img className={classes.img} src={icon2}></img>
            <div className={classes.featureTitle}>
            Review priority
            </div>
            <div className={classes.featureText}>
              If you want someone in particular major or degree to review your document, set preferred major and degree to push your document to their dashboard. 
            </div>
          </Grid>
          <Grid item xs={3} className={classes.gridItem}>
            <img className={classes.img} src={icon3}></img>
            <div className={classes.featureTitle}>
              Private document share
            </div>
            <div className={classes.featureText}>
              If you want to share your document with specific reviewers, you can set it as private and invite them via email. 
            </div>
          </Grid>
          <Grid item xs={3} className={classes.gridItem}>
            <img className={classes.img} src={icon4}></img>
            <div className={classes.featureTitle}>
              Feedback
            </div>
            <div className={classes.featureText}>
              Be tired of reading hundreds of comments? You will get a feedback report showing other’s opinions on your document. 
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={10} className={classes.GridContainer2}>
          <Grid item xs={12} className={classes.title}>
            Do you want to help others out and get yourself inspired? 
          </Grid>
          {/* <Grid item xs={12} className={classes.subTitle}>
            <p>It shouldn’t take 30 emails to schedule a 30-minute </p>
          </Grid> */}
          <Grid item xs={1}> </Grid>
          <Grid item xs={3} className={classes.gridItem}>
            <img className={classes.img} src={icon5}></img>
            <div className={classes.featureTitle}>
              Recommend
            </div>
            <div className={classes.featureText}>
              According to your background, system can recommend you the optimise documents.
            </div>
          </Grid>
          <Grid item xs={3} className={classes.gridItem}>
            <img className={classes.img} src={icon6}></img>
            <div className={classes.featureTitle}>
              Review document
            </div>
            <div className={classes.featureText}>
              You can give any suggestion toward document and give a score to the document to show how you are satisfied by the content in it. 
            </div>
          </Grid>
          <Grid item xs={3} className={classes.gridItem}>
            <img className={classes.img} src={icon7}></img>
            <div className={classes.featureTitle}>
              Score comments
            </div>
            <div className={classes.featureText}>
              You can mark both the document and other reviewers in your mind 
            </div>
          </Grid>
          <Grid item xs={1}> </Grid>
          {/* <Grid item xs={3} className={classes.gridItem}>
            <img className={classes.img} src={icon1}></img>
            <div className={classes.featureTitle}>
              this is a feature of this 
            </div>
            <div className={classes.featureText}>
              this is a very very long text to introduce this feature,
              this is a very very long text to introduce this feature,
              this is a very very long text to introduce this feature,
            </div>
          </Grid> */}
        </Grid>
      </div>
    </div>
    </React.Fragment>
  );
}

export default Welcome;
