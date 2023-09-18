import React from 'react';
import {  API_HOST } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import moment from 'moment';
import { Box, Typography, Grid, Container, Button, TextField,Select, MenuItem, FormControl,InputLabel,InputBase} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CssBaseline from "@material-ui/core/CssBaseline";
import Pagination from "material-ui-flat-pagination";

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

import { ContentState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';


const s3 = () => {
    let AWS = require('aws-sdk');
    AWS.config.region = 'ap-northeast-2'; // 리전
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'ap-northeast-2:ae0b1eaf-8307-4b6c-ac6d-80fe02aad0ee',
    });

    let s3 = new AWS.S3();
    return s3;
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

    width100: {
        width: '100%'
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

const isNull = (value, eventData = '') => {
    if (value === null || value === undefined) {
        return eventData;
    }
    else {
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
 * 이벤트 페이지 다이얼로그
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


function loadData(listRow = 10, listCount = 10) {
    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadEventBoardList",
            "method": "post",
            "params": {
                page:listRow,
                pageSize:listCount,
            }
        })
        .then(function (response) {
            resolve(response);
        });
    });
};


const EventList = () => {
    const [login, setLogin] = useGlobalState('login');
    const classes = useStyles();

    const [success, setSuccess] = React.useState(false);

    const [events, setEvents] = React.useState([]);
    const [eventData, setEvent] = React.useState(null);
    // const [totalEventLists, setTotalEventLists] = React.useState(0);
    const [page, setPage] = React.useState(0);
    const [listCount, setListCount] = React.useState(10);
    const [pageCount, setPageCount] = React.useState(10);
    const [totalPage, setTotalPage] = React.useState(10);
    const [eventType, setEventType] = React.useState("");
    // const [selectedGroupCode, setSelectedGroupCode] = React.useState(null);
    const [filterGroupCode, setFilterGroupCode] = React.useState(null);

    
    const [openDialog, setOpenDialog] = React.useState(false);

    
    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        loadData(page * listCount, listCount)
        .then((response) => {
            loadGroupCodeList();
            setData(response);
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    function setData(response, offset = page) {
        console.log("event response", response);
        let data = response.data.content;
    
        let totalCount = response.data.totalElements;
        let events = data;
        let eventsLength = events.length;
        let date = new Date();
        // let year = date.getFullYear() + "";
        // let yearD = year.substring(0,2);
        // console.log(year);
        // console.log(yearD);
        for (let i=0; i<eventsLength; i++) {
            var row = totalCount - (offset * listCount) - i;
            let startDate = events[i].startDate.substring(0,4) + "-" + events[i].startDate.substring(4,6) + "-" + events[i].startDate.substring(6,8);
            let endDate = events[i].endDate.substring(0,4) + "-" + events[i].endDate.substring(4,6) + "-" + events[i].endDate.substring(6,8);
            console.log(startDate);
            events[i].startDate = startDate;
            events[i].endDate = endDate;
            events[i].no = row;
        }
    
        setEvents(events);
        // setTotalevents(totalCount);

        let totalPgaePlus = (totalCount % listCount) > 0 ? 1 : 0;
        let totalPage = parseInt(totalCount / listCount) + totalPgaePlus;
        setTotalPage(totalPage);
    }

    function loadGroupCodeList(){
        return new Promise((resolve,reject) => {
            axios({
                "url":API_HOST + "/master/loadGroupCodeList",
                "method":"post"
            }).then(function(response){
                console.log("groupCodeList");
                console.log(response);
                let codeList = [];
                for(let i=0; i<response.data.length; i++){
                    codeList.push(response.data[i]['code']);
                }
                setFilterGroupCode(codeList);
                resolve(response);
            })
        })
    }

    function clickPagination(offset) {
        console.log("pagination", offset);
        setPage(offset);
        
        loadData(offset, listCount)
        .then((response) => {
            setData(response, offset);
        });
    }
    

    const changeEventType = (event) =>{
        setEventType(event.target.value);
    }

    // 이벤트 페이지 다이얼로그 시작
    const doOpenDialog = (id) => (event) => {
        let selected = events.find(item => {
            return item.id === id;
        })
        if (selected !== undefined && selected !== null) {
            if(selected.groupCode === null || selected.groupCode === ""){
                setEventType("NOMAL");
            }else{
                setEventType("GROUP");
                // setSelectedGroupCode(selected.groupCode);
            }

                setEvent(selected)
        } else {
            setEventType("");
            let newEvent = {
                id:"",
                title: "",
                contents: "",
                admin:"",
                startDate:"",
                endDate:"",
                thumbnail:"",
                groupCode:"",
            }
            setEvent(newEvent);
        }
        setOpenDialog(true);
    };
    const doCloseDialog = () => {
        // setProducts(cloneObject(originProducts));
        setOpenDialog(false);
    }
    const doSaveDialog = () => {
        let copyEvent = cloneObject(eventData);
        copyEvent.startDate = copyEvent.startDate.replace(/-/g,"") + "000000";
        copyEvent.endDate = copyEvent.endDate.replace(/-/g,"") + "000000";
        console.log(copyEvent);
        return new Promise((resolve,reject) => {

            let files = document.getElementById("thumbnailImage").files;
            let file = files[0];
            if (eventData.thumbnail.indexOf("blob:") >= 0) {
                let date = new Date();
                let titleP = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() );
                let fileNmString = file.name.replace(/(\s*)/g, "");
                let fileName = titleP + "_" + fileNmString;
                let imageObject = {}
        
                if(eventType === "GROUP"){
                    fileName = copyEvent.code + "_" + titleP + "_" + fileNmString;
                }
        
                let albumPhotosKey = encodeURIComponent("event") +"/";
                var photoKey = albumPhotosKey + fileName;
                
                 s3().upload({
                    Bucket: "timeorder",
                    Key: photoKey,
                    Body: file,
                    ACL: "public-read-write"
                },
                function(err, data) {
                    console.log(data);
                    if (err) {
                        console.log(err);
                    }
                    resolve(data.Location);
                });
            }else{
                resolve(copyEvent.thumbnail);
            }
        }).then(function(response){
            function saveFinish() {
                loadData(page * listCount, listCount)
                .then((response1) => {
                    setData(response1);
                    setOpenDialog(false);
        
                    openSnackbar();
                });
            }
            copyEvent.thumbnail = response;
            copyEvent.admin = "cjv6z5pjs0aay0734ge2kfk00";
            copyEvent.startDate = copyEvent.startDate.replace(/-/gi,"");
            copyEvent.endDate = copyEvent.endDate.replace(/-/gi,"");
            if(eventType === "GROUP"){
                copyEvent.groupCode = copyEvent.groupCode;
            }else{
                copyEvent.groupCode = "";
            }
            axios({
                "url":API_HOST + "/master/updateEventBoard",
                "method":"post",
                "data":copyEvent
            }).then(function(response){
                console.log(response);
                saveFinish();
            })
        })
        
        // // 1. 상품 수정
        // let qSaveEvent = 'mutation { ';            
        // if (copyEvent.id !== undefined) {
        //     qSaveEvent += ' updateEventBoard (' +
        //             'id: "' + copyEvent.id + '" ' +
        //             'title: """' + copyEvent.title + '""" ' +
        //             'contents: """' + copyEvent.contents + '""" ' +
        //         ') {' +
        //             'id ' +
        //         '}';
        // }
        // else {
        //     qSaveEvent += ' insertEventBoard (' +
        //             'title: """' + copyEvent.title + '""" ' +
        //             'contents: """' + copyEvent.contents + '""" ' +
        //             'type: 1 ' +
        //         ') {' +
        //             'id ' +
        //         '}';
        // }
        // qSaveEvent += ' }';
        
    
    }
    const doDeleteDialog = () => {
        // let qDeleteEvent = 'mutation { '; 
        // qDeleteEvent += ' deleteEventBoard (' +
        //         'id: "' + eventData.id + '" ' +
        //     ') {' +
        //         'id ' +
        //     '}';
        // qDeleteEvent += ' }';    
        
        new Promise((resolve, reject) => {
            axios({
                "url": API_HOST + "/master/deleteEventBoard",
                "method": "post",
                "params": {
                    eventBoardId: eventData.id
                }
            })
            .then(function (response) {
                resolve(response);
            });
        })
        .then((response) => {
            loadData(page * listCount, listCount)
            .then((response) => {
                setData(response);
                setOpenDialog(false);
    
                openSnackbar();
            });
        });
    }
    // 이벤트 페이지 다이얼로그 끝


    function toHtml(source) {
        let contentHTML = htmlToDraft(source)
        let state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap);
        return convertToRaw(state)
    }

    function pad2(n) { return n < 10 ? '0' + n : n }

    function uploadImageCallBack(file){
        let uploadedImages = [];
        let date = new Date();
        let titleP = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() );
        let fileNmString = file.name.replace(/(\s*)/g, "");
        let fileName = titleP + "_" + fileNmString;
        let imageObject = {}

        if(eventType === "GROUP"){
            fileName = eventData.code + "_" + titleP + "_" + fileNmString;
        }

        let albumPhotosKey = encodeURIComponent("event") +"/";
        var photoKey = albumPhotosKey + fileName;

        return new Promise((resolve,reject) => {
            s3().upload({
                Bucket: "timeorder",
                Key: photoKey,
                Body: file,
                ACL: "public-read-write"
            },
            function(err, data) {
                console.log(data);
                if (err) {
                    console.log(err);
                }
                // imageObject = {
                //     file: file,
                //     localSrc: data.Location,
                // }
            
                // uploadedImages.push(imageObject);
                resolve(data);
            });
        }).then(function(response){
            return new Promise(
                (resolve, reject) => {
                    resolve({ data: { link: response.Location } });
                }
            );
        })
        
    }

    const setEventDirect = (prop) => (event) => {
        setEvent({ ...eventData, [prop]: event.target.value });
    };

    const changeGroupCodeImage = (event,row,type) =>{
        let target = event.target.files[0];
        if (isNull(target)) {
            setEvent({ ...eventData, [type]: URL.createObjectURL(target)});
        }
    }


    const changeMainSlidePreview = (event) => {
        let target = event.target.files[0];
        if (isNull(target)) {
            // changeMainSlideValueDirect("image", URL.createObjectURL(target));
        }
    }

    function changeContent(edited) {
        let n = eventData;
        n.contents = draftToHtml(edited);
        setEvent(n)
    }
    
    
    const openSnackbar = () => {
        setSuccess(true);
    }    
    const closeSnackbar = () => {
        setSuccess(false);
    }


    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Grid container spacing={0}>
                    <Grid item xs={6}>
                        <Typography variant="h6" noWrap style={{ marginBottom: '16px'}}>
                            이벤트 페이지
                        </Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign:'right' }}>
                        <Button onClick={doSaveDialog} color="primary" variant="contained" onClick={ doOpenDialog(null) }>
                            새로 작성
                        </Button>
                    </Grid>
                </Grid>
                {/* <div className={classes.root}>
                    <Paper>
                        <Grid container>
                            <Grid item className={classes.paper}>
                                <SearchIcon />
                            </Grid>
                            <Grid item xs className={classes.input}>
                                <InputBase
                                    id="search"
                                    placeholder="가맹점명으로 검색이 가능합니다."
                                    inputProps={{ 'aria-label': 'naked' }}
                                    style={{ width:'100%' }}
                                    // onKeyUp={ doSearch }
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </div> */}

                <div>
                    <Paper className={classes.root}>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center" style={{ width: '75px' }}>no</StyledTableCell>
                                    <StyledTableCell align="center">제목</StyledTableCell>
                                    <StyledTableCell align="center">이벤트 타입</StyledTableCell>
                                    <StyledTableCell align="center">이벤트 기간</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '200px' }}>작성일</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    events.map(row => (
                                        <StyledTableRow key={ row.id }>
                                            <StyledTableCell component="th" scope="row" align="center">{ row.no }</StyledTableCell>
                                            <StyledTableCell><a onClick={ doOpenDialog(row.id) } style={{ cursor:"pointer" }}>{ row.title }</a></StyledTableCell>
                                            <StyledTableCell align="center">{row.groupCode === "" ? "일반 이벤트" : "그룹 이벤트" }</StyledTableCell>
                                            <StyledTableCell align="center"> {row.startDate + " ~ " + row.endDate}</StyledTableCell>
                                            <StyledTableCell align="center">{ moment(row.updatedAt).format("YYYY-MM-DD HH:mm:ss") }</StyledTableCell>
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

                {
                    eventData !== null &&      
                        <Dialog onClose={doCloseDialog} className="store-container" aria-labelledby="group-dialog-title" open={openDialog} fullWidth maxWidth="md">
                            <DialogTitle onClose={doCloseDialog}>이벤트 페이지 작성</DialogTitle>
                            <DialogContent dividers style={{padding:'10px'}}>
                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <div className={ classes.divRow }>
                                            <TextField className={ classes.width100 } label="제목" variant="outlined" defaultValue={ eventData.title }
                                                onBlur={ setEventDirect("title") }/>
                                        </div>
                                        <div className={ classes.divRow }>
                                            <FormControl variant="outlined" style={{width:"48%"}}>
                                                <TextField
                                                    id="date"
                                                    label="이벤트 시작일"
                                                    type="date"
                                                    defaultValue={ isNull(eventData.startDate) }
                                                    className={classes.textField}
                                                    InputLabelProps={{
                                                    shrink: true,
                                                    }}
                                                    onBlur={setEventDirect("startDate")}
                                                />
                                            </FormControl>
                                            <FormControl variant="outlined" style={{width:"4%"}}>
                                            </FormControl>
                                            <FormControl variant="outlined" style={{width:"48%"}}>
                                                <TextField
                                                    id="date"
                                                    label="이벤트 종료일"
                                                    type="date"
                                                    defaultValue={ isNull(eventData.endDate) }
                                                    className={classes.textField}
                                                    InputLabelProps={{
                                                    shrink: true,
                                                    }}
                                                    onBlur={setEventDirect("endDate")}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className={ classes.divRow }>
                                            <FormControl variant="outlined" className={classes.width100}>
                                                <InputLabel
                                                    id="firstDepositType">이벤트 타입</InputLabel>
                                                <Select
                                                    labelId="firstDepositType"
                                                    defaultValue={isNull(eventType)}
                                                    onChange={changeEventType}
                                                    labelWidth={75}
                                                >
                                                    <MenuItem value="NOMAL">일반 이벤트</MenuItem>
                                                    <MenuItem value="GROUP">그룹코드 이벤트</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        {
                                            eventType === "GROUP" &&
                                            <div className={ classes.divRow }>
                                                <Autocomplete
                                                    id="combo-box-demo"
                                                    options={filterGroupCode}
                                                    getOptionLabel={option => option }
                                                    renderInput={params => <TextField {...params} fullWidth label="그룹코드를 입력해주세요" variant="outlined"/>}
                                                    renderOption={option => option }
                                                    value={eventData.groupCode}
                                                    // onChange={(e,v) => { setSelectedGroupCode(v)}}
                                                    onBlur={setEventDirect("groupCode")}
                                                />
                                            </div>
                                        }
                                        {
                                            eventType !== "" &&
                                            <div>
                                                <div className={ classes.divRow }>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={3}>
                                                            <InputLabel>썸네일 이미지</InputLabel>
                                                            <div>
                                                                <label htmlFor={"thumbnailImage"}>
                                                                    {
                                                                        eventData.thumbnail === null &&
                                                                        <img src={ "/img/default-product.png" } style={{ maxWidth: '135px',  maxHeight: '240px', boxShadow:'0px 1px 4px #333' }} alt={ eventData.thumbnail } onError={(e) => { e.target.src="/img/default-product.png"}} />    
                                                                    }
                                                                    {
                                                                        eventData.thumbnail !== null &&
                                                                        <img src={ eventData.thumbnail } style={{ maxWidth: '135px',  maxHeight: '240px', boxShadow:'0px 1px 4px #333' }} alt={ eventData.thumbnail } onError={(e) => { e.target.src="/img/default-product.png"}} />
                                                                    }
                                                                </label>
                                                                <input type="file" id={ "thumbnailImage"} style={{visibility:"hidden"}} onChange={ (e) => changeGroupCodeImage(e, eventData.thumbnail,"thumbnail") }/>
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                </div>

                                                <Box className={ "text-area-container" } mt={1}>
                                                    <Editor
                                                        defaultContentState={ eventData.contents !== null ? toHtml(eventData.contents) : "" }
                                                        onContentStateChange={ changeContent }
                                                        toolbar={{ image: { 
                                                            uploadCallback: uploadImageCallBack,
                                                            previewImage: true,
                                                        }}}
                                                        // toolbar = {{
                                                        //     image: {
                                                        //         uploadCallback: uploadImageCallBack,
                                                        //         previewImage: true,
                                                        //         alt: { present: true, mandatory: false },
                                                        //         inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                                                        //       }
                                                        // }}
                                                        />
                                                </Box>
                                            </div>
                                        }
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                {
                                    eventData.id !== undefined &&
                                        <Button onClick={doDeleteDialog} color="primary" variant="outlined">
                                            삭제
                                        </Button>
                                }
                                <Button onClick={doSaveDialog} color="primary" variant="contained">
                                    저장
                                </Button>
                            </DialogActions>
                        </Dialog>
                }

                <Snackbar
                    open={success}
                    onClose={closeSnackbar}
                    autoHideDuration={3000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    message={<span id="message-id">이벤트 페이지 저장됨</span>}
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

export default EventList;