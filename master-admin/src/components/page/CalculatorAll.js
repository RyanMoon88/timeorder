import React from 'react';
import { API_CAL_URL } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Button } from '@material-ui/core';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, InputBase } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';


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
        position: 'relative'
    },
    body: {
        fontSize: 12,
    },
}))(TableCell);

const StyledTableCell2 = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.common.white,
        position: 'relative'
    },
    body: {
        fontSize: 12,
        backgroundColor: '#ffe3d0'
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);


function loadData(startDate, endDate) {
    let start = moment(startDate);
    let end = moment(endDate);

    start.hours(0);
    start.minutes(0);
    start.seconds(0);

    end.add(1, 'd');
    end.hours(0);
    end.minutes(0);
    end.seconds(0);

    return new Promise((resolve, reject) => {
        axios({
            "url": API_CAL_URL + "/master/calDailyOrders?start=" + start.format("YYMMDDHHmmss") + "&end=" + end.format("YYMMDDHHmmss"),
            "method": "get"
        })
        .then(function (response) {
            resolve(response);
        })
        .catch((error) => {
            reject(error);
        });
    });
};


function execExcelData(startDate, endDate, hideZero) {
    let start = moment(startDate).format("YYMMDD") + "000000";
    let end = moment(endDate).add(1, 'day').format("YYMMDD") + "000000";

    window.open(API_CAL_URL + "/master/execExcelDownloadByPGL?status=LIST_CAL_ALL&startDate=" + start + "&endDate=" + end + "&hideZero=" + hideZero, '_blank');
}


const CalculatorAll = () => {
    const [login, setLogin] = useGlobalState('login');
    const [backdrop, setBackdrop] = useGlobalState('backdrop');
    const [errorDialog, setErrorDialog] = useGlobalState('errorDialog');
    const [errorMessage, setErrorMessage] = useGlobalState('errorMessage');
    
    const classes = useStyles();

    const [calData, setCalData] = React.useState([]);
    const [originCalData, setOriginCalData] = React.useState([]);
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());
    const [sortType, setSortType] = React.useState(-1);
    
    const [search, setSearch] = React.useState("");
    const [dataFilter, setDataFilter] = React.useState({
        hideZero: false,
        filterCal: true,
        filterTax: true,
        filterAmt: true,
        filterDiscount: true,
        filterStoreDiscount: true,
        filterGroupDiscount: true,
        filterCount: true,
        filterKioskPrice: true,
        filterKioskCount: true,
        filterPosPrice: true,
        filterPosCount: true,
        filterBank: false,
        filterBankAccount: false,
        filterBankOwner: false,
    });
    const { hideZero, filterCal, filterTax, filterAmt, filterDiscount, filterStoreDiscount, filterGroupDiscount, filterCount,
        filterKioskPrice, filterKioskCount, filterPosPrice, filterPosCount, filterBank, filterBankAccount, filterBankOwner } = dataFilter;

    const [totalDiscount, setTotalDiscount] = React.useState(0);
    const [totalStoreDiscount, setStoreDiscount] = React.useState(0);
    const [totalGroupDiscount, setGrouplDiscount] = React.useState(0);
    const [totalCnt, setTotalCnt] = React.useState(0);
    const [totalPrice, setTotalPrice] = React.useState(0);
    const [totalTax, setTotalTax] = React.useState(0);
    const [totalCal, setTotalCal] = React.useState(0);
    const [totalPriceKiosk, setTotalPriceKiosk] = React.useState(0);
    const [totalCntKiosk, setTotalCntKiosk] = React.useState(0);
    const [totalPricePos, setTotalPricePos] = React.useState(0);
    const [totalCntPos, setTotalCntPos] = React.useState(0);
    const [totalCouponDiscount, setTotalCouponDiscount] = React.useState(0);

    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        setBackdrop(true);
        loadData(startDate, endDate)
        .then((response) => {
            setData(response);
        })
        .catch((error) => {
            console.log(error);
            console.log(error.response);
            console.log(error.request);
            console.log(error.message);
            setErrorMessage(error.message);
            setErrorDialog(true);
            setBackdrop(false);
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    function setData(response) {
        console.log("CalculatorAll response", response);
        let totalDiscount = 0;
        let totalStoreDiscount = 0;
        let totalGroupDiscount = 0;
        let totalCnt = 0;
        let totalPrice = 0;
        let totalTax = 0;
        let totalCal = 0;
        let totalPriceKiosk = 0;
        let totalCntKiosk = 0;
        let totalPricePos = 0;
        let totalCntPos = 0;
        let totalCouponDiscount = 0;

        setCalData(response.data);
        setOriginCalData(response.data);
        let data = response.data;
        let dataLength = response.data.length;

        for (let i=0; i<dataLength; i++) {
            totalDiscount += data[i].result.discount;
            totalStoreDiscount += data[i].result.storeDiscount;
            totalGroupDiscount += data[i].result.groupDiscount;
            totalCnt += data[i].result.cnt;
            totalPrice += data[i].result.amt;
            totalTax += data[i].result.tax;
            totalCal += data[i].result.cal;
            totalPriceKiosk += data[i].result.amtKiosk;
            totalCntKiosk += data[i].result.cntKiosk;
            totalPricePos += data[i].result.amtPos;
            totalCntPos += data[i].result.cntPos;
            totalCouponDiscount += data[i].result.couponDiscount;
        }
        
        setTotalDiscount(totalDiscount);
        setStoreDiscount(totalStoreDiscount);
        setGrouplDiscount(totalGroupDiscount);
        setTotalCnt(totalCnt);
        setTotalPrice(totalPrice);
        setTotalTax(totalTax);
        setTotalCal(totalCal);
        setTotalPriceKiosk(totalPriceKiosk);
        setTotalCouponDiscount(totalCouponDiscount);
        setTotalCntKiosk(totalCntKiosk);
        setTotalPricePos(totalPricePos);
        setTotalCntPos(totalCntPos);
        
        setBackdrop(false);
    }

    function changeStartDate(date) {
        setStartDate(date);
    }

    function changeEndDate(date) {
        setEndDate(date);
    }

    function clickSearch() {
        setBackdrop(true);
        setCalData([]);
        setSortType(-1);
        loadData(startDate, endDate)
        .then((response) => {
            setData(response);
        });
    }

    // 검색창 Enter 검색
    function doSearch(event) {
        if (event.keyCode === 13) {
            let text = event.target.value.trim();
            setSearch(text);

            if (hideZero) {
                let data = originCalData.filter((a) => a.result.amt > 0);
                data = data.filter((a) => a.store.name.indexOf(text) > -1);
                setCalData(data);
            }
            else {
                let data = originCalData.filter((a) => a.store.name.indexOf(text) > -1);
                setCalData(data);
            }
        }
    }

    function doCheckDataFilter(event) {
        setDataFilter({ ...dataFilter, [event.target.name]: event.target.checked });

        if (event.target.name === "hideZero") {
            if (event.target.checked) {
                let data = originCalData.filter((a) => a.result.amt > 0);
                data = data.filter((a) => a.store.name.indexOf(search) > -1);
                setCalData(data);
            }
            else {
                setCalData(originCalData);
            }
        }
    }
    

    function doSetSortType(value) {
        setSortType(value);

        calData.sort((a, b) => {
            if (value === 0) {
                return a.store.name < b.store.name ? -1 : 1;
            }
            if (value === 1) {
                return a.result.cal < b.result.cal ? 1 : -1;
            }
            if (value === 2) {
                return a.result.tax < b.result.tax ? 1 : -1;
            }
            if (value === 3) {
                return a.result.amt < b.result.amt ? 1 : -1;
            }
            if (value === 4) {
                return a.result.discount < b.result.discount ? 1 : -1;
            }
            if (value === 5) {
                return a.result.storeDiscount < b.result.storeDiscount ? 1 : -1;
            }
            if (value === 6) {
                return a.result.groupDiscount < b.result.groupDiscount ? 1 : -1;
            }
            if (value === 7) {
                return a.result.cnt < b.result.cnt ? 1 : -1;
            }
            if (value === 8) {
                return a.result.amtKiosk < b.result.amtKiosk ? 1 : -1;
            }
            if (value === 9) {
                return a.result.cntKiosk < b.result.cntKiosk ? 1 : -1;
            }
            if (value === 10) {
                return a.result.amtPos < b.result.amtPos ? 1 : -1;
            }
            if (value === 11) {
                return a.result.cntPos < b.result.cntPos ? 1 : -1;
            }
            else {
                return 1;
            }
        });
    }

    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap style={{ marginBottom: '16px'}}>
                    정산관리 전체
                </Typography>
                <div className={classes.divRow}>
                    <Paper>
                        <Grid container>
                            <Grid item xs={12}>
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
                                        <Grid item style={{ marginRight: '16px' }}>
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
                                        <Grid item>
                                            <Button variant="contained" color="primary" onClick={clickSearch}>조회</Button>
                                        </Grid>
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={4}>
                                <Box p={2}>
                                    <FormControl required component="fieldset" className={classes.formControl}>
                                        <FormLabel component="legend">선택필터</FormLabel>
                                        <FormGroup row style={{ marginBottom: '-10px'}}>
                                            <FormControlLabel
                                                control={<Checkbox color="primary" checked={hideZero} onChange={doCheckDataFilter} name="hideZero" />}
                                                label="결제금액 0원제외"
                                            />
                                        </FormGroup>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Box p={2}>
                                    <FormControl required component="fieldset" className={classes.formControl}>
                                        <FormLabel component="legend">데이터</FormLabel>
                                        <FormGroup row style={{ marginBottom: '-10px'}}>
                                            <FormControlLabel
                                                control={<Checkbox color="primary" checked={filterCal} onChange={doCheckDataFilter} name="filterCal" />}
                                                label="정산금액"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox color="primary" checked={filterTax} onChange={doCheckDataFilter} name="filterTax" />}
                                                label="수수료"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox color="primary" checked={filterAmt} onChange={doCheckDataFilter} name="filterAmt" />}
                                                label="결제금액"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox color="primary" checked={filterDiscount} onChange={doCheckDataFilter} name="filterDiscount" />}
                                                label="본사할인"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox color="primary" checked={filterStoreDiscount} onChange={doCheckDataFilter} name="filterStoreDiscount" />}
                                                label="매장할인"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox color="primary" checked={filterGroupDiscount} onChange={doCheckDataFilter} name="filterGroupDiscount" />}
                                                label="그룹할인"
                                            />
                                        </FormGroup>
                                        <FormGroup row style={{ marginBottom: '-10px'}}>
                                            <FormControlLabel
                                                control={<Checkbox color="primary" checked={filterCount} onChange={doCheckDataFilter} name="filterCount" />}
                                                label="거래건수"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox color="primary" checked={filterKioskPrice} onChange={doCheckDataFilter} name="filterKioskPrice" />}
                                                label="키오스크 결제금액"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox color="primary" checked={filterKioskCount} onChange={doCheckDataFilter} name="filterKioskCount" />}
                                                label="키오스크 거래건수"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox color="primary" checked={filterPosPrice} onChange={doCheckDataFilter} name="filterPosPrice" />}
                                                label="포스 결제금액"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox color="primary" checked={filterPosCount} onChange={doCheckDataFilter} name="filterPosCount" />}
                                                label="포스 거래건수"
                                            />
                                        </FormGroup>
                                        <FormGroup row>
                                            <FormControlLabel
                                                control={<Checkbox color="primary" checked={filterBank} onChange={doCheckDataFilter} name="filterBank" />}
                                                label="은행"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox color="primary" checked={filterBankAccount} onChange={doCheckDataFilter} name="filterBankAccount" />}
                                                label="계좌번호"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox color="primary" checked={filterBankOwner} onChange={doCheckDataFilter} name="filterBankOwner" />}
                                                label="계좌주"
                                            />
                                        </FormGroup>
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
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

                <Grid container justify="flex-end" style={{ position:'relative' }}>
                    <Grid item xs={12} style={{ textAlign:'right', padding: '10px 0px' }}>
                        <Button variant="contained" color="primary" onClick={ execExcelData.bind(this, startDate, endDate, hideZero) }>
                            <TableChartOutlinedIcon/>&nbsp;EXCEL
                        </Button>
                    </Grid>
                </Grid>
                <div>                
                    <Paper className={classes.root}>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">
                                        매장명
                                    </StyledTableCell>
                                    {
                                        filterCal &&
                                            <StyledTableCell align="center">
                                                정산금액
                                                {
                                                    sortType === 1 &&
                                                        <KeyboardArrowDownIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}/>
                                                }
                                                {
                                                    sortType !== 1 &&
                                                        <UnfoldMoreIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}
                                                            onClick={ () => doSetSortType(1) }/>
                                                }
                                            </StyledTableCell>
                                    }
                                    {
                                        filterTax &&
                                            <StyledTableCell align="center">
                                                수수료
                                                {
                                                    sortType === 2 &&
                                                        <KeyboardArrowDownIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}/>
                                                }
                                                {
                                                    sortType !== 2 &&
                                                        <UnfoldMoreIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}
                                                            onClick={ () => doSetSortType(2) }/>
                                                }
                                            </StyledTableCell>
                                    }
                                    {
                                        filterAmt &&
                                            <StyledTableCell align="center">
                                                결제금액
                                                {
                                                    sortType === 3 &&
                                                        <KeyboardArrowDownIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}/>
                                                }
                                                {
                                                    sortType !== 3 &&
                                                        <UnfoldMoreIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}
                                                            onClick={ () => doSetSortType(3) }/>
                                                }
                                            </StyledTableCell>
                                    }
                                    {
                                        filterDiscount &&
                                            <StyledTableCell align="center">
                                                본사할인
                                                {
                                                    sortType === 4 &&
                                                        <KeyboardArrowDownIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}/>
                                                }
                                                {
                                                    sortType !== 4 &&
                                                        <UnfoldMoreIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}
                                                            onClick={ () => doSetSortType(4) }/>
                                                }
                                            </StyledTableCell>
                                    }
                                    {
                                        filterStoreDiscount &&
                                            <StyledTableCell align="center">
                                                매장할인
                                                {
                                                    sortType === 5 &&
                                                        <KeyboardArrowDownIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}/>
                                                }
                                                {
                                                    sortType !== 5 &&
                                                        <UnfoldMoreIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}
                                                            onClick={ () => doSetSortType(5) }/>
                                                }
                                            </StyledTableCell>
                                    }
                                    {
                                        filterGroupDiscount &&
                                            <StyledTableCell align="center">
                                                그룹할인
                                                {
                                                    sortType === 6 &&
                                                        <KeyboardArrowDownIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}/>
                                                }
                                                {
                                                    sortType !== 6 &&
                                                        <UnfoldMoreIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}
                                                            onClick={ () => doSetSortType(6) }/>
                                                }
                                            </StyledTableCell>
                                    }
                                    <StyledTableCell align="center">
                                        쿠폰할인
                                    </StyledTableCell>
                                    {
                                        filterCount &&
                                            <StyledTableCell align="center">
                                                거래건수
                                                {
                                                    sortType === 7 &&
                                                        <KeyboardArrowDownIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}/>
                                                }
                                                {
                                                    sortType !== 7 &&
                                                        <UnfoldMoreIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}
                                                            onClick={ () => doSetSortType(7) }/>
                                                }
                                            </StyledTableCell>
                                    }
                                    {
                                        filterKioskPrice &&
                                            <StyledTableCell align="center">
                                                키오스크<br/>금액
                                                {
                                                    sortType === 8 &&
                                                        <KeyboardArrowDownIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}/>
                                                }
                                                {
                                                    sortType !== 8 &&
                                                        <UnfoldMoreIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}
                                                            onClick={ () => doSetSortType(8) }/>
                                                }
                                            </StyledTableCell>
                                    }
                                    {
                                        filterKioskCount &&
                                            <StyledTableCell align="center">
                                                키오스크<br/>거래건수
                                                {
                                                    sortType === 9 &&
                                                        <KeyboardArrowDownIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}/>
                                                }
                                                {
                                                    sortType !== 9 &&
                                                        <UnfoldMoreIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}
                                                            onClick={ () => doSetSortType(9) }/>
                                                }
                                            </StyledTableCell>
                                    }
                                    {
                                        filterPosPrice &&
                                            <StyledTableCell align="center">
                                                포스<br/>금액
                                                {
                                                    sortType === 10 &&
                                                        <KeyboardArrowDownIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}/>
                                                }
                                                {
                                                    sortType !== 10 &&
                                                        <UnfoldMoreIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}
                                                            onClick={ () => doSetSortType(10) }/>
                                                }
                                            </StyledTableCell>
                                    }
                                    {
                                        filterPosCount &&
                                            <StyledTableCell align="center">
                                                포스<br/>거래건수
                                                {
                                                    sortType === 11 &&
                                                        <KeyboardArrowDownIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}/>
                                                }
                                                {
                                                    sortType !== 11 &&
                                                        <UnfoldMoreIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}
                                                            onClick={ () => doSetSortType(11) }/>
                                                }
                                            </StyledTableCell>
                                    }
                                    {
                                        filterBank &&
                                            <StyledTableCell align="center">
                                                은행
                                            </StyledTableCell>
                                    }
                                    {
                                        filterBankAccount &&
                                            <StyledTableCell align="center">
                                                계좌번호
                                            </StyledTableCell>
                                    }
                                    {
                                        filterBankOwner &&
                                            <StyledTableCell align="center">
                                                계좌주
                                            </StyledTableCell>
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    calData.length > 0 &&
                                        <StyledTableRow key={ 0 }>
                                            <StyledTableCell align="left">
                                                <b style={{ fontSize:'14px' }}>총합</b>
                                            </StyledTableCell>
                                            {
                                                filterCal &&
                                                <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalCal).format('0,0') }</b></StyledTableCell>
                                            }
                                            {
                                                filterTax &&
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalTax).format('0,0') }</b></StyledTableCell>
                                            }
                                            {
                                                filterAmt &&
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalPrice).format('0,0') }</b></StyledTableCell>
                                            }
                                            {
                                                filterDiscount &&
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalDiscount).format('0,0') }</b></StyledTableCell>
                                            }
                                            {
                                                filterStoreDiscount &&
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalStoreDiscount).format('0,0') }</b></StyledTableCell>
                                            }
                                            {
                                                filterGroupDiscount &&
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalGroupDiscount).format('0,0') }</b></StyledTableCell>
                                            }
                                            <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalCouponDiscount).format('0,0') }</b></StyledTableCell>
                                            {
                                                filterCount &&
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalCnt).format('0,0') }</b></StyledTableCell>
                                            }
                                            {
                                                filterKioskPrice &&
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalPriceKiosk).format('0,0') }</b></StyledTableCell>
                                            }
                                            {
                                                filterKioskCount &&
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalCntKiosk).format('0,0') }</b></StyledTableCell>
                                            }
                                            {
                                                filterPosPrice &&
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalPricePos).format('0,0') }</b></StyledTableCell>
                                            }
                                            {
                                                filterPosCount &&
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalCntPos).format('0,0') }</b></StyledTableCell>
                                            }
                                            {
                                                filterBank &&
                                                    <StyledTableCell align="right"></StyledTableCell>
                                            }
                                            {
                                                filterBankAccount &&
                                                    <StyledTableCell align="right"></StyledTableCell>
                                            }
                                            {
                                                filterBankOwner &&
                                                    <StyledTableCell align="right"></StyledTableCell>
                                            }
                                        </StyledTableRow>
                                }
                                {
                                    calData.length === 0 &&
                                        <StyledTableRow key={ -1 }>
                                            <StyledTableCell colSpan="20" align="center">정보가 없습니다.</StyledTableCell>
                                        </StyledTableRow>
                                }
                                {
                                    calData.map((row, index) => (
                                        <StyledTableRow key={ index }>
                                            <StyledTableCell><Link to={ '/Store/' + row.store.id }>{ row.store.name }</Link></StyledTableCell>
                                            {
                                                filterCal &&
                                                    <StyledTableCell align="right">{ numeral(row.result.cal).format('0,0') }</StyledTableCell>
                                            }
                                            {
                                                filterTax &&
                                                    <StyledTableCell align="right">{ numeral(row.result.tax).format('0,0') }</StyledTableCell>
                                            }
                                            {/* <StyledTableCell align="right">{ numeral( (row.result.amt + row.result.discount) - row.result.cal ).format('0,0') }</StyledTableCell> */}
                                            {
                                                filterAmt &&
                                                    <StyledTableCell align="right">{ numeral(row.result.amt).format('0,0') }</StyledTableCell>
                                            }
                                            {
                                                filterDiscount &&
                                                    <StyledTableCell align="right">{ numeral(row.result.discount).format('0,0') }</StyledTableCell>
                                            }
                                            {
                                                filterStoreDiscount &&
                                                    <StyledTableCell align="right">{ numeral(row.result.storeDiscount).format('0,0') }</StyledTableCell>
                                            }
                                            {
                                                filterGroupDiscount &&
                                                    <StyledTableCell align="right">{ numeral(row.result.groupDiscount).format('0,0') }</StyledTableCell>
                                            }
                                                    <StyledTableCell align="right">{ numeral(row.result.couponDiscount).format('0,0') }</StyledTableCell>
                                            {
                                                filterCount &&
                                                    <StyledTableCell align="right">{ numeral(row.result.cnt).format('0,0') }</StyledTableCell>
                                            }
                                            {
                                                filterKioskCount &&
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(row.result.amtKiosk).format('0,0') }</b></StyledTableCell>
                                            }
                                            {
                                                filterKioskCount &&
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(row.result.cntKiosk).format('0,0') }</b></StyledTableCell>
                                            }
                                            {
                                                filterPosCount &&
                                                    <StyledTableCell align="right">{ numeral(row.result.amtPos).format('0,0') }</StyledTableCell>
                                            }
                                            {
                                                filterPosCount &&
                                                    <StyledTableCell align="right">{ numeral(row.result.cntPos).format('0,0') }</StyledTableCell>
                                            }
                                            {
                                                filterBank &&
                                                    <StyledTableCell align="left">{ row.store.bankName }</StyledTableCell>
                                            }
                                            {
                                                filterBankAccount &&
                                                    <StyledTableCell align="left">{ row.store.bankNumber }</StyledTableCell>
                                            }
                                            {
                                                filterBankOwner &&
                                                    <StyledTableCell align="left">{ row.store.bankOwner }</StyledTableCell>
                                            }
                                        </StyledTableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
            </Box>
    );
};

export default CalculatorAll;