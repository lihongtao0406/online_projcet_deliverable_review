import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  MenuItem,
  makeStyles
} from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  smallText: {
    width: '240px',
  },
});

const PublicOrPrivate = (props) => {
  const classes = useStyles();

  const ppList = ['Private', 'Public'];
  const degree = [
    "none",
    "Bachelor",
    "Master",
    "PhD"
  ];
  const major = [
    "none",
    "Agriculture",
    "Animal Sciences",
    "Food Sciences & Technology",
    "Architecture",
    "Women’s Studies",
    "Art",
    "Accounting",
    "Finance",
    "Public Relations",
    "Computer Science",
    "Civil Engineering",
    "Mechanical Engineering"
  ]
  const pp = props.public;
  const setPublic = props.setPublic;
  const setPreferedDegree = props.setPreferedDegree;
  const setPreferedMajor = props.setPreferedMajor;
  const setPassword = props.setPassword;
  
  const ppHandler = (event) => {
    if (event.target.value === 'Public') {
      setPublic(1);
    } else {
      setPublic(0);
    }
  };
  const degreeHandler = (event) => {
    setPreferedDegree(event.target.value);
  };
  const majorHandler = (event) => {
    setPreferedMajor(event.target.value);
  };
  const passwordHandler = (event) => {
    setPassword(event.target.value);
  };

  return (
    <>
      <Grid
        container
        direction = "row"
        justify = "space-between"
        alignItems = "center"
      >
        <TextField
          className={classes.smallText}
          select
          label="Access"
          value={ppList[pp]}
          onChange={ppHandler}
          variant="outlined"
        >
          {ppList.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        {(pp === 1) && 
          <Typography variant="body2">
            This document will be recommanded to all reviewers with preferred major and degree.
          </Typography>
        }
        {(pp === 0) && 
          <Typography variant="body2">
          </Typography>
        }
      </Grid><br />
      {(pp === 1) &&
        <Grid
          container
          direction = "row"
          justify = "space-between"
          alignItems = "center"
        >
          <TextField
            className={classes.smallText}
            select
            label="Preferred Reviewer Degree"
            // value={ppList[pp]}
            onChange={degreeHandler}
            variant="outlined"
          >
            {degree.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            className={classes.smallText}
            select
            label="Preferred Reviewer Major"
            // value={ppList[pp]}
            onChange={majorHandler}
            variant="outlined"
          >
            {major.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      }
    </>
  )
}
  
PublicOrPrivate.propTypes = {
  public: PropTypes.any.isRequired,
  setPublic: PropTypes.any.isRequired,
  setPreferedDegree: PropTypes.any.isRequired,
  setPreferedMajor: PropTypes.any.isRequired,
  setPassword: PropTypes.any.isRequired,
}
  
export default PublicOrPrivate;
