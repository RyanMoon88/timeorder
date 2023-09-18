import React from 'react';
import { API_SERVER_URL, API_HOST } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Box, Paper, Grid, Typography, Tabs, Tab, TextField, Button, CssBaseline, Container } from '@material-ui/core';
import SimpleReactLightbox from 'simple-react-lightbox'
import { SRLWrapper } from "simple-react-lightbox";

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pagination from "material-ui-flat-pagination";

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import { ContentState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';



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
    
    button: {
        padding: '10px 10px',
    },

    width100: {
        width: '100%'
    },

    width75: {
        width: '75%'
    },

    width50: {
        width: '50%'
    },

    root: {
        width: '100%',
        overflowX: 'auto',
    },

    relative: {
        position: 'relative'
    },

    iosSwitch: {
        position: 'absolute',
        top: 0,
        right: 0
    },

    chip: {
        marginTop: '6px',
        marginRight: '6px'
    }
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


/**
 * 상품 다이얼로그
 */

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


function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}


// 깊은 복사
function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

const isNull = (value) => {
    if (value === null || value === undefined) {
        return '';
    }
    else {
        return value;
    }
}

function diffObjectString(source, target) {
    let keys = Object.keys(source);
    let result = "";

    for (let key of keys) {
        let bef = (typeof source[key] === "string" || typeof source[key] === "number") ? source[key] : "";
        let aft = (typeof target[key] === "string" || typeof target[key] === "number") ? target[key] : "";
        if (bef !== aft) {
            result += " " + key + ": " + bef + "에서 " + aft + "로 변경,";
        }
    }

    if (result.length > 0) {
        if (result.charAt(result.length - 1) === ",") {
            result = result.substr(0, result.length - 1);
        }
    }
    
    console.log("diffObjectString", result);

    return result;
}


// function loadData(id, listCount = 15) {
//     let q = 'query {' +
//         'users (where: "{ \\"id\\": \\"' + id + '\\" }") { totalCount users { id name sns email birth sex phone images memo mobileOs agreeMarketing groupDiscountCode createdAt orders { id oid payMethod items { oid price } } logs { id type ip createdAt } inquiries { id } heres { id } } }' +
//         'orders (where:"{ \\"user\\": {\\"id\\": \\"' + id + '\\"}, \\"payMethod_not\\": \\"\\", \\"items_some\\": {\\"id_not\\": null} }" skip:0, first:' + listCount + ' orderBy:"createdAt_DESC") { totalCount orders { id tid oid createdAt totalPrice authDate store { id name storeCategory } user { id name } items { id product { name } price discount storeDiscount qty productOption } status payMethod extraInfo statusHistories { from to createdAt } } }' +
//         'tcashes (where:"{ \\"user\\": {\\"id\\": \\"' + id + '\\"}, \\"OR\\": [ {\\"type\\":\\"TC01\\"}, {\\"AND\\":[ {\\"type\\":\\"TC00\\"},{\\"payMethod_not\\":\\"00\\"} ] } ] }" skip:0, first:' + listCount + ' orderBy:"createdAt_DESC") { totalCount tcashes { id createdAt type payMethod price tcash memo order { store { name } items { product { name } } } } }' +
//         'inquiries (where:"{ \\"user\\": {\\"id\\": \\"' + id + '\\"} }" skip:0, first:' + listCount + ' orderBy:"createdAt_DESC") { totalCount inquiries { id createdAt title contents user { name } reply { id title contents } } }' +
//         'heres (where:"{ \\"user\\": {\\"id\\": \\"' + id + '\\"} }" skip:0, first:' + listCount + ' orderBy:"createdAt_DESC") { totalCount heres { id createdAt title contents status } } ' +
//         'totalOrders:orders (where:"{ \\"user\\": {\\"id\\": \\"' + id + '\\"}, \\"payMethod_not\\": \\"\\", \\"items_some\\": {\\"id_not\\": null} }" orderBy:"createdAt_DESC") { totalCount orders { id totalPrice status payMethod } }' +
//         'totalTcashes:tcashes (where:"{ \\"user\\": {\\"id\\": \\"' + id + '\\"}, \\"OR\\": [ {\\"type\\":\\"TC01\\"}, {\\"AND\\":[ {\\"type\\":\\"TC00\\"},{\\"payMethod_not\\":\\"00\\"} ] } ] }" orderBy:"createdAt_DESC") { totalCount tcashes { id type payMethod price tcash } }' +
//     '}'

//     return new Promise((resolve, reject) => {
//         axios({
//             "url": API_SERVER_URL,
//             "method": "post",
//             "data": {
//                 query: q
//             }
//         })
//         .then(function (response) {
//             resolve(response);
//         });
//     });
// };

// function loadOrdersData(id, page = 0, listCount = 15) {
//     let skip = page * listCount;
//     let q = 'query {' +
//         'orders (where:"{ \\"user\\": {\\"id\\": \\"' + id + '\\"}, \\"payMethod_not\\": \\"\\", \\"items_some\\": {\\"id_not\\": null} }" skip:' + skip + ', first:' + listCount + ' orderBy:"createdAt_DESC") { totalCount orders { id tid oid createdAt totalPrice authDate store { id name storeCategory } user { id name } items { id product { name } price discount storeDiscount qty productOption } status payMethod extraInfo totalPrice statusHistories { from to createdAt } } }' +
//     '}'

//     return new Promise((resolve, reject) => {
//         axios({
//             "url": API_SERVER_URL,
//             "method": "post",
//             "data": {
//                 query: q
//             }
//         })
//         .then(function (response) {
//             resolve(response);
//         });
//     });
// }

// function loadTcashesData(id, page = 0, listCount = 15) {
//     let skip = page * listCount;
//     let q = 'query {' +
//     'tcashes (where:"{ \\"user\\": {\\"id\\": \\"' + id + '\\"}, \\"OR\\": [ {\\"type\\":\\"TC01\\"}, {\\"AND\\":[ {\\"type\\":\\"TC00\\"},{\\"payMethod_not\\":\\"00\\"} ] } ] }" skip:' + skip + ', first:' + listCount + ' orderBy:"createdAt_DESC") { totalCount tcashes { id createdAt type payMethod price tcash memo order { store { name } items { product { name } } } } }' +
//     '}'

//     return new Promise((resolve, reject) => {
//         axios({
//             "url": API_SERVER_URL,
//             "method": "post",
//             "data": {
//                 query: q
//             }
//         })
//         .then(function (response) {
//             resolve(response);
//         });
//     });
// }

// function loadInqsData(id, page = 0, listCount = 15) {
//     let skip = page * listCount;
//     let q = 'query {' +
//     'inquiries (where:"{ \\"user\\": {\\"id\\": \\"' + id + '\\"} }" skip:' + skip + ', first:' + listCount + ' orderBy:"createdAt_DESC") { totalCount inquiries { id createdAt title contents user { name } reply { id title contents } } }' +
//     '}'

//     return new Promise((resolve, reject) => {
//         axios({
//             "url": API_SERVER_URL,
//             "method": "post",
//             "data": {
//                 query: q
//             }
//         })
//         .then(function (response) {
//             resolve(response);
//         });
//     });
// }

// function loadHeresData(id, page = 0, listCount = 15) {
//     let skip = page * listCount;
//     let q = 'query {' +
//     'heres (where:"{ \\"user\\": {\\"id\\": \\"' + id + '\\"} }" skip:' + skip + ', first:' + listCount + ' orderBy:"createdAt_DESC") { totalCount heres { id createdAt title contents status } } ' +
//     '}'

//     return new Promise((resolve, reject) => {
//         axios({
//             "url": API_SERVER_URL,
//             "method": "post",
//             "data": {
//                 query: q
//             }
//         })
//         .then(function (response) {
//             resolve(response);
//         });
//     });
// }


function loadData(id) {
    let user = null;
    let orders = [];
    let tcashes = [];
    let inquiries = [];
    let heres = [];

    return new Promise((resolve, reject) => {
        loadUserData(id)
        .then((response) => {
            user = response.data.user;
            
            loadOrdersData(id)
            .then((response) => {
                orders = response.data;

                loadTcashesData(id)
                .then((response) => {
                    tcashes = response.data;

                    loadInqsData(id)
                    .then((response) => {
                        inquiries = response.data;

                        loadHeresData(id)
                        .then((response) => {
                            heres = response.data;
                            
                            let result = {
                                user,
                                orders,
                                tcashes,
                                inquiries,
                                heres
                            };

                            console.log("loadData result ", result);
                            resolve(result);
                        });
                    });
                });
            });
        });
    });
};

function loadUserData(id) {
    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/getUser?id=" + id,
            "method": "post",
        })
        .then(function (response) {
            resolve(response);
        });
    });
};

function loadOrdersData(id, page = 0, listCount = 15) {
    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/getOrderListByUserId?id=" + id + "&start=" + (page * listCount) + "&size=" + listCount,
            "method": "post",
        })
        .then(function (response) {
            resolve(response);
        });
    });
}

function loadTcashesData(id, page = 0, listCount = 15) {
    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/getTcashListByUserId?id=" + id + "&start=" + (page * listCount) + "&size=" + listCount,
            "method": "post",
        })
        .then(function (response) {
            resolve(response);
        });
    });
}

function loadInqsData(id, page = 0, listCount = 15) {
    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/getInquiryListByUserId?id=" + id + "&start=" + (page * listCount) + "&size=" + listCount,
            "method": "post",
        })
        .then(function (response) {
            resolve(response);
        });
    });
}

function loadHeresData(id, page = 0, listCount = 15) {
    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/getHereListByUserId?id=" + id + "&start=" + (page * listCount) + "&size=" + listCount,
            "method": "post",
        })
        .then(function (response) {
            resolve(response);
        });
    });
}

function saveData(originUser, user) {
    let now = moment().format("YYYYMMDDHHmmss");
    var q = 'mutation { updateUser (id: "' + user.id + '", email: "' + user.email + '", name: "' + user.name + '", phone: "' + isNull(user.phone) + '", memo: "' + isNull(user.memo) + '", ' + 
            'groupDiscountCode: "' + isNull(user.groupDiscountCode) + '", lastUpdateGroupDiscountCode: "' + now + '") { id name email phone images memo } }';

    let userParam = {
        id:user.id,
        email:user.email,
        password:user.password,
        type:user.type,
        sns:user.sns,
        snsId:user.snsId,
        name:user.name,
        phone:isNull(user.phone),
        images:user.images,
        memo:isNull(user.memo),
        point:user.point,
        userPoint:user.userPoint,
        pushToken:user.pushToken,
        mobileOs:user.mobileOs,
        sex:user.sex,
        birth:user.birth,
        isCertificated:user.isCertificated,
        certificatedDate:user.certificatedDate,
        agreeMarketing:user.agreeMarketing,
        agreeOrder:user.agreeOrder,
        agreeTimequiz:user.agreeTimequiz,
        lastUpdatePassword:user.lastUpdatePassword,
        recommCode:user.recommCode,
        groupDiscountCode: isNull(user.groupDiscountCode),
        lastUpdateGroupDiscountCode:now,
        userGroupLevels:user.userGroupLevels,
        wpayUserKey:user.wpayUserKey,
        wpaySignature:user.wpaySignature,
        niceBillingPwd:user.niceBillingPwd,
    }
    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/updateUser",
            "method": "post",
            "data": userParam
        })
        .then(function (response) {
            let diffContents = diffObjectString(originUser, user);
            
            if (diffContents !== "") {
                let logParam = {
                    type:"USER1",
                    adminId:"cjv6z5pjs0aay0734ge2kfk00",
                    target:user.id,
                    content: "content:[사용자 수정]" +  diffContents,
                }
                axios({
                    "url": API_HOST + "/master/insertLog",
                    "method": "post",
                    "data": logParam
                })
                .then(function (response) {
                    resolve(response);
                });
            }

            resolve(response);
        });
    });
}


// 주문 관련 시작
function setOrderStatus(status) {
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

function setProductName(row) {
    let items = row.items;
    if (items.length > 1) {
        return items[0]['products']['name'] + " 외 " + (items.length - 1) + "건";
    }
    else {
        return items[0]['products']['name'];
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
// 주문 관련 끝


// TCash 티캐시 관련 시작
function setTcashStatus(item) {
    let status = "";
    if (item.type === "TC00" && item.payMethod === "CHARGE") {
        status = "충전";
    }
    else if (item.type === "TC00" && item.payMethod === "COUPON") {
        status = "쿠폰\n충전";
    }
    else if (item.type === "TC00" && item.payMethod === "REFUND") {
        status = "환불";
    }
    else if (item.type === "TC00" && item.payMethod === "CARD") {
        status = "카드";
    }
    else if (item.type === "TC01") {
        status = "사용";
    }
    else if (item.type === "TC10" || item.payMethod === "CANCEL") {
        status = "구매\n취소";
    }
    return status;
}
// TCash 티캐시 관련 끝


// 여기도요 관련 시작
function setHereStatus(status) {
    switch(status) {
        case "1":
            return "진행중";
        case "2":
            return "등록완료";
        case "3":
            return "보류";
        default:
            return "신청대기중";
    }
}
// 여기도요 관련 끝


function isTcashIncrease(item) {
    if (item.type === "TC00" && item.payMethod !== "00") {
        if(item.tcash > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (item.type === "TC01") {
        return false;
    }
    else if (item.type === "TC10") {
    }
    return false;
}

function setTcashMemo(item) {
    console.log("rryry");
    console.log(item);
    var memo = "";

    if (item.order !== null) {
        var storeName = item.storeName;
        var products = item.order.items[0].products.name;

        if (item.order.items.length > 1) {
            products += " 외 " + (item.order.items.length-1) + "건";
        }
        memo = storeName + "에서 " + products + " 구매함";
    }
    else {
        memo = item.memo === null ? "" : item.memo;
    }

    return memo
}
// TCash 티캐시 관련 끝


const User = ({ match }) => {
    const [login, setLogin] = useGlobalState('login');
    const [backdrop, setBackdrop] = useGlobalState('backdrop');
    const classes = useStyles();

    const [menuTabValue, setMenuTabValue] = React.useState(0);

    const [success, setSuccess] = React.useState(false);

    const [originUser, setOriginUser] = React.useState(null);
    const [user, setUser] = React.useState(null);
    
    const [inquiryImages,setInquiryImages] = React.useState([]);
    const [inquiryImage,setInquiryImage] = React.useState([]);
    const [orders, setOrders] = React.useState([]);
    const [orderPage, setOrderPage] = React.useState(0);
    const [orderListCount, setOrderListCount] = React.useState(15);
    const [orderPageCount, setOrderPageCount] = React.useState(10);
    const [orderTotalPage, setOrderTotalPage] = React.useState(10);
    const [totalOrderCount, setTotalOrderCount] = React.useState(0);
    const [totalAmount, setTotalAmount] = React.useState(0);
    const [totalCardAmount, setTotalCardAmount] = React.useState(0);
    const [openOrderDetailDialog, setOpenOrderDetailDialog] = React.useState(false);
    const [items, setItems] = React.useState([]);

    const [tcashes, setTcashes] = React.useState([]);
    const [tcashPage, setTcashPage] = React.useState(0);
    const [tcashListCount, setTcashListCount] = React.useState(15);
    const [tcashPageCount, setTcashPageCount] = React.useState(10);
    const [tcashTotalPage, setTcashTotalPage] = React.useState(10);
    const [tcashTotalPrice, setTcashTotalPrice] = React.useState(0);
    const [tcashChargePrice, setTcashChargePrice] = React.useState(0);
    const [tcashChargePriceOnlyCard, setTcashChargePriceOnlyCard] = React.useState(0);
    const [tcashChargeCountOnlyCard, setTcashChargeCountOnlyCard] = React.useState(0);
    const [tcashUsePrice, setTcashUsePrice] = React.useState(0);

    const [chargeTcashPrice, setChargeTcashPrice] = React.useState(0);
    const [chargeTcashMemo, setChargeTcashMemo] = React.useState("");

    const [inquiries, setInquiries] = React.useState([]);
    const [totalInq, setTotalInq] = React.useState([]);
    const [inqPage, setInqPage] = React.useState(0);
    const [inqListCount, setInqListCount] = React.useState(15);
    const [inqPageCount, setInqPageCount] = React.useState(10);
    const [inqTotalPage, setInqTotalPage] = React.useState(10);
    
    const [openInquiryDialog, setOpenInquiryDialog] = React.useState(false);
    const [inquiry, setInquiry] = React.useState(null);

    const [heres, setHeres] = React.useState([]);
    const [totalHere, setTotalHere] = React.useState([]);
    const [herePage, setHerePage] = React.useState(0);
    const [hereListCount, setHereListCount] = React.useState(15);
    const [herePageCount, setHerePageCount] = React.useState(10);
    const [hereTotalPage, setHereTotalPage] = React.useState(10);
    
    const [userLogs, setUserLogs] = React.useState([]);
    const [userLastLogin, setUserLastLogin] = React.useState("");
    const [userLastLoginIp, setUserLastLoginIp] = React.useState("");

    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        setBackdrop(true);
        loadData(match.params.id)
        .then((response) => {
            setData(response);
            setBackdrop(false);
        })
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    function setData(data) {
        console.log("user data", data);
        let user = data.user;
        let orders = data.orders.orders;
        let tcashes = data.tcashes.tcashes;
        let inquiries = data.inquiries.inquiries;
        let heres = data.heres.heres;
        // let logs = user.logs.filter(item => item.type === "UL00");
        let logs = user.logs;

        let ordersTotalCount = data.orders.totalCount;
        let tcashesTotalCount = data.tcashes.totalCount;
        let inqTotalCount = data.inquiries.totalCount;
        let heresTotalCount = data.heres.totalCount;
        
        
        let orderTotalPagePlus = (ordersTotalCount % orderListCount) > 0 ? 1 : 0;
        let orderTotalPage = parseInt(ordersTotalCount / orderListCount) + orderTotalPagePlus;

        let tcashTotalPagePlus = (tcashesTotalCount % tcashListCount) > 0 ? 1 : 0;
        let tcashTotalPage = parseInt(tcashesTotalCount / tcashListCount) + tcashTotalPagePlus;

        let inqTotalPagePlus = (inqTotalCount % inqListCount) > 0 ? 1 : 0;
        let inqTotalPage = parseInt(inqTotalCount / inqListCount) + inqTotalPagePlus;

        let hereTotalPagePlus = (heresTotalCount % hereListCount) > 0 ? 1 : 0;
        let hereTotalPage = parseInt(heresTotalCount / hereListCount) + hereTotalPagePlus;

        
        setOrders(orders);
        setTcashes(tcashes);
        setInquiries(inquiries);
        loadInquiryImage().then((response) => {
            setInquiryImages(response.data);
        });
        setTotalInq(inqTotalCount);
        setHeres(heres);
        setTotalHere(heresTotalCount);
        setUserLogs(logs);

        setOrderTotalPage(orderTotalPage);
        setTcashTotalPage(tcashTotalPage);
        setInqTotalPage(inqTotalPage);
        setHereTotalPage(hereTotalPage);


        setTotalOrderCount(user.orderCount);
        setTotalAmount(user.orderAmount);
        setTotalCardAmount(user.orderCardAmount);

       setTcashTotalPrice(user.tcashAmount);
       setTcashChargePrice(user.tcashChargeAmount);
       setTcashChargePriceOnlyCard(user.tcashCardChargeAmount);
       setTcashChargeCountOnlyCard(user.tcashCardChargeCount);
       setTcashUsePrice(user.tcashUseAmount);

        // 유저로그 시작
        if (logs.length > 0) {
            let now = new Date();
            let d = new Date(logs[0].createdAt);
            let diff = Math.abs(now.getTime() - d.getTime());
            let diffMin = Math.floor(diff / (1000 * 60));
            let diffHour = Math.floor(diff / (1000 * 60 * 60));
            let diffDay = Math.floor(diff / (1000 * 60 * 60 * 24));

            let date = moment(d).format("YYYY. MM. DD");

            if (diffMin < 60) {
                date = diffMin + "분 전";
            }

            if (diffMin > 60 && diffHour < 24) {
                date = diffHour +"시간 전";
            }

            if (diffHour > 24 && diffDay < 7) {
                date = diffDay +"일 전";
            }

            setUserLastLogin(date);
            setUserLastLoginIp(logs[0].ip);
        }
        // 유저로그 끝

        setOriginUser(cloneObject(user));
        setUser(user);
        
        setBackdrop(false);
    }

    function loadInquiryImage(){
        return new Promise((resolve,reject) => {
            axios({
                "url":API_HOST + "/master/loadInquiryImage",
                "method":"post"
            }).then(function(response){
                console.log("loadInquiryImage");
                console.log(response);
                resolve(response);
            })
        })
    }

    function setOrdersData(response) {
        let data = response.data;
        let orders = data.orders;
        setOrders(orders);
    }

    function setTcashesData(response) {
        console.log("setTcashesData", response);
        let data = response.data;
        let tcashes = data.tcashes;
        setTcashes(tcashes);
    }

    function setInqsData(response) {
        let data = response.data;
        let inquiries = data.inquiries;
        setInquiries(inquiries);
    }

    function setHeresData(response) {
        let data = response.data;
        let heres = data.heres;
        setHeres(heres);
    }


    const changeMenuTabs = (event, value) => {
        setMenuTabValue(value);
    }

    const changeUserValue = (prop) => (event) => {
        setUser({ ...user, [prop]: event.target.value });
    };

    
    function clickOrderPagination(offset) {
        console.log("pagination", offset);
        setOrderPage(offset);

        setBackdrop(true);
        loadOrdersData(match.params.id, offset)
        .then((response) => {
            setOrdersData(response);
            setBackdrop(false);
        });
    }
    
    
    function clickTcashPagination(offset) {
        console.log("pagination", offset);
        setTcashPage(offset);

        setBackdrop(true);
        loadTcashesData(match.params.id, offset)
        .then((response) => {
            setTcashesData(response);
            setBackdrop(false);
        });
    }
    
    
    function clickInqPagination(offset) {
        console.log("pagination", offset);
        setInqPage(offset);

        setBackdrop(true);
        loadInqsData(match.params.id, offset)
        .then((response) => {
            setInqsData(response);
            setBackdrop(false);
        });
    }
    
    
    function clickHerePagination(offset) {
        console.log("pagination", offset);
        setHerePage(offset);

        setBackdrop(true);
        loadHeresData(match.params.id, offset)
        .then((response) => {
            setHeresData(response);
            setBackdrop(false);
        });
    }


    function doResetPwd() {
        let pwd = user.phone;

        if (pwd.length > 3) {
            if (window.confirm("비밀번호를 초기화 하시겠습니까?")) {
                let start = pwd.length - 4;
                pwd = pwd.substr(start, pwd.length-1);
                let sha256 = require('js-sha256');
                let cryptoPwd = sha256(pwd);

                axios({
                    "url": API_HOST + "/master/updateUserPassword",
                    "method": "post",
                    "params": {
                        userId: user.id,
                        password: cryptoPwd,
                        sns: "EMAIL",
                    }
                })
                .then(function (response) {
                    console.log(response);
                    openSnackbar();
                });
            }
        }
        else {
            alert("전화번호가 제대로 입력되지 않아서 초기화가 불가능합니다.");
        }
    }


    function doChargeTcash() {
        let now = new Date();
        let oid = now.getTime();
        console.log(chargeTcashPrice);
        console.log(chargeTcashMemo);
        
        // let q = ' mutation {' +
        //     ' insertAdminLog(type:"TC00" adminId: "' + login.id + '" target:"' + user.id + '" ip:"" content:"[TCash 충전] 유저:' + user.name + '(' + user.email + '), 금액 :' + chargeTcashPrice + 't, 사유: ' + chargeTcashMemo + '") { id } ' +
        //     ' insertTcash(userId:"' + user.id + '" oid:"' + oid + '" type:"TC00" payMethod:"CHARGE" tcash:' + chargeTcashPrice + ' memo:"' + chargeTcashMemo + '" authDate:"' + moment(now).format("YYMMDDHHmmss") + '") { id }' +
        // '} ';

        let tcashParam = {
            id:"",
            userId:user.id,
            oid:oid,
            type:"TC00",
            payMethod:"CHARGE",
            tcash:chargeTcashPrice,
            memo:chargeTcashMemo,
            authDate:moment(now).format("YYMMDDHHmmss"),
        }
        return new Promise((resolve, reject) => {
            axios({
                "url": API_HOST + "/master/updateTcash",
                "method": "post",
                "data": tcashParam
            })
            .then(function (response) {
                resolve(response);
                loadTcashesData(match.params.id, tcashPage)
                .then((response) => {
                    setTcashesData(response);

                    let logParam = {
                        type:"TC00",
                        adminId:login.id,
                        tareget:user.id,
                        content: "[TCash 충전] 유저: " + user.name + "(" + user.email + "), 금액 : " + chargeTcashPrice + "t, 사유 : " + chargeTcashMemo
                    };

                    axios({
                        "url": API_HOST + "/master/insertLog",
                        "method":"post",
                        "data":logParam
                    })
                    setBackdrop(false);
                });
            });
        });
    }
    

    const openSnackbar = () => {
        setSuccess(true);
    }    
    const closeSnackbar = () => {
        setSuccess(false);
    }


    function doOpenOrderDetailDialog(row) {
        setOpenOrderDetailDialog(true);
        setItems(row.items);
    }

    function doCloseOrderDetailDialog() {
        setOpenOrderDetailDialog(false);
    }


    const doSaveData = () => {
        saveData(originUser, user)
        .then((response) => {
            console.log(response);
            openSnackbar();
        });
    }

    // 1:1문의 다이얼로그 시작
    const doOpenInquiryDialog = (id) => (event) => {
        let selected = inquiries.find(item => {
            return item.id === id;
        })
        if (selected.reply === null) {
            selected.reply = {
                title: "RE: " + selected.title,
                contents: ""
            }
        }
        console.log(selected);

        let imageList = [];
        for(let i=0; i<inquiryImages.length; i++){
            if(inquiryImages[i]['nodeId'] === id){
                imageList.push(inquiryImages[i]);
            }
        }
        console.log(imageList);
        setInquiryImage(imageList);
        setInquiry(selected)
        setOpenInquiryDialog(true);
    };
    const doCloseInquiryDialog = () => {
        // setProducts(cloneObject(originProducts));
        setOpenInquiryDialog(false);
    }
    const doSaveInquiryDialog = () => {
        let copyInquiry = cloneObject(inquiry);

        function saveFinish() {
            setOpenInquiryDialog(false);
            openSnackbar();
        }
        
        // 1. 문의 수정
        // let qSaveInquiry = 'mutation { ';        
        // let inquiryParam = {};    
        // if (copyInquiry.reply !== undefined) {
        //     qSaveInquiry += ' updateInquiry (' +
        //             'id: "' + copyInquiry.reply + '" ' +
        //             'title: """' + copyInquiry.replyTitle + '""" ' +
        //             'contents: """' + copyInquiry.replyContents + '""" ' +
        //         ') {' +
        //             'id ' +
        //         '}';
        //     inquiryParam = {
        //         id: copyInquiry.reply,
        //         title: copyInquiry.replyTitle,
        //         contents: copyInquiry.replyContents,
        //         type: copyInquiry.type,
        //         status: copyInquiry.status,
        //         user: copyInquiry.user,
        //         admin: copyInquiry.admin,
        //         reply: copyInquiry.reply
        //     }
        // }
        // else {
        //     qSaveInquiry += ' insertInquiry (' +
        //             'adminId: "' + login.id + '"' +
        //             'title: """' + copyInquiry.replyTitle + '""" ' +
        //             'contents: """' + copyInquiry.replyContents + '""" ' +
        //             'status: "1" ' +
        //         ') {' +
        //             'id ' +
        //         '}';
        // }
        // qSaveInquiry += ' }';
        
        new Promise((resolve, reject) => {
            console.log(copyInquiry);
            copyInquiry.reply.admin = login.id;
            axios({
                "url": API_HOST + "/master/updateInquiry",
                "method":"post",
                "data":copyInquiry.reply
            }).then(function(response){
                console.log("updateInquiry");
                console.log(response);
                if(copyInquiry.reply.id !== undefined){
                    resolve(response);
                }else{
                    copyInquiry.replyId = response.data.id;
                    copyInquiry.user = copyInquiry.user;
                    axios({
                        "url": API_HOST + "/master/updateInquiry",
                        "method":"post",
                        "data":copyInquiry
                    }).then(function(response){
                        console.log("updateInquiry22");
                        console.log(response);
                        resolve(response);
                    })
                }
            })
        })
        .then((response) => {
            saveFinish();
        });
    }

    const doDeleteInquiryDialog = () => {
        // let qDeleteInquiry = 'mutation { '; 
        // qDeleteInquiry += ' deleteInquiry (' +
        //         'id: "' + inquiry.id + '" ' +
        //     ') {' +
        //         'id ' +
        //     '}';
        // qDeleteInquiry += ' }';    
        
        new Promise((resolve, reject) => {
            axios({
                "url": API_HOST + "/master/deleteInquiry",
                "method": "post",
                "params": {
                    inquiryId: inquiry.id,
                }
            })
            .then(function (response) {
                resolve(response);
            });
        })
        .then((response) => {
            // loadData(inqPage * inqListCount, inqListCount)
            // .then((response) => {
            //     setData(response);
            //     setOpenInquiryDialog(false);
    
            //     openSnackbar();
            // });
            setOpenInquiryDialog(false);
            setBackdrop(true);
            loadData(match.params.id)
            .then((response) => {
                setData(response);
                setBackdrop(false);
                openSnackbar();
            })
        });
    }

    function toHtml(source) {
        let contentHTML = htmlToDraft(source)
        let state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap)
        return convertToRaw(state);
    }

    
    const changeTitle = (prop) => (event) => {
        setInquiry({ ...inquiry, [prop]: event.target.value });
    };

    function changeContent(edited) {
        let n = inquiry;
        n.reply.contents = draftToHtml(edited);
        setInquiry(n)
    }
    // 1:1문의 다이얼로그 끝
    

    return (
        login !== null &&
            <Box className="base-container page-box user-container" height="100%">
                <Typography variant="h5" noWrap className={classes.divRow}>
                    User
                </Typography>
                
                <div className={classes.divRow}>
                    <Grid container spacing={4}>
                        <Grid item xs={3}>
                            <Paper square className={classes.paper}>
                                <Typography variant="h5" noWrap className={classes.divRow}>
                                    회원 정보
                                </Typography>
                                
                                { user !== null &&
                                    <div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={8}>
                                                    <TextField className={ classes.width100 } label="닉네임" variant="outlined" defaultValue={ isNull(user.name) }
                                                        onBlur={changeUserValue('name')}/>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField className={ classes.width100 } label="가입타입" variant="outlined" disabled defaultValue={ isNull(user.sns) }/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <TextField className={ classes.width100 } label="이메일" variant="outlined" defaultValue={ isNull(user.email) }
                                                        onBlur={changeUserValue('email')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    비밀번호
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button className={ classes.button } variant="contained" color="primary" onClick={ doResetPwd }>비밀번호 초기화</Button>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={8}>
                                                    <TextField className={ classes.width100 } label="생년월일" variant="outlined" defaultValue={ isNull(user.birth) }
                                                        onBlur={changeUserValue('birth')}/>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField className={ classes.width100 } label="성별" variant="outlined" defaultValue={ isNull(user.sex) }
                                                        onBlur={changeUserValue('sex')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <TextField className={ classes.width100 } label="전화번호" variant="outlined" defaultValue={ isNull(user.phone) }
                                                        onBlur={changeUserValue('phone')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <TextField className={ classes.width100 } label="그룹할인코드" variant="outlined" defaultValue={ isNull(user.groupDiscountCode) }
                                                        onBlur={changeUserValue('groupDiscountCode')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <TextField multiline className={ classes.width100 } label="메모" variant="outlined" rows="5" defaultValue={ isNull(user.memo) }
                                                        onBlur={changeUserValue('memo')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div>
                                            <Grid container spacing={1}>
                                                <Grid item align="right" xs={12}>
                                                    <Button className={ classes.button } variant="contained" color="primary" onClick={ doSaveData }>저장</Button>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </div>
                                }

                                { user === null &&
                                    <div>불러오는 중입니다.</div>
                                }
                            </Paper>
                        </Grid>
                        <Grid item xs={3}>
                            <Paper square className={classes.paper}>
                                <Typography variant="h5" noWrap className={classes.divRow}>
                                    활동 정보
                                </Typography>
                                
                                { user !== null &&
                                    <div>
                                        <div>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Typography variant="subtitle1" noWrap>
                                                        <b>가입일</b>
                                                    </Typography>
                                                    <Typography variant="body2" noWrap style={{ color:'#909090' }}>
                                                        { moment(user.createdAt).format("YYYY년MM월DD일") }<br/>
                                                        { moment(user.createdAt).format("HH시mm분ss초") }
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="subtitle1" noWrap>
                                                        <b>사용 기기 OS</b>
                                                    </Typography>
                                                    <Typography variant="body2" noWrap style={{ color:'#909090' }}>
                                                        { user.mobileOs }
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Typography variant="subtitle1" noWrap>
                                                        <b>Tcash 보유금액</b>
                                                    </Typography>
                                                    <Typography variant="body2" noWrap style={{ color:'#909090' }}>
                                                        { numeral(tcashTotalPrice).format("0,0") }
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="subtitle1" noWrap>
                                                        <b>Tcash 결제금액 (건수)</b>
                                                    </Typography>
                                                    <Typography variant="body2" noWrap style={{ color:'#909090' }}>
                                                        { numeral(tcashChargePriceOnlyCard).format("0,0") + "원 (" + numeral(tcashChargeCountOnlyCard).format("0,0") + "건)" }<br/>
                                                        <b>누적</b> { numeral(tcashChargePrice).format("0,0") + "t" }
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Typography variant="subtitle1" noWrap>
                                                        <b>Tcash 사용금액</b>
                                                    </Typography>
                                                    <Typography variant="body2" noWrap style={{ color:'#909090' }}>
                                                        { numeral(tcashUsePrice).format("0,0") }
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="subtitle1" noWrap>
                                                        <b>카드 사용금액</b>
                                                    </Typography>
                                                    <Typography variant="body2" noWrap style={{ color:'#909090' }}>
                                                        { numeral(totalCardAmount).format("0,0") }
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Typography variant="subtitle1" noWrap>
                                                        <b>로그인</b>
                                                    </Typography>
                                                    <Typography variant="body2" noWrap style={{ color:'#909090' }}>
                                                        { userLastLogin }
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="subtitle1" noWrap>
                                                        <b>최종 로그인 IP</b>
                                                    </Typography>
                                                    <Typography variant="body2" noWrap style={{ color:'#909090' }}>
                                                        { userLastLoginIp }
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Typography variant="subtitle1" noWrap>
                                                        <b>작성</b>
                                                    </Typography>
                                                    <div style={{ color:'#909090' }}>
                                                        <table>
                                                            <colgroup>
                                                                <col style={{ width:"70px" }}/>
                                                                <col style={{ width:"30px" }}/>
                                                            </colgroup>
                                                            <tbody>
                                                                <tr>
                                                                    <td>1:1문의</td><td style={{ textAlign:"right" }}>{ numeral(totalInq).format("0,0") }개</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>여기도요</td><td style={{ textAlign:"right" }}>{ numeral(totalHere).format("0,0") }개</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="subtitle1" noWrap>
                                                        <b>누적 구매 금액</b>
                                                    </Typography>
                                                    <div style={{ color:'#909090' }}>
                                                        <div>{ numeral(totalOrderCount).format("0,0") }회 { numeral(totalAmount).format("0,0") }원</div>
                                                        <div style={{ color:"#aaa" }}>실시간 결제 완료 기준</div>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </div>
                                }
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper square>
                                <Typography variant="h5" noWrap className={classes.divRow}>
                                    <Tabs
                                        value={menuTabValue}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        onChange={ changeMenuTabs }
                                        >
                                        <Tab label="주문내역"/>
                                        <Tab label="Tcash"/>
                                        <Tab label="1:1 문의"/>
                                        <Tab label="여기도요"/>
                                    </Tabs>
                                </Typography>
                            </Paper>
                            
                            { (user !== null && menuTabValue === 0) &&
                                <Paper className={classes.root}>
                                    <Table className={classes.table} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center" style={{ width:'100px' }}>주문번호<br/>주문일</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'150px' }}>매장</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'45px' }}>상태</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'250px' }}>상품명</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'100px' }}>결제방법<br/>결제금액</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                orders.length > 0 ? (
                                                    orders.map(row => (
                                                        <StyledTableRow key={ row.id }>
                                                            <StyledTableCell component="th" scope="row" align="center"><small>{ row.oid }<br/>{ moment(row.authDate, "YYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss") }</small></StyledTableCell>
                                                            <StyledTableCell><Link to={ "/Store/" + row.store.id }>{ row.store.name }</Link></StyledTableCell>
                                                            <StyledTableCell align="center"><small>{ setOrderStatus(row.status) }</small></StyledTableCell>
                                                            <StyledTableCell>
                                                                { setProductName(row) }<br/>
                                                                { setProductOption(row.items[0]) }
                                                                { isShowDetail(row) && (
                                                                    <div style={{ color: '#e2422a', cursor:'pointer' }} onClick={doOpenOrderDetailDialog.bind(this, row)}>

                                                                        자세히보기
                                                                    </div>
                                                                )}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="right">{ row.payMethod }<br/>{ numeral(row.totalPrice).format('0,0') }</StyledTableCell>
                                                        </StyledTableRow>
                                                    ))
                                                )
                                                : (
                                                    <StyledTableRow key={ 0 }>
                                                        <StyledTableCell align="center" colSpan={5}>주문내역이 없습니다</StyledTableCell>
                                                    </StyledTableRow>
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                    <CssBaseline />
                                    <Container align="center" className={classes.paginationRow}>
                                        <Pagination
                                            limit={1}
                                            offset={orderPage}      // Row Number Skip offset
                                            total={orderTotalPage}
                                            onClick={(e, offset) => clickOrderPagination(offset)}
                                            size="large"
                                        />
                                    </Container>
                                </Paper>
                            }
                            
                            { (user !== null && menuTabValue === 1) &&
                                <Paper className={classes.root}>
                                    <Table className={classes.table} aria-label="customized table">
                                        <TableBody>
                                            <StyledTableRow key={ 0 }>
                                                <StyledTableCell align="center">
                                                    <TextField className={ classes.width100 } label="가격" variant="outlined" defaultValue={ isNull(chargeTcashPrice) }
                                                        onBlur={(event) => { setChargeTcashPrice(event.target.value) }}/>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <TextField className={ classes.width100 } label="사유" variant="outlined" defaultValue={ isNull(chargeTcashMemo) }
                                                        onBlur={(event) => { setChargeTcashMemo(event.target.value) }}/>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Button className={ classes.button } variant="contained" color="primary" onClick={ doChargeTcash }>충전</Button>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        </TableBody>
                                    </Table>
                                    <Table className={classes.table} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center" style={{ width:'130px' }}>일자</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'100px' }}>타입</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'80px' }}>증감</StyledTableCell>
                                                <StyledTableCell align="center">사유</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                tcashes.length > 0 ? (
                                                    tcashes.map(row => (
                                                        <StyledTableRow key={ row.id }>
                                                            <StyledTableCell component="th" scope="row" align="center"><small>{ moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss") }</small></StyledTableCell>
                                                            <StyledTableCell align="center"><small>{ setTcashStatus(row) }</small></StyledTableCell>
                                                            <StyledTableCell align="right">{ isTcashIncrease(row) ? "+" : "-" }{ numeral(Math.abs(row.tcash)).format("0,0") }</StyledTableCell>
                                                            <StyledTableCell>{ setTcashMemo(row) }</StyledTableCell>
                                                        </StyledTableRow>
                                                    ))
                                                )
                                                : (
                                                    <StyledTableRow key={ 0 }>
                                                        <StyledTableCell align="center" colSpan={4}>Tcash내역이 없습니다</StyledTableCell>
                                                    </StyledTableRow>
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                    <CssBaseline />
                                    <Container align="center" className={classes.paginationRow}>
                                        <Pagination
                                            limit={1}
                                            offset={tcashPage}      // Row Number Skip offset
                                            total={tcashTotalPage}
                                            onClick={(e, offset) => clickTcashPagination(offset)}
                                            size="large"
                                        />
                                    </Container>
                                </Paper>
                            }
                            
                            { (user !== null && menuTabValue === 2) &&
                                <Paper className={classes.root}>
                                    <Table className={classes.table} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center" style={{ width:'130px' }}>날짜</StyledTableCell>
                                                <StyledTableCell align="center">제목</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'65px' }}>상태</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                inquiries.length > 0 ? (
                                                    inquiries.map(row => (
                                                        <StyledTableRow key={ row.id }>
                                                        <StyledTableCell component="th" scope="row" align="center"><small>{ moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss") }</small></StyledTableCell>
                                                            <StyledTableCell><a onClick={ doOpenInquiryDialog(row.id) } style={{ cursor:"pointer" }}>{ row.title }</a></StyledTableCell>
                                                            <StyledTableCell align="right">{ row.reply !== null ? "답변완료" : "답변대기" }</StyledTableCell>
                                                        </StyledTableRow>
                                                    ))
                                                )
                                                : (
                                                    <StyledTableRow key={ 0 }>
                                                        <StyledTableCell align="center" colSpan={3}>문의내역이 없습니다</StyledTableCell>
                                                    </StyledTableRow>
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                    <CssBaseline />
                                    <Container align="center" className={classes.paginationRow}>
                                        <Pagination
                                            limit={1}
                                            offset={inqPage}      // Row Number Skip offset
                                            total={inqTotalPage}
                                            onClick={(e, offset) => clickInqPagination(offset)}
                                            size="large"
                                        />
                                    </Container>
                                </Paper>
                            }
                            
                            { (user !== null && menuTabValue === 3) &&
                                <Paper className={classes.root}>
                                    <Table className={classes.table} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center" style={{ width:'130px' }}>날짜</StyledTableCell>
                                                <StyledTableCell align="center">매장명</StyledTableCell>
                                                <StyledTableCell align="center">매장 주소</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'120px' }}>상태</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                heres.length > 0 ? (
                                                    heres.map(row => (
                                                        <StyledTableRow key={ row.id }>
                                                            <StyledTableCell component="th" scope="row" align="center"><small>{ moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss") }</small></StyledTableCell>
                                                            <StyledTableCell>{ row.title }</StyledTableCell>
                                                            <StyledTableCell>{ row.contents }</StyledTableCell>
                                                            <StyledTableCell align="center"><small>{ setHereStatus(row.status) }</small></StyledTableCell>
                                                        </StyledTableRow>
                                                    ))
                                                )
                                                : (
                                                    <StyledTableRow key={ 0 }>
                                                        <StyledTableCell align="center" colSpan={4}>여기도요 등록내역이 없습니다</StyledTableCell>
                                                    </StyledTableRow>
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                    <CssBaseline />
                                    <Container align="center" className={classes.paginationRow}>
                                        <Pagination
                                            limit={1}
                                            offset={herePage}      // Row Number Skip offset
                                            total={hereTotalPage}
                                            onClick={(e, offset) => clickHerePagination(offset)}
                                            size="large"
                                        />
                                    </Container>
                                </Paper>
                            }
                        </Grid>
                    </Grid>
                </div>
                

                <Dialog onClose={doCloseOrderDetailDialog} aria-labelledby="group-dialog-title" open={openOrderDetailDialog} fullWidth maxWidth="md">
                    <DialogTitle onClose={doCloseOrderDetailDialog}>주문 상세</DialogTitle>
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
                                                        { row.products.name }<br/>
                                                        { setProductOption(row) }
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(row.qty).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(row.price + getOptionPrice(row)).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(row.discount).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(row.storeDiscount).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral((row.price + getOptionPrice(row) - (row.discount + row.storeDiscount)) * row.qty).format('0,0') }</StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>


                {
                    inquiry !== null &&      
                        <Dialog onClose={doCloseInquiryDialog} className="store-container" aria-labelledby="group-dialog-title" open={openInquiryDialog} fullWidth maxWidth="lg">
                            <DialogTitle onClose={doCloseInquiryDialog}>1:1문의 답변 작성</DialogTitle>
                            <DialogContent dividers style={{padding:'10px'}}>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <TextField className={ classes.width100 } label="제목" variant="outlined" defaultValue={ inquiry.title }                                     
                                            InputProps={{ readOnly: true }}
                                            style={{ marginBottom: '8px' }}
                                            onBlur={ changeTitle("title") }/>
                                        <TextField multiline className={ [classes.width100, "no-padding"].join(' ') } value={ inquiry.contents }
                                            InputProps={{ readOnly: true }}
                                            rows="20" variant="outlined" />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField className={ classes.width100 } value={ "답변 작성" }                                       
                                            InputProps={{ readOnly: true }} variant="outlined" />
                                        <Box className={ "text-area-container" } mt={1}>
                                            <Editor
                                                defaultContentState={ inquiry.reply !== null ? toHtml(inquiry.reply.contents) : "" }
                                                onContentStateChange={ changeContent }
                                                />
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <label>첨부 이미지</label><br></br>
                                        <SimpleReactLightbox>
                                            <SRLWrapper>
                                            {
                                                inquiryImage.length !== 0 &&
                                                inquiryImage.map((row,index) => (
                                                    <a>
                                                        <img src={ row.value } style={{ maxWidth: '135px',  maxHeight: '240px', boxShadow:'0px 1px 4px #333', marginRight:"10px"}} alt={ row.value } onError={(e) => { e.target.src="/img/default-product.png"}} />
                                                    </a>
                                                        // <img src={ row.value } style={{ maxWidth: '135px',  maxHeight: '240px', boxShadow:'0px 1px 4px #333', marginRight:"10px"}} alt={ row.value } onError={(e) => { e.target.src="/img/default-product.png"}} />
                                                        ))
                                                    }
                                            </SRLWrapper>

                                        </SimpleReactLightbox>
                                        {
                                            inquiryImage.length === 0 &&
                                            <label> * 첨부된 이미지가 없습니다</label>
                                        }
                                        </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                {
                                    inquiry.id !== undefined &&
                                        <Button onClick={doDeleteInquiryDialog} color="primary" variant="outlined">
                                            삭제
                                        </Button>
                                }
                                <Button onClick={doSaveInquiryDialog} color="primary" variant="contained">
                                    저장
                                </Button>
                            </DialogActions>
                        </Dialog>
                }
                
                <Snackbar
                    open={success}
                    onClose={closeSnackbar}
                    autoHideDuration={5000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    message={<span id="message-id">저장 성공</span>}
                    TransitionComponent={TransitionLeft}
                    action={[
                        <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        onClick={closeSnackbar}
                        >
                        <CloseIcon />
                        </IconButton>,
                    ]}
                />
            </Box>
    );
};

export default User;