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
import clsx from 'clsx';
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from '@material-ui/core/IconButton';
import Comment from './Comment';
import Rating from '@material-ui/lab/Rating';
import samlpePDF from './sample1.pdf';
import AllPagesPDFViewer from "../components/allpages";
import Alert from '@material-ui/lab/Alert';
import {
  BrowserRouter as Router,
  Switch,
  useLocation,
  // Route,
  useHistory,
  Link,
} from "react-router-dom";
import { StoreContext } from '../utils/store';
import PaginationLink from '../components/Pagination' 
import { MemoryRouter, Route } from 'react-router';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import UploadFile from '../components/upload-file';
import StarRateIcon from '@material-ui/icons/StarRate';
import Card from '@material-ui/core/Card';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import { display } from '@material-ui/system';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const BASE_URL = 'http://127.0.0.1:5000';
const useStyles = makeStyles((theme) => ({
  frame: {
    width: '80vw',
    maxWidth: '800px',
    margin:' auto',
    marginTop:'20px',
  },
  button1:{
    width: '80vw',
    maxWidth: '800px',
    margin:' auto',
    display: 'flex',
    justifyContent:'flex-end',
    alignItems:'center',
    paddingRight:'12px'
  },
  link:{
    width: '80vw',
    maxWidth: '800px',
    display: 'flex',
    justifyContent:'space-between',
    alignItems:'center',
    paddingRight:'12px'
  },
  root: {
    marginTop:'40px'
    // display: 'flex',
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3, 0, 6),
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
    paddingTop: '10px',
    backgroundColor:'#ccc',
    paddingBottom:'10px',
    paddingLeft:'14px',
    fontSize:'18px',
    fontWeight:'bolder'
    // paddingBottom: theme.spacing(4),
  },
  searchResults: {
    margin: theme.spacing(4)
  },
  form:{
    padding: '15px',
    background:'white'
  },
  star:{
    marginBottom:'-6px',
    color:'gold'
  },
  buttonPos:{
    marginRight:'-11px'
  },
  frame1:{
    marginTop:'10px',
    // color:'#f50057',
  },
  view1:{
    display:'none'
  },
  view2:{
    
  },
  view3:{
    visibility:'hidden'
  },
  view4:{
    display:'flex',
  },
  dbtn:{
    height:'22px',
    color:'red'
  },
}));
export default function ProjectReview() {
  const history = useHistory();
  const context = useContext(StoreContext);
  //const [UserName,setUserName] = context.UserName;
  //const [UserId,setUserId] = context.UserId;
  const [type,setType] = useState();
  const [txt,setTxt] = useState();
  const [open, setOpen] = React.useState(false);
  const [click,setclick]= useState(false);
  const [pdf,setPDF] = useState();
  const [tittle,setTittle] = useState();
  const [splitPDF,setSplitPDF] = useState();
  const [project_score,setProjectScore] = useState();
  const [comment_content,setComment_content] = useState('Comment');
  let location = useLocation();
  const query = new URLSearchParams(location.search);
  const [displayshow, setDisplay]=useState(false);
  const [show,setShow]=useState(false);
  const projectId = parseInt(query.get('projectId') || '1', 10);
  if(!localStorage.getItem('UserId')){    
    localStorage.setItem('projectID',projectId);
    history.push('/signin');
  }
  //xinjian de fang fa
  const [comment,setComment] = useState([]);
  const [feedback,setFeedback] = useState();
  const getComment = async () =>{
    const res = await fetch(`${BASE_URL}/proj/project/${projectId}/${localStorage.getItem('UserId')}`,{
      method: 'GET',
      headers:{
        'Content-Type': 'application/json'
      }
    });
    if(res.status == 200){
      const dataObj = await res.json();
      setComment(dataObj.data.comments);
    }
  }
  const getPDF = async () =>{
    const res = await fetch(`${BASE_URL}/proj/project/file/${projectId}`,{
      method: 'GET',
      headers:{
        'Content-Type': 'application/json'
      }
    });
    if(res.status == 200){
      const dataObj = await res.json();
      setPDF(dataObj.filepath);
      const a = dataObj.filepath.split('/');
      //console.log(a);
      setSplitPDF(a[6]);
    }
    const project_data = await fetch(`${BASE_URL}/proj/project/${projectId}/${localStorage.getItem('UserId')}`,{
      method: 'GET',
      headers:{
        'Content-Type': 'application/json'
      }
    });
    if(project_data.status == 200){
      const dataProject = await project_data.json();
      //项目的得分
      setProjectScore(dataProject.data.detail[0].average_score)
      //console.log(dataProject.data.detail[0].average_score);
      //console.log("1123",dataProject.data.detail[0].user_id);
      //console.log("UserId",UserId);
      for (var i=0;i<dataProject.data.comments.length;i++){
        if(parseInt(dataProject.data.comments[i].reviewer_id) === parseInt(localStorage.getItem('UserId'))){
          setclick(true);
          // setOpen(true);
          // setType("error");
          // setTxt("Already commented before!");
          setValue(dataProject.data.comments[i].score);
          setComment_content(dataProject.data.comments[i].content);
        }
      }
      console.log("KOOOOO",dataProject.data.detail[0].user_id);
      //console.log("BBBBBBB",UserId);
      if(parseInt(dataProject.data.detail[0].user_id) == parseInt(localStorage.getItem('UserId'))){
        setDisplay(true);
        setShow(true);
      }
    }
  }
  const getTittle = async () =>{
    const resp= await fetch(`${BASE_URL}/proj/project/${projectId}/${localStorage.getItem('UserId')}`,{
      method: 'GET',
      headers:{
        'Content-Type': 'application/json'
      }
    });
    if(resp.status == 200){
      const data = await resp.json();
      console.log(123);
      console.log(data);
      setTittle(data.data.detail[0].title);
    }
  }
  const getFeedback = async () =>{
    const resp= await fetch(`${BASE_URL}/repo/report/${projectId}`,{
      method: 'GET',
      headers:{
        'Content-Type': 'application/json'
      }
    });
    if(resp.status == 200){
      const data = await resp.json();
      setFeedback(data.report_path);
    }
  }
  
  //星星评分
  const [value, setValue] = React.useState(0);
  //feedback
  const [content, setContent]=useState();
  const classes = useStyles();
  const submit = async ()=>{
    const body = {
      "project_id": projectId,
      "reviewer_id": localStorage.getItem('UserId'),//UserId,
      "reviewer_name": localStorage.getItem('UserName'),//UserName,
      "score": value,
      "content":content
    };
    const resp = await fetch(`${BASE_URL}/Comm/comment`, {
      body: JSON.stringify(body),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (resp.status === 200) {
      setclick(true);
      setType("success");
      setTxt("success submit!");
      setOpen(true);
      getComment();
    }
    // if (resp.status === 401){
    //   setOpen(true);
    //   setType("error");
    //   setTxt("Already commented before!");
    // }
  }
  useEffect(() => {
    getPDF();
    getTittle();
    getComment();
    getFeedback();
  }, []);
  console.log("asdasf",displayshow);
    return (
      <>
        <AppBarLoggedIn />
        <div className={classes.frame}>
          <Typography
            variant = "h4"
            align="center"
          >
            {tittle}
          </Typography>
          <Typography className={classes.frame1} lign="center">
            Overall score:<StarRateIcon className={classes.star}/>  {project_score} / 5.0
          </Typography>
          <AllPagesPDFViewer pdf={pdf}/>
          <div className={classes.link}>
            <div className={show? classes.view4 : classes.view3}>My Project feedback:
            <Button
              className={classes.dbtn}
              color='secondary'
              href={feedback}
              color="transparent"
              target="_blank"
              download>Feedback
            </Button>
            </div>
            <div><a href={pdf} target="_blank" dowload>open in new window</a></div>
          </div>
          <br/>
          <Card className={displayshow? classes.view1 : classes.view2}>
          <Grid container className = {classes.form}>
          <Grid
            container
            direction="row"
            className = {classes.frame}
          >
            <Typography>Rate this document:&nbsp;&nbsp;&nbsp;</Typography>
            <Rating
            disabled={click}
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />
          </Grid>
          <Collapse in={open}>
              <Alert
              severity={type}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              >
                {txt}
              </Alert>
          </Collapse>
          <Grid
            container
            direction="column"
            className = {classes.frame}
          >
            <TextField
              disabled={click}
              multiline
              rows={5}
              fullWidth
              label={comment_content}
              variant="outlined"
              color="secondary"
              onChange={(e)=>{setContent(e.target.value)}}
            />
          </Grid>
          <div style={{marginTop:'15px'}}></div>
          <div className={classes.button1}>
            <Button className={classes.buttonPos} disabled={click} variant="contained"color="primary" onClick={submit}>Submit</Button>
          </div>
          </Grid>
          
          
          </Card>
          <br/>
          <div className={classes.root}>
            <CssBaseline />
            <Container disableGutters className={classes.container}>Comments</Container>   
            <Comment proj_id={projectId} comment={comment}></Comment>
                
          </div>
        </div>
      </>
    );
  }
