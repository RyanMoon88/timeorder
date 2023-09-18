import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { HOST, API_SERVER_URL, API_HOST } from './constants';
import { Route, Switch, Link, useHistory } from 'react-router-dom';
import Draggable from 'react-draggable';
import { useGlobalState } from './state';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Avatar, Button, Paper, Grid, Box, List, ListItem, ListItemIcon, ListItemText, Collapse, Backdrop, CircularProgress, SwipeableDrawer } from '@material-ui/core';
import { Dashboard, Person, Store, Title, Payment, Dialpad, Forum, Assessment, ConfirmationNumber, PowerSettingsNew, Devices, PhoneIphone } from '@material-ui/icons';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import { createMuiTheme, withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import SockJsClient from 'react-stomp';

import ContentEditable from 'react-contenteditable'
import FaceIcon from '@material-ui/icons/Face';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import StrikethroughSIcon from '@material-ui/icons/StrikethroughS';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import MinimizeIcon from '@material-ui/icons/Minimize';
import CloseIcon from '@material-ui/icons/Close';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import InfoIcon from '@material-ui/icons/Info';
import MenuIcon from '@material-ui/icons/Menu';

import Login from 'components/page/Login';
import PageDashboard from 'components/page/Dashboard';
import UserList from 'components/page/UserList';
import User from 'components/page/User';
import SendMessage from 'components/page/SendMessage';
import StoreList from 'components/page/StoreList';
import PageStore from 'components/page/Store';
import StoreMeta from 'components/page/StoreMeta';
import StoreGroupList from 'components/page/StoreGroupList';
import StoreGroup from 'components/page/StoreGroup';
import StoreGroupCodeList from 'components/page/StoreGroupCodeList';
import StoreGroupCodeListNew from 'components/page/StoreGroupCodeListNew';
import AwsS3 from 'components/page/AwsS3';
import TcashList from 'components/page/TcashList';
import TcashListGilCash from 'components/page/TcashListGilCash';
import OrderList from 'components/page/OrderList';
import CalculatorAll from 'components/page/CalculatorAll';
import Calculator from 'components/page/Calculator';
import CalculatorDetail from 'components/page/CalculatorDetail';
import NoticeStoreList from 'components/page/NoticeStoreList';
import NoticeList from 'components/page/NoticeList';
import Inquiry from 'components/page/Inquiry';
import InquiryRequestExist from 'components/page/InquiryRequestExist';
import Here from 'components/page/Here';
import QuizList from 'components/page/QuizList';
import Quiz from 'components/page/Quiz';
import EventList from 'components/page/EventList';
import StatsChart from 'components/page/StatsChart';
import StatsMonthly from 'components/page/StatsMonthly';
import StatsDaily from 'components/page/StatsDaily';
import CouponList from 'components/page/CouponList';
import DeviceList from 'components/page/DeviceList';
import AdminLog from 'components/page/AdminLog';
import AppManage from 'components/page/AppManage';


const drawerWidth = 240;

const muiTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#e2422a',
            light: '#fd7c68',
            dark: '#333333'
        }
    },
    typography: {
        fontSize: 12
    }
});

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    checklist: {
        position: 'fixed',
        top: '80px',
        right: '20px',
        color: '#000000'
    },
    drawer: {
        [theme.breakpoints.up('lg')]: {
            width: drawerWidth,
            flexShrink: 0,
        }
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('lg')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        background: '#333333',
        color: '#c2c2c2'
    },
    logDrawerPaper: {
        width: 360,
        background: '#efefef',
        color: '#333333',
        paddingTop: 8
    },
    logDrawerPaperItem: {
        marginTop: 0,
        marginLeft: 12,
        marginRight: 12,
        marginBottom: 12,
        padding: 12
    },
    login: {
        flexGrow: 1
    },
    title: {
        flexGrow: 1
    },
    content: {
        maxWidth: '100%',
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    active: {
        background: '#222222'
    },
    nested: {
        paddingLeft: theme.spacing(8)
    },
    avatar: {
        backgroundColor: "#999999",
    },
}))

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


// Notification API
window.onload = function () {
    if (window.Notification) {
        if (Notification.permission !== "granted") {
            Notification.requestPermission((status) => {
                if (status === "granted") {
                    // setTimeout(function () {
                    //     var notification = new Notification('타임오더 푸시 테스트', {
                    //         icon: HOST + '/favicon.png',
                    //         body: '타임오더 푸시 테스트 text',
                    //     });
                    // }, 5000);
        
                    // setInterval(function () {
                    //     console.log(Notification.permission);
                    // }, 10000);
                }
            });
        }
        else {
            // setTimeout(function () {
            //     var notification = new Notification('타임오더 푸시 테스트', {
            //         icon: HOST + '/favicon.png',
            //         body: '타임오더 푸시 테스트 text',
            //     });
            // }, 5000);
            // setInterval(function () {
            //     console.log(Notification.permission);
            // }, 10000);
        }
    }
}

function showNotification(text) {
    var notification = new Notification('타임오더 알림', {
        icon: HOST + '/favicon.png',
        body: text,
    });
}

var clientRef = null;

const App = (props) => {
    const [login, setLogin] = useGlobalState('login');
    const [backdrop, setBackdrop] = useGlobalState('backdrop');
    const [errorDialog, setErrorDialog] = useGlobalState('errorDialog');
    const [errorMessage, setErrorMessage] = useGlobalState('errorMessage');


    const { container } = props;

    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [logOpen, setLogOpen] = React.useState(false);
    const [adminLogList, setAdminLogList] = React.useState([]);
    const [logPage, setLogPage] = React.useState(0);
    const [maximize, setMaximize] = React.useState(true);
    const [stickyNote, setStickyNote] = React.useState(false);
    const [stickyNoteMemo, setStickyNoteMemo] = React.useState("");
    const [stickyNotePosition, setStickyNotePosition] = React.useState({x: 30, y:30});
    const [open, setOpen] = React.useState([
        true, false, false, false, false, false, false, false, false, false, false
    ]);

    const checkLogin = () => {
        let localStorageAdmin = localStorage.getItem("timeOrderAdminInfo");
        if (localStorageAdmin !== null && localStorageAdmin !== undefined && localStorageAdmin !== "") {
            setLogin(JSON.parse(localStorageAdmin));
            if (window.location.pathname === "/") {
                history.push("/Dashboard");
            }
            else {
                history.push(window.location.pathname);
            }
        }
        else {
            history.push("/");
        }
    }

    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        checkLogin();
        try {
            let memo = JSON.parse(localStorage.getItem("timeOrderAdminMyMemo"));
            if (memo.html !== undefined) {
                setStickyNotePosition({x: memo.x, y: memo.y})
                setStickyNoteMemo(memo.html)
            }

            // setTimeout(() => {
            //     console.log(clientRef);
            //     clientRef.sendMessage("/app/hello", JSON.stringify({"name": "park"}));
            // }, 2000);
        }
        catch (e) {
            
        }

        return () => { clientRef !== null && clientRef.disconnect() };
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogDrawerToggle = (id) => {
        if (logOpen) {
            setAdminLogList([]);
            setLogPage(0);
        }
        else {
            new Promise((resolve, reject) => {
                axios({
                    "url": API_HOST + "/master/getAdminLogList?targetId=" + id + "&page=" + logPage,
                    "method": "post"
                })
                .then(function (response) {
                    resolve(response);
                    console.log(response);
                    setAdminLogList(response.data);
                });
            });
        }
        setLogOpen(!logOpen);
    };

    const toggleCollpase = (index) => {
        var tmpOpen = [ false, false, false, false, false, false, false, false, false, false, false ];
        if (!open[index]) {
            tmpOpen[index] = true;
            setOpen(tmpOpen);
        }
    }

    const doLogout = () => {
        setLogin(null);
        localStorage.removeItem("timeOrderAdminInfo");
        history.push("/");
    }

    const drawer = (
        <div>
            <div className={classes.toolbar} />
            <div style={{ padding:'12px' }}>
                <Grid container alignItems="center">
                    <Grid item>
                        <Avatar className={classes.avatar} style={{ marginRight:'16px' }}>
                            <FaceIcon />
                        </Avatar>
                    </Grid>
                    <Grid item>
                        { login !== null && login.name}
                    </Grid>
                </Grid>
            </div>
            <Divider />
            <List style={{ paddingTop: '0px' }}>
                <Link to={"/Dashboard"}>
                    <ListItem button key="0" className={open[0] ? classes.active : ''} onClick={ () => toggleCollpase(0) }>
                        <ListItemIcon><Dashboard style={{ color: '#c2c2c2' }}/></ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                </Link>

                <ListItem button key="1" className={open[1] ? classes.active : ''} onClick={ () => toggleCollpase(1) }>
                    <ListItemIcon><Person style={{ color: '#c2c2c2' }}/></ListItemIcon>
                    <ListItemText primary="사용자 관리" />
                    {open[1] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open[1]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Link to={"/UserList"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="사용자 목록" disableTypography/>
                            </ListItem>
                        </Link>
                        <Link to={"/SendMessage"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="메세지 보내기" disableTypography/>
                            </ListItem>
                        </Link>
                    </List>
                </Collapse>

                <ListItem button key="2" className={open[2] ? classes.active : ''} onClick={ () => toggleCollpase(2) }>
                    <ListItemIcon><Store style={{ color: '#c2c2c2' }}/></ListItemIcon>
                    <ListItemText primary="가맹점 관리" />
                    {open[2] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open[2]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Link to={"/StoreList"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="가맹점 목록" disableTypography/>
                            </ListItem>
                        </Link>
                        <Link to={"/StoreGroupList"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="프렌차이즈 목록" disableTypography/>
                            </ListItem>
                        </Link>
                        <Link to={"/StoreGroupCodeList"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="그룹코드별 목록(구)" disableTypography/>
                            </ListItem>
                        </Link>
                        <Link to={"/StoreGroupCodeListNew"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="그룹코드별 목록(신)" disableTypography/>
                            </ListItem>
                        </Link>
                        <Link to={"/AwsS3"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="S3 이미지 설정" disableTypography/>
                            </ListItem>
                        </Link>
                    </List>
                </Collapse>

                <ListItem button key="3" className={open[3] ? classes.active : ''} onClick={ () => toggleCollpase(3) }>
                    <ListItemIcon><Title style={{ color: '#c2c2c2' }}/></ListItemIcon>
                    <ListItemText primary="Tcash 관리" />
                    {open[3] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open[3]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Link to={"/TcashList"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary="Tcash 내역" />
                            </ListItem>
                        </Link>
                        <Link to={"/TcashListGilCash"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText primary="길캐시 내역" />
                            </ListItem>
                        </Link>
                    </List>
                </Collapse>

                <Link to={"/OrderList"}>
                    <ListItem button key="4" className={open[4] ? classes.active : ''} onClick={ () => toggleCollpase(4) }>
                        <ListItemIcon><Payment style={{ color: '#c2c2c2' }}/></ListItemIcon>
                        <ListItemText primary="주문 관리" />
                    </ListItem>
                </Link>

                <ListItem button key="5" className={open[5] ? classes.active : ''} onClick={ () => toggleCollpase(5) }>
                    <ListItemIcon><Dialpad style={{ color: '#c2c2c2' }}/></ListItemIcon>
                    <ListItemText primary="정산 관리" />
                    {open[5] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open[5]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Link to={"/CalculatorAll"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="전체" disableTypography/>
                            </ListItem>
                        </Link>
                        <Link to={"/Calculator"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="매장별" disableTypography/>
                            </ListItem>
                        </Link>
                        <Link to={"/CalculatorDetail"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="매장별(상세)" disableTypography/>
                            </ListItem>
                        </Link>
                    </List>
                </Collapse>

                <ListItem button key="6" className={open[6] ? classes.active : ''} onClick={ () => toggleCollpase(6) }>
                    <ListItemIcon><Forum style={{ color: '#c2c2c2' }}/></ListItemIcon>
                    <ListItemText primary="커뮤니티 관리" />
                    {open[6] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open[6]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Link to={"/NoticeStoreList"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="가맹점 공지사항" disableTypography/>
                            </ListItem>
                        </Link>
                        <Link to={"/NoticeList"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="공지사항" disableTypography/>
                            </ListItem>
                        </Link>
                        <Link to={"/Inquiry"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="1:1 문의" disableTypography/>
                            </ListItem>
                        </Link>
                        <Link to={"/InquiryRequestExist"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="이전신청" disableTypography/>
                            </ListItem>
                        </Link>
                        <Link to={"/Here"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="여기도요!" disableTypography/>
                            </ListItem>
                        </Link>
                        <Link to={"/QuizList"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="타임퀴즈" disableTypography/>
                            </ListItem>
                        </Link>
                        <Link to={"/EventList"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="이벤트" disableTypography/>
                            </ListItem>
                        </Link>
                    </List>
                </Collapse>

                <ListItem button key="7" className={open[7] ? classes.active : ''} onClick={ () => toggleCollpase(7) }>
                    <ListItemIcon><Assessment style={{ color: '#c2c2c2' }}/></ListItemIcon>
                    <ListItemText primary="통계" />
                    {open[7] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open[7]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Link to={"/StatsChart"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="일주일 통계" disableTypography/>
                            </ListItem>
                        </Link>
                        <Link to={"/StatsMonthly"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="월별 통계" disableTypography/>
                            </ListItem>
                        </Link>
                        <Link to={"/StatsDaily"}>
                            <ListItem button className={classes.nested}>
                                <ListItemText secondary="일별 통계" disableTypography/>
                            </ListItem>
                        </Link>
                    </List>
                </Collapse>

                <Link to={"/CouponList"}>
                    <ListItem button key="8" className={open[8] ? classes.active : ''} onClick={ () => toggleCollpase(8) }>
                        <ListItemIcon><ConfirmationNumber style={{ color: '#c2c2c2' }}/></ListItemIcon>
                        <ListItemText primary="쿠폰 관리" />
                    </ListItem>
                </Link>

                <Link to={"/DeviceList"}>
                    <ListItem button key="9" className={open[9] ? classes.active : ''} onClick={ () => toggleCollpase(9) }>
                        <ListItemIcon><Devices style={{ color: '#c2c2c2' }}/></ListItemIcon>
                        <ListItemText primary="기기 관리" />
                    </ListItem>
                </Link>

                <Link to={"/AppManage"}>
                    <ListItem button key="10" className={open[10] ? classes.active : ''} onClick={ () => toggleCollpase(10) }>
                        <ListItemIcon><PhoneIphone style={{ color: '#c2c2c2' }}/></ListItemIcon>
                        <ListItemText primary="앱 관리" />
                    </ListItem>
                </Link>

                <Link>
                    <ListItem button key="11" className={open[11] ? classes.active : ''} onClick={ () => toggleCollpase(11) }>
                        <ListItemIcon><SpeakerNotesIcon style={{ color: '#c2c2c2' }}/></ListItemIcon>
                        <ListItemText primary="관리자 로그" />
                    </ListItem>
                </Link>

                <ListItem button key="12" onClick={ doLogout }>
                    <ListItemIcon><PowerSettingsNew style={{ color: '#c2c2c2' }}/></ListItemIcon>
                    <ListItemText primary="로그아웃" />
                </ListItem>
            </List>
        </div>
    );

    
    const logDrawer = (
        <div>
            <div className={classes.toolbar} />
        </div>
    );

    function fontBold() {
        document.execCommand('bold');
    }
    function fontItalic() {
        document.execCommand('italic');
    }
    function fontUnderline() {
        document.execCommand('underline');
    }
    function fontStrikeThrough() {
        document.execCommand('strikethrough');
    }
    function fontMakeList() {
        document.execCommand('InsertUnorderedList');
        /*
        //선택 영역 찾기
        var selected = window.getSelection().getRangeAt(0);
     
        //b 태그 생성
        var nodeParent = document.createElement('ul');
        var node = document.createElement('li');
        //b 태그 내부에 선택영역의 text 넣기
        node.innerText = selected;
        nodeParent.appendChild(node);

        console.log(node);
     
        //선택영역을 지우고 생성한 b태그를 넣어 바꾸기
        selected.deleteContents();
        selected.insertNode(nodeParent);
        */
    }

    function doToggleMaximize() {
        setMaximize(!maximize);
    }

    function doToggleStickyNote() {
        setStickyNote(!stickyNote);
    }
    function doOpenStickyNote() {
        setStickyNote(true);
    }
    function doCloseStickyNote() {
        setStickyNote(false);
    }
    function changeStickyNote(event) {
        let html = event.currentTarget.innerHTML;
        let x = stickyNotePosition.x, y = stickyNotePosition.y;
        setStickyNoteMemo(html);
        setLocalStorageStickyNote(x, y, html);
    }
    function detectStickyNoteKeyUp(event) {
        if (event.keyCode === 13) {
            let html = event.currentTarget.innerHTML;
            let x = stickyNotePosition.x, y = stickyNotePosition.y;
            setStickyNoteMemo(html);
            setLocalStorageStickyNote(x, y, html);
        }
    }
    function changeStickyNotePosition(event) {
        console.log(event);
        let html = stickyNoteMemo;
        let x = event.clientX - event.offsetX, y = event.clientY - event.offsetY;
        setStickyNotePosition({x, y})
        setLocalStorageStickyNote(x, y, html);
    }
    function setLocalStorageStickyNote(x, y, html) {
        let memo = {
            x,
            y,
            html
        }

        localStorage.setItem(
            "timeOrderAdminMyMemo",
            JSON.stringify(memo)
        )
    }
    
    
    // 에러 다이얼로그 시작
    const doOpenErrorDialog = () => {
        setErrorDialog(true);
    }
    const doCloseErrorDialog = () => {
        setErrorDialog(false);
    }
    // 에러 다이얼로그 끝
    


    return (
        <ThemeProvider theme={muiTheme}>
            <SnackbarProvider maxSnack={5}>
                <CssBaseline />
                <Backdrop open={backdrop} style={{ zIndex: "9999", color:"#ffffff" }}>
                    <CircularProgress color="inherit" />
                    <Typography variant="subtitle1" style={{ marginTop:'4px', marginLeft:'16px' }}>
                        데이터를 불러오는 중입니다
                    </Typography>
                </Backdrop>
                {
                    stickyNote &&
                        <Draggable defaultPosition={{ x:stickyNotePosition.x, y:stickyNotePosition.y }} handle="h6"
                            onStop={ changeStickyNotePosition }>
                            <Paper square elevation={3} style={{ width:'320px', background:'#fff9a3', position:"fixed", zIndex:"9999" }}>
                                <Grid container spacing={1} justify="flex-end" alignItems="flex-start" style={{ padding:'8px 10px' }}>
                                    <Grid item style={{ flexGrow:1 }}>
                                        <Typography variant="subtitle1">
                                            <b>스티커 메모</b>
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <MinimizeIcon onClick={ doToggleMaximize } />
                                    </Grid>
                                    <Grid item>
                                        <CloseIcon onClick={ doCloseStickyNote } />
                                    </Grid>
                                </Grid>
                                {
                                    maximize &&
                                        <div>
                                            <div className="sticky-note-tools" style={{padding:'4px 8px 0px'}}>
                                                <FormatBoldIcon onClick={ fontBold }/>
                                                <FormatItalicIcon onClick={ fontItalic } />
                                                <FormatUnderlinedIcon onClick={ fontUnderline } />
                                                <StrikethroughSIcon onClick={ fontStrikeThrough } />
                                                <FormatListBulletedIcon onClick={ fontMakeList } />
                                            </div>
                                            <ContentEditable className="sticky-note-contents"
                                                html={
                                                    stickyNoteMemo
                                                }
                                                style={{height:'500px', overflow:'auto', padding: '10px'}}
                                                onBlur={ changeStickyNote }
                                                onKeyUp={ detectStickyNoteKeyUp }>
                                            </ContentEditable>
                                        </div>
                                }
                            </Paper>
                        </Draggable>
                }
                <div className={ classes.root}>
                    {
                        login !== null &&
                            <div>
                                <AppBar position="fixed" className={classes.appBar}>
                                    <Toolbar>
                                        <MenuIcon className={classes.menuButton} onClick={handleDrawerToggle}/>
                                        <Typography variant="h6" noWrap className={classes.title}>
                                            Timeorder Administrator
                                        </Typography>
                                        {
                                            ( window.location.pathname.indexOf("/Store/") === 0 ||
                                            window.location.pathname.indexOf("/User/") === 0 ) &&
                                                <Button color="inherit">
                                                    <AccessTimeIcon onClick={ () => {
                                                        let cuid = ""
                                                        let pathname = window.location.pathname.indexOf("/Store/") ? "Store" : "User";
                                                        let index = window.location.pathname.lastIndexOf("/");
                                                        cuid = window.location.pathname.substr(index + 1);
                                                        handleLogDrawerToggle(cuid);
                                                        // alert(cuid);
                                                    } }/>
                                                </Button>
                                        }
                                        <Button color="inherit">
                                            <BookmarkBorderIcon onClick={ doOpenStickyNote }/>
                                        </Button>
                                    </Toolbar>
                                </AppBar>
                                <nav className={classes.drawer} aria-label="mailbox folders">
                                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                                    <Hidden mdUp implementation="css">
                                        <SwipeableDrawer
                                            anchor="left"
                                            open={mobileOpen}
                                            onOpen={handleDrawerToggle}
                                            onClose={handleDrawerToggle}
                                            classes={{
                                                paper: classes.drawerPaper,
                                            }}
                                        >
                                            {drawer}
                                        </SwipeableDrawer>
                                    </Hidden>
                                    <Hidden mdDown implementation="css">
                                        <Drawer
                                            classes={{
                                                paper: classes.drawerPaper,
                                            }}
                                            variant="permanent"
                                            open
                                        >
                                            {drawer}
                                        </Drawer>
                                        <Drawer
                                            classes={{
                                                paper: classes.logDrawerPaper,
                                            }}
                                            anchor="right"
                                            open={logOpen}
                                            onOpen={handleLogDrawerToggle}
                                            onClose={handleLogDrawerToggle}
                                        >
                                            {
                                                adminLogList.map((row, index) => (
                                                    <Paper key={index} className={ classes.logDrawerPaperItem } square>
                                                        <Box><b>{ row.admin.name }</b></Box>
                                                        <Box style={{ color: '#777' }}><small>{ moment(row.createdAt).format("YYYY년 MM월 DD일 HH시 mm분 ss초") }</small></Box>
                                                        <Box mt={1}>{ row.content }</Box>
                                                    </Paper>
                                                ))
                                            }
                                        </Drawer>
                                    </Hidden>
                                </nav>
                            </div>
                    }
                    <main className={ login !== null ? classes.content : classes.login }>
                        <div className={classes.toolbar}>
                            <Switch>
                                {/* { <Route component={NotFound}/> } */}
                                { <Route exact path="/" component={Login}/> }
                                { <Route path="/Dashboard" component={PageDashboard}/> }
                                { <Route path="/UserList" component={UserList}/> }
                                { <Route path="/User/:id" component={User}/> }
                                { <Route path="/SendMessage" component={SendMessage}/> }
                                { <Route path="/StoreList" component={StoreList}/> }
                                { <Route path="/Store/:id" component={PageStore}/> }
                                { <Route path="/StoreMeta/:id" component={StoreMeta}/> }
                                { <Route path="/StoreGroupList" component={StoreGroupList}/> }
                                { <Route path="/StoreGroup/:id" component={StoreGroup}/> }
                                { <Route path="/StoreGroupCodeList" component={StoreGroupCodeList}/> }
                                { <Route path="/StoreGroupCodeListNew" component={StoreGroupCodeListNew}/> }
                                { <Route path="/AwsS3" component={AwsS3}/> }
                                { <Route path="/TcashList" component={TcashList}/> }
                                { <Route path="/TcashListGilCash" component={TcashListGilCash}/> }
                                { <Route path="/OrderList/:startDate?/:endDate?/:device?" component={OrderList}/> }
                                { <Route path="/CalculatorAll" component={CalculatorAll}/> }
                                { <Route path="/Calculator" component={Calculator}/> }
                                { <Route path="/CalculatorDetail" component={CalculatorDetail}/> }
                                { <Route path="/NoticeStoreList" component={NoticeStoreList}/> }
                                { <Route path="/NoticeList" component={NoticeList}/> }
                                { <Route path="/Inquiry" component={Inquiry}/> }
                                { <Route path="/InquiryRequestExist" component={InquiryRequestExist}/> }
                                { <Route path="/Here" component={Here}/> }
                                { <Route path="/QuizList" component={QuizList}/> }
                                { <Route path="/Quiz/:id" component={Quiz}/> }
                                { <Route path="/EventList" component={EventList}/> }
                                { <Route path="/StatsChart" component={StatsChart}/> }
                                { <Route path="/StatsMonthly" component={StatsMonthly}/> }
                                { <Route path="/StatsDaily" component={StatsDaily}/> }
                                { <Route path="/CouponList" component={CouponList}/> }
                                { <Route path="/DeviceList" component={DeviceList}/> }
                                { <Route path="/AdminLog" component={AdminLog}/> }
                                { <Route path="/AppManage" component={AppManage}/> }
                            </Switch>
                        </div>
                    </main>
                </div>
                
                <Dialog onClose={doCloseErrorDialog} open={errorDialog} fullWidth maxWidth="sm">
                    <DialogTitle onClose={doCloseErrorDialog}>에러 메세지</DialogTitle>
                    <DialogContent>
                        <div>{ errorMessage }</div>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={doCloseErrorDialog} color="primary" variant="contained">
                            닫기
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* <SockJsClient url='http://localhost:8080/websocket' topics={['/topic/greetings']}
                    onMessage={(msg) => { showNotification(msg.content); }}
                    onConnect={console.log("Websocket Connected")} 
                    onDisconnect={console.log("Websocket Disconnected")}
                    ref={ (client) => { clientRef = client }} /> */}
            </SnackbarProvider>
        </ThemeProvider>
    );
}

App.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  container: PropTypes.instanceOf(typeof Element === 'undefined' ? Object : Element),
};

export default App;