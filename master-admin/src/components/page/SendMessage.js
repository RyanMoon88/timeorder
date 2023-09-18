import React from 'react';
import { API_SERVER_URL } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { Box, Paper, Grid, Typography, TextField } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone'

const useStyles = makeStyles(theme => ({
    divRow: {
        marginBottom: theme.spacing(2)
    },
    paginationRow: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(6)
    },

    paper: {
        padding: theme.spacing(2),
    },

    chart: {
        padding: theme.spacing(4),
    },
    avatar: {
        width: 48,
        height: 48,
        background: '#454545'
    },
    
    table: {
        minWidth: 700,
    },
    
    button: {
        padding: '10px 0px',
    },

    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        zIndex: 999
    },

    width100: {
        width: '100%'
    },

    width75: {
        width: '75%'
    },

    width50: {
        width: '50%'
    },

    root: {
        width: '100%',
        overflowX: 'auto',
    },

    relative: {
        position: 'relative'
    },

    hidden: {
        display: 'none'
    },

    iosSwitch: {
        position: 'absolute',
        top: 0,
        right: 0
    },

    chip: {
        marginTop: '6px',
        marginRight: '6px'
    },

    selectedImages: {
        border: "4px solid #e2422a"
    }
}));

const SendMessage = () => {
    const [login, setLogin] = useGlobalState('login');
    const [productTabValue, setProductTabValue] = React.useState(0);
    const classes = useStyles();
    const theme = useTheme();



    // 탭 이벤트 시작
    const changeProductTabs = (event, value) => {
        setProductTabValue(value);
    }
    // 탭 이벤트 끝



    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h5" noWrap className={classes.divRow}>
                    메세지 보내기
                </Typography>
                
                <div className={classes.divRow}>
                    <Grid container spacing={4}>
                        <Grid item xs={4}>
                            <Paper square>
                                메세지 보내고자 하는 명단 xlsx 파일을 넣어주세요
                            </Paper>
                            <Paper>
                                <DropzoneArea />
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper>
                                { /* 메세지 */ }
                                <Box>
                                    <TextField
                                        label="푸시 제목"
                                        variant="outlined"
                                    />
                                </Box>
                                <Box>
                                    <TextField
                                        label="푸시 내용"
                                        multiline
                                        rows={2}
                                        variant="outlined"
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </Box>
    );
};

export default SendMessage;