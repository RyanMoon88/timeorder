import React from 'react';
import { API_CAL_URL, API_HOST } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, InputBase, Tabs, Tab, Container, Button } from '@material-ui/core';
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
import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined';



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


function loadData(search = "", tabValue = "", listRow = 10, listCount = 10) {
    let sns = "";
    let type = "";
    switch(tabValue) {
        case 1:
            type = "2";
            break;
        case 2:
            sns = "EMAIL";
            break;
        case 3:
            sns = "KAKAO";
            break;
        case 4:
            sns = "FB";
            break;
    }

    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/getUserList?start=" + listRow + "&size=" + listCount + "&search=" + search + "&type=" + type + "&sns=" + sns,
            "method": "post"
        })
        .then(function (response) {
            resolve(response);
        });
    });
};


function setType(type) {
    switch(type) {
        case "1":
            return "신규";
        case "2":
            return "아임웹";
        case "99":
            return "타임오더";
        case "-1":
            return "탈퇴";
        default:
            return "-";
    }
}


function setSnsType(sns) {
    switch(sns) {
        case "0000":
            return "이전 신청";
        case "KAKAO":
            return "카카오";
        case "FB":
            return "페이스북";
        default:
            return "이메일";
    }
}


function execExcelData() {
    window.open(API_CAL_URL + "/master/execExcelDownloadByPGL?status=LIST_USER", '_blank');
}


const UserList = () => {
    const [login, setLogin] = useGlobalState('login');
    const [backdrop, setBackdrop] = useGlobalState('backdrop');
    const classes = useStyles();

    const [search, setSearch] = React.useState("");
    const [tabValue, setTabValue] = React.useState(0);

    const [excelCheck, setExcelCheck] = React.useState([true, true, true, true, true, true, true])

    const [users, setUsers] = React.useState([]);
    const [totalUsers, setTotalUsers] = React.useState(0);
    const [zeroCount, setZeroCount] = React.useState(0);
    const [emailCount, setEmailCount] = React.useState(0);
    const [kakaoCount, setKakaoCount] = React.useState(0);
    const [fbCount, setFbCount] = React.useState(0);
    const [page, setPage] = React.useState(0);
    const [listCount, setListCount] = React.useState(15);
    const [pageCount, setPageCount] = React.useState(10);
    const [totalPage, setTotalPage] = React.useState(10);

    const [excelColumn, setExcelColumn] = React.useState([
        { col: "email", name: "이메일", selected: true },
        { col: "sns", name: "SNS", selected: true },
        { col: "name", name: "이름", selected: true },
        { col: "phone", name: "휴대폰", selected: true },
        { col: "mobileOs", name: "사용기기", selected: true },
        { col: "sex", name: "성별", selected: true },
        { col: "birth", name: "생년월일", selected: true }
    ]);

    
    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        setBackdrop(true);
        loadData(search, tabValue, page * listCount, listCount)
        .then((response) => {
            setData(response);
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    // function setData(response) {
    //     console.log("userlist response", response);
    //     let data = response.data.data;
    
    //     let totalCount = data.users.totalCount;
    //     let zeroCount = data.users.zeroCount;
    //     let emailCount = data.users.emailCount;
    //     let kakaoCount = data.users.kakaoCount;
    //     let fbCount = data.users.fbCount;
    //     let users = data.users.users;
    //     let usersLength = users.length;
    
    //     for (let i=0; i<usersLength; i++) {
    //         let tcashes = users[i].tcashes;
    //         let tcashesLength = tcashes.length;
    
    //         let tcashAmount = 0;
    //         let totalTcashChargeAmount = 0;
    //         let totalTcashChargeCount = 0;
    
    //         for (let j=0; j<tcashesLength; j++) {
    //             if (tcashes[j].type === "TC00" && tcashes[j].payMethod !== "00") {
    //                 tcashAmount += tcashes[j].tcash;
    //             }
    //             else if (tcashes[j].type === "TC01") {
    //                 tcashAmount -= tcashes[j].tcash;
    //             }
    
            
    //             if (tcashes[j].type === "TC00" && tcashes[j].payMethod === "CARD") {
    //                 totalTcashChargeAmount += tcashes[j].price;
    //                 totalTcashChargeCount++;
    //             }
    //         }
    
    //         users[i].tcashAmount = tcashAmount;
    //         users[i].totalTcashChargeAmount = totalTcashChargeAmount;
    //         users[i].totalTcashChargeCount = totalTcashChargeCount;
    //     }
    
    //     setUsers(users);
    //     setTotalUsers(totalCount);
    //     setZeroCount(zeroCount);
    //     setEmailCount(emailCount);
    //     setKakaoCount(kakaoCount);
    //     setFbCount(fbCount);

    //     let totalPagePlus = (totalCount % listCount) > 0 ? 1 : 0;
    //     let totalPage = parseInt(totalCount / listCount) + totalPagePlus;
    //     setTotalPage(totalPage);
        
    //     setBackdrop(false);
    // }

    function setData(response) {
        console.log("userlist response", response);
        let data = response.data;
    
        let totalCount = data.totalCount;
        let zeroCount = data.zeroCount;
        let emailCount = data.emailCount;
        let kakaoCount = data.kakaoCount;
        let fbCount = data.fbCount;
        let users = data.users;
        let usersLength = users.length;
    
        setUsers(users);
        setTotalUsers(totalCount);
        setZeroCount(zeroCount);
        setEmailCount(emailCount);
        setKakaoCount(kakaoCount);
        setFbCount(fbCount);

        let totalPagePlus = (totalCount % listCount) > 0 ? 1 : 0;
        let totalPage = parseInt(totalCount / listCount) + totalPagePlus;
        setTotalPage(totalPage);
        
        setBackdrop(false);
    }

    // 탭 선택시 검색
    function clickTabs(event, newValue) {
        setBackdrop(true);
        loadData(search, newValue, page * listCount, listCount)
        .then((response) => {
            setData(response);
        });

        setTabValue(newValue);
    }
    
    // 검색창 Enter 검색
    function doSearch(event) {
        if (event.keyCode === 13) {
            let text = event.target.value.trim();
            setSearch(text);
            setPage(0);

            setBackdrop(true);
            loadData(text, tabValue, 0, listCount)
            .then((response) => {
                setData(response);
            });
        }
    }

    function clickPagination(offset) {
        console.log("pagination", offset);
        setPage(offset);

        setBackdrop(true);
        loadData(search, tabValue, offset * listCount, listCount)
        .then((response) => {
            setData(response);
        });
    }


    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap style={{ marginBottom: '16px'}}>
                    사용자 목록
                </Typography>

                <div className={classes.divRow}>
                    <Paper>
                        <Grid container>
                            <Grid item className={classes.paper}>
                                <SearchIcon />
                            </Grid>
                            <Grid item xs className={classes.input}>
                                <InputBase
                                    id="search"
                                    placeholder="닉네임, 이메일, 휴대폰번호로 검색이 가능합니다."
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
                            <Tab label={'전체 ' + '(' + numeral(zeroCount + emailCount + kakaoCount + fbCount).format('0,0') + ')'}/>
                            <Tab label={'이전신청 ' + '(' + numeral(zeroCount).format('0,0') + ')'}/>
                            <Tab label={'이메일 ' + '(' + numeral(emailCount).format('0,0') + ')'}/>
                            <Tab label={'카카오톡 ' + '(' + numeral(kakaoCount).format('0,0') + ')'}/>
                            <Tab label={'페이스북 ' + '(' + numeral(fbCount).format('0,0') + ')'}/>
                        </Tabs>
                    </Paper>
                </div>

                <div>
                    <Paper square className={classes.paper}>
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography variant="h6">
                                    전체 사용자 { numeral(zeroCount + emailCount + kakaoCount + fbCount).format('0,0') }
                                </Typography>
                            </Grid>
                            <Grid item xs={6} style={{ textAlign:'right' }}>
                                <Button variant="contained" color="primary" onClick={ execExcelData }>
                                    <TableChartOutlinedIcon/>&nbsp;EXCEL
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Paper square className={classes.root}>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">닉네임</StyledTableCell>
                                    <StyledTableCell align="center">계정</StyledTableCell>
                                    <StyledTableCell align="center">휴대폰</StyledTableCell>
                                    <StyledTableCell align="center">타입</StyledTableCell>
                                    <StyledTableCell align="center">가입 타입</StyledTableCell>
                                    <StyledTableCell align="center">가입일</StyledTableCell>
                                    <StyledTableCell align="center">잔여 Tcash</StyledTableCell>
                                    <StyledTableCell align="center">Tcash 결제금액</StyledTableCell>
                                    <StyledTableCell align="center">누적 주문수</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    users.length === 0 &&
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={9} align="center">검색된 회원정보가 없습니다.</StyledTableCell>
                                        </StyledTableRow>

                                }
                                {
                                    users.map(row => (
                                        <StyledTableRow key={ row.id }>
                                            <StyledTableCell component="th" scope="row"><Link to={ "/User/" + row.id }>{ row.name }</Link></StyledTableCell>
                                            <StyledTableCell>{ row.email }</StyledTableCell>
                                            <StyledTableCell align="center">{ row.phone }</StyledTableCell>
                                            <StyledTableCell align="center">{ setType(row.type) }</StyledTableCell>
                                            <StyledTableCell align="center">{ setSnsType(row.sns) }</StyledTableCell>
                                            <StyledTableCell align="center">{ moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss") }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(row.tcashAmount).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(row.tcashCardChargeAmount).format('0,0') } ({ numeral(row.tcashCardChargeCount).format('0,0') }건)</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(row.orderCount).format('0,0') }</StyledTableCell>
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

export default UserList;