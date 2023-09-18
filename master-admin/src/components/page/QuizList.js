import React from 'react';
import {API_HOST } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import { Box, Typography, Button, Grid, Container } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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


const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 12,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);



function loadData(status, listRow = 10, listCount = 10) {
    let q = 'query { quizzes (where:"{\\"OR\\":[{\\"status_contains\\":\\"' + status + '\\"}, {\\"status\\":null}]}"orderBy: "createdAt_DESC", skip:' + listRow + ', first:' + listCount + ') { totalCount quizzes { id title contents status answer periodQuizStart periodQuizEnd endTime bigCashCount prize rangeOnePrizeMin rangeOnePrizeMax createdAt comments { id user { id } } prizeLogs { id prize } } } }'


    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadQuizList",
            "method": "post",
            "params": {
                status:status,
                page:listRow,
                pageSize:listCount,
            }
        })
        .then(function (response) {
            resolve(response);
        });
    });
};


function setStatus(row) {
    if (row.status == "1") {
        var start = moment(row.periodQuizStart, "YYYYMMDDHHmmss");
        var end = moment(row.periodQuizEnd, "YYYYMMDDHHmmss");
        var now = moment();
        if (now.diff(end) > 0) {
            return "종료";
        }
        else {
            if (now.diff(start) < 0) {
                return "대기중";
            }
            else {
                return "진행중";
            }
        }
    }
    else if (row.status === "-1") {
        return "미공개";
    }
    else {
        return "종료";
    }
}


function isStarted(row) {
    if (row.status == "1") {
        var start = moment(row.periodQuizStart, "YYYYMMDDHHmmss");
        var end = moment(row.periodQuizEnd, "YYYYMMDDHHmmss");
        var now = moment();
        if (now.diff(end) <= 0) {
            if (now.diff(start) <= 0) {
                return false;
            }
        }
    }
    return true
}


function getUsedPrize(row) {
    let usedPrize = 0;
    let prizeLogs = row.quizPrizeLogList;
    
    for (var j=0; j<prizeLogs.length; j++) {
        usedPrize += prizeLogs[j].prize
    }

    return usedPrize;
}


function getJoinUserListLength(row) {
    let comments = row.quizCommentList;

    let joinUserList = comments
        .map(a => a.userId)
        .map((a, i, arr) => arr.indexOf(a) === i && i)
        .filter(a => comments[a])
        .map(a => comments[a]);
        
    return joinUserList.length;
}


function getEndTime(row) {
    return moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss")
}


const QuizList = () => {
    const history = useHistory();

    const [login, setLogin] = useGlobalState('login');
    const classes = useStyles();

    const [tabValue, setTabValue] = React.useState(0);

    const [quizzes, setQuizzes] = React.useState([]);
    const [totalQuizzes, setTotalQuizzes] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [listCount, setListCount] = React.useState(15);
    const [pageCount, setPageCount] = React.useState(10);
    const [totalPage, setTotalPage] = React.useState(10);

    
    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        loadData("", page * listCount, listCount)
        .then((response) => {
            setData(response);
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    function setData(response) {
        console.log("QuizList response", response);
        let data = response.data;
    
        let quizzes = data.content;
        let quizzesLength = quizzes.length;
        let totalCount = data.totalElements;

        for (let i=0; i<quizzesLength; i++) {
            let row = totalCount - (page * listCount) - i;
            quizzes[i].no = row;
        }
    
        setQuizzes(quizzes);
        setTotalQuizzes(totalCount);

        let totalPgaePlus = (totalCount % listCount) > 0 ? 1 : 0;
        let totalPage = parseInt(totalCount / listCount) + totalPgaePlus;
        setTotalPage(totalPage);
    }

    function clickPagination(offset) {
        console.log("pagination", offset);
        setPage(offset);
        
        loadData(offset , listCount)
        .then((response) => {
            setData(response);
        });
    }
    
    
    function addQuiz() {
        let q = 'mutation { ' + 
            // ' insertAdminLog(type:"STO1" adminId: "cjv6z5pjs0aay0734ge2kfk00" ip:"" content:"[가맹점 추가]") { id } ' +
            ' insertQuiz (' +
                ' title: "제목없음" ' +
                ' status: "0" ' +
                ' answer: "" ' +
                ' canRetry: false' +
                ' bigCashCount: 0 ' +
                ' bigCashPrize: 0 ' +
                ' prize: 0 ' +
                ' rangeOnePrizeMin: 0 ' +
                ' rangeOnePrizeMax:0 ' +
                ' periodQuizStart: "20200101000000" ' +
                ' periodQuizEnd: "20200102000000" ' +
                ' contents: "" ' +
            ') {' +
                'id ' +
            '}' + 
        '}';

        let quizParam = {
            id:"",
            title:"제목없음",
            status:"0",
            answer:"",
            canretry:false,
            bigCashCount:0,
            bigCashPrize:0,
            prize:0,
            rangeOnePrizeMin: 0 ,
            rangeOnePrizeMax:0 ,
            periodQuizStart: "20200101000000" ,
            periodQuizEnd: "20200102000000" ,
            contents: "" , 
        }
        
        return new Promise((resolve, reject) => {
            axios({
                "url": API_HOST + "/master/updateQuiz",
                "method": "post",
                "data": quizParam,
            })
            .then(function (response) {
                console.log(response);
                try {
                    let id = response.data.data.insertStore.id;
                    history.push("/Quiz/" + id);
                    resolve();
                }
                catch (e) {
                    console.log(e);
                    window.location.reload();
                }
            });
        });
    }

    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap style={{ marginBottom: '16px'}}>
                    타임퀴즈 리스트
                </Typography>

                <div>
                    <Paper className={classes.root}>
                        <Grid container className={classes.paper}>
                            <Grid item xs={8}>
                                <Typography variant="h6" noWrap className={classes.divRow}>
                                    전체 퀴즈 { totalQuizzes }
                                </Typography>
                            </Grid>
                            <Grid item xs={4} style={{ textAlign:'right' }}>
                                <Button variant="contained" color="primary" onClick={ addQuiz }>
                                    퀴즈 추가
                                </Button>
                            </Grid>
                        </Grid>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">no</StyledTableCell>
                                    <StyledTableCell align="center">상태</StyledTableCell>
                                    <StyledTableCell align="center">퀴즈 제목</StyledTableCell>
                                    <StyledTableCell align="center">총 상금</StyledTableCell>
                                    <StyledTableCell align="center">잔여 상금</StyledTableCell>
                                    <StyledTableCell align="center">참여 횟수 (참여 인원)</StyledTableCell>
                                    <StyledTableCell align="center">시작 시간</StyledTableCell>
                                    <StyledTableCell align="center">종료 시간</StyledTableCell>
                                    <StyledTableCell align="center">실제 종료 시간</StyledTableCell>
                                    <StyledTableCell align="center">삭제</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    quizzes.map(row => (
                                        <StyledTableRow key={ row.id }>
                                            <StyledTableCell component="th" scope="row">{ row.no }</StyledTableCell>
                                            <StyledTableCell>{ setStatus(row) }</StyledTableCell>
                                            <StyledTableCell><Link to={ "/Quiz/" + row.id }>{ row.title }</Link></StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(row.prize).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(row.prize - getUsedPrize(row)).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(row.quizCommentList.length).format('0,0') }건 ({ numeral(getJoinUserListLength(row)).format('0,0') }명)</StyledTableCell>
                                            <StyledTableCell align="center">{ row.periodQuizStart === "" ? "" : moment(row.periodQuizStart, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss") }</StyledTableCell>
                                            <StyledTableCell align="center">{ row.periodQuizEnd === "" ? "" : moment(row.periodQuizEnd, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss") } </StyledTableCell>
                                            <StyledTableCell align="center">{ getEndTime(row) }</StyledTableCell>
                                            <StyledTableCell align="center">{ isStarted ? "" : "삭제하기" }</StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </Paper>
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

export default QuizList;