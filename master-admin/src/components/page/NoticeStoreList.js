import React from 'react';
import { API_HOST } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import moment from 'moment';
import { Box, Typography, Grid, InputBase, Tabs, Tab, Container, Button, TextField } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
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
import CreateIcon from '@material-ui/icons/Create';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';

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


function loadData(listRow = 10, listCount = 10) {
    let q = 'query { notices (where:"{\\"type\\":3}" orderBy: "createdAt_DESC", skip:' + listRow + ', first:' + listCount + ') { totalCount notices { id title contents createdAt updatedAt } } }'

    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadNoticeStoreList",
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


const NoticeStoreList = () => {
    const [login, setLogin] = useGlobalState('login');
    const classes = useStyles();
    
    const [success, setSuccess] = React.useState(false);

    const [notices, setNotices] = React.useState([]);
    const [notice, setNotice] = React.useState(null);
    // const [totalNotices, setTotalNotices] = React.useState(0);
    const [page, setPage] = React.useState(0);
    const [listCount, setListCount] = React.useState(10);
    const [pageCount, setPageCount] = React.useState(10);
    const [totalPage, setTotalPage] = React.useState(10);

    
    const [openDialog, setOpenDialog] = React.useState(false);

        
    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        loadData(page * listCount, listCount)
        .then((response) => {
            setData(response);
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    function setData(response) {
        console.log("NoticeStoreList response", response);
        let data = response.data;
    
        let totalCount = data.totalElements;
        let notices = data.content;
        let noticesLength = notices.length;
    
        for (let i=0; i<noticesLength; i++) {
            var row = totalCount - (page * listCount) - i;
            notices[i].no = row
        }
    
        setNotices(notices);
        // setTotalNotices(totalCount);

        let totalPgaePlus = (totalCount % listCount) > 0 ? 1 : 0;
        let totalPage = parseInt(totalCount / listCount) + totalPgaePlus;
        setTotalPage(totalPage);
    }

    function clickPagination(offset) {
        console.log("pagination", offset);
        setPage(offset);
        
        loadData(offset * listCount, listCount)
        .then((response) => {
            setData(response);
        });
    }
    

    // 공지사항 다이얼로그 시작
    const doOpenDialog = (id) => (event) => {
        let selected = notices.find(item => {
            return item.id === id;
        })
        if (selected !== undefined && selected !== null) {
            setNotice(selected)
        }
        else {
            let newNotice = {
                title: "",
                contents: "",
            }
            setNotice(newNotice);
        }
        setOpenDialog(true);
    };
    const doCloseDialog = () => {
        // setProducts(cloneObject(originProducts));
        setOpenDialog(false);
    }
    const doSaveDialog = () => {
        let copyNotice = cloneObject(notice);

        function saveFinish() {
            loadData(page * listCount, listCount)
            .then((response) => {
                setData(response);
                setOpenDialog(false);
    
                openSnackbar();
            });
        }
        
        // 1. 상품 수정
        let noticeParam = {};      
        if (copyNotice.id !== undefined) {
            // qSaveNotice += ' updateNotice (' +
            //         'id: "' + copyNotice.id + '" ' +
            //         'title: """' + copyNotice.title + '""" ' +
            //         'contents: """' + copyNotice.contents + '""" ' +
            //     ') {' +
            //         'id ' +
            //     '}';
            noticeParam = {
                id:copyNotice.id,
                title:copyNotice.title,
                type:copyNotice.type,
                contents:copyNotice.contents,
            }
        }
        else {
            noticeParam = {
                id:"",
                title:copyNotice.title,
                type:3,
                contents:copyNotice.contents,
            }
        }
        
        new Promise((resolve, reject) => {
            axios({
                "url": API_HOST + "/master/updateNotice",
                "method": "post",
                "data":noticeParam,
            })
            .then(function (response) {
                resolve(response);
            });
        })
        .then((response) => {
            saveFinish();
        });
    }
    const doDeleteDialog = () => {
        // let qDeleteNotice = 'mutation { '; 
        // qDeleteNotice += ' deleteNotice (' +
        //         'id: "' + notice.id + '" ' +
        //     ') {' +
        //         'id ' +
        //     '}';
        // qDeleteNotice += ' }';    
        
        new Promise((resolve, reject) => {
            axios({
                "url": API_HOST + "/master/deleteNotice",
                "method": "post",
                "params":{
                    noticeId:notice.id,
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
    // 공지사항 다이얼로그 끝
    
    
    function toHtml(source) {
        let contentHTML = htmlToDraft(source)
        let state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap)
        return convertToRaw(state)
    }
    

    const changeTitle = (prop) => (event) => {
        setNotice({ ...notice, [prop]: event.target.value });
    };

    function changeContent(edited) {
        let n = notice;
        n.contents = draftToHtml(edited);
        setNotice(n)
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
                            가맹점 공지사항
                        </Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign:'right' }}>
                        <Button onClick={doSaveDialog} color="primary" variant="contained" onClick={ doOpenDialog(null) }>
                            새로 작성
                        </Button>
                    </Grid>
                </Grid>

                <div>
                    <Paper className={classes.root}>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center" style={{ width: '75px' }}>no</StyledTableCell>
                                    <StyledTableCell align="center">제목</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '200px' }}>작성일</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    notices.map(row => (
                                        <StyledTableRow key={ row.id }>
                                            <StyledTableCell component="th" scope="row" align="center">{ row.no }</StyledTableCell>
                                            <StyledTableCell><a onClick={ doOpenDialog(row.id) } style={{ cursor:"pointer" }}>{ row.title }</a></StyledTableCell>
                                            <StyledTableCell align="center">{ moment(row.updatedAt).format("YYYY. MM. DD HH:mm:ss") }</StyledTableCell>
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
                    notice !== null &&      
                        <Dialog onClose={doCloseDialog} className="store-container" aria-labelledby="group-dialog-title" open={openDialog} fullWidth maxWidth="md">
                            <DialogTitle onClose={doCloseDialog}>공지사항 작성</DialogTitle>
                            <DialogContent dividers style={{padding:'10px'}}>
                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <TextField className={ classes.width100 } label="제목" variant="outlined" defaultValue={ notice.title }
                                            onBlur={ changeTitle("title") }/>
                                        <Box className={ "text-area-container" } mt={1}>
                                            <Editor
                                                defaultContentState={ toHtml(notice.contents) }
                                                onContentStateChange={ changeContent }
                                                />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                {
                                    notice.id !== undefined &&
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
            </Box>
    );
};

export default NoticeStoreList;