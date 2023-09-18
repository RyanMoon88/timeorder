import React from 'react';
import { API_HOST } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Box,Typography } from '@material-ui/core';
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { Container, Paper, GridList, GridListTile, GridListTileBar, ListSubheader, Grid, TextField, Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import CssBaseline from "@material-ui/core/CssBaseline";
import Pagination from "material-ui-flat-pagination";

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';


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
}));

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
    console.log(value);
    if (value === null || value === undefined) {
        return base;
    }
    else {
        return value;
    }
}


function loadData(search = "", listRow = 0, listCount = 20) {
    let q = 'query { groups (orderBy:"createdAt_DESC", skip:' + listRow + ', first:' + listCount + ', where: "{\\"name_contains\\":\\"' + search + '\\"}") { totalCount groups { id name images stores { id } } } }';
    
    return new Promise((resolve, reject) => {
        axios({
            "url": API_HOST + "/master/loadGroupList",
            "method": "post",
            "params": {
                search:search,
                page:listRow,
                pageSize:listCount,
            }
        })
        .then(function (response) {
            resolve(response);
        });
    });
}


const GroupList = () => {
    const [login, setLogin] = useGlobalState('login');
    const [backdrop, setBackdrop] = useGlobalState('backdrop');

    const history = useHistory();
    const classes = useStyles();

    const [search, setSearch] = React.useState("");

    const [originGroups, setOriginGroups] = React.useState([]);
    const [groups, setGroups] = React.useState([]);
    const [originGroup, setOriginGroup] = React.useState(null);
    const [group, setGroup] = React.useState(null);
    
    const [page, setPage] = React.useState(0);
    const [listCount, setListCount] = React.useState(20);
    const [pageCount, setPageCount] = React.useState(10);
    const [totalPage, setTotalPage] = React.useState(20);

    const [openGroupDialog, setOpenGroupDialog] = React.useState(false);


    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        setBackdrop(true);
        loadData(search)
        .then((response) => {
            setData(response);
            setBackdrop(false);
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서


    function setData(response) {
        console.log("groups response", response);
        let data = response.data;

        let totalCount = data.totalElements;
        let groups = data.content;
        setOriginGroups(groups);
        setGroups(groups);
        
        let totalPgaePlus = (totalCount % listCount) > 0 ? 1 : 0;
        let totalPage = parseInt(totalCount / listCount) + totalPgaePlus;
        setTotalPage(totalPage);
    }

    function doLink(url) {
        history.push("/StoreGroup/" + url);
    }

    function clickPagination(offset) {
        console.log("pagination", offset);
        setPage(offset);
        
        loadData("", offset, listCount)
        .then((response) => {
            setData(response);
        });
    }
    

    const changeGroupValue = (prop) => (event) => {
        setGroup({ ...group, [prop]: event.target.value });
    };


    function addStoreGroup() {
        let q = 'mutation { ' + 
            ' insertAdminLog(type:"STO1" adminId: "cjv6z5pjs0aay0734ge2kfk00" ip:"" content:"[가맹점그룹 추가]") { id } ' +
            ' insertGroup (' +
                ' code: "" ' +
                ' name: "" ' +
                ' images: "" ' +
            ') {' +
                'id ' +
            '}' + 
        '}';
        let groupParam = {
            id:"",
            code:"",
            name:"",
            images:""
        }
        
        return new Promise((resolve, reject) => {
            axios({
                "url": API_HOST + "/master/updateGroup",
                "method": "post",
                "data": groupParam,
            })
            .then(function (response) {
                console.log(response);
                window.location.reload();
            });
        });
    }

    
    // 상품 다이얼로그 시작
    const doOpenGroupDialog = (id) => (event) => {
        let selected = groups.find(item => {
            return item.id === id;
        });

        if (selected !== undefined && selected !== null) {
            setGroup(selected);
        }
        else {

        }

        setOpenGroupDialog(true);
    }
    
    const doCloseGroupDialog = () => {
        // 현재 보여지는 탭 값의 필터링
        let copyGroups = cloneObject(originGroups);

        setGroups(copyGroups);
        setOpenGroupDialog(false);
    }
    
    const doSaveGroupDialog = () => {
        let copyGroup = cloneObject(group);

        let qSaveGroup = 'mutation { ' +
                ' updateGroup (' +
                    'id: "' + copyGroup.id + '" ' +
                    'name: "' + copyGroup.name + '" ' +
                ') { id } }';

                
        let groupParam = {
            id: copyGroup.id,
            name: copyGroup.name,
            code: copyGroup.code,
            images: copyGroup.images
        }
        new Promise((resolve, reject) => {
            axios({
                "url": API_HOST + "/master/updateGroup",
                "method": "post",
                "data": groupParam,
            })
            .then(function (response) {
                resolve(response);
            });
        })
        .then((response) => {
            console.log("SaveGroup", response);
            
            let copyOriginGroups = cloneObject(originGroups);
            copyOriginGroups = copyOriginGroups.map(obj => {
                return copyGroup.id === obj.id ? copyGroup : obj;
            });
            console.log(copyOriginGroups);
            setOriginGroups(copyOriginGroups);
            setGroups(copyOriginGroups);
            setOpenGroupDialog(false);
        })
    }
    
    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap className={classes.divRow}>
                    가맹점 그룹 <Button variant="contained" color="primary" onClick={ addStoreGroup }>추가</Button>
                </Typography>

                <Paper>
                    <GridList cellHeight={180} cols={4} className={classes.gridList}>
                        {
                            groups.map(row => (
                                <GridListTile key={row.id} >
                                    <img src={ row.images } alt={row.name} onClick={ doLink.bind(this, row.id) }
                                        style={{ cursor:'pointer' }}
                                        onError={(e) => { e.target.src="/img/default.png"}} />
                                    <GridListTileBar
                                    title={row.name}
                                    subtitle={<span>매장 수: {row.stores.length}</span>}
                                    actionIcon={
                                        <IconButton aria-label={`info about ${row.name}`} className={classes.icon} onClick={ doOpenGroupDialog(row.id) }>
                                            <CreateIcon />
                                        </IconButton>
                                    }
                                    />
                                </GridListTile>
                            ))
                        }
                    </GridList>
                </Paper>
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
                    group !== null &&
                        <Dialog onClose={doCloseGroupDialog} open={openGroupDialog} className="store-container" fullWidth maxWidth="xs">
                            <DialogContent>
                                <Grid container spacing={2} className={classes.divRow}>
                                    <Grid item xs={12}>
                                        <TextField className={ classes.width100 } label="그룹 이름" variant="outlined" defaultValue={ isNull(group.name) }
                                            onBlur={changeGroupValue('name')}/>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Grid container spacing={0}>
                                    <Grid item align="right" xs={12}>
                                        <Button autoFocus onClick={doSaveGroupDialog} color="primary" variant="contained">
                                            확인
                                        </Button>
                                    </Grid>
                                </Grid>
                            </DialogActions>
                        </Dialog>
                }
                
            </Box>
    );
};

export default GroupList;