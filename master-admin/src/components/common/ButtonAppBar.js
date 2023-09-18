import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { AppBar, Toolbar, Drawer, IconButton, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        position: "absolute",
        zIndex: 2
    },
    title: {
        position: "absolute",
        width: "100%",
        left: 0,
        flexGrow: 1,
        textAlign: "center"
    },
}));

export default function ButtonAppBar() {
    const classes = useStyles();

    // Component가 아니기 때문에 React 에서 useState를 가져온다
    const [state, setState] = React.useState({
        isOpenDrawer: false,
        isShowAppBar: false,
        exampleList: [
            { name: "Splash", num: "01" },
            { name: "Login", num: "02" },
            { name: "Register", num: "04" },
            { name: "Main", num: "09" },
            { name: "Splash", num: "12" },
            { name: "Splash", num: "13" },
            { name: "Splash", num: "14" },
            { name: "Splash", num: "15" },
            { name: "Splash", num: "16" },
            { name: "Splash", num: "17" },
            { name: "Splash", num: "18" },
            { name: "Splash", num: "19" },
            { name: "Splash", num: "20" },
            { name: "Splash", num: "21" },
            { name: "Splash", num: "22" },
            { name: "Splash", num: "23" },
            { name: "Splash", num: "24" },
            { name: "Splash", num: "25" },
            { name: "Splash", num: "26" },
            { name: "Splash", num: "27" },
            { name: "Splash", num: "28" },
            { name: "Splash", num: "29" },
            { name: "Splash", num: "30" },
            { name: "Splash", num: "31" },
            { name: "Splash", num: "32" },
        ]
    });
    
    // Drawer On/Off 기능
    const toggleDrawer = (open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }

        setState({ ...state, "isOpenDrawer": open });
    };

    return (
        <AppBar position="fixed">
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    TIMEORDER
                </Typography>
            </Toolbar>
            <Drawer open={state.isOpenDrawer} onClose={toggleDrawer(false)}>
                { state.exampleList[0].name }
            </Drawer>
        </AppBar>
    );
}