import React from 'react';
import { API_HOST, API_CAL_URL } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, InputBase, Tabs, Tab, Container, Select, MenuItem, Button } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CssBaseline from "@material-ui/core/CssBaseline";
import Pagination from "material-ui-flat-pagination";

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

    tableTopInfo: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
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



const BootstrapInput = withStyles(theme => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);


const tableColumn = ["oid", "user.name", "user.email", "user.phone", "type", "payMethod", "price", "tcash", "createdAt"];
const tableColumnName = ["주문번호", "사용자이름", "이메일", "전화번호", "상태", "결제방법", "결제금액", "TCASH", "결제일"];


function loadData(search = "", status = "", listRow = 10, listCount = 10, start, end) {
    if (start === undefined) {
        start = new Date();
    }
    if (end === undefined) {
        end = new Date();
    }
    
    var momentStartDate = moment(start);
    var momentEndDate = moment(end).add(1, 'd');

    momentStartDate.hours(0);
    momentStartDate.minutes(0);
    momentStartDate.seconds(0);
    momentStartDate.milliseconds(0);

    momentEndDate.hours(0);
    momentEndDate.minutes(0);
    momentEndDate.seconds(0);
    momentEndDate.milliseconds(0);

    // let q = "";
    let type = "";
    switch (status) {
        case "00":      // 충전
            // q = 'query {' +
            //     ' tcashes (where: "{\\"OR\\": [{\\"AND\\": [{\\"type\\": \\"TC00\\"}, {\\"payMethod\\": \\"CARD\\"}] }], \\"user\\": {\\"name_contains\\":\\"' + search + '\\"}, \\"createdAt_gte\\":\\"' + momentStartDate.utc().format() + '\\", \\"createdAt_lt\\":\\"' + momentEndDate.utc().format() + '\\"}" orderBy:"createdAt_DESC", skip:' + listRow + ', first:' + listCount + ') { totalCount tcashes { id oid createdAt user { id name orders { id } } type payMethod memo price tcash totalCount order { store { name } items { product { name } } } } } }';
            type = "charge";
            break;
        case "01":      // 사용
            // q = 'query {' +
            //     ' tcashes (where: "{\\"OR\\": [{\\"AND\\": [{\\"type\\":\\"TC01\\"}]}], \\"user\\": {\\"name_contains\\":\\"' + search + '\\"}, \\"createdAt_gte\\":\\"' + momentStartDate.utc().format() + '\\", \\"createdAt_lt\\":\\"' + momentEndDate.utc().format() + '\\"}" orderBy:"createdAt_DESC", skip:' + listRow + ', first:' + listCount + ') { totalCount tcashes { id oid createdAt user { id name } type payMethod memo price tcash totalCount order { store { name } items { product { name } } } } } }';
            type = "use";
            break;
        case "02":      // 거절
            // q = 'query {' +
            //     ' tcashes (where: "{\\"OR\\": [{\\"AND\\": [{\\"type\\":\\"TC00\\"}, {\\"payMethod\\": \\"REFUND\\"}]}], \\"user\\": {\\"name_contains\\":\\"' + search + '\\"}, \\"createdAt_gte\\":\\"' + momentStartDate.utc().format() + '\\", \\"createdAt_lt\\":\\"' + momentEndDate.utc().format() + '\\"}" orderBy:"createdAt_DESC", skip:' + listRow + ', first:' + listCount + ') { totalCount tcashes { id oid createdAt user { id name } type payMethod memo price tcash totalCount order { store { name } items { product { name } } } } } }';
            type = "reject";
            break;
        case "03":      // 차감
            // q = 'query {' +
            //     ' tcashes (where: "{\\"OR\\": [{\\"AND\\": [{\\"type\\":\\"TC00\\"}, {\\"payMethod\\": \\"CHARGE\\"}, {\\"tcash_lt\\": 0}]}], \\"user\\": {\\"name_contains\\":\\"' + search + '\\"}, \\"createdAt_gte\\":\\"' + momentStartDate.utc().format() + '\\", \\"createdAt_lt\\":\\"' + momentEndDate.utc().format() + '\\"}" orderBy:"createdAt_DESC", skip:' + listRow + ', first:' + listCount + ') { totalCount tcashes { id oid createdAt user { id name } type payMethod memo price tcash totalCount order { store { name } items { product { name } } } } } }';
            type = "deducation";
            break;
        case "04":      // 퀴즈정답
            // q = 'query {' +
            //     ' tcashes (where: "{\\"OR\\": [{\\"AND\\": [{\\"type\\":\\"TC00\\"}, {\\"payMethod\\": \\"TIMEQUIZ\\"}]}], \\"user\\": {\\"name_contains\\":\\"' + search + '\\"}, \\"createdAt_gte\\":\\"' + momentStartDate.utc().format() + '\\", \\"createdAt_lt\\":\\"' + momentEndDate.utc().format() + '\\"}" orderBy:"createdAt_DESC", skip:' + listRow + ', first:' + listCount + ') { totalCount tcashes { id oid createdAt user { id name } type payMethod memo price tcash totalCount order { store { name } items { product { name } } } } } }';
            type = "quiz"
            break;
        case "05":      // 친구추천
            // q = 'query {' +
            //     ' tcashes (where: "{\\"OR\\": [{\\"AND\\": [{\\"type\\":\\"TC00\\"}, {\\"payMethod\\": \\"USER_RECOMMEND\\"}]}], \\"user\\": {\\"name_contains\\":\\"' + search + '\\"}, \\"createdAt_gte\\":\\"' + momentStartDate.utc().format() + '\\", \\"createdAt_lt\\":\\"' + momentEndDate.utc().format() + '\\"}" orderBy:"createdAt_DESC", skip:' + listRow + ', first:' + listCount + ') { totalCount tcashes { id oid createdAt user { id name } type payMethod memo price tcash totalCount order { store { name } items { product { name } } } } } }';
            type = "friend";
            break;
        default:
            // q = 'query {' +
            //     ' tcashes (where: "{\\"OR\\": [{\\"AND\\": [{\\"type\\": \\"TC00\\"}, {\\"payMethod_not\\": \\"00\\"}]}, {\\"type\\":\\"TC01\\"}], \\"user\\": {\\"name_contains\\":\\"' + search + '\\"}, \\"createdAt_gte\\":\\"' + momentStartDate.utc().format() + '\\", \\"createdAt_lt\\":\\"' + momentEndDate.utc().format() + '\\"}" orderBy:"createdAt_DESC", skip:' + listRow + ', first:' + listCount + ') { totalCount tcashes { id oid createdAt user { id name } type payMethod memo price tcash totalCount order { store { name } items { product { name } } } } } }';
            type = "all";
            break;
    }


    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadTcashList",
            "method": "post",
            "params": {
                startDate:momentStartDate.utc().format(),
                endDate: momentEndDate.utc().format(),
                search:search,
                page:listRow,
                pageSize:listCount,
                type:type,
            }
        })
        .then(function (response) {
            console.log("!11111111111111111111");
            console.log(response);
            resolve(response);
        });
    });
};


function execExcelData(startDate, endDate) {
    // let start = moment(startDate).format("YYMMDD") + "000000";
    // let end = moment(endDate).add(1, 'day').format("YYMMDD") + "000000";
    let start = moment(startDate).format("YYYYMMDD") + "000000";
    // start.hour(0);
    // start.minutes(0);
    // start.seconds(0);
    // start.milliseconds(0);
    let end = moment(endDate).add(1, 'day').format("YYYYMMDD") + "000000";
    // end.hour(0);
    // end.minutes(0);
    // end.seconds(0);
    // end.milliseconds(0);
    let tableColumnString = tableColumn.toString();
    let tableColumnNameString = tableColumnName.toString();

    start = moment(start, "YYYYMMDDHHmmss").utc().format();
    end = moment(end, "YYYYMMDDHHmmss").utc().format();

    window.open(API_CAL_URL + "/master/execExcelDownload?status=LIST_TCASH&column=" + tableColumnString + "&columnName=" + tableColumnNameString + "&startDate=" + start + "&endDate=" + end, '_blank');
}


function setType(row) {
    if ((row.type === "TC00" && row.payMethod !== "00") || row.type === "TC01") {

        if (row.type === "TC00") {
            if (row.payMethod === "CARD") {
                return "카드";
            }
            else if (row.payMethod === "CHARGE") {
                if (row.tcash >= 0) {
                    return "충전";
                }
                else {
                    return "차감";
                }
            }
            else if (row.payMethod === "REFUND") {
                return "거절";
            }
            else if (row.payMethod === "TIMEQUIZ") {
                return "퀴즈\n정답";
            }
            else if (row.payMethod === "USER_RECOMMEND") {
                return "친구\n추천";
            }
        }
        else if (row.type === "TC01") {
            return "사용";
        }
    }
    else {
        return "-";
    }
}



const TcashList = () => {
    const [login, setLogin] = useGlobalState('login');
    const classes = useStyles();

    const [search, setSearch] = React.useState("");
    const [tabValue, setTabValue] = React.useState(0);

    const [tcashes, setTcashes] = React.useState([]);
    // const [totalTcashes, setTotalTcashes] = React.useState(0);
    const [page, setPage] = React.useState(0);
    const [listCount, setListCount] = React.useState(10);
    const [pageCount, setPageCount] = React.useState(10);
    const [totalPage, setTotalPage] = React.useState(10);

    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());

    
    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        loadData(search, tabValue, page * listCount, listCount, startDate, endDate)
        .then((response) => {
            setData(response);
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    function setData(response) {
        console.log("TcashList response", response);
        let data = response.data;
    
        let totalCount = 0;
        if(data.content.length > 0){
            totalCount = data.totalElements;
        }
        let tcashes = data.content;
    
        setTcashes(tcashes);
        // setTotalTcashes(totalCount);

        let totalPgaePlus = (totalCount % listCount) > 0 ? 1 : 0;
        let totalPage = parseInt(totalCount / listCount) + totalPgaePlus;
        setTotalPage(totalPage);
    }

    // 탭 선택시 검색
    function clickTabs(event, newValue) {
        setTabValue(newValue);
        let search = document.getElementById('search');

        let status = "";
        switch(newValue) {
            case 1:
                status = "00";
                break;
            case 2:
                status = "01";
                break;
            case 3:
                status = "02";
                break;
            case 4:
                status = "03";
                break;
            case 5:
                status = "04";
                break;
            case 6:
                status = "05";
                break;
            default:
                status = "";
                break;
        }
            
        loadData(search.value, status, page * listCount, listCount, startDate, endDate)
        .then((response) => {
            setData(response);
        });
    }
    
    // 검색창 Enter 검색
    function doSearch(event) {
        if (event.keyCode === 13) {
            let text = event.target.value.trim();
            
            let status = "";
            switch(tabValue) {
                case 1:
                    status = "00";
                    break;
                case 2:
                    status = "01";
                    break;
                case 3:
                    status = "02";
                    break;
                case 4:
                    status = "03";
                    break;
                case 5:
                    status = "04";
                    break;
                case 6:
                    status = "05";
                    break;
                default:
                    status = "";
                    break;
            }
            setSearch(text);
            setPage(0);
            
            loadData(text, status, 0, listCount, startDate, endDate)
            .then((response) => {
                setData(response);
            });
        }
    }

    function clickSearch() {
        let text = document.getElementById('search').value;

        let status = "";
        switch(tabValue) {
            case 1:
                status = "00";
                break;
            case 2:
                status = "01";
                break;
            case 3:
                status = "02";
                break;
            case 4:
                status = "03";
                break;
            case 5:
                status = "04";
                break;
            case 6:
                status = "05";
                break;
            default:
                status = "";
                break;
        }
        setSearch(text);
        setPage(0);

        loadData(search.value, status, 0, listCount, startDate, endDate)
        .then((response) => {
            setData(response);
        });
    }

    function clickPagination(offset) {
        console.log("pagination", offset);
        setPage(offset);
        
        let search = document.getElementById('search');

        let status = "";
        switch(tabValue) {
            case 1:
                status = "00";
                break;
            case 2:
                status = "01";
                break;
            case 3:
                status = "02";
                break;
            case 4:
                status = "03";
                break;
            case 5:
                status = "04";
                break;
            case 6:
                status = "05";
                break;
            default:
                status = "";
                break;
        }

        loadData(search.value, status, offset , listCount, startDate, endDate)
        .then((response) => {
            setData(response);
        });
    }
    
    function changeListCount(event) {
        setListCount(event.target.value);
        console.log(event.target.value)

        let search = document.getElementById('search');
        loadData(search.value, tabValue, page * (event.target.value), (event.target.value))
        .then((response) => {
            setData(response);
        });
    }

    function changeStartDate(date) {
        setStartDate(date);
    }

    function changeEndDate(date) {
        setEndDate(date);
    }

    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap style={{ marginBottom: '16px'}}>
                    Tcash 내역
                </Typography>

                <div className={classes.divRow}>
                    <Paper>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <Grid container alignItems="center" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                                <Grid item>
                                    <KeyboardDatePicker
                                        variant="inline"
                                        margin="normal"
                                        id="start-date-picker-dialog"
                                        label="시작일"
                                        format="YYYY/MM/DD"
                                        value={startDate}
                                        onChange={changeStartDate}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                                <Grid item style={{ paddingLeft: '16px', paddingRight: '16px' }}>~</Grid>
                                <Grid item>
                                    <KeyboardDatePicker
                                        variant="inline"
                                        margin="normal"
                                        id="end-date-picker-dialog"
                                        label="종료일"
                                        format="YYYY/MM/DD"
                                        value={endDate}
                                        onChange={changeEndDate}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                                <Grid item style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                                    <Button variant="contained" color="primary" onClick={clickSearch}>조회</Button>
                                </Grid>
                            </Grid>
                        </MuiPickersUtilsProvider>
                        <Grid container>
                            <Grid item className={classes.paper}>
                                <SearchIcon />
                            </Grid>
                            <Grid item xs className={classes.input}>
                                <InputBase
                                    id="search"
                                    placeholder="닉네임으로 검색이 가능합니다."
                                    inputProps={{ 'aria-label': 'naked' }}
                                    style={{ width:'100%' }}
                                    onKeyUp={ doSearch }/>
                            </Grid>
                        </Grid>
                        <Tabs
                            value={tabValue}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={ clickTabs }>
                            <Tab label="전체"/>
                            <Tab label="충전"/>
                            <Tab label="사용"/>
                            <Tab label="거절"/>
                            <Tab label="차감"/>
                            <Tab label="퀴즈정답"/>
                            <Tab label="친구추천"/>
                        </Tabs>
                    </Paper>
                </div>

                <div>
                    <div className={classes.tableTopInfo}>
                        <Grid container>
                            <Grid item xs={6}>
                                <Select
                                    labelId="demo-customized-select-label"
                                    id="demo-customized-select"
                                    value={listCount}
                                    onChange={changeListCount}
                                    input={<BootstrapInput />}
                                    >
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={6} style={{ textAlign:'right' }}>
                                <Button variant="contained" color="primary" onClick={ execExcelData.bind(this, startDate, endDate) }>
                                    <TableChartOutlinedIcon/>&nbsp;EXCEL
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                    <Paper className={classes.root}>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center" style={{ width: '150px' }}>결제번호</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '150px' }}>결제일</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '150px' }}>닉네임</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '70px' }}>상태</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '150px' }}>구매금액</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '150px' }}>Tcash</StyledTableCell>
                                    <StyledTableCell align="center">사유</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    tcashes.length === 0 &&
                                        <StyledTableRow key={ 0 }>
                                            <StyledTableCell align="center" colSpan={14}>
                                                T-Cash 내용이 없습니다
                                            </StyledTableCell>
                                        </StyledTableRow>
                                }
                                {
                                    tcashes.map(row => (
                                        <StyledTableRow key={ row.id }>
                                            <StyledTableCell component="th" scope="row" align="center">{ row.oid }</StyledTableCell>
                                            <StyledTableCell align="center">{ moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss") }</StyledTableCell>
                                            <StyledTableCell><Link to={ "/User/" + row.user.id }>{ row.user.name }</Link></StyledTableCell>
                                            <StyledTableCell align="center">{ setType(row) }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(row.price).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(row.tcash).format('0,0') }</StyledTableCell>
                                            <StyledTableCell>{ row.memo }</StyledTableCell>
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

export default TcashList;