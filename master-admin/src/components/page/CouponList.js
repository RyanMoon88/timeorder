import React from 'react';
import { API_HOST } from '../../constants';
import { useGlobalState } from '../../state';
import { Box, Paper, Grid, Typography, Tabs, Tab, TextField, InputAdornment, Button, Switch } from '@material-ui/core';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';

import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';

import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

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

    relative: {
        position: 'relative'
    },

    hidden: {
        display: 'none'
    },

    chip: {
        marginTop: '6px',
        marginRight: '6px'
    },

    selectedImages: {
        border: "4px solid #e2422a"
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


// 깊은 복사
function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

const isNull = (value, base = '') => {
    if (value === null || value === undefined) {
        return base;
    }
    else {
        return value;
    }
}


/**
 *  테이블 양식
 */

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


/**
 *  다이얼로그 양식
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


/*
 * 쿠폰 생성 시작
 */

let nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
let chars = [
	"A", "B", "C", "D", "E", "F", "G", "H", "I",
	"J", "K", "L", "M", "N", "O", "P", "Q", "R",
	"S", "T", "U", "V", "W", "X", "Y", "Z", "0",
	"1", "2", "3", "4", "5", "6", "7", "8", "9"
];

function popNums() {
	return parseInt(Math.random() * nums.length);
}

function popChars() {
	return parseInt(Math.random() * chars.length);
}

function todayString(isFull) {    
	let today = new Date();
    let yyyy = today.getFullYear();
    let yy = today.getFullYear().toString().substr(2);
    let mm = (today.getMonth()+1) < 10 ? "0" + (today.getMonth()+1) : (today.getMonth()+1);
    let dd = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();

    if (isFull) {
        return yyyy + mm + dd;
    }
    else {
        return yy + mm + dd;
    }
}

function generateNumbers(prefix) {
    let prefixNumbers = prefix + todayString(false);

    let bef = nums[popNums()] + nums[popNums()] + chars[popChars()] + chars[popChars()];
    let aft = chars[popChars()] + chars[popChars()] + chars[popChars()];

    return prefixNumbers + "-" + bef + "-" + aft;
}

/*
 * 쿠폰 생성 끝
 */




function loadData() {
    // let q = 'query {' +
    //     ' users (orderBy: "createdAt_DESC") { totalCount users { id name type email phone sns createdAt } }' +
    //     ' couponGroups { totalCount couponGroups { id name canDuplicate } }' + 
    //     ' couponTypes { totalCount couponTypes { id name description companyType type couponDayType couponAmount couponMaxPrice couponMaxUseCount couponCanMinAmount couponGroup { id name canDuplicate } groups { id name } stores { id name } notStores { id name } products { id name } createdAt } }' +
    // '}'

    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadCouponListPageData",
            "method": "post",
        })
        .then(function (response) {    
            console.log(response);
            resolve(response);
        });
    });
};


function loadCouponsData(typeId) {
    let q = 'query {' +
        ' coupons(where:"{ \\"couponType\\": { \\"id\\":\\"' + typeId + '\\" } }") { totalCount coupons { id couponNumber state useDate startDate endDate user { id name } useCount createdAt } }' +
    '}'

    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadCouponList",
            "method": "post",
            "params": {
                couponTypeId:typeId
            }
        })
        .then(function (response) {    
            console.log(response);
            resolve(response);
        });
    });
};


function hasDelete(arr) {
    let result = true;

    for (let i=0; i< arr.length; i++) {
        if (arr[i].delete === undefined || !arr[i].delete) {
            result = false;
            break;
        }
    }

    return result;
}

function sleep(delay = 0) {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
}

const CouponList = () => {
    const [login, setLogin] = useGlobalState('login');
    const [backdrop, setBackdrop] = useGlobalState('backdrop');

    const classes = useStyles();
    const [success, setSuccess] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackDuration, setSnackDuration] = React.useState(2000);

    const [filterCouponGroup, setFilterCouponGroup] = React.useState("ALL");

    const [openCouponGroupDialog, setOpenCouponGroupDialog] = React.useState(false);
    const [openCouponTypeDialog, setOpenCouponTypeDialog] = React.useState(false);
    const [openDeleteCouponTypeDialog, setOpenDeleteCouponTypeDialog] = React.useState(false);
    const [openAddCouponDialog, setOpenAddCouponDialog] = React.useState(false);
    const [openSetUserToCouponDialog, setOpenSetUserToCouponDialog] = React.useState(false);
    const [openRemoveUserToCouponDialog, setOpenRemoveUserToCouponDialog] = React.useState(false);

    const [search, setSearch] = React.useState("");
    const [openSetUserAutoComplete, setOpenSetUserAutoComplete] = React.useState(false);
    
    const [originCouponGroups, setOriginCouponGroups] = React.useState([]);
    const [couponGroups, setCouponGroups] = React.useState([]);

    const [originCouponGroup, setOriginCouponGroup] = React.useState([]);
    const [couponGroup, setCouponGroup] = React.useState([]);

    const [originCouponTypes, setOriginCouponTypes] = React.useState([]);
    const [couponTypes, setCouponTypes] = React.useState([]);

    const [originCouponType, setOriginCouponType] = React.useState(null);
    const [couponType, setCouponType] = React.useState(null);
    const [selectedCouponTypeIndex, setSelectedCouponTypeIndex] = React.useState(0);
    const [deleteCouponTypeIndex, setDeleteCouponTypeIndex] = React.useState(0);

    const [originCoupons, setOriginCoupons] = React.useState([]);
    const [coupons, setCoupons] = React.useState([]);

    const [originCoupon, setOriginCoupon] = React.useState(null);
    const [coupon, setCoupon] = React.useState(null);
    
    const [addCouponCode, setAddCouponCode] = React.useState("");
    const [addCouponCount, setAddCouponCount] = React.useState("");
    const [addCouponStartDate, setAddCouponStartDate] = React.useState(moment().format("YYYYMMDD"));
    const [addCouponEndDate, setAddCouponEndDate] = React.useState("20991231");


    const [originUsers, setOriginUsers] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    const [selectedUser, setSelectedUser] = React.useState(null);
    const loading = openSetUserAutoComplete && users.length === 0;

    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        setBackdrop(true);
        loadData()
        .then((response) => {
            setData(response);
            setBackdrop(false);
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    
    React.useEffect(() => {
        let active = true;

        if (search.length > 0) {
            let users = cloneObject(originUsers);
            users = users.filter((item) => {
                let name = item.name === null ? "" : item.name;
                return name.indexOf(search) > -1;
            });
            setUsers(users);
        }
        else {
            setUsers([]);
        }

        return () => {
            active = false;
        };
    }, [search]);
    
    function setData(response) {
        console.log("couponType response", response);
        let data = response.data;
        let couponGroups = data.couponGroups;
        let couponTypes = data.couponTypes;
        let users = data.users;

        setOriginUsers(users);

        setOriginCouponGroups(couponGroups);
        setCouponGroups(couponGroups);

        setOriginCouponTypes(couponTypes);
        setCouponTypes(couponTypes);
        
        if (couponTypes.length > 0) {
            setBackdrop(true);
            loadCouponsData(couponTypes[0].id)
            .then((response) => {
                let coupons = response.data;
                    
                setOriginCoupons(coupons);
                setCoupons(coupons);
                setBackdrop(false);
            });
        }
    }

    function doSelectCouponTypeIndex(index) {
        setSelectedCouponTypeIndex(index);        
        setBackdrop(true);
        loadCouponsData(couponTypes[index].id)
        .then((response) => {
            let coupons = response.data;
                
            setOriginCoupons(coupons);
            setCoupons(coupons);
            setBackdrop(false);            
        });
    }


    const openSnackbar = () => {
        setSuccess(true);
    }    
    const closeSnackbar = () => {
        setSuccess(false);
    }


    const setCouponGroupName = (id) => {
        if (id !== "") {
            let group = couponGroups.filter((row) => {
                if (row.id === id) {
                    return row;                    
                }
            });
    
            if (group !== null && group.length>0) {
                return group[0].name;
            }
            else {
                return "-";
            }
        }
        else {
            return "-";
        }
    }


    const doAddCouponGroup = () => {
        let newObj = {
            "id": "-1",
            "name": ""
        }
        couponGroups.push(newObj);
        
        setSnackMessage("쿠폰 그룹이 임시저장됨");
        openSnackbar();
    }

    // 속성 저장 시작
    const changeCouponGroupsValue = (index, prop) => (event) => {
        let cloneGroups = cloneObject(couponGroups);

        if (prop === "canDuplicate") {
            cloneGroups = cloneGroups.map((item, i) => {
                if (i === index) {
                    item[prop] = !item[prop];
                }
                return item;
            });
        }
        else {
            cloneGroups = cloneGroups.map((item, i) => {
                if (i === index) {
                    item[prop] = event.target.value;
                }
                return item;
            });
        }

        console.log(cloneGroups);
    
        setCouponGroups(cloneGroups);
    }
    const changeCouponGroupValue = (prop) => (event) => {
        setCouponGroup({ ...couponGroup, [prop]: event.target.value });
    };

    const changeCouponGroupInCouponType = () => (event) => {
        console.log(event.target.value);
        if (couponType.couponGroup === null) {
            couponType.couponGroup = event.target.value 
        }
        else {
            couponType.couponGroup = event.target.value;
        }
    };

    const changeCouponTypeValue = (prop) => (event) => {
        setCouponType({ ...couponType, [prop]: event.target.value });
    };

    const changeCouponValue = (prop) => (event) => {
        setCoupon({ ...coupon, [prop]: event.target.value });
    };


    const changeAddCouponCodeValue = (prop) => (event) => {
        setAddCouponCode(event.target.value);
    };

    const changeAddCouponCountValue = (prop) => (event) => {
        setAddCouponCount(event.target.value);
    };

    const changeAddCouponStartDateValue = (prop) => (event) => {
        setAddCouponStartDate(event.target.value);
    };

    const changeAddCouponEndDateValue = (prop) => (event) => {
        setAddCouponEndDate(event.target.value);
    };


    const doFilterCouponGroup = () => (event) => {
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        setFilterCouponGroup(event.target.value);
        let cloneCouponTypes = cloneObject(originCouponTypes);

        if (event.target.value !== "ALL") {
            cloneCouponTypes = cloneCouponTypes.filter((item) => {
                if (item.couponGroup !== null && item.couponGroup !== undefined) {
                    return (item.couponGroup === event.target.value)
                }
            });
        }

        setCouponTypes(cloneCouponTypes);
    }
    // 속성 저장 끝

    // 쿠폰 그룹 다이얼로그 시작
    const doOpenCouponGroupDialog = () => {
        setOpenCouponGroupDialog(true);
    }

    const doCloseCouponGroupDialog = () => {
        setCouponGroups(originCouponGroups);
        setOpenCouponGroupDialog(false);
    }

    const doSaveCouponGroupDialog = () => {
        let isBreak = true;
        let q = 'mutation {';

        let couponGroupParam = [];
        let deleteCouponGroupParam = [];
        for (let i=0; i<couponGroups.length; i++) {
            try {
                let tmp = parseInt(couponGroups[i].id);
                if (tmp <= 0) {
                    if (couponGroups[i].delete === undefined || !couponGroups[i].delete) {
                        // q += ' i' + i + ':insertCouponGroup (name: "' + couponGroups[i].name + '" ) { id name canDuplicate }';
                        // isBreak = false;
                        couponGroupParam.push({
                            id:"",
                            name:couponGroups[i].name,
                            canDuplicate:couponGroups[i].canDuplicate,
                        });
                        isBreak = false;
                    }
                }
                else {
                    if (couponGroups[i].delete !== undefined && couponGroups[i].delete) {
                        // q += ' d' + i + ':deleteCouponGroup (id: "' + couponGroups[i].id + '" ) { id }';
                        // isBreak = false;
                        deleteCouponGroupParam.push({
                            id:couponGroups[i].id,
                            name:couponGroups[i].name,
                            canDuplicate:couponGroups[i].canDuplicate,
                        });
                        isBreak = false;
                    }
                    else {
                        // q += ' u' + i + ':updateCouponGroup (id: "' + couponGroups[i].id + '" name: "' + couponGroups[i].name + '" canDuplicate: ' + couponGroups[i].canDuplicate + ' ) { id }';
                        // isBreak = false;
                        couponGroupParam.push({
                            id:couponGroups[i].id,
                            name:couponGroups[i].name,
                            canDuplicate:couponGroups[i].canDuplicate,
                        });
                        isBreak = false;
                    }
                }
            }
            catch (e) {
                if (couponGroups[i].delete !== undefined && couponGroups[i].delete) {
                    // q += ' d' + i + ':deleteCouponGroup (id: "' + couponGroups[i].id + '" ) { id }';
                    // isBreak = false;
                    deleteCouponGroupParam.push({
                        id:couponGroups[i].id,
                        name:couponGroups[i].name,
                        canDuplicate:couponGroups[i].canDuplicate,
                    });
                    isBreak = false;
                }
                else {
                    // q += ' u' + i + ':updateCouponGroup (id: "' + couponGroups[i].id + '" name: "' + couponGroups[i].name + '" canDuplicate: ' + couponGroups[i].canDuplicate + ' ) { id }';
                    // isBreak = false;
                    couponGroupParam.push({
                        id:couponGroups[i].id,
                        name:couponGroups[i].name,
                        canDuplicate:couponGroups[i].canDuplicate,
                    });
                    isBreak = false;
                }
            }
        }

        // q += '}';

        if (isBreak) {
            setOpenCouponGroupDialog(false);
            return;
        }
        
        new Promise((resolve, reject) => {
            axios({
                "url": API_HOST+"/master/updateCouponGroupList",
                "method": "post",
                "data": couponGroupParam
            })
            .then(function (response) {
                axios({
                    "url":API_HOST + "/master/deleteCouponGroupList",
                    "method":"post",
                    "data":deleteCouponGroupParam
                }).then(function (response2){
                    axios({
                        "url":API_HOST + "/master/loadCouponGroupList",
                        "method":"post"
                    }).then(function(response3){
                        resolve(response3);
                    })
                })
                // console.log(response);
                // resolve(response);
            });
        })
        .then((response) => {

            let result = response.data;
            console.log("222222222222");
            console.log(result);
            for (let key in result) {
                if (key.includes("i")) {
                    let idx = parseInt(key.replace("i", ""));
                    couponGroups[idx] = result[key];
                }
                if (key.includes("d")) {
                    let idx = parseInt(key.replace("d", ""));
                    couponGroups.splice(idx, 1);
                }
            }
            

            for (let i=0; i<result.length; i++) {
                if (result[i].id.includes("-1")) {
                    couponGroups.splice(i, 1);
                }
            }

            setOriginCouponGroups(couponGroups);
            setCouponGroups(couponGroups);
            setOpenCouponGroupDialog(false);
        
            setSnackMessage("쿠폰 그룹이 저장됨");
            openSnackbar();
        });
    }
    
    const deleteCouponGroup = (groupIndex) => {
        for (let i=0; i<couponGroups.length; i++) {
            if(i === groupIndex) {
                couponGroups[i].delete = true;
                break;
            }
        }
        setSnackMessage("옵션 아이템이 임시삭제됨");
        openSnackbar();
        console.log(couponGroups);
    }
    // 쿠폰 그룹 다이얼로그 끝

    // 쿠폰 종류 다이얼로그 시작
    const doNewAddDialog = () => {
        let selected = { id: -1, name:"", description:"", companyType:"", type:"", couponDayType:"", couponAmount: null, couponMaxPrice: null, couponMaxUseCount: null, couponCanMinAmount: null, couponGroup: null }
        setCouponType(selected);
        setOpenCouponTypeDialog(true);
    }

    const doOpenCouponTypeDialog = (index, name) => {
        let selected = cloneObject(couponTypes[index]);
        setCouponType(selected);
        setOpenCouponTypeDialog(true);
    }

    const doCloseCouponTypeDialog = () => {
        setOpenCouponTypeDialog(false);
    }

    const doSaveCouponTypeDialog = () => {
        let isNew = false;
        
        let couponGroupId = "";
        if(couponType.couponExpireDate === null){
            setSnackMessage("쿠폰 유효기간을 입력해주세요.");
            openSnackbar();
            return;
        }
        if (couponType.couponGroup !== null && couponType.couponGroup !== undefined) {
            couponGroupId = couponType.couponGroup
        }

        // let q = 'mutation {';

        let couponTypeParam = {};
        try {
            let tmp = parseInt(couponType);
            console.log(tmp);

            if (tmp <= 0) {
                isNew = true;
                // q += ' result:insertCouponType (name: "' + couponType.name + '", couponGroupId: "' + couponGroupId + '", companyType: "' + couponType.companyType + '", type: "' + couponType.type + '", couponDayType: "' + couponType.couponDayType + '", couponAmount: ' + couponType.couponAmount + ', couponMaxPrice: ' + couponType.couponMaxPrice + ', couponMaxUseCount: ' + couponType.couponMaxUseCount + ', couponCanMinAmount: ' + couponType.couponCanMinAmount + ', description: """' + couponType.description.replace(/\"/g, "\\\"") + '""" ) { id }';
                couponTypeParam = {
                    id:"",
                    name:couponType.name,
                    couponGroup:couponGroupId,
                    companyType:couponType.companyType,
                    type:couponType.type,
                    couponDayType:couponType.couponDayType,
                    couponAmount:couponType.couponAmount,
                    couponMaxPrice:couponType.couponMaxPrice,
                    couponMaxUseCount:couponType.couponMaxUseCount,
                    couponCanMinAmount:couponType.couponCanMinAmount,
                    description:couponType.description.replace(/\"/g, "\\\""),
                }
            }
            else {
                // q += ' result:updateCouponType (id: "' + couponType.id + '" name: "' + couponType.name + '", couponGroupId: "' + couponGroupId + '", companyType: "' + couponType.companyType + '", type: "' + couponType.type + '", couponDayType: "' + couponType.couponDayType + '", couponAmount: ' + couponType.couponAmount + ', couponMaxPrice: ' + couponType.couponMaxPrice + ', couponMaxUseCount: ' + couponType.couponMaxUseCount + ', couponCanMinAmount: ' + couponType.couponCanMinAmount + ', description: """' + couponType.description.replace(/\"/g, "\\\"") + '""" ) { id }';
                couponTypeParam = {
                    id:couponType.id,
                    name:couponType.name,
                    couponGroup:couponGroupId,
                    companyType:couponType.companyType,
                    type:couponType.type,
                    couponDayType:couponType.couponDayType,
                    couponAmount:couponType.couponAmount,
                    couponMaxPrice:couponType.couponMaxPrice,
                    couponMaxUseCount:couponType.couponMaxUseCount,
                    couponCanMinAmount:couponType.couponCanMinAmount,
                    description:couponType.description.replace(/\"/g, "\\\""),
                }
            }
        }
        catch (e) {
            // q += ' result:updateCouponType (id: "' + couponType.id + '" name: "' + couponType.name + '", couponGroupId: "' + couponGroupId + '", companyType: "' + couponType.companyType + '", type: "' + couponType.type + '", couponDayType: "' + couponType.couponDayType + '", couponAmount: ' + couponType.couponAmount + ', couponMaxPrice: ' + couponType.couponMaxPrice + ', couponMaxUseCount: ' + couponType.couponMaxUseCount + ', couponCanMinAmount: ' + couponType.couponCanMinAmount + ', description: """' + couponType.description.replace(/\"/g, "\\\"") + '""" ) { id }';
            couponTypeParam = {
                id:couponType.id,
                name:couponType.name,
                couponGroup:couponGroupId,
                companyType:couponType.companyType,
                type:couponType.type,
                couponDayType:couponType.couponDayType,
                couponAmount:couponType.couponAmount,
                couponMaxPrice:couponType.couponMaxPrice,
                couponMaxUseCount:couponType.couponMaxUseCount,
                couponCanMinAmount:couponType.couponCanMinAmount,
                description:couponType.description.replace(/\"/g, "\\\""),
            }
        }

        // q += '}';
        
        new Promise((resolve, reject) => {
            axios({
                "url": API_HOST + "/master/updateCouponType",
                "method": "post",
                "data": couponTypeParam
            })
            .then(function (response) {
                resolve(response);
            });
        })
        .then((response) => {
            let result = response.data;

            let types = cloneObject(originCouponTypes);
            if (isNew) {
                couponType.id = result.id;
                types.push(couponType);
            }
            else {
                types = types.map((item) => {
                    if (item.id === result.id) {
                        item = couponType
                    }
                    return item;
                })
            }

            setOriginCouponTypes(types);
            setCouponTypes(types);
            setOpenCouponTypeDialog(false);

            setSnackMessage("쿠폰 종류가 저장됨");
            openSnackbar();
        });
        
        setOpenCouponTypeDialog(false);
    }
    // 쿠폰 종류 다이얼로그 끝

    // 쿠폰 종류 삭제 다이얼로그 시작
    const doDeleteCouponType = () => {
        let id = couponTypes[deleteCouponTypeIndex].id;
        loadCouponsData(id)
        .then((response) => {
            let totalCount = response.data.length;
            if (totalCount > 0) {
                alert("쿠폰이 존재하여 삭제가 불가능합니다!");
                setOpenDeleteCouponTypeDialog(false);
            }
            else {                
                // let q = 'mutation {';
                // q += ' result:deleteCouponType (id: "' + id + '" ) { id }';
                // q += '}';
                
                new Promise((resolve, reject) => {
                    axios({
                        "url": API_HOST + "/master/deleteCouponType",
                        "method": "post",
                        "params":{
                            couponTypeId:id,
                        }
                    })
                    .then(function (response) {
                        resolve(response);
                    });
                })
                .then((response) => {
                    let result = response.data;

                    let types = cloneObject(originCouponTypes);
                    types = types.filter((item) => {
                        if (item.id !== result.id) {
                            return item;
                        }
                    });

                    setOriginCouponTypes(types);
                    setCouponTypes(types);
                    setOpenDeleteCouponTypeDialog(false);

                    setSnackMessage("쿠폰 종류가 삭제됨");
                    openSnackbar();
                });
                
            }
        });
    }

    const doOpenDeleteCouponTypeDialog = (index) => {
        setDeleteCouponTypeIndex(index);
        setOpenDeleteCouponTypeDialog(true);
    }

    const doCloseDeleteCouponTypeDialog = () => {
        setOpenDeleteCouponTypeDialog(false);
    }
    // 쿠폰 종류 삭제 다이얼로그 끝


    // 쿠폰 추가 다이얼로그 시작
    const doOpenAddCouponDialog = () => {
        setOpenAddCouponDialog(true);
    }
    const doCloseAddCouponDialog = () => {
        setOpenAddCouponDialog(false);
        setAddCouponStartDate(moment().format("YYYYMMDD"));
        setAddCouponEndDate("20991231");
        setAddCouponCount(0);
    }

    const doAddCoupon = () => {
        console.log(addCouponCode, addCouponCount, addCouponStartDate, addCouponEndDate);
        try {
            let count = parseInt(addCouponCount);

            if (isNaN(count)) {
                alert("'발매수'에 숫자를 입력해주세요");
                return;
            }

            if (count <= 0 ) {
                alert("'발매수'는 1 이상의 숫자를 입력해주세요");
                return;
            }
            
            let coupons = [];
            for (let i=0; i<count; i++) {
                let coupon = generateNumbers(addCouponCode);
                if (!coupons.includes(coupon)) {
                    coupons.push(coupon);
                }
            }

            let typeId = couponTypes[selectedCouponTypeIndex].id;
            let today = todayString(true);
            let couponParam = [];

            // let q = 'mutation {';
            for (let i=0; i<coupons.length; i++) {                
                // q += ' i' + i + ':insertCoupon (couponNumber: "' + coupons[i] + '", state: "1", useCount: 0, couponTypeId: "' + typeId + '", startDate: "' + addCouponStartDate + '", endDate: "' + addCouponEndDate + '" ) { id }';
                couponParam.push({
                    id:"",
                    couponNumber:coupons[i],
                    state:"1",
                    useCount:0,
                    couponTypeId:typeId,
                    startDate:addCouponStartDate,
                    endDate:addCouponEndDate,
                })
            }
            // q += '}';
            
            new Promise((resolve, reject) => {
                axios({
                    "url": API_HOST + "/master/updateCoupon",
                    "method": "post",
                    "data":couponParam
                })
                .then(function (response) {
                    resolve(response);
                });
            })
            .then((response) => {
                console.log("insertCoupon", response);
                loadCouponsData(typeId)
                .then((response) => {
                    let coupons = response.data;
                    
                    setOriginCoupons(coupons);
                    setCoupons(coupons);
                    setBackdrop(false);
                    doCloseAddCouponDialog();
                })
                // window.location.reload();
            });
        }
        catch (e) {
            alert("'발매수'에 숫자를 입력해주세요");
        }
    }
    // 쿠폰 추가 다이얼로그 끝

    
    // 쿠폰 지정 다이얼로그 시작
    const doOpenSetUserToCouponDialog = (id) => {
        let coupon = coupons.filter((item) => {
            return item.id === id;
        })

        if (coupon)

        setCoupon(coupon[0]);
        setOpenSetUserToCouponDialog(true);
    }
    const doCloseSetUserToCouponDialog = () => {
        setOpenSetUserToCouponDialog(false);
    }
    const doSetUserToCoupon = () => {
        if (selectedUser === null) {
            return false;
        }
        else {
            // let q = 'mutation {' +
            //     ' updateCoupon (id:"' + coupon.id + '", userId: "' + selectedUser.id + '") { id }' +
            // '}'
        
            axios({
                "url": API_HOST + "/master/connectCouponToUser",
                "method": "post",
                "params":{
                    couponId:coupon.id,
                    userId:selectedUser.id,
                } 
            })
            .then(function (response) {
                let newCoupons = coupons.map((item) => {
                    if (item.id === coupon.id) {
                        item.user = selectedUser;
                    }
                    return item;
                })
                setSelectedUser(null);
                setCoupon(null);
                setCoupons(newCoupons);
                setUsers([]);
                setOpenSetUserToCouponDialog(false);
            });
        }
    }

    const filterUser = (event) => {
        setSearch(event.target.value);
    }
    // 쿠폰 지정 다이얼로그 끝

    
    // 쿠폰 지정 다이얼로그 시작
    const doOpenRemoveUserToCouponDialog = (id) => {
        let coupon = coupons.filter((item) => {
            return item.id === id;
        })

        if (coupon)

        setCoupon(coupon[0]);
        setOpenRemoveUserToCouponDialog(true);
    }
    const doCloseRemoveUserToCouponDialog = () => {
        setOpenRemoveUserToCouponDialog(false);
    }
    const doRemoveUserToCoupon = () => {
        let q = 'mutation {' +
            ' updateCoupon (id:"' + coupon.id + '", userId: "disconnect") { id }' +
        '}'
    
        axios({
            "url": API_HOST + "/master/connectCouponToUser",
            "method": "post",
            "params":{
                couponId:coupon.id,
                userId:"disconnect",
            } 
        })
        .then(function (response) {
            let newCoupons = coupons.map((item) => {
                if (item.id === coupon.id) {
                    item.user = null;
                }
                return item;
            })
            setSelectedUser(null);
            setCoupon(null);
            setCoupons(newCoupons);
            setUsers([]);
            setOpenRemoveUserToCouponDialog(false);
        });
    }
    // 쿠폰 지정 다이얼로그 끝

    const preventParent = (event) => {
        event.stopPropagation();
    }

    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap className={classes.divRow}>
                    쿠폰 리스트
                </Typography>

                <div className={classes.divRow}>
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            {/* 쿠폰 종류 */}
                            <Paper>
                                <Grid container className={classes.paper}>
                                    <Grid item style={{flexGrow:1}}>
                                        <Typography variant="body1" noWrap className={classes.divRow}>
                                            쿠폰 종류
                                        </Typography>
                                    </Grid>
                                    <Grid item style={{ width:"150px", marginRight:"10px" }}>
                                        <FormControl variant="outlined" className={classes.width100}>
                                            <InputLabel
                                                id="coupon-type-list-group">쿠폰 그룹</InputLabel>
                                            <Select
                                                id="coupon-type-list-small"
                                                labelId="coupon-type-list-group"
                                                defaultValue = {filterCouponGroup}
                                                onChange={doFilterCouponGroup()}
                                                labelWidth={65}
                                            >
                                                <MenuItem value="ALL">전체</MenuItem>
                                                {
                                                    couponGroups.map((row, i) => (
                                                        <MenuItem key={i} value={ row.id }>{ row.name }</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item style={{ textAlign:'right', marginRight:"10px" }}>
                                        <Button variant="contained" color="primary" onClick={ doOpenCouponGroupDialog }>
                                            그룹 관리
                                        </Button>
                                    </Grid>
                                    <Grid item style={{ textAlign:'right' }}>
                                        <Button variant="contained" color="primary" onClick={ doNewAddDialog.bind(this) }>
                                            <AddIcon/>
                                        </Button>
                                    </Grid>
                                </Grid>
                                
                                <Table aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">이름</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'200px' }}>그룹</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'80px' }}>옵션</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            couponTypes.map((row, i) => (
                                                <StyledTableRow key={ i }>
                                                    <StyledTableCell className={selectedCouponTypeIndex === i ? classes.cellSelected : ""} onClick={doSelectCouponTypeIndex.bind(this, i)}>{ row.name }</StyledTableCell>
                                                    <StyledTableCell align="center" className={selectedCouponTypeIndex === i ? classes.cellSelected : ""}>{ (row.couponGroup !== null && row.couponGroup !== undefined) ? setCouponGroupName(row.couponGroup) : "-" }</StyledTableCell>
                                                    <StyledTableCell align="right" className={selectedCouponTypeIndex === i ? classes.cellSelected : ""}>
                                                        <CreateIcon onClick={ doOpenCouponTypeDialog.bind(this, i) }/>
                                                        <DeleteIcon onClick={ doOpenDeleteCouponTypeDialog.bind(this, i) }/>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Grid>
                        <Grid item xs={7}>
                            {/* 선택된 쿠폰 종류의 쿠폰 리스트 */}
                            <Paper>
                                <Grid container className={classes.paper}>
                                    <Grid item style={{flexGrow:1}}>
                                        <Typography variant="body1" noWrap>
                                            쿠폰 리스트
                                        </Typography>
                                    </Grid>
                                    <Grid item style={{ textAlign:'right' }}>
                                        <Button variant="contained" color="primary" onClick={ doOpenAddCouponDialog.bind(this) }>
                                            <AddIcon/>
                                        </Button>
                                    </Grid>
                                </Grid>                                
                                <div>
                                    <Table aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center">쿠폰번호</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'150px' }}>사용자(소유자)</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'100px' }}>사용일</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'100px' }}>시작일</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'100px' }}>종료일</StyledTableCell>
                                                <StyledTableCell align="center" style={{ width:'60px' }}>옵션</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                coupons.map((row, i) => (
                                                    <StyledTableRow key={ i }>
                                                        <StyledTableCell>{ row.couponNumber }</StyledTableCell>
                                                        <StyledTableCell align="center">{ 
                                                            row.user !== null ? <Link to={ "/User/" + row.user.id }>{ row.user.name }</Link> : "-" }
                                                        </StyledTableCell>
                                                        <StyledTableCell align="center">{
                                                            (row.useDate !== "" && row.useDate !== null) ? (
                                                                row.useDate.length === 8 ? moment(row.useDate, "YYYYMMDD").format("YYYY-MM-DD") : (
                                                                    row.useDate.length === 12 ? moment(row.useDate, "YYMMDDHHmmss").format("YYYY-MM-DD") : moment(row.useDate, "YYYYMMDDHHmmss").format("YYYY-MM-DD"))
                                                                ) : "미사용" }</StyledTableCell>
                                                        <StyledTableCell align="center">{ moment(row.startDate, "YYYYMMDD").format("YYYY-MM-DD") }</StyledTableCell>
                                                        <StyledTableCell align="center">{ moment(row.endDate, "YYYYMMDD").format("YYYY-MM-DD") }</StyledTableCell>
                                                        <StyledTableCell align="center">
                                                            {
                                                                (row.useDate !== "" && row.useDate !== null) && 
                                                                    "-"
                                                            }
                                                            {
                                                                (row.user === null && !(row.useDate !== "" && row.useDate !== null)) && 
                                                                    <LinkIcon onClick={ doOpenSetUserToCouponDialog.bind(this, row.id) }/>
                                                            }
                                                            {
                                                                (row.user !== null && !(row.useDate !== "" && row.useDate !== null)) && 
                                                                    <LinkOffIcon onClick={ doOpenRemoveUserToCouponDialog.bind(this, row.id) }/>
                                                            }
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
                <Dialog onClose={doCloseCouponGroupDialog} open={openCouponGroupDialog} fullWidth maxWidth="sm">
                    <DialogContent>
                        {
                            (couponGroups.length === 0 || hasDelete(couponGroups)) &&
                                <div>쿠폰 그룹이 없습니다.</div>
                        }
                        {
                            couponGroups.map((row, i) => (
                                row.delete === undefined && (
                                    <Grid key={i} container spacing={0} alignItems="center" className={classes.divRow}>
                                        <Grid item style={{ flexGrow: 1 }}>
                                            <TextField className={ classes.width100 } label="쿠폰 그룹 이름" variant="outlined" defaultValue={ row.name }
                                                onBlur={ changeCouponGroupsValue(i, "name") }/>
                                        </Grid>
                                        <Grid item align="center" style={{ paddingLeft:"10px" }}>
                                            중복등록 허용<br/>
                                            <IOSSwitch className={ classes.iosSwitch } checked={row.canDuplicate}
                                                onClick={preventParent}
                                                onChange={changeCouponGroupsValue(i, 'canDuplicate')}/>
                                        </Grid>
                                        <Grid item align="center" style={{ paddingLeft:"10px" }}>
                                            <DeleteIcon onClick= { deleteCouponGroup.bind(this, i) } />
                                        </Grid>
                                    </Grid>
                                )
                            ))
                        }
                    </DialogContent>
                    <DialogActions>
                        <Grid container spacing={0}>
                            <Grid item align="right" xs={12}>
                                <Button autoFocus onClick={doAddCouponGroup} color="primary" variant="contained" style={{ marginRight: "10px" }}>
                                    추가
                                </Button>
                                <Button autoFocus onClick={doSaveCouponGroupDialog} color="primary" variant="contained">
                                    확인
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
                {
                    couponType !== null &&
                        <Dialog onClose={doCloseCouponTypeDialog} open={openCouponTypeDialog} fullWidth maxWidth="sm">
                            <DialogContent>
                                <Grid container spacing={1} className= {classes.divRow }>
                                    <Grid item xs={8}>
                                        <TextField className={ classes.width100 } label="쿠폰 종류 이름" variant="outlined" defaultValue={ couponType.name }
                                            onBlur={ changeCouponTypeValue("name") }/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl variant="outlined" className={classes.width100}>
                                            <InputLabel
                                                id="coupon-type-group">쿠폰 그룹</InputLabel>
                                            <Select
                                                labelId="coupon-type-group"
                                                defaultValue={couponType.couponGroup !== null ? couponType.couponGroup : ""}
                                                onBlur={changeCouponGroupInCouponType()}
                                                labelWidth={75}
                                            >
                                                <MenuItem value="">없음</MenuItem>
                                                {
                                                    couponGroups.map((row, i) => (
                                                        <MenuItem key={i} value={ row.id }>{ row.name }</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} className= {classes.divRow }>
                                    <Grid item xs={4}>
                                        <FormControl variant="outlined" className={classes.width100}>
                                            <InputLabel
                                                id="coupon-type-group">쿠폰 발급처</InputLabel>
                                            <Select
                                                labelId="coupon-type-group"
                                                defaultValue={isNull(couponType.companyType)}
                                                onBlur={changeCouponTypeValue('companyType')}
                                                labelWidth={75}
                                            >
                                                <MenuItem value="TIMEORDER">타임오더</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl variant="outlined" className={classes.width100}>
                                            <InputLabel
                                                id="coupon-type-group">쿠폰 타입</InputLabel>
                                            <Select
                                                labelId="coupon-type-group"
                                                defaultValue={isNull(couponType.type)}
                                                onBlur={changeCouponTypeValue('type')}
                                                labelWidth={75}
                                            >
                                                <MenuItem value="00">TCASH 충전</MenuItem>
                                                <MenuItem value="01">특정 금액 할인</MenuItem>
                                                <MenuItem value="02">특정 할인율 할인</MenuItem>
                                                {/* <MenuItem value="03">특정 상품 무료</MenuItem> */}
                                                <MenuItem value="04">충전카드식</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl variant="outlined" className={classes.width100}>
                                            <InputLabel
                                                id="coupon-type-group">쿠폰 사용일</InputLabel>
                                            <Select
                                                labelId="coupon-type-group"
                                                defaultValue={isNull(couponType.couponDayType)}
                                                onBlur={changeCouponTypeValue('couponDayType')}
                                                labelWidth={75}
                                            >
                                                <MenuItem value="00">전체</MenuItem>
                                                <MenuItem value="01">주중</MenuItem>
                                                <MenuItem value="02">주말</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} className= {classes.divRow }>
                                    <Grid item xs={8}>
                                        <TextField className={ classes.width100 } label="쿠폰 사용량" variant="outlined" defaultValue={ couponType.couponAmount }
                                            onBlur={ changeCouponTypeValue("couponAmount") }
                                            helperText="타입에 따라 표현 다름. TCASH 충전: TCASH 충전량, 특정 금액 할인: 할인 금액, 특정할인율 할인: 할인율, 특정 상품 무료, 충전카드식: 사용 안함"/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField className={ classes.width100 } label="쿠폰 유효기간 (일수)" variant="outlined" defaultValue={ couponType.couponExpireDate }
                                            onBlur={ changeCouponTypeValue("couponExpireDate") }/>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} className= {classes.divRow }>
                                    <Grid item xs={4}>
                                        <TextField className={ classes.width100 } label="쿠폰 최소 사용 금액" variant="outlined" defaultValue={ couponType.couponCanMinAmount }
                                            onBlur={ changeCouponTypeValue("couponCanMinAmount") }/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField className={ classes.width100 } label="쿠폰 할인 최대 금액" variant="outlined" defaultValue={ couponType.couponMaxPrice }
                                            onBlur={ changeCouponTypeValue("couponMaxPrice") }
                                            helperText="-1 이면 최대치 없음"/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField className={ classes.width100 } label="쿠폰 사용 최대 횟수/금액" variant="outlined" defaultValue={ couponType.couponMaxUseCount }
                                            onBlur={ changeCouponTypeValue("couponMaxUseCount") }
                                            helperText="충전카드식 전용"/>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} className= {classes.divRow }>
                                    <Grid item xs={12}>
                                        <TextField className={ classes.width100 } multiline rows="4" label="설명" variant="outlined" defaultValue={ couponType.description }
                                            onBlur={ changeCouponTypeValue("description") }/>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Grid container spacing={0}>
                                    <Grid item align="right" xs={12}>
                                        <Button autoFocus onClick={doSaveCouponTypeDialog} color="primary" variant="contained">
                                            확인
                                        </Button>
                                    </Grid>
                                </Grid>
                            </DialogActions>
                        </Dialog>
                }
                <Dialog onClose={doCloseDeleteCouponTypeDialog} open={openDeleteCouponTypeDialog} fullWidth maxWidth="sm">
                    <DialogContent>
                        <div>정말 삭제 하시겠습니까?</div>
                    </DialogContent>
                    <DialogActions>
                        <Grid container spacing={0}>
                            <Grid item align="right" xs={12}>
                                <Button autoFocus color="primary" variant="contained" style={{ marginRight: "10px" }} onClick={ doCloseDeleteCouponTypeDialog }>
                                    취소
                                </Button>
                                <Button autoFocus color="primary" variant="contained" onClick={ doDeleteCouponType }>
                                    확인
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
                
                <Dialog onClose={doCloseAddCouponDialog} open={openAddCouponDialog} fullWidth maxWidth="sm">
                    <DialogContent>
                        <Grid container spacing={1} className= {classes.divRow }>
                            <Grid item xs={10}>
                                <TextField className={ classes.width100 } label="쿠폰번호 코드" variant="outlined" defaultValue={ "" }
                                    onBlur={ changeAddCouponCodeValue() }/>
                            </Grid>
                            <Grid item xs={2}>
                                <TextField className={ classes.width100 } label="발매 수" variant="outlined" defaultValue={ addCouponCount }
                                    onBlur={ changeAddCouponCountValue() }/>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} className= {classes.divRow }>
                            <Grid item xs={6}>
                                <TextField className={ classes.width100 } label="유효기간 시작" variant="outlined" defaultValue={ addCouponStartDate }
                                    onBlur={ changeAddCouponStartDateValue() }
                                    helperText="YYYYMMDD (2020.01.01 의 경우 20200101)"/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField className={ classes.width100 } label="유효기간 끝" variant="outlined" defaultValue={ addCouponEndDate }
                                    onBlur={ changeAddCouponEndDateValue() }
                                    helperText="YYYYMMDD (2020.01.01 의 경우 20200101)"/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Grid container spacing={0}>
                            <Grid item align="right" xs={12}>
                                <Button autoFocus color="primary" variant="contained" onClick={ doAddCoupon }>
                                    확인
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
                
                <Dialog onClose={doCloseSetUserToCouponDialog} open={openSetUserToCouponDialog} fullWidth maxWidth="sm">
                    <DialogContent>
                        <Grid container spacing={1} className= {classes.divRow }>
                            <Grid item xs={12}>
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={users}
                                    getOptionLabel={option => option.name + " (" + option.email + "," + option.phone + ")"}
                                    renderInput={params => <TextField {...params} fullWidth label="이름을 입력해주세요" variant="outlined" onChange={ filterUser }/>}
                                    renderOption={option => option.name + " (" + option.email + "," + option.phone + ")"}
                                    onChange={(e,v) => { setSelectedUser(v)}}
                                />
                                {/* <TextField className={ classes.width100 } label="사용자" variant="outlined" defaultValue={ "" } placeholder="이름,이메일 또는 전화번호를 입력해주세요"
                                    onBlur={ changeAddCouponCodeValue() }/> */}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Grid container spacing={0}>
                            <Grid item align="right" xs={12}>
                                <Button autoFocus color="primary" variant="contained" onClick={ doSetUserToCoupon }>
                                    저장
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>

                <Dialog onClose={doCloseRemoveUserToCouponDialog} open={openRemoveUserToCouponDialog} fullWidth maxWidth="sm">
                    <DialogContent>
                        <div>정말 연결 해제를 하시겠습니까?</div>
                    </DialogContent>
                    <DialogActions>
                        <Grid container spacing={0}>
                            <Grid item align="right" xs={12}>
                                <Button autoFocus color="primary" variant="contained" style={{ marginRight: "10px" }} onClick={ doCloseRemoveUserToCouponDialog }>
                                    취소
                                </Button>
                                <Button autoFocus color="primary" variant="contained" onClick={ doRemoveUserToCoupon }>
                                    확인
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
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

export default CouponList;