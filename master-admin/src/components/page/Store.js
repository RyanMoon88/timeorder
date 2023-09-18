import React from 'react';
import { API_SERVER_URL, API_HOST } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { Box, Paper, Grid, Typography, Tabs, Tab, TextField, InputAdornment, Button, Switch, CssBaseline, Container } from '@material-ui/core';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, InputLabel, Select, MenuItem } from '@material-ui/core';
import { GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DaumPostcode from 'react-daum-postcode';
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import { DropzoneArea } from 'material-ui-dropzone'

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import SortIcon from '@material-ui/icons/Sort';

import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pagination from "material-ui-flat-pagination";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/Add';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import { ColorPicker,createColor,ColorInput,ColorButton,ColorBox } from 'material-ui-color';
import Input from '@material-ui/core/Input';

const s3 = () => {
    let AWS = require('aws-sdk');
    AWS.config.region = 'ap-northeast-2'; // 리전
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'ap-northeast-2:ae0b1eaf-8307-4b6c-ac6d-80fe02aad0ee',
    });

    let s3 = new AWS.S3();
    return s3;
}
const getBucketName = (row) => {
    var name = row.substr(row.lastIndexOf("/") + 1, row.length);
    return name;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
};

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
        padding: '10px 0px',
    },

    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        zIndex: 999
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

    hidden: {
        display: 'none'
    },

    iosSwitch: {
        position: 'absolute',
        top: 0,
        right: 0
    },

    chip: {
        marginTop: '6px',
        marginRight: '6px'
    },

    selectedImages: {
        border: "4px solid #e2422a"
    },

    miniBadgeRed: {
        background:'#e2422a',
        border:'1px solid #e2422a',
        borderRadius:'4px',
        display:'inline-block',
        padding:'4px 6px',
        color: '#fff',
        lineHeight: '1',
        fontSize:'11px',
        marginRight: '2px',
        marginBottom: '2px'
    },

    miniBadgeRedLight: {
        background:'#e27a7a',
        border:'1px solid #e27a7a',
        borderRadius:'4px',
        display:'inline-block',
        padding:'4px 6px',
        color: '#fff',
        lineHeight: '1',
        fontSize:'11px',
        marginRight: '2px',
        marginBottom: '2px'
    },

    miniBadgeBlueLight: {
        background:'#208eff',
        border:'1px solid #208eff',
        borderRadius:'4px',
        display:'inline-block',
        padding:'4px 6px',
        color: '#fff',
        lineHeight: '1',
        fontSize:'11px',
        marginRight: '2px',
        marginBottom: '2px'
    },

    miniBadgeGreenLight: {
        background:'#2d8e2d',
        border:'1px solid #2d8e2d',
        borderRadius:'4px',
        display:'inline-block',
        padding:'4px 6px',
        color: '#fff',
        lineHeight: '1',
        fontSize:'11px',
        marginRight: '2px',
        marginBottom: '2px'
    }, 

    miniBadgeRedOutlined: {
        background:'#fff',
        border:'1px solid #e2422a',
        borderRadius:'4px',
        display:'inline-block',
        padding:'4px 6px',
        color: '#333',
        lineHeight: '1',
        fontSize:'11px',
        marginRight: '2px',
        marginBottom: '2px'
    },

    miniBadgeRedLightOutlined: {
        background:'#fff',
        border:'1px solid #e27a7a',
        borderRadius:'4px',
        display:'inline-block',
        padding:'4px 6px',
        color: '#e27a7a',
        lineHeight: '1',
        fontSize:'11px',
        marginRight: '2px',
        marginBottom: '2px'
    },

    miniBadgeBlueLightOutlined: {
        background:'#fff',
        border:'1px solid #5db1ec',
        borderRadius:'4px',
        display:'inline-block',
        padding:'4px 6px',
        color: '#5db1ec',
        lineHeight: '1',
        fontSize:'11px',
        marginRight: '2px',
        marginBottom: '2px'
    },

    miniBadgeGreenLightOutlined: {
        background:'#fff',
        border:'1px solid #2d8e2d',
        borderRadius:'4px',
        display:'inline-block',
        padding:'4px 6px',
        color: '#2d8e2d',
        lineHeight: '1',
        fontSize:'11px',
        marginRight: '2px',
        marginBottom: '2px'
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


function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}

const IOSSwitch = withStyles(theme => ({
    root: {
        width: 32,
        height: 16,
        padding: 0,
        margin: 0,
    },
    switchBase: {
        padding: 1,
        '&$checked': {
            transform: 'translateX(16px)',
            color: theme.palette.common.white,
            '& + $track': {
            backgroundColor: '#e2422a',
                opacity: 1,
                border: 'none',
            },
        },
        '&$focusVisible $thumb': {
            color: '#e2422a',
            border: '6px solid #fff',
        },
    },
    thumb: {
        width: 14,
        height: 14,
    },
    track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => {
    return (
        <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
            root: classes.root,
            switchBase: classes.switchBase,
            thumb: classes.thumb,
            track: classes.track,
            checked: classes.checked,
            }}
            {...props}
        />
    );
});



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


// 깊은 복사
function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

const isNull = (value, base = '') => {
    if (value === null || value === undefined || value === "null" || value === "undefined") {
        value = base;
    }
    return value;
}


function diffObjectString(source, target) {
    let keys = Object.keys(source);
    let result = "";

    for (let key of keys) {
        let bef = (typeof source[key] === "string" || typeof source[key] === "number" || typeof source[key] === "boolean") ? source[key] : "";
        let aft = (typeof target[key] === "string" || typeof target[key] === "number" || typeof target[key] === "boolean") ? target[key] : "";
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


function diffArrayString(sources, targets) {
    let sourcesLength = sources.length;
    let targetsLength = targets.length;
    let result = "";
    for (let i=0; i<sourcesLength; i++) {
        let source = sources[i];
        let keys = Object.keys(source);
        
        for (let j=0; j<targetsLength; j++) {
            let target = targets[j];

            if (source.id === target.id) {
                for (let key of keys) {
                    let bef = (typeof source[key] === "string" || typeof source[key] === "number") ? source[key] : "";
                    let aft = (typeof target[key] === "string" || typeof target[key] === "number") ? target[key] : "";
                    if (bef !== aft) {
                        result += " " + key + ": " + bef + "에서 " + aft + "로 변경,";
                    }
                }
            
                break;
            }
        }
    }
    
    if (result.length > 0) {
        if (result.charAt(result.length - 1) === ",") {
            result = result.substr(0, result.length - 1);
        }
    }
    console.log("diffArrayString", result);
    return result;
}


function loadData(id) {
    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/getStore?storeId=" + id,
            "method": "post"
        })
        .then(function (response) {
            resolve(response);
        });
    });
};

function loadOrdersData(id, page = 0, listCount = 10, deviceTab, statusTab) {
    let skip = page;
    
    let device = [];
    let status = [];

    for (let key in deviceTab) {
        if (deviceTab[key]) {
            if (key === "posTab") {
                // device.push('\\"' + key.substring(0, 3).toUpperCase() + '\\"');
                device.push(key.substring(0, 3).toUpperCase());
            }
            else {
                // device.push('\\"' + key.toUpperCase() + '\\"');
                device.push(key.toUpperCase());
            }
        }
    }

    for (let key in statusTab) {
        if (statusTab[key]) {
            // status.push('\\"' + key.replace("status", "") + '\\"');
            status.push(key.replace("status", ""));
        }
    }


    //TODO :: 수정 진행중
    let q = 'query {' +
        'orders (where:"{\\"store\\": {\\"id\\": \\"' + id + '\\"}, \\"device_in\\": [' + device + '], \\"status_in\\": [' + status + '], \\"payMethod_not\\": \\"\\", \\"items_some\\": {\\"id_not\\": null}, \\"authDate_not\\": \\"\\" }" skip:' + skip + ', first:' + listCount + ' orderBy:"createdAt_DESC") { totalCount orders { id tid oid device createdAt buyerName totalPrice authDate store { id name storeCategory } user { id name } items { id product { name } price discount storeDiscount qty productOption } status payMethod extraInfo totalPrice statusHistories { from to createdAt } } }' +
    '}'
    console.log(status);
    console.log(device);
    let paramData = {
        storeId:id,
        statusList:status,
        deviceList:device,
        paging:skip,
        pageSize:listCount,
    }
    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadStoreOrderListByMaster",
            "method": "post",
            "data": paramData
        })
        .then(function (response) {
            for(let i=0; i<response.data.content.length; i++){
                let couponPrice = 0;
                for(let y=0; y<response.data.content[i]['payment'].length; y++){
                    if(response.data.content[i]['payment'][y]['payMethod'] === "COUPON"){
                        couponPrice += response.data.content[i]['payment'][y]['price'];
                    }
                }
                response.data.content[i]['storeDiscount'] = response.data.content[i]['storeDiscount'] + couponPrice;
            }

            console.log(response);
            resolve(response);
        });
    });
}


function loadLogsData(id, page = 0, listCount = 10) {
    let skip = page;
    let q = 'query {' +
        ' logs:storeOwnerLogs (where: "{\\"storeOwner\\": {\\"store\\": {\\"id\\": \\"' + id + '\\"} }, \\"type_not\\":\\"STORE_LIVE\\" }" orderBy:"createdAt_DESC", skip:' + skip + ', first:' + listCount + ') { totalCount storeOwnerLogs { id createdAt type content version admin { id name } } }' +
    '}'

    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadStoreLog",
            "method": "post",
            "params": {
                storeId:id,
                page:skip,
                pageSize:listCount,
            }
        })
        .then(function (response) {
            console.log(response);
            resolve(response);
        });
    });
}


function saveData(origin, store) {
    // 기존 그래프 큐엘
    // var opened = store.isOpened === "1" ? "매장오픈" : "매장마감";
    // var changeText = ' 변경값 { id:' + store.id + ', name:' + store.name + ', code:' + store.code + ', group:' + (store.group === null ? "" : store.group) + ', phone:' + store.phone + 
    //         ', zipcode:' + store.zipcode + ', address:' + store.address + ', addressDetail:' + store.addressDetail + 
    //         ', lat:' + store.lat + ', lng:' + store.lng + ', images:' + store.images + ', description:' + store.description + 
    //         ', discountType:' + store.discountType + ', discountValue:' + store.discountValue + 
    //         ', discountStart:' + store.discountStart + ', discountEnd:' + store.discountEnd + ', type:' + store.type + 
    //         ', simpleNotice:' + store.simpleNotice + ', simpleNoticeType:' + store.simpleNoticeType + ' }';

    // var changeTextOwnerElapsedTime = "";
    // var changeTextOwnerStoreDiscount = "";
    // var changeTextOwnerIsOpened = "";

    // let owner = store.owners[0];
    // console.log(owner);

    // if (owner !== undefined && owner !== null) {
    //     if (owner.id !== "") {
    //         if (origin.elapsedTime !== store.elapsedTime) {
    //             changeTextOwnerElapsedTime = ' a:insertStoreOwnerLog(storeOwnerId:"' + owner.id + '", adminId:"cjv6z5pjs0aay0734ge2kfk00", type:"WAIT", content:"[관리자 변경] 대기시간을 ' + store.elapsedTime + '분으로 변경", version:"-") { id }';
                    
    //             if (store.elapsedTime === "P") {
    //                 changeTextOwnerElapsedTime = ' a:insertStoreOwnerLog(storeOwnerId:"' + owner.id + '", adminId:"cjv6z5pjs0aay0734ge2kfk00", type:"WAIT", content:"[관리자 변경] 대기시간을 일시정지로 변경", version:"-") { id }';
    //             }
    //         }
    //         if (origin.storeDiscountValue !== store.storeDiscountValue) {
    //             changeTextOwnerStoreDiscount = ' b:insertStoreOwnerLog(storeOwnerId:"' + owner.id + '", adminId:"cjv6z5pjs0aay0734ge2kfk00", type:"DISCOUNT", content:"[관리자 변경] 할인율을 ' + store.storeDiscountValue + '%로 변경", version:"-") { id }';
    //         }
    //         if (origin.isOpened !== store.isOpened) {
    //             changeTextOwnerIsOpened = ' c:insertStoreOwnerLog(storeOwnerId:"' + owner.id + '", adminId:"cjv6z5pjs0aay0734ge2kfk00", type:"OPEN", content:"[관리자 변경] ' + opened + '으로 변경", version:"-") { id }';
    //         }
    //     }
    // }

    // let diffContents = diffObjectString(origin, store);

    // let q = 'mutation { ' + 
    //     ' insertAdminLog(type:"STO1" adminId: "cjv6z5pjs0aay0734ge2kfk00" target:"' + store.id + '" ip:"" content:"[가맹점 수정] ' + diffContents + '") { id } ' +
    //     (changeTextOwnerElapsedTime !== "" ? changeTextOwnerElapsedTime : '') + 
    //     (changeTextOwnerStoreDiscount !== "" ? changeTextOwnerStoreDiscount : '') + 
    //     (changeTextOwnerIsOpened !== "" ? changeTextOwnerIsOpened : '') + 
    //     ' updateStore (' +
    //     ' id: "' + store.id + '" ' +
    //     ' name: "' + store.name + '" ' +
    //     ' code: "' + store.code + '" ' +
    //     ' storeCategory: "' + store.storeCategory + '" ' +
    //     ' groupId: "' + (store.group === null ? "" : store.group) + '" ' +
    //     ' phone: "' + store.phone + '" ' +
    //     ' zipcode: "' + store.zipcode + '" ' +
    //     ' serialNumber: "' + store.serialNumber + '" ' +
    //     ' address: "' + store.address + '" ' +
    //     ' addressDetail: "' + store.addressDetail + '" ' +
    //     ' latitude: ' + store.latitude + ' ' +
    //     ' longitude: ' + store.longitude + ' ' +
    //     ' images: "' + store.images + '" ' +
    //     ' description: """' + store.description + '""" ' +
    //     ' discountValue: ' + store.discountValue + ' ' +
    //     ' discountStart: "' + store.discountStart + '" ' +
    //     ' discountEnd: "' + store.discountEnd + '" ' +
    //     ' type: "' + store.type + '" ' +
    //     (store.storeDiscountValue !== '' ? ' storeDiscountValue: ' + store.storeDiscountValue + ' ': '') +
    //     (store.elapsedTime !== "P" ? ' elapsedTime: ' + store.elapsedTime + ' ' : '') +
    //     ' isPause: ' + store.isPause + ' ' +
    //     ' isOpened: ' + store.isOpened + ' ' +
    //     ' fees: ' + (store.fees && Math.floor(store.fees * 10) / 10) + ' ' +
    //     ' ceo: "' + store.ceo + '" ' +
    //     ' ceoPhone: "' + store.ceoPhone + '" ' +
    //     ' bankCode: "' + store.bankCode + '" ' +
    //     ' bankOwner: "' + store.bankOwner + '" ' +
    //     ' bankNumber: "' + store.bankNumber + '" ' +
    //     ' tag: "' + store.tag + '" ' +
    //     // ' openTime: "' + store.openTime + '" ' + 
    //     ' groupDiscountCode: "' + isNull(store.groupDiscountCode) + '" ' +
    //     ' groupDiscountValue: ' + (store.groupDiscountValue === '' ? 0 : store.groupDiscountValue) + ' ' +
    //     ' simpleNotice: "' + store.simpleNotice + '" ' +
    //     ' simpleNoticeType: "' + store.simpleNoticeType + '" ' +
    //     ') {' +
    //     'id ' +
    //     '}' + 
    // '}';
   
    // return new Promise((resolve, reject) => {
    //     axios({
    //         "url": API_SERVER_URL,
    //         "method": "post",
    //         "data": {
    //             query: q
    //         }
    //     })
    //     .then(function (response) {
    //         resolve(response);
    //     });
    // });
    let owner = store.owners[0];
    let diffContents = diffObjectString(origin, store);
    if(store.groupDiscountCode === null){
        store.groupDiscountCode = "";
    }
    console.log(owner);

    return new Promise(function(resolve,reject){
        axios({
            "url":API_HOST + "/master/updateStore",
            "method":"post",
            "data":store
        }).then(function(response){
            console.log(response);
            insertLog(store.id,diffContents);
            insertStoreOwnerLog(store,origin);
            resolve(response);
        })
    })
}

function insertStoreOwnerLog(store,origin){
    return new Promise(function(resolve,reject){
        var opened = store.isOpened === "true" ? "매장오픈" : "매장마감";
        var changeTextOwnerElapsedTime = null;
        var changeTextOwnerStoreDiscount = null;
        var changeTextOwnerIsOpened = null;

        let owner = store.owners[0];
        console.log(owner);

        if (owner !== undefined && owner !== null) {
            if (owner.id !== "") {
                if (origin.elapsedTime !== store.elapsedTime) {
                    // changeTextOwnerElapsedTime = ' a:insertStoreOwnerLog(storeOwnerId:"' + owner.id + '", adminId:"cjv6z5pjs0aay0734ge2kfk00", type:"WAIT", content:"[관리자 변경] 대기시간을 ' + store.elapsedTime + '분으로 변경", version:"-") { id }';
                    changeTextOwnerElapsedTime = {
                        storeOwner:owner.id,
                        admin:"cjv6z5pjs0aay0734ge2kfk00",
                        type:"WAIT",
                        content:"[관리자 변경] 대기시간을 " + store.elapsedTime + "분으로 변경",
                        version:"-"
                    }
                        
                    if (store.elapsedTime === "P") {
                        // changeTextOwnerElapsedTime = ' a:insertStoreOwnerLog(storeOwnerId:"' + owner.id + '", adminId:"cjv6z5pjs0aay0734ge2kfk00", type:"WAIT", content:"[관리자 변경] 대기시간을 일시정지로 변경", version:"-") { id }';
                        changeTextOwnerElapsedTime = {
                            storeOwner:owner.id,
                            admin:"cjv6z5pjs0aay0734ge2kfk00",
                            type:"WAIT",
                            content:"[관리자 변경] 대기시간을 일시정지로 변경",
                            version:"-"
                        }
                    }
                }
                if (origin.storeDiscountValue !== store.storeDiscountValue) {
                    // changeTextOwnerStoreDiscount = ' b:insertStoreOwnerLog(storeOwnerId:"' + owner.id + '", adminId:"cjv6z5pjs0aay0734ge2kfk00", type:"DISCOUNT", content:"[관리자 변경] 할인율을 ' + store.storeDiscountValue + '%로 변경", version:"-") { id }';
                    changeTextOwnerStoreDiscount = {
                        storeOwner:owner.id,
                        admin:"cjv6z5pjs0aay0734ge2kfk00",
                        type:"DISCOUNT",
                        content:"[관리자 변경] 할인율을 " + store.storeDiscountValue + "%로 변경",
                        version:"-"
                    }
                }
                if (origin.isOpened !== store.isOpened) {
                    // changeTextOwnerIsOpened = ' c:insertStoreOwnerLog(storeOwnerId:"' + owner.id + '", adminId:"cjv6z5pjs0aay0734ge2kfk00", type:"OPEN", content:"[관리자 변경] ' + opened + '으로 변경", version:"-") { id }';
                    changeTextOwnerIsOpened = {
                        storeOwner:owner.id,
                        admin:"cjv6z5pjs0aay0734ge2kfk00",
                        type:"OPEN",
                        content:"[관리자 변경] " + opened + "으로 변경",
                        version:"-"
                    }   
                }
            }
        }

        if(changeTextOwnerElapsedTime !== null){
            axios({
                "url":API_HOST + "/master/insertStoreOwnerLog",
                "method":"POST",
                "data":changeTextOwnerElapsedTime
            }).then(function(response){
            }).catch(function(error){
                console.log(error);
            })
        }

        if(changeTextOwnerStoreDiscount !== null){
            axios({
                "url":API_HOST + "/master/insertStoreOwnerLog",
                "method":"POST",
                "data":changeTextOwnerStoreDiscount
            }).then(function(response){

            }).catch(function(error){
                console.log(error);
            })
        }

        if(changeTextOwnerIsOpened !== null){
            axios({
                "url":API_HOST + "/master/insertStoreOwnerLog",
                "method":"POST",
                "data":changeTextOwnerIsOpened
            }).then(function(response){
                
            }).catch(function(error){
                console.log(error);
            })
        }

        resolve();
    })
}

function insertLog(storeId,diffContents){
    return new Promise(function(resolve,reject){
        let adminLogText = {
          type:"STM1",
          content:"[가맹점 수정]" + diffContents,
          adminId:'cjv6z5pjs0aay0734ge2kfk00',
          storeId:storeId
        }
        axios({
            "url":API_HOST + "/master/insertLog",
            "method":"post",
            "data": adminLogText
            // "params":{
            //     type:"ST01",
            //     content:logText,
            //     admin:sessionAdmin
            // }
        }).then(function(response){
            console.log(response);
            resolve();
        }).catch(function(error){
            console.log(error);
        })
    })
}


function saveProductCheckedData(id, status) {

    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/updateProductStatus",
            "method": "post",
            "params": {
                productId:id,
                status:status,
            }
        })
        .then(function (response) {
            resolve(response);
        });
    });
}

function saveLogoImage2(row,storeId){
    return new Promise((resolve) => {
        axios({
            "url":API_HOST + "/master/updateStoreLogoImage",
            "method":"post",
            "params":{
                storeId:storeId,
                logoImage:row
            }
        }).then(function (response){
            console.log(response);
            resolve(row);
        })
    })
}

function saveLogoImage(row,storeId){
    return new Promise((resolve) => {
        axios({
            "url":API_HOST + "/master/updateStoreLogoImage",
            "method":"post",
            "params":{
                storeId:storeId,
                logoImage:row
            }
        }).then(function (response){
            console.log(response);
            resolve(row);
        })
    })
}

function savePos(row) {
    console.log(row);
    let q = "";
    let updateBaseCode = "";
    if (row.type === "KIOSK") {
        updateBaseCode = "UP001";
    }
    else if (row.type === "POS") {
        updateBaseCode = "UP002";
    }

    let posParam = {};
    if (row.id === null) {
        //추가
        // q = 'mutation {' +
        //     ' insertPos (code:"' + row.code + '", name:"' + (row.name ? row.name : "") + '", model:"' + (row.model ? row.model : "") + '", type:"' + row.type + '", storeId:"' + row.store + '", mainImage:"' + row.mainImage + '", updateBaseCode: "' + updateBaseCode + '", version: "1.0.0.0", url: "", changelog: "", mandatory: ' + row.mandatory + ', uuid: "' + row.uuid + '") { id }' +
        // '}'
        posParam = {
            id:"",
            code:row.code,
            name:(row.name ? row.name : ""),
            model:(row.model ? row.model : ""),
            type:row.type,
            store:row.store,
            mainImage:row.mainImage,
            updateBaseCode:updateBaseCode,
            version:"1.0.0.0",
            url:"",
            changelog:"",
            mandatory:row.mandatory,
            uuid:row.uuid,
            logoImage:row.logoImage,
            logoImage2:row.logoImage2,
            canDiscount:row.canDiscount,
        }
    }
    else {
        //수정
        // q = 'mutation {' +
        //     ' updatePos (id: "' + row.id + '", code:"' + row.code + '", name:"' + (row.name ? row.name : "") + '", model:"' + (row.model ? row.model : "") + '", type:"' + row.type + '", storeId:"' + row.store + '", mainImage:"' + row.mainImage + '", updateBaseCode: "' + updateBaseCode + '", version: "1.0.0.0", url: "", changelog: "", mandatory: ' + row.mandatory + ', uuid: "' + row.uuid + '") { id }' +
        // '}'    
        posParam = {
            id:row.id,
            code:row.code,
            name:(row.name ? row.name : ""),
            model:(row.model ? row.model : ""),
            type:row.type,
            store:row.store,
            mainImage:row.mainImage,
            updateBaseCode:updateBaseCode,
            version:row.version,
            url:row.url,
            changelog:row.changelog,
            mandatory:row.mandatory,
            uuid:row.uuid,
            lastLiveData:row.lastLiveData,
            mac:row.mac,
            onoff:row.onoff,
        }
    }

    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/updatePos",
            "method": "post",
            "data": posParam
        })
        .then(function (response) {
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


// 주문 관련 시작
function setLogsStatus(status) {
    let result = "-";
    if (status == "STORE_LOGIN" || status == "LOGIN") {
        result = "로그인";
    }
    
    if (status == "STORE_WAIT") {
        result = "대기시간";
    }
    
    if (status == "STORE_DISCOUNT") {
        result = "할인정책";
    }
    
    if (status == "STORE_OPEN") {
        result = "오픈/마감";
    }
    
    if (status == "STORE_LIVE") {
        result = "LIVE체크";
    }
    
    return result;
}


function setProductName(row) {
    let items = row.items;
    if (items.length > 1) {
        if (items[0].products !== null && items[0].products !== undefined) {
            return items[0].products.name + " 외 " + (items.length - 1) + "건";
        }
        else {
            return items[0].productName + " 외 " + (items.length - 1) + "건";
        }
    }
    else {
        if (items[0].products !== null && items[0].products !== undefined) {
            return items[0].products.name;
        }
        else {
            return items[0].productName;
        }
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

function getQty(row) {
    let tot = 0;
    let items = row.items;
    for (let i=0; i<items.length; i++) {
        tot += items[i].qty;
    }
    return tot;
}

function getPrice(row) {
    let tot = 0;
    let items = row.items;
    for (let i=0; i<items.length; i++) {
        let t = items[i].price + getOptionPrice(items[i]);
        tot += t * items[i].qty;
    }
    return tot;
}

function getDiscount(row) {
    let tot = 0;
    let items = row.items;
    for (let i=0; i<items.length; i++) {
        tot += items[i].discount * items[i].qty;
    }
    return tot;
}

function getStoreDiscount(row) {
    let tot = 0;
    let items = row.items;
    for (let i=0; i<items.length; i++) {
        tot += items[i].storeDiscount * items[i].qty;
    }
    return tot;
}

function getGroupDiscount(row) {
    let tot = 0;
    let items = row.items;
    for (let i=0; i<items.length; i++) {
        tot += items[i].groupDiscount * items[i].qty;
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

const Store = ({ match }) => {
    const [login, setLogin] = useGlobalState('login');
    const [backdrop, setBackdrop] = useGlobalState('backdrop');
    const classes = useStyles();
    const theme = useTheme();
    const [updated, setUpdated] = React.useState(false);
    // 상점 변수 시작
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openDaumDialog, setOpenDaumDialog] = React.useState(false);
    const [openGroupDialog, setOpenGroupDialog] = React.useState(false);
    const [openRemoveDialog, setOpenRemoveDialog] = React.useState(false);
    const [openCategoryDialog, setOpenCategoryDialog] = React.useState(false);
    const [openCategoryEditDialog, setOpenCategoryEditDialog] = React.useState(false);
    const [openCategoryRemoveDialog, setOpenCategoryRemoveDialog] = React.useState(false);
    const [openOptionGroupDialog, setOpenOptionGroupDialog] = React.useState(false);
    const [openOptionItemDialog, setOpenOptionItemDialog] = React.useState(false);
    const [openProductBucketImageDialog, setOpenProductBucketImageDialog] = React.useState(false);
    const [openOrderDetailDialog, setOpenOrderDetailDialog] = React.useState(false);
    const [openExcelUploadDialog, setOpenExcelUploadDialog] = React.useState(false);
    const [bestMenuDialog,setBestMenuDialog] = React.useState(false);

    const [tmpCategoryIndex, setTmpCategoryIndex] = React.useState(0);
    const [tmpCategoryName, setTmpCategoryName] = React.useState("");

    const [tmpOptionGroup, setTmpOptionGroup] = React.useState({id: "", name: "", isUse: true, isRequired: true, isSingle: true, priority: 0 });
    const [tmpOption, setTmpOption] = React.useState({id: "", value: "", price: 0, priority: 0 });
    const [tmpOptionGroupIndex, setTmpOptionGroupIndex] = React.useState(0);

    const [menuTabValue, setMenuTabValue] = React.useState(0);
    const [productTabValue, setProductTabValue] = React.useState(0);
    const [checkedDevice, setCheckedDevice] = React.useState([1,2,3,4]);
    const [success, setSuccess] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackDuration, setSnackDuration] = React.useState(2000);
    const [name, setName] = React.useState("");
    const [originBucketImageList, setOriginBucketImageList] = React.useState([]);
    const [bucketImageList, setBucketImageList] = React.useState([]);
    const [tmpSelectedBucket, setTmpSelectedBucket] = React.useState("");
    const [bucketUrl, setBucketUrl] = React.useState("default");
    const [originStore, setOriginStore] = React.useState(null);
    const [store, setStore] = React.useState(null);
    const [originProducts, setOriginProducts] = React.useState(null);
    const [products, setProducts] = React.useState(null);
    const [product, setProduct] = React.useState(null);
    const [sortProduct, setSortProduct] = React.useState(0);
    
    const [originGroupName, setOriginGroupName] = React.useState("");
    const [groupName, setGroupName] = React.useState("");
    
    const [groups, setGroups] = React.useState(null);
    const [bases, setBases] = React.useState(null);
    const [options, setOptions] = React.useState(null);
    const [banks, setBanks] = React.useState(null);
    const [groupCodes, setGroupCodes] = React.useState(null);
    const [saleTypes, setSaleTypes] = React.useState([]);
    const [storeCategories, setStoreCategories] = React.useState([]);
    const [hasStoreMeta, setHasStoreMeta] = React.useState(false);
    // 상점 변수 끝


    // 주문 변수 시작    
    const [orderTabValue, setOrderTabValue] = React.useState(0);
    const [orders, setOrders] = React.useState([]);
    const [orderTotalCount, setOrderTotalCount] = React.useState(0);
    
    const [orderPage, setOrderPage] = React.useState(0);
    const [orderListCount, setOrderListCount] = React.useState(10);
    const [orderPageCount, setOrderPageCount] = React.useState(10);
    const [orderTotalPage, setOrderTotalPage] = React.useState(10);
    const [items, setItems] = React.useState([]);
    
    const [deviceTabValue, setDeviceTabValue] = React.useState({
        app: true,
        kiosk: true,
        posTab: true,
        tablet: true,
    });
    const [statusTabValue, setStatusTabValue] = React.useState({
        status00: true,
        status01: true,
        status03: true,
        status04: true,
        status10: true
    });

    const { app, kiosk, posTab, tablet } = deviceTabValue;
    const { status00, status01, status03, status04, status10 } = statusTabValue;
    // 주문 변수 끝
    

    // 로그 변수 시작    
    const [logs, setLogs] = React.useState([]);
    const [logTotalCount, setLogTotalCount] = React.useState(0);
    
    const [logPage, setLogPage] = React.useState(0);
    const [logListCount, setLogListCount] = React.useState(10);
    const [logPageCount, setLogPageCount] = React.useState(10);
    const [logTotalPage, setLogTotalPage] = React.useState(10);
    // 로그 변수 끝


    // 기기 관리 시작    
    const [poses, setPoses] = React.useState([]);
    const [pos, setPos] = React.useState({});
    const [posDialog, setPosDialog] = React.useState(false);
    // 기기 관리 끝

    // 스탬프 시작    
    const [stampMaster, setStampMaster] = React.useState({});
    const [couponGroups, setCouponGroups] = React.useState([]);
    const [couponType, setCouponType] = React.useState({});
    // 스탬프 끝

    //상품 변수 시작
    const [selectDeviceList,setSelectDeviceList] = React.useState([]);
    const [bestMenuList,setBestMenuList] = React.useState([]);
    const [removeBestMenuList,setRemoveBestMenuList] = React.useState([]);
    //상품 변수 끝

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        setBackdrop(true);
        loadData(match.params.id)
        .then((response) => {
            setData(response);
            setBackdrop(false);
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    function changeBestMenu(item,type){
        let bestMenuData = bestMenuList;
        let removeBestMenuData = removeBestMenuList;
        let oriItem = cloneObject(item);
        if(type === true){
            if(bestMenuData.length >= 3){
                setSnackMessage("베스트 메뉴는 최대 3개까지 등록가능합니다.");
                openSnackbar();
                return;
            }else{
                for(let i=0; i<bestMenuData.length; i++){
                    if(bestMenuData[i]['id'] === oriItem.id){  
                        setSnackMessage("이미 등록된 베스트 메뉴입니다.");
                        openSnackbar();
                        return;
                    }
                }
                oriItem.tag = "BEST"
                bestMenuData.push(oriItem);
                setSnackMessage("추가 완료.");
                openSnackbar();
            }
        }else{
            for(let i=0; i<bestMenuData.length; i++){
                if(bestMenuData[i]['id'] === oriItem.id){
                    oriItem.tag = oriItem.tag.replace("BEST","");
                    bestMenuData.splice(i,1);
                    removeBestMenuData.push(oriItem);
                }
            }
        }
        setBestMenuList(bestMenuData);
        setRemoveBestMenuList(removeBestMenuData);
        setUpdated(!updated);
    }

    function setPropertyCup(array) {
        return array.map((item) => {
            if (item.onlyTakeOut) {
                item.cup = 2
            }
            else if (item.onlyTakeIn) {
                item.cup = 1
            }
            else {
                item.cup = 0
            }
            return item;
        });
    }

    function setData(response) {
        console.log("store response", response);
        let data = response.data;
        let store = data.store;
        if(store.hasMembership === null){
            store.hasMembership = "NONE";
        }
        let products = data.store.products;

        products = setPropertyCup(products);
        doSortProducts(products);

        let groups = data.groups;
        let bases = data.bases;
        let options = data.options;
        let banks = data.banks;
        let groupCodes = data.groupCodes;
        let saleTypes = data.saleTypes;
        let storeCategories = data.storeCategories;

        let orders = data.orders.orders;
        let orderTotalCount = data.orders.totalCount;

        let orderTotalPagePlus = (orderTotalCount % orderListCount) > 0 ? 1 : 0;
        let orderTotalPage = parseInt(orderTotalCount / orderListCount) + orderTotalPagePlus;
        
        let logs = data.logs.storeOwnerLogs;
        let logTotalCount = data.logs.totalCount;

        let logTotalPagePlus = (logTotalCount % logListCount) > 0 ? 1 : 0;
        let logTotalPage = parseInt(logTotalCount / logListCount) + logTotalPagePlus;
        
        let poses = data.poses;
        let stampMasters = data.stampMaster;
        let couponTypes = data.couponTypes;
        let couponGroups = data.couponGroups;

        groups = groups.sort((a, b) => {
            return a.name < b.name ? -1 : 1;
        })

        products = products.filter((a) => a.status !== '-9');

        for(let i=0; i<orders.length; i++){
            let couponPrice = 0;
            for(let y=0; y<orders[i]['payment'].length; y++){
                if(orders[i]['payment'][y]['payMethod'] === "COUPON"){
                    couponPrice += orders[i]['payment'][y]['price'];
                }
            }
            orders[i]['storeDiscount'] = orders[i]['storeDiscount'] + couponPrice;
        }

        for (let i=0; i<products.length; i++) {
            if (products[i].productOptionGroups.length > 0) {
                products[i].productOptionGroups = products[i].productOptionGroups.sort((a, b) => {
                    if (a.priority < b.priority) return -1;
                    if (a.priority > b.priority) return 1;
                    if (a.createdAt < b.createdAt) return -1;
                    if (a.createdAt > b.createdAt) return 1;
                    return 0;
                });
                for (let j=0; j<products[i].productOptionGroups.length; j++) {
                    products[i].productOptionGroups[j].productOptionItems = products[i].productOptionGroups[j].productOptionItems.sort((a, b) => {
                        if (a.priority < b.priority) return -1;
                        if (a.priority > b.priority) return 1;
                        if (a.createdAt < b.createdAt) return -1;
                        if (a.createdAt > b.createdAt) return 1;
                        return 0;
                    });
                }
            }
        }
        
        setGroups(groups);
        setBases(bases);
        setOptions(options);
        setBanks(banks);
        setSaleTypes(saleTypes);
        setStoreCategories(storeCategories);
        setGroupCodes(groupCodes);

        setOriginStore(cloneObject(store));
        setStore(store);
        setName(store.name);
        setOriginProducts(cloneObject(products));
        setProducts(products);

        setOrders(orders);
        setOrderTotalCount(orderTotalCount);
        setOrderTotalPage(orderTotalPage);

        setLogs(logs);
        setLogTotalCount(logTotalCount);
        setLogTotalPage(logTotalPage);

        setPoses(poses);

        if (stampMasters !== 0) {
            setStampMaster(stampMasters);
        }
        else {
            let obj = {
                stampMaxCount: 0,
                stampCardExpireDate: 0,
                stampExpireDate: 0
            }
            setStampMaster(obj);
        }

        setCouponGroups(couponGroups);
        if (couponTypes.length > 0) {
            for (let i=0; i<couponGroups.length; i++) {
                for (let j=0;j<couponTypes.length; j++) {
                    if (couponTypes[j].couponGroup === couponGroups[i].id) {
                        setCouponType(couponTypes[j]);
                    }
                }
            }
        }
        else {
            let obj = {
                name: store.name + " 스탬프 쿠폰",
                companyType: "TIMEORDER",
                type: "01",
                couponDayType: "00",
                couponAmount: 0,
                description: ""
            }
            setCouponType(obj);
        }

        if (store.group !== null) {
            for (let i=0; i<groups.length; i++) {
                if (store.group === groups[i].id) {
                    setGroupName(groups[i].name);
                    setOriginGroupName(groups[i].name);
                    break;
                }
            }
        }

        doLoadS3(store);
    }

    const doLoadS3 = (store) => {        
        // Bucket 폴더 찾기
        axios({
            "url": API_HOST + "/master/loadSettingAndStoreMeta",
            "method": "post",
            "params": {
                code:"AWS_S3_JSON",
                storeId:match.params.id,
            }
        })
        .then(response => {
            console.log(response);
            setHasStoreMeta(response.data.storeMetas.length > 0);
            return JSON.parse(response.data.settings.value)
        })
        .then(result => {
            let bucket = result.find((item) => {
                if (store.group === null) {
                    return false;
                }
                return item.group === store.group
            })

            let bucketUrl = bucket === undefined ? "default" : bucket.bucket;
            setBucketUrl(bucketUrl);

            s3().listObjectsV2({
                    Bucket: "timeorder",
                    Prefix: bucketUrl
                },
                (err, data) => {
                    if (err) {
                        throw err;
                    }
                    var imageFix = [".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG", ".bmp", ".gif"];
                    let contents = data.Contents.filter((item) => {
                        let key = item.Key;
                        let result = imageFix.some(el => key.includes(el));
                        return result;
                    });
                    let bucketImages = [];
                    contents.forEach((content) => {
                        bucketImages.push(content.Key); // "ex) content.Key => assets/images/1.png"
                    });
                    bucketImages = bucketImages.sort((a, b) => {
                        return getBucketName(a) < getBucketName(b) ? -1 : 1;
                    })

                    setOriginBucketImageList(bucketImages);
                    setBucketImageList(bucketImages);
                }
            );
            // setBucket(bucket.bucket);
        });
    }

    const changeStoreValue = (prop) => (event) => {
        setStore({ ...store, [prop]: event.target.value });
    };

    const changeStoreValueDirect = (prop, value) => {
        setStore({ ...store, [prop]: value });
    };

    const changeStoreColor = (prop) => (event) => {
        console.log(event);
        console.log(event.target);
        console.log(event.target.value);
        console.log(document.getElementById("storecolor").value);
        // return;
        // console.log(event.target.value);
        // console.log(prop);
        // let storeColorData = event.hex;
        // if(storeColorData !== "" && storeColorData !== null && storeColorData.substring(0,1) !== "#"){
        let storeColorData = event.target.value;
        // }
        // setStoreColor(storeColorData);
        setStore({...store, [prop] : storeColorData});
    }
    const changeStoreDiscountStartValue = (value) => {
        let date = value.format("YYYYMMDD") + "000000";
        let discountStart = date;
        setStore({ ...store, discountStart });
    };
    const changeStoreDiscountEndValue = (value) => {
        let date = value.add(1, 'day').format("YYYYMMDD") + "000000";
        let discountEnd = date;
        setStore({ ...store, discountEnd });
    };

    const changeProductValue = (prop) => (event) => {
        setProduct({ ...product, [prop]: event.target.value });
    };

    const changeSelectDevice = (event) => {
        // console.log(event);
        // console.log(selectDeviceList);
        // let selectDevice = "";
        // for(let i=0; i<event.target.value.length; i++){
        //     selectDevice = event.target.value[i] + ",";
        // }
        // setSelectDeviceList(event.target.value);
        setProduct({ ...product, device: event.target.value });
      };

    const changeProductOptionGroupValue = (prop) => (event) => {
        setTmpOptionGroup({ ...tmpOptionGroup, [prop]: event.target.value });
    };

    const changeProductOptionValue = (prop) => (event) => {
        setTmpOption({ ...tmpOption, [prop]: event.target.value });
    };

    const changeProductCategoryValue = (id) => (event) => {
        let productCategory = null;

        for (let i=0; i<store.productCategory.length; i++) {
            if (store.productCategory[i].id === event.target.value) {
                productCategory = store.productCategory[i];
                break;
            }
        }
        if (id === undefined) {
            if (productCategory !== null) {
                setProduct({ ...product, ["productCategory"]: productCategory });
            }
        }
        else {
            setProducts(origin => {
                let list = origin.map((item) => {
                    if (id === item.id) {
                        if (item['productCategory'] === null) {
                            item['productCategory'] = { id: "" };
                        }
                        item['productCategory'] = productCategory;
                    }
                    return item;
                });
                
                // products = products.filter((item) => {
                //     if (null === item.productCategory) {
                //         return false;
                //     }
                //     return item.productCategory.id === id
                // });

                return list;
            });
            doChangeSortProduct();
        }
    };


    const preventParent = (event) => {
        event.stopPropagation();
    }

    const changeProductsChecked = (prop, i) => (event) => {
        let value = event.target.value;
        let id = products[i]["id"];

        saveProductCheckedData(id, value)
        .then(() => {
            setProducts(origin => {
                let list = origin.map((item, idx) => {
                    if (i === idx)
                        item[prop] = value;
                    return item;
                });
                        
                setOriginProducts(cloneObject(list));

                // products = products.filter((item) => {
                //     if (null === item.productCategory) {
                //         return false;
                //     }
                //     return item.productCategory.id === id
                // });
                
                return list;
            });
            doChangeSortProduct();
        });
    };
    
    const changeProductChecked = (event) => {
        let checked = event.target.value;
        setProduct({ ...product, ["status"]: checked});
    }

    const doSaveData = () => {
        new Promise((resolve) => {
            let isChangedImage = !(originStore.images === store.images);

            if (isChangedImage) {
                let files = document.getElementById("store-images").files;

                var file = files[0];
                let fileName = file.name;
                let albumPhotosKey = encodeURIComponent("stores") + "/" + encodeURIComponent(store.code) + "/" + encodeURIComponent("profile") + "/";

                var photoKey = albumPhotosKey + fileName;

                s3().upload({
                        Bucket: "timeorder",
                        Key: photoKey,
                        Body: file,
                        ACL: "public-read-write"
                    },
                    function(err, data) {
                        if (err) {
                            console.log(err);
                        }
                        console.log("S3 Upload", data);
                        changeStoreValueDirect("images", data.Location);
                        resolve(data.Location);
                    }
                );
            }
            else {
                resolve();
            }
        })
        .then((location) => {
            // setStore 비동기처리를 잡을 수 없어서, setStore와 동시에 같이 진행이됨
            // images 값은 변경이 안되어있기 때문에, 복제해서 같이 진행
            let copyStore = cloneObject(store);
            if (location !== undefined) {
                copyStore.images = location
            }
            saveData(originStore, copyStore)
            .then((response) => {
                console.log(response);
                let groupCodeRet = -1;
                for(let i=0; i<groupCodes.length; i++){
                    if(groupCodes[i]['code'] === response.data.groupDiscountCode){
                        groupCodeRet = 1;
                    }
                }
                setSnackMessage("저장 성공");
                console.log(response.data.groupDiscountCode);
                if(response.data.groupDiscountCode !== "" && response.data.groupDiscountCode !== null && groupCodeRet === -1){
                    setSnackMessage("해당 그룹 할인 코드를 찾을수 없습니다.");            
                    openSnackbar();
                }else if(response.data.groupDiscountCode !== "" && response.data.groupDiscountCode !== null && groupCodeRet ===1){
                    updateGroupCode(response);
                    // setSnackMessage("저장 성공");
                }else if (response.data.groupDiscountCode === ""){
                    console.log("deleteGroupCoed");
                    deleteGroupCode(response);
                }

                // setSnackMessage("저장 성공");
                doLoadS3(copyStore);
                openSnackbar();
            });
        })
    }


    // 탭 이벤트 시작
    const changeMenuTabs = (event, value) => {
        setMenuTabValue(value);
    }

    const changeProductTabs = (event, value) => {
        setProductTabValue(value);

        setProducts(cloneObject(originProducts));
        if (value !== 0) {
            let id = store.productCategory[value-1].id;
            
            setProducts(origin => {
                let list = origin.filter((item) => {
                    if (null === item.productCategory) {
                        return false;
                    }
                    return item.productCategory.id === id
                });
                
                return list;
            });
            doChangeSortProduct();
        }
    }
    // 탭 이벤트 끝

    //베스트 메뉴 다이얼로그
    const doOpenBestMenuDialog = () => (event) =>{
        event.preventDefault();
        let bestMenuData = [];
        for(let i=0; i<products.length; i++){
            if(products[i].tag !== null && products[i].tag.indexOf("BEST") > -1){
                bestMenuData.push(products[i]);
            }
        }
        setBestMenuList(bestMenuData);
        setBestMenuDialog(true);
    }

    // 상품 다이얼로그 시작
    const doOpenDialog = (id) => (event) => {
        event.preventDefault();
        console.log("doOpenDialog:id", id);
        let selected = products.find(item => {
            return item.id === id;
        });
        console.log(selected);

        if (selected !== undefined && selected !== null) {
            let deviceList = selected.device.split(",");
            console.log(deviceList);
            let checkedDeviceList = [];
            for(let i=0; i<deviceList.length; i++){
                if(deviceList[i] === "APP"){
                    checkedDeviceList.push(4);
                }
                if(deviceList[i] === "KIOSK"){
                    checkedDeviceList.push(2);
                    
                }
                if(deviceList[i] === "POS"){
                    checkedDeviceList.push(3);
                }
            }
            setCheckedDevice(checkedDeviceList);
            setProduct(selected);
        }
        else {
            let newProduct = {
                name: "",
                images: "",
                productCategory: productTabValue === 0 ? { id:"" } : store.productCategory[productTabValue - 1],
                price: 0,
                priority: 99,
                canDiscount: true,
                canGroupDiscount: true,
                canMembership: true,
                productOptionGroups: [],
                status: "1",
                cup: "0",
                description: "",
                device:[],
                tag: "",
                linkCode: null
            }
            setProduct(newProduct);
        }
        setOpenDialog(true);
    }
    const doCloseDialog = () => {
        // 현재 보여지는 탭 값의 필터링
        let cloneProducts = originProducts.filter((item) => {
            if (null === item.productCategory) {
                return true;
            }
            else {
                if (productTabValue > 0) {
                    return item.productCategory.id === store.productCategory[productTabValue - 1].id;
                }
                else {
                    return true;
                }
            }
        });

        setProducts(cloneProducts);
        setOpenDialog(false);
    }

    const doCloseBestMenuDialog = () => {
        // 현재 보여지는 탭 값의 필터링
        let cloneProducts = originProducts.filter((item) => {
            if (null === item.productCategory) {
                return true;
            }
            else {
                if (productTabValue > 0) {
                    return item.productCategory.id === store.productCategory[productTabValue - 1].id;
                }
                else {
                    return true;
                }
            }
        });

        setProducts(cloneProducts);
        setBestMenuDialog(false);
    }
    
    const doOpenRemoveDialog = () => {
        setOpenRemoveDialog(true);
    }

    const doCloseRemoveDialog = () => {
        setOpenRemoveDialog(false);
    }

    const doDeleteDialog = () => {
        let copyOriginProducts = cloneObject(originProducts);
        let copyProducts = cloneObject(products);

        let q = 'mutation {' +
            ' updateProduct (id: "' + product.id + '" status: "-9") { id }' +
        '}'
    
        for (let i=0; i<copyOriginProducts.length; i++) {
            if (copyOriginProducts[i].id === product.id) {
                copyOriginProducts[i].status = "-9";
            }
        }

        for (let i=0; i<copyProducts.length; i++) {
            if (copyProducts[i].id === product.id) {
                copyProducts[i].status = "-9";
            }
        }

        copyOriginProducts = copyOriginProducts.filter((a) => a.status !== '-9');
        copyProducts = copyProducts.filter((a) => a.status !== '-9');

        setOriginProducts(copyOriginProducts);
        setProducts(copyProducts);

        return new Promise((resolve, reject) => {
            axios({
                "url": API_HOST + "/master/updateProductStatus",
                "method": "post",
                "params": {
                    productId:product.id,
                    status:"-9"
                }
            })
            .then(function (response) {
                resolve(response);
                
                setOpenDialog(false);
                setOpenRemoveDialog(false);
            });
        });
    }

    const doSaveBestMenuDialog = () => {
        let paramData = bestMenuList.concat(removeBestMenuList);
        let productParam = products;
      axios({
        "url":API_HOST + "/master/updateProductTag",
        "method":"post",
        "data":paramData
      }).then(function(response){
        console.log(response);
        if(response.data === 1){
            setSnackMessage("저장 성공");
            openSnackbar();
            doCloseBestMenuDialog();
        }else{
            setSnackMessage("저장 실패");
            openSnackbar();
            doCloseBestMenuDialog();
        }
        for(let i=0; i<productParam.length; i++){
            for(let z=0; z<paramData.length; z++){
                if(productParam[i]['id'] === paramData[z]['id']){
                    productParam[i]['tag'] = paramData[z]['tag'];
                }
            }
        }
        setProducts(productParam);
        setBestMenuList([]);
        setRemoveBestMenuList([]);
      });
    }

    const doSaveDialog = () => {
        let copyProduct = cloneObject(product);
        let copyProductOptionGroups = cloneObject(product.productOptionGroups);
        console.log(copyProduct);
        if(copyProduct.productCategory.id === ""){
            setSnackMessage("카테고리를 선택해주세요.");
            openSnackbar();
            return;
        }
        
        if (copyProduct.productOptionGroups.length > 0) {
            copyProduct.productOptionGroups = copyProduct.productOptionGroups.sort((a, b) => {
                if (a.priority < b.priority) return -1;
                if (a.priority > b.priority) return 1;
                if (a.createdAt < b.createdAt) return -1;
                if (a.createdAt > b.createdAt) return 1;
                return 0;
            });
            for (let j=0; j<copyProduct.productOptionGroups.length; j++) {
                copyProduct.productOptionGroups[j].productOptionItems = copyProduct.productOptionGroups[j].productOptionItems.sort((a, b) => {
                    if (a.priority < b.priority) return -1;
                    if (a.priority > b.priority) return 1;
                    if (a.createdAt < b.createdAt) return -1;
                    if (a.createdAt > b.createdAt) return 1;
                    return 0;
                });
            }
        }

        function saveFinish(newProductId, newCreatedAt) {
            console.log(newProductId, newCreatedAt);
            let copyOriginProducts = cloneObject(originProducts);
            let copyProducts = cloneObject(products);

            if (isNaN(parseInt(copyProduct.id)) && copyProduct.id !== undefined) {
                // 기존 상품 수정시
                let originProduct = copyOriginProducts.filter(a => a.id === copyProduct.id)[0];
                
                console.log("saveFinish", originProduct);
                console.log("saveFinish", copyProduct);
            
                let diffContents = "";
                
                let diffContentProduct = diffObjectString(originProduct, copyProduct);
                if (diffContentProduct !== "") {
                    diffContents += " (메뉴 수정)" + diffContentProduct;
                }

                console.log(originProduct.productOptionGroups);
                console.log(copyProduct.productOptionGroups);

                let diffContentGroups = diffArrayString(originProduct.productOptionGroups, copyProduct.productOptionGroups);
                if (diffContentGroups !== "") {
                    diffContents += " (메뉴 옵션 그룹 수정)" + diffContentGroups;
                }

                let diffContentItems = "";
                for (let i=0; i<copyProduct.productOptionGroups.length; i++) {
                    try {
                        diffContentItems += diffArrayString(originProduct.productOptionGroups[i].productOptionItems, copyProduct.productOptionGroups[i].productOptionItems);
                    }
                    catch (e) {

                    }
                }
                if (diffContentItems !== "") {
                    diffContents += " (메뉴 옵션 수정)" + diffContentItems;
                }

                console.log("diffContents", diffContents);

                if (diffContents !== "") {
                    let paramData = {
                        type:"STM1",
                        adminId:"cjv6z5pjs0aay0734ge2kfk00",
                        target:store.id,
                        content:"[가맹점 메뉴 수정] {'" + copyProduct.name + "'}'" + diffContents +"'",
                    }
                    axios({
                        "url": API_HOST + "/master/insertLog",
                        "method": "post",
                        "data": paramData
                    })
                    .then(function (response) {
        
                    });
                }
                
                copyOriginProducts = copyOriginProducts.map(obj => {
                    return copyProduct.id === obj.id ? copyProduct : obj;
                });
                copyProducts = copyProducts.map(obj => {
                    return copyProduct.id === obj.id ? copyProduct : obj;
                });

            }
            else {
                // 상품 추가시
                copyProduct.id = newProductId;
                copyProduct.createdAt = newProductId;
                copyOriginProducts.push(copyProduct);
                copyProducts.push(copyProduct);

                // axios({
                //     "url": API_SERVER_URL,
                //     "method": "post",
                //     "data": {
                //         query: 'mutation { ' + 
                //         ' insertAdminLog(type:"STM0" adminId: "cjv6z5pjs0aay0734ge2kfk00" target:"' + store.id + '" ip:"" content:"[가맹점 메뉴 추가]' + JSON.stringify(copyProduct) + '") { id } }'
                //     }
                // })
                let paramData = {
                    type:"STM1",
                    adminId:"cjv6z5pjs0aay0734ge2kfk00",
                    target:store.id,
                    content:"[가맹점 메뉴 추가] {'" + copyProduct.name + "'}'" + JSON.stringify(copyProduct) +"'",
                }
                axios({
                    "url": API_HOST + "/master/insertLog",
                    "method": "post",
                    "data": paramData
                })
                .then(function (response) {
    
                });
            }

            if (productTabValue !== 0) {
                copyProducts = copyProducts.filter((item) => {
                    if (null === item.productCategory) {
                        return false;
                    }
                    return item.productCategory.id === store.productCategory[productTabValue - 1].id
                });
            }

            doSortProducts(copyOriginProducts);
            doSortProducts(copyProducts);

            setOriginProducts(copyOriginProducts);
            setProducts(copyProducts);
            
            setOpenDialog(false);
            
            setSnackMessage("상품이 저장됨");
            openSnackbar();
        }

        let takeCondition = "";
        if (copyProduct.cup === 1 || copyProduct.cup === "1") {
            takeCondition = "onlyTakeIn:true onlyTakeOut:false ";
        }
        else if (copyProduct.cup === 2 || copyProduct.cup === "2") {
            takeCondition = "onlyTakeIn:false onlyTakeOut:true ";
        }
        else {
            takeCondition = "onlyTakeIn:false onlyTakeOut:false ";
        }

        if (copyProduct.description === null) {
            copyProduct.description = "";
        }

        if (copyProduct.tag === null) {
            copyProduct.tag = "";
        }

        new Promise((resolve, reject) => {
            let date = new Date();

            if(copyProduct.canDiscount === null){
                copyProduct.canDiscount = "true";
                copyProduct.canGroupDiscount = "true";
            }
            if(copyProduct.canMembership === null){
                copyProduct.canMembership = "true";
            }
            copyProduct.productCategoryId = copyProduct.productCategory.id;
            copyProduct.store = store.id;
            copyProduct.description = copyProduct.description.replace(/\"/g, "\\\"");
            copyProduct.updatedAt = date;
            let deviceCVS = "";
            for(let i=0; i<checkedDevice.length; i++){
                if(checkedDevice[i] === 2){
                    deviceCVS += "KIOSK,";
                }else if(checkedDevice[i] === 3){
                    deviceCVS += "POS,";
                }else if(checkedDevice[i] === 4){
                    deviceCVS += "APP,";
                }
            }
            deviceCVS = deviceCVS.slice(0,-1);
            copyProduct.device = deviceCVS;
            axios({
                "url":API_HOST + "/master/updateItem",
                "method":"post",
                "data": copyProduct
            }).then(function (response){
                // response.productOptionGroups = copyProductOptionGroups
                resolve(response);
            });


            // axios({
            //     "url": API_SERVER_URL,
            //     "method": "post",
            //     "data": {
            //         query: qSaveProduct
            //     }
            // })
            // .then(function (response) {
            //     resolve(response);
            // });
        })
        .then((response) => {
            console.log("SaveProduct", response);
            let productId = "";
            let newProductId = undefined;
            let newCreatedAt = undefined;
            
            if (isNaN(parseInt(copyProduct.id)) && copyProduct.id === undefined) {
                newProductId = response.data.id;
            }

            let productOptionGroups = copyProduct.productOptionGroups;
            if (productOptionGroups.length === 0) {
                // 옵션그룹 추가가 따로 없었을 경우 종료
                console.log("1", newProductId);
                saveFinish(newProductId, newCreatedAt);
                return;
            }

            if (copyProduct.id !== undefined) {
                productId = response.data.id;
            }
            else {
                productId = response.data.id;
            }



            let delGroup = [];
            let delItem = [];
            let updateGroup = [];
            let updateItem = [];
            for (let i=0; i<productOptionGroups.length; i++) {
                let id = productOptionGroups[i].id.replace("add_", "");
                productOptionGroups[i].product = productId;
                console.log("123213213");
                console.log(id);
                console.log(isNaN(parseInt(id)));
                if (isNaN(parseInt(id))) {
                    if (productOptionGroups[i].delete !== undefined) {
                        delGroup.push(productOptionGroups[i]);
                    }
                    else {
                        updateGroup.push(productOptionGroups[i]);
                    }
                }
                else {
                    if (!(productOptionGroups[i].delete !== undefined && productOptionGroups[i].delete)) {
                        productOptionGroups[i].id = "";
                        updateGroup.push(productOptionGroups[i]);
                    }else{
                        delGroup.push(productOptionGroups[i]);
                    }
                }
            }

            console.log("updateGroup",updateGroup);


            // productOptionGroups = copyProduct.productOptionGroups;

            if (productOptionGroups.length === 0) {
                saveFinish(newProductId, newCreatedAt);
                return;
            }
            
            // 3. 상품 옵션 그룹의 아이템 추가 or 수정
            let qSaveProductOptionItems = 'mutation { ';
            for (let i=0; i<productOptionGroups.length; i++) {
                let productOptionItems = productOptionGroups[i].productOptionItems;

                if (productOptionItems.length > 0) {    

                    for (let j=0; j<productOptionItems.length; j++) {
                        productOptionItems[j].productOptionGroup = "";
                        let id = productOptionItems[j].id.replace("add_", "");
                        if (isNaN(parseInt(id))) {
                            // productOptionItems[j].id = "";
                            if (productOptionItems[j].delete !== undefined) {
                                delItem.push(productOptionItems[j]);
                            }
                            else {
                                // productOptionItems[j]['id'] = "";
                                updateItem.push(productOptionItems[j]);
                            }
                        }
                        else {
                            // productOptionItems[j].id = "";
                            if (!(productOptionItems[j].delete !== undefined && productOptionItems[j].delete)) {
                                productOptionItems[j].id = "";
                                updateItem.push(productOptionItems[j]);
                            }else{
                                delItem.push(productOptionItems[j]);
                            }
                        }
                    }
                }
            }

            new Promise((resolve, reject) => {
                axios({
                    "url": API_HOST + "/master/updateOptionGroup",
                    "method": "post",
                    "data": updateGroup
                })
                .then(function (response) {
                    resolve(response);
                });
            })
            .then((response) => {
                console.log("SaveProductOptionItems", response);
                // 상품 옵션그룹 아이템 저장완료
                let result = response.data;
                let productOptionGroups = copyProduct.productOptionGroups;
                let paramData = {
                    productOptionGroups:delGroup,
                    productOptionItems:delItem,
                    productId:copyProduct.id,
                }
                axios({
                    "url":API_HOST + "/master/deleteOption",
                    "method":"post",
                    "data":paramData
                }).then(function(response){
                    console.log(response);
                })
                for (let key in result) {
                    if (key.includes("i")) {
                        let idx = key.replace("i", "");
                        let i = idx.split("_")[0];
                        let j = idx.split("_")[1];
                        productOptionGroups[i].productOptionItems[j].id = result[key].id;
                    }
                }

                console.log("최종 copyProduct", copyProduct);

                saveFinish(newProductId, newCreatedAt);
            });
































            //--------------------------------------------------------------------------------------------
            
            // 2. 상품 옵션 그룹 추가 or 수정
            // let qSaveProductOptionGroup = 'mutation { ';
            // for (let i=0; i<copyProduct.productOptionGroups.length; i++) {
            //     console.log("21323213213");
            //     console.log(copyProduct.productOptionGroups);
            //     let id = copyProduct.productOptionGroups[i].id.replace("add_", "");
            //     if (isNaN(id)) {
            //         if (copyProduct.productOptionGroups[i].delete !== undefined) {
            //             qSaveProductOptionGroup += ' d' + i + ':deleteProductOptionGroup (' +
            //                                         'id: "' + id + '" ' +
            //                                     ') { id }';
            //         }
            //         else {
            //             qSaveProductOptionGroup += ' u' + i + ':updateProductOptionGroup (' +
            //                                         'id: "' + id + '" ' +
            //                                         'name: "' + copyProduct.productOptionGroups[i].name + '" ' +
            //                                         'type: "' + copyProduct.productOptionGroups[i].type + '" ' +
            //                                         'isUse: ' + copyProduct.productOptionGroups[i].isUse + ' ' +
            //                                         'isRequired: ' + copyProduct.productOptionGroups[i].isRequired + ' ' +
            //                                         'isSingle: ' + copyProduct.productOptionGroups[i].isSingle + ' ' +
            //                                         'priority: ' + copyProduct.productOptionGroups[i].priority + ' ' +
            //                                     ') { id }';
            //         }
            //     }
            //     else {
            //         if (!(copyProduct.productOptionGroups[i].delete !== undefined && copyProduct.productOptionGroups[i].delete)) {
            //             qSaveProductOptionGroup += ' i' + i + ':insertProductOptionGroup (' +
            //                                         'name: "' + copyProduct.productOptionGroups[i].name + '" ' +
            //                                         // 'type: "' + copyProduct.productOptionGroups[i].type + '" ' +
            //                                         'isUse: ' + copyProduct.productOptionGroups[i].isUse + ' ' +
            //                                         'isRequired: ' + copyProduct.productOptionGroups[i].isRequired + ' ' +
            //                                         'isSingle: ' + copyProduct.productOptionGroups[i].isSingle + ' ' +
            //                                         'priority: ' + copyProduct.productOptionGroups[i].priority + ' ' +
            //                                         'productId: "' + productId + '" ' +
            //                                     ') { id }';
            //         }
            //     }
            // }
            // qSaveProductOptionGroup += '}';

            // // 상품 저장완료
            // new Promise((resolve, reject) => {
            //     axios({
            //         "url": API_SERVER_URL,
            //         "method": "post",
            //         "data": {
            //             query: qSaveProductOptionGroup
            //         }
            //     })
            //     .then(function (response) {
            //         resolve(response);
            //     });
            // })
            // .then((response) => {
            //     console.log("SaveProductOptionGroup", response);
            //     // 상품 옵션그룹 저장완료
            //     let result = response.data.data;
            //     let productOptionGroups = copyProduct.productOptionGroups;

            //     if (productOptionGroups.length === 0) {
            //         saveFinish(newProductId, newCreatedAt);
            //         return;
            //     }
                
            //     for (let key in result) {
            //         if (key.includes("i")) {
            //             let idx = parseInt(key.replace("i", ""));
            //             productOptionGroups[idx].id = result[key].id;
            //         }
            //     }

            //     console.log(productOptionGroups);

            //     // 3. 상품 옵션 그룹의 아이템 추가 or 수정
            //     let isKeepGoSaveItems = false;
            //     let qSaveProductOptionItems = 'mutation { ';

            //     for (let i=0; i<productOptionGroups.length; i++) {
            //         let productOptionItems = productOptionGroups[i].productOptionItems;

            //         if (productOptionItems.length > 0) {
            //             isKeepGoSaveItems = true;

            //             for (let j=0; j<productOptionItems.length; j++) {
            //                 console.log(productOptionItems[j].id);
            //                 let id = productOptionItems[j].id.replace("add_", "");
            //                 if (isNaN(parseInt(id))) {
            //                     if (productOptionItems[j].delete !== undefined) {
            //                         qSaveProductOptionItems += ' d' + i + '_' + j + ':deleteProductOptionItem (' +
            //                                                     'id: "' + id + '" ' +
            //                                                 ') { id }';
            //                     }
            //                     else {
            //                         qSaveProductOptionItems += ' u' + i + '_' + j + ':updateProductOptionItem (' +
            //                                                     'id: "' + id + '" ' +
            //                                                     'value: "' + productOptionItems[j].value + '" ' +
            //                                                     'type: "' + productOptionItems[j].type + '" ' +
            //                                                     'price: ' + productOptionItems[j].price + ' ' +
            //                                                     'priority: ' + productOptionItems[j].priority + ' ' +
            //                                                     'linkCode: "' + productOptionItems[j].linkCode + '" ' +
            //                                                 ') { id }';
            //                     }
            //                 }
            //                 else {
            //                     if (!(productOptionItems[j].delete !== undefined && productOptionItems[j].delete)) {
            //                         qSaveProductOptionItems += ' i' + i + '_' + j + ':insertProductOptionItem (' +
            //                                                     'value: "' + productOptionItems[j].value + '" ' +
            //                                                     // 'type: "' + productOptionItems[j].type + '" ' +
            //                                                     'price: ' + productOptionItems[j].price + ' ' +
            //                                                     'priority: ' + productOptionItems[j].priority + ' ' +
            //                                                     'productOptionGroupId: "' + productOptionGroups[i].id + '" ' +
            //                                                     'linkCode: "' + productOptionItems[j].linkCode + '" ' +
            //                                                 ') { id }';
            //                     }
            //                 }
            //             }
            //         }
            //     }
            //     qSaveProductOptionItems += '}';

            //     if (!isKeepGoSaveItems) {
            //         saveFinish(newProductId, newCreatedAt);
            //         return;
            //     }

            //     new Promise((resolve, reject) => {
            //         axios({
            //             "url": API_SERVER_URL,
            //             "method": "post",
            //             "data": {
            //                 query: qSaveProductOptionItems
            //             }
            //         })
            //         .then(function (response) {
            //             resolve(response);
            //         });
            //     })
            //     .then((response) => {
            //         console.log("SaveProductOptionItems", response);
            //         // 상품 옵션그룹 아이템 저장완료
            //         let result = response.data.data;
            //         let productOptionGroups = copyProduct.productOptionGroups;
    
            //         for (let key in result) {
            //             if (key.includes("i")) {
            //                 let idx = key.replace("i", "");
            //                 let i = idx.split("_")[0];
            //                 let j = idx.split("_")[1];
            //                 productOptionGroups[i].productOptionItems[j].id = result[key].id;
            //             }
            //         }

            //         console.log("최종 copyProduct", copyProduct);

            //         saveFinish(newProductId, newCreatedAt);
            //     });
            // });
        });
    }

    const doCheckProductImage = (file) => {
        return new Promise((resolve, reject) => {            
            let img = new Image();
            var objectUrl = window.URL.createObjectURL(file);
            img.onload = function () {
                console.log(this);
                let obj = {
                    width: this.width,
                    height: this.height
                }
                resolve(obj);
            };
            img.onerror = function() {
                reject();
            }

            img.src = objectUrl;
        })

    }

    const doUploadProductImage = () => {
        try {
            let files = document.getElementById("product-images").files;
    
            var file = files[0];
            let fileName = file.name;

            if (file.size > 524288) {
                alert("용량은 512kb를 넘길 수 없습니다");
            }
            else {
                doCheckProductImage(file)
                .then((response) => {
                    if (response.width <= 1280 && response.height <= 720) {
                        // let albumPhotosKey = encodeURIComponent("stores") + "/" + encodeURIComponent(store.code) + "/" + encodeURIComponent("profile") + "/";
                        let albumPhotosKey = bucketUrl + "/";
                
                        var photoKey = albumPhotosKey + fileName;
                        console.log(files);
                
                        s3().upload({
                                Bucket: "timeorder",
                                Key: photoKey,
                                Body: file,
                                ACL: "public-read-write"
                            },
                            function(err, data) {
                                if (err) {
                                    console.log(err);
                                }
                                console.log("S3 Upload", data);
                                doLoadS3(store);
                                // resolve(data.Location);
                            }
                        );
                    }
                    else {
                        alert("이미지는 1280 * 720 크기를 넘길 수 없습니다.");
                        return;
                    }
                })
                .catch(() => {
                    alert("이미지 업로드가 실패되었습니다");
                });
            }
        }
        catch (e) {

        }
    }

    
    // 상품 다이얼로그 끝

    const doChangeSortProduct = (event) => {
        let sortType = sortProduct;

        if (event !== undefined) {
            sortType = event.target.value;
            setSortProduct(sortType);
        }

        let sort = funcSort(sortType);

        products.sort(sort);
        originProducts.sort(sort);

        setUpdated(!updated);
    }

    const doSortProducts = (products) => {
        let sortType = sortProduct;
        let sort = funcSort(sortType);
        
        products.sort(sort);

        setUpdated(!updated);
    }

    const funcSort = (sortType) => {
        switch(sortType) {
            case 0:
            default:
                return (a, b) => {
                    if (a.status < b.status) return 1;
                    if (a.status === -1 || a.status > b.status) return -1;
                    if (a.priority > b.priority) return 1;
                    if (a.priority < b.priority) return -1;
                    if (a.createdAt < b.createdAt) return 1;
                    if (a.createdAt > b.createdAt) return -1;
                    if (a.productCategory !== null && b.productCategory !== null) {
                        if (a.productCategory.priority > b.productCategory.priority) return 1;
                        if (a.productCategory.priority < b.productCategory.priority) return -1;
                    }
                    if (a.name > b.name) return 1;
                    if (a.name < b.name) return -1;
                    return 0;
                };
            case 1:
                return (a, b) => {
                    if (a.priority > b.priority) return 1;
                    if (a.priority < b.priority) return -1;
                    if (a.createdAt < b.createdAt) return 1;
                    if (a.createdAt > b.createdAt) return -1;
                    if (a.productCategory !== null && b.productCategory !== null) {
                        if (a.productCategory.priority > b.productCategory.priority) return 1;
                        if (a.productCategory.priority < b.productCategory.priority) return -1;
                    }
                    if (a.name > b.name) return 1;
                    if (a.name < b.name) return -1;
                    return 0;
                };
            case 2:
                return (a, b) => {
                    if (a.name > b.name) return 1;
                    if (a.name < b.name) return -1;
                    if (a.priority > b.priority) return 1;
                    if (a.priority < b.priority) return -1;
                    if (a.productCategory !== null && b.productCategory !== null) {
                        if (a.productCategory.priority > b.productCategory.priority) return 1;
                        if (a.productCategory.priority < b.productCategory.priority) return -1;
                    }
                    if (a.createdAt < b.createdAt) return 1;
                    if (a.createdAt > b.createdAt) return -1;
                    return 0;
                };
        }

    }

    const checkDeviceCheck = (i) => {
        const checkedItems = [...checkedDevice];
        const index = checkedItems.indexOf(i);
        
        if (index === -1) {
            if(i===1){
                if(checkedItems.indexOf(1) === -1){
                    checkedItems.push(1);
                }
                if(checkedItems.indexOf(2) === -1){
                    checkedItems.push(2);
                }
                if(checkedItems.indexOf(3) === -1){
                    checkedItems.push(3);
                }
                if(checkedItems.indexOf(4) === -1){
                    checkedItems.push(4);
                }

            }else{
                let allIndex = checkedItems.indexOf(1);
                if(allIndex !== -1){
                    checkedItems.splice(allIndex, 1);
                }
                checkedItems.push(i);
            }
        } else {
            if(i===1){
                checkedItems.splice(0,4);    
            }else{
                checkedItems.splice(index, 1);
                let allIndex = checkedItems.indexOf(1);
                if(allIndex !== -1){
                    checkedItems.splice(allIndex, 1);
                }
            }
        }

        setCheckedDevice(checkedItems);
    };

    // 그룹 다이얼로그 시작
    const doOpenGroupDialog = () => {
        setOpenGroupDialog(true);
    }
    const doCloseGroupDialog = () => {
        let origin = cloneObject(originStore);
        setStore(origin);
        setGroupName(originGroupName);
        setOpenGroupDialog(false);
    }
    const doSaveGroupDialog = () => {
        setOpenGroupDialog(false);
    }

    const isSelectedGroup = (index) => {
        if (groups[index] !== null) {
            return false;
        }
        return store.group === groups[index].id;
    }

    const doSelectGroup = (index) => {
        let copyStore = cloneObject(store);
        if (copyStore.group !== undefined && copyStore.group !== null) {
            copyStore.group = groups[index].id;
        }
        else {
            copyStore.group = groups[index].id
        }
        setGroupName(groups[index].name)
        setStore(copyStore);
    }

    // 그룹 다이얼로그 끝


    // 다음지도 다이얼로그 시작
    const doOpenDaumDialog = () => {
        setOpenDaumDialog(true);
    }
    const doCloseDaumDialog = () => {
        setOpenDaumDialog(false);
    }
    // 다음지도 다이얼로그 끝


    // 카테고리 다이얼로그 시작
    const doOpenCategoryDialog = () => {
        setOpenCategoryDialog(true);
    }
    const doAddCategoryDialog = () => {
        let copyStore = cloneObject(store);
        let productCategory = copyStore.productCategory;

        let newObj = {
            id: "-" + productCategory.length,
            name: "",
            priority: productCategory.length,
            isUse: true
        };
        productCategory.push(newObj)

        setStore(copyStore);
    }
    const doCloseCategoryDialog = () => {
        let origin = cloneObject(originStore);
        setStore(origin);
        setGroupName(originGroupName);
        setOpenCategoryDialog(false);
    }

    const doSaveCategoryDialog = () => {
        let copyStore = cloneObject(store);
        let productCategory = copyStore.productCategory;

        // let q = 'mutation {';

        for (let i=0; i<productCategory.length; i++) {
            let tmp = parseInt(productCategory[i].id);
            console.log(tmp);
            if (tmp <= 0) {
                productCategory[i].id = "";
                productCategory[i].store = copyStore.id;
            }
        }

        new Promise((resolve, reject) => {
            axios({
                "url": API_HOST +"/master/updateProductCategory",
                "method": "post",
                "data": productCategory,
            })
            .then(function (response) {
                resolve(response);
            });
        })
        .then((response) => {
            let result = response.data;

            for (let key in result) {
                if (key.includes("i")) {
                    let idx = parseInt(key.replace("i", ""));
                    productCategory[idx].id = result[key];
                }
            }

            setStore(copyStore);            
            setOpenCategoryDialog(false);
        });
    }
    const doCategoryPriorityEdit = (index) => (event) => {
        let copyStore = cloneObject(store);
        let productCategory = copyStore.productCategory;

        productCategory[index].priority = event.target.value;
        productCategory = productCategory.sort((a, b) => {
            return a.priority >= b.priority ? 1 : -1;
        });

        setStore(copyStore);
    }
    const doCategoryIsUseEdit = (index, value) => {
        let copyStore = cloneObject(store);
        let productCategory = copyStore.productCategory;

        productCategory[index].isUse = value;
        console.log(copyStore);
        setStore(copyStore);
        // openSnackbar();
    }
    // 카테고리 다이얼로그 끝


    // 카테고리 수정 다이얼로그 시작
    const doOpenCategoryEditDialog = (index, name) => {
        setTmpCategoryIndex(index);
        setTmpCategoryName(name);
        setOpenCategoryEditDialog(true);
    }

    const doCloseCategoryEditDialog = () => {
        setOpenCategoryEditDialog(false);
    }

    const doSaveCategoryEditDialog = () => {
        let copyStore = cloneObject(store);
        let productCategory = copyStore.productCategory;
        productCategory[tmpCategoryIndex].name = tmpCategoryName;
        setStore(copyStore);
        
        setOpenCategoryEditDialog(false);
    }    
    // 카테고리 수정 다이얼로그 끝

    // 카테고리 삭제 다이얼로그 시작
    const doOpenCategoryRemoveDialog = (index, name) => {
        setTmpCategoryIndex(index);
        setOpenCategoryRemoveDialog(true);
    }

    const doCloseCategoryRemoveDialog = () => {
        setOpenCategoryRemoveDialog(false);
    }

    const doCategoryRemoveEdit = () => {
        let copyStore = cloneObject(store);
        let productCategory = copyStore.productCategory;
        let selectedProductCategory=  productCategory[tmpCategoryIndex];
        let id = productCategory[tmpCategoryIndex].id;

        axios({
            "url": API_HOST + "/master/deleteProductCategory",
            "method": "post",
            "params": {
                productCategoryId:id,
            }
        })
        .then(function (response) {  
            let paramData = {
                type:"STM1",
                adminId:"cjv6z5pjs0aay0734ge2kfk00",
                target:store.id,
                content:"[가맹점 카테고리 삭제] {'" + selectedProductCategory.name + "'}'" + "id : " + id +"'",
            }
            axios({
                "url":API_HOST + "/master/insertLog",
                "method":"post",
                "data":paramData,
            }) 
            window.location.reload();
        });
    }
    // 카테고리 삭제 다이얼로그 끝


    // 옵션 그룹 수정 다이얼로그 시작
    const doOpenOptionGroupDialog = (option) => {
        setTmpOptionGroup(option);
        setOpenOptionGroupDialog(true);
    }

    const doCloseOptionGroupDialog = () => {
        setOpenOptionGroupDialog(false);
    }

    const doDeleteOptionGroup = () => {
        let items = tmpOptionGroup.productOptionItems;
        let itemLength = items.length;


        for (let i=0; i<items.length; i++) {
            if (items[i].delete) {
                itemLength--;
            }
        }

        if (itemLength > 0) {
            alert("옵션 아이템을 먼저 삭제해주세요");
        }
        else {
            if ( window.confirm("정말 삭제하시겠습니까?") ) {
                tmpOptionGroup.delete = true;
                
                setSnackMessage("옵션 그룹이 임시삭제됨");
                openSnackbar();
                setProduct(product);
                setOpenOptionGroupDialog(false);
            }
        }
    }

    const doSaveOptionGroupDialog = () => {
        let optionGroups = product.productOptionGroups;
        if ( isNaN(parseInt(tmpOptionGroup.id))) {
            product.productOptionGroups = optionGroups.map((item) => {
                return (item.id === tmpOptionGroup.id) ? tmpOptionGroup : item;
            });
        }
        else {
            tmpOptionGroup.id = "add_" + tmpOptionGroup.id;
            product.productOptionGroups.push(tmpOptionGroup);
        }
        console.log(product);

        setSnackMessage("옵션 그룹이 임시저장됨");
        openSnackbar();
        setProduct(product);
        setOpenOptionGroupDialog(false);
    }

    const addProductOptionGroup = () => {
        let newObj = {
            id: product.productOptionGroups.length,
            name: "",
            isUse: true,
            isRequired: false,
            isSingle: true,
            priority: product.productOptionGroups.length,
            productOptionItems: []
        }

        setTmpOptionGroup(newObj);
        setOpenOptionGroupDialog(true);
    }
    // 옵션 그룹 수정 다이얼로그 끝

    // 옵션 아이템 수정 다이얼로그 시작
    const doOpenOptionItemDialog = (option, groupIndex) => {
        setTmpOptionGroupIndex(groupIndex);
        setTmpOption(option);
        setOpenOptionItemDialog(true);
    }

    const doCloseOptionItemDialog = () => {
        setOpenOptionItemDialog(false);
    }

    const doSaveOptionItemDialog = () => {
        let optionGroup = product.productOptionGroups[tmpOptionGroupIndex];
        if ( isNaN(parseInt(tmpOption.id))) {
            optionGroup.productOptionItems = optionGroup.productOptionItems.map((item) => {
                return (item.id === tmpOption.id) ? tmpOption : item;
            });
        }
        else {
            tmpOption.id = "add_" + tmpOption.id;
            product.productOptionGroups[tmpOptionGroupIndex].productOptionItems.push(tmpOption);
        }

        setSnackMessage("옵션 아이템이 임시저장됨");
        openSnackbar();
        setProduct(product);
        setOpenOptionItemDialog(false);
    }

    const addOptionItem = (groupIndex) => {
        let newObj = {
            id: product.productOptionGroups[groupIndex].productOptionItems.length,
            value: "",
            price: 0,
            priority: product.productOptionGroups[groupIndex].productOptionItems.length,
            linkCode: null
        }
        setTmpOption(newObj);
        setTmpOptionGroupIndex(groupIndex);
        setOpenOptionItemDialog(true);
    }
    const deleteOptionItem = (groupIndex, id) => {
        let items = product.productOptionGroups[groupIndex].productOptionItems;
        for (let i=0; i<items.length; i++) {
            if(items[i].id === id) {
                console.log(id);
                items[i].delete = true;
                break;
            }
        }
        setSnackMessage("옵션 아이템이 임시삭제됨");
        openSnackbar();
        console.log(items);
    }
    // 옵션 아이템 다이얼로그 끝
    

    // 버켓 이미지 다이얼로그 끝
    const doOpenProductBucketImageDialog = (images) => {
        setTmpSelectedBucket(images);
        setOpenProductBucketImageDialog(true);
    }

    const doCloseProductBucketImageDialog = () => {
        setOpenProductBucketImageDialog(false);
    }

    const doSaveProductBucketImageDialog = () => {
        setProduct({...product, ["images"]: tmpSelectedBucket})
        setOpenProductBucketImageDialog(false);
    }

    const doSearchBucket = (event) => {
        if (event.keyCode === 13) {
            let value = event.target.value;
            let copyBucketImageList = cloneObject(originBucketImageList);
            copyBucketImageList = copyBucketImageList.filter((item) => {
                return item.includes(value);
            });
            setBucketImageList(copyBucketImageList);
        }
    }

    const doSelectBucketImage = (value) => {
        setTmpSelectedBucket(value);
    }
    // 버켓 이미지 다이얼로그 끝
    

    function doCheckDeviceTabs(event) {
        setDeviceTabValue({ ...deviceTabValue, [event.target.name]: event.target.checked });
    }
    function doCheckStatusTabs(event) {
        setStatusTabValue({ ...statusTabValue, [event.target.name]: event.target.checked });
    }

    function deleteGroupCode(data){
        // let discountGroupCode = data.data.groupDiscountCode;
        let storeId = data.data.id;
        axios({
            "url":API_SERVER_URL + "/master/deleteStoreGroupCode",
            "method":"post",
            "params":{
                storeId:storeId,
            }
        }).then(function(response){
            if(response.data === 1){
                setSnackMessage("저장 성공");
            }else{
                setSnackMessage("그룹 할인 코드 변경 실패");
            }
        }).catch(function(error){
            setSnackMessage("그룹 할인 코드 변경 실패");
            console.log(error);
        })

    }
    function updateGroupCode(data){
        let discountGroupCode = data.data.groupDiscountCode;
        let storeId = data.data.id;
        let groupCodeId = "";

        let groupCodeRet = -1;
        for(let i=0; i<groupCodes.length; i++){
            if(groupCodes[i]['code'] === discountGroupCode){
                groupCodeId = groupCodes[i]['id'];
            }
        }

        axios({
            "url":API_SERVER_URL + "/master/updateStoreGroupCode",
            "method":"post",
            "params":{
                groupCodeId:groupCodeId,
                storeId:storeId
            }
        }).then(function(response){
            console.log("updateStoreGroupCode");
            console.log(response);
            if(response.data === -1){
                setSnackMessage("그룹 할인코드 저장 실패");            
            }else{
                setSnackMessage("저장 성공");
            }
        }).catch(function(error){
            setSnackMessage("그룹 할인코드 저장 실패");
            console.log(error);
        })
    }

    function reloadOrderList() {
        setOrderPage(0);
        setBackdrop(true);
        loadOrdersData(match.params.id, 0, 10, deviceTabValue, statusTabValue)
        .then((response) => {
            let data = response.data;
            let orders = data.content;
            let totalCount = data.totalElements;

            let orderTotalPagePlus = (totalCount % orderListCount) > 0 ? 1 : 0;
            let orderTotalPage = parseInt(totalCount / orderListCount) + orderTotalPagePlus;
            
            setOrders(orders);
            setOrderTotalCount(totalCount);
            setOrderTotalPage(orderTotalPage);
            setBackdrop(false);
        });
    }
    
    function clickOrderPagination(offset) {
        console.log("pagination", offset);
        setOrderPage(offset);

        setBackdrop(true);
        loadOrdersData(match.params.id, offset, 10, deviceTabValue, statusTabValue)
        .then((response) => {
            let data = response.data;
            let orders = data.content;
            let totalCount = data.totalElements;

            let orderTotalPagePlus = (totalCount % orderListCount) > 0 ? 1 : 0;
            let orderTotalPage = parseInt(totalCount / orderListCount) + orderTotalPagePlus;
            
            setOrders(orders);
            setOrderTotalCount(totalCount);
            setOrderTotalPage(orderTotalPage);
            setBackdrop(false);
        });
    }
    
    function clickLogPagination(offset) {
        console.log("pagination", offset);
        setLogPage(offset);

        setBackdrop(true);
        loadLogsData(match.params.id, offset)
        .then((response) => {
            let data = response.data;
            let logs = data.content;
            setLogs(logs);
            setBackdrop(false);
        });
    }
    
    const openSnackbar = () => {
        setSuccess(true);
    }    
    const closeSnackbar = () => {
        setSuccess(false);
    }


    const changePreview = (event) => {
        let target = event.target.files[0];
        if (isNull(target)) {
            changeStoreValueDirect("images", URL.createObjectURL(target));
        }
    }
    const changeLogoImagePreview = (event,row) =>{
        let target = event.target.files[0];
        if( isNull(target)){
            row = URL.createObjectURL(target);
            // changeStoreValueDirect("images", URL.createObjectURL(target));
            doUploadLogoImage(row).
            then((location) => {
                row = location;
                saveLogoImage(row,store.id)
                .then((response) => {
                    console.log(response);
                    store.logoImage = row;
                    setUpdated(!updated);
                    setSnackMessage("저장 성공");
                    openSnackbar();
                });
            })
        }
        setUpdated(!updated);
    }

    const changeLogoImagePreview2 = (event,row) =>{
        let target = event.target.files[0];
        if( isNull(target)){
            row = URL.createObjectURL(target);
            // changeStoreValueDirect("images", URL.createObjectURL(target));
            doUploadLogoImage2(row).
            then((location) => {
                row = location;
                saveLogoImage2(row,store.id)
                .then((response) => {
                    console.log(response);
                    store.logoImage2 = row;
                    setUpdated(!updated);
                    setSnackMessage("저장 성공");
                    openSnackbar();
                });
            })
        }
        setUpdated(!updated);
    }

    const changePosMainImagePreview = (event, row) => {
        console.log("changePosMainImagePreview", row);
        let target = event.target.files[0];
        if (isNull(target)) {
            row.mainImage = URL.createObjectURL(target);
            // changeStoreValueDirect("images", URL.createObjectURL(target));
            doUploadPosMainImage(row).
            then((location) => {
                row.mainImage = location;
                savePos(row)
                .then((response) => {
                    for (let i=0; i<poses.length; i++) {
                        if (poses[i].id === pos.id) {
                            poses[i] = pos;
                        }
                    }
                    setUpdated(!updated);
                    setSnackMessage("저장 성공");
                    openSnackbar();
                });
            })
            
        }
        setUpdated(!updated);
    }

    const selectDaumAddress = (data) => {
        console.log(data);
        let copyStore = cloneObject(store);
        let zipcode = data.zonecode;
        let address = data.address;
        console.log(window.daum);
        var geocoder = new window.daum.maps.services.Geocoder();
        var lat = 0;
        var lng = 0;

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(address, function(result, status) {
            // 정상적으로 검색이 완료됐으면 
            if (status === window.daum.maps.services.Status.OK) {
                lat = result[0].y;
                lng = result[0].x;
                
                copyStore.zipcode = zipcode;
                copyStore.address = address;
                copyStore.addressDetail = "";
                copyStore.latitude = lat;
                copyStore.longitude = lng;

                console.log(copyStore);

                setStore(copyStore);
                doCloseDaumDialog();
            } 
        });
    }


    function doOpenOrderDetailDialog(row) {
        setOpenOrderDetailDialog(true);
        setItems(row.items);
    }

    function doCloseOrderDetailDialog() {
        setOpenOrderDetailDialog(false);
    }
    
    const doUploadLogoImage2 = (row) => {
        return new Promise((resolve) => {
            let files = document.getElementById("store-images-logoImage2").files;
            let date = new Date();
            var file = files[0];
            let fileName = file.name + date;
            let albumPhotosKey = bucketUrl + "/";
                
            var photoKey = albumPhotosKey + fileName;
            console.log(files);
    
            s3().upload({
                    Bucket: "timeorder",
                    Key: photoKey,
                    Body: file,
                    ACL: "public-read-write"
                },
                function(err, data) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("S3 Upload", data);
                    doLoadS3(store);
                    resolve(data.Location);
                }
            );
        })
    }

    const doUploadLogoImage = (row) => {
        return new Promise((resolve) => {
            let files = document.getElementById("store-images-logoImage").files;
            let date = new Date();
            var file = files[0];
            let fileName = file.name + date;
            let albumPhotosKey = bucketUrl + "/";
                
            var photoKey = albumPhotosKey + fileName;
            console.log(files);
    
            s3().upload({
                    Bucket: "timeorder",
                    Key: photoKey,
                    Body: file,
                    ACL: "public-read-write"
                },
                function(err, data) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("S3 Upload", data);
                    doLoadS3(store);
                    resolve(data.Location);
                }
            );
        })
    }

    const doUploadPosMainImage = (row) => {
        return new Promise((resolve) => {
            let files = document.getElementById("store-images-" + row.id).files;

            var file = files[0];
            let fileName = file.name;
            let albumPhotosKey = encodeURIComponent("stores") + "/" + encodeURIComponent(store.code) + "/" + encodeURIComponent("pos") + "/";

            var photoKey = albumPhotosKey + fileName;

            s3().upload({
                    Bucket: "timeorder",
                    Key: photoKey,
                    Body: file,
                    ACL: "public-read-write"
                },
                function(err, data) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("S3 Upload", data);
                    resolve(data.Location);
                }
            );
        });
    }



    // 태블릿 계정 생성 시작
    const addStoreOwner = () => {
        let sha256 = require('js-sha256');
        if (store.code.length === 0) {
            alert("매장코드를 입력해주세요")
            return;
        }
        if (store.phone.length < 8) {
            alert("정상적인 전화번호가 아닙니다")
            return;
        }
        let tmpPwd = store.phone.substring(store.phone.length - 4);
        let cryptoPwd = sha256(tmpPwd);
        let q = '';
        console.log(store.owners);
        let storeOwnerParam = {};

        if (store.owners.length === 0) {
            storeOwnerParam = {
                id:"",
                ownerId:store.code,
                password:cryptoPwd,
                type:"1",
                name:store.name,
                phone:store.phone,
                store:store.id
            };
            // 신규
            // q = 'mutation {' +
            //     ' insertStoreOwner (ownerId: "' + store.code + '" password: "' + cryptoPwd + '" name: "' + store.name + '" phone: "' + store.phone + '" storeId: "' + store.id + '") { id }' +
            // '}'
        }
        else {
            storeOwnerParam = {
                id:store.owners[0].id,
                ownerId:store.code,
                password:cryptoPwd,
                type:"1",
                name:store.name,
                phone:store.phone,
                store:store.id
            }
            // 수정
            // q = 'mutation {' +
            //     ' updateStoreOwner (id: "' + store.owners[0].id + '" password: "' + cryptoPwd + '" name: "' + store.name + '" phone: "' + store.phone + '") { id }' +
            // '}'
        }

        return new Promise((resolve, reject) => {
            axios({
                "url": API_HOST + "/master/updateStoreOwner",
                "method": "post",
                "data": storeOwnerParam
            })
            .then(function (response) {
                console.log(response);
                resolve(response);

                let newStore = cloneObject(store);
                if (store.owners.length === 0) {
                    newStore.owners.push({ "id": response.data.id });
                }
                else {
                    newStore.owners[0].id = response.data.id;
                }
                console.log(newStore);
                setStore(newStore);
            });
        });
    }
    // 태블릿 계정 생성 끝


    // 관리자 계정 생성 시작
    const addStoreAdmin = () => {
        let sha256 = require('js-sha256');
        let phone = "";
        if (store.phone) {
            phone = store.phone.trim();
        }

        if (store.code.length === 0) {
            alert("매장코드를 입력해주세요")
            return;
        }
        if (phone.length < 8) {
            alert("정상적인 전화번호가 아닙니다")
            return;
        }

        let tmpPwd = phone.trim().substring(phone.length - 4);
        let cryptoPwd = sha256(tmpPwd);
        let q = '';

        console.log(store.phone);
        console.log(tmpPwd);
        let adminParam = {};

        if (store.admin === null) {
            adminParam = {
                id:"",
                email:store.code,
                password:cryptoPwd,
                name:store.name,
                group:store.group,
                store:store.id,
            }
            // 신규
            // q = 'mutation {' +
            //     ' insertAdmin (email: "' + store.code + '" password: "' + cryptoPwd + '" name: "' + store.name + '" groupId: "' + store.group + '" storeId: "' + store.id + '") { id }' +
            // '}'
        }
        else {
            adminParam = {
                id:store.admin.id,
                email:store.code,
                password:cryptoPwd,
                name:store.name,
                group:store.group,
                store:store.id,
            }
            // 수정
            // q = 'mutation {' +
            //     ' updateAdmin (id: "' + store.admin.id + '" password: "' + cryptoPwd + '" name: "' + store.name + '" groupId: "' + store.group + '" storeId: "' + store.id + '") { id }' +
            // '}'
        }

        return new Promise((resolve, reject) => {
            axios({
                "url": API_HOST + "/master/updateAdmin",
                "method": "post",
                "data": adminParam
            })
            .then(function (response) {
                console.log(response);
                resolve(response);

                let newStore = cloneObject(store);
                if (store.admin === null) {
                    newStore.admin = { "id": response.data.id };
                }
                else {
                    newStore.admin.id = response.data.id;
                }
                console.log(newStore);
                setStore(newStore);
            });
        });
    }
    // 관리자 계정 생성 끝


    // 스탬프 저장 시작
    
    const changeStampMasterValue = (prop) => (event) => {
        setStampMaster({ ...stampMaster, [prop]: event.target.value });
    };

    const doSaveStampMaster = () => {
        let q = '';
        if(couponType.couponExpireDate === null){
            setSnackMessage("쿠폰 유효기간을 입력해주세요.");
            openSnackbar();
            return;
        }
        let couponTypeParam = {};
        let stampMasterParam = {};
        
        // q = 'mutation {';

        if (couponType.id === undefined || couponType.id === null) {
            // 없으면 저장            
            couponTypeParam = {
                id:"",
                couponGroup:couponGroups[0].id,
                name:couponType.name,
                description:couponType.description,
                companyType:"TIMEORDER",
                type:"01",
                couponDayType:"00",
                couponAmount:couponType.couponAmount,
                couponExpireDate:couponType.couponExpireDate,
                storeId:store.id,
            }
        }
        else {
            // 있으면 수정
            couponTypeParam = {
                id:couponType.id,
                name:couponType.name,
                description:couponType.description,
                companyType:"TIMEORDER",
                type:"01",
                couponDayType:"00",
                couponAmount:couponType.couponAmount,
                couponMaxPrice:couponType.couponMaxPrice,
                couponMaxUseCount:couponType.couponMaxUseCount,
                couponCanMinAmount:couponType.couponCanMinAmount,
                couponGroup:couponGroups[0].id,
                couponExpireDate:couponType.couponExpireDate,
                storeId:store.id,
            }
        }

        return new Promise((resolve,reject) => {
            axios({
                "url":API_HOST + "/master/updateCouponType",
                "method":"post",
                "data":couponTypeParam
            }).then(function(response){
                if (couponType.id === null || couponType.id === undefined) {
                    console.log("save couponType", response.data);
                    setCouponType(response.data);
                }
                else {
                    console.log("save couponType", response.data);
                    setCouponType(response.data);
                }
                resolve(response);
            })
        }).then((response) => {
            let stampMasterParam = {};
            if (stampMaster.id === null || stampMaster.id === undefined) {
                console.log("insert");
                stampMasterParam = {
                    id:"",
                    stampMaxCount:stampMaster.stampMaxCount,
                    stampCardExpireDate:stampMaster.stampCardExpireDate,
                    stampExpireDate:stampMaster.stampExpireDate,
                    couponTypeId:response.data.id,
                    storeId:store.id,
                    stampStackType:stampMaster.stampStackType,
                    stampStackAmount:stampMaster.stampStackAmount
                }
            }
            else {
                console.log("22222222222");
                console.log(stampMaster.id);
                console.log(stampMaster);
                // 수정
                stampMasterParam = {
                    id:stampMaster.id,
                    stampMaxCount:stampMaster.stampMaxCount,
                    stampCardExpireDate:stampMaster.stampCardExpireDate,
                    stampExpireDate:stampMaster.stampExpireDate,
                    couponTypeId:response.data.id,
                    storeId:store.id,
                    stampStackType:stampMaster.stampStackType,
                    stampStackAmount:stampMaster.stampStackAmount
                }
            }

            axios({
                "url":API_HOST + "/master/updateStampMaster",
                "method":"post",
                "data":stampMasterParam,
            }).then(function(response2){
                if (stampMaster.id === null || stampMaster.id === undefined) {
                    console.log("save stampMaster", response2.data);
                    setStampMaster(response2.data);
                }
                else {
                    console.log("save stampMaster", response2.data);
                    setStampMaster(response2.data);
                }
                setSnackMessage("저장 성공");
                openSnackbar();
            })
        })
    }

    const changeCouponTypeValue = (prop) => (event) => {
        setCouponType({ ...couponType, [prop]: event.target.value });
    };

    // const doSaveCouponType = () => {
    //     console.log(couponType);
    //     let q = "";

    //     if (couponType.id === undefined || couponType.id === null) {
    //         // 없으면 저장            
    //         q = 'mutation {' +
    //             ' insertCouponType (couponGroupId: "' + couponGroups[0].id + '" groupId: "' + store.group + '" storeId: "' + store.id + '" name: "' + couponType.name + '" description: "' + couponType.description + '" companyType: "' + couponType.companyType + '" type: "' + couponType.type + '" couponDayType: "' + couponType.couponDayType + '" couponAmount: ' + couponType.couponAmount + ') { id description couponAmount }' +
    //         '}'
    //     }
    //     else {
    //         // 있으면 수정
    //         q = 'mutation {' +
    //             ' updateCouponType (id: "' + couponType.id + '" description: """' + couponType.description + '""" couponAmount: ' + couponType.couponAmount + ') { id description couponAmount }' +
    //         '}'
    //     }
        
    //     return new Promise((resolve, reject) => {
    //         axios({
    //             "url": API_SERVER_URL,
    //             "method": "post",
    //             "data": {
    //                 query: q
    //             }
    //         })
    //         .then(function (response) {
    //             console.log("save couponType", response);

    //             let couponId = "";

    //             if (couponType.id === null || couponType.id === undefined) {
    //                 console.log("save couponType", response.data.data.insertCouponType);
    //                 couponId = response.data.data.insertCouponType.id;
    //                 setCouponType(response.data.data.insertCouponType);
    //             }
    //             else {
    //                 console.log("save couponType", response.data.data.updateCouponType);
    //                 couponId = response.data.data.updateCouponType.id;
    //                 setCouponType(response.data.data.updateCouponType);
    //             }

    //             // StampMaster 에 아직 쿠폰이 지정되어있지 않은 경우
    //             if (stampMaster.id !== null && stampMaster.id !== undefined && (stampMaster.couponType === null || stampMaster.couponType === undefined)) {
    //                 let q2 = 'mutation {' +
    //                     ' updateStamp (id: "' + stampMaster.id + '" couponTypeId: "' + couponId + '") { id description couponAmount }' +
    //                 '}'
                    
    //                 axios({
    //                     "url": API_SERVER_URL,
    //                     "method": "post",
    //                     "data": {
    //                         query: q2
    //                     }
    //                 })
    //                 .then(function (r) {
    //                     console.log("save stampMaster", r.data.data.updateStampMaster);
    //                     setStampMaster(r.data.data.updateStampMaster);
                        
    //                     resolve(response);
    //                 });
    //             }
    //             else {
    //                 resolve(response);    
    //             }
    //         });
    //     });
    // }
    // 스탬프 저장 끝

    // 기기 추가 다이얼로그 시작
    const doOpenPosDialog = (pos) => {
        if (pos !== undefined && pos !== null) {
            setPos(cloneObject(pos));
        }
        else {
            setPos({
                id: null,
                code: "",
                model: "",
                name: "",
                type: "",
                mainImage: "",
                mandatory: true,
                uuid: "",
                store: store.id
            });
        }
        setPosDialog(true);
    }

    const doClosePosDialog = () => {
        setPosDialog(false);
    }

    const doSavePosDialog = () => {
        if (!pos.code) {
            alert("코드를 입력해주세요");
            return ;
        }
        if (!pos.type) {
            alert("타입을 입력해주세요");
            return ;
        }

        savePos(pos)
        .then((response) => {
            console.log(response);
            if (pos.id === null) {
                pos.id = response.data.id;
                poses.push(pos);
            }
            else {
                for (let i=0; i<poses.length; i++) {
                    if (poses[i].id === pos.id) {
                        poses[i] = pos;
                    }
                }
            }
            setUpdated(!updated);
            setPosDialog(false);
            setPos({});
        });
    }
    

    const changePosValue = (prop) => (event) => {
        console.log(event.target.value);
        setPos({ ...pos, [prop]: event.target.value });
    };
    
    // 기기 추가 다이얼로그 끝

    return (
        login !== null &&
            <Box className="base-container page-box store-container" height="100%">
                <Typography variant="h5" noWrap className={classes.divRow}>
                    가맹점 관리
                </Typography>

                <div className={classes.divRow}>
                    <Grid container spacing={4}>
                        <Grid item xs={4}>
                            <Paper square className={classes.paper}>
                                <Typography variant="h5" noWrap className={classes.divRow}>
                                    기본 정보
                                </Typography>

                                { store !== null &&
                                    <div>
                                        <div>
                                            <label htmlFor="store-images">
                                                <img className={[classes.width100, classes.divRow].join(' ')} src={ store.images } alt={ store.name } onError={(e) => { e.target.src="/img/default.png"}}/>
                                            </label>
                                            <input type="file" id="store-images" className={classes.hidden} onChange={ changePreview }/>
                                        </div>
                                        <Typography align="center" variant="h6" noWrap className={classes.divRow}>
                                            { name }
                                        </Typography>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <TextField className={ classes.width100 } label="가맹점 이름" variant="outlined" defaultValue={ isNull(store.name) }
                                                        onBlur={changeStoreValue('name')}/>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    {
                                                        store.owners.length == 0 ? (
                                                            <Button className={ [classes.button, classes.width100].join(' ') } variant="contained" color="primary" onClick={ addStoreOwner }>
                                                                태블릿 생성
                                                            </Button>
                                                        )
                                                        :
                                                        (
                                                            <Button className={ [classes.button, classes.width100].join(' ') } variant="contained" color="primary">
                                                                태블릿&nbsp;&nbsp;<CheckCircleOutlineIcon/>
                                                            </Button>
                                                        )
                                                    }
                                                </Grid>
                                                <Grid item xs={3}>
                                                    {
                                                        store.admin ? 
                                                        (
                                                            <Button className={ [classes.button, classes.width100].join(' ') } variant="contained" color="primary" onClick={ addStoreAdmin }>
                                                                관리자&nbsp;&nbsp;<CheckCircleOutlineIcon/>
                                                            </Button>
                                                        )
                                                        :
                                                        (
                                                            <Button className={ [classes.button, classes.width100].join(' ') } variant="contained" color="primary" onClick={ addStoreAdmin }>
                                                                관리자 생성
                                                            </Button>
                                                        )
                                                    }
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={3}>
                                                    <FormControl variant="outlined" className={classes.width100}>
                                                        <InputLabel
                                                            id="store-type">운영 상태</InputLabel>
                                                        <Select
                                                            labelId="store-type"
                                                            defaultValue={isNull(store.type)}
                                                            onBlur={changeStoreValue('type')}
                                                            labelWidth={75}
                                                        >
                                                            <MenuItem value="0">미운영</MenuItem>
                                                            <MenuItem value="1">운영</MenuItem>
                                                            <MenuItem value="2">휴점</MenuItem>
                                                            <MenuItem value="3">폐점</MenuItem>
                                                            <MenuItem value="4">비공개</MenuItem>
                                                            <MenuItem value="99">테스트</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControl variant="outlined" className={classes.width100}>
                                                        <InputLabel
                                                            id="store-type">매장 타입</InputLabel>
                                                        <Select
                                                            labelId="store-type"
                                                            defaultValue={isNull(store.storeCategory)}
                                                            onBlur={changeStoreValue('storeCategory')}
                                                            labelWidth={75}
                                                        >
                                                            {
                                                                storeCategories.map((row, index) => (
                                                                    <MenuItem value={row.code} key={index}>{row.name}</MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControl variant="outlined" className={classes.width100}>
                                                        <InputLabel
                                                            id="store-type">매장 운영</InputLabel>
                                                        <Select
                                                            labelId="store-opened"
                                                            defaultValue={isNull(store.isOpened)}
                                                            onBlur={changeStoreValue('isOpened')}
                                                            labelWidth={75}
                                                        >
                                                            <MenuItem value={"true"}>오픈</MenuItem>
                                                            <MenuItem value={"false"}>마감</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControl variant="outlined" className={classes.width100}>
                                                        <InputLabel
                                                            id="store-type">포장 여부</InputLabel>
                                                        <Select
                                                            labelId="store-opened"
                                                            defaultValue={isNull(store.onlyTakeOut)}
                                                            onBlur={changeStoreValue('onlyTakeOut')}
                                                            labelWidth={75}
                                                        >
                                                            <MenuItem value={false}>메뉴에따름</MenuItem>
                                                            <MenuItem value={true}>포장만가능</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <TextField className={ classes.width100 } label="가맹점 코드" variant="outlined" defaultValue={ isNull(store.code) }
                                                        onBlur={changeStoreValue('code')}/>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <div onClick={doOpenGroupDialog}>
                                                        <TextField className={ classes.width100 } label="가맹점 그룹" variant="outlined" value={groupName} disabled/>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={3}>
                                                    <TextField className={ classes.width100 } label="본사 할인율" variant="outlined" defaultValue={ isNull(store.discountValue) }
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                    }}
                                                    onBlur={changeStoreValue('discountValue')}/>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <TextField className={ classes.width100 } label="가맹점 할인율" variant="outlined" defaultValue={ isNull(store.storeDiscountValue) }
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                    }}
                                                    onBlur={changeStoreValue('storeDiscountValue')}/>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <TextField className={ classes.width100 } label="그룹 할인율" variant="outlined" defaultValue={ isNull(store.groupDiscountValue) }
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                    }}
                                                    onBlur={changeStoreValue('groupDiscountValue')}/>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <TextField className={ classes.width100 } label="수수료" variant="outlined" defaultValue={ isNull(store.fees, 3.3) }
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                    }}
                                                    onBlur={changeStoreValue('fees')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow} style={{ marginBottom:'20px' }}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <Autocomplete
                                                        id="combo-box-groupcode"
                                                        freeSolo
                                                        size="small"
                                                        options={groupCodes.map((option) => option.code)}
                                                        value={ isNull(store.groupDiscountCode) }
                                                        onChange={(event, newInputValue) => changeStoreValueDirect('groupDiscountCode', newInputValue)}
                                                        renderInput={(params) => <TextField {...params} className={ [classes.width100, "AutoComplete"].join(' ') }
                                                                        label="그룹 할인 코드" variant="outlined"/>}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow} style={{ marginBottom:'20px' }}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={8}>
                                                    <FormControl variant="outlined" className={classes.width100}>
                                                        <InputLabel
                                                            id="store-type">멤버십</InputLabel>
                                                        <Select
                                                            labelId="store-opened"
                                                            defaultValue={isNull(store.hasMembership)}
                                                            onBlur={changeStoreValue('hasMembership')}
                                                            labelWidth={75}
                                                        >
                                                            <MenuItem value={"NONE"}>NONE</MenuItem>
                                                            <MenuItem value={"STAMP"}>STAMP</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    {/* <FormControl variant="outlined" className={classes.width100}> */}
                                                    <InputLabel
                                                            id="store-type">매장 고유 색상</InputLabel>
                                                        {/* <div> */}
                                                            {/* <ColorPicker type={"color"} value={storeColor} onChange={changeStoreColor("storeColor")}/> */}
                                                            <input type="color" value={store.storeColor === null ? "#ffffff" : store.storeColor} onChange={changeStoreColor("storeColor")} id="storecolor"/>
                                                            <label htmlFor="storecolor" style={{marginLeft:"5px"}}>{store.storeColor === null ? "#ffffff" : store.storeColor}</label>
                                                            {/* <input type="color"></input> */}
                                                            {/* <ColorInput defaultValue="red"/> */}
                                                            {/* <ColorBox defaultValue="transparent" value={storeColor} onChange={changeStoreColor("storeColor")}/> */}
                                                        {/* </div> */}
                                                    {/* </FormControl> */}
                                                </Grid>
                                                
                                            </Grid>
                                        </div>
                                    
                                        <div className={classes.divRow}>
                                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <KeyboardDatePicker
                                                            margin="normal"
                                                            id="start-date-picker-dialog"
                                                            label="본사 할인 시작일"
                                                            format="YYYY-MM-DD"
                                                            value={moment(store.discountStart === '' ? '20150101000000' : store.discountStart, "YYYYMMDDHHmmss")}
                                                            onChange={changeStoreDiscountStartValue}
                                                            inputVariant="outlined"
                                                            className={classes.width100}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <KeyboardDatePicker
                                                            margin="normal"
                                                            id="end-date-picker-dialog"
                                                            label="본사 할인 종료일"
                                                            format="YYYY-MM-DD"
                                                            value={moment(store.discountEnd === '' ? '20150102000000' : store.discountEnd, "YYYYMMDDHHmmss").add(-1, 'day')}
                                                            onChange={changeStoreDiscountEndValue}
                                                            inputVariant="outlined"
                                                            className={classes.width100}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </MuiPickersUtilsProvider>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <TextField className={ classes.width100 } label="전화번호" variant="outlined" defaultValue={ isNull(store.phone) }
                                                        onBlur={changeStoreValue('phone')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={4}>
                                                            <TextField className={ classes.width100 } label="우편번호" variant="outlined" disabled value={ isNull(store.zipcode) }/>
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <Button className={ classes.button } variant="outlined" color="primary" onClick={ doOpenDaumDialog }>검색</Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField className={ classes.width100 } label="주소" variant="outlined" disabled value={ isNull(store.address) }/>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField className={ classes.width100 } label="상세주소" variant="outlined" defaultValue={ isNull(store.addressDetail) }
                                                        onBlur={changeStoreValue('addressDetail')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <TextField className={ classes.width100 } label="사업장명" variant="outlined" defaultValue={ isNull(store.businessName) }
                                                        onBlur={changeStoreValue('businessName')}/>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField className={ classes.width100 } label="사업자 번호" variant="outlined" defaultValue={ isNull(store.serialNumber) }
                                                        onBlur={changeStoreValue('serialNumber')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={4}>
                                                    <TextField className={ classes.width100 } label="대표님 성함" variant="outlined" defaultValue={ isNull(store.ceo) }
                                                        onBlur={changeStoreValue('ceo')}/>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <TextField className={ classes.width100 } label="대표님 전화번호" variant="outlined" defaultValue={ isNull(store.ceoPhone) }
                                                        onBlur={changeStoreValue('ceoPhone')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={3}>
                                                    <FormControl variant="outlined" className={classes.width100}>
                                                        <InputLabel
                                                            id="store-bank">은행</InputLabel>
                                                        <Select
                                                            labelId="store-bank"
                                                            defaultValue={isNull(store.bankCode, "X")}
                                                            onBlur={changeStoreValue('bankCode')}
                                                            labelWidth={75}
                                                        >
                                                            <MenuItem value={"X"}>없음</MenuItem>
                                                            {
                                                                banks.map((row, index) => (
                                                                    <MenuItem value={row.code} key={index}>{row.name}</MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField className={ classes.width100 } label="입금자명" variant="outlined" defaultValue={ isNull(store.bankOwner) }
                                                        onBlur={changeStoreValue('bankOwner')}/>
                                                </Grid>
                                                <Grid item xs={5}>
                                                    <TextField className={ classes.width100 } label="계좌번호" variant="outlined" defaultValue={ isNull(store.bankNumber) }
                                                        onBlur={changeStoreValue('bankNumber')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <table id="openTime">
                                                <colgroup>
                                                    <col style={{width: '30px'}}/>
                                                    <col style={{width: '80px'}}/>
                                                    <col/>
                                                    <col/>
                                                </colgroup>
                                                <tbody>
                                                    <tr data-code="MON">
                                                        <td>월</td>
                                                        <td>
                                                            <FormControl variant="outlined" className={classes.width100}>
                                                                <Select value="1">
                                                                    <MenuItem value="1">운영</MenuItem>
                                                                    <MenuItem value="0">휴일</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </td>
                                                        <td><TextField className={ classes.width100 } label="오픈시간" variant="outlined"/></td>
                                                        <td><TextField className={ classes.width100 } label="마감시간" variant="outlined"/></td>
                                                    </tr>
                                                    <tr data-code="TUE">
                                                        <td>화</td>
                                                        <td>
                                                            <FormControl variant="outlined" className={classes.width100}>
                                                                <Select value="1">
                                                                    <MenuItem value="1">운영</MenuItem>
                                                                    <MenuItem value="0">휴일</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </td>
                                                        <td><TextField className={ classes.width100 } label="오픈시간" variant="outlined"/></td>
                                                        <td><TextField className={ classes.width100 } label="마감시간" variant="outlined"/></td>
                                                    </tr>
                                                    <tr data-code="WED">
                                                        <td>수</td>
                                                        <td>
                                                            <FormControl variant="outlined" className={classes.width100}>
                                                                <Select value="1">
                                                                    <MenuItem value="1">운영</MenuItem>
                                                                    <MenuItem value="0">휴일</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </td>
                                                        <td><TextField className={ classes.width100 } label="오픈시간" variant="outlined"/></td>
                                                        <td><TextField className={ classes.width100 } label="마감시간" variant="outlined"/></td>
                                                    </tr>
                                                    <tr data-code="THU">
                                                        <td>목</td>
                                                        <td>
                                                            <FormControl variant="outlined" className={classes.width100}>
                                                                <Select value="1">
                                                                    <MenuItem value="1">운영</MenuItem>
                                                                    <MenuItem value="0">휴일</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </td>
                                                        <td><TextField className={ classes.width100 } label="오픈시간" variant="outlined"/></td>
                                                        <td><TextField className={ classes.width100 } label="마감시간" variant="outlined"/></td>
                                                    </tr>
                                                    <tr data-code="FRI">
                                                        <td>금</td>
                                                        <td>
                                                            <FormControl variant="outlined" className={classes.width100}>
                                                                <Select value="1">
                                                                    <MenuItem value="1">운영</MenuItem>
                                                                    <MenuItem value="0">휴일</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </td>
                                                        <td><TextField className={ classes.width100 } label="오픈시간" variant="outlined"/></td>
                                                        <td><TextField className={ classes.width100 } label="마감시간" variant="outlined"/></td>
                                                    </tr>
                                                    <tr data-code="SAT">
                                                        <td>토</td>
                                                        <td>
                                                            <FormControl variant="outlined" className={classes.width100}>
                                                                <Select value="1">
                                                                    <MenuItem value="1">운영</MenuItem>
                                                                    <MenuItem value="0">휴일</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </td>
                                                        <td><TextField className={ classes.width100 } label="오픈시간" variant="outlined"/></td>
                                                        <td><TextField className={ classes.width100 } label="마감시간" variant="outlined"/></td>
                                                    </tr>
                                                    <tr data-code="SUN">
                                                        <td>일</td>
                                                        <td>
                                                            <FormControl variant="outlined" className={classes.width100}>
                                                                <Select value="1">
                                                                    <MenuItem value="1">운영</MenuItem>
                                                                    <MenuItem value="0">휴일</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </td>
                                                        <td><TextField className={ classes.width100 } label="오픈시간" variant="outlined"/></td>
                                                        <td><TextField className={ classes.width100 } label="마감시간" variant="outlined"/></td>
                                                    </tr>
                                                </tbody>                                            
                                            </table>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <TextField multiline className={ classes.width100 } label="매장 소개" rows="5" variant="outlined" defaultValue={ isNull(store.description) }
                                                        onBlur={changeStoreValue('description')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <TextField multiline className={ classes.width100 } label="원산지 소개" rows="5" variant="outlined" defaultValue={ isNull(store.originDescription) }
                                                        onBlur={changeStoreValue('originDescription')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <TextField className={ classes.width100 } label="검색어 설정 - ,(콤마)로 구분" variant="outlined" defaultValue={ isNull(store.tag) }
                                                        onBlur={changeStoreValue('tag')}/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={classes.divRow}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={3}>
                                                    <FormControl variant="outlined" className={classes.width100}>
                                                        <InputLabel
                                                            id="store-simple-notice-type">공지타입</InputLabel>
                                                        <Select
                                                            labelId="store-simple-notice-type"
                                                            defaultValue={ isNull(store.simpleNoticeType, "NONE")}
                                                            onChange={changeStoreValue('simpleNoticeType')}
                                                            labelWidth={70}
                                                        >
                                                            <MenuItem value="NONE">없음</MenuItem>
                                                            <MenuItem value="FIXED">상단고정형</MenuItem>
                                                            <MenuItem value="POPUP">팝업형</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={9}>
                                                    <TextField multiline className={ classes.width100 } label="간단 공지사항" rows="5" variant="outlined" defaultValue={ isNull(store.simpleNotice) }
                                                        onBlur={changeStoreValue('simpleNotice')}/>
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

                                { store === null &&
                                    <div>불러오는 중입니다.</div>
                                }

                            </Paper>
                        </Grid>
                        <Grid item xs={8}>
                            <Paper square className={classes.divRow}>
                                <Tabs
                                    value={menuTabValue}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={ changeMenuTabs }
                                    >
                                    <Tab label="메뉴"/>
                                    <Tab label="주문내역"/>
                                    <Tab label="스탬프 설정"/>
                                    <Tab label="기기관리"/>
                                    <Tab label="기기로그"/>
                                    <Tab label="로고관리"/>
                                </Tabs>
                            </Paper>
                            { (products !== null && menuTabValue === 0) &&
                                <div>
                                    <Grid container spacing={2}>
                                        <Grid item xs={2}>
                                            {
                                                hasStoreMeta &&
                                                    <a href={ "/StoreMeta/" + match.params.id } target="_blank"><Button variant="contained" color="primary" className={[classes.width100, classes.divRow].join(' ')}>메타 관리↗</Button></a>
                                            }
                                            <Button variant="contained" color="primary" className={[classes.width100, classes.divRow].join(' ')} onClick={doOpenCategoryDialog}>카테고리 관리</Button>
                                            <Paper square className={classes.divRow}>
                                                <Tabs
                                                    orientation="vertical"
                                                    value={productTabValue}
                                                    indicatorColor="primary"
                                                    textColor="primary"
                                                    onChange={ changeProductTabs }
                                                    >
                                                    <Tab label="전체"/>
                                                    {
                                                        store.productCategory.map((row, index) => (
                                                            <Tab label={row.name} key={row.id}/>
                                                        ))
                                                    }
                                                </Tabs>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Grid container justify="flex-end" style={{ position:'relative' }}>
                                                <Grid item style={{ position:'absolute', left: 0 }}>
                                                    <label htmlFor="excelProducts">
                                                        <div className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-containedSizeSmall MuiButton-sizeSmall"
                                                            >엑셀업로드</div>
                                                    </label>
                                                    <input type="file" id="excelProducts" className={classes.hidden} onChange={
                                                        (e) => {
                                                            let files = e.target.files;
                                                            if (files.length > 0) {
                                                                let file = files[0];
                                                                console.log(file);
    
                                                                if (!file.name.match(/(.xlsx)$/)) {
                                                                    alert("xlsx 파일만 등록해주세요");
                                                                    return;
                                                                }
    
                                                                let formData = new FormData();
                                                                formData.append('file', file);
                                                                setBackdrop(true);

                                                                axios({
                                                                    "url": API_HOST + "/master/uploadExcelFileToProduct?storeId=" + store.id,
                                                                    "method": "post",
                                                                    "data": formData,
                                                                    "headers": {
                                                                        'Content-Type': 'multipart/form-data'
                                                                    }
                                                                })
                                                                .then(function (response) {
                                                                    console.log(response);
                                                                    let result = response.data;
                                                                    if (result === "") {
                                                                        result = "상품등록이 완료 되었습니다.";
                                                                    }
                                                                    setSnackMessage(result);
                                                                    
                                                                    loadData(match.params.id)
                                                                    .then((response) => {
                                                                        setData(response);
                                                                        setBackdrop(false);
                                                                        openSnackbar();
                                                                    });
                                                                });
                                                            }
                                                        }}/>
                                                </Grid>
                                                <Grid item style={{ marginBottom: 10, marginRight: 20 }}>
                                                    <Box display="flex" alignItems="center">
                                                        <Box flexShrink={0} style={{ lineHeight: 0, marginRight: 10 }}>
                                                            <SortIcon />
                                                        </Box>
                                                        <Box flexGrow={0}>
                                                            <Select
                                                                defaultValue={ sortProduct }
                                                                onChange={ doChangeSortProduct }
                                                                components={{ DropdownIndicator:() => null }}>
                                                                    <MenuItem value={ 0 }>상태 순</MenuItem>
                                                                    <MenuItem value={ 1 }>우선순위 순</MenuItem>
                                                                    <MenuItem value={ 2 }>이름 순</MenuItem>
                                                            </Select>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                                <Grid item style={{ marginBottom: 10 }}>
                                                    <Button aria-label="Add" color="primary" size="small" variant="contained" onClick={doOpenBestMenuDialog()} style={{marginRight:"5px"}}>베스트 메뉴 관리</Button>
                                                    <Button aria-label="Add" color="primary" size="small" variant="contained" onClick={doOpenDialog(null)}>상품추가</Button>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={1}>
                                            {
                                                products.map((row, index) => (
                                                    <Grid item xs={3} key={index}>
                                                        <Paper square className={classes.paper} onClick={doOpenDialog(row.id)}>
                                                            <div className={ classes.relative }>
                                                                <img src={ row.images ? row.images : "/img/default-product.png" } className={classes.width100} alt={ row.name } onError={(e) => { e.target.src="/img/default-product.png"}}/>
                                                                <Select
                                                                    style={{ position:'absolute', top:'0', right:'0' }}
                                                                    value={ row.status }
                                                                    onClick={preventParent}
                                                                    onChange={changeProductsChecked('status', index)}
                                                                    components={{ DropdownIndicator:() => null }}>
                                                                        <MenuItem value={"1"}>사용</MenuItem>
                                                                        <MenuItem value={"0"}>미사용</MenuItem>
                                                                        <MenuItem value={"-1"}>품절</MenuItem>
                                                                </Select>
                                                            </div>
                                                            <Typography variant="h6">
                                                                { row.name }
                                                            </Typography>
                                                            <Typography variant="body1">
                                                                { numeral(row.price).format(0,0) } 원
                                                            </Typography>
                                                            <div style={{ marginTop: '6px' }}>
                                                                {
                                                                    productTabValue === 0 &&
                                                                        <span className={classes.miniBadgeRed}>{ row.productCategory ? row.productCategory.name : "카테고리 미지정"}</span>
                                                                }
                                                                <span className={(row.canDiscount === null || row.canDiscount || row.canDiscount === "true") ? classes.miniBadgeRedLight : classes.miniBadgeRedLightOutlined}>
                                                                    { (row.canDiscount === null || row.canDiscount || row.canDiscount === "true") ? "할인 적용" : "할인 미적용" }
                                                                </span>
                                                                <span className={(row.canMembership === null || row.canMembership || row.canMembership === "true") ? classes.miniBadgeBlueLight : classes.miniBadgeBlueLightOutlined}>
                                                                    { (row.canMembership === null || row.canMembership) ? "멤버십 적용" : "멤버십 미적용" }
                                                                </span>
                                                                {
                                                                    (store && store.linkApi && store.linkCode) &&
                                                                        <span className={(row.linkCode) ? classes.miniBadgeGreenLight : classes.miniBadgeGreenLightOutlined }>
                                                                            { (row.linkCode) ? "링크코드 적용" : "링크코드 미적용" }
                                                                        </span>
                                                                }
                                                            </div>
                                                        </Paper>
                                                    </Grid>
                                                ))
                                            }
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </div>
                            }
                            
                            { (products !== null && menuTabValue === 1) &&
                                <Paper className={classes.root}>
                                    <Grid container>
                                        <Grid item xs={12} style={{ paddingTop:'16px', paddingLeft: '16px', paddingRight: '16px' }}>
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
                                                                control={<Checkbox color="primary" checked={posTab} onChange={doCheckDeviceTabs} name="posTab" />}
                                                                label="POS"
                                                            />
                                                            <FormControlLabel
                                                                control={<Checkbox color="primary" checked={tablet} onChange={doCheckDeviceTabs} name="tablet" />}
                                                                label="TABLET"
                                                            />
                                                        </FormGroup>
                                                    </FormControl>
                                                </Box>
                                                <Box flexShrink={1}>
                                                    <FormControl required component="fieldset" className={classes.formControl}>
                                                        <FormLabel component="legend">상태</FormLabel>
                                                        <FormGroup row>
                                                            <FormControlLabel
                                                                control={<Checkbox color="primary" checked={status00} onChange={doCheckStatusTabs} name="status00" />}
                                                                label="결제 완료"
                                                            />
                                                            <FormControlLabel
                                                                control={<Checkbox color="primary" checked={status01} onChange={doCheckStatusTabs} name="status01" />}
                                                                label="주문 접수"
                                                            />
                                                            <FormControlLabel
                                                                control={<Checkbox color="primary" checked={status03} onChange={doCheckStatusTabs} name="status04" />}
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
                                                    </FormControl>
                                                </Box>
                                                <Box flexGrow={1} textAlign="right">
                                                    <Button variant="contained" color="primary" onClick={reloadOrderList}>조회</Button>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Table className={classes.table} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center" style={{ width:'130px' }}>주문번호<br/>주문일</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'100px' }}>주문<br/>기기</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'100px' }}>주문자</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'65px' }}>상태</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'250px' }}>상품명</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'75px' }}>수량</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'100px' }}>상품가</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'100px' }}>본사 할인</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'100px' }}>매장 할인</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'100px' }}>그룹 할인</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'100px' }}>결제방법<br/>결제금액</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'120px' }}>거절<br/>사유</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                orders.map(row => (
                                                    <StyledTableRow key={ row.id }>
                                                        <StyledTableCell component="th" scope="row" align="center"><small>{ row.oid }<br/>{ row.authDate }</small></StyledTableCell>
                                                        <StyledTableCell component="th" scope="row" align="center">{ row.device }</StyledTableCell>
                                                        <StyledTableCell>
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
                                                        <StyledTableCell align="center">{ numeral(getQty(row)).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell align="right">{ numeral(getPrice(row)).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell align="right">{ numeral(getDiscount(row)).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell align="right">{ numeral(getStoreDiscount(row)).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell align="right">{ numeral(getGroupDiscount(row)).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell align="right">{ row.payMethod }<br/>{ numeral(row.totalPrice).format('0,0') }</StyledTableCell>
                                                        <StyledTableCell align="center">{ row.memoRject }</StyledTableCell>
                                                    </StyledTableRow>
                                                ))
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
                            
                            { (products !== null && menuTabValue === 2) &&
                                // 스탬프 설정
                                
                                <Grid container spacing={1}>
                                    { (store !== null && store.hasMembership === "STAMP") &&
                                        <Grid item xs={6}>
                                            <Paper square className={classes.paper}>
                                                <Typography variant="h5" noWrap className={classes.divRow} style={{ marginBottom: '24px' }}>
                                                    스탬프 설정
                                                </Typography>

                                                <Grid container spacing={1} className={classes.divRow}>
                                                    <Grid item xs={4}>
                                                        <FormControl variant="outlined" className={classes.width100}>
                                                            <InputLabel
                                                                id="stamp-stack-type">적립타입</InputLabel>
                                                            <Select
                                                                labelId="stamp-stack-type"
                                                                value={ stampMaster !== null ? stampMaster.stampStackType : ''}
                                                                onChange={changeStampMasterValue('stampStackType')}
                                                                labelWidth={75}
                                                            >
                                                                <MenuItem value="CUP" key="CUP">잔 당</MenuItem>
                                                                <MenuItem value="AMT" key="AMT">금액 당</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <TextField className={ classes.width100 } label="적립 기준" variant="outlined"
                                                            defaultValue={ stampMaster !== null ? isNull(stampMaster.stampStackAmount) : "" }
                                                            onBlur={changeStampMasterValue('stampStackAmount')}/>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <TextField className={ classes.width100 } label="스탬프 최대 숫자" variant="outlined"
                                                            defaultValue={ stampMaster !== null ? isNull(stampMaster.stampMaxCount) : "" }
                                                            onBlur={changeStampMasterValue('stampMaxCount')}/>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <span style={{ color:'#f00', fontSize:'0.8em' }}>※ 스탬프 최대 숫자 변경시, 기존에 발행된 스탬프 카드의 최대 숫자는 변동되지 않습니다.</span>
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={1} className={classes.divRow}>
                                                    <Grid item xs={12}>
                                                        <TextField className={ classes.width100 } label="스탬프카드 유효기간 (일수)" variant="outlined"
                                                            defaultValue={ stampMaster !== null ? isNull(stampMaster.stampCardExpireDate) : "" }
                                                            onBlur={changeStampMasterValue('stampCardExpireDate')}/>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <span style={{ color:'#f00', fontSize:'0.8em' }}>※ 0으로 적을시, 유효기간 제한이 없습니다.</span>
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={1} className={classes.divRow}>
                                                    <Grid item xs={12}>
                                                        <TextField className={ classes.width100 } label="스탬프 유효기간 (일수)" variant="outlined"
                                                            defaultValue={ stampMaster !== null ? isNull(stampMaster.stampExpireDate) : "" }
                                                            onBlur={changeStampMasterValue('stampExpireDate')}/>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <span style={{ color:'#f00', fontSize:'0.8em' }}>※ 0으로 적을시, 유효기간 제한이 없습니다.</span>
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={1} className={classes.divRow}>
                                                    <Grid item xs={12}>
                                                        <TextField className={ classes.width100 } label="쿠폰 이름" variant="outlined"
                                                            defaultValue={ couponType.name }
                                                            onBlur={changeCouponTypeValue('name')}/>
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={1} className= {classes.divRow }>
                                                    <Grid item xs={12}>
                                                        <TextField className={ classes.width100 } label="쿠폰 금액" variant="outlined" defaultValue={ couponType.couponAmount }
                                                            onBlur={ changeCouponTypeValue("couponAmount") }
                                                            helperText="쿠폰 할인 금액을 적어주세요"/>
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={1} className= {classes.divRow }>
                                                    <Grid item xs={12}>
                                                        <TextField className={ classes.width100 } label="쿠폰 유효기간(일수)" variant="outlined" defaultValue={ couponType.couponExpireDate }
                                                            onBlur={ changeCouponTypeValue("couponExpireDate") }/>
                                                        <Grid item xs={12}>
                                                            <span style={{ color:'#f00', fontSize:'0.8em' }}>※ 필수입력 사항입니다.</span>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={1} className= {classes.divRow }>
                                                    <Grid item xs={12}>
                                                        <TextField className={ classes.width100 } multiline rows="4" label="쿠폰 설명" variant="outlined" defaultValue={ couponType.description }
                                                            onBlur={ changeCouponTypeValue("description") }/>
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={1} className={classes.divRow}>
                                                    <Grid item align="right" xs={12}>
                                                        <Button className={ classes.button } variant="contained" color="primary" style={{ padding: '10px 12px' }}
                                                            onClick={ doSaveStampMaster } >설정 저장</Button>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        
                                        </Grid>
                                    }
                                    { (store !== null && store.hasMembership !== "STAMP") &&
                                        <div style={{ padding: '16px' }}>해당 매장은 스탬프 멤버십에 가입되어있지 않습니다.</div>
                                    }

                                    { store === null &&
                                        <div>불러오는 중입니다.</div>
                                    }
                                </Grid>
                            }
                            
                            { (products !== null && menuTabValue === 3) &&
                                // 기기 관리
                                <div>
                                    <Grid container justify="flex-end">
                                        <Grid item style={{ marginBottom: 10 }}>
                                            <Button aria-label="Add" color="primary" size="small" variant="contained" onClick={ () => doOpenPosDialog(null)}>기기추가</Button>
                                        </Grid>
                                    </Grid>
                                    <Paper className={classes.root}>
                                        <Table className={classes.table} aria-label="customized table">
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell align="center" style={{ width:'30px' }}>상태</StyledTableCell>
                                                    <StyledTableCell align="center" style={{ width:'60px' }}>기기 번호</StyledTableCell>
                                                    <StyledTableCell align="center" style={{ width:'100px' }}>기기 타입<br/>기기 별칭</StyledTableCell>
                                                    <StyledTableCell align="center" style={{ width:'200px' }}>모델명<br/>기기 UUID(시리얼)</StyledTableCell>
                                                    <StyledTableCell align="center" style={{ width:'200px' }}>현재 버전</StyledTableCell>
                                                    <StyledTableCell align="center">키오스크 메인 이미지<br/>(권장 크기 768 * 1024)</StyledTableCell>
                                                    <StyledTableCell align="center">정보 수정</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    poses.map(row => (
                                                        <StyledTableRow key={ row.id }>
                                                            <StyledTableCell component="th" scope="row" align="center">{ row.onoff && row.onoff === "1" ? <span style={{color:'#143eb1'}}><RadioButtonUncheckedIcon/></span> : <span style={{color:'#e03d3d'}}><CloseIcon/></span> }</StyledTableCell>
                                                            <StyledTableCell component="th" scope="row" align="center">{ row.code }</StyledTableCell>
                                                            <StyledTableCell align="center">{ row.type }<br/>{ row.name }</StyledTableCell>
                                                            <StyledTableCell align="center">{ row.model }<br/>{ row.uuid }</StyledTableCell>
                                                            <StyledTableCell align="center">{ row.version }</StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                <div>
                                                                    <label htmlFor={ "store-images-" + row.id }>
                                                                        <img src={ row.mainImage } style={{ maxWidth: '135px',  maxHeight: '240px', boxShadow:'0px 1px 4px #333' }} alt={ row.mainImage } onError={(e) => { e.target.src="/img/default-product.png"}} />
                                                                    </label>
                                                                    <input type="file" id={ "store-images-" + row.id } className={classes.hidden} onChange={ (e) => changePosMainImagePreview(e, row) }/>
                                                                </div>
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                <Button variant="contained" color="primary" onClick={ () => doOpenPosDialog(row) }><CreateIcon fontSize="small"/></Button>
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </Paper>
                                </div>
                            }
                            
                            { (products !== null && menuTabValue === 4) &&
                                <Paper className={classes.root}>
                                    <Table className={classes.table} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center" style={{ width:'150px' }}>날짜</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'100px' }}>타입</StyledTableCell>
                                                <StyledTableCell align="center">내용</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'100px' }}>버전</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                logs.map(row => (
                                                    <StyledTableRow key={ row.id }>
                                                        <StyledTableCell component="th" scope="row" align="center">{ moment(row.createdAt).format("YYYY-MM-DD HH:mm:ss") }</StyledTableCell>
                                                        <StyledTableCell align="center">{ setLogsStatus(row.type) }</StyledTableCell>
                                                        <StyledTableCell>{ row.content }</StyledTableCell>
                                                        <StyledTableCell align="center">{ row.version }</StyledTableCell>
                                                    </StyledTableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                    <CssBaseline />
                                    <Container align="center" className={classes.paginationRow}>
                                        <Pagination
                                            limit={1}
                                            offset={logPage}      // Row Number Skip offset
                                            total={logTotalPage}
                                            onClick={(e, offset) => clickLogPagination(offset)}
                                            size="large"
                                        />
                                    </Container>
                                </Paper>
                            }
                            {
                                menuTabValue === 5 &&
                                <div>
                                    <Paper className={classes.root}>
                                        <Table className={classes.table} aria-label="customized table">
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell align="center">컬러 로고 이미지</StyledTableCell>
                                                    <StyledTableCell align="center">흑백 로고 이미지</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    <StyledTableRow >
                                                        <StyledTableCell align="center">
                                                            <div>
                                                                <label htmlFor={"store-images-logoImage"}>
                                                                    {
                                                                        store.logoImage === null &&
                                                                        <img src={ "/img/default-product.png" } style={{ maxWidth: '135px',  maxHeight: '240px', boxShadow:'0px 1px 4px #333' }} alt={ store.logoImage } onError={(e) => { e.target.src="/img/default-product.png"}} />    
                                                                    }
                                                                    {
                                                                        store.logoImage !== null &&
                                                                        <img src={ store.logoImage } style={{ maxWidth: '135px',  maxHeight: '240px', boxShadow:'0px 1px 4px #333' }} alt={ store.logoImage } onError={(e) => { e.target.src="/img/default-product.png"}} />
                                                                    }
                                                                </label>
                                                                <input type="file" id={ "store-images-logoImage"} className={classes.hidden} onChange={ (e) => changeLogoImagePreview(e, store.logoImage) }/>
                                                            </div>
                                                        </StyledTableCell>
                                                        <StyledTableCell align="center">
                                                            <div>
                                                                <label htmlFor={"store-images-logoImage2"}>
                                                                    {
                                                                        store.logoImage2 === null &&
                                                                        <img src={ '/img/default-product.png' } style={{ maxWidth: '135px',  maxHeight: '240px', boxShadow:'0px 1px 4px #333' }} alt={ store.logoImage2 } onError={(e) => { e.target.src="/img/default-product.png"}} />
                                                                    }
                                                                    {
                                                                        store.logoImage !== null &&
                                                                        <img src={ store.logoImage2 } style={{ maxWidth: '135px',  maxHeight: '240px', boxShadow:'0px 1px 4px #333' }} alt={ store.logoImage2 } onError={(e) => { e.target.src="/img/default-product.png"}} />
                                                                    }
                                                                </label>
                                                                <input type="file" id={ "store-images-logoImage2" } className={classes.hidden} onChange={ (e) => changeLogoImagePreview2(e, store.logoImage2) }/>
                                                            </div>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                }
                                            </TableBody>
                                        </Table>
                                    </Paper>
                                </div>
                            }
                        </Grid>
                    </Grid>
                </div>

                {
                    /* Dialog */
                    product !== null &&                
                        <Dialog onClose={doCloseDialog} className="store-container" aria-labelledby="product-dialog-title" open={openDialog} fullWidth maxWidth="md">
                            <DialogTitle onClose={doCloseDialog}>상품 정보</DialogTitle>
                            <DialogContent dividers>
                                <Grid container spacing={4}>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle1" className={classes.divRow}>기본 정보</Typography>
                                        <div align="center" className={classes.divRow}>
                                            <div className={ classes.relative }>
                                                <img src={ product.images } className={classes.width75} alt={ product.name }
                                                    onClick={ doOpenProductBucketImageDialog.bind(this, product.images) }
                                                    onError={(e) => { e.target.src="/img/default.png"}}/>
                                                    
                                                <Select
                                                    style={{ position:'absolute', top:'0', right:'0' }}
                                                    value={ product.status }
                                                    onClick={preventParent}
                                                    onChange={changeProductChecked}>
                                                        <MenuItem value={"1"}>사용</MenuItem>
                                                        <MenuItem value={"0"}>미사용</MenuItem>
                                                        <MenuItem value={"-1"}>품절</MenuItem>
                                                </Select>
                                            </div>
                                        </div>
                                        <div>
                                            <Grid container spacing={1} className={classes.divRow}>
                                                <Grid item xs={8}>
                                                    <TextField className={ classes.width100 } label="상품 이름" variant="outlined" defaultValue={ isNull(product.name) }
                                                        onBlur={changeProductValue('name')}/>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    
                                                    <FormControl variant="outlined" className={classes.width100}>
                                                        <InputLabel
                                                            id="product-type">카테고리</InputLabel>
                                                        <Select
                                                            labelId="product-type"
                                                            value={ product.productCategory !== null ? product.productCategory.id : ''}
                                                            onChange={changeProductCategoryValue(product.id)}
                                                            labelWidth={75}
                                                        >
                                                            {
                                                                store.productCategory.map((row, index) => (
                                                                    <MenuItem value={row.id} key={index}>{row.name}</MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={1} className={classes.divRow}>
                                                <Grid item xs={4}>
                                                    <TextField className={ classes.width100 } label="정상가" variant="outlined" defaultValue={ isNull(product.price) }
                                                        onBlur={changeProductValue('price')}/>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <TextField className={ classes.width100 } label="순서" variant="outlined" defaultValue={ product.priority === null ? 99 : product.priority }
                                                        onBlur={changeProductValue('priority')}/>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControl variant="outlined" className={classes.width100}>
                                                        <InputLabel
                                                            id="product-type">할인 적용</InputLabel>
                                                        <Select
                                                            labelId="product-type"
                                                            defaultValue={isNull(product.canDiscount)}
                                                            onBlur={changeProductValue('canDiscount')}
                                                            labelWidth={75}
                                                        >
                                                            <MenuItem value="true">적용</MenuItem>
                                                            <MenuItem value="false">미적용</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControl variant="outlined" className={classes.width100}>
                                                        <InputLabel
                                                            id="product-type">멤버십 적용</InputLabel>
                                                        <Select
                                                            labelId="product-type"
                                                            defaultValue={isNull(product.canMembership)}
                                                            onBlur={changeProductValue('canMembership')}
                                                            labelWidth={75}
                                                        >
                                                            <MenuItem value="true">적용</MenuItem>
                                                            <MenuItem value="false">미적용</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={1} className={classes.divRow}>
                                                <Grid item xs={6}>
                                                    <FormControl variant="outlined" className={classes.width100}>
                                                        <InputLabel
                                                            id="product-type">포장/매장</InputLabel>
                                                        <Select
                                                            labelId="product-type"
                                                            defaultValue={isNull(product.cup)}
                                                            onBlur={changeProductValue('cup')}
                                                            labelWidth={75}
                                                        >
                                                            <MenuItem value="0">전체</MenuItem>
                                                            <MenuItem value="1">매장 전용</MenuItem>
                                                            <MenuItem value="2">포장 전용</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <InputLabel id="device-checkbox-label">기기설정</InputLabel>
                                                    <FormControl variant="outlined" className={classes.width100}>
                                                        <div>
                                                        <Button
                                                            color="primary"
                                                            className="mb-2 d-inline-block"
                                                            onClick={() => checkDeviceCheck(1)}
                                                            variant = {checkedDevice.includes(1) ? "contained" : "outlined"}
                                                        >
                                                            {/* <IntlMessages id="button.checkbox" /> */}
                                                            전체
                                                        </Button>
                                                        <Button
                                                            color="primary"
                                                            className="mb-2 d-inline-block"
                                                            onClick={() => checkDeviceCheck(2)}
                                                            variant = {checkedDevice.includes(2) ? "contained" : "outlined"}
                                                            // variant="outlined"
                                                            style={{marginLeft:'5px'}}
                                                        >
                                                            {/* <IntlMessages id="button.checkbox" /> */}
                                                            키오스크
                                                        </Button>
                                                        <Button
                                                            color="primary"
                                                            className="mb-2 d-inline-block"
                                                            onClick={() => checkDeviceCheck(3)}
                                                            variant = {checkedDevice.includes(3) ? "contained" : "outlined"}
                                                            style={{marginLeft:'5px'}}
                                                        >
                                                            {/* <IntlMessages id="button.checkbox" /> */}
                                                            포스
                                                        </Button>
                                                        <Button
                                                            color="primary"
                                                            className="mb-2 d-inline-block"
                                                            onClick={() => checkDeviceCheck(4)}
                                                            variant = {checkedDevice.includes(4) ? "contained" : "outlined"}
                                                            style={{marginLeft:'5px'}}
                                                        >
                                                            {/* <IntlMessages id="button.checkbox" /> */}
                                                            앱
                                                        </Button>
                                                    </div>
                                                        {/* <Select
                                                            multiple
                                                            labelId="device-checkbox-label"
                                                            value={product.device}
                                                            onChange={changeSelectDevice}
                                                            input={<Input />}
                                                            // renderValue={(selected) => selected.join(',')}
                                                            MenuProps={MenuProps}
                                                            labelWidth={75}
                                                        >
                                                            <MenuItem key={"APP"} value={"APP"}>
                                                                <Checkbox checked={product.device.indexOf("APP") > -1}/>
                                                                <ListItemText primary={"APP"} />
                                                            </MenuItem>
                                                            <MenuItem key={"KIOSK"} value={"KIOSK"}>
                                                                <Checkbox checked={product.device.indexOf("KIOSK") > -1}/>
                                                                <ListItemText primary={"KIOSK"} />
                                                            </MenuItem>
                                                            <MenuItem key={"POS"} value={"POS"}>
                                                                <Checkbox checked={product.device.indexOf("POS") > -1}/>
                                                                <ListItemText primary={"POS"} />
                                                            </MenuItem>
                                                        </Select> */}
                                                    </FormControl>
                                                </Grid>
                                                {
                                                    (store.linkApi && store.linkCode) &&
                                                        <Grid item xs={6}>
                                                            <TextField className={ classes.width100 }
                                                                label="링크코드" variant="outlined" defaultValue={ product.linkCode === null ? "" : product.linkCode }
                                                                onBlur={changeProductValue('linkCode')}/>
                                                        </Grid>
                                                }
                                            </Grid>
                                            <Grid container spacing={1} className={classes.divRow}>
                                                <Grid item xs={12}>
                                                    <TextField className={ classes.width100 } multiline rows="4"
                                                        label="메모" variant="outlined" defaultValue={ product.description === null ? "" : product.description }
                                                        onBlur={changeProductValue('description')}/>
                                                </Grid>
                                            </Grid>
                                            {/* <Grid container spacing={1} className={classes.divRow}>
                                                <Grid item xs={12}>
                                                    <TextField className={ classes.width100 } 
                                                        label="태그 설정 - ,(콤마)로 구분" variant="outlined" defaultValue={ product.tag === null ? "" : product.tag }
                                                        onBlur={changeProductValue('tag')}/>
                                                </Grid>
                                            </Grid> */}
                                        </div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle1">
                                            <span>상품 옵션</span>
                                            <Button color="primary" size="small" variant="contained" style={{marginLeft: '10px'}}
                                                onClick={ addProductOptionGroup }>
                                                옵션 그룹 추가
                                            </Button>
                                        </Typography>
                                        <br/>
                                        <Typography variant="body2" className={classes.divRow}>
                                            "얼음, 테이크아웃할인, 개인컵할인, 시간메뉴" 옵션은 고정이름으로 적어줘야됨
                                        </Typography>
                                        <div>
                                            { 
                                                product.productOptionGroups.map((opt, index) => (
                                                    opt.delete === undefined && (       // 삭제 표기
                                                        <div className={classes.divRow} key={index}>
                                                            <Typography variant="subtitle2">
                                                                <span>{ opt.name }</span>
                                                                <InfoIcon style={{ cursor: 'pointer', marginLeft:"2px", transform:"translateY(5px)" }} onClick={doOpenOptionGroupDialog.bind(this, opt)}/>
                                                            </Typography>
                                                            <div>
                                                                {
                                                                    opt.productOptionItems.map((item, i) => (
                                                                        item.delete === undefined && (       // 삭제 표기
                                                                            <Chip clickable className={classes.chip}
                                                                                label={item.value + " / " + numeral(item.price).format('0,0') + "원" + (store && store.linkApi && store.linkCode ? " [" + item.linkCode + "]" : "")}
                                                                                key={i}
                                                                                onClick={doOpenOptionItemDialog.bind(this, item, index) }
                                                                                onDelete={deleteOptionItem.bind(this, index, item.id)}/>
                                                                        )
                                                                    ))
                                                                }
                                                                <Chip label="+" color="primary" clickable className={classes.chip} onClick={addOptionItem.bind(this, index) }/>
                                                            </div>
                                                        </div>
                                                    )
                                                ))
                                            }
                                        </div>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus onClick={doOpenRemoveDialog} color="primary" variant="outlined">
                                    삭제
                                </Button>
                                <Button autoFocus onClick={doSaveDialog} color="primary" variant="contained">
                                    저장
                                </Button>
                            </DialogActions>
                        </Dialog>
                }

                {
                    store !== null &&      
                        <Dialog onClose={doCloseGroupDialog} className="store-container" aria-labelledby="group-dialog-title" open={openGroupDialog} fullWidth maxWidth="xs">
                            <DialogTitle onClose={doCloseGroupDialog}>가맹점 그룹</DialogTitle>
                            <DialogContent dividers style={{padding:'0px'}}>
                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <List>
                                            {
                                                groups.map((row, index) => (
                                                    <ListItem
                                                        selected={isSelectedGroup(index)} key={index}
                                                        onClick={ doSelectGroup.bind(this, index) }
                                                        style={{ backgroundColor: store.group === groups[index].id ? "#ffa4a4" : "#fff", color: store.group === groups[index].id && "#fff" }}>
                                                        <ListItemText primary={row.name} />
                                                    </ListItem>
                                                ))
                                            }
                                        </List>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus onClick={doSaveGroupDialog} color="primary" variant="contained">
                                    저장
                                </Button>
                            </DialogActions>
                        </Dialog>
                }

                {
                    store !== null &&                        
                        <Dialog onClose={doCloseCategoryDialog} className="store-container" aria-labelledby="category-dialog-title" open={openCategoryDialog} fullWidth maxWidth="xs">
                            <DialogTitle onClose={doCloseCategoryDialog}>카테고리 관리</DialogTitle>
                            <DialogContent dividers style={{padding:'0px'}}>
                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <DndProvider backend={Backend}>
                                            <List>
                                                {
                                                    store.productCategory.map((row, index) => (
                                                        <ListItem key={index}>
                                                            <TextField type="number" variant="outlined" value={row.priority} onChange={ doCategoryPriorityEdit(index) } style={{ width: '60px', marginRight:'6px' }}/>
                                                            <ListItemText primary={ row.name === '' ? '새 카테고리' : row.name } />
                                                            <ListItemSecondaryAction>
                                                                <CreateIcon style={{marginRight:'6px'}}
                                                                    onClick={ doOpenCategoryEditDialog.bind(this, index, row.name) }/>
                                                                    { ((row.isUse !== undefined && row.isUse === null) || row.isUse) ? <VisibilityIcon onClick={ doCategoryIsUseEdit.bind(this, index, false) } /> : <VisibilityOffIcon onClick={ doCategoryIsUseEdit.bind(this, index, true) } /> } 
                                                                {/* <DeleteIcon onClick={ doCategoryRemoveEdit.bind(this, index) } /> */}
                                                                <DeleteIcon onClick={ doOpenCategoryRemoveDialog.bind(this, index) } />
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                    ))
                                                }
                                            </List>
                                        </DndProvider>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Grid container spacing={0}>
                                    <Grid item xs={6}>
                                        <Button onClick={doAddCategoryDialog} color="primary" variant="outlined">
                                            추가
                                        </Button>
                                    </Grid>
                                    <Grid item align="right" xs={6}>
                                        <Button autoFocus onClick={doSaveCategoryDialog} color="primary" variant="contained">
                                            저장
                                        </Button>
                                    </Grid>
                                </Grid>
                            </DialogActions>
                        </Dialog>
                }


                    <Dialog onClose={doCloseBestMenuDialog} className="store-container" aria-labelledby="product-dialog-title" open={bestMenuDialog} fullWidth maxWidth="md">
                        <DialogTitle onClose={doCloseBestMenuDialog}>
                            베스트 메뉴
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" className={classes.divRow}>등록된 베스트 메뉴</Typography>
                                    <Grid container spacing={1}>

                                    {
                                        bestMenuList.length !== 0 &&
                                        bestMenuList.map((row, index) => (
                                            <Grid item xs={3} key={index}>
                                                <Paper square className={classes.paper}>
                                                    <div className={ classes.relative }>
                                                        <img src={ row.images ? row.images : "/img/default-product.png" } className={classes.width100} alt={ row.name } onError={(e) => { e.target.src="/img/default-product.png"}}/>
                                                        <Button
                                                            style={{ position:'absolute', top:'0', right:'0' }}
                                                            color="primary"
                                                            variant="contained"
                                                            onClick={() => changeBestMenu(row,false)}
                                                        >
                                                            제거
                                                        </Button>
                                                    </div>
                                                    <Typography variant="h6">
                                                        { row.name }
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        { numeral(row.price).format(0,0) } 원
                                                    </Typography>
                                                    <div style={{ marginTop: '6px' }}>
                                                        {
                                                            productTabValue === 0 &&
                                                                <span className={classes.miniBadgeRed}>{ row.productCategory ? row.productCategory.name : "카테고리 미지정"}</span>
                                                        }
                                                        <span className={(row.canDiscount === null || row.canDiscount || row.canDiscount === "true") ? classes.miniBadgeRedLight : classes.miniBadgeRedLightOutlined}>
                                                            { (row.canDiscount === null || row.canDiscount || row.canDiscount === "true") ? "할인 적용" : "할인 미적용" }
                                                        </span>
                                                        <span className={(row.canMembership === null || row.canMembership || row.canMembership === "true") ? classes.miniBadgeBlueLight : classes.miniBadgeBlueLightOutlined}>
                                                            { (row.canMembership === null || row.canMembership) ? "멤버십 적용" : "멤버십 미적용" }
                                                        </span>
                                                        {
                                                            (store && store.linkApi && store.linkCode) &&
                                                                <span className={(row.linkCode) ? classes.miniBadgeGreenLight : classes.miniBadgeGreenLightOutlined }>
                                                                    { (row.linkCode) ? "링크코드 적용" : "링크코드 미적용" }
                                                                </span>
                                                        }
                                                    </div>
                                                </Paper>
                                            </Grid>
                                        ))
                                    }
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" className={classes.divRow}>메뉴 목록</Typography>
                                    <Grid container spacing={1}>

                                    {
                                        products !== null &&
                                        products.map((row, index) => (
                                            <Grid item xs={3} key={index}>
                                                <Paper square className={classes.paper}>
                                                    <div className={ classes.relative }>
                                                        <img src={ row.images ? row.images : "/img/default-product.png" } className={classes.width100} alt={ row.name } onError={(e) => { e.target.src="/img/default-product.png"}}/>
                                                        <Button
                                                            style={{ position:'absolute', top:'0', right:'0' }}
                                                            color="secondary"
                                                            variant="contained"
                                                            onClick={() => changeBestMenu(row,true)}
                                                        >
                                                            등록
                                                        </Button>
                                                    </div>
                                                    <Typography variant="h6">
                                                        { row.name }
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        { numeral(row.price).format(0,0) } 원
                                                    </Typography>
                                                    <div style={{ marginTop: '6px' }}>
                                                        {
                                                            productTabValue === 0 &&
                                                                <span className={classes.miniBadgeRed}>{ row.productCategory ? row.productCategory.name : "카테고리 미지정"}</span>
                                                        }
                                                        <span className={(row.canDiscount === null || row.canDiscount || row.canDiscount === "true") ? classes.miniBadgeRedLight : classes.miniBadgeRedLightOutlined}>
                                                            { (row.canDiscount === null || row.canDiscount || row.canDiscount === "true") ? "할인 적용" : "할인 미적용" }
                                                        </span>
                                                        <span className={(row.canMembership === null || row.canMembership || row.canMembership === "true") ? classes.miniBadgeBlueLight : classes.miniBadgeBlueLightOutlined}>
                                                            { (row.canMembership === null || row.canMembership) ? "멤버십 적용" : "멤버십 미적용" }
                                                        </span>
                                                        {
                                                            (store && store.linkApi && store.linkCode) &&
                                                                <span className={(row.linkCode) ? classes.miniBadgeGreenLight : classes.miniBadgeGreenLightOutlined }>
                                                                    { (row.linkCode) ? "링크코드 적용" : "링크코드 미적용" }
                                                                </span>
                                                        }
                                                    </div>
                                                </Paper>
                                            </Grid>
                                        ))
                                    }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={doSaveBestMenuDialog} color="primary" variant="contained">
                                저장
                            </Button>
                        </DialogActions>
                    </Dialog>
                
                <Dialog onClose={doCloseDaumDialog} open={openDaumDialog} fullWidth maxWidth="sm">
                    <DialogContent>
                        <DaumPostcode
                        onComplete={ selectDaumAddress }
                        height={500}
                        />
                    </DialogContent>
                </Dialog>
                
                <Dialog onClose={doCloseCategoryEditDialog} open={openCategoryEditDialog} className="store-container" fullWidth maxWidth="xs">
                    <DialogContent>
                        <TextField className={ classes.width100 } label="카테고리 이름" variant="outlined" defaultValue={ tmpCategoryName }
                            onBlur={ (event) => { setTmpCategoryName(event.target.value) } }/>
                    </DialogContent>
                    <DialogActions>
                        <Grid container spacing={0}>
                            <Grid item align="right" xs={12}>
                                <Button autoFocus onClick={doSaveCategoryEditDialog} color="primary" variant="contained">
                                    확인
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
                
                <Dialog onClose={doCloseCategoryRemoveDialog} open={openCategoryRemoveDialog} className="store-container" fullWidth maxWidth="xs">
                    <DialogContent>
                        정말 삭제하시겠습니까?
                    </DialogContent>
                    <DialogActions>
                        <Grid container spacing={0}>
                            <Grid item align="right" xs={12}>
                                <Button autoFocus onClick={doCloseCategoryRemoveDialog} color="primary" variant="outlined" style={{marginRight: '8px'}}>
                                    취소
                                </Button>
                                <Button autoFocus onClick={doCategoryRemoveEdit} color="primary" variant="contained">
                                    확인
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
                
                <Dialog onClose={doCloseRemoveDialog} open={openRemoveDialog} className="store-container" fullWidth maxWidth="xs">
                    <DialogContent>
                        정말 삭제하시겠습니까?
                    </DialogContent>
                    <DialogActions>
                        <Grid container spacing={0}>
                            <Grid item align="right" xs={12}>
                                <Button autoFocus onClick={doCloseRemoveDialog} color="primary" variant="outlined" style={{marginRight: '8px'}}>
                                    취소
                                </Button>
                                <Button autoFocus onClick={doDeleteDialog} color="primary" variant="contained">
                                    확인
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
                
                <Dialog onClose={doCloseOptionGroupDialog} open={openOptionGroupDialog} className="store-container" fullWidth maxWidth="xs">
                    <DialogContent>
                        <Grid container spacing={2} className={classes.divRow}>
                            <Grid item xs={8}>
                                <TextField className={ classes.width100 } label="옵션 그룹 이름" variant="outlined" defaultValue={ tmpOptionGroup.name }
                                    onBlur={changeProductOptionGroupValue('name')}/>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField className={ classes.width100 } label="우선순위" variant="outlined" defaultValue={ tmpOptionGroup.priority }
                                    onBlur={changeProductOptionGroupValue('priority')}/>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                
                                <FormControl variant="outlined" className={classes.width100}>
                                    <InputLabel
                                        id="store-type">사용여부</InputLabel>
                                    <Select
                                        labelId="store-type"
                                        defaultValue={isNull(tmpOptionGroup.isUse)}
                                        onBlur={changeProductOptionGroupValue('isUse')}
                                        labelWidth={75}
                                    >
                                        <MenuItem value="true">사용</MenuItem>
                                        <MenuItem value="false">미사용</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl variant="outlined" className={classes.width100}>
                                    <InputLabel
                                        id="store-type">필수여부</InputLabel>
                                    <Select
                                        labelId="store-type"
                                        defaultValue={isNull(tmpOptionGroup.isRequired)}
                                        onBlur={changeProductOptionGroupValue('isRequired')}
                                        labelWidth={75}
                                    >
                                        <MenuItem value="true">필수</MenuItem>
                                        <MenuItem value="false">선택</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl variant="outlined" className={classes.width100}>
                                    <InputLabel
                                        id="store-type">단일여부</InputLabel>
                                    <Select
                                        labelId="store-type"
                                        defaultValue={isNull(tmpOptionGroup.isSingle)}
                                        onBlur={changeProductOptionGroupValue('isSingle')}
                                        labelWidth={75}
                                    >
                                        <MenuItem value="true">단일</MenuItem>
                                        <MenuItem value="false">다중</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Grid container spacing={0}>
                            <Grid item align="left" xs={6}>
                                {
                                    isNaN(parseInt(tmpOptionGroup.id)) &&
                                        <Button autoFocus onClick={doDeleteOptionGroup} color="primary" variant="contained">
                                            삭제
                                        </Button>
                                }
                            </Grid>
                            <Grid item align="right" xs={6}>
                                <Button autoFocus onClick={doSaveOptionGroupDialog} color="primary" variant="contained">
                                    확인
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
                
                <Dialog onClose={doCloseOptionItemDialog} open={openOptionItemDialog} className="store-container" fullWidth maxWidth="xs">
                    <DialogContent>
                        {
                            (store && store.linkApi && store.linkCode) &&
                                <Grid container spacing={2} className={classes.divRow}>
                                    <Grid item xs={8}>
                                        <TextField className={ classes.width100 } label="옵션 이름" variant="outlined" defaultValue={ tmpOption.value }
                                            onBlur={changeProductOptionValue('value')}/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField className={ classes.width100 } label="링크코드" variant="outlined" defaultValue={ tmpOption.linkCode }
                                            onBlur={changeProductOptionValue('linkCode')}/>
                                    </Grid>
                                </Grid>
                        }
                        {
                            !(store && store.linkApi && store.linkCode) &&
                                <Grid container spacing={2} className={classes.divRow}>
                                    <Grid item xs={12}>
                                        <TextField className={ classes.width100 } label="옵션 이름" variant="outlined" defaultValue={ tmpOption.value }
                                            onBlur={changeProductOptionValue('value')}/>
                                    </Grid>
                                </Grid>
                        }
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <TextField className={ classes.width100 } label="우선순위" variant="outlined" defaultValue={ tmpOption.priority }
                                    onBlur={changeProductOptionValue('priority')}/>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField className={ classes.width100 } label="옵션 가격" variant="outlined" defaultValue={ tmpOption.price }
                                    onBlur={changeProductOptionValue('price')}/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Grid container spacing={0}>
                            <Grid item align="right" xs={12}>
                                <Button autoFocus onClick={doSaveOptionItemDialog} color="primary" variant="contained">
                                    확인
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
                
                <Dialog onClose={doCloseProductBucketImageDialog} open={openProductBucketImageDialog} className="store-container" fullWidth maxWidth="lg">
                    <DialogTitle>
                        <TextField className={ classes.width100 } label="이미지 이름" variant="outlined"
                            onKeyUp={ doSearchBucket }/>
                    </DialogTitle>
                    <DialogContent>
                        <GridList cellHeight={180} cols={6}>
                            {
                                originBucketImageList.length === bucketImageList.length &&
                                    <GridListTile onClick={ () => { } }
                                        style={{ boxShadow: '0px 0px 0px 1px #999 inset', border: '2px solid white' }}>
                                        <img src={ process.env.PUBLIC_URL + "/img/upload.png" } />
                                        <label htmlFor="product-images" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}></label>
                                        <input type="file" id="product-images" className={classes.hidden} onChange={ (e) => { doUploadProductImage(e); } }/>
                                    </GridListTile>
                            }
                            {
                                bucketImageList.map((row, index) => (
                                    <GridListTile key={index} className={ (product !== null && ((bucketUrlPrefix + row) === tmpSelectedBucket)) ? classes.selectedImages : "" }
                                        onClick={setTmpSelectedBucket.bind(this, (bucketUrlPrefix + row))}>
                                        <img src={ bucketUrlPrefix + row } alt={bucketUrlPrefix + row} onError={(e) => { e.target.src="/img/default.png"}} />
                                        <GridListTileBar
                                            title={ getBucketName(row)}
                                        />
                                    </GridListTile>
                                ))
                            }
                        </GridList>
                    </DialogContent>
                    <DialogActions>
                        <Grid container spacing={0}>
                            <Grid item align="right" xs={12}>
                                <Button autoFocus onClick={doCloseProductBucketImageDialog} color="primary" variant="outlined" style={{marginRight: '8px'}}>
                                    취소
                                </Button>
                                <Button autoFocus onClick={doSaveProductBucketImageDialog} color="primary" variant="contained">
                                    확인
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>


                {
                    pos !== null &&
                        <Dialog onClose={doClosePosDialog} open={posDialog} className="store-container" fullWidth maxWidth="xs">
                            <DialogContent>
                                <Box mb={2}>
                                    <TextField className={ classes.width100 } label="기기 코드" variant="outlined" defaultValue={ pos.code }
                                        onBlur={ changePosValue("code") }/>
                                </Box>
                                <Box mb={2}>
                                    <FormControl variant="outlined" className={classes.width100}>
                                        <InputLabel
                                            id="pos-type">기기 타입</InputLabel>
                                        <Select
                                            labelId="pos-type"
                                            defaultValue={ pos.type }
                                            onBlur={ changePosValue("type") }
                                            labelWidth={75}
                                        >
                                            <MenuItem value="">선택해주세요</MenuItem>
                                            <MenuItem value="POS">POS</MenuItem>
                                            <MenuItem value="KIOSK">KIOSK</MenuItem>
                                            <MenuItem value="DID">DID</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box mb={2}>
                                    <TextField className={ classes.width100 } label="기기 별칭" variant="outlined" defaultValue={ pos.name }
                                        onBlur={ changePosValue("name") }/>
                                </Box>
                                <Box mb={2}>
                                    <TextField className={ classes.width100 } label="기기 모델명" variant="outlined" defaultValue={ pos.model }
                                        onBlur={ changePosValue("model") }/>
                                </Box>
                                <Box mb={2}>
                                    <TextField className={ classes.width100 } label="기기 UUID (시리얼)" variant="outlined" defaultValue={ pos.uuid }
                                        onBlur={ changePosValue("uuid") }/>
                                </Box>
                                <Box mb={2}>
                                    <FormControl variant="outlined" className={classes.width100}>
                                        <InputLabel
                                            id="pos-mandatory">사용여부</InputLabel>
                                        <Select
                                            labelId="pos-mandatory"
                                            defaultValue={ pos.mandatory }
                                            onBlur={ changePosValue("mandatory") }
                                            labelWidth={75}
                                        >
                                            <MenuItem value="true">사용</MenuItem>
                                            <MenuItem value="false">미사용</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Grid container spacing={0}>
                                    <Grid item align="right" xs={12}>
                                        <Button autoFocus onClick={doSavePosDialog} color="primary" variant="contained">
                                            저장
                                        </Button>
                                    </Grid>
                                </Grid>
                            </DialogActions>
                        </Dialog>
                }
                
                
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
                                                        { (row.products !== null && row.products !== undefined) ? row.products.name : row.productName }<br/>
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

                <Snackbar
                    open={success}
                    onClose={closeSnackbar}
                    autoHideDuration={3000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    message={<span id="message-id">{snackMessage}</span>}
                    TransitionComponent={TransitionLeft}
                    action={[
                        <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        onClick={closeSnackbar}
                        >
                        <CloseIcon />
                        </IconButton>
                    ]}
                />
            </Box>
    );
};

export default Store;