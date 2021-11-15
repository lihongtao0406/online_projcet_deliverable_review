import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
const BASE_URL = 'http://127.0.0.1:5000';
const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfiedIcon />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon />,
    label: 'Very Satisfied',
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function CustomizedRatings(param) {
  const [value,setValue]=useState(0);
  const [finish,setFinish]=useState(false);
  const submit = async (newValue)=>{
    const body = {
      "comment_id": param.comment_id,
      "user_id": param.user_id,
      "rank": newValue
    };
    const resp = await fetch(`${BASE_URL}/Comm/rank`, {
      body: JSON.stringify(body),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (resp.status === 200){
      setFinish(true);
      console.log(newValue);
      localStorage.setItem(param.comment_id,newValue);
    }
  }
  const checkRank = async () =>{
    const res = await fetch(`${BASE_URL}/proj/project/${param.proj_id}/${param.user_id}`,{
      method: 'GET',
      headers:{
        'Content-Type': 'application/json'
      }
    });
    if(res.status == 200){
      const dataObj = await res.json();
      for (var i=0;i<dataObj.data.rank.length;i++){
        if(parseInt(dataObj.data.rank[i].comment_id) === parseInt(param.comment_id)){
          setValue(parseInt(dataObj.data.rank[i].rank));
          setFinish(true);
        }
      }
      
    }
  }
  useEffect(() => {
    checkRank();
  }, []);
  
  return (
    <div>
      <Box component="fieldset" mb={3} borderColor="transparent">
        <Rating
          disabled={finish}
          value={value}
          getLabelText={(k) => customIcons[k].label}
          IconContainerComponent={IconContainer}
          onChange={(event, newValue) => {
            setValue(newValue);
            submit(newValue);
          }}
        />
      </Box>
    </div>
  );
}
CustomizedRatings.propTypes = {
  comment_id: PropTypes.number.isRequired,
  user_id: PropTypes.number.isRequired,
  proj_id: PropTypes.number
}
