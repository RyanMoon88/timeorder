import React from 'react';
import { API_CAL_URL, API_HOST } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Button, TextField } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined';

import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
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

    table: {
        minWidth: 700,
    },

    cellSearch: {
        background: '#ffffff',
        padding: '0px'
    },
    cellSelected: {
        background: '#f9dad5',
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
        padding: 12
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);


function setStatus(status) {
    switch (status) {
        case "00":
            return "결제 완료";
        case "01":
            return "주문 접수";
        case "02":
            return "제조중";
        case "03":
            return "제조 완료";
        case "04":
            return "제공 완료";
        case "10":
            return "주문 거절";
        default:
            return "-";
    }
}


// 깊은 복사
function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}


function setProductName(item) {
    if (undefined === item || null === item || undefined === item.productName) {
        return "아이템 없음";
    }
    return item.productName;
}

function setProductOption(item) {
    let result = "";
    if (undefined !== item && null !== item && undefined !== item.productOption && null !== item.productOption) {
        if (item.productOption.trim() !== "") {
            let productOption = JSON.parse(item.productOption);
            if (undefined === productOption.version) {        
                for (var key in productOption) {
                    if (key !== "OP03") {
                        // console.log(key, productOption[key].value);
                        try {
                            var val = productOption[key].value.split(",");
                            
                            if (!(key === "OP01" && val[productOption[key].index] === "NONE") && !(key === "OP02" && val[productOption[key].index] === "ONE")) {
                                // 사이즈 ONE에 대해선 표기 안함
            
                                var valName = val[productOption[key].index] + "/";
                                if (key === "OP05" && val[productOption[key].index] === "0") {
                                    valName = "시럽X" + "/";
                                }
                                
                                if (!(key === "OP21" && item.cup !== 2) && key !== "OP22") {
                                    result += valName;
                                }
                                    
                                if (key !== "OP21" && key !== "OP22") {
                                    // optionPrice += parseInt(productOption[key].price.split(",")[productOption[key].index]);
                                }
                            }
                        }
                        catch (e) {

                        }
                    }
                    else {
                        if (productOption[key].index > 0) {
                            var val = "샷" + productOption[key].index + "개" + "/";
                            result += val;
                            // optionPrice += parseInt(productOption[key].price * productOption[key].index);
                        }
                    }
                }
            }
            else {
                let options = productOption.options;
                for (let i=0; i<options.length; i++) {
                    if (options[i].group) {
                        result += options[i].group + ":" + options[i].value + "/";
                    }
                    else {
                        result += options[i].name + ":" + options[i].value + "/";
                    }
                }
            }

            result = result.substr(0, result.length - 1);
        }
    }
    return result;
}

function loadStoreData() {
    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadAllStore",
            "method": "post",
        })
        .then(function (response) {
            resolve(response);
        });
    });
}

function loadData(storeId, startDate, endDate) {
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
            "url": API_CAL_URL + "/master/calDailyOrdersByStoreId?start=" + start.format("YYMMDDHHmmss") + "&end=" + end.format("YYMMDDHHmmss") + "&storeId=" + storeId,
            "method": "get"
        })
        .then(function (response) {
            resolve(response);
        })
        .catch((error) => {
            reject(error);
        });
    });
}


function execExcelData(startDate, endDate, store) {
    let start = moment(startDate).format("YYMMDD") + "000000";
    let end = moment(endDate).add(1, 'day').format("YYMMDD") + "000000";

    window.open(API_CAL_URL + "/master/execExcelDownloadByPGL?status=LIST_CAL_ALL_STORE&startDate=" + start + "&endDate=" + end + "&storeId=" + store.id, '_blank');
}


const Calculator = () => {
    const [login, setLogin] = useGlobalState('login');
    const classes = useStyles();

    const [search, setSearch] = React.useState("");

    const [originStores, setOriginStores] = React.useState([]);
    const [stores, setStores] = React.useState([]);
    const [selectedStoreIndex, setSelectedStoreIndex] = React.useState(0);
    
    const [calData, setCalData] = React.useState([]);

    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());
    const [sortType, setSortType] = React.useState(-1);

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
        filterCouponDiscount: true,
    });
    const { hideZero, filterCal, filterTax, filterAmt, filterDiscount, filterStoreDiscount, filterGroupDiscount, filterCount,
        filterKioskPrice, filterKioskCount, filterPosPrice, filterPosCount, filterBank, filterBankAccount, filterBankOwner, filterCouponDiscount } = dataFilter;

    const [totalDiscount, setTotalDiscount] = React.useState(0);
    const [totalStoreDiscount, setStoreDiscount] = React.useState(0);
    const [totalGroupDiscount, setGrouplDiscount] = React.useState(0);
    const [totalPrice, setTotalPrice] = React.useState(0);
    const [totalCnt, setTotalCnt] = React.useState(0);
    const [totalTax, setTotalTax] = React.useState(0);
    const [totalCal, setTotalCal] = React.useState(0);
    const [totalPriceKiosk, setTotalPriceKiosk] = React.useState(0);
    const [totalCntKiosk, setTotalCntKiosk] = React.useState(0);
    const [totalPricePos, setTotalPricePos] = React.useState(0);
    const [totalCntPos, setTotalCntPos] = React.useState(0);
    const [totalCouponDiscount,setTotalCouponDiscount] = React.useState(0);


    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        loadStoreData()
        .then((response) => {
            setStoreData(response);
            
            let data = response.data;
            let stores = data;

            loadData(stores[0].id)
            .then((response) => {
                setData(response);
            });
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서


    function setStoreData(response) {
        console.log("store response", response);
        let data = response.data;
        let stores = data;
    
        setOriginStores(stores);
        setStores(stores);
    }

    function setData(response) {
        console.log("order response", response);

        setCalData(response.data);
        let data = response.data;
        let dataLength = response.data.length;
        
        let totalDiscount = 0;
        let totalStoreDiscount = 0;
        let totalGroupDiscount = 0;
        let totalPrice = 0;
        let totalCnt = 0;
        let totalTax = 0;
        let totalCal = 0;
        let totalPriceKiosk = 0;
        let totalCntKiosk = 0;
        let totalPricePos = 0;
        let totalCntPos = 0;
        let totalCouponDiscount = 0;

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
        setTotalPrice(totalPrice);
        setTotalCnt(totalCnt);
        setTotalTax(totalTax);
        setTotalCal(totalCal);
        setTotalPriceKiosk(totalPriceKiosk);
        setTotalCntKiosk(totalCntKiosk);
        setTotalPricePos(totalPricePos);
        setTotalCntPos(totalCntPos);
        setTotalCouponDiscount(totalCouponDiscount);
    }


    function doSelectStoreIndex(index) {
        setSelectedStoreIndex(index);
    }

    function changeStartDate(date) {
        setStartDate(date);
    }

    function changeEndDate(date) {
        setEndDate(date);
    }


    function clickSearch() {
        loadData(stores[selectedStoreIndex].id, startDate, endDate)
        .then((response) => {
            setData(response);
        });
    }

    function filterStores(value) {
        let stores = cloneObject(originStores);

        stores = stores.filter((item) => {
            return item.name.toLowerCase().indexOf(value) > -1 || item.code.toLowerCase().indexOf(value) > -1;
        })

        setSearch(value);
        setStores(stores);
    }

    function doSetSortType(value) {
        setSortType(value);

        calData.sort((a, b) => {
            if (value === 0) {
                return a.date < b.date ? -1 : 1;
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
                    정산관리 매장별
                </Typography>
                <div className={classes.divRow}>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <Paper className={classes.root}>
                                <Table aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center" style={{ width:'100px' }}>매장코드</StyledTableCell>
                                            <StyledTableCell align="center">매장명</StyledTableCell>
                                        </TableRow>
                                        <TableRow>
                                            <StyledTableCell colSpan={2} align="center" className={classes.cellSearch}>
                                                <TextField defaultValue={ search }  style={{ background:'#ffffff', width:'100%', padding:'5px' }}
                                                    placeholder="매장명 or 코드 검색"
                                                    onKeyUp={ (event) => { filterStores(event.target.value) } } />
                                            </StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            stores.map((row, i) => (
                                                <StyledTableRow key={ row.id } onClick={doSelectStoreIndex.bind(this, i)}>
                                                    <StyledTableCell className={selectedStoreIndex === i ? classes.cellSelected : ""}>{ row.code }</StyledTableCell>
                                                    <StyledTableCell className={selectedStoreIndex === i ? classes.cellSelected : ""}>{ row.name }</StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Grid>
                        <Grid item xs={10}>
                            <Paper className={classes.root}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Box display="flex" alignItems="center">
                                            <Box flexGrow={1}>
                                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                                    <Grid container alignItems="center" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                                                        <Grid item>
                                                            <DatePicker
                                                                variant="inline"
                                                                margin="normal"
                                                                id="start-date-picker-dialog"
                                                                label="시작일"
                                                                format="YYYY/MM/DD"
                                                                value={startDate}
                                                                onChange={changeStartDate}
                                                            />
                                                        </Grid>
                                                        <Grid item style={{ paddingLeft: '16px', paddingRight: '16px' }}>~</Grid>
                                                        <Grid item>
                                                            <DatePicker
                                                                variant="inline"
                                                                margin="normal"
                                                                id="end-date-picker-dialog"
                                                                label="종료일"
                                                                format="YYYY/MM/DD"
                                                                value={endDate}
                                                                onChange={changeEndDate}
                                                            />
                                                        </Grid>
                                                        <Grid item style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                                                            <Button variant="contained" color="primary" onClick={clickSearch}>조회</Button>
                                                        </Grid>
                                                    </Grid>
                                                </MuiPickersUtilsProvider>
                                            </Box>
                                            <Box pr={2}>
                                                <Button variant="contained" color="primary" onClick={ execExcelData.bind(this, startDate, endDate, stores[selectedStoreIndex]) }>
                                                    <TableChartOutlinedIcon/>&nbsp;EXCEL
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Table className={classes.table} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">
                                                날짜
                                                {
                                                    sortType === 0 &&
                                                        <KeyboardArrowDownIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}/>
                                                }
                                                {
                                                    sortType !== 0 &&
                                                        <UnfoldMoreIcon
                                                            style={{ position:'absolute', top:'50%', right:'0', transform:'translateY(-50%)', cursor:'pointer' }}
                                                            onClick={ () => doSetSortType(0) }/>
                                                }
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
                                            {
                                                filterCouponDiscount &&
                                                <StyledTableCell align="center">
                                                    쿠폰할인
                                                </StyledTableCell>
                                            }
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
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            calData.length > 0 &&
                                                <StyledTableRow>
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
                                                    {
                                                        filterCouponDiscount &&
                                                        <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalCouponDiscount).format('0,0') }</b></StyledTableCell>
                                                    }
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
                                                <StyledTableRow>
                                                    <StyledTableCell align="center" colSpan={14}>
                                                        주문 내용이 없습니다
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                        }
                                        {
                                            calData.map((row, index) => (
                                                <>
                                                    <StyledTableRow key={ row.id }>
                                                        <StyledTableCell><Typography variant="subtitle2" color="primary">{ moment(row.date, "YYMMDDHHmmss").format("YYYY-MM-DD") }</Typography></StyledTableCell>
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
                                                        {
                                                            filterCouponDiscount &&
                                                            <StyledTableCell align="right">{ numeral(row.result.couponDiscount).format('0,0') }</StyledTableCell>
                                                        }
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
                                                </>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </Box>
    );
};

export default Calculator;