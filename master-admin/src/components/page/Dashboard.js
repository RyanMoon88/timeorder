import React from 'react';
import { API_CAL_URL,API_HOST } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import c3 from 'c3';
import 'c3/c3.css';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import { Box, Typography, Grid, Paper, Avatar, Divider, List, ListItem, TableContainer } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import PaymentIcon from '@material-ui/icons/Payment';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';


const useStyles = makeStyles(theme => ({
    dashboardRow: {
        marginBottom: theme.spacing(2)
    },

    paper: {
        padding: theme.spacing(2),
    },

    chart: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        textAlign: "center"
    },
    avatar: {
        width: 48,
        height: 48,
        background: '#454545'
    },
    
    table: {
        minWidth: 1024,
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



// 사용안함
// function loadDashboardDataOriginal() {
//     let today = new Date();
//     today.setHours(0);
//     today.setMinutes(0);
//     today.setSeconds(0);
//     today.setMilliseconds(0);

//     let q = 'query {' +
//         'todayOrders:orders(where: "{\\"device\\":\\"APP\\", \\"payMethod_not\\":\\"\\", \\"status_not\\":\\"10\\", \\"items_some\\":{\\"id_not\\":null}, \\"createdAt_gte\\": \\"' + today.toISOString() + '\\" }") { orders { id createdAt } }' +      // 오늘 신규 주문
//         'todayKiosks:orders(where: "{\\"device\\":\\"KIOSK\\", \\"payMethod_not\\":\\"\\", \\"status_not\\":\\"10\\", \\"items_some\\":{\\"id_not\\":null}, \\"createdAt_gte\\": \\"' + today.toISOString() + '\\" }") { orders { id createdAt } }' +      // 오늘 신규 주문
//         'todayUserOrders:orders( where: "{\\"user\\":{\\"createdAt_gte\\":\\"' + today.toISOString() + '\\"}, \\"payMethod_not\\":\\"\\", \\"status_not\\":\\"10\\", \\"items_some\\":{\\"id_not\\":null}, \\"createdAt_gte\\": \\"' + today.toISOString() + '\\" }") { orders { id createdAt } }' +      // 오늘 신규 주문
//         'todayUsers:users(where: "{ \\"createdAt_gte\\": \\"' + today.toISOString() + '\\" }") { users { id } }' +        // 오늘 신규 회원
//         'todayTcashes:tcashes(where: "{ \\"type\\":\\"TC00\\", \\"price_gt\\": 0, \\"tid_not\\": null, \\"createdAt_gte\\": \\"' + today.toISOString() + '\\" }") { tcashes { id } }' +        // 오늘 신규 회원
//         'todayInquiries:inquiries(where: "{ \\"status_not\\":\\"1\\", \\"createdAt_gte\\": \\"' + today.toISOString() + '\\" }") { inquiries { id user { name } title } }' +      // 오늘 신규 문의
//         'todayNotReplyInquiries:inquiries(where: "{ \\"reply\\":null, \\"status\\":\\"0\\", \\"createdAt_gte\\": \\"' + today.toISOString() + '\\" }") { inquiries { id user { name } title } }' +      // 오늘 신규 문의
//         'todayHeres:heres(where: "{ \\"createdAt_gte\\": \\"' + today.toISOString() + '\\" }") { heres { id } }' +        // 오늘 신규 여기도요
//         'inquiries:inquiries(where: "{\\"reply\\": null, \\"admin\\": null }" orderBy: "createdAt_DESC", first:5) { inquiries { id title createdAt updatedAt user { name } reply { id } } }' +        // 1:1문의 리스트
//         'heres:heres(orderBy: "createdAt_DESC", first:5) { heres { id title createdAt updatedAt user { name } } }' +        // 여기도요 리스트
//         'notices:notices(orderBy: "createdAt_DESC", first:5) { notices { id title contents createdAt updatedAt } }' +        // 공지사항 리스트
//     '}';


function getFormatDate(date){
    var year = date.getFullYear();              //yyyy
    var month = (1 + date.getMonth());          //M
    month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
    var day = date.getDate();                   //d
    day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
    return  year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
}

  
function loadDashboardData(type) {
    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    
    let startDateLT = new Date();
    let endDateLT = new Date();
    let createdStartDate = getFormatDate(startDateLT).substr(2) + '000000';
    let createdEndDate = getFormatDate(endDateLT).substr(2) + '999999';

    let apiUrl = "";
    if(type === "order"){
        return new Promise((resolve, reject) => {
            axios({
                "url": API_HOST + "/master/loadDashBoardTodayData",
                "method": "post",
                "params": {
                    type: "00",
                    storeId:'',
                    group:'',
                    startDate:createdStartDate,
                    endDate:createdEndDate,
                }
            })
            .then(function (response) {
                resolve(response);
            });
        });
    }

    if(type === "user"){
        return new Promise((resolve,reject) => {
            axios({
                "url": API_HOST + "/master/loadDashBoardTodayUser",
                "method": "post",
                "params": {
                    type: "00",
                    startDate:today.toISOString(),
                    endDate:today.toISOString(),
                }
            })
            .then(function (response) {
                resolve(response);
            });
        })
    }

    if(type === "inquiry"){
        return new Promise((resolve,reject) => {
            axios({
                "url": API_HOST + "/master/loadDashBoardTodayInquiry",
                "method": "post",
                "params": {
                    type: "00",
                    startDate:today.toISOString(),
                    endDate:today.toISOString(),
                    offset:0,
                    limit:5,
                }
            })
            .then(function (response) {
                resolve(response);
            });
        })
    }

    if(type === "here"){
        return new Promise((resolve,reject) => {
            axios({
                "url": API_HOST + "/master/loadDashBoardHere",
                "method": "post",
                "params": {
                    type: "00",
                    offset:0,
                    limit:5,
                }
            })
            .then(function (response) {
                resolve(response);
            });
        })
    }

    if(type === "notice"){
        return new Promise((resolve,reject) => {
            axios({
                "url": API_HOST + "/master/loadDashBoardNotice",
                "method": "post",
                "params": {
                    type: "00",
                    offset:0,
                    limit:5,
                }
            })
            .then(function (response) {
                resolve(response);
            });
        })
    }


    // let q = 'query {' +
    //     ((type === "todayOrders") ? 'todayOrders:orders(where: "{\\"device\\":\\"APP\\", \\"AND\\":[{\\"payMethod_not\\":\\"\\"},{\\"payMethod_not\\":\\"00\\"}], \\"status_not\\":\\"10\\", \\"items_some\\":{\\"id_not\\":null}, \\"createdAt_gte\\": \\"' + today.toISOString() + '\\" }") { orders { id createdAt } }' : '') +      // 오늘 신규 주문
    //     ((type === "todayKiosks") ? 'todayKiosks:orders(where: "{\\"device\\":\\"KIOSK\\", \\"payMethod_not\\":\\"\\", \\"status_not\\":\\"10\\", \\"items_some\\":{\\"id_not\\":null}, \\"createdAt_gte\\": \\"' + today.toISOString() + '\\" }") { orders { id createdAt } }' : '') +      // 오늘 신규 주문
    //     ((type === "todayUserOrders") ? 'todayUserOrders:orders( where: "{\\"user\\":{\\"createdAt_gte\\":\\"' + today.toISOString() + '\\"}, \\"payMethod_not\\":\\"\\", \\"status_not\\":\\"10\\", \\"items_some\\":{\\"id_not\\":null}, \\"createdAt_gte\\": \\"' + today.toISOString() + '\\" }") { orders { id createdAt } }' : '') +      // 오늘 신규 주문
    //     ((type === "todayUsers") ? 'todayUsers:users(where: "{ \\"createdAt_gte\\": \\"' + today.toISOString() + '\\" }") { users { id } }' : '') +        // 오늘 신규 회원
    //     ((type === "todayTcashes") ? 'todayTcashes:tcashes(where: "{ \\"type\\":\\"TC00\\", \\"price_gt\\": 0, \\"tid_not\\": null, \\"createdAt_gte\\": \\"' + today.toISOString() + '\\" }") { tcashes { id } }' : '') +        // 오늘 신규 회원
    //     ((type === "community") ? 'todayInquiries:inquiries(where: "{ \\"status_not\\":\\"1\\", \\"createdAt_gte\\": \\"' + today.toISOString() + '\\" }") { inquiries { id user { name } title } }' : '') +      // 오늘 신규 문의
    //     ((type === "community") ? 'todayNotReplyInquiries:inquiries(where: "{ \\"reply\\":null, \\"status\\":\\"0\\", \\"createdAt_gte\\": \\"' + today.toISOString() + '\\" }") { inquiries { id user { name } title } }' : '') +      // 오늘 신규 문의
    //     // ((type === "community") ? 'todayHeres:heres(where: "{ \\"createdAt_gte\\": \\"' + today.toISOString() + '\\" }") { heres { id } }' : '') +        // 오늘 신규 여기도요
    //     ((type === "community") ? 'inquiries:inquiries(where: "{\\"reply\\": null, \\"admin\\": null }" orderBy: "createdAt_DESC", first:5) { inquiries { id title createdAt updatedAt user { name } reply { id } } }' : '') +        // 1:1문의 리스트
    //     ((type === "community") ? 'heres:heres(orderBy: "createdAt_DESC", first:5) { heres { id title createdAt updatedAt user { name } } }' : '') +        // 여기도요 리스트
    //     ((type === "community") ? 'notices:notices(orderBy: "createdAt_DESC", first:5) { notices { id title contents createdAt updatedAt } }' : '') +        // 공지사항 리스트
    // '}';

   
};

function loadChartData() {
    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    
    let day7Before = new Date();
    day7Before.setHours(0);
    day7Before.setMinutes(0);
    day7Before.setSeconds(0);
    day7Before.setMilliseconds(0);
    day7Before.setDate(day7Before.getDate()-6);
    
    let day1OfMonth = new Date();
    day1OfMonth.setHours(0);
    day1OfMonth.setMinutes(0);
    day1OfMonth.setSeconds(0);
    day1OfMonth.setMilliseconds(0);
    day1OfMonth.setDate(1);


    // let q = 'query {' +
    //     'week:weeklyMain(yyyymmdd:"' + today.toISOString() + '") { date orderCount totalPrice totalPriceCard totalTcash totalLogin totalRegister totalInquiry totalHere }' +        // 일주일
    //     'month:monthlyMain(yyyymmdd:"' + today.toISOString() + '") { date orderCount totalPrice totalPriceCard totalTcash totalLogin totalRegister totalInquiry totalHere }' +        // 일주일
    //     'orders(where: "{\\"device\\":\\"APP\\", \\"payMethod_not\\":\\"\\", \\"status_not\\":\\"10\\", \\"items_some\\":{\\"id_not\\":null}, \\"authDate_not\\":null, \\"createdAt_gte\\": \\"' + day7Before.toISOString() + '\\" }") ' +
    //     ' { orders { id totalPrice authDate createdAt } }' +      // 오늘 신규 주문
    //     'kiosks:orders(where: "{\\"device\\":\\"KIOSK\\", \\"payMethod_not\\":\\"\\", \\"status_not\\":\\"10\\", \\"items_some\\":{\\"id_not\\":null}, \\"authDate_not\\":null, \\"createdAt_gte\\": \\"' + day7Before.toISOString() + '\\" }") ' +
    //     ' { orders { id totalPrice authDate createdAt } }' +      // 오늘 신규 주문
    // '}';

    return new Promise((resolve, reject) => {
        axios({
            "url": API_CAL_URL + "/master/getDashboard?today=" + today.toISOString() + "&day7Before=" + day7Before.toISOString() + "&day1OfMonth=" + day1OfMonth.toISOString(),
            "method": "post",
        })
        .then(function (response) {
            console.log("getDashBoard");
            resolve(response);
        });
    });
}


const Dashboard = () => {
    const history = useHistory();
    const [login, setLogin] = useGlobalState('login');
    const theme = useTheme();
    const classes = useStyles();

    // 상단 4개탭 변수
    const [todayNewOrder, setTodayNewOrder] = React.useState(0);
    const [todayNewOrderKiosk, setTodayNewOrderKiosk] = React.useState(0);
    const [todayNewUser, setTodayNewUser] = React.useState(0);
    const [todayNewUserAndOrder, setTodayNewUserAndOrder] = React.useState(0);
    const [todayNewTcash, setTodayNewTcash] = React.useState(0);
    const [todayNewInquiry, setTodayNewInquiry] = React.useState(0);
    const [todayNewInquiryNotReply, setTodayNewInquiryNotReply] = React.useState(0);
    
    // 중간 차트, 테이블 변수
    const [totalOrderCount, setTotalOrderCount] = React.useState(0);
    const [totalPrice, setTotalPrice] = React.useState(0);
    const [totalPriceCard, setTotalPriceCard] = React.useState(0);
    const [totalTcash, setTotalTcash] = React.useState(0);
    const [totalKiosk, setTotalKiosk] = React.useState(0);
    const [totalKioskCount, setTotalKioskCount] = React.useState(0);
    const [totalLogin, setTotalLogin] = React.useState(0);
    const [totalRegister, setTotalRegister] = React.useState(0);
    const [totalInquiry, setTotalInquiry] = React.useState(0);
    
    const [monthTotalOrderCount, setMonthTotalOrderCount] = React.useState(0);
    const [monthTotalPrice, setMonthTotalPrice] = React.useState(0);
    const [monthTotalPriceCard, setMonthTotalPriceCard] = React.useState(0);
    const [monthTotalTcash, setMonthTotalTcash] = React.useState(0);
    const [monthTotalKiosk, setMonthTotalKiosk] = React.useState(0);
    const [monthTotalKioskCount, setMonthTotalKioskCount] = React.useState(0);
    const [monthTotalLogin, setMonthTotalLogin] = React.useState(0);
    const [monthTotalRegister, setMonthTotalRegister] = React.useState(0);
    const [monthTotalInquiry, setMonthTotalInquiry] = React.useState(0);
    
    const [weekly, setWeekly] = React.useState([]);

    const [inquiries, setInquiries] = React.useState([]);
    const [heres, setHeres] = React.useState([]);
    const [notices, setNotices] = React.useState([]);

    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        console.log("LOAD");

        loadDashboardData("order").then((response) => {
            console.log("order");
            console.log(response);
            setTodayNewOrder(response.data.appCount);
            setTodayNewOrderKiosk(response.data.kioskCount);
            setTodayNewTcash(response.data.tcashCount);

            loadDashboardData("user").then((response2) => {
                setTodayNewUser(response2.data.noOrder.userCount);
                setTodayNewUserAndOrder(response2.data.toOrder.userCount);

                loadDashboardData("inquiry").then((response3) => {
                    setTodayNewInquiry(response3.data.inquiry.length);
                    setTodayNewInquiryNotReply(response3.data.notRelyInquiry.length);
                    setInquiries(response3.data.inquiryList);

                    loadDashboardData("here").then((response4) => {
                        setHeres(response4.data);

                        loadDashboardData("notice").then((response5) => {
                            setNotices(response5.data);
                        });
                    });
                });
            });
        });
        
        // loadDashboardData("todayOrders")
        // .then((response) => {
        //     console.log("todayOrders", response);
        //     let data = response.data.data;
        //     if (data.todayOrders && data.todayOrders.orders) {
        //         setTodayNewOrder(data.todayOrders.orders.length);
        //     }
        
        //     loadDashboardData("todayKiosks")
        //     .then((response) => {
        //         console.log("todayKiosks", response);
        //         let data = response.data.data;
        //         if (data.todayKiosks && data.todayKiosks.orders) {
        //             setTodayNewOrderKiosk(data.todayKiosks.orders.length);
        //         }

        //         loadDashboardData("todayUsers")
        //         .then((response) => {
        //             let data = response.data.data;
        //             setTodayNewUser(data.todayUsers.users.length);
                    
        //             loadDashboardData("todayUserOrders")
        //             .then((response) => {
        //                 console.log("todayUserOrders", response);
        //                 let data = response.data.data;
        //                 if (data.todayUserOrders && data.todayUserOrders.orders) {
        //                     setTodayNewUserAndOrder(data.todayUserOrders.orders.length);
        //                 }

        //                 loadDashboardData("todayTcashes")
        //                 .then((response) => {
        //                     let data = response.data.data;
        //                     setTodayNewTcash(data.todayTcashes.tcashes.length);
        //                 });
        //             });
        //         });
        //     });
        // });

        // loadDashboardData("community")
        // .then((response) => {
        //     console.log("dashboard response", response);
        //     let data = response.data.data;
        //     setTodayNewInquiry(data.todayNotReplyInquiries.inquiries.length);
        //     setTodayNewInquiryNotReply(data.todayInquiries.inquiries.length);
        //     setInquiries(data.inquiries.inquiries);
        //     setHeres(data.heres.heres);
        //     setNotices(data.notices.notices);
        // });

        loadChartData()
        .then((response) => {
            // 7일 금액 데이터
            console.log("chart response", response);
            let data = response.data;
            let week = data.week;
            let month = data.month;

            setWeekly(week);

            let arrSales = [];
            let arrOrders = [];
            let arrVisits = [];
            let arrX = [];
            let arrSalesKiosks = [];
            let arrKiosks = [];

            arrSales.push("앱 매출");
            arrOrders.push("앱 주문");
            arrVisits.push("방문");
            arrSalesKiosks.push("키오스크 매출");
            arrKiosks.push("키오스크 주문");

            let totalOrderCount = 0;
            let totalPrice = 0;
            let totalPriceCard = 0; // [20191120-여혁주]대쉬보드>카드결제액추가
            let totalTcash = 0;
            let totalKioskCount = 0;
            let totalKiosk = 0;
            let totalLogin = 0;
            let totalRegister = 0;
            let totalInquiry = 0;

            for (let i=0; i<week.length; i++) {
                totalOrderCount += week[i].orderCount;
                totalPrice += week[i].totalPrice;
                totalPriceCard += week[i].totalPriceCard;      // [20191120-여혁주]대쉬보드>카드결제액추가
                totalTcash += week[i].totalTcash;
                totalKioskCount += week[i].kioskCount;
                totalKiosk += week[i].totalPriceKiosk;
                totalLogin += week[i].totalLogin;
                totalRegister += week[i].totalRegister;
                totalInquiry += week[i].totalInquiry;
            }
            
            for (let i=week.length-1; i>=0; i--) {
                arrSales.push(week[i].totalPrice);
                arrOrders.push(week[i].orderCount);
                arrVisits.push(week[i].totalLogin);
                arrX.push(week[i].date);
                arrSalesKiosks.push(week[i].totalPriceKiosk);
                arrKiosks.push(week[i].kioskCount);
            }

            setTotalOrderCount(totalOrderCount);
            setTotalPrice(totalPrice);
            setTotalPriceCard(totalPriceCard);
            setTotalTcash(totalTcash);
            setTotalKioskCount(totalKioskCount);
            setTotalKiosk(totalKiosk);
            setTotalLogin(totalLogin);
            setTotalRegister(totalRegister);
            setTotalInquiry(totalInquiry);

            let monthTotalOrderCount = 0;
            let monthTotalPrice = 0;
            let monthTotalPriceCard = 0;    // [20191120-여혁주]대쉬보드>카드결제액추가
            let monthTotalTcash = 0;
            let monthTotalKioskCount = 0;
            let monthTotalKiosk = 0;
            let monthTotalLogin = 0;
            let monthTotalRegister = 0;
            let monthTotalInquiry = 0;

            for (let i=0; i<month.length; i++) {
                monthTotalOrderCount += month[i].orderCount;
                monthTotalPrice += month[i].totalPrice;
                monthTotalPriceCard += month[i].totalPriceCard; // [20191120-여혁주]대쉬보드>카드결제액추가
                monthTotalTcash += month[i].totalTcash;
                monthTotalKioskCount += month[i].kioskCount;
                monthTotalKiosk += month[i].totalPriceKiosk;
                monthTotalLogin += month[i].totalLogin;
                monthTotalRegister += month[i].totalRegister;
                monthTotalInquiry += month[i].totalInquiry;
            }

            setMonthTotalOrderCount(monthTotalOrderCount);
            setMonthTotalPrice(monthTotalPrice);
            setMonthTotalPriceCard(monthTotalPriceCard);
            setMonthTotalTcash(monthTotalTcash);
            setMonthTotalKioskCount(monthTotalKioskCount);
            setMonthTotalKiosk(monthTotalKiosk);
            setMonthTotalLogin(monthTotalLogin);
            setMonthTotalRegister(monthTotalRegister);
            setMonthTotalInquiry(monthTotalInquiry);

            // 차트 생성
            c3.generate({
                bindto: "#line-chart",
                size: { height: 250 },
                point: { r: 4 },
                color: { pattern: ["#ff5656", "#fd7c68", "#555555", "#4a68e6", "#68bafc" ] },
                axis: {
                    x: {
                        type: 'category',
                        categories: arrX
                    },
                    y2: {
                        show: true
                    }
                },
                data: {
                    columns: [
                        arrSales, arrOrders, arrVisits, arrSalesKiosks, arrKiosks
                    ],
                    axes: {
                        "앱 매출": 'y',
                        "앱 주문": 'y2',
                        "방문": 'y2',
                        "키오스크 매출": 'y',
                        "키오스크 주문": 'y2'
                    },
                    type: 'spline'
                },
                grid: { y: { show: !0 } },
                legend:  { show: true }
            });



            // 7일 평균 건수 데이터
            let orderList = data.orders;
            let orderListLength = orderList.length;
            let kioskList = data.kiosks;
            let kioskListLength = kioskList.length;

            let timeLabel =  ["00시","01시","02시","03시","04시","05시","06시","07시","08시","09시","10시","11시",
                            "12시","13시","14시","15시","16시","17시","18시","19시","20시","21시","22시","23시"]
            
            let timeData = {"00": 0, "01": 0, "02": 0, "03": 0, "04": 0, "05": 0,
                        "06": 0, "07": 0, "08": 0, "09": 0, "10": 0, "11": 0,
                        "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0,
                        "18": 0, "19": 0, "20": 0, "21": 0, "22": 0, "23": 0 };

            let timeDataKiosk = {"00": 0, "01": 0, "02": 0, "03": 0, "04": 0, "05": 0,
                        "06": 0, "07": 0, "08": 0, "09": 0, "10": 0, "11": 0,
                        "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0,
                        "18": 0, "19": 0, "20": 0, "21": 0, "22": 0, "23": 0 };

            let orderListGroupByTime = orderList.map(item => {
                let hour = item.authDate.substr(6, 2);
                item.authDate = hour;
                return item;
            })

            let orderListTotalPrice = 0;
            for (let i=0; i<orderListLength; i++) {
                orderListTotalPrice += orderList[i].totalPrice;
            }

            let kioskListTotalPrice = 0;
            for (let i=0; i<kioskListLength; i++) {
                kioskListTotalPrice += kioskList[i].totalPrice;
            }

            orderListGroupByTime = orderListGroupByTime.reduce((acc, item) => {
                return { ...acc, [item.authDate]: ( acc[item.authDate] || 0) + 1 }
            }, {})

            Object.keys(orderListGroupByTime).forEach((key) => {
                timeData[key] = orderListGroupByTime[key];
            })


            let kioskListGroupByTime = kioskList.map(item => {
                let hour = item.authDate.substr(6, 2);
                item.authDate = hour;
                return item;
            })

            kioskListGroupByTime = kioskListGroupByTime.reduce((acc, item) => {
                return { ...acc, [item.authDate]: ( acc[item.authDate] || 0) + 1 }
            }, {})

            Object.keys(kioskListGroupByTime).forEach((key) => {
                timeDataKiosk[key] = kioskListGroupByTime[key];
            })


            let timeDataChart = ['앱건수'];
            let timeDataChartKiosk = ['키오스크건수'];

            for (let j=0; j<24; j++) {
                let key = j;
                if (j < 10) {
                    key = "0" + j;
                }
                timeDataChart.push(Math.ceil(timeData[key] / 7) || 0);
                timeDataChartKiosk.push(Math.ceil(timeDataKiosk[key] / 7) || 0);
            }
            
            // 차트 생성
            c3.generate({
                bindto: "#bar-chart",
                size: { height: 250 },
                color: { pattern: ["#fd7c68", "#68bafc" ] },
                axis: {
                    x: {
                        type: "category",
                        categories: timeLabel
                    }
                },
                data: {
                    columns: [
                        timeDataChart,
                        timeDataChartKiosk
                    ],
                    type: 'bar'
                },
                grid: { y: { show: !0 } },
                legend:  { show: false }
            });

            // 차트 생성
            c3.generate({
                bindto: "#pie-chart",
                size: { height: 270 },
                color: { pattern: ["#ff5656", "#4a68e6" ] },
                data: {
                    columns: [
                        ['앱', orderListTotalPrice],
                        ['키오스크', kioskListTotalPrice]
                    ],
                    type: 'pie',
                    onclick: function (d, element) {
                        let device = "";
                        let week1Before = moment().add("d", -7).format('YYYYMMDD');
                        let today = moment().format('YYYYMMDD');

                        if (d.id === "앱") {
                            device = "app";
                        }
                        else {
                            device = "kiosk";
                        }

                        history.push("/OrderList/" + week1Before + "/" + today +"/" + device);
                    }
                },
                pie: {
                    label: {
                        format: function(value, ratio, id) {
                            return numeral(value).format('0,0') + "원";
                        }
                    }
                }
            });

            // 차트 생성
            c3.generate({
                bindto: "#pie-chart2",
                size: { height: 270 },
                color: { pattern: ["#fd7c68", "#68bafc" ] },
                data: {
                    columns: [
                        ['앱', orderListLength],
                        ['키오스크', kioskListLength]
                    ],
                    type: 'pie',
                    onclick: function (d, element) {
                        let device = "";
                        let week1Before = moment().add("d", -7).format('YYYYMMDD');
                        let today = moment().format('YYYYMMDD');

                        if (d.id === "앱") {
                            device = "app";
                        }
                        else {
                            device = "kiosk";
                        }

                        history.push("/OrderList/" + week1Before + "/" + today +"/" + device);
                    }
                },
                pie: {
                    label: {
                        format: function(value, ratio, id) {
                            return value + "건";
                        }
                    }
                }
            });
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서


    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" style={{ marginBottom: '16px'}}>
                    Dashboard
                </Typography>

                {/* 상단 */}
                <div className={classes.dashboardRow}>
                    <Typography variant="subtitle1" style={{ marginBottom: '16px'}}>
                        오늘 요약
                    </Typography>
                    <Grid container justify="center" spacing={2}>
                        <Grid item lg={3} md={6} sm={12} xs={12}>
                            <Link to={"/OrderList"} style={{ textDecoration:'none' }}>
                                <Paper className={classes.paper}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Avatar className={classes.avatar}><PaymentIcon/></Avatar>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle2">
                                                신규주문<br/><small>(앱/키오스크)</small>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography variant="h4" align="right">
                                                <small>{ numeral(todayNewOrder).format('0,0') }/{ numeral(todayNewOrderKiosk).format('0,0') }</small>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Link>
                        </Grid>
                        <Grid item lg={3} md={6} sm={12} xs={12}>
                            <Link to={"/UserList"} style={{ textDecoration:'none' }}>
                                <Paper className={classes.paper}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Avatar className={classes.avatar}><PermIdentityIcon/></Avatar>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle2">
                                                신규유저<br/><small>(가입주문/가입)</small>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography variant="h4" align="right">
                                                { todayNewUserAndOrder }<small>/{ todayNewUser }</small>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                                </Link>
                        </Grid>
                        <Grid item lg={3} md={6} sm={12} xs={12}>
                            <Link to={"/TcashList"} style={{ textDecoration:'none' }}>
                                <Paper className={classes.paper}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Avatar className={classes.avatar}>T</Avatar>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle2">
                                                Tcash 구매
                                            </Typography>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography variant="h4" align="right">
                                                { todayNewTcash }
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Link>
                        </Grid>
                        <Grid item lg={3} md={6} sm={12} xs={12}>
                            <Link to={"/InquiryList"} style={{ textDecoration:'none' }}>
                                <Paper className={classes.paper}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Avatar className={classes.avatar}>?</Avatar>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle2">
                                                문의<br/><small>(미답변/총문의)</small>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography variant="h4" align="right">
                                                { todayNewInquiryNotReply }<small>/{ todayNewInquiry }</small>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Link>
                        </Grid>
                    </Grid>                
                </div>
                
                {/* 중단 */}
                <div className={classes.dashboardRow}>
                    <Grid container justify="center" spacing={2}>
                        <Grid item md={6} sm={12} xs={12}>
                            <Paper className={classes.dashboardRow}>
                                <Typography variant="subtitle1" className={classes.paper}>매출현황</Typography>
                                <Divider />
                                <div className={classes.chart} style={{ overflowX:'auto' }}>
                                    {/* <Chart /> */}
                                    <div id="line-chart" style={{ minWidth:'560px' }}/>
                                </div>
                            </Paper>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <Paper>
                                <Typography variant="subtitle1" className={classes.paper}>시간대별 평균 현황 <small>(지난 7일간 수치 입니다)</small></Typography>
                                <Divider />
                                <div className={classes.chart} style={{ overflowX:'auto' }}>
                                    {/* <Chart /> */}
                                    <div id="bar-chart" style={{ minWidth:'680px', transform: 'scale(0.9)' }}/>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid container justify="center" spacing={2}>
                        <Grid item md={4} sm={12} xs={12}>
                            <Paper>
                                <Typography variant="subtitle1" className={classes.paper}>결제 비율 <small>(지난 7일간 수치 입니다)</small></Typography>
                                <Divider />
                                <div className={classes.chart}>
                                    <div id="pie-chart2"/>
                                    <div id="pie-chart"/>
                                </div>
                            </Paper>
                        </Grid>
                        <Grid item md={8} sm={12} xs={12} style={{ overflowX: 'auto' }}>
                            <Paper>
                                <Typography variant="subtitle1" className={classes.paper}>일자별 요약</Typography>
                                <TableContainer>
                                    <Table className={classes.table} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center" style={{ width:'120px' }}>일자</StyledTableCell>
                                                <StyledTableCell align="center">앱 주문수</StyledTableCell>
                                                <StyledTableCell align="center">앱 주문결제액</StyledTableCell>
                                                <StyledTableCell align="center">앱 카드결제액</StyledTableCell>
                                                <StyledTableCell align="center">Tcash 구매</StyledTableCell>
                                                <StyledTableCell align="center">키오스크<br/>주문수</StyledTableCell>
                                                <StyledTableCell align="center">키오스크<br/>결제액</StyledTableCell>
                                                <StyledTableCell align="center">방문자</StyledTableCell>
                                                <StyledTableCell align="center">가입</StyledTableCell>
                                                <StyledTableCell align="center">문의</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                weekly.map((row, index) => (
                                                    <StyledTableRow key={index}>
                                                        <StyledTableCell align="center">{ row.date }</StyledTableCell>
                                                        <StyledTableCell align="right">{ numeral(row.orderCount).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell align="right">{ numeral(row.totalPrice).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell align="right">{ numeral(row.totalPriceCard).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell align="right">{ numeral(row.totalTcash).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell align="right">{ numeral(row.kioskCount).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell align="right">{ numeral(row.totalPriceKiosk).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell align="right">{ numeral(row.totalLogin).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell align="right">{ numeral(row.totalRegister).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell align="right">{ numeral(row.totalInquiry).format('0,0') }</StyledTableCell>
                                                    </StyledTableRow>
                                                ))
                                            }
                                        </TableBody>
                                        <TableBody>
                                            <StyledTableRow>
                                                <StyledTableCell align="center"
                                                    style={{backgroundColor: theme.palette.primary.light, color: theme.palette.common.white, width:'120px' }}>
                                                        최근 7일 합계
                                                </StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(totalOrderCount).format('0,0') }</StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(totalPrice).format('0,0') }</StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(totalPriceCard).format('0,0') }</StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(totalTcash).format('0,0') }</StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(totalKioskCount).format('0,0') }</StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(totalKiosk).format('0,0') }</StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(totalLogin).format('0,0') }</StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(totalRegister).format('0,0') }</StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(totalInquiry).format('0,0') }</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell align="center"
                                                    style={{backgroundColor: theme.palette.primary.light, color: theme.palette.common.white, width:'120px' }}>
                                                        이번달 합계
                                                </StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(monthTotalOrderCount).format('0,0') }</StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(monthTotalPrice).format('0,0') }</StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(monthTotalPriceCard).format('0,0') }</StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(monthTotalTcash).format('0,0') }</StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(monthTotalKioskCount).format('0,0') }</StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(monthTotalKiosk).format('0,0') }</StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(monthTotalLogin).format('0,0') }</StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(monthTotalRegister).format('0,0') }</StyledTableCell>
                                                <StyledTableCell align="right">{ numeral(monthTotalInquiry).format('0,0') }</StyledTableCell>
                                            </StyledTableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
                
                {/* 하단 */}
                <div className={classes.dashboardRow}>
                    <Grid container justify="center" spacing={2}>
                        <Grid item lg={4} sm={12} xs={12}>
                            <Paper>
                                <Typography variant="subtitle1" className={classes.paper}>1:1 문의</Typography>
                                <Divider />
                                <List>
                                    {
                                        inquiries.map((row, index) => (
                                            <ListItem key={index}>
                                                <Grid container>
                                                    <Grid item xs>
                                                        <Typography variant="subtitle1"><Link to={ '/Inquiry' }>{ row.userInfo !== null ? row.userInfo.name : "" }</Link></Typography>
                                                        <Typography variant="subtitle2" style={{ color:'#777777' }}>{row.title}</Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography variant="subtitle2">{ moment(row.createdAt).format('YYYY-MM-DD') }</Typography>
                                                        <Typography variant="subtitle2" align="right" style={{ color:'#777777' }}>{ row.reply !== null ? "답변완료" : "답변대기" }</Typography>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                        ))
                                    }
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12}>
                            <Paper>
                                <Typography variant="subtitle1" className={classes.paper}>여기도요!</Typography>
                                <Divider />
                                <List>
                                    {
                                        heres.map((row, index) => (
                                            <ListItem key={index}>
                                                <Grid container>
                                                    <Grid item xs>
                                                        <Typography variant="subtitle1"><Link to={ '/Here' }>{ row.user !== null ? row.user.name : "" }</Link></Typography>
                                                        <Typography variant="subtitle2" style={{ color:'#777777' }}>{row.title}</Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography variant="subtitle2">{ moment(row.createdAt).format('YYYY-MM-DD') }</Typography>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                        ))
                                    }
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item lg={4} sm={12} xs={12}>
                            <Paper>
                                <Typography variant="subtitle1" className={classes.paper}>공지사항</Typography>
                                <Divider />
                                <List>
                                    {
                                        notices.map((row, index) => (
                                            <ListItem key={index}>
                                                <Grid container>
                                                    <Grid item xs>
                                                        <Typography variant="subtitle1">
                                                            <Link to={ '/NoticeList' }>{ row.title }</Link>
                                                            </Typography>
                                                        <Typography variant="subtitle2" style={{ color:'#777777' }}>{ row.contents.replace(/(<([^>]+)>)/ig,"").substring(0, 30) }</Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography variant="subtitle2">{ moment(row.createdAt).format('YYYY-MM-DD') }</Typography>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                        ))
                                    }
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </Box>
    );
};

export default Dashboard;