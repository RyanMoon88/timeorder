import React from 'react';
import { API_SERVER_URL, API_CAL_URL } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Paper, InputBase, Tabs, Tab, Container, Select, MenuItem, Button } from '@material-ui/core';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CssBaseline from "@material-ui/core/CssBaseline";
import Pagination from "material-ui-flat-pagination";

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined';

import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
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

const dialogStyles = theme => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
});


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


// 다이얼로그 스타일 시작
const DialogTitle = withStyles(dialogStyles)(props => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});
  
const DialogContent = withStyles(theme => ({
    root: {
      padding: theme.spacing(2),
    },
}))(MuiDialogContent);
  
const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);
// 다이얼로그 스타일 끝


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


function setStatus(status) {
    switch (status) {
        case "00":
            return "결제 완료";
        case "01":
            return "주문 접수";
        case "02":
            return "제조중";
        case "03":
            return "호출중";
        case "04":
            return "제공 완료";
        case "10":
            return "주문 거절";
        case "50":
            return "후결제 결제 완료";
        case "51":
            return "후결제 주문 접수";
        case "52":
            return "후결제 제조중";
        case "53":
            return "후결제 제조 완료";
        case "54":
            return "후결제 제공 완료";
        default:
            return "-";
    }
}


const tableColumn = ["oid", "tid", "store.name", "user.name", "status", "payMethod", "totalPrice", "authDate"];
const tableColumnName = ["주문번호", "결제번호", "가맹점이름", "사용자이름", "상태", "결제방법", "결제금액", "결제일"];


function loadData(search = "", listRow = 10, listCount = 10, start, end, deviceTab, statusTab) {
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


    let device = [];
    let status = [];

    for (let key in deviceTab) {
        if (deviceTab[key]) {
            device.push('\\"' + key.toUpperCase() + '\\"');
        }
    }

    let strDeviceNull = "";
    if (device.includes('\\"APP\\"')) {
        strDeviceNull = '{\\"device\\":null},';
    }

    for (let key in statusTab) {
        if (statusTab[key]) {
            status.push('\\"' + key.replace("status", "") + '\\"');
        }
    }


    let q = 'query { ' +
    ' orders (orderBy:"createdAt_DESC", skip:' + listRow + ', first:' + listCount + ' where: "{\\"OR\\":[' + strDeviceNull + '{\\"device_in\\": [' + device + ']}], \\"status_in\\": [' + status + '], \\"payMethod_not\\": \\"\\", \\"items_some\\":{\\"id_not\\":null}, \\"authDate_gte\\":\\"' + momentStartDate.format("YYMMDDHHmmss") + '\\", \\"authDate_lte\\":\\"' + momentEndDate.format("YYMMDDHHmmss") + '\\", \\"store\\": { \\"name_contains\\":\\"' + search + '\\"} }") ' +
    '{ totalCount orders { id tid oid createdAt totalPrice authDate device store { id name storeCategory } user { id name orders { id } } buyerName items { id product { name } price discount storeDiscount groupDiscount qty cup productOption } status payMethod extraInfo totalPrice memoReject statusHistories { from to createdAt } payments { id payMethod price coupon { id } promotion { id name rewardPrice } } } } }'

    return new Promise((resolve, reject) => {
        axios({
            "url": API_SERVER_URL,
            "method": "post",
            "data": {
                query: q
            }
        })
        .then(function (response) {
            resolve(response);
        });
    });
};


function setProductName(row) {
    let items = row.items;
    if (items.length > 1) {
        return items[0].product.name + " 외 " + (items.length - 1) + "건";
    }
    else {
        return items[0].product.name;
    }
}

function setProductOption(item) {
    let result = "";
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

function setQty(row) {
    let tot = 0;
    let items = row.items;
    for (let i=0; i<items.length; i++) {
        tot += items[i].qty;
    }
    return tot;
}

function setPrice(row) {
    let tot = 0;
    let items = row.items;
    for (let i=0; i<items.length; i++) {
        let t = items[i].price + getOptionPrice(items[i]);
        tot += t * items[i].qty;
    }
    return tot;
}

function setDiscount(row) {
    let tot = 0;
    let items = row.items;
    for (let i=0; i<items.length; i++) {
        tot += items[i].discount * items[i].qty;
    }
    return tot;
}

function setStoreDiscount(row) {
    let tot = 0;
    let items = row.items;
    for (let i=0; i<items.length; i++) {
        tot += items[i].storeDiscount * items[i].qty;
    }
    return tot;
}

function setGroupDiscount(row) {
    let tot = 0;
    let items = row.items;
    for (let i=0; i<items.length; i++) {
        tot += items[i].groupDiscount * items[i].qty;
    }
    return tot;
}

function setAmount(row) {
    let tot = 0;
    let items = row.items;
    for (let i=0; i<items.length; i++) {
        tot += items[i].price;
        tot += getOptionPrice(items[i]);
        tot -= items[i].discount;
        tot -= items[i].storeDiscount;
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


function execExcelData(startDate, endDate) {
    let start = moment(startDate).format("YYMMDD") + "000000";
    let end = moment(endDate).add(1, 'day').format("YYMMDD") + "000000";
    let tableColumnString = tableColumn.toString();
    let tableColumnNameString = tableColumnName.toString();

    window.open(API_CAL_URL + "/master/execExcelDownloadByPGL?status=LIST_ORDER&column=" + tableColumnString + "&columnName=" + tableColumnNameString + "&startDate=" + start + "&endDate=" + end, '_blank');
}


const OrderList = ({ match }) => {
    const [login, setLogin] = useGlobalState('login');
    const classes = useStyles();

    const [updated, setUpdated] = React.useState(true);
    const [search, setSearch] = React.useState("");
    const [deviceTabValue, setDeviceTabValue] = React.useState({
        app: false,
        kiosk: false,
        pos: false,
        tablet: false,
        qr: false
    });
    const [statusTabValue, setStatusTabValue] = React.useState({
        status00: true,
        status01: true,
        status03: true,
        status04: true,
        status10: true,
        status50: true,
        status51: true,
        status54: true,
    });
    const [tabValue, setTabValue] = React.useState(0);

    const [openDetailDialog, setOpenDetailDialog] = React.useState(false);

    const [orders, setOrders] = React.useState([]);
    const [items, setItems] = React.useState([]);
    // const [totalOrders, setTotalOrders] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [listCount, setListCount] = React.useState(10);
    const [pageCount, setPageCount] = React.useState(10);
    const [totalPage, setTotalPage] = React.useState(10);

    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());

    const { app, kiosk, pos, tablet, qr } = deviceTabValue;
    const { status00, status01, status03, status04, status10, status50, status51, status54 } = statusTabValue;

    
    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        let deviceObj = {
            app: true,
            kiosk: true,
            pos:true,
            tablet: true,
            qr: true
        };

        console.log(match.params);
        if (match.params.startDate) {
            setStartDate(moment(match.params.startDate, "YYYYMMDD").toDate());
        }
        if (match.params.endDate) {
            setEndDate(moment(match.params.endDate, "YYYYMMDD").toDate());
        }
        if (match.params.device) {
            deviceObj = {
                app: false,
                kiosk: false,
                pos:false,
                tablet: false,
                qr: false
            };
            for (let key in deviceObj) {
                if (match.params.device.indexOf(key) > -1) {
                    deviceObj[key] = true;
                }
            }
            setDeviceTabValue(deviceObj);
        }
        else {            
            setDeviceTabValue(deviceObj);
        }
        
        loadData(search, page * listCount, listCount, startDate, endDate, deviceObj, statusTabValue)
        .then((response) => {
            setData(response);
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    function setData(response) {
        console.log("OrderList response", response);
        let data = response.data.data;
    
        let totalCount = data.orders.totalCount;
        let orders = data.orders.orders;
    
        setOrders(orders);
        // setTotalOrders(totalCount);

        let totalPgaePlus = (totalCount % listCount) > 0 ? 1 : 0;
        let totalPage = parseInt(totalCount / listCount) + totalPgaePlus;
        setTotalPage(totalPage);
    }

    // 탭 선택시 검색
    function doCheckDeviceTabs(event) {
        setDeviceTabValue({ ...deviceTabValue, [event.target.name]: event.target.checked });
    }
    function doCheckStatusTabs(event) {
        setStatusTabValue({ ...statusTabValue, [event.target.name]: event.target.checked });
    }
    
    // 검색창 Enter 검색
    function doSearch(event) {
        if (event.keyCode === 13) {
            let text = event.target.value.trim();
            setSearch(text);
            setPage(0);
                        
            loadData(text, 0, listCount, startDate, endDate, deviceTabValue, statusTabValue)
            .then((response) => {
                setData(response);
            });
        }
    }

    function clickSearch() {
        let start = moment(startDate)
        let end = moment(endDate)
        
        if (Math.abs(start.diff(end, 'days')) > 60) {
            alert("60일 이상 검색은 불가능합니다");
            return false;
        }

        let text = document.getElementById('search').value;
        setSearch(text);
        setPage(0);

        loadData(text, 0, listCount, startDate, endDate, deviceTabValue, statusTabValue)
        .then((response) => {
            setData(response);
        });
    }

    function clickPagination(offset) {
        setPage(offset);
        
        loadData(search, offset * listCount, listCount, startDate, endDate, deviceTabValue, statusTabValue)
        .then((response) => {
            setData(response);
        });
    }
    
    function changeListCount(event) {
        setListCount(event.target.value);

        loadData(search, page * (event.target.value), (event.target.value), startDate, endDate, deviceTabValue, statusTabValue)
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

    function doOpenDetailDialog(row) {
        setOpenDetailDialog(true);
        setItems(row.items);
    }

    function doCloseDetailDialog() {
        setOpenDetailDialog(false);
    }

    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap style={{ marginBottom: '16px'}}>
                    주문 목록
                </Typography>

                <div className={classes.divRow}>
                    <Paper>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <Grid container alignItems="center" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                                <Grid item>
                                    <DatePicker
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
                        <Grid container>
                            <Grid item style={{ padding: '10px 16px 0px' }}>
                                <i>※ <b>주문기기</b>의 <b>TABLET</b>과 <b>상태</b>의 <b>후결제</b>는 트립오더 관련 상태값입니다.</i>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item style={{ paddingTop:'16px', paddingLeft: '16px', paddingRight: '16px' }}>
                                <Box display="flex">
                                    <Box flexShrink={1} mr={6}>
                                        <FormControl required component="fieldset" className={classes.formControl}>
                                            <FormLabel component="legend">주문기기</FormLabel>
                                            <FormGroup row>
                                                <FormControlLabel
                                                    control={<Checkbox color="primary" checked={app} onChange={doCheckDeviceTabs} name="app" />}
                                                    label="APP"
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox color="primary" checked={kiosk} onChange={doCheckDeviceTabs} name="kiosk" />}
                                                    label="KIOSK"
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox color="primary" checked={pos} onChange={doCheckDeviceTabs} name="pos" />}
                                                    label="POS"
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox color="primary" checked={tablet} onChange={doCheckDeviceTabs} name="tablet" />}
                                                    label="TABLET"
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox color="primary" checked={qr} onChange={doCheckDeviceTabs} name="qr" />}
                                                    label="QR"
                                                />
                                            </FormGroup>
                                        </FormControl>
                                    </Box>
                                    <Box flexShrink={1}>
                                        <FormControl required component="fieldset" className={classes.formControl}>
                                            <FormLabel component="legend">상태</FormLabel>
                                            <FormGroup row style={{ marginBottom: '-10px'}}>
                                                <FormControlLabel
                                                    control={<Checkbox color="primary" checked={status00} onChange={doCheckStatusTabs} name="status00" />}
                                                    label="결제 완료"
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox color="primary" checked={status01} onChange={doCheckStatusTabs} name="status01" />}
                                                    label="주문 접수"
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox color="primary" checked={status03} onChange={doCheckStatusTabs} name="status03" />}
                                                    label="호출중"
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox color="primary" checked={status04} onChange={doCheckStatusTabs} name="status04" />}
                                                    label="제공 완료"
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox color="primary" checked={status10} onChange={doCheckStatusTabs} name="status10" />}
                                                    label="주문 거절"
                                                />
                                            </FormGroup>
                                            <FormGroup row>
                                                <FormControlLabel
                                                    control={<Checkbox color="primary" checked={status50} onChange={doCheckStatusTabs} name="status50" />}
                                                    label="후결제 - 결제 완료"
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox color="primary" checked={status51} onChange={doCheckStatusTabs} name="status51" />}
                                                    label="후결제 - 주문 접수"
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox color="primary" checked={status54} onChange={doCheckStatusTabs} name="status54" />}
                                                    label="후결제 - 제공 완료"
                                                />
                                            </FormGroup>
                                        </FormControl>
                                    </Box>
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
                                    placeholder="매장명으로 검색이 가능합니다."
                                    inputProps={{ 'aria-label': 'naked' }}
                                    style={{ width:'100%' }}
                                    onKeyUp={ doSearch }/>
                            </Grid>
                        </Grid>
                        {/* <Tabs
                            value={tabValue}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={ clickTabs }>
                            <Tab label="전체"/>
                            <Tab label="결제완료"/>
                            <Tab label="주문접수"/>
                            <Tab label="제공완료"/>
                            <Tab label="주문거절"/>
                        </Tabs> */}
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
                                    <MenuItem value={1000}>1000</MenuItem>
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
                                    <StyledTableCell align="center" style={{ width:'150px' }}>주문번호<br/>주문일</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width:'100px' }}>주문기기<br/>주문자</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width:'80px' }}>총<br/>주문수</StyledTableCell>
                                    <StyledTableCell align="center">매장</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width:'70px' }}>상태</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width:'250px' }}>상품명</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width:'75px' }}>수량</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width:'100px' }}>상품가</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width:'100px' }}>본사 할인</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width:'100px' }}>매장 할인</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width:'100px' }}>그룹 할인</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width:'100px' }}>결제방법<br/>결제금액</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width:'120px' }}>메모</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width:'120px' }}>거절<br/>사유</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    orders.length === 0 &&
                                        <StyledTableRow key={ 0 }>
                                            <StyledTableCell align="center" colSpan={14}>
                                                주문 내용이 없습니다
                                            </StyledTableCell>
                                        </StyledTableRow>
                                }
                                {
                                    orders.map(row => (
                                        <StyledTableRow key={ row.id }>
                                            <StyledTableCell component="th" scope="row" align="center"><small>{ row.oid }</small><br/>{ moment(row.authDate, "YYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss") }</StyledTableCell>
                                            <StyledTableCell>
                                                <div>{ row.device }</div>
                                                {
                                                    row.user !== null && 
                                                        <Link to={ "/User/" + row.user.id }>{ row.user.name }</Link>
                                                }
                                                {
                                                    row.user === null && 
                                                        row.buyerName
                                                }
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                {
                                                    row.user !== null && 
                                                        row.user.orders.length
                                                }
                                                {
                                                    row.user === null && 
                                                        "-"
                                                }
                                            </StyledTableCell>
                                            <StyledTableCell><Link to={ "/Store/" + row.store.id }>{ row.store.name }</Link></StyledTableCell>
                                            <StyledTableCell align="center">{ setStatus(row.status) }</StyledTableCell>
                                            <StyledTableCell>
                                                { setProductName(row) }<br/>
                                                { setProductOption(row.items[0]) }
                                                { isShowDetail(row) && (
                                                    <div style={{ color: '#e2422a', cursor:'pointer' }} onClick={doOpenDetailDialog.bind(this, row)}>
                                                        자세히보기
                                                    </div>
                                                )}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(setQty(row)).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(setPrice(row)).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(setDiscount(row)).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(setStoreDiscount(row)).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(setGroupDiscount(row)).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="right">{ row.payMethod }<br/>{ numeral(row.totalPrice).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="center">{ row.memo }</StyledTableCell>
                                            <StyledTableCell align="center">{ row.memoRject }</StyledTableCell>
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

                
                <Dialog onClose={doCloseDetailDialog} aria-labelledby="group-dialog-title" open={openDetailDialog} fullWidth maxWidth="md">
                    <DialogTitle onClose={doCloseDetailDialog}>주문 상세</DialogTitle>
                    <DialogContent dividers style={{padding:'0px'}}>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <Table className={classes.table} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">상품명</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'80px' }}>수량</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'100px' }}>판매가</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'100px' }}>할인가</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'120px' }}>매장할인가</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'120px' }}>매출</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            items.map(row => (
                                                <StyledTableRow key={ row.id }>
                                                    <StyledTableCell align="left">
                                                        { row.product.name }<br/>
                                                        { setProductOption(row) }
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(row.qty).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(row.price + getOptionPrice(row)).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(row.discount).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(row.storeDiscount).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(row.price + getOptionPrice(row) - (row.discount + row.storeDiscount)).format('0,0') }</StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Box>
    );
};

export default OrderList;