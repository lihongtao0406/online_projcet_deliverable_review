import React, { useState, useContext, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import { StoreContext } from '../utils/store';
import MenuIcon from '@material-ui/icons/Menu';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { InfoOutlined } from '@material-ui/icons';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const useStyles = makeStyles((theme) => ({
  frame: {
    'display': 'flex',
  },
  avt: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    'margin-right': theme.spacing(1),
    // color: theme.palette.getContrastText("#f50057"),
    backgroundColor: "#f50057",
    "textDecoration": "None",
  },
}));

export default function CustomizedMenus() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  var storage = window.localStorage;
  const context = useContext(StoreContext);
  // const [UserName, setUserName] = context.UserName;
  const UserName = storage.getItem("UserName");
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const nm = !UserName ? '' : UserName.split(' ').length === 1 ?  UserName[0] :  (UserName.split(' ')[0][0] + UserName.split(' ')[1][0]);
  return (
    <div className={classes.frame}>
      <Avatar className={classes.avt} component={Link} to={`/profile/${storage.getItem("UserId")}`}>{nm}</Avatar>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="secondary"
        onClick={handleClick}
      >
        <MenuIcon></MenuIcon>
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem component={Link} to={'/dashboard'} onClick={handleClose}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </StyledMenuItem>
        <StyledMenuItem component={Link} to={'/myproject'} onClick={handleClose}>
          <ListItemIcon>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="My Documents" />
        </StyledMenuItem>
        {/* <StyledMenuItem component={Link} to={'/invitecheck'} onClick={handleClose}>
          <ListItemIcon>
            <AlternateEmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="I'm Invited" />
        </StyledMenuItem> */}
        <StyledMenuItem component={Link} to={`/profile/${storage.getItem("UserId")}`} onClick={handleClose}>
          <ListItemIcon>
            <PermIdentityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </StyledMenuItem>
        <StyledMenuItem onClick={()=>{
          window.localStorage.removeItem("UserName");
          window.localStorage.removeItem("UserId");
        }} 
        component={Link} to={'/'}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="logout" />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}
