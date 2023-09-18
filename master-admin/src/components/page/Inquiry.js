import React from 'react';
import { API_HOST } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, InputBase, Tabs, Tab, Container, Button, TextField,InputLabel,FormControl,Select,MenuItem} from '@material-ui/core';
import { SRLWrapper } from "simple-react-lightbox";
import SimpleReactLightbox from 'simple-react-lightbox'
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
        '& .MuiInputBase-input': {
            paddingTop: theme.spacing(1.5),
            paddingBottom: theme.spacing(1.5)
        }
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
 * 공지사항 다이얼로그
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


function loadData(listRow = 10, listCount = 10, search) {
    search = search ? search : ""
    // let q = 'query { inquiries (where:"{\\"type\\":\\"00\\", \\"admin\\": null, \\"OR\\": [{\\"title_contains\\": \\"' + search + '\\"}, {\\"user\\": { \\"name_contains\\": \\"' + search + '\\"} } ] }" orderBy: "createdAt_DESC", skip:' + listRow + ', first:' + listCount + ') { totalCount inquiries { id title contents createdAt status reply { id title contents } user { id name orders { status payMethod } } } } }'

    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadInquiryList",
            "method": "post",
            "params": {
                search: search,
                page:listRow,
                pageSize:listCount,
            }
        })
        .then(function (response) {
            console.log("@@@@@@@@@@@@@@@@@");
            console.log(response);
            resolve(response);
        });
    });
};

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

function getOrderCount(orders) {
    console.log(orders);
    let ordersSize = orders.length;
    let ordersCount = 0;
    for (let i=0; i<ordersSize; i++) {
        if (orders[i].payMethod !== "00" && orders[i].status !== "10") {
            ordersCount++;
        }
    }

    return ordersCount;
}

function getInquiryStatus(reply) {
    if (reply === null) {
        return "답변대기";
    }
    else {
        return reply.id === undefined ? "답변대기" : "답변완료"
    } 
}


const Inquiry = () => {
    const [login, setLogin] = useGlobalState('login');
    const classes = useStyles();

    const [success, setSuccess] = React.useState(false);

    const [inquiries, setInquiries] = React.useState([]);
    const [inquiryImages,setInquiryImages] = React.useState([]);
    const [inquiry, setInquiry] = React.useState(null);
    const [inquiryImage,setInquiryImage] = React.useState(null);
    // const [totalInquiries, setTotalInquiries] = React.useState(0);
    const [page, setPage] = React.useState(0);
    const [listCount, setListCount] = React.useState(10);
    const [pageCount, setPageCount] = React.useState(10);
    const [totalPage, setTotalPage] = React.useState(10);
    const [search, setSearch] = React.useState("");

    
    const [openDialog, setOpenDialog] = React.useState(false);

    
    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        loadData(page * listCount, listCount)
        .then((response) => {
            loadInquiryImage().then((response) => {
                setInquiryImages(response.data);
            });
            setData(response);
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    function setData(response, offset = page) {
        console.log("Inquiry response", response);
        let data = response.data.content;
    
        let totalCount = 0;
        if(data.length > 0){
            totalCount = response.data.totalElements;
        }
        let inquiries = data;
        let inquiriesLength = inquiries.length;
    
        for (let i=0; i<inquiriesLength; i++) {
            var row = totalCount - (offset * listCount) - i;
            inquiries[i].no = row
        }
    
        setInquiries(inquiries);
        // setTotalInquiries(totalCount);

        let totalPgaePlus = (totalCount % listCount) > 0 ? 1 : 0;
        let totalPage = parseInt(totalCount / listCount) + totalPgaePlus;
        setTotalPage(totalPage);
    }

    function clickPagination(offset) {
        console.log("pagination", offset);
        setPage(offset);
        
        loadData(offset , listCount)
        .then((response) => {
            setData(response, offset);
        });
    }
    

    // 공지사항 다이얼로그 시작
    const doOpenDialog = (id) => (event) => {
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
        setOpenDialog(true);
    };
    const doCloseDialog = () => {
        // setProducts(cloneObject(originProducts));
        setOpenDialog(false);
    }
    const doSaveDialog = () => {
        let copyInquiry = cloneObject(inquiry);

        function saveFinish() {
            loadData(page * listCount, listCount)
            .then((response) => {
                setData(response);
                setOpenDialog(false);
    
                openSnackbar();
            });
        }
        
        new Promise((resolve, reject) => {
            copyInquiry.reply.admin = login.id;
            console.log(copyInquiry);
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
                    copyInquiry.user = copyInquiry.userInfo.id;
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
    // const doDeleteDialog = () => {
    //     let qDeleteInquiry = 'mutation { '; 
    //     qDeleteInquiry += ' deleteInquiry (' +
    //             'id: "' + inquiry.id + '" ' +
    //         ') {' +
    //             'id ' +
    //         '}';
    //     qDeleteInquiry += ' }';    
        
    //     new Promise((resolve, reject) => {
    //         axios({
    //             "url": ,
    //             "method": "post",
    //             "data": {
    //                 query: qDeleteInquiry
    //             }
    //         })
    //         .then(function (response) {
    //             resolve(response);
    //         });
    //     })
    //     .then((response) => {
    //         loadData(page * listCount, listCount)
    //         .then((response) => {
    //             setData(response);
    //             setOpenDialog(false);
    
    //             openSnackbar();
    //         });
    //     });
    // }
    // 공지사항 다이얼로그 끝


    function toHtml(source) {
        let contentHTML = htmlToDraft(source)
        let state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap)
        return convertToRaw(state)
    }

    
    const changeTitle = (prop) => (event) => {
        setInquiry({ ...inquiry, [prop]: event.target.value });
    };

    function changeContent(edited) {
        let n = inquiry;
        n.reply.contents = draftToHtml(edited);
        setInquiry(n)
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
                            1:1 문의
                        </Typography>
                    </Grid>
                </Grid>

                <div>
                    <Paper className={classes.root}>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center" style={{ width: '75px' }}>no</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '90px' }}>답변상태</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '125px' }}>닉네임</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '90px' }}>구매건수</StyledTableCell>
                                    <StyledTableCell align="center">제목</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '200px' }}>작성일</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    inquiries.map(row => (
                                        <StyledTableRow key={ row.id }>
                                            <StyledTableCell component="th" scope="row" align="center">{ row.no }</StyledTableCell>
                                            <StyledTableCell>{ getInquiryStatus(row.reply) }</StyledTableCell>
                                            <StyledTableCell>
                                                {
                                                    row.user !== null &&
                                                        <Link to={ '/User/' + row.userInfo.id }>{ row.userInfo.name }</Link>
                                                }
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                {
                                                    row.user !== null &&
                                                        numeral((row.userInfo.orderCount)).format('0,0')
                                                }
                                                </StyledTableCell>
                                            <StyledTableCell><a onClick={ doOpenDialog(row.id) } style={{ cursor:"pointer" }}>{ row.title }</a></StyledTableCell>
                                            <StyledTableCell align="center">{ moment(row.createdAt).format("YYYY. MM. DD HH:mm:ss") }</StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </Paper>
                </div>

                <div>
                    <CssBaseline />
                    <Box className={classes.paginationRow}>
                        <Box display="flex" textAlign="left"  alignItems="center">
                            <Box flexShrink={1}>
                                <TextField className={classes.input} variant="outlined" defaultValue={ search }
                                    style={{ background: "#fff" }}
                                    placeholder="이름 또는 제목을 입력해주세요"
                                    onBlur={ (e) => setSearch(e.target.value)}
                                    onKeyUp={ (e) => {
                                        if (e.keyCode === 13) {
                                            loadData(page * listCount, listCount, e.target.value)
                                            .then((response) => {
                                                setData(response, page);
                                            });
                                        }
                                    } }/>
                            </Box>
                            <Box flexGrow={1} textAlign="right">
                                <Pagination
                                    limit={1}
                                    offset={page}      // Row Number Skip offset
                                    total={totalPage}
                                    onClick={(e, offset) => clickPagination(offset)}
                                    size="large"
                                />
                            </Box>
                        </Box>
                    </Box>
                </div>

                {
                    inquiry !== null &&      
                        <Dialog onClose={doCloseDialog} className="store-container" aria-labelledby="group-dialog-title" open={openDialog} fullWidth maxWidth="lg">
                            <DialogTitle onClose={doCloseDialog}>1:1문의 답변 작성</DialogTitle>
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
                                        <TextField style={{width:"85%"}} value={ "답변 작성" }                                       
                                            InputProps={{ readOnly: true }} variant="outlined" />

                                        <FormControl variant="outlined"  style={{width:"15%"}}>
                                            <InputLabel
                                                id="firstDepositType">답변 상태</InputLabel>
                                            <Select
                                                labelId="firstDepositType"
                                                defaultValue={inquiry.status}
                                                onBlur={changeTitle('status')}
                                                labelWidth={75}
                                            >
                                                <MenuItem value="0">문의 신청</MenuItem>
                                                <MenuItem value="1">확인중</MenuItem>
                                                <MenuItem value="2">답변완료</MenuItem>
                                            </Select>
                                        </FormControl>

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
                                    // inquiry.id !== undefined &&
                                    //     <Button onClick={doDeleteDialog} color="primary" variant="outlined">
                                    //         삭제
                                    //     </Button>
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
                    message={<span id="message-id">답변 저장됨</span>}
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

export default Inquiry;