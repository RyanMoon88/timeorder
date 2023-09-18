import React from 'react';
import { API_SERVER_URL } from '../../constants';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Box, Paper, Grid, Typography, Tabs, Tab, TextField, InputAdornment, Button, Switch } from '@material-ui/core';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import DaumPostcode from 'react-daum-postcode';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import CloseIcon from '@material-ui/icons/Close';

import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import Chip from '@material-ui/core/Chip';

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

function loadData(id, orderListCount = 10) {
    let q = 'query {' +
        ' bases (value: "CA" orderBy: "code_ASC") { bases{ id code name } }' +
        ' options:bases (value: "OP" orderBy: "code_ASC") { bases{ id code name } }' +
        ' saleTypes:bases (value: "SS" orderBy: "code_ASC") { bases{ id code name } }' +
        ' storeCategories:bases (value: "SC" orderBy: "code_ASC") { bases{ id code name } }' +
        ' banks:bases (value: "BK" orderBy: "code_ASC") { bases{ id code name } }' +
        ' groups (orderBy: "code_ASC") { totalCount groups { id code name } }' +
        ' stores (where:"{\\"id\\": \\"' + id + '\\"}") { totalCount stores { id name code type category storeType storeCategory phone zipcode openTime address addressDetail images latitude longitude description elapsedTime isPause isOpened discountType discountValue discountStart discountEnd storeDiscountType storeDiscountValue storeDiscountEnd groupDiscountCode groupDiscountValue ceo ceoPhone bankCode bankNumber bankOwner group { id } productCategory { id name priority } allProducts { id name category status price images description priority canDiscount canGroupDiscount createdAt productCategory { id } productOptionGroups { id name type priority isSingle isRequired isUse productOptionItems { id type value price } } productOptions { option { id code name opt1 opt2 } id price value } } owners { id } } }' +
        ' orders (where: "{\\"store\\": {\\"id\\": \\"' + id + '\\"}, \\"payMethod_not\\": \\"\\", \\"items_some\\": {\\"id_not\\": null}, \\"authDate_not\\": \\"\\" }" orderBy:"createdAt_DESC", skip:0, first:' + orderListCount + ') { totalCount orders { id tid oid createdAt totalPrice authDate store { id name } user { id name } items { id product { name } price discount storeDiscount qty productOption } status payMethod extraInfo statusHistories { from to createdAt } } }' +
        // ' totalLogs:storeOwnerLogs (where: "{\\"storeOwner\\": {\\"store\\": {\\"id\\": \\"' + id + '\\"} }, \\"type_not\\":\\"STORE_LIVE\\" }" orderBy:"createdAt_DESC") { id }' +
        // ' storeOwnerLogs (where: "{\\"storeOwner\\": {\\"store\\": {\\"id\\": \\"' + id + '\\"} }, \\"type_not\\":\\"STORE_LIVE\\" }" orderBy:"createdAt_DESC", skip:0, first:' + logsListCount + ') { id createdAt type content version admin { id name } }' +
    '}'

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


function saveData(origin, store) {
    var opened = store.isOpened === "1" ? "매장오픈" : "매장마감";
    var changeText = ' 변경값 { id:' + store.id + ', name:' + store.name + ', code:' + store.code + ', group:' + store.group.id + ', phone:' + store.phone + 
            ', zipcode:' + store.zipcode + ', address:' + store.address + ', addressDetail:' + store.addressDetail + 
            ', lat:' + store.lat + ', lng:' + store.lng + ', images:' + store.images + ', description:' + store.description + 
            ', discountType:' + store.discountType + ', discountValue:' + store.discountValue + 
            ', discountStart:' + store.discountStart + ', discountEnd:' + store.discountEnd + ', type:' + store.type + ' }';

    var changeTextOwnerElapsedTime = "";
    var changeTextOwnerStoreDiscount = "";
    var changeTextOwnerIsOpened = "";

    let owner = store.owners[0];
    console.log(owner);
    
    if (owner.id !== "") {
        if (origin.elapsedTime !== store.elapsedTime) {
            changeTextOwnerElapsedTime = ' a:insertStoreOwnerLog(storeOwnerId:"' + owner.id + '", adminId:"cjv6z5pjs0aay0734ge2kfk00", type:"WAIT", content:"[관리자 변경] 대기시간을 ' + store.elapsedTime + '분으로 변경", version:"-") { id }';
                
            if (store.elapsedTime === "P") {
                changeTextOwnerElapsedTime = ' a:insertStoreOwnerLog(storeOwnerId:"' + owner.id + '", adminId:"cjv6z5pjs0aay0734ge2kfk00", type:"WAIT", content:"[관리자 변경] 대기시간을 일시정지로 변경", version:"-") { id }';
            }
        }
        if (origin.storeDiscountValue !== store.storeDiscountValue) {
            changeTextOwnerStoreDiscount = ' b:insertStoreOwnerLog(storeOwnerId:"' + owner.id + '", adminId:"cjv6z5pjs0aay0734ge2kfk00", type:"DISCOUNT", content:"[관리자 변경] 할인율을 ' + store.storeDiscountValue + '%로 변경", version:"-") { id }';
        }
        if (origin.isOpened !== store.isOpened) {
            changeTextOwnerIsOpened = ' c:insertStoreOwnerLog(storeOwnerId:"' + owner.id + '", adminId:"cjv6z5pjs0aay0734ge2kfk00", type:"OPEN", content:"[관리자 변경] ' + opened + '으로 변경", version:"-") { id }';
        }
    }

    let q = 'mutation { ' + 
        ' insertAdminLog(type:"STO1" adminId: "cjv6z5pjs0aay0734ge2kfk00" ip:"" content:"[가맹점 수정] ' + store.name + ' ' + changeText + '") { id } ' +
        (changeTextOwnerElapsedTime !== "" ? changeTextOwnerElapsedTime : '') + 
        (changeTextOwnerStoreDiscount !== "" ? changeTextOwnerStoreDiscount : '') + 
        (changeTextOwnerIsOpened !== "" ? changeTextOwnerIsOpened : '') + 
        ' updateStore (' +
        ' id: "' + store.id + '" ' +
        ' name: "' + store.name + '" ' +
        ' code: "' + store.code + '" ' +
        ' storeCategory: "' + store.storeCategory + '" ' +
        ' groupId: "' + store.group.id + '" ' +
        ' phone: "' + store.phone + '" ' +
        ' zipcode: "' + store.zipcode + '" ' +
        ' address: "' + store.address + '" ' +
        ' addressDetail: "' + store.addressDetail + '" ' +
        ' latitude: ' + store.latitude + ' ' +
        ' longitude: ' + store.longitude + ' ' +
        ' images: "' + store.images + '" ' +
        ' description: "' + store.description + '" ' +
        ' discountValue: ' + store.discountValue + ' ' +
        ' discountStart: "' + store.discountStart + '" ' +
        ' discountEnd: "' + store.discountEnd + '" ' +
        ' type: "' + store.type + '" ' +
        (store.storeDiscountValue !== '' ? ' storeDiscountValue: ' + store.storeDiscountValue + ' ': '') +
        (store.elapsedTime !== "P" ? ' elapsedTime: ' + store.elapsedTime + ' ' : '') +
        ' isPause: ' + store.isPause + ' ' +
        ' isOpened: ' + store.isOpened + ' ' +
        ' ceo: "' + store.ceo + '" ' +
        ' ceoPhone: "' + store.ceoPhone + '" ' +
        ' bankCode: "' + store.bankCode + '" ' +
        ' bankOwner: "' + store.bankOwner + '" ' +
        ' bankNumber: "' + store.bankNumber + '" ' +
        // ' openTime: "' + store.openTime + '" ' + 
        ' groupDiscountCode: "' + store.groupDiscountCode + '" ' +
        ' groupDiscountValue: ' + store.groupDiscountValue + ' ' +
        ') {' +
        'id ' +
        '}' + 
    '}';
    
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
}


function saveProductCheckedData(id, status) {
    let q = 'mutation {' +
        ' updateProduct (id: "' + id + '" status: "' + status + '") { id }' +
    '}'

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
// 주문 관련 끝


const Store = ({ match }) => {
    const classes = useStyles();

    // 상점 변수 시작
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openDaumDialog, setOpenDaumDialog] = React.useState(false);
    const [openGroupDialog, setOpenGroupDialog] = React.useState(false);
    const [openCategoryDialog, setOpenCategoryDialog] = React.useState(false);

    const [menuTabValue, setMenuTabValue] = React.useState(0);
    const [productTabValue, setProductTabValue] = React.useState(0);

    const [success, setSuccess] = React.useState(false);
    const [name, setName] = React.useState("");
    const [originStore, setOriginStore] = React.useState(null);
    const [store, setStore] = React.useState(null);
    const [originProducts, setOriginProducts] = React.useState(null);
    const [products, setProducts] = React.useState(null);
    const [product, setProduct] = React.useState(null);
    
    const [groupName, setGroupName] = React.useState("");
    
    const [groups, setGroups] = React.useState(null);
    const [bases, setBases] = React.useState(null);
    const [options, setOptions] = React.useState(null);
    const [banks, setBanks] = React.useState(null);
    const [saleTypes, setSaleTypes] = React.useState([]);
    const [storeCategories, setStoreCategories] = React.useState([]);
    // 상점 변수 끝


    // 주문 변수 시작    
    const [orderTabValue, setOrderTabValue] = React.useState(0);
    const [orders, setOrders] = React.useState([]);
    const [orderTotalCount, setOrderTotalCount] = React.useState(0);
    // 주문 변수 끝


    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        loadData(match.params.id)
        .then((response) => {
            setData(response);
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    function setData(response) {
        console.log("store response", response);
        let data = response.data.data;
        let store = data.stores.stores[0];
        let products = data.stores.stores[0].allProducts;

        let groups = data.groups.groups;
        let bases = data.bases.bases;
        let options = data.options.bases;
        let banks = data.banks.bases;
        let saleTypes = data.saleTypes.bases;
        let storeCategories = data.storeCategories.bases;

        let orders = data.orders.orders;
        let orderTotalCount = data.orders.totalCount;
        
        setGroups(groups);
        setBases(bases);
        setOptions(options);
        setBanks(banks);
        setSaleTypes(saleTypes);
        setStoreCategories(storeCategories);

        setOriginStore(cloneObject(store));
        setStore(store);
        setName(store.name);
        setOriginProducts(cloneObject(products));
        setProducts(products);

        setOrders(orders);
        setOrderTotalCount(orderTotalCount);

        for (let i=0; i<groups.length; i++) {
            if (store.group.id === groups[i].id) {
                setGroupName(groups[i].name);
                break;
            }
        }
    }

    const changeStoreValue = (prop) => (event) => {
        setStore({ ...store, [prop]: event.target.value });
    };

    const changeStoreValueDirect = (prop, value) => {
        setStore({ ...store, [prop]: value });
    };

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

    const changeProductCategoryValue = (id, prop) => (event) => {
        setProducts(origin => {
            const products = origin.map((item) => {
                if (id === item.id)
                    item['productCategory'][prop] = event.target.value;
                return item;
            });
            return products;
        });
    };


    const preventParent = (event) => {
        event.stopPropagation();
    }

    const changeProductChecked = (prop, i) => (event) => {        
        let value = products[i][prop];
        let id = products[i]["id"];
        if (value === "0")
            value = "1";
        else
            value = "0";

        saveProductCheckedData(id, value)
        .then(() => {
            setProducts(origin => {
                const list = origin.map((item, idx) => {
                    if (i === idx)
                        item[prop] = value;
                    return item;
                });
                let products = list.sort((a, b) => {
                    if (a.status < b.status)
                        return 1;

                    if (a.status > b.status)
                        return -1;

                    if (a.priority > b.priority)
                        return 1;

                    if (a.priority < b.priority)
                        return -1;
                    return 0;
                });
                return products;
            });
        });
    };

    const doSaveData = () => {
        new Promise((resolve) => {
            let isChangedImage = !(originStore.images === store.images);

            if (isChangedImage) {
                let AWS = require('aws-sdk');
                AWS.config.region = 'ap-northeast-2'; // 리전
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'ap-northeast-2:ae0b1eaf-8307-4b6c-ac6d-80fe02aad0ee',
                });

                var s3 = new AWS.S3();
                var files = document.getElementById("store-images").files;

                var file = files[0];
                var fileName = file.name;
                var albumPhotosKey = encodeURIComponent("stores") + "/" + encodeURIComponent(store.code) + "/" + encodeURIComponent("profile") + "/";

                var photoKey = albumPhotosKey + fileName;

                s3.upload({
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
                openSnackbar();
            });
        })
    }

    const isSelectedGroup = (index) => {
        return store.group.id === groups[index].id;
    }


    const changeMenuTabs = (event, value) => {
        setMenuTabValue(value);
    }

    const changeProductTabs = (event, value) => {
        setProductTabValue(value);

        setProducts(cloneObject(originProducts));
        if (value !== 0) {
            let id = store.productCategory[value-1].id;
            console.log(id);
            
            setProducts(origin => {
                const products = origin.filter((item) => {
                    if (null === item.productCategory) {
                        return false;
                    }
                    return item.productCategory.id === id
                });
                return products;
            });
        }
    }



    const doOpenDialog = (id) => (event) => {
        event.preventDefault();
        let selected = products.find(item => {
            return item.id === id;
        })
        setProduct(selected);
        setOpenDialog(true);
    }
    const doCloseDialog = () => {
        setProducts(cloneObject(originProducts));
        setOpenDialog(false);
    }


    const doOpenGroupDialog = () => {
        setOpenGroupDialog(true);
    }
    const doCloseGroupDialog = () => {
        setOpenGroupDialog(false);
    }

    const doOpenDaumDialog = () => {
        setOpenDaumDialog(true);
    }
    const doCloseDaumDialog = () => {
        setOpenDaumDialog(false);
    }

    const doOpenCategoryDialog = () => {
        setOpenCategoryDialog(true);
    }
    const doCloseCategoryDialog = () => {
        setOpenCategoryDialog(false);
    }


    const addProductOptionGroup = () => {
    }

    const isNull = (value) => {
        if (value === null || value === undefined) {
            return '';
        }
        else {
            return value;
        }
    }
    
    const openSnackbar = () => {
        setSuccess(true);
    }    
    const closeSnackbar = () => {
        setSuccess(false);
    }

    const addOptionItem = () => {
        console.log("add");
    }
    const deleteOptionItem = () => {
        console.log("!");
    }


    const changePreview = (event) => {
        let target = event.target.files[0];
        changeStoreValueDirect("images", URL.createObjectURL(target));
    }

    const selectDaumAddress = (data) => {
        let copyStore = cloneObject(store);
        let zipcode = data.zonecode;
        let address = data.address;

        copyStore.zipcode = zipcode;
        copyStore.address = address;
        copyStore.addressDetail = "";

        setStore(copyStore);
        doCloseDaumDialog();
    }

    return (
        <Box className="base-container page-box store-container" height="100%">
            <Typography variant="h5" noWrap className={classes.divRow}>
                Store
            </Typography>

            <div className={classes.divRow}>
                <Grid container spacing={4}>
                    <Grid item xs={4}>
                        <Paper square className={classes.paper}>
                            <Typography variant="h5" noWrap className={classes.divRow}>
                                가맹점 정보
                            </Typography>

                            { store !== null &&
                                <div>
                                    <div>
                                        <label htmlFor="store-images">
                                            <img className={[classes.width100, classes.divRow].join(' ')} src={ store.images }/>
                                        </label>
                                        <input type="file" id="store-images" className={classes.hidden} onChange={ changePreview }/>
                                    </div>
                                    <Typography align="center" variant="h6" noWrap className={classes.divRow}>
                                        { name }
                                    </Typography>
                                    <div className={classes.divRow}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <TextField className={ classes.width100 } label="가맹점 이름" variant="outlined" value={ isNull(store.name) }
                                                    onChange={changeStoreValue('name')}/>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <FormControl variant="outlined" className={classes.width100}>
                                                    <InputLabel
                                                        id="store-type">운영 상태</InputLabel>
                                                    <Select
                                                        labelId="store-type"
                                                        value={isNull(store.type)}
                                                        onChange={changeStoreValue('type')}
                                                        labelWidth={75}
                                                    >
                                                        <MenuItem value="0">미운영</MenuItem>
                                                        <MenuItem value="1">운영</MenuItem>
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
                                                        value={isNull(store.storeCategory)}
                                                        onChange={changeStoreValue('storeCategory')}
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
                                        </Grid>
                                    </div>
                                    <div className={classes.divRow}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <TextField className={ classes.width100 } label="가맹점 코드" variant="outlined" value={ isNull(store.code) }
                                                    onChange={changeStoreValue('code')}/>
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
                                                <TextField className={ classes.width100 } label="본사 할인율" variant="outlined" value={ isNull(store.discountValue) }
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                }}
                                                onChange={changeStoreValue('discountValue')}/>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField className={ classes.width100 } label="가맹점 할인율" variant="outlined" value={ isNull(store.storeDiscountValue) }
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                }}
                                                onChange={changeStoreValue('storeDiscountValue')}/>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField className={ classes.width100 } label="그룹 할인 코드" variant="outlined" value={ isNull(store.groupDiscountCode) }
                                                    onChange={changeStoreValue('groupDiscountCode')}/>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField className={ classes.width100 } label="그룹 할인율" variant="outlined" value={ isNull(store.groupDiscountValue) }
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                }}
                                                onChange={changeStoreValue('groupDiscountValue')}/>
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
                                                <TextField className={ classes.width100 } label="전화번호" variant="outlined" value={ isNull(store.phone) }
                                                    onChange={changeStoreValue('phone')}/>
                                            </Grid>
                                        </Grid>
                                    </div>
                                    <div className={classes.divRow}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={4}>
                                                        <TextField className={ classes.width100 } label="우편번호" variant="outlined" value={ isNull(store.zipcode) }/>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Button className={ classes.button } variant="outlined" color="primary" onClick={ doOpenDaumDialog }>검색</Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField className={ classes.width100 } label="주소" variant="outlined" value={ isNull(store.address) }/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField className={ classes.width100 } label="상세주소" variant="outlined" value={ isNull(store.addressDetail) }
                                                    onChange={changeStoreValue('addressDetail')}/>
                                            </Grid>
                                        </Grid>
                                    </div>
                                    <div className={classes.divRow}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={4}>
                                                <TextField className={ classes.width100 } label="대표님 성함" variant="outlined" value={ isNull(store.ceo) }
                                                    onChange={changeStoreValue('ceo')}/>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <TextField className={ classes.width100 } label="대표님 전화번호" variant="outlined" value={ isNull(store.ceoPhone) }
                                                    onChange={changeStoreValue('ceoPhone')}/>
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
                                                        value={isNull(store.bankCode)}
                                                        onChange={changeStoreValue('bankCode')}
                                                        labelWidth={75}
                                                    >
                                                        {
                                                            banks.map((row, index) => (
                                                                <MenuItem value={row.code} key={index}>{row.name}</MenuItem>
                                                            ))
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField className={ classes.width100 } label="입금자명" variant="outlined" value={ isNull(store.bankOwner) }
                                                    onChange={changeStoreValue('bankOwner')}/>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <TextField className={ classes.width100 } label="계좌번호" variant="outlined" value={ isNull(store.bankNumber) }
                                                    onChange={changeStoreValue('bankNumber')}/>
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
                                                <TextField multiline className={ classes.width100 } label="메모" rows="5" variant="outlined" value={ isNull(store.memo) }
                                                    onChange={changeStoreValue('memo')}/>
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
                                <Tab label="기기로그"/>
                            </Tabs>
                        </Paper>
                        { (products !== null && menuTabValue === 0) &&
                            <div>
                                <Grid container spacing={2}>
                                    <Grid item xs={2}>
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
                                        <Grid container spacing={1}>
                                        {
                                            products.map((row, index) => (
                                                <Grid item xs={3} key={row.id}>
                                                    <Paper square className={classes.paper} onClick={doOpenDialog(row.id)}>
                                                        <div className={ classes.relative }>
                                                            <img src={row.images} className={classes.width100}/>
                                                            <IOSSwitch className={ classes.iosSwitch } checked={row.status === "1" ? true: false}
                                                                onClick={preventParent}
                                                                onChange={changeProductChecked('status', index)}/>
                                                        </div>
                                                        <Typography variant="h6">
                                                            { row.name }
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            { numeral(row.price).format(0,0) } 원
                                                        </Typography>
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
                                <Table className={classes.table} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center" style={{ width:'150px' }}>주문번호<br/>주문일</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'100px' }}>주문자</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'60px' }}>상태</StyledTableCell>
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
                                            orders.map(row => (
                                                <StyledTableRow key={ row.id }>
                                                    <StyledTableCell component="th" scope="row" align="center">{ row.oid }<br/>{ moment(row.authDate, "YYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss") }</StyledTableCell>
                                                    <StyledTableCell><Link to={ "/User/" + row.user.id }>{ row.user.name }</Link></StyledTableCell>
                                                    <StyledTableCell align="center">{ setOrderStatus(row.status) }</StyledTableCell>
                                                    <StyledTableCell align="center">{ row.items[0].product.name }</StyledTableCell>
                                                    <StyledTableCell align="center">{ row.items[0].qty }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(row.tcashAmount).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(row.totalTcashChargeAmount).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(row.tcashAmount).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(row.tcashAmount).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ row.payMethod }<br/>{ row.totalPrice }</StyledTableCell>
                                                    <StyledTableCell align="center">{ row.memo }</StyledTableCell>
                                                    <StyledTableCell align="center">{ row.memoRject }</StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </Paper>
                        }
                        
                        { (products !== null && menuTabValue === 2) &&
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
                                    </TableBody>
                                </Table>
                            </Paper>
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
                                        <img src={ product.images } className={classes.width75}/>
                                    </div>
                                    <div>
                                        <Grid container spacing={1} className={classes.divRow}>
                                            <Grid item xs={8}>
                                                <TextField className={ classes.width100 } label="상품 이름" variant="outlined" value={ isNull(product.name) }
                                                    onChange={changeProductValue('name')}/>
                                            </Grid>
                                            <Grid item xs={4}>
                                                
                                                <FormControl variant="outlined" className={classes.width100}>
                                                    <InputLabel
                                                        id="product-type">카테고리</InputLabel>
                                                    <Select
                                                        labelId="product-type"
                                                        value={isNull(product.productCategory.id)}
                                                        onChange={changeProductCategoryValue(product.id, 'id')}
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
                                            <Grid item xs={6}>
                                                <TextField className={ classes.width100 } label="정상가" variant="outlined" value={ isNull(product.price) }
                                                    onChange={changeProductValue('price')}/>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField className={ classes.width100 } label="우선순위" variant="outlined" value={ product.priority === null ? 99 : product.priority }
                                                    onChange={changeProductValue('priority')}/>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <FormControl variant="outlined" className={classes.width100}>
                                                    <InputLabel
                                                        id="product-type">할인 적용</InputLabel>
                                                    <Select
                                                        labelId="product-type"
                                                        value={isNull(product.status)}
                                                        onChange={changeProductValue('type')}
                                                        labelWidth={75}
                                                    >
                                                        <MenuItem value="1">적용</MenuItem>
                                                        <MenuItem value="0">미적용</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1" className={classes.divRow}>
                                        <span>상품 옵션</span>
                                        <Button color="primary" size="small" variant="contained" style={{marginLeft: '10px'}}
                                            onClick={ addProductOptionGroup }>
                                            옵션 그룹 추가
                                        </Button>
                                    </Typography>
                                    <div>
                                        { 
                                            product.productOptionGroups.map((opt, index) => (
                                                <div className={classes.divRow} key={index}>
                                                    <Typography variant="subtitle2">
                                                        { opt.name }
                                                    </Typography>
                                                    <div>
                                                        {
                                                            opt.productOptionItems.map((item, i) => (
                                                                <Chip label="Basic" clickable className={classes.chip} label={item.value + " / " + numeral(item.price).format('0,0') + "원"} key={i} onDelete={deleteOptionItem}/>
                                                            ))
                                                        }
                                                        <Chip label="+" color="primary" clickable className={classes.chip} onClick={addOptionItem}/>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={doCloseDialog} color="primary" variant="outlined">
                                삭제
                            </Button>
                            <Button autoFocus onClick={doCloseDialog} color="primary" variant="contained">
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
                                                    selected={isSelectedGroup(index)} key={row.id}>
                                                    <ListItemText primary={row.name} />
                                                </ListItem>
                                            ))
                                        }
                                    </List>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={doCloseGroupDialog} color="primary" variant="contained">
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
                                    <List>
                                        {
                                            store.productCategory.map((row, index) => (
                                                <ListItem key={row.id}>
                                                    <ListItemText primary={row.name} />
                                                    <ListItemSecondaryAction>
                                                        <CreateIcon style={{marginRight:'6px'}} />
                                                        <CloseIcon />
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            ))
                                        }
                                    </List>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={doCloseCategoryDialog} color="primary" variant="contained">
                                저장
                            </Button>
                        </DialogActions>
                    </Dialog>
            }
            
            <Dialog open={openDaumDialog} fullWidth maxWidth="sm">
                <DialogContent>
                    <DaumPostcode
                    onComplete={ selectDaumAddress }
                    height={500}
                    />
                </DialogContent>
            </Dialog>
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

export default Store;