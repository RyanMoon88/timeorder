import React from 'react';
import {  API_HOST, API_CAL_URL } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
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
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import CloseIcon from '@material-ui/icons/Close';
import FlagIcon from '@material-ui/icons/Flag';
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


function loadData(search = "", tabValue = "", listRow = 10, listCount = 10, ) {
    var q = "";
    
    let status = "";
    switch(tabValue) {
        case 1:
            status = "01";
            break;
        case 2:
            status = "02";
            break;
        case 3:
            status = "12";
            break;
    }

/* 
    if (status === "") {
        q = 'query {' + 
            ' stores (orderBy: "createdAt_DESC", skip:' + listRow + ', first:' + listCount + ', where:"{ \\"name_contains\\":\\"' + search + '\\", \\"OR\\": [{\\"storeCategory_contains\\":\\"' + status + '\\"}, {\\"storeCategory\\":null}]  }") { totalCount stores { id code name type saleType storeCategory phone address createdAt isOpened isPause isTabletLive { storeOwner { name } version createdAt } group { name } createdAt } }' +
        '}';
    }
    else if (status === "01" || status === "02") {
        q = 'query {' + 
            ' stores (orderBy: "createdAt_DESC", skip:' + listRow + ', first:' + listCount + ', where:"{ \\"name_contains\\":\\"' + search + '\\", \\"storeCategory_contains\\":\\"' + status + '\\" }") { totalCount stores { id code name type saleType storeCategory phone address createdAt isOpened isPause isTabletLive { storeOwner { name } version createdAt } group { name } createdAt } }' +
        '}';
    }
    else if (status === "12") {
        q = 'query {' + 
            ' stores (orderBy: "createdAt_DESC", skip:' + listRow + ', first:' + listCount + ', where:"{ \\"name_contains\\":\\"' + search + '\\", \\"isOpened\\":false, \\"isPause\\":false }") { totalCount stores { id code name type saleType storeCategory phone address createdAt isOpened isPause isTabletLive { storeOwner { name } version createdAt } group { name } createdAt } }' +
        '}';
    } 
    else if (status === "10") {
        q = 'query {' + 
            ' stores (orderBy: "createdAt_DESC", skip:' + listRow + ', first:' + listCount + ', where:"{ \\"name_contains\\":\\"' + search + '\\", \\"isOpened\\":true, \\"isPause\\":false }") { totalCount stores { id code name type saleType storeCategory phone address createdAt isOpened isPause isTabletLive { storeOwner { name } version createdAt } group { name } createdAt } }' +
        '}';
    }
    else {
        q = 'query {' + 
            ' stores (orderBy: "createdAt_DESC", skip:' + listRow + ', first:' + listCount + ', where:"{ \\"name_contains\\":\\"' + search + '\\", \\"isOpened\\":true, \\"isPause\\":true }") { totalCount stores { id code name type saleType storeCategory phone address createdAt isOpened isPause isTabletLive { storeOwner { name } version createdAt } group { name } createdAt } }' +
        '}';
    }

 */
    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/getStoreList?start=" + listRow + "&size=" + listCount + "&search=" + search + "&status=" + status,
            "method": "post"
        })
        .then(function (response) {
            resolve(response);
        });
    });
};



function setGroupName(group) {
    if (group !== null) {
        return group.name;
    }
    else {
        return "-";
    }
}

/*
function setSaleType(type) {
    switch(type) {
        case "SS01":
        default:
            return "판매형";
        case "SS02":
            return "픽업형";
    }
}
*/

function getStoreCategory(storeCategory) {
    switch(storeCategory) {
        case "SC01":
        default:
            return "카페";
        case "SC02":
            return "식당";
        case "SC03":
            return "호텔/숙박";
        case "SC04":
            return "트립오더";
    }
}

function getUse(type) {
    if (type === "1") {
        return <CircleIcon/>;
    }
    else if (type === "99") {
        return <FlagIcon/>;
    }
    else {
        return <CloseIcon/>;
    }
}

function getVersion(log) {
    if (null !== log) {
        return log.version !== undefined ? log.version : "-";
    }
    else {
        return "-";
    }
}


function getStatus(row) {
    if (null !== row.isTabletLive) {
        var now = moment(new Date());
        var logDate = moment(row.isTabletLive.createdAt);

        if (row.isOpened) {
            if (row.isPause) {
                return "circle circle-orange";
            }
            else if (now.diff(logDate) > 600000 ) {
                return "circle circle-purple"
            }
            else {
                return "circle circle-green";
            }
        }
        else {
            return "circle circle-red";
        }
    }
    else {
        return "circle";
    }
    
}


function getStatusText(row) {    
    if (null !== row.isTabletLive) {
        var now = moment(new Date());
        var logDate = moment(row.isTabletLive.createdAt);

        if (row.isOpened) {
            if (row.isPause) {
                return "일시정지";
            }
            else if (now.diff(logDate) > 600000 ) {
                return "감지안됨</span><br><span>(" + logDate.format("YYYY-MM-DD HH:mm:ss") + ")";
            }
            else {
                return "오픈";
            }
        }
        else {
            return "마감";
        }
    }
    else {
        return "미설치<br>또는 ver 1.0.4 이하";
    }
}


function execExcelData() {
    window.open(API_CAL_URL + "/master/execExcelDownloadByPGL?status=LIST_STORE", '_blank');
}


const StoreList = () => {
    const history = useHistory();

    const [login, setLogin] = useGlobalState('login');
    const [backdrop, setBackdrop] = useGlobalState('backdrop');
    const classes = useStyles();

    const [search, setSearch] = React.useState("");
    const [tabValue, setTabValue] = React.useState(0);

    const [stores, setStores] = React.useState([]);
    const [totalStores, setTotalStores] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [listCount, setListCount] = React.useState(15);
    const [pageCount, setPageCount] = React.useState(10);
    const [totalPage, setTotalPage] = React.useState(10);
    
    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        setBackdrop(true);
        loadData(search, tabValue, page * listCount, listCount)
        .then((response) => {
            setData(response);
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    function setData(response) {
        console.log("StoreList response", response);
        let data = response.data;
    
        let totalCount = data.totalCount;
        let stores = data.stores;
    
        setStores(stores);
        setTotalStores(totalCount);

        let totalPgaePlus = (totalCount % listCount) > 0 ? 1 : 0;
        let totalPage = parseInt(totalCount / listCount) + totalPgaePlus;
        setTotalPage(totalPage);

        setBackdrop(false);
    }

    // 탭 선택시 검색
    function clickTabs(event, newValue) {
        setTabValue(newValue);

        loadData(search, newValue, page * listCount, listCount)
        .then((response) => {
            setData(response);
        });
    }
    
    // 검색창 Enter 검색
    function doSearch(event) {
        if (event.keyCode === 13) {
            let text = event.target.value.trim();
            setSearch(text);
            setPage(0);
                        
            loadData(text, tabValue, 0, listCount)
            .then((response) => {
                setData(response);
            });
        }
    }

    function clickPagination(offset) {
        setPage(offset);

        loadData(search, tabValue, offset * listCount, listCount)
        .then((response) => {
            setData(response);
        });
    }

    function addStore() {
        let paramData = {
            name: "" ,
            code: "9999" ,
            storeCategory: "" ,
            groupId: "" ,
            phone: "" ,
            zipcode: "" ,
            address: "" ,
            addressDetail: "" ,
            latitude: 0 ,
            longitude: 0 ,
            images: "" ,
            description: "" ,
            discountValue: 0 ,
            discountStart: "" ,
            discountEnd: "" ,
            type: "" ,
            storeDiscountValue: 0 ,
            elapsedTime: 0 ,
            isPause: false ,
            isOpened: false ,
            ceo: "" ,
            ceoPhone: "" ,
            bankCode: "" ,
            bankOwner: "" ,
            bankNumber: "" ,
            groupDiscountCode: "" ,
            groupDiscountValue: 0 ,
        }
        
        return new Promise((resolve, reject) => {
            axios({
                "url": API_HOST + "/master/insertStore",
                "method": "post",
                "data": paramData
            })
            .then(function (response) {
                console.log(response);
                let logParam = {
                    type:"STO1",
                    adminId: "cjv6z5pjs0aay0734ge2kfk00",
                    content:"[가맹점 추가]" + "storeId : " + response.data.id,
                }
                axios({
                    "url":API_HOST + "/master/insertLog",
                    "method":"post",
                    "type":logParam
                }).then(function(response){
                    
                });
                try {
                    let id = response.data.id;
                    history.push("/Store/" + id);
                    resolve();
                }
                catch (e) {
                    console.log(e);
                    // window.location.reload();
                }
            });
        });
    }
    
    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap style={{ marginBottom: '16px'}}>
                    가맹점 목록 <Button variant="contained" color="primary" onClick={ addStore }>추가</Button>
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
                                    placeholder="가맹점명으로 검색이 가능합니다."
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
                            <Tab label="카페"/>
                            <Tab label="식당"/>
                            <Tab label="마감 or 미설치"/>
                        </Tabs>
                    </Paper>
                </div>

                <div>
                    <Paper square className={classes.paper}>
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography variant="h6">
                                    전체 가맹점
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
                                    <StyledTableCell align="center" style={{ width: '100px' }}>가맹점코드</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '100px' }}>분류</StyledTableCell>
                                    <StyledTableCell align="center">가맹점명</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '100px' }}>가맹점 그룹</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '150px' }}>전화번호</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '150px' }}>등록일</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '60px' }}>운영</StyledTableCell>
                                    {/* <StyledTableCell align="center" style={{ width: '200px' }}>태블릿 상태</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '80px' }}>태블릿 버전</StyledTableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    stores.length === 0 &&
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={9} align="center">검색된 가맹점정보가 없습니다.</StyledTableCell>
                                        </StyledTableRow>

                                }
                                {
                                    stores.map(row => (
                                        <StyledTableRow key={ row.id }>
                                            <StyledTableCell component="th" scope="row">{ row.code }</StyledTableCell>
                                            <StyledTableCell align="center">{ getStoreCategory(row.storeCategory) }</StyledTableCell>
                                            <StyledTableCell><Link to={ "/Store/" + row.id }>{ row.name === "" ? "이름 없음" : row.name }</Link></StyledTableCell>
                                            <StyledTableCell align="center">{ setGroupName(row.group) }</StyledTableCell>
                                            <StyledTableCell align="center">{ row.phone }</StyledTableCell>
                                            <StyledTableCell align="center">{ moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss") }</StyledTableCell>
                                            <StyledTableCell align="right">{ getUse(row.type) }</StyledTableCell>
                                            {/* <StyledTableCell align="center">
                                                <span className={getStatus(row)}></span>&nbsp;&nbsp;<span dangerouslySetInnerHTML={{ __html: getStatusText(row) }}/>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{ getVersion(row.isTabletLive) }</StyledTableCell> */}
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

export default StoreList;