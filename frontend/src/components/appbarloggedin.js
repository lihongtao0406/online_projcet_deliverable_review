import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import CustomizedMenus from './menu';



const useStyles = makeStyles((theme) => ({

    icon: {
      marginRight: theme.spacing(2),
    },

    appbarTitle: {
      flexGrow: 1,
    },
}));
  


export default function AppBarLoggedIn() {
  const classes = useStyles();
    return(
    <AppBar position="relative">
    <Toolbar>
      <FindInPageIcon className={classes.icon} />
      <Typography className={classes.appbarTitle} variant="h6" color="inherit" noWrap>
        PReviewing
      </Typography>
      <nav>
        <CustomizedMenus></CustomizedMenus>
      </nav>
    </Toolbar>
  </AppBar>
    )
}