import React from 'react';
import { API_SERVER_URL,API_HOST } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { useHistory, Link } from 'react-router-dom';
import { Box,Typography } from '@material-ui/core';
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { Container, Paper, GridList, GridListTile, GridListTileBar, ListSubheader, Grid, TextField, Button,InputLabel,Select, MenuItem,FormControl} from '@material-ui/core';
import { ColorPicker,createColor } from 'material-ui-color';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import CloseIcon from '@material-ui/icons/Close';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Autocomplete from '@material-ui/lab/Autocomplete';


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

    input: {
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(2)
    },

    width100: {
        width: '100%'
    },

    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },

    gridList: {
    },
    icon: {
        color: 'rgba(255, 255, 255, 1)',
        background: 'rgba(255, 255, 255, 0.5)',
        marginRight: '10px'
    },

    textRight: {
        textAlign: 'right'
    },

    cellSearch: {
        background: '#ffffff',
        padding: '0px'
    },
    cellSelected: {
        background: '#f9dad5',
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

const s3 = () => {
    let AWS = require('aws-sdk');
    AWS.config.region = 'ap-northeast-2'; // 리전
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'ap-northeast-2:ae0b1eaf-8307-4b6c-ac6d-80fe02aad0ee',
    });

    let s3 = new AWS.S3();
    return s3;
}

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
    if (value === null || value === undefined) {
        return base;
    }
    else {
        return value;
    }
}

const isNullPrice = (value,base ='') => {
    if(value === null || value === undefined){
        return 0
    }else{
        return value;
    }
}

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

function loadAllStore(){
    return new Promise((resolve,reject) => {
        axios({
            "url":API_HOST + "/master/loadAllStore",
            "method":"post"
        }).then(function(response){
            resolve(response);
        })
    })
}

function loadData() {
    return new Promise((resolve,reject) => {
        axios({
            "url":API_HOST + "/master/loadGroupCodeList",
            "method":"post"
        }).then(function(response){
            console.log("groupCodeList");
            console.log(response);
            resolve(response);
        })
    })
    // let q = 'query { ' + 
    //         ' stores (orderBy: "createdAt_DESC") { totalCount stores { id name createdAt } }' +
    //         ' bases (value:"GRP") { totalCount bases { id code name opt1 opt2 opt3 opt4 opt5 opt6 } } }';
    
    // return new Promise((resolve, reject) => {
    //     axios({
    //         "url": API_SERVER_URL,
    //         "method": "post",
    //         "data": {
    //             query: q
    //         }
    //     })
    //     .then(function (response) {
    //         console.log(response);
    //         console.log("122121212112211212");
    //         resolve(response);
    //     });
    // });
}

function loadAllEventData(){
    return new Promise((resolve,reject) => {
        axios({
            "url":API_HOST + "/master/loadAllEvent",
            "method":"post",
        }).then(function(response){
            console.log(response);
        })
    })
}

function loadStoreData(code = "", listRow = 0, listCount = 10, ) {
    console.log(code);
    return new Promise((resolve,reject) => {
        axios({
            "url":API_HOST + "/master/loadStoreListByGroupDiscountCode",
            "method":"post",
            "params":{groupDiscountCode:code}
        }).then(function(response){
            console.log("loadStoreData");
            console.log(response);
            resolve(response);
        })
    })
    // let q = 'query {' +
    //     ' stores (orderBy: "createdAt_DESC", where:"{ \\"groupDiscountCode\\": \\"' + code + '\\" }") { totalCount stores { id code name phone address createdAt group { name } orderToday { id payMethod totalPrice } orderWeek { id payMethod totalPrice } orderMonth { id payMethod totalPrice } ordered { id payMethod totalPrice } } }' +
    // '}'

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
};

const getOrderTodayPrice = (row) => {
    let total = 0;
    if(row !== null){
        total = row.totalAmount;
    }
    // let orderToday = row.orderToday;
    // for (let j=0; j<orderToday.length; j++) {
    //     if (orderToday[j].payMethod !== "00") {
    //         total += orderToday[j].totalPrice;
    //     }
    // }
    return total;
}

function getOrderWeeklyPrice(row) {
    let total = 0;
    if(row !== null){
        total = row.totalAmount;
    }
    return total;
}

function getOrderMonthlyPrice(row) {
    let total = 0;
    if(row !== null){
        total =row.totalAmount;
    }
    return total;
}

function getOrderTotalPrice(row) {
    let total = 0;
    if(row !== null){
        total =row.totalAmount;
    }
    return total;
}

function getOrderTotalCount(row) {
    let total = 0;
    if(row !== null){
        total =row.totalCount;
    }
    return total;
}


const StoreGroupCodeList = () => {
    const [login, setLogin] = useGlobalState('login');
    const [backdrop, setBackdrop] = useGlobalState('backdrop');

    const history = useHistory();
    const classes = useStyles();

    const [search, setSearch] = React.useState("");
    const [selectedGrpIndex, setSelectedGrpIndex] = React.useState(0);
    const [originBases, setOriginBases] = React.useState([]);
    const [bases, setBases] = React.useState([]);
    const [base, setBase] = React.useState(null);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [openStoreDialog, setOpenStoreDialog] = React.useState(false);

    const [stores, setStores] = React.useState([]);
    const [originFilterStores, setOriginFilterStores] = React.useState([]);
    const [filterStores, setFilterStores] = React.useState([]);
    const [searchStore, setSearchStore] = React.useState("");
    const [selectedStore, setSelectedStore] = React.useState(null);
    const [groupCodeColor,setGroupCodeColor] = React.useState("");
    const [updated, setUpdated] = React.useState(false);
    const [openEventDialog, setOpenEventDialog] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [success, setSuccess] = React.useState(false);

    const openSnackbar = () => {
        setSuccess(true);
    }    

    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        setBackdrop(true);
        loadData()
        .then((response) => {
            // let code = response.data.data.bases.bases[0].name;
            // let stores = response.data.data.stores.stores;
            let code = response.data[0]['code'];
            loadStoreData(code)
            .then((response1) => {
                setData(response.data);
                setStores(response1.data);
                loadAllStore().then((response3) =>{
                    setOriginFilterStores(response3.data);
                    setFilterStores(response3.data);
                    setBackdrop(false);
                })
            })
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    // React.useEffect(() => {
    //     let active = true;

    //     if (searchStore.length > 0) {
    //         let filterStores = cloneObject(originFilterStores);
    //         filterStores = filterStores.filter((item) => {
    //             let name = item.name === null ? "" : item.name;
    //             return name.indexOf(searchStore) > -1;
    //         });
    //         setFilterStores(filterStores);
    //     }
    //     else {
    //         setFilterStores([]);
    //     }

    //     return () => {
    //         active = false;
    //     };
    // }, [searchStore]);

    function setData(response) {
        let data = response;
        let bases = data;
        setOriginBases(bases);
        setBases(bases);
    }

    const doSelectGrpIndex = (index) => {
        setSelectedGrpIndex(index);
        setBackdrop(true);
        let code = bases[index].code;
        loadStoreData(code)
        .then((response) => {
            setStores(response.data);
            setBackdrop(false);
        })
    }


    function filterGroupCode(value) {
        let bases = cloneObject(originBases);

        bases = bases.filter((item) => {
            return item.value.toLowerCase().indexOf(value) > -1 || item.opt1.toLowerCase().indexOf(value) > -1;
        })

        setSearch(value);
        setBases(bases);
    }

    function doOpenDialog(base) {
        let baseObject = base;
        if (base === null) {
            let lastCode = bases[bases.length-1].code;
            let lastNum = parseInt(lastCode.replace("GRP", ""));
            let newNum = numeral(lastNum + 1).format("000");
            
            baseObject = {
                id:"",
                code: "GRP" + newNum,
                tcashName: "",
                firstDeposit: "",
                firstDepositType: "",
                oidPrefix:"",
                discountType:"",
                discountValue:"",
                image:null,
                logo:null,
                name:"",
                titleLogo:null,
                color:"",
                registImage:null,
                registText:"",
                registSubtext:"",
            }
        }
        setGroupCodeColor(baseObject.color);
        setBase(baseObject);
        setOpenDialog(true);
    }

    function doCloseDialog() {
        setBase(null);
        setOpenDialog(false);
    }

    function pad2(n) { return n < 10 ? '0' + n : n }

    function upLoadRegistImage(){
        let date = new Date();
        let titleP = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() );
        return new Promise((resolve,reject) => {
            if(base.registImage !== null && base.registImage.indexOf("blob:") >= 0){
                let fileImageId = "groupCode-images-registImage";
                let files = document.getElementById(fileImageId).files;
                var file = files[0];
                let fileName = titleP + "_" + file.name;
                let albumPhotosKey = encodeURIComponent("groupcode") +"/" + encodeURIComponent(base.code) +"/";
                    
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
                        base.registImage = data.Location;
                        setBase({ ...base, ["registImage"]: data.Location });
                        resolve();
                    }
                );
            }else{
                resolve();
            }
        })
    }
    function upLoadLogoTitle(){
        let date = new Date();
        let titleP = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() );
        return new Promise((resolve,reject) => {
            if(base.titleLogo !== null && base.titleLogo.indexOf("blob:") >= 0){
                let fileImageId = "groupCode-images-titleLogo";
                let files = document.getElementById(fileImageId).files;
                var file = files[0];
                let fileName = titleP + "_" + file.name;
                let albumPhotosKey = encodeURIComponent("groupcode") +"/" + encodeURIComponent(base.code) +"/";
                    
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
                        base.titleLogo = data.Location;
                        setBase({ ...base, ["titleLogo"]: data.Location });
                        resolve();
                    }
                );
            }else{
                resolve();
            }
        })

    }
    function upLoadLogo(){
        let date = new Date();
        let titleP = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() );
        return new Promise((resolve,reject) => {
            if(base.logo !== null && base.logo.indexOf("blob:") >= 0){
                let fileImageId = "groupCode-images-logo";
                let files = document.getElementById(fileImageId).files;
                var file = files[0];
                let fileName = titleP + "_" + file.name;
                let albumPhotosKey =  encodeURIComponent("groupcode") +"/" + encodeURIComponent(base.code) +"/";
                    
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
                        console.log(photoKey);
                        base.logo = data.Location;
                        setBase({ ...base, ["logo"]: data.Location });
                        resolve();
                    }
                );
            }else{
                resolve();
            }
        })
    }
    function upLoadImage(){
        let date = new Date();
        let titleP = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() );
        return new Promise((resolve,reject) => {
            if(base.image !== null && base.image.indexOf("blob:") >= 0){
                let fileImageId = "groupCode-images-image";
                let files = document.getElementById(fileImageId).files;
                var file = files[0];
                let fileName = titleP + "_" + file.name;
                let albumPhotosKey = encodeURIComponent("groupcode") +"/" + encodeURIComponent(base.code) +"/";
                    
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
                        base.image = data.Location;
                        setBase({ ...base, ["image"]: data.Location });
                        resolve();
                    }
                );
            }else{
                resolve();
            }
        })
    }

    function updateGroupCode(){
        return new Promise((resolve,reject) => {
            let baseParam = base;
            baseParam.image = base.image;
            baseParam.logo = base.logo;
            baseParam.titleLogo = base.titleLogo;
            baseParam.registImage = base.registImage;
            axios({
                "url":API_HOST + "/master/updateGroupCode",
                "method":"post",
                "data":baseParam
            }).then(function(response){
                console.log("updateGroupCode");
                console.log(response);
                if(base.id === null || base.id === ""){
                    let baseList = bases;
                    base.id = response.data.id;
                    baseList.push(base);
                    setBases(baseList);
                }else{
                    let baseList = bases;
                    for (let i=0; i<baseList.length; i++) {
                        if (response.data.id === baseList[i].id) {
                            baseList[i] = base;
                        }
                    }
                    setBases(baseList);
                }
                setBase(null);
                setSnackMessage("저장 성공");
                openSnackbar();
                setOpenDialog(false);
                resolve();
            })
        })
    }
    function doSaveDialog() {
        upLoadImage().then(upLoadLogo).then(upLoadLogoTitle).then(upLoadRegistImage).then(updateGroupCode);
    }

    const changeBaseValue = (prop) => (event) => {
        setBase({ ...base, [prop]: event.target.value });
    }

    const changeGroupCodeColor = (prop) => (event) => {
        setGroupCodeColor(event);
        let groupCodeColorData = "#" + event.hex;
        setBase({...base, [prop] : groupCodeColorData});
    }

    const changeGroupCodeImage = (event,row,type) =>{
        let target = event.target.files[0];
        if (isNull(target)) {
            setBase({ ...base, [type]: URL.createObjectURL(target)});
        }
    }

    // const changePreview = (event) => {
    //     let target = event.target.files[0];
    //     if (isNull(target)) {
    //         changeStoreValueDirect("images", URL.createObjectURL(target));
    //     }
    // }

    const doUploadGroupCodeImage = (row,type) => {
        return new Promise((resolve) => {
            let fileImageId = "";
            if(type === "logo"){
                fileImageId="groupCode-images-logo";
            }else if(type === "image"){
                fileImageId="groupCode-images-image";
            }else if(type === "titleLogo"){
                fileImageId="groupCode-images-titleLogo";
            }else if(type === "registImage"){
                fileImageId="groupCode-images-registImage";
            }
            let files = document.getElementById(fileImageId).files;
            let date = new Date();
            var file = files[0];
            let fileName = file.name + date;
            let albumPhotosKey = bucketUrl + row.code + "/profile/";
                
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
        })
    }

    function doOpenStoreDialog(base) {
        setOpenStoreDialog(true);
    }

    function doOpenEventDialog(base){
        setOpenEventDialog(true);
    }

    function doCloseStoreDialog() {
        setOpenStoreDialog(false);
    }

    const doSetStoreGroupCode = () => {
        if (selectedStore === null) {
            return false;
        }
        else {
            // let q = 'mutation {' +
            //     ' updateStore (id:"' + selectedStore.id + '", groupDiscountCode: "' + bases[selectedGrpIndex].name + '") { id }' +
            // '}'
        
            // axios({
            //     "url": API_SERVER_URL,
            //     "method": "post",
            //     "data": {
            //         query: q
            //     }
            // })
            // .then(function (response) {
            //     console.log("@@@@@@@@@@@@@@@@@@@@@@");
            //     console.log(response);
            //     loadStoreData(bases[selectedGrpIndex].name)
            //     .then((response) => {
            //         setStores(response.data.data.stores.stores);
            //         setBackdrop(false);
            //     })
            //     doCloseStoreDialog();
            // });
            axios({
                "url": API_HOST + "/master/updateStoreByGroupDiscountCode",
                "method":"post",
                "params":{
                    storeId:selectedStore.id,
                    groupDiscountCode:bases[selectedGrpIndex].code
                }
            }).then(function(response){
                console.log("updateStoreByGroupDiscountCode");
                console.log(response);
                loadStoreData(bases[selectedGrpIndex].code)
                .then((response) => {
                    setStores(response.data);
                    setBackdrop(false);
                })
                doCloseStoreDialog();
            })
        }
    }


    const doFilterSearch = (event) => {
        setSearchStore(event.target.value);
    }
    
    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap className={classes.divRow}>
                    그룹코드별 목록 <Button variant="contained" color="primary" onClick={ () => doOpenDialog(null) }>추가</Button>
                </Typography>

                <div className={classes.divRow}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <Paper className={classes.root}>
                                <Table aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center" style={{ width:'120px' }}>그룹코드</StyledTableCell>
                                            <StyledTableCell align="center">티캐시</StyledTableCell>
                                            <StyledTableCell align="center">적립금</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width:'60px' }}>-</StyledTableCell>
                                        </TableRow>
                                        {/* <TableRow>
                                            <StyledTableCell colSpan={2} align="center" className={classes.cellSearch}>
                                                <TextField defaultValue={ search }  style={{ background:'#ffffff', width:'100%', padding:'5px' }}
                                                    placeholder="코드 검색"
                                                    onKeyUp={ (event) => { filterGroupCode(event.target.value) } } />
                                            </StyledTableCell>
                                        </TableRow> */}
                                    </TableHead>
                                    <TableBody>
                                        {
                                            bases.map((row, i) => (
                                                <StyledTableRow key={ row.id } onClick={doSelectGrpIndex.bind(this, i)}>
                                                    <StyledTableCell className={selectedGrpIndex === i ? classes.cellSelected : ""}>{ row.code }</StyledTableCell>
                                                    <StyledTableCell className={selectedGrpIndex === i ? classes.cellSelected : ""}>{ row.name + "(" + row.tcashName + ")"}</StyledTableCell>
                                                    <StyledTableCell className={selectedGrpIndex === i ? classes.cellSelected : ""}>{ isNullPrice(row.firstDeposit) + "원" + "(" + row.firstDepositType + ")" }</StyledTableCell>
                                                    <StyledTableCell align="center" className={selectedGrpIndex === i ? classes.cellSelected : ""} style={{ padding:'0' }} onClick={ (e) => { e.stopPropagation(); doOpenDialog(row); } }><IconButton><CreateIcon fontSize="small"/></IconButton></StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Grid>
                        <Grid item xs={9}>
                            <Box textAlign="right" mb={2}>
                                {/* <Button variant="contained" color="primary" onClick={ () => doOpenEventDialog(null)} style={{marginRight:'10px'}}>이벤트 관리</Button> */}
                                <Button variant="contained" color="primary" onClick={ () => doOpenStoreDialog(null) }>가맹점 추가</Button>
                            </Box>
                            <Paper className={classes.root}>
                                <Table className={classes.table} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center" style={{ width: '100px' }}>가맹점코드</StyledTableCell>
                                            <StyledTableCell align="center">가맹점명</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width: '150px' }}>전화번호</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width: '150px' }}>금일 매출액</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width: '150px' }}>금주 매출액</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width: '150px' }}>금월 매출액</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width: '150px' }}>총 매출액</StyledTableCell>
                                            <StyledTableCell align="center" style={{ width: '120px' }}>총 주문 건수</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            stores.length === 0 &&
                                                <StyledTableRow> 
                                                    <StyledTableCell colSpan={9} align="center" component="th" scope="row">
                                                        가맹점 정보가 없습니다.
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                        }
                                        {
                                            stores.map(row => (
                                                <StyledTableRow key={ row.id }>
                                                    <StyledTableCell align="center" component="th" scope="row">{ row.code }</StyledTableCell>
                                                    <StyledTableCell><Link to={ "/Store/" + row.id }>{ row.name }</Link></StyledTableCell>
                                                    <StyledTableCell align="center">{ row.phone }</StyledTableCell>
                                                    {/* <StyledTableCell align="right">{ numeral(row.orderToday.totalAmount).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(row.orderWeek.totalAmount).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(row.orderMonth.totalAmount).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(row.orderList.totalAmount).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(row.orderList.totalCount).format('0,0') }</StyledTableCell> */}
                                                    <StyledTableCell align="right">{ numeral(getOrderTodayPrice(row.orderToday)).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(getOrderWeeklyPrice(row.orderWeek)).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(getOrderMonthlyPrice(row.orderMonth)).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(getOrderTotalPrice(row.orderList)).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(getOrderTotalCount(row.orderList)).format('0,0') }</StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
                
                {
                    /* Dialog */
                    base !== null &&                
                        <Dialog onClose={doCloseDialog} className="store-container" aria-labelledby="product-dialog-title" open={openDialog} fullWidth maxWidth="sm">
                            <DialogTitle onClose={doCloseDialog}>그룹코드 관리</DialogTitle>
                            <DialogContent dividers>
                                <Grid container spacing={4}>
                                    <Grid item xs={12}>
                                        <div className={ classes.divRow }>
                                            <TextField className={ classes.width100 } label="그룹코드" variant="outlined" defaultValue={ isNull(base.code) }
                                                onBlur={changeBaseValue('code')}/>
                                        </div>
                                        <div className={ classes.divRow }>
                                            <TextField className={ classes.width100 } label="이름" variant="outlined" defaultValue={ isNull(base.name) }
                                                onBlur={changeBaseValue('name')}/>
                                        </div>
                                        <div className={ classes.divRow }>
                                            <TextField className={ classes.width100 } label="티캐시 별칭" variant="outlined" defaultValue={ isNull(base.tcashName) }
                                                onBlur={changeBaseValue('tcashName')}/>
                                        </div>
                                        <div className={ classes.divRow }>
                                            <TextField className={ classes.width100 } label="혜택" variant="outlined" defaultValue={ isNull(base.registText) }
                                                onBlur={changeBaseValue('registText')}/>
                                        </div>
                                        <div className={ classes.divRow }>
                                            <TextField className={ classes.width100 } label="혜택 기간" variant="outlined" defaultValue={ isNull(base.registSubtext) }
                                                onBlur={changeBaseValue('registSubtext')}/>
                                        </div>
                                        <div className={ classes.divRow }>
                                            <TextField className={ classes.width100 } label="적립금" variant="outlined" defaultValue={ isNull(base.firstDeposit) }
                                                onBlur={changeBaseValue('firstDeposit')}/>
                                        </div>
                                        <div className={ classes.divRow }>
                                            <FormControl variant="outlined" className={classes.width100}>
                                                <InputLabel
                                                    id="firstDepositType">적립금 타입</InputLabel>
                                                <Select
                                                    labelId="firstDepositType"
                                                    defaultValue={isNull(base.firstDepositType)}
                                                    onBlur={changeBaseValue('firstDepositType')}
                                                    labelWidth={75}
                                                >
                                                    <MenuItem value="TCASH">TCASH</MenuItem>
                                                    <MenuItem value="GROUP">GROUP</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        {/* <div className={ classes.divRow }>
                                            <FormControl variant="outlined" className={classes.width100}>
                                                <InputLabel
                                                    id="isTeam">캐시 타입</InputLabel>
                                                <Select
                                                    labelId="isTeam"
                                                    defaultValue={isNull(base.isTeam)}
                                                    onBlur={changeBaseValue('isTeam')}
                                                    labelWidth={75}
                                                >
                                                    <MenuItem value="false">일반 캐시</MenuItem>
                                                    <MenuItem value="true">팀 캐시</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div> */}
                                        <div className={ classes.divRow }>
                                            <InputLabel
                                                id="store-type">매장 고유 색상</InputLabel>
                                            <div>
                                                <ColorPicker value={groupCodeColor} onChange={changeGroupCodeColor("color")}/>
                                            </div>
                                        </div>
                                        <div className={ classes.divRow }>
                                            <Grid container spacing={1}>
                                                <Grid item xs={3} style={{textAlign:"center"}}>
                                                    <InputLabel>로고</InputLabel>
                                                    <div>
                                                        <label htmlFor={"groupCode-images-logo"}>
                                                            {
                                                                base.logo === null &&
                                                                <img src={ "/img/default-product.png" } style={{ maxWidth: '135px',  maxHeight: '240px', boxShadow:'0px 1px 4px #333' }} alt={ base.logo } onError={(e) => { e.target.src="/img/default-product.png"}} />    
                                                            }
                                                            {
                                                                base.logo !== null &&
                                                                <img src={ base.logo } style={{ maxWidth: '135px',  maxHeight: '240px', boxShadow:'0px 1px 4px #333' }} alt={ base.logo } onError={(e) => { e.target.src="/img/default-product.png"}} />
                                                            }
                                                        </label>
                                                        <input type="file" id={ "groupCode-images-logo"} style={{visibility:"hidden"}} onChange={ (e) => changeGroupCodeImage(e, base.logo,"logo") }/>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={3} style={{textAlign:"center"}}>
                                                <InputLabel>배너</InputLabel>
                                                    <label htmlFor={"groupCode-images-image"}>
                                                        {
                                                            base.image === null &&
                                                            <img src={ "/img/default-product.png" } style={{ maxWidth: '135px',  maxHeight: '240px', boxShadow:'0px 1px 4px #333' }} alt={ base.image } onError={(e) => { e.target.src="/img/default-product.png"}} />    
                                                        }
                                                        {
                                                            base.image !== null &&
                                                            <img src={ base.image } style={{ maxWidth: '135px',  maxHeight: '240px', boxShadow:'0px 1px 4px #333' }} alt={ base.image } onError={(e) => { e.target.src="/img/default-product.png"}} />
                                                        }
                                                    </label>
                                                    <input type="file" id={ "groupCode-images-image"} style={{visibility:"hidden"}} onChange={ (e) => changeGroupCodeImage(e, base.image,"image") }/>
                                                </Grid>
                                                <Grid item xs={3} style={{textAlign:"center"}}>
                                                    <InputLabel>타이틀 로고</InputLabel>
                                                    <label htmlFor={"groupCode-images-titleLogo"}>
                                                        {
                                                            base.titleLogo === null &&
                                                            <img src={ "/img/default-product.png" } style={{ maxWidth: '135px',  maxHeight: '240px', boxShadow:'0px 1px 4px #333' }} alt={ base.titleLogo } onError={(e) => { e.target.src="/img/default-product.png"}} />    
                                                        }
                                                        {
                                                            base.titleLogo !== null &&
                                                            <img src={ base.titleLogo } style={{ maxWidth: '135px',  maxHeight: '240px', boxShadow:'0px 1px 4px #333' }} alt={ base.titleLogo } onError={(e) => { e.target.src="/img/default-product.png"}} />
                                                        }
                                                    </label>
                                                    <input type="file" id={ "groupCode-images-titleLogo"} style={{visibility:"hidden"}} onChange={ (e) => changeGroupCodeImage(e, base.titleLogo,"titleLogo") }/>
                                                </Grid>
                                                <Grid item xs={3} style={{textAlign:"center"}}>
                                                    <InputLabel>혜택 이미지</InputLabel>
                                                    <label htmlFor={"groupCode-images-registImage"}>
                                                        {
                                                            base.registImage === null &&
                                                            <img src={ "/img/default-product.png" } style={{ maxWidth: '135px',  maxHeight: '240px', boxShadow:'0px 1px 4px #333' }} alt={ base.registImage } onError={(e) => { e.target.src="/img/default-product.png"}} />    
                                                        }
                                                        {
                                                            base.registImage !== null &&
                                                            <img src={ base.registImage } style={{ maxWidth: '135px',  maxHeight: '240px', boxShadow:'0px 1px 4px #333' }} alt={ base.registImage } onError={(e) => { e.target.src="/img/default-product.png"}} />
                                                        }
                                                    </label>
                                                    <input type="file" id={ "groupCode-images-registImage"} style={{visibility:"hidden"}} onChange={ (e) => changeGroupCodeImage(e, base.registImage,"registImage") }/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className={ [classes.divRow, classes.textRight].join(' ') }>
                                            <Button className={ classes.button } variant="contained" color="primary" onClick={ doSaveDialog }>저장</Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                        </Dialog>
                }
                
                <Dialog onClose={doCloseStoreDialog} open={openEventDialog} fullWidth maxWidth="sm">
                    <DialogContent>
                        <Grid container spacing={1} className= {classes.divRow }>
                            <Grid item xs={12}>
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={filterStores}
                                    getOptionLabel={option => option.name }
                                    renderInput={params => <TextField {...params} fullWidth label="가맹점 이름을 입력해주세요" variant="outlined" onChange={ doFilterSearch }/>}
                                    renderOption={option => option.name }
                                    onChange={(e,v) => { setSelectedStore(v)}}
                                />
                                {/* <TextField className={ classes.width100 } label="사용자" variant="outlined" defaultValue={ "" } placeholder="이름,이메일 또는 전화번호를 입력해주세요"
                                    onBlur={ changeAddCouponCodeValue() }/> */}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Grid container spacing={0}>
                            <Grid item align="right" xs={12}>
                                <Button autoFocus color="primary" variant="contained" onClick={ doSetStoreGroupCode }>
                                    저장
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>

                <Dialog onClose={doCloseStoreDialog} open={openStoreDialog} fullWidth maxWidth="sm">
                    <DialogContent>
                        <Grid container spacing={1} className= {classes.divRow }>
                            <Grid item xs={12}>
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={filterStores}
                                    getOptionLabel={option => option.name }
                                    renderInput={params => <TextField {...params} fullWidth label="가맹점 이름을 입력해주세요" variant="outlined" onChange={ doFilterSearch }/>}
                                    renderOption={option => option.name }
                                    onChange={(e,v) => { setSelectedStore(v)}}
                                />
                                {/* <TextField className={ classes.width100 } label="사용자" variant="outlined" defaultValue={ "" } placeholder="이름,이메일 또는 전화번호를 입력해주세요"
                                    onBlur={ changeAddCouponCodeValue() }/> */}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Grid container spacing={0}>
                            <Grid item align="right" xs={12}>
                                <Button autoFocus color="primary" variant="contained" onClick={ doSetStoreGroupCode }>
                                    저장
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
            </Box>
    );
};

export default StoreGroupCodeList;