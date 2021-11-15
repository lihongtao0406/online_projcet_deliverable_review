import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';
import { DeleteRounded, LinearScale } from '@material-ui/icons';
import { transform } from 'typescript';
import { Link } from 'react-router-dom';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Alert from '@material-ui/lab/Alert';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import EmailInvite from '../components/invite-via-email'
import Popover from '@material-ui/core/Popover';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    // '&:hover': {
    //   scale: transform(1.2),
    // },
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  TitleAuthorGrid: {
    flexGrow: 1,
  },
  spacingDiv: {
    flexGrow: 1,
  },
});

export default function OutlinedCard(props) {
  const classes = useStyles();
//   const bull = <span className={classes.bullet}>•</span>;
  const [elev, setelev] = useState(2);
  const [deleted, setDeleted] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const window_height = 400;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const email_invite_id = open ? 'simple-popover' : undefined;
  const axios = require('axios');
  const deleteurl = "http://127.0.0.1:5000/proj/project/management";
  function DeleteProject(){
    axios.delete(deleteurl, {
      data: {
        project_id: props.projectId,
      }
    })
    .then(function (response) {
      console.log(response);
      alert('Project Deleted');
      setDeleted(1);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  if(deleted){
    return null;
  }
  return (
    <Card className={classes.root} variant="elevation" elevation={elev}
    onMouseEnter={() => setelev(6)}
    onMouseLeave={() => setelev(3)}>
      <CardContent>
        <Grid 
        container 
        spacing={3}
        direction="row"
        >
          <Grid item xs={7} md={9} lg={10} >
            <Typography variant="h5" component="h2">
              {props.title}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {props.author}
            </Typography>
          </Grid>
          <div className={classes.spacingDiv} />
          <Grid item >
            <Typography className={classes.rating} color="textSecondary" gutterBottom>
              <Rating name="read-only" value={props.rate} readOnly precision={0.1}/>
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="body2" component="p">
            {props.summary}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
        className={classes.more}
        size="small" 
        component={Link}
        to={`/projectreview?projectId=${props.projectId}`}>View More</Button>
        <div className={classes.spacingDiv} />
        { (props.delButton && !props.public) && <Button name="del"  onClick={handleClick}>
          <AlternateEmailIcon />
        </Button>}
        { (props.delButton && !props.public) && <Popover
        id={email_invite_id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: 250,
          left: 450,
        }}
        // anchorOrigin={{
        //   vertical: 'top',
        //   horizontal: 'left',
        // }}
        // transformOrigin={{
        //   vertical: 'top',
        //   horizontal: 'center',
        // }}
      >
        <EmailInvite project_id={props.projectId}/>
      </Popover>}
        { props.delButton && <Button name="del" onClick={DeleteProject}>
          <DeleteForeverIcon />
        </Button>}
      </CardActions>
    </Card>
  );
}