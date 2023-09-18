import React from 'react';
import { API_HOST } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Box, Paper, Grid, Typography, InputBase, Button, Container } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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


// 표 스타일 시작
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
// 표 스타일 끝



function loadData(id = "", search = "", listRow = 0, listCount = 10, ) {
    let q = 'query {' +
        ' stores (orderBy: "createdAt_DESC", skip:' + listRow + ', first:' + listCount + ', where:"{ \\"group\\": { \\"id\\":\\"' + id + '\\" }, \\"name_contains\\":\\"' + search + '\\" }") { totalCount stores { id code name phone address createdAt group { name } orderToday { id payMethod totalPrice } orderWeek { id payMethod totalPrice } orderMonth { id payMethod totalPrice } ordered { id payMethod totalPrice } } }' +
    '}'

    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadStoreListByGroupId",
            "method": "post",
            "params": {
                groupId:id,
                search:search,
                page:listRow,
                pageSize:listCount,
            }
        })
        .then(function (response) {
            resolve(response);
        });
    });
};


const getOrderTodayPrice = (row) => {
    let total = 0;
    let orderToday = row.orderToday;
    if(orderToday !== null){
        total = orderToday.totalAmount;
    }
    // for (let j=0; j<orderToday.length; j++) {
    //     if (orderToday[j].payMethod !== "00") {
    //         total += orderToday[j].totalPrice;
    //     }
    // }
    
    return total;
}

function getOrderWeeklyPrice(row) {
    let total = 0;
    let orderWeek = row.orderWeek;
    // for (let j=0; j<orderWeek.length; j++) {
    //     if (orderWeek[j].payMethod !== "00") {
    //         total += orderWeek[j].totalPrice;
    //     }
    // }
    if(orderWeek !== null){
        total = orderWeek.totalAmount;
    }
    return total;
}

function getOrderMonthlyPrice(row) {
    let total = 0;
    let orderMonth = row.orderMonth;
    // for (let j=0; j<orderMonth.length; j++) {
    //     if (orderMonth[j].payMethod !== "00") {
    //         total += orderMonth[j].totalPrice;
    //     }
    // }
    if(orderMonth !== null){
        total = orderMonth.totalAmount;
    }
    return total;
}

function getOrderTotalPrice(row) {
    let total = 0;
    let orders = row.orderList;
    // for (let j=0; j<orders.length; j++) {
    //     if (orders[j].payMethod !== "00") {
    //         total += orders[j].totalPrice;
    //     }
    // }
    if(orders !== null){
        total = orders.totalAmount;
    }
    return total;
}

function getOrderTotalCount(row) {
    let total = 0;
    let orders = row.orderList;
    // for (let j=0; j<orders.length; j++) {
    //     if (orders[j].payMethod !== "00") {
    //         total++;
    //     }
    // }
    if(orders !== null){
        total = orders.totalCount;
    }
    return total;
}


const StoreGroup = ({ match }) => {
    const [login, setLogin] = useGlobalState('login');
    const [backdrop, setBackdrop] = useGlobalState('backdrop');
    const classes = useStyles();

    const [search, setSearch] = React.useState("");

    const [stores, setStores] = React.useState([]);
    const [totalStores, setTotalStores] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [listCount, setListCount] = React.useState(15);
    const [pageCount, setPageCount] = React.useState(10);
    const [totalPage, setTotalPage] = React.useState(10);
    
    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        setBackdrop(true);
        loadData(match.params.id)
        .then((response) => {
            setData(response);
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서
    
    function setData(response) {
        console.log("StoreGroup response", response);
        let data = response.data;
    
        let totalCount = data.totalElements;
        let stores = data.content;
    
        setStores(stores);
        setTotalStores(totalCount);

        let totalPgaePlus = (totalCount % listCount) > 0 ? 1 : 0;
        let totalPage = parseInt(totalCount / listCount) + totalPgaePlus;
        setTotalPage(totalPage);

        setBackdrop(false);
    }

    function doSearch(event) {
        if (event.keyCode === 13) {
            let text = event.target.value.trim();
            setSearch(text);
                        
            loadData(match.params.id, text, page * listCount, listCount)
            .then((response) => {
                setData(response);
            });
        }
    }

    function clickPagination(offset) {
        setPage(offset);

        loadData(match.params.id, search, offset * listCount, listCount)
        .then((response) => {
            setData(response);
        });
    }

    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap style={{ marginBottom: '16px'}}>
                    가맹점 목록
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
                    </Paper>
                </div>

                <div>
                    <Paper square className={classes.paper}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography variant="h6">
                                    전체 가맹점
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Paper square className={classes.root}>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center" style={{ width: '100px' }}>가맹점코드</StyledTableCell>
                                    <StyledTableCell align="center">가맹점명</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '150px' }}>전화번호</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '150px' }}>금일 매출액</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '150px' }}>금주 매출액</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '150px' }}>금월 매출액</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '150px' }}>총 매출액</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '120px' }}>총 주문 건수</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '150px' }}>등록일</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    stores.length === 0 &&
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={9} align="center" component="th" scope="row">
                                                가맹점 정보가 없습니다.
                                            </StyledTableCell>
                                        </StyledTableRow>
                                }
                                {
                                    stores.map(row => (
                                        <StyledTableRow key={ row.id }>
                                            <StyledTableCell component="th" scope="row">{ row.code }</StyledTableCell>
                                            <StyledTableCell><Link to={ "/Store/" + row.id }>{ row.name }</Link></StyledTableCell>
                                            <StyledTableCell align="center">{ row.phone }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(getOrderTodayPrice(row)).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(getOrderWeeklyPrice(row)).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(getOrderMonthlyPrice(row)).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(getOrderTotalPrice(row)).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(getOrderTotalCount(row)).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="center">{ moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss") }</StyledTableCell>
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

export default StoreGroup;