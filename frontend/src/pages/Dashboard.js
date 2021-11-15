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
  useHistory,
  // Route,
  Link,
} from "react-router-dom";
import { StoreContext } from '../utils/store';
import PaginationLink from '../components/Pagination' 
import { MemoryRouter, Route } from 'react-router';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { HistoryRounded } from '@material-ui/icons';

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
    paddingTop: theme.spacing(0),
    // paddingBottom: theme.spacing(4),
  },
  searchResults: {
    margin: theme.spacing(4)
  },
  formControl: {
    width: '140px',
  },
  searchArea: {
    marginTop: "2%",
    // height: "100%",
  }
  // search_field: {
  //   marginTop: "5%",
  // }
}));

export default function Dashboard(props) {
  let location = useLocation();
  const classes = useStyles();
  const context = useContext(StoreContext);
  const [cards, setCards] = context.cards;
  const [DbPage, setDbPage] = context.DbPage;
  const UserId = window.localStorage.getItem("UserId");
  // const [UserId, setUserId] = context.UserId;
  const fields = context.fields;
  const [SearchText, setSearchText] = useState('');
  const [SearchField, setSearchField] = useState('');
  const [DbCards, setDbCards] = useState([]);
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);
  const [Subtitle, setSubtitle] = useState('Recommand documents for you: ')
  const history = useHistory();
  const [ResultOrder, setResultOrder] = useState(0);
  var goto_proj_id = 0;
  useEffect(()=>{
    if(window.localStorage.projectID){
      console.log("---");
      goto_proj_id = window.localStorage.projectID;
      window.localStorage.removeItem("projectID");
      console.log(goto_proj_id);
      history.push(`/projectreview?projectId=${goto_proj_id}`);
    }
  },[])

  useEffect(()=>{
    console.log("Current page: Dashboard", DbPage);
  }, [DbPage]);
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  const axios = require('axios');
  const requesturl = "http://127.0.0.1:5000/proj/project/recommand_user/" + UserId;
  const searchurl = "http://127.0.0.1:5000/proj/project/search";
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
          setDbCards(result);
        }else{
          setSubtitle(`Not yet document recommand for you, try complete your profile :)`)
        }
        console.log(result);
      })
      .then(function(){
        console.log('success');
      })
  },[]);
  function DoSearch(){
    // console.log(SearchText);
    axios.post(searchurl, {
      keyword : SearchText,
      field : SearchField,
    })
    .then(function(response){
      return response.data.result;
    })
    .then(function(result){
      console.log("search result is: ");
      console.log(result);
      setDbCards(result);
      setSubtitle(`${result.length ? result.length : 'No'} document${result.length>1 ? 's' : ''} found${result.length ? ':' : ''} `)
    })
  }
  // function handleOrderChange(value){
  //   setResultOrder(value);
  // }
  const handleOrderChange = (event) => {
    // setResultOrder(event.target.value);
    console.log(event);
    let cards = [...DbCards];
    event.target.value == 0 && cards.sort((a, b) => a.average_score - b.average_score);
    event.target.value == 1 && cards.sort((a, b) => b.average_score - a.average_score);
    setDbCards(cards);
    // console.log(cards);
    // console.log(cards);
    // cards.sort((a, b) => parseInt(a.project_id) - parseInt(b.project_id));
    // console.log(cards);
    // cards.sort((a, b) => parseInt(b.project_id) - parseInt(a.project_id));
    // console.log(cards);
  };
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBarLoggedIn />
      <main className={classes.content}>
      <div className={classes.heroContent}>
          <Container className={classes.container} maxWidth="lg" >
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Welcome to PReviewing!
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Search for the documents you are interested in 
            </Typography>
            <div className={classes.heroButtons}>
              <div className="Search" style={{ paddingBottom: 80 }}>
                <Grid container spacing={2} justify="center">
                  <Grid item xs={7}>
                    <TextField className={classes.searchArea} 
                    label="Search here" 
                    variant="outlined" 
                    fullWidth="True" 
                    onChange={e=>{setSearchText(e.target.value)}}/>
                  </Grid>
                  <Grid item xs={2}>
                    <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-helper-label">Field</InputLabel>
                    <Select
                      labelId="SearchFieldLabel"
                      id="SearchFieldId"
                      // value={age}
                      onChange={(e)=>{setSearchField(e.target.value);console.log(e.target.value)}}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {fields.map((field, idx) => (
                        <MenuItem value={field}>{field}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Choose field</FormHelperText>
                  </FormControl>
                  </Grid>
                  <Grid item className={classes.searchButtonGrid} xs={1.5}>
                    <Button className={classes.searchButton} variant="contained" color="primary" onClick={(e)=>DoSearch(e, 'string')}>
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </div>
              <Grid container spacing={2} justify="center">
                <Grid item sx={2}>
                  <div />
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h5" align="left" color="textSecondary" paragraph>
                    {Subtitle}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">Order by</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // value={age}
                    onChange={handleOrderChange}
                  >
                    <MenuItem value={1}>Highest rated</MenuItem>
                    <MenuItem value={0}>Lowest rated</MenuItem>
                  </Select>
                </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={3} justify="center">
                {DbCards.slice((page - 1) * 5, page * 5).map((card, idx) => (
                  <Grid item className="searchResults" xs={10}>
                    <OutlinedCard 
                    title={card.title} 
                    author={card.user_name} 
                    summary={card.summary} 
                    rate={card.average_score}
                    delButton={false} 
                    projectId={card.project_id}/>
                  </Grid>
                ))}
                <Grid item xs={12} />
                {DbCards.length > 0 && <Grid item>
                  <PaginationLink maxpage={parseInt((DbCards.length - 1) / 5) + 1} route="/Dashboard"></PaginationLink>
                </Grid>}
              </Grid>
            </div>
          </Container>
        </div>
      </main>
    </div>
  );
}
