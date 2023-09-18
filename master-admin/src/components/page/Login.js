import React from 'react';
import { HOST, API_HOST } from '../../constants';
import { useGlobalState } from '../../state';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        {new Date().getFullYear()}
        {'.'}
        </Typography>
    );
}

const loginBg = [
    "/img/bg_coffee_01.jpg",
    "/img/bg_coffee_02.jpg",
    "/img/bg_coffee_03.jpg",
    "/img/bg_coffee_04.jpg",
    "/img/bg_coffee_05.jpg",
    "/img/bg_coffee_06.jpg",
    "/img/bg_coffee_07.jpg"
]

const loginBgIndex = parseInt(Math.random() * 100) % loginBg.length;

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
    },
    image: {
        // backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundImage: 'url(' + loginBg[loginBgIndex] + ')',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
        theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(2),
        backgroundColor: "#e2422a",
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        padding: theme.spacing(1.5),
        fontSize: '14px'
    },
}));
  

function loadData(id, pwd) {
    let q = 'query { admins(where: "{ \\"email\\":\\"' + id + '\\", \\"password\\": \\"' + pwd + '\\", \\"group\\": null, \\"store\\": null}") { admins { id email name } } }'
    let adminParam = {
        email:id,
        password:pwd,
    }
    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/getLogin",
            "method": "post",
            "data": adminParam,
        })
        .then(function (response) {
            console.log(response);
            resolve(response);
        });
    });
}

const Login = () => {
    const [login, setLogin] = useGlobalState('login');
    const history = useHistory();
    const classes = useStyles();

    const [id, setId] = React.useState(null);
    const [pwd, setPwd] = React.useState(null);
    const [error, setError] = React.useState(false);

    const doSetId = (event) => {
        setId(event.target.value)
    }

    const doSetPwd = (event) => {
        setPwd(event.target.value)
    }

    const doLogin = (tmpPwd) => {
        let sha256 = require('js-sha256');
        let cryptoPwd = null;

        if (tmpPwd !== undefined) {
            cryptoPwd = sha256(tmpPwd);
        }
        else {
            cryptoPwd = sha256(pwd);
        }

        loadData(id, cryptoPwd)
        .then((response) => {
            let admin = response.data;
            if (admin !== null) {
                // if (admin.length > 0) {
                localStorage.setItem(
                    "timeOrderAdminInfo",
                    JSON.stringify(admin)
                )
                setLogin(admin);
                history.push("/Dashboard");
                console.log(localStorage.getItem("timeOrderAdminInfo"))
                // }
                // else {
                //     setError(true);
                // }
            }
            else {
                setError(true);
            }
        });
    }

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={6} md={8} lg={9} className={classes.image} />
            <Grid item xs={12} sm={6} md={4} lg={3} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        관리자 로그인
                    </Typography>
                    <div className={classes.form} noValidate>
                        <TextField variant="outlined" margin="normal" required fullWidth
                            id="email" label="관리자 아이디" name="email" autoComplete="email" autoFocus
                            onBlur={ doSetId } />
                        <TextField variant="outlined" margin="normal" required fullWidth
                            name="password" label="비밀번호" type="password" id="password" autoComplete="current-password"
                            onBlur={ doSetPwd } onKeyUp={ (event) => { if (event.keyCode === 13) { doSetPwd(event); doLogin(event.target.value) } } }/>
                        <Button fullWidth variant="contained" color="primary" className={classes.submit} onClick={ doLogin.bind(this, undefined) }>
                            로그인
                        </Button>
                        {
                            error &&
                                <Box mt={1}>
                                    <Typography align="center" color="error">
                                        아이디 또는 비밀번호가 틀립니다
                                    </Typography>
                                </Box>
                        }
                        <Box mt={5}>
                            <Copyright />
                        </Box>
                    </div>
                </div>
            </Grid>
        </Grid>
    );
};

export default Login;