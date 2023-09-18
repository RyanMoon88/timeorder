import React from 'react';
import { API_SERVER_URL, API_CAL_URL } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { Box, Typography, Grid, Paper, Button, Select, MenuItem } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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


function loadData(years) {
    // return new Promise((resolve, reject) => {
    //     axios({
    //         "url": API_CAL_URL + "/calDailyOrders?start=" + start.format("YYMMDDHHmmss") + "&end=" + end.format("YYMMDDHHmmss"),
    //         "method": "get"
    //     })
    //     .then(function (response) {
    //         resolve(response);
    //     })
    //     .catch((error) => {
    //         reject(error);
    //     });
    // });

    // let query = 'query {' + 
    //         'list:calAllYearOrders (yyyy:"' + years + '", type:"0") { store { id name } result { day cnt price discount storeDiscount tcash card amt cal } }' +
    //         '}';

    // return new Promise((resolve, reject) => {
    //     axios({
    //         "url": API_SERVER_URL,
    //         "method": "post",
    //         "data": {
    //             query
    //         }
    //     })
    //     .then(function (response) {
    //         resolve(response);
    //     })
    //     .catch((error) => {
    //         reject(error);
    //     });
    // });
};


function execExcelData(calDate) {
    let date = moment(calDate).format("YYMMDD");
    // let tableColumnString = tableColumn.toString();
    // let tableColumnNameString = tableColumnName.toString();

    // window.open(API_CAL_URL + "/execExcelDownload?status=LIST_CAL_ALL&column=" + tableColumnString + "&columnName=" + tableColumnNameString + "&startDate=" + start + "&endDate=" + end, '_blank');
}


const isNull = (value, base = '') => {
    if (value === null || value === undefined) {
        return base;
    }
    else {
        return value;
    }
}


const StatsMonthly = () => {
    const [login, setLogin] = useGlobalState('login');
    const [backdrop, setBackdrop] = useGlobalState('backdrop');
    const [errorDialog, setErrorDialog] = useGlobalState('errorDialog');
    const [errorMessage, setErrorMessage] = useGlobalState('errorMessage');
    
    const classes = useStyles();
    
    const [calData, setCalData] = React.useState([]);
    const [years, setYears] = React.useState(new Date().getFullYear());

    const [totalDiscount, setTotalDiscount] = React.useState(0);
    const [totalStoreDiscount, setTotalStoreDiscount] = React.useState(0);
    const [totalGroupDiscount, setGrouplDiscount] = React.useState(0);
    const [totalCnt, setTotalCnt] = React.useState(0);
    const [totalPrice, setTotalPrice] = React.useState(0);
    const [totalTax, setTotalTax] = React.useState(0);
    const [totalAmt, setTotalAmt] = React.useState(0);
    const [totalCal, setTotalCal] = React.useState(0);
    const [totalTcash, setTotalTcash] = React.useState(0);

    
    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        // setBackdrop(true);
        // loadData(years)
        // .then((response) => {
        //     setData(response);
        //     setBackdrop(false);
        // });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서


    function setData(response) {
        console.log("statsMonthly response", response);
        let calData = response.data.list
        
        let totalCal = 0;
        let totalTax = 0;
        let totalAmt = 0;
        let totalDiscount = 0;
        let totalStoreDiscount = 0;
        let totalCnt = 0;
        let totalTcash = 0;

        
        for (let i=0; i<calData.length; i++) {
            let totalEachCal = 0;
            
            for (let j=0; j<calData[i].result.length; j++) {
                totalEachCal += calData[i].result[j].cal;
                let tax = (calData[i].result[j].amt + calData[i].result[j].discount) - calData[i].result[j].cal;

                // totalCal += list[i].result[j].cal;
                totalTax += tax;
                totalAmt += calData[i].result[j].amt;
                totalDiscount += calData[i].result[j].discount;
                totalStoreDiscount += calData[i].result[j].storeDiscount;
                totalCnt += calData[i].result[j].cnt;
            }

            totalCal += totalEachCal;
        }

        setCalData(calData);

        setTotalCal(totalCal);
        setTotalTax(totalTax);
        setTotalAmt(totalAmt);
        setTotalDiscount(totalDiscount);
        setTotalStoreDiscount(totalStoreDiscount);
        setTotalCnt(totalCnt);
        setTotalTcash(totalTcash);
    }


    function clickSearch() {
        setBackdrop(true);
        setCalData([]);
        loadData(years)
        .then((response) => {
            setData(response);
        });
    }


    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography letiant="h6" noWrap>
                    월별 통계
                </Typography>
                
                <div className={classes.divRow}>
                    <Paper>
                        <Grid container>
                            <Grid item xs={6}>
                                <Grid container alignItems="center" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                                    <Grid item>
                                        <Select
                                            labelId="years"
                                            defaultValue={isNull(years)}
                                            labelWidth={75}
                                        >
                                            <MenuItem value="2019">2019</MenuItem>
                                            <MenuItem value="2020">2020</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid item style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                                        <Button letiant="contained" color="primary" onClick={clickSearch}>조회</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} style={{ textAlign:'right', padding: '18px 16px 16px' }}>
                                <Button letiant="contained" color="primary" onClick={ execExcelData.bind(this, years) }>
                                    <TableChartOutlinedIcon/>&nbsp;EXCEL
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </div>

                
                <div>                
                    <Paper className={classes.root}>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    {/* <StyledTableCell align="center">매장명</StyledTableCell> */}
                                    <StyledTableCell align="center">날짜</StyledTableCell>
                                    <StyledTableCell align="center">정산금액</StyledTableCell>
                                    <StyledTableCell align="center">수수료</StyledTableCell>
                                    <StyledTableCell align="center">총 결제금액</StyledTableCell>
                                    <StyledTableCell align="center">본사 할인</StyledTableCell>
                                    <StyledTableCell align="center">매장 할인</StyledTableCell>
                                    {/* <StyledTableCell align="center">그룹할인</StyledTableCell> */}
                                    <StyledTableCell align="center">거래건수</StyledTableCell>
                                    <StyledTableCell align="center">T-Cash 구매</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    calData.length > 0 &&
                                        <StyledTableRow key={ 0 }>
                                            <StyledTableCell align="left">
                                                <b style={{ fontSize:'14px' }}>총합</b>
                                            </StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalCal).format('0,0') }</b></StyledTableCell>
                                            <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalTax).format('0,0') }</b></StyledTableCell>
                                            <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalPrice).format('0,0') }</b></StyledTableCell>
                                            <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalDiscount).format('0,0') }</b></StyledTableCell>
                                            <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalStoreDiscount).format('0,0') }</b></StyledTableCell>
                                            {/* <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalGroupDiscount).format('0,0') }</b></StyledTableCell> */}
                                            <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalCnt).format('0,0') }</b></StyledTableCell>
                                            <StyledTableCell align="right"><b style={{ fontSize:'14px' }}>{ numeral(totalTcash).format('0,0') }</b></StyledTableCell>
                                        </StyledTableRow>
                                }
                                {
                                    calData.length === 0 &&
                                        <StyledTableRow key={ -1 }>
                                            <StyledTableCell colSpan="8" align="center">정보가 없습니다.</StyledTableCell>
                                        </StyledTableRow>
                                }
                                {
                                    calData.map((row, index) => (
                                        <StyledTableRow key={ index }>
                                            {/* <StyledTableCell>{ row.store.name }</StyledTableCell> */}
                                            <StyledTableCell>{ row.result.day }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(row.result.cal).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(row.result.tax).format('0,0') }</StyledTableCell>
                                            {/* <StyledTableCell align="right">{ numeral( (row.result.amt + row.result.discount) - row.result.cal ).format('0,0') }</StyledTableCell> */}
                                            <StyledTableCell align="right">{ numeral(row.result.amt).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(row.result.discount).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(row.result.storeDiscount).format('0,0') }</StyledTableCell>
                                            {/* <StyledTableCell align="right">{ numeral(row.result.groupDiscount).format('0,0') }</StyledTableCell> */}
                                            <StyledTableCell align="right">{ numeral(row.result.cnt).format('0,0') }</StyledTableCell>
                                            <StyledTableCell align="right">{ numeral(row.result.tcash).format('0,0') }</StyledTableCell>
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

export default StatsMonthly;