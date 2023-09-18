import React from 'react';
import { API_HOST } from '../../constants';
import { useGlobalState } from '../../state';
import { Box,Typography, Paper, Grid, Button, TextField } from '@material-ui/core';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import CloseIcon from '@material-ui/icons/Close';

import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';


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
    
    smallButton: {
        padding: '4px 0px',
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

    textRight: {
        textAlign: 'right'
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

    slideImage: {
        position: "relative",
        width: "calc(25% - " + theme.spacing(2) +  "px)",
        height: "320px",
        overflow: "hidden",
        border: "1px solid #efefef",
        borderRadius: "4px",
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(2)
    },

    dialogSlideImage: {
        position: "relative",
        width: "240px",
        height: "320px",
        overflow: "hidden",
        border: "1px solid #efefef",
        borderRadius: "4px"
    },

    noticeImage: {
        position: "relative",
        width: "calc(50% - " + theme.spacing(2) +  "px)",
        height: "320px",
        overflow: "hidden",
        border: "1px solid #efefef",
        borderRadius: "4px",
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(2)
    },

    dialogNoticeImage: {
        position: "relative",
        width: "240px",
        height: "320px",
        overflow: "hidden",
        border: "1px solid #efefef",
        borderRadius: "4px"
    }
}));


function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}


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


function getImage(image) {
    if (image.indexOf("https:") >= 0 || image.indexOf("http:") >= 0 || image.indexOf("blob:") >= 0) {
        return image;
    }
    else {
    }
}

function getLastId(list) {
    if (list.length > 0) {
        let id = list[0].id;

        for (let i=0; i<list.length; i++) {
            if (id < list[i].id) {
                id = list[i].id;
            }
        }
    
        return id + 1;
    }
    else {
        return 0;
    }
}



function loadData() {
    // let q = 'query {' +
    //     ' mainSlide:settings (code: "MAIN_SLIDE") { settings { id code value } }' +
    //     ' mainSlide:settings (code: "MAIN_SLIDE") { settings { id code value } }' +
    //     ' mainNotice:settings (code: "MAIN_NOTICE") { settings { id code value } }' +
    //     ' bases (value:"GRP") { totalCount bases { id code name opt1 opt2 opt3 opt4 opt5 opt6 } }' +
    // '}'

    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadSettingsByAppManage",
            "method": "post",
        })
        .then(function (response) {    
            resolve(response);
        });
    });
}

const AppManage = () => {
    const [login, setLogin] = useGlobalState('login');
    const [backdrop, setBackdrop] = useGlobalState('backdrop');

    const classes = useStyles();

    const [originMainSlides, setOriginMainSlides] = React.useState([]);
    const [mainSlides, setMainSlides] = React.useState([]);
    const [mainSlide, setMainSlide] = React.useState(null);
    const [filterMainSlide, setFilterMainSlide] = React.useState("ALL");
    const [openMainSlideDialog, setOpenMainSlideDialog] = React.useState(false);
    
    const [originGroupCodes, setOriginGroupCodes] = React.useState([]);
    const [groupCodes, setGroupCodes] = React.useState([]);


    const [originMainNotices, setOriginMainNotices] = React.useState([]);
    const [mainNotices, setMainNotices] = React.useState([]);
    const [mainNotice, setMainNotice] = React.useState(null);
    const [openMainNoticeDialog, setOpenMainNoticeDialog] = React.useState(false);
    

    const [success, setSuccess] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");

    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        setBackdrop(true);
        loadData()
        .then((response) => {
            setData(response);
            setBackdrop(false);
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    
    function setData(response) {
        console.log("setting response", response);
        let mainSlides = JSON.parse(response.data.mainSlide.value);
        for(let i=0; i<mainSlides.length; i++) {
            mainSlides[i].id = i;
            mainSlides[i].index = i;
        }

        let mainNotices = JSON.parse(response.data.mainNotice.value);
        for(let i=0; i<mainNotices.length; i++) {
            mainNotices[i].id = i;
            mainNotices[i].index = i;
        }
        setOriginMainSlides(mainSlides);
        setMainSlides(mainSlides);
        setMainNotices(mainNotices);

        let groupCodes = response.data.bases;
        setOriginGroupCodes(groupCodes);
        setGroupCodes(groupCodes);
    }

    /*
    *
        메인 슬라이드 관리 시작
    *
    */

    // 상품 다이얼로그 시작
    const doOpenMainSlideDialog = (row) => {
        setOpenMainSlideDialog(true);        
        let item = row;

        if (item === null) {
            item = {
                id: null,
                image: "",
                url: "",
                position: "center",
                index: mainSlides.length,
                groupCode: ""
            }
        }

        setMainSlide(item);
    }


    // 상품 다이얼로그 시작
    const doCloseMainSlideDialog = () => {
        setOpenMainSlideDialog(false);
        setMainSlide(null);
    }

    // 상품 다이얼로그 시작
    const doSaveMainSlideDialog = () => {
        let copyMainSlides = cloneObject(originMainSlides);

        if (mainSlide.image.indexOf("blob:") >= 0) {
            new Promise((resolve) => {
                let files = document.getElementById("addSlideImage").files;
    
                var file = files[0];
                let fileName = file.name;
                let albumPhotosKey = encodeURIComponent("app") + "/" + encodeURIComponent("main_slide") + "/";
    
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
                        changeMainSlideValueDirect("image", data.Location);
                        resolve(data.Location);
                    }
                );
            })
            .then((image) => {
                save(image);
            });
        }
        else {
            save();
        }
        
        function save(image) {
            if (image !== undefined) {
                mainSlide.image = image;
            }

            if (mainSlide.id === null) {
                mainSlide.id = getLastId(copyMainSlides);
                copyMainSlides.push(mainSlide);
            }
            else {
                copyMainSlides = copyMainSlides.map((item) => {
                    console.log((item.id === mainSlide.id) ? mainSlide : item);
                    return (item.id === mainSlide.id) ? mainSlide : item;
                });
            }
    
            copyMainSlides = copyMainSlides.sort((a, b) => {
                return parseInt(a.index) < parseInt(b.index) ? -1 : 1;
            });
    
            console.log(copyMainSlides);
            setOriginMainSlides(copyMainSlides);


            let cloneMainSlides = cloneObject(copyMainSlides);

            if (filterMainSlide !== "ALL") {
                cloneMainSlides = copyMainSlides.filter((item) => {
                    if (item.groupCode) {
                        return (item.groupCode === filterMainSlide)
                    }
                });
            }
            
            setMainSlides(cloneMainSlides);
            setOpenMainSlideDialog(false);
            
            setSnackMessage("임시 저장 성공");
            openSnackbar();
        }
    }

    const doDeleteMainSlideDialog = () => {
        let copyMainSlides = cloneObject(originMainSlides);
        for (let i=0; i<copyMainSlides.length; i++) {
            if (mainSlide.id === copyMainSlides[i].id) {
                copyMainSlides.splice(i, 1);
                break;
            }
        }
        
        let cloneMainSlides = cloneObject(copyMainSlides);
        console.log(filterMainSlide);

        if (filterMainSlide !== "ALL") {
            cloneMainSlides = copyMainSlides.filter((item) => {
                if (item.groupCode) {
                    return (item.groupCode === filterMainSlide)
                }
            });

            console.log(cloneMainSlides);
        }
        setOriginMainSlides(copyMainSlides);
        setMainSlides(cloneMainSlides);
        setMainSlide(null);
        setOpenMainSlideDialog(false);
    }


    const changeMainSlideValue = (prop) => (event) => {
        setMainSlide({ ...mainSlide, [prop]: event.target.value });
    }

    const changeMainSlideValueDirect = (prop, value) => {
        setMainSlide({ ...mainSlide, [prop]: value });
    }

    const changeMainSlidePreview = (event) => {
        let target = event.target.files[0];
        if (isNull(target)) {
            changeMainSlideValueDirect("image", URL.createObjectURL(target));
        }
    }

    const doSaveMainSlide = () => {
        let copyMainSlides = cloneObject(originMainSlides);

        copyMainSlides = copyMainSlides.sort((a, b) => {
            return parseInt(a.index) < parseInt(b.index) ? -1 : 1;
        });

        let objectMainSlides = cloneObject(copyMainSlides);
        objectMainSlides = objectMainSlides.map((item) => {
            delete item['id'];
            delete item['index'];
            return item;
        });

        console.log(copyMainSlides);
        console.log(objectMainSlides);

        let stringMainSlides = JSON.stringify(objectMainSlides);
        // stringMainSlides = stringMainSlides.replace(/\"/g, "\\\"");
        // let q = 'mutation { ' + 
        //     ' updateSetting (' +
        //         'code: "MAIN_SLIDE" ' +
        //         'value: "' + stringMainSlides + '"' +
        //     ') {' +
        //         'id ' +
        //     '}' + 
        // '}';
        axios({
            "url": API_HOST + "/master/updateSetting",
            "method": "post",
            "params": {
                code: "MAIN_SLIDE",
                value: encodeURI(stringMainSlides) ,
            }
        })
        .then(function (response) {
            console.log(response);
            // resolve(response);
            
            setSnackMessage("저장 성공");
            openSnackbar();
        });
    }

    
    const doFilterMainSlide = () => (event) => {
        setFilterMainSlide(event.target.value);
        let cloneMainSlides = cloneObject(originMainSlides);
        console.log(cloneMainSlides);
        console.log(event.target.value);

        if (event.target.value !== "ALL") {
            cloneMainSlides = cloneMainSlides.filter((item) => {
                if (item.groupCode) {
                    return (item.groupCode === event.target.value)
                }
            });
        }
        
        setMainSlides(cloneMainSlides);
    }

    /*
    *
        메인 슬라이드 관리 끝
    *
    */


    /*
    *
        메인 공지사항 관리 시작
    *
    */

    // 상품 다이얼로그 시작
    const doOpenMainNoticeDialog = (row) => {
        setOpenMainNoticeDialog(true);        
        let item = row;

        if (item === null) {
            item = {
                code: "",
                image: "",
                index: mainNotices.length,
                expireDate: "",
                groupCode: ""
            }
        }

        setMainNotice(item);
    }

    // 상품 다이얼로그 시작
    const doCloseMainNoticeDialog = () => {
        setOpenMainNoticeDialog(false);
        setMainNotice(null);
    }

    // 상품 다이얼로그 시작
    const doSaveMainNoticeDialog = () => {
        let copyMainNotices = cloneObject(mainNotices);

        if (mainNotice.image.indexOf("blob:") >= 0) {
            new Promise((resolve) => {
                let files = document.getElementById("addNoticeImage").files;
    
                var file = files[0];
                let fileName = file.name;
                let albumPhotosKey = encodeURIComponent("app") + "/" + encodeURIComponent("main_slide") + "/";
    
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
                        changeMainNoticeValueDirect("image", data.Location);
                        resolve(data.Location);
                    }
                );
            })
            .then((image) => {
                save(image);
            });
        }
        else {
            save();
        }
        
        function save(image) {
            if (image !== undefined) {
                mainNotice.image = image;
            }

            if (mainNotice.id === null) {
                mainNotice.id = getLastId(copyMainNotices);
                copyMainNotices.push(mainNotice);
            }
            else {
                copyMainNotices = copyMainNotices.map((item) => {
                    // console.log(item, mainNotice);
                    console.log((item.id === mainNotice.id) ? mainNotice : item);
                    return (item.id === mainNotice.id) ? mainNotice : item;
                });
            }
    
            copyMainNotices = copyMainNotices.sort((a, b) => {
                return parseInt(a.index) < parseInt(b.index) ? -1 : 1;
            });
    
            console.log(copyMainNotices);
            setMainNotices(copyMainNotices);
            setOpenMainNoticeDialog(false);
            
            setSnackMessage("임시 저장 성공");
            openSnackbar();
        }
    }

    const doDeleteMainNoticeDialog = () => {
        let copyMainNotices = cloneObject(mainNotices);
        for (let i=0; i<copyMainNotices.length; i++) {
            if (mainNotice.id === copyMainNotices[i].id) {
                mainNotices.splice(i, 1);
                break;
            }
        }
        setMainNotices(mainNotices);
        setMainNotice(null);
        setOpenMainNoticeDialog(false);
    }


    const changeMainNoticeValue = (prop) => (event) => {
        setMainNotice({ ...mainNotice, [prop]: event.target.value });
    }

    const changeMainNoticeValueDirect = (prop, value) => {
        setMainNotice({ ...mainNotice, [prop]: value });
    }

    const changeMainNoticePreview = (event) => {
        let target = event.target.files[0];
        if (isNull(target)) {
            changeMainNoticeValueDirect("image", URL.createObjectURL(target));
        }
    }

    const doSaveMainNotice = () => {
        let copyMainNotices = cloneObject(mainNotices);

        copyMainNotices = copyMainNotices.sort((a, b) => {
            return parseInt(a.index) < parseInt(b.index) ? -1 : 1;
        });

        setMainNotices(copyMainNotices);

        let objectMainNotices = cloneObject(copyMainNotices);
        objectMainNotices = objectMainNotices.map((item) => {
            delete item['id'];
            delete item['index'];
            return item;
        });

        console.log(copyMainNotices);
        console.log(objectMainNotices);

        let stringMainNotices = JSON.stringify(objectMainNotices);
        // stringMainNotices = stringMainNotices.replace(/\"/g, "\\\"");
        // let q = 'mutation { ' + 
        //     ' updateSetting (' +
        //         'code: "MAIN_NOTICE" ' +
        //         'value: "' + stringMainNotices + '"' +
        //     ') {' +
        //         'id ' +
        //     '}' + 
        // '}';
        axios({
            "url": API_HOST + "/master/updateSetting",
            "method": "post",
            "params": {
                code: "MAIN_NOTICE",
                value: encodeURI(stringMainNotices) ,
            }
        })
        .then(function (response) {
            console.log(response);
            // resolve(response);
            
            setSnackMessage("저장 성공");
            openSnackbar();
        });
    }

    /*
    *
        메인 공지사항 관리 끝
    *
    */

    const openSnackbar = () => {
        console.log("?");
        setSuccess(true);
    }    
    const closeSnackbar = () => {
        setSuccess(false);
    }

    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap className={classes.divRow}>
                    앱 관리
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={8}>
                        <Paper square className={classes.paper}>
                            <div className={ classes.relative }>
                                <Typography variant="h6" noWrap className={classes.divRow} style={{ marginBottom: 0 }}>
                                    메인 슬라이드 관리
                                </Typography>
                                <Button className={ classes.smallButton } variant="contained" color="primary" style={{ position:"absolute", top:"0px", right:"0px" }} onClick={ doSaveMainSlide }>저장</Button>
                            </div>

                            <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                                <FormControl variant="outlined" style={{ width: '150px' }}>
                                    <InputLabel
                                        id="coupon-type-list-group">그룹코드</InputLabel>
                                    <Select
                                        id="coupon-type-list-small"
                                        labelId="coupon-type-list-group"
                                        defaultValue = {filterMainSlide}
                                        onChange={doFilterMainSlide()}
                                        labelWidth={80}
                                    >
                                        <MenuItem value="ALL">전체</MenuItem>
                                        {
                                            groupCodes.map((row, i) => (
                                                <MenuItem key={i} value={ row.code }>{ row.code }</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </div>

                            <Grid container>
                                {
                                    mainSlides.map((row, index) => (
                                        <Grid key={index} item
                                            className={classes.slideImage}
                                            style={{ backgroundImage: "url(" + getImage(row.image) + ")", backgroundSize: "cover", backgroundPosition: row.position }}
                                            onClick={ doOpenMainSlideDialog.bind(this, row) }>
                                                {
                                                    row.groupCode &&
                                                        <span style={{ display:'inline-block', margin:'8px', padding:'4px 12px', background:'#e2422a', color:'#fff', borderRadius:'8px', lineHeight:1, boxShadow:'0px 0px 2px #000' }}>{ row.groupCode }</span>
                                                }
                                        </Grid>
                                    ))
                                }
                                <Grid item className={classes.slideImage} onClick={ doOpenMainSlideDialog.bind(this, null) }>
                                    <AddIcon style={{ position: "absolute", top:"50%", left:"50%", transform: "translate(-50%, -50%)", fontSize: 40}}/>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper square className={classes.paper}>
                            <div className={ classes.relative }>
                                <Typography variant="h6" noWrap className={classes.divRow} style={{ marginBottom: 0 }}>
                                    메인 다이얼로그 관리 <small>(개발중, v2에 들어갈 예정)</small>
                                </Typography>
                                <Button className={ classes.smallButton } variant="contained" color="primary" style={{ position:"absolute", top:"0px", right:"0px" }} onClick={ doSaveMainNotice }>저장</Button>
                            </div>
                            <Grid container>
                                {
                                    mainNotices.map((row, index) => (
                                        <Grid key={index} item
                                            className={classes.noticeImage}
                                            style={{ backgroundImage: "url(" + getImage(row.image) + ")", backgroundSize: "cover", backgroundPosition: row.position }}
                                            onClick={ doOpenMainNoticeDialog.bind(this, row) }>
                                                {
                                                    row.groupCode &&
                                                        <span style={{ display:'inline-block', margin:'8px', padding:'4px 12px', background:'#e2422a', color:'#fff', borderRadius:'8px', lineHeight:1, boxShadow:'0px 0px 2px #000' }}>{ row.groupCode }</span>
                                                }
                                        </Grid>
                                    ))
                                }
                                <Grid item className={classes.noticeImage} onClick={ doOpenMainNoticeDialog.bind(this, null) }>
                                    <AddIcon style={{ position: "absolute", top:"50%", left:"50%", transform: "translate(-50%, -50%)", fontSize: 40}}/>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
                
                {
                    /* Dialog */
                    mainSlide !== null &&                
                        <Dialog onClose={doCloseMainSlideDialog} className="store-container" aria-labelledby="product-dialog-title" open={openMainSlideDialog} fullWidth maxWidth="sm">
                            <DialogTitle onClose={doCloseMainSlideDialog}>슬라이드 정보</DialogTitle>
                            <DialogContent dividers>
                                <Grid container spacing={4}>
                                    <Grid item>
                                        <label htmlFor="addSlideImage">
                                            {
                                                mainSlide.image === '' && 
                                                    <div className={classes.dialogSlideImage}>
                                                        <AddIcon style={{ position: "absolute", top:"50%", left:"50%", transform: "translate(-50%, -50%)", fontSize: 40}} onClick={ doOpenMainSlideDialog.bind(this, null) }/>
                                                    </div>
                                            }
                                            {
                                                mainSlide.image !== '' &&
                                                    <div className={classes.dialogSlideImage}
                                                        style={{ backgroundImage: "url('" + getImage(mainSlide.image) + "')", backgroundSize: "cover", backgroundPosition: mainSlide.position }}>
                                                    </div>
                                            }
                                        </label>
                                        <input id="addSlideImage" className={ classes.hidden } type="file" onChange={ changeMainSlidePreview }/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <div className={ classes.divRow }>
                                            <TextField className={ classes.width100 } label="순서" variant="outlined" defaultValue={ isNull(mainSlide.index) }
                                                onBlur={changeMainSlideValue('index')}/>
                                        </div>
                                        <div className={ classes.divRow }>
                                            <TextField className={ classes.width100 } label="URL" variant="outlined" defaultValue={ isNull(mainSlide.url) }
                                                onBlur={changeMainSlideValue('url')}/>
                                        </div>
                                        <div className={ classes.divRow }>
                                            <FormControl variant="outlined" className={classes.width100}>
                                                <InputLabel
                                                    id="store-type">위치</InputLabel>
                                                <Select
                                                    className={ classes.width100 }
                                                    value={ mainSlide.position !== null ? mainSlide.position : ''}
                                                    onChange={changeMainSlideValue('position')}
                                                    labelWidth={75}>
                                                    <MenuItem value="top">top</MenuItem>
                                                    <MenuItem value="center">center</MenuItem>
                                                    <MenuItem value="bottom">bottom</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className={ classes.divRow }>
                                            <TextField className={ classes.width100 } label="그룹코드" helperText='입력시 해당 코드 입력 대상만 보입니다' variant="outlined" defaultValue={ isNull(mainSlide.groupCode) }
                                                onBlur={changeMainSlideValue('groupCode')}/>
                                        </div>
                                        <div className={ [classes.divRow, classes.textRight].join(' ') }>
                                            <Button className={ classes.button } variant="contained" color="primary" onClick={ doDeleteMainSlideDialog } style={{ marginRight: '16px' }}>삭제</Button>
                                            <Button className={ classes.button } variant="contained" color="primary" onClick={ doSaveMainSlideDialog }>저장</Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                        </Dialog>
                }

                {
                    /* Dialog */
                    mainNotice !== null &&                
                        <Dialog onClose={doCloseMainNoticeDialog} className="store-container" aria-labelledby="product-dialog-title" open={openMainNoticeDialog} fullWidth maxWidth="sm">
                            <DialogTitle onClose={doCloseMainNoticeDialog}>공지사항 정보</DialogTitle>
                            <DialogContent dividers>
                                <Grid container spacing={4}>
                                    <Grid item>
                                        <label htmlFor="addNoticeImage">
                                            {
                                                mainNotice.image === '' && 
                                                    <div className={classes.dialogNoticeImage}>
                                                        <AddIcon style={{ position: "absolute", top:"50%", left:"50%", transform: "translate(-50%, -50%)", fontSize: 40}} onClick={ doOpenMainNoticeDialog.bind(this, null) }/>
                                                    </div>
                                            }
                                            {
                                                mainNotice.image !== '' &&
                                                    <div className={classes.dialogNoticeImage}
                                                        style={{ backgroundImage: "url('" + getImage(mainNotice.image) + "')", backgroundSize: "cover", backgroundPosition: mainNotice.position }}>
                                                    </div>
                                            }
                                        </label>
                                        <input id="addNoticeImage" className={ classes.hidden } type="file" onChange={ changeMainNoticePreview }/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <div className={ classes.divRow }>
                                            <TextField className={ classes.width100 } label="고유코드" variant="outlined" defaultValue={ isNull(mainNotice.code) }
                                                onBlur={changeMainNoticeValue('code')}/>
                                        </div>
                                        <div className={ classes.divRow }>
                                            <TextField className={ classes.width100 } label="순서" variant="outlined" defaultValue={ isNull(mainNotice.index) }
                                                onBlur={changeMainNoticeValue('index')}/>
                                        </div>
                                        <div className={ classes.divRow }>
                                            <TextField className={ classes.width100 } label="기간" variant="outlined" defaultValue={ isNull(mainNotice.expireDate) }
                                                onBlur={changeMainNoticeValue('expireDate')}/>
                                        </div>
                                        <div className={ classes.divRow }>
                                            <TextField className={ classes.width100 } label="그룹코드" helperText='입력시 해당 코드 입력 대상만 보입니다' variant="outlined" defaultValue={ isNull(mainNotice.groupCode) }
                                                onBlur={changeMainNoticeValue('groupCode')}/>
                                        </div>
                                        <div className={ [classes.divRow, classes.textRight].join(' ') }>
                                            <Button className={ classes.button } variant="contained" color="primary" onClick={ doDeleteMainNoticeDialog } style={{ marginRight: '16px' }}>삭제</Button>
                                            <Button className={ classes.button } variant="contained" color="primary" onClick={ doSaveMainNoticeDialog }>저장</Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                        </Dialog>
                }


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
                        </IconButton>,
                    ]}
                />
            </Box>
    );
};

export default AppManage;