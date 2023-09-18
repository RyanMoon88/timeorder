import React from 'react';
import { API_HOST } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { Box, Paper, Grid, Typography, Tabs, Tab, TextField, InputAdornment, Button, Switch, CssBaseline, Container } from '@material-ui/core';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { GridList, GridListTile, GridListTileBar } from '@material-ui/core';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pagination from "material-ui-flat-pagination";

import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';


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


function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}


// 깊은 복사
function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

const isNull = (value, base = '') => {
    if (value === null || value === undefined) {
        return base;
    }
    else {
        return value;
    }
}


function loadData(id) {
    console.log(id);
    // let q = 'query {' +
    //     ' quizzes (where: "{ \\"id\\": \\"' + id + '\\" }") { totalCount quizzes { id title contents status answer canRetry periodQuizStart periodQuizEnd endTime bigCashCount bigCashPrize prize rangeOnePrizeMin rangeOnePrizeMax createdAt } }' +
    //     // ' totalLogs:storeOwnerLogs (where: "{\\"storeOwner\\": {\\"store\\": {\\"id\\": \\"' + id + '\\"} }, \\"type_not\\":\\"STORE_LIVE\\" }" orderBy:"createdAt_DESC") { id }' +
    //     // ' storeOwnerLogs (where: "{\\"storeOwner\\": {\\"store\\": {\\"id\\": \\"' + id + '\\"} }, \\"type_not\\":\\"STORE_LIVE\\" }" orderBy:"createdAt_DESC", skip:0, first:' + logsListCount + ') { id createdAt type content version admin { id name } }' +
    // '}'

    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadQuiz",
            "method": "post",
            "params": {
                quizId: id
            }
        })
        .then(function (response) {
            resolve(response);
        });
    });
};

function loadCommentsData(id, commentsPage = 0, commentsListCount = 10) {
    let q = 'query {' +
        ' quizComments (where: "{\\"quiz\\": {\\"id\\": \\"' + id + '\\"} }" orderBy:"createdAt_DESC", skip:' + commentsPage + ', first:' + commentsListCount + ') { totalCount quizComments { id user { id name } contents } }' +
        // ' totalLogs:storeOwnerLogs (where: "{\\"storeOwner\\": {\\"store\\": {\\"id\\": \\"' + id + '\\"} }, \\"type_not\\":\\"STORE_LIVE\\" }" orderBy:"createdAt_DESC") { id }' +
        // ' storeOwnerLogs (where: "{\\"storeOwner\\": {\\"store\\": {\\"id\\": \\"' + id + '\\"} }, \\"type_not\\":\\"STORE_LIVE\\" }" orderBy:"createdAt_DESC", skip:0, first:' + logsListCount + ') { id createdAt type content version admin { id name } }' +
    '}'

    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadQuizComments",
            "method": "post",
            "params": {
                quizId: id,
                page:commentsPage,
                pageSize:commentsListCount,
            }
        })
        .then(function (response) {
            resolve(response);
        });
    });
};

function loadLogsData(id, logsPage = 0, logsListCount = 10) {
    let q = 'query {' +
        ' quizPrizeLogs (where: "{\\"quiz\\": {\\"id\\": \\"' + id + '\\"} }" orderBy:"createdAt_DESC", skip:' + logsPage + ', first:' + logsListCount + ') { totalCount quizPrizeLogs { id user { id name } contents prize createdAt } }' +
        // ' totalLogs:storeOwnerLogs (where: "{\\"storeOwner\\": {\\"store\\": {\\"id\\": \\"' + id + '\\"} }, \\"type_not\\":\\"STORE_LIVE\\" }" orderBy:"createdAt_DESC") { id }' +
        // ' storeOwnerLogs (where: "{\\"storeOwner\\": {\\"store\\": {\\"id\\": \\"' + id + '\\"} }, \\"type_not\\":\\"STORE_LIVE\\" }" orderBy:"createdAt_DESC", skip:0, first:' + logsListCount + ') { id createdAt type content version admin { id name } }' +
    '}'

    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadQuizPrizeLog",
            "method": "post",
            "params": {
                quizId:id,
                page:logsPage,
                pageSize:logsListCount,
            }
        })
        .then(function (response) {    
            resolve(response);
        });
    });
};


function loadReviewsData(id, reviewPage = 0, reviewListCount = 10) {
    let q = 'query {' +
        ' quizReviews (where: "{\\"quiz\\": {\\"id\\": \\"' + id + '\\"} }" orderBy:"createdAt_DESC", skip:' + reviewPage + ', first:' + reviewListCount + ') { totalCount quizReviews { id user { id name } title contents } }' +
        // ' totalLogs:storeOwnerLogs (where: "{\\"storeOwner\\": {\\"store\\": {\\"id\\": \\"' + id + '\\"} }, \\"type_not\\":\\"STORE_LIVE\\" }" orderBy:"createdAt_DESC") { id }' +
        // ' storeOwnerLogs (where: "{\\"storeOwner\\": {\\"store\\": {\\"id\\": \\"' + id + '\\"} }, \\"type_not\\":\\"STORE_LIVE\\" }" orderBy:"createdAt_DESC", skip:0, first:' + logsListCount + ') { id createdAt type content version admin { id name } }' +
    '}'

    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadQuizReview",
            "method": "post",
            "params": {
                quizId:id,
                page:reviewPage,
                pageSize:reviewListCount,
            }
        })
        .then(function (response) {    
            resolve(response);
        });
    });
};


const Quiz = ({ match }) => {
    const [login, setLogin] = useGlobalState('login');
    const [backdrop, setBackdrop] = useGlobalState('backdrop');
    const classes = useStyles();
    const theme = useTheme();

    const [success, setSuccess] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackDuration, setSnackDuration] = React.useState(2000);

    const [originQuiz, setOriginQuiz] = React.useState(null);
    const [quiz, setQuiz] = React.useState(null);
    
    // 로그 변수 시작    
    const [tabValue, setTabValue] = React.useState(0);

    const [quizComments, setQuizComments] = React.useState([]);
    const [quizCommentsTotalCount, setQuizCommentsTotalCount] = React.useState(0);
    
    const [commentsPage, setCommentsPage] = React.useState(0);
    const [commentsListCount, setCommentsListCount] = React.useState(15);
    const [commentsPageCount, setCommentsPageCount] = React.useState(10);
    const [commentsTotalPage, setCommentsTotalPage] = React.useState(10);
    
    
    const [quizPrizeLogs, setQuizPrizeLogs] = React.useState([]);
    const [quizPrizeLogsTotalCount, setQuizPrizeLogsTotalCount] = React.useState(0);
    
    const [logsPage, setLogsPage] = React.useState(0);
    const [logsListCount, setLogsListCount] = React.useState(15);
    const [logsPageCount, setLogsPageCount] = React.useState(10);
    const [logsTotalPage, setLogsTotalPage] = React.useState(10);
    
    
    const [quizReviews, setQuizReviews] = React.useState([]);
    const [quizReviewsTotalCount, setQuizReviewsTotalCount] = React.useState(0);
    
    const [reviewsPage, setReviewsPage] = React.useState(0);
    const [reviewsListCount, setReviewsListCount] = React.useState(15);
    const [reviewsPageCount, setReviewsPageCount] = React.useState(10);
    const [reviewsTotalPage, setReviewsTotalPage] = React.useState(10);
    
    // 로그 변수 끝

    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        setBackdrop(true);
        loadData(match.params.id)
        .then((response) => {
            setData(response);
            loadCommentsData(match.params.id)
            .then((response) => {
                setCommentsData(response);
                loadLogsData(match.params.id)
                .then((response) => {
                    setLogsData(response);
                    loadReviewsData(match.params.id)
                    .then((response) => {
                        setReviewsData(response);
                        setBackdrop(false);
                    })  
                })  
            })
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    
    function setData(response) {
        console.log("quiz response", response);
        let data = response.data;
        let quiz = data;

        console.log(quiz);

        setQuiz(quiz);
    }

    
    function setCommentsData(response) {
        console.log("comments response", response);
        let data = response.data;
        let quizComments = data.content;
        let totalCount = data.totalElements;
        
        let totalPage = parseInt(totalCount / commentsListCount) + 1;

        for (let i=0; i<quizComments.length; i++) {
            let row = totalCount - (commentsPage * commentsListCount) - i;
            quizComments[i].no = row;
        }
    
        setQuizComments(quizComments);
        setQuizCommentsTotalCount(totalCount);
        setCommentsTotalPage(totalPage)
    }


    function setLogsData(response) {
        console.log("logs response", response);
        let data = response.data;
        let quizPrizeLogs = data.content;
        let totalCount = data.totalElements;
        
        let totalPage = parseInt(totalCount / logsListCount) + 1;

        for (let i=0; i<quizPrizeLogs.length; i++) {
            let row = totalCount - (logsPage * logsListCount) - i;
            quizPrizeLogs[i].no = row;
        }
    
        setQuizPrizeLogs(quizPrizeLogs);
        setQuizPrizeLogsTotalCount(totalCount)
        setLogsTotalPage(totalPage)
    }


    function setReviewsData(response) {
        console.log("reviews response", response);
        let data = response.data;
        let quizReviews = data.content;
        let totalCount = data.totalElements;

        let totalPage = parseInt(totalCount / reviewsListCount) + 1;

        for (let i=0; i<quizReviews.length; i++) {
            let row = totalCount - (reviewsPage * reviewsListCount) - i;
            quizReviews[i].no = row;
        }
    
        setQuizReviews(quizReviews);
        setQuizReviewsTotalCount(totalCount)
        setReviewsTotalPage(totalPage)
    }


    const changeTabs = (event, value) => {
        setTabValue(value);
    }


    const changeQuizValue = (prop) => (event) => {
        setQuiz({ ...quiz, [prop]: event.target.value });
    };


    function doSaveData() {
        // let changeText = ' 변경값 { id:' + quiz.id + ', title:' + quiz.title + ', answer:' + quiz.answer + ', bigCashCount:' + quiz.bigCashCount + ', prize:' + quiz.prize +
        //                 ', rangeOnePrizeMin:' + quiz.rangeOnePrizeMin + ', rangeOnePrizeMax:' + quiz.rangeOnePrizeMax + ', periodQuizStart:' + quiz.periodQuizStart + ', periodQuizEnd:' + quiz.periodQuizEnd + ', contents:' + quiz.contents + ' }';

        // let q = 'mutation { ' + 
        //     // ' insertAdminLog(type:"QZO1" adminId: "<?=$admin?>" ip:"" content:"[퀴즈 수정] ' + quiz.name + ' ' + changeText + '") { id } ' +
        //     ' updateQuiz (' +
        //         ' id: "' + quiz.id + '" ' +
        //         ' title: "' + quiz.title + '" ' +
        //         ' answer: "' + quiz.answer + '" ' +
        //         ' canRetry: ' + quiz.canRetry + ' ' +
        //         ' bigCashCount: ' + quiz.bigCashCount + ' ' +
        //         ' bigCashPrize: ' + quiz.bigCashPrize + ' ' +
        //         ' prize: ' + quiz.prize + ' ' +
        //         ' rangeOnePrizeMin: ' + quiz.rangeOnePrizeMin + ' ' +
        //         ' rangeOnePrizeMax: ' + quiz.rangeOnePrizeMax + ' ' +
        //         ' periodQuizStart: "' + quiz.periodQuizStart + '" ' +
        //         ' periodQuizEnd: "' + quiz.periodQuizEnd + '" ' +
        //         ' contents: "' + quiz.contents + '" ' +
        //     ') {' +
        //         'id ' +
        //     '}' + 
        // '}';
        let quizParam = {
            id: quiz.id,
            title: quiz.title,
            answer: quiz.answer,
            canRetry: quiz.canRetry,
            bigCashCount: quiz.bigCashCount,
            bigCashPrize: quiz.bigCashPrize,
            prize: quiz.prize,
            rangeOnePrizeMin: quiz.rangeOnePrizeMin,
            rangeOnePrizeMax: quiz.rangeOnePrizeMax,
            periodQuizStart: quiz.periodQuizStart,
            periodQuizEnd: quiz.periodQuizEnd,
            contents: quiz.contents,
            status: quiz.status,
            endTime: quiz.endTime,
            isBigCashDid: quiz.isBigCashDid,
            startScheduler: quiz.startScheduler,
            endScheduler: quiz.Scheduler
        };
        
        axios({
            "url": API_HOST + "/master/updateQuiz",
            "method": "post",
            "data": quizParam,
        })
        .then(function (response) {
            console.log(response);
            // window.location.reload();
            setSnackMessage("저장 성공");
            openSnackbar();
        })
        .catch(function(error) {
            console.log(error);
        });
    }


    const changeQuizDiscountStartValue = (value) => {
        let date = value.format("YYYYMMDD") + "000000";
        let periodQuizStart = date;
        setQuiz({ ...quiz, periodQuizStart });
    };
    const changeQuizDiscountEndValue = (value) => {
        let date = value.add(1, 'day').format("YYYYMMDD") + "000000";
        let periodQuizEnd = date;
        setQuiz({ ...quiz, periodQuizEnd });
    };


    function clickCommentsPagination(offset) {
        console.log("pagination", offset);
        setCommentsPage(offset);

        setBackdrop(true);
        loadCommentsData(match.params.id, offset)
        .then((response) => {
            setCommentsData(response);
            setBackdrop(false);
        });
    }
    
    function clickLogsPagination(offset) {
        console.log("pagination", offset);
        setLogsPage(offset);

        setBackdrop(true);
        loadLogsData(match.params.id, offset)
        .then((response) => {
            setLogsData(response);
            setBackdrop(false);
        });
    }
    
    function clickReviewsPagination(offset) {
        console.log("pagination", offset);
        setReviewsPage(offset);

        setBackdrop(true);
        loadReviewsData(match.params.id, offset)
        .then((response) => {
            setReviewsData(response);
            setBackdrop(false);
        });
    }
    
    const openSnackbar = () => {
        setSuccess(true);
    }    
    const closeSnackbar = () => {
        setSuccess(false);
    }

    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap>
                    Quiz
                </Typography>
                
                <div className={classes.divRow}>
                    <Grid container spacing={4}>
                        <Grid item xs={4}>
                            <Paper square className={classes.paper}>
                                <Typography variant="h5" noWrap className={classes.divRow}>
                                    퀴즈 정보
                                </Typography>

                                { quiz !== null &&
                                    <div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <TextField className={ classes.width100 } label="퀴즈 이름" variant="outlined" defaultValue={ isNull(quiz.title) }
                                                        onBlur={changeQuizValue('title')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={3}>
                                                    {
                                                        quiz.status !== "0" &&
                                                            <FormControl variant="outlined" className={classes.width100}>
                                                                <InputLabel
                                                                    id="store-type">공개 여부</InputLabel>
                                                                <Select
                                                                    labelId="store-type"
                                                                    defaultValue={isNull(quiz.status)}
                                                                    onBlur={changeQuizValue('canRetry')}
                                                                    labelWidth={75}
                                                                >
                                                                    <MenuItem value="-1">미공개</MenuItem>
                                                                    <MenuItem value="1">공개</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                    }
                                                    {
                                                        quiz.status === "0" &&
                                                            <TextField className={ classes.width100 } label="공개 여부" variant="outlined" value="완료" disabled/>
                                                    }
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControl variant="outlined" className={classes.width100}>
                                                        <InputLabel
                                                            id="store-type">재시도 가능</InputLabel>
                                                        <Select
                                                            labelId="store-type"
                                                            defaultValue={isNull(quiz.canRetry)}
                                                            onBlur={changeQuizValue('canRetry')}
                                                            labelWidth={75}
                                                        >
                                                            <MenuItem value="false">불가능</MenuItem>
                                                            <MenuItem value="true">가능</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={4}>
                                                    <TextField className={ classes.width100 } label="정답" variant="outlined" defaultValue={ isNull(quiz.answer) }
                                                        onBlur={changeQuizValue('answer')}/>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField className={ classes.width100 } label="빅캐시 인원" variant="outlined" defaultValue={ isNull(quiz.bigCashCount) }
                                                        onBlur={changeQuizValue('bigCashCount')}/>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField className={ classes.width100 } label="빅캐시 금액" variant="outlined" defaultValue={ isNull(quiz.bigCashPrize) }
                                                        onBlur={changeQuizValue('bigCashPrize')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={4}>
                                                    <TextField className={ classes.width100 } label="총 상금 (T-Cash)" variant="outlined" defaultValue={ isNull(quiz.prize) }
                                                        onBlur={changeQuizValue('prize')}/>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField className={ classes.width100 } label="최소상금" variant="outlined" defaultValue={ isNull(quiz.rangeOnePrizeMin) }
                                                        onBlur={changeQuizValue('rangeOnePrizeMin')}/>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField className={ classes.width100 } label="최대상금" variant="outlined" defaultValue={ isNull(quiz.rangeOnePrizeMax) }
                                                        onBlur={changeQuizValue('rangeOnePrizeMax')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <KeyboardDatePicker
                                                            margin="normal"
                                                            id="start-date-picker-dialog"
                                                            label="퀴즈 시작일"
                                                            format="YYYY-MM-DD"
                                                            value={moment(quiz.periodQuizStart === '' ? '20150101000000' : quiz.periodQuizStart, "YYYYMMDDHHmmss")}
                                                            onChange={changeQuizDiscountStartValue}
                                                            inputVariant="outlined"
                                                            className={classes.width100}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <KeyboardDatePicker
                                                            margin="normal"
                                                            id="end-date-picker-dialog"
                                                            label="퀴즈 종료일"
                                                            format="YYYY-MM-DD"
                                                            value={moment(quiz.periodQuizEnd === '' ? '20150102000000' : quiz.periodQuizEnd, "YYYYMMDDHHmmss").add(-1, 'day')}
                                                            onChange={changeQuizDiscountEndValue}
                                                            inputVariant="outlined"
                                                            className={classes.width100}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </MuiPickersUtilsProvider>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <TextField multiline className={ classes.width100 } label="퀴즈 설명" rows="10" variant="outlined" defaultValue={ isNull(quiz.contents) }
                                                        onBlur={changeQuizValue('contents')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div>
                                            <Grid container spacing={1}>
                                                <Grid item align="right" xs={12}>
                                                    <Button className={ classes.button } variant="contained" color="primary" onClick={ doSaveData }>저장</Button>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </div>
                                }

                                { quiz === null &&
                                    <div>불러오는 중입니다.</div>
                                }

                            </Paper>
                        </Grid>
                        <Grid item xs={8}>
                            <Paper square className={classes.divRow}>
                                <Tabs
                                    value={tabValue}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={ changeTabs }
                                    >
                                    <Tab label="댓글 내역"/>
                                    <Tab label="상금 내역"/>
                                    <Tab label="리뷰"/>
                                </Tabs>
                            </Paper>
                            { (quizComments !== null && tabValue === 0) &&
                                <Paper className={classes.root}>
                                    <Table className={classes.table} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center" style={{ width:'130px' }}>no</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'200px' }}>사용자</StyledTableCell>
                                                <StyledTableCell align="center">댓글 내용</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'200px' }}>등록일</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                quizComments.map(row => (
                                                    <StyledTableRow key={ row.id }>
                                                        <StyledTableCell align="center">{ row.no }</StyledTableCell>
                                                        <StyledTableCell><Link to={ '/User/' + row.user.id }>{ row.user.name }</Link></StyledTableCell>
                                                        <StyledTableCell>{ row.contents }</StyledTableCell>
                                                        <StyledTableCell align="center">{ moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss") }</StyledTableCell>
                                                    </StyledTableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                    <CssBaseline />
                                    <Container align="center" className={classes.paginationRow}>
                                        <Pagination
                                            limit={1}
                                            offset={commentsPage}      // Row Number Skip offset
                                            total={commentsTotalPage}
                                            onClick={(e, offset) => clickCommentsPagination(offset)}
                                            size="large"
                                        />
                                    </Container>
                                </Paper>
                            }
                            { (quizPrizeLogs !== null && tabValue === 1) &&
                                <Paper className={classes.root}>
                                    <Table className={classes.table} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center" style={{ width:'130px' }}>no</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'200px' }}>사용자</StyledTableCell>
                                                <StyledTableCell align="center">댓글 내용</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'200px' }}>등록일</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                quizPrizeLogs.map(row => (
                                                    <StyledTableRow key={ row.id }>
                                                        <StyledTableCell align="center">{ row.no }</StyledTableCell>
                                                        <StyledTableCell><Link to={ '/User/' + row.user.id }>{ row.user.name }</Link></StyledTableCell>
                                                        <StyledTableCell>{ row.contents }</StyledTableCell>
                                                        <StyledTableCell align="center">{ moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss") }</StyledTableCell>
                                                    </StyledTableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                    <CssBaseline />
                                    <Container align="center" className={classes.paginationRow}>
                                        <Pagination
                                            limit={1}
                                            offset={logsPage}      // Row Number Skip offset
                                            total={logsTotalPage}
                                            onClick={(e, offset) => clickLogsPagination(offset)}
                                            size="large"
                                        />
                                    </Container>
                                </Paper>
                            }
                            { (quizReviews !== null && tabValue === 2) &&
                                <Paper className={classes.root}>
                                    <Table className={classes.table} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center" style={{ width:'130px' }}>no</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'200px' }}>사용자</StyledTableCell>
                                                <StyledTableCell align="center">댓글 내용</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'200px' }}>등록일</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                quizReviews.map(row => (
                                                    <StyledTableRow key={ row.id }>
                                                        <StyledTableCell align="center">{ row.no }</StyledTableCell>
                                                        <StyledTableCell><Link to={ '/User/' + row.user.id }>{ row.user.name }</Link></StyledTableCell>
                                                        <StyledTableCell>{ row.contents }</StyledTableCell>
                                                        <StyledTableCell align="center">{ moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss") }</StyledTableCell>
                                                    </StyledTableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                    <CssBaseline />
                                    <Container align="center" className={classes.paginationRow}>
                                        <Pagination
                                            limit={1}
                                            offset={reviewsPage}      // Row Number Skip offset
                                            total={reviewsTotalPage}
                                            onClick={(e, offset) => clickReviewsPagination(offset)}
                                            size="large"
                                        />
                                    </Container>
                                </Paper>
                            }
                        </Grid>
                    </Grid>
                </div>


                <Snackbar
                    open={success}
                    onClose={closeSnackbar}
                    autoHideDuration={3000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    message={<span id="message-id">{snackMessage}</span>}
                    TransitionComponent={TransitionLeft}
                    action={[
                        <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        onClick={closeSnackbar}
                        >
                        <CloseIcon />
                        </IconButton>,
                    ]}
                />
            </Box>
    );
};

export default Quiz;