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
    return item.products.name;
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

function isShowDetail(row) {
    let items = row.items;
    if (items.length > 1) {
        return true;
    }
    else {
        return false;
    }
}

function getQty(row) {
    let tot = 0;
    let items = row.items;
    for (let i=0; i<items.length; i++) {
        tot += items[i].qty;
    }
    return tot;
}


function getOptionPrice(item) {
    let tot = 0;
    if (item.productOption.trim() !== "") {
        let productOption = JSON.parse(item.productOption);
        if (undefined === productOption.version) {
            // 이전 버전
            console.log(item);
            var options = JSON.parse(item.productOption);  

            let hasOP = false;
            if (productOption.options === undefined) {
                hasOP = true;
            }

            if (hasOP) {
                for (var key in options) {
                    if (key != "OP03") {      
                        if (key == "OP21") {
                            if (item.cup == 2) {
                                tot -= parseInt(options[key].price.split(",")[options[key].index]);
                            }
                        }
                        else if (key != "OP22") {
                            tot += parseInt(options[key].price.split(",")[options[key].index]);
                        }
                    }
                    else {
                        tot += parseInt(options[key].price * options[key].index);
                    }
                }
            }
            else {
                let options = productOption.options;
                for (let i=0; i<options.length; i++) {
                    tot += options[i].price;
                }
            }
        }
        else {
            let options = productOption.options;
            for (let i=0; i<options.length; i++) {
                tot += options[i].price;
            }
        }
    }
    return tot;
}

function getTax(row, fees) {    
    let items = row.items;
    let itemsLength = items.length;
    let totalDiscount = 0;
    
    for (let i=0; i<itemsLength; i++) {
        totalDiscount += items[i].discount * items[i].qty;
    }
    
    let pp = row.totalPrice + totalDiscount;      // 결제금액 + 본사할인
    let tt = Math.round(pp - (pp  * fees));                // 1차 정산
    let tax = pp - tt;                     // 수수료

    return tax;
}

function getCal(row, fees) {
    let items = row.items;
    let itemsLength = items.length;
    let totalDiscount = 0;
    
    for (let i=0; i<itemsLength; i++) {
        totalDiscount += items[i].discount * items[i].qty;
    }
    
    let pp = row.totalPrice + totalDiscount;      // 결제금액 + 본사할인
    let tt = Math.round(pp - (pp  * fees));                // 1차 정산
    let tax = pp - tt;                     // 수수료
    let cal = pp - tax;                    // 정산금액

    return cal;
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

function loadOrderData(storeId, start, end) {
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

    let q = 'query {' +
    ' stores (where: "{ \\"id\\" : \\"' + storeId + '\\"}") { totalCount stores { id name address addressDetail } } ' +
    ' orders (orderBy: "createdAt_DESC" where: "{\\"payMethod_not\\": \\"\\", \\"items_some\\": {\\"id_not\\": null}, \\"store\\": { \\"id\\" : \\"' + storeId + '\\"}, \\"createdAt_gte\\":\\"' + momentStartDate.format() + '\\", \\"createdAt_lte\\":\\"' + momentEndDate.format() + '\\"} ") { totalCount orders { id oid tid createdAt totalPrice user { id name } status payMethod authDate store { id name storeCategory } items { product { name } qty cup price discount storeDiscount groupDiscount productOption } } }' +
    '}'

    
    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/getOrderListByStoreId?storeId=" + storeId + "&startDate=" + (momentStartDate.format("YYMMDD") + "000000") + "&endDate=" + (momentEndDate.format("YYMMDD") + "000000"),
            "method": "post"
        })
        .then(function (response) {
            // console.log("API load ", response);
            resolve(response);
        });
    });

}


function execExcelData(store, startDate, endDate) {
    // console.log(store);
    let start = moment(startDate).format("YYMMDD") + "000000";
    let end = moment(endDate).add(1, 'day').format("YYMMDD") + "000000";

    window.open(API_CAL_URL + "/master/execExcelDownloadByPGL?status=LIST_CAL_STORE&storeId=" + store.id + "&startDate=" + start + "&endDate=" + end, '_blank');
}


const Calculator = () => {
    const [login, setLogin] = useGlobalState('login');
    const classes = useStyles();

    const [search, setSearch] = React.useState("");

    const [originStores, setOriginStores] = React.useState([]);
    const [stores, setStores] = React.useState([]);
    const [selectedStoreIndex, setSelectedStoreIndex] = React.useState(0);
    
    const [orders, setOrders] = React.useState([]);

    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());

    const [totalDiscount, setTotalDiscount] = React.useState(0);
    const [totalStoreDiscount, setStoreDiscount] = React.useState(0);
    const [totalGroupDiscount, setGrouplDiscount] = React.useState(0);
    const [totalPrice, setTotalPrice] = React.useState(0);
    const [totalCnt, setTotalCnt] = React.useState(0);
    const [totalTax, setTotalTax] = React.useState(0);
    const [totalCal, setTotalCal] = React.useState(0);
    const [totalPriceKiosk, setTotalPriceKiosk] = React.useState(0);
    const [totalCntKiosk, setTotalCntKiosk] = React.useState(0);
    const [totalCouponPrice,setTotalCouponPrice] = React.useState(0);
    const [fees, setFees] = React.useState(3.3);
    const [backdrop, setBackdrop] = useGlobalState('backdrop');

    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        setBackdrop(true);
        loadStoreData()
        .then((response) => {
            setStoreData(response);
            
            let data = response.data;
            let stores = data;

            loadOrderData(stores[0].id)
            .then((response) => {
                setOrderData(response);
                setBackdrop(false);
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

    function setCouponDiscount(row){
        let couponPrice = 0;
        for(let z=0; z<row['payment'].length; z++){
            if(row['payment'][z]['payMethod'] === "COUPON"){
                couponPrice += row['payment'][z]['price'];
            }
        }
        return couponPrice;
    }

    function setOrderData(response) {
        console.log("order response", response);
        let data = response.data;
        let orders = data.orders;
    
        setOrders(orders);

        let fees = (stores[selectedStoreIndex] && stores[selectedStoreIndex].fees ? stores[selectedStoreIndex].fees : 3.3) / 100;
        setFees(fees);
        
        let totalDiscount = 0;
        let totalStoreDiscount = 0;
        let totalGroupDiscount = 0;
        let totalPrice = 0;
        let totalCnt = 0;
        let totalTax = 0;
        let totalCal = 0;
        let totalPriceKiosk = 0;
        let totalCntKiosk = 0;
        let totalCouponPrice = 0;

        orders.forEach(item => {
            let payments = item.payment;
            let paymentsLength = payments.length;
            let items = item.items;
            let itemsLength = items.length;
            
            for(let i=0; i<paymentsLength; i++){
                if(payments[i]['payMethod'] === "COUPON"){
                    totalCouponPrice += payments[i]['price'];
                }
            }
            
            if (item.device === null || item.device === "APP") {
                if (item.status !== "10") {
                    for (let i=0; i<itemsLength; i++) {
                        totalDiscount += items[i].discount * items[i].qty;
                        totalStoreDiscount += items[i].storeDiscount * items[i].qty;
                        totalGroupDiscount += items[i].groupDiscount * items[i].qty;
                    }
                    
                    totalPrice += item.totalPrice;
                    totalTax += getTax(item, fees);
                    totalCal += getCal(item, fees);
                    totalCnt++;
                }
            }
            else if (item.device === "KIOSK") {
                if (item.status !== "10") {
                    totalPriceKiosk += item.totalPrice;
                    totalCntKiosk++;
                }
            }
            // console.log(item.userName, item.totalPrice, totalPrice);
        });
        
        
        setTotalDiscount(totalDiscount);
        setStoreDiscount(totalStoreDiscount);
        setGrouplDiscount(totalGroupDiscount);
        setTotalPrice(totalPrice);
        setTotalCnt(totalCnt);
        setTotalTax(totalTax);
        setTotalCal(totalCal);
        setTotalPriceKiosk(totalPriceKiosk);
        setTotalCouponPrice(totalCouponPrice);
        setTotalCntKiosk(totalCntKiosk);
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
        setBackdrop(true);
        loadOrderData(stores[selectedStoreIndex].id, startDate, endDate)
        .then((response) => {
            setOrderData(response);
            setBackdrop(false);
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
                                            <Box flexShrink={1}>
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
                                                            />
                                                        </Grid>
                                                        <Grid item style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                                                            <Button variant="contained" color="primary" onClick={clickSearch}>조회</Button>
                                                        </Grid>
                                                    </Grid>
                                                </MuiPickersUtilsProvider>
                                            </Box>
                                            <Box flexGrow={1}>
                                                <Box display="flex" mb={1}>
                                                    <Box flexShrink={1} style={{ width:'100px' }}><b>앱</b></Box>
                                                    <Box flexShrink={1} style={{ width:'100px' }}><b>주문건</b>: { numeral(totalCnt).format('0,0') }건</Box>
                                                    <Box flexGrow={1}><b>결제금액</b>: { numeral(totalPrice).format('0,0') }원</Box>
                                                </Box>
                                                <Box display="flex">
                                                    <Box flexShrink={1} style={{ width:'100px' }}><b>키오스크</b></Box>
                                                    <Box flexShrink={1} style={{ width:'100px' }}><b>주문건</b>: { numeral(totalCntKiosk).format('0,0') }건</Box>
                                                    <Box flexGrow={1}><b>결제금액</b>: { numeral(totalPriceKiosk).format('0,0') }원</Box>
                                                </Box>
                                            </Box>
                                            <Box flexShrink={1} style={{ padding: '0px 16px' }}>
                                                <Button variant="contained" color="primary" onClick={ execExcelData.bind(this, stores[selectedStoreIndex], startDate, endDate) }>
                                                    <TableChartOutlinedIcon/>&nbsp;EXCEL
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Table className={classes.table} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center" style={{ width:'135px' }}>주문번호<br/>결제시간</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'100px' }}>주문기기<br/>주문자</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'60px' }}>상태</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'60px' }}>결제방법</StyledTableCell>
                                            <StyledTableCell align="center">상품명</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'60px' }}>수량</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'60px' }}>본사 할인</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'60px' }}>매장 할인</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'60px' }}>그룹 할인</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'100px' }}>금액</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'60px' }}>쿠폰 할인</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'100px' }}>결제금액</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'80px' }}>수수료</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'100px' }}>정산금</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            orders.length > 0 &&
                                                <StyledTableRow>
                                                    <StyledTableCell align="left" colSpan={6}>
                                                        <b style={{ fontSize:'14px' }}>총합</b> <small>(주문 거절 및 키오스크 제외)</small>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalDiscount).format('0,0') }</b></StyledTableCell>
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalStoreDiscount).format('0,0') }</b></StyledTableCell>
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalGroupDiscount).format('0,0') }</b></StyledTableCell>
                                                    <StyledTableCell align="right"></StyledTableCell>
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalCouponPrice).format('0,0') }</b></StyledTableCell>
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalPrice).format('0,0') }</b></StyledTableCell>
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalTax).format('0,0') }</b></StyledTableCell>
                                                    <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalCal).format('0,0') }</b></StyledTableCell>
                                                </StyledTableRow>
                                        }
                                        {
                                            orders.length === 0 &&
                                                <StyledTableRow>
                                                    <StyledTableCell align="center" colSpan={14}>
                                                        주문 내용이 없습니다
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                        }
                                        {
                                            orders.map((row, index) => (
                                                <>
                                                    <StyledTableRow key={ row.id }>
                                                        <StyledTableCell rowSpan={row.items.length} component="th" scope="row" align="center"><small>{ row.oid }<br/>{ moment(row.authDate, "YYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss") }</small></StyledTableCell>
                                                        <StyledTableCell rowSpan={row.items.length}>
                                                            { row.device }<br/>
                                                            {
                                                                (typeof row.user === "object" && row.user !== null) && 
                                                                    <Link to={ "/User/" + row.user.id }>{ row.user.name }</Link>
                                                            }
                                                            {
                                                                (typeof row.user === "object" && row.user === null) && 
                                                                    row.buyerName
                                                            }
                                                            {
                                                                (typeof row.user === "string") && 
                                                                    <Link to={ "/User/" + row.userId }>{ row.userName }</Link>
                                                            }
                                                        </StyledTableCell>
                                                        <StyledTableCell rowSpan={row.items.length} align="center">{ setStatus(row.status) }</StyledTableCell>
                                                        <StyledTableCell rowSpan={row.items.length} align="center">{ row.payMethod }</StyledTableCell>
                                                        <StyledTableCell>
                                                            { setProductName(row.items[0]) }<br/>
                                                            { setProductOption(row.items[0]) }
                                                        </StyledTableCell>
                                                        <StyledTableCell align="center">{  row.items.length > 0 && row.items[0].qty }</StyledTableCell>
                                                        <StyledTableCell align="right">{ row.items.length > 0 && numeral(row.items[0].discount * row.items[0].qty).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell align="right">{ row.items.length > 0 && numeral(row.items[0].storeDiscount * row.items[0].qty).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell align="right">{ row.items.length > 0 && numeral(row.items[0].groupDiscount * row.items[0].qty).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell align="right">{ row.items.length > 0 && numeral((row.items[0].price + getOptionPrice(row.items[0])) * row.items[0].qty).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell rowSpan={row.items.length} align="right">{ numeral(setCouponDiscount(row)).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell rowSpan={row.items.length} align="right">{ numeral(row.totalPrice).format('0,0') }</StyledTableCell>
                                                        {/* <StyledTableCell align="right">{ numeral( ((row.items[0].price + getOptionPrice(row.items[0])) - (row.items[0].discount + row.items[0].storeDiscount + row.items[0].groupDiscount)) * row.items[0].qty ).format('0,0') }</StyledTableCell> */}
                                                        <StyledTableCell rowSpan={row.items.length} align="right">
                                                            {
                                                                (row.device === null || row.device === "APP") &&
                                                                    numeral(getTax(row, fees)).format('0,0')
                                                            }
                                                            {
                                                                row.device === "KIOSK" &&
                                                                    "-"
                                                            }
                                                        </StyledTableCell>
                                                        <StyledTableCell rowSpan={row.items.length} align="right">
                                                            {
                                                                (row.device === null || row.device === "APP") &&
                                                                    numeral(getCal(row, fees)).format('0,0')
                                                            }
                                                            {
                                                                row.device === "KIOSK" &&
                                                                    "-"
                                                            }
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                    {
                                                        row.items.length > 1 &&                                                        
                                                            row.items.map((item, index) => (
                                                                index > 0 &&
                                                                    <StyledTableRow key={ item.id }>
                                                                        <StyledTableCell>
                                                                            { setProductName(item) }<br/>
                                                                            { setProductOption(item) }
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="center">{ item.qty }</StyledTableCell>
                                                                        <StyledTableCell align="right">{ numeral(item.discount * item.qty).format('0,0') }</StyledTableCell>
                                                                        <StyledTableCell align="right">{ numeral(item.storeDiscount * item.qty).format('0,0') }</StyledTableCell>
                                                                        <StyledTableCell align="right">{ numeral(item.groupDiscount * item.qty).format('0,0') }</StyledTableCell>
                                                                        <StyledTableCell align="right">{ numeral((item.price + getOptionPrice(item)) * item.qty).format('0,0') }</StyledTableCell>
                                                                    </StyledTableRow>
                                                            ))
                                                    }
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