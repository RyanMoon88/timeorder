import React from 'react';
import { API_HOST, API_CAL_URL } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import { Box, Typography, Grid, Paper, Divider, Container, Select, MenuItem, Button } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import Pagination from "material-ui-flat-pagination";


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

    input: {
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(2)
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

    root: {
        width: '100%',
        overflowX: 'auto',
    },
}));


function loadData(listRow = 0, listCount = 24, ) {
    let search = "";
    // let q = 'query {' +
    //     ' heres (where:"{\\"OR\\": [{\\"title_contains\\":\\"' + search + '\\"}, {\\"contents_contains\\":\\"' + search + '\\"}]}" orderBy: "createdAt_DESC", skip:' + listRow + ', first:' + listCount + ') { totalCount heres { id title contents status createdAt user { id name } } }' +
    // '}'

    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadAllHereList",
            "method": "post",
            "params":{
                page:listRow,
                pageSize:listCount,
            }
        })
        .then(function (response) {
            console.log("123213213213");
            console.log(response);
            resolve(response);
        });
    });
};


const Here = () => {
    const [login, setLogin] = useGlobalState('login');
    const [backdrop, setBackdrop] = useGlobalState('backdrop');

    const classes = useStyles();
    
    const [heres, setHeres] = React.useState([]);
    const [totalHere, setTotalHere] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [listCount, setListCount] = React.useState(24);
    const [pageCount, setPageCount] = React.useState(10);
    const [totalPage, setTotalPage] = React.useState(10);

    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        setBackdrop(true);
        loadData()
        .then((response) => {
            setData(response);
            setBackdrop(false);
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    function setData(response) {
        console.log("here response", response);
        let data = response.data.content;
        let heres = data;
        let totalCount = response.data.totalElements;

        setHeres(heres);
        
        let totalPgaePlus = (totalCount % listCount) > 0 ? 1 : 0;
        let totalPage = parseInt(totalCount / listCount) + totalPgaePlus;
        setTotalPage(totalPage);
    }

    function clickPagination(offset) {
        setPage(offset);
        
        loadData(offset , listCount)
        .then((response) => {
            setData(response);
        });
    }

    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap>
                    여기도요
                </Typography>
                <div className={classes.divRow}>
                    <Grid container>
                        {
                            heres.map(row => (
                                <Grid item xs={2} className={classes.paper}>
                                    <Paper>
                                        <Typography variant="subtitle1" noWrap className={classes.paper}>
                                            { row.user.name }
                                        </Typography>
                                        <Divider/>
                                        <div className={classes.paper}>
                                            <Typography variant="subtitle1" noWrap>
                                                { row.title }
                                            </Typography>
                                            <Typography variant="body2" style={{ whiteSpace: 'pre-line'}}>
                                                { row.contents }
                                            </Typography>
                                        </div>
                                    </Paper>
                                </Grid>
                            ))
                        }
                    </Grid>
                </div>
                <div>
                    <CssBaseline />
                    <Container align="center" className={classes.paginationRow}>
                        <Pagination
                            limit={1}
                            offset={page}      // Row Number Skip offset
                            total={totalPage}
                            onClick={(e, offset) => clickPagination(offset)}
                            size="large"
                        />
                    </Container>
                </div>
            </Box>
    );
};

export default Here;