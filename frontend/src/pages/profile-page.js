import React, { useEffect, useState } from 'react';
import {
  Grid,
  makeStyles,
  Typography,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,

} from '@material-ui/core';
import AppBarLoggedIn from '../components/appbarloggedin';
import axios from 'axios';
import { StoreContext } from '../utils/store';
import { useParams } from 'react-router-dom';


const useStyles = makeStyles({
  frame: {
    width: '80vw',
    maxWidth: '800px'
  },
  pic: {
    width: '180px',
    height: '180px',
    marginRight: '40px'
  },
  gary: {
    color: '#8c8c8c'
  },
  card: {
    width: '575px'
  }
});

const ProfilePage = function () {
  const param = useParams();
  const userId = param.userId;
  const classes = useStyles();
  const context = React.useContext(StoreContext);
  const currentUserId = window.localStorage.getItem("UserId");
  
  const [profile, setProfile] = useState({});
  const [valueT, setValueT] = useState(0);

  useEffect(() => {
    axios.get(`${context.url}/prof/${userId}`,
    { headers:{ accept: 'application/json',} })
    .then((response) => {
      console.log(response);
      if (response.status !== 200) {
        throw Error('Bad response.');
      }
      setProfile(response.data.profile[0]);
    })
    .catch((error) => {
      console.log(error);
    });
  }, [userId])

  console.log(profile);
  return (
    <>
      <AppBarLoggedIn /><br/>
      <Grid
        container
        direction = "column"
        justify = "center"
        alignItems = "center"
      >
        <Grid
          container
          direction = "row"
          justify = "flex-start"
          alignItems = "flex-start"
          className = {classes.frame}
        > 
          <Grid item>
            <Grid
              container
              direction = "column"
              justify = "center"
              alignItems = "flex-start"
            >
              <img src={profile.image} className={classes.pic} alt={"avator"}/><br/>
              {userId == currentUserId && <Typography variant = "h6">
                💰 Coin(s): {`${profile.coin}`} 
              </Typography>}
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              container
              direction = "column"
              justify = "flex-start"
              alignItems = "flex-start"
            >
              <Typography variant = "h4">
                Profile
              </Typography><br/>
              <Typography variant = "h6">
                {`${profile.name}`}
              </Typography>
              <Typography variant = "h6" className={classes.gary}>
                {`${profile.email}`}
              </Typography><br/>
              <Typography variant = "h6">
                Major: {profile.major}
              </Typography>
              <Typography variant = "h6">
                Degree: {profile.degree}
              </Typography><br/>
              <Typography variant = "h6">
                Activity Statistics:
              </Typography>
              <Card className={classes.card} variant="outlined">
                <Tabs
                  value={valueT}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={(e, newvalue)=>{setValueT(newvalue)}}
                  variant="fullWidth"
                >
                  <Tab label={`${profile.total_project_number} Document(s)`}/>
                  <Tab label={`${profile.total_comment_number_from} Comment(s)`} />
                </Tabs>
                <CardContent>
                  {(valueT === 0) &&
                    <>
                      <Typography variant = "h6">
                        Number of Comments Received: <b>{profile.total_comment_number_from} </b>
                      </Typography>
                      <Typography variant = "h6">
                        Average Document Score ⭐ : <b>{profile.average_project_rank_from}</b>
                      </Typography>
                      <Typography variant = "h6">
                        Project Fields: {profile.project_fields}
                      </Typography>
                    </>
                  }
                  {(valueT === 1) &&
                    <>
                      <Typography variant = "h6">
                        Average Comment Rank 😃 : {profile.average_comment_rank_from ? <b>{profile.average_comment_rank_from}</b> : "Not yet ranked"}
                      </Typography>
                      <Typography variant = "h6">
                        Comment Fields: {profile.interest_fields}
                      </Typography>
                    </>
                  }
                </CardContent>
              </Card>
              
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
// {
//   "id": 0,
//   "name": "string",
//   "email": "string",
//   "major": "string",
//   "degree": "string",
//   "coin": 0,
//   "image": "string",
//   "total_project_number": 0,
//   "total_comment_number_to": 0,
//   "total_comment_number_from": 0,
//   "average_project_rank_to": 0,
//   "average_project_rank_from": 0,
//   "average_comment_rank_to": 0,
//   "average_comment_rank_from": 0,
//   "project_fields": "string",
//   "interest_fields": "string"
// }
export default ProfilePage;
