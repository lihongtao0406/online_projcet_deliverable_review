import React, { useState } from 'react';
import {
  Grid,
  makeStyles,
  TextField,
  Typography,
  MenuItem,
  Button
} from '@material-ui/core';
import UploadFile from '../components/upload-file';
import AppBarLoggedIn from '../components/appbarloggedin';
import { StoreContext } from '../utils/store';
import PublicOrPrivate from '../components/public-or-private';
import axios from 'axios';
import GoToButton from '../components/go-to-button';
import InviteViaEmail from '../components/invite-via-email';

const useStyles = makeStyles({
  frame: {
    width: '80vw',
    maxWidth: '800px'
  },
  smallText: {
    width: '240px',
  },
});

const ProjectUploadPage = function() {
  const classes = useStyles();
  const context = React.useContext(StoreContext);
  const userId = localStorage.getItem('UserId');
  const username = localStorage.getItem('UserName');
  const fields = context.fields;

  // const fields = [
  //   "none",
  //   "Agriculture",
  //   "Animal Sciences",
  //   "Food Sciences & Technology",
  //   "Architecture",
  //   "Women’s Studies",
  //   "Art",
  //   "Accounting",
  //   "Finance",
  //   "Public Relations",
  //   "Computer Science",
  //   "Civil Engineering",
  //   "Mechanical Engineering"
  // ]

  const [pp, setPP] = useState(1);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [field3, setField3] = useState('');
  const [preferedDegree, setPreferedDegree] = useState('');
  const [preferedMajor, setPreferedMajor] = useState('');
  const [password, setPassword] = useState('');

  const [projectId, setProjectId] = useState(-1);

  const titleHandler = (event) => {
    setTitle(event.target.value);
  };
  const summaryHandler = (event) => {
    setSummary(event.target.value);
  };
  const fieldHandler1 = (event) => {
    setField1(event.target.value);
  };
  const fieldHandler2 = (event) => {
    setField2(event.target.value);
  };
  const fieldHandler3 = (event) => {
    setField3(event.target.value);
  };

  const createProject = () => {
    const fieldString = field1+','+field2+','+field3;
    const timeString = Date().toString();
    const payload = {
      user_id: userId,
      user_name: username,
      title: title,
      field: fieldString,
      summary: summary,
      time: timeString,
      public: pp,
      prefered_major: preferedMajor,
      prefered_degree: preferedDegree,
      password: password
    }
    axios.post(`${context.url}/proj/project/management`,
      payload, 
      { headers:{ 
        accept: 'application/json',
        'Content-Type': 'application/json'}
      })
      .then((response) => {
        console.log(response);
        if (response.status !== 200) {
          throw Error('Bad response.');
        }
        setProjectId(response.data.project_id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <AppBarLoggedIn />
      <Grid
        container
        direction = "column"
        justify = "center"
        alignItems = "center"
      >
        { (projectId === -1) &&
        <Grid
          container
          direction = "column"
          justify = "center"
          alignItems = "center"
          className = {classes.frame}
        >
          <br/>
          <Typography
            variant = "h4"
          >
            Create New Document
          </Typography><br/>
          <TextField
            label = "Document Title"
            variant = "outlined"
            fullWidth
            onChange = {titleHandler}
          /><br/>
          <TextField
            label = "Document Summary"
            variant = "outlined"
            fullWidth
            multiline = "true"
            rows = "8"
            helperText = "Please provide a summary for your document (under 1000 words)."
            onChange = {summaryHandler}
          /><br/>
          <Grid
            container
            direction = "row"
            justify = "space-between"
            alignItems = "center"
          >
            <TextField
              className={classes.smallText}
              select
              label="Related Field 1"
              // value={field1}
              onChange={fieldHandler1}
              helperText="Please select related Field 1"
              variant="outlined"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {fields.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              className={classes.smallText}
              select
              label="Related Field 2"
              // value={field2}
              onChange={fieldHandler2}
              helperText="Please select related Field 2"
              variant="outlined"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {fields.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              className={classes.smallText}
              select
              label="Related Field 3"
              // value={field3}
              onChange={fieldHandler3}
              helperText="Please select related Field 3"
              variant="outlined"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {fields.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid><br />
          <PublicOrPrivate 
            public = {pp}
            setPublic = {setPP}
            setPreferedDegree = {setPreferedDegree}
            setPreferedMajor = {setPreferedMajor}
            setPassword = {setPassword}
          ></PublicOrPrivate>
          <br />
          <Grid
            container
            direction="row"
            justify = "center"
            alignItems="center"
          >
            <GoToButton
              variant="contained"
              to="/myproject"
            >
              CANCEL
            </GoToButton>
            <Button
              variant="contained"
              color="primary"
              onClick={createProject}
              style={{marginLeft: "18px"}}
            >
              Create Document
            </Button>
          </Grid>
        </Grid>
        }
        { (projectId !== -1) &&
          <Grid
            container
            direction = "column"
            justify = "center"
            alignItems = "center"
            className = {classes.frame}
          > 
            <br/>
            <Typography
              variant = "h4"
            >
              Document has been created.
            </Typography><br/>
            <Typography
              variant = "h6"
            >
              Let's upload file here👇
            </Typography><br/>
            <UploadFile project_id = {projectId}></UploadFile><br />
            { (pp === 0) &&
              <InviteViaEmail project_id = {projectId}></InviteViaEmail>
            }
            <GoToButton
              variant="contained"
              to="/myproject"
            >
              Finish
            </GoToButton>
          </Grid>
        }
      </Grid>
    </>
  )
}

export default ProjectUploadPage;
