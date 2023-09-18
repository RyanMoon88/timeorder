import React from 'react';
import { API_SERVER_URL } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import numeral from 'numeral';
import moment from 'moment';
import { useHistory, Link } from 'react-router-dom';
import { Box,Typography } from '@material-ui/core';
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { Container, Paper, GridList, GridListTile, GridListTileBar, ListSubheader, Grid, TextField, Button } from '@material-ui/core';
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


function loadData() {
    let q = 'query { ' + 
            ' stores (orderBy: "createdAt_DESC") { totalCount stores { id name createdAt } }' +
            ' bases (value:"GRP") { totalCount bases { id code name opt1 opt2 opt3 opt4 opt5 opt6 } } }';
    
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

function loadStoreData(code = "", listRow = 0, listCount = 10, ) {
    let q = 'query {' +
        ' stores (orderBy: "createdAt_DESC", where:"{ \\"groupDiscountCode\\": \\"' + code + '\\" }") { totalCount stores { id code name phone address createdAt group { name } orderToday { id payMethod totalPrice } orderWeek { id payMethod totalPrice } orderMonth { id payMethod totalPrice } ordered { id payMethod totalPrice } } }' +
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

const getOrderTodayPrice = (row) => {
    let total = 0;
    let orderToday = row.orderToday;
    for (let j=0; j<orderToday.length; j++) {
        if (orderToday[j].payMethod !== "00") {
            total += orderToday[j].totalPrice;
        }
    }
    return total;
}

function getOrderWeeklyPrice(row) {
    let total = 0;
    let orderWeek = row.orderWeek;
    for (let j=0; j<orderWeek.length; j++) {
        if (orderWeek[j].payMethod !== "00") {
            total += orderWeek[j].totalPrice;
        }
    }
    return total;
}

function getOrderMonthlyPrice(row) {
    let total = 0;
    let orderMonth = row.orderMonth;
    for (let j=0; j<orderMonth.length; j++) {
        if (orderMonth[j].payMethod !== "00") {
            total += orderMonth[j].totalPrice;
        }
    }
    return total;
}

function getOrderTotalPrice(row) {
    let total = 0;
    let orders = row.ordered;
    for (let j=0; j<orders.length; j++) {
        if (orders[j].payMethod !== "00") {
            total += orders[j].totalPrice;
        }
    }
    return total;
}

function getOrderTotalCount(row) {
    let total = 0;
    let orders = row.ordered;
    for (let j=0; j<orders.length; j++) {
        if (orders[j].payMethod !== "00") {
            total++;
        }
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

    // Component 의 componentDidMount와 componentDidUpdate, 의 역할
    React.useEffect(() => {
        setBackdrop(true);
        loadData()
        .then((response) => {
            let code = response.data.data.bases.bases[0].name;
            let stores = response.data.data.stores.stores;
            console.log(code);
            setOriginFilterStores(stores);
            setFilterStores(stores);
            loadStoreData(code)
            .then((response1) => {
                setData(response);
                setStores(response1.data.data.stores.stores);
                setBackdrop(false);
            })
        });
    }, []);     // [] 를 넣는 이유는 한번만 로드 하기 위해서

    React.useEffect(() => {
        let active = true;

        if (searchStore.length > 0) {
            let filterStores = cloneObject(originFilterStores);
            filterStores = filterStores.filter((item) => {
                let name = item.name === null ? "" : item.name;
                return name.indexOf(searchStore) > -1;
            });
            setFilterStores(filterStores);
        }
        else {
            setFilterStores([]);
        }

        return () => {
            active = false;
        };
    }, [searchStore]);

    function setData(response) {
        console.log("groups response", response);
        let data = response.data.data;
        let bases = data.bases.bases;
        setOriginBases(bases);
        setBases(bases);
    }

    const doSelectGrpIndex = (index) => {
        setSelectedGrpIndex(index);
        setBackdrop(true);

        let code = bases[index].name;
        loadStoreData(code)
        .then((response) => {
            setStores(response.data.data.stores.stores);
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
                code: "GRP" + newNum,
                name: "",
                opt1: "",
                opt2: ""
            }
        }
        setBase(baseObject);
        setOpenDialog(true);
    }

    function doCloseDialog() {
        setBase(null);
        setOpenDialog(false);
    }

    function doSaveDialog() {
        console.log(base);

        let q = "";
        
        if (base.id === undefined) {
            q = 'mutation { ' + 
                ' insertBase (' +
                    'code: "' + base.code + '" ' +
                    'name: "' + base.name + '" ' +
                    'opt1: "' + base.opt1 + '" ' +
                    'opt2: "' + base.opt2 + '" ' +
                ') {' +
                    'id ' +
                '}' + 
            '}';
        }
        else {
            q = 'mutation { ' + 
                ' updateBase (' +
                    'id: "' + base.id + '" ' +
                    'code: "' + base.code + '" ' +
                    'name: "' + base.name + '" ' +
                    'opt1: "' + base.opt1 + '" ' +
                    'opt2: "' + base.opt21 + '" ' +
                ') {' +
                    'id ' +
                '}' + 
            '}';
        }

        axios({
            "url": API_SERVER_URL,
            "method": "post",
            "data": {
                query: q
            }
        })
        .then((response) => {
            if (response.data.data.insertBase) {
                let baseList = bases;
                base.id = response.data.data.insertBase.id;
                baseList.push(base);
                setBases(baseList);
            }
            else {
                let baseList = bases;
                for (let i=0; i<baseList.length; i++) {
                    if (response.data.data.updateBase.id === baseList[i].id) {
                        baseList[i] = base;
                    }
                }
                setBases(baseList);
            }
            setBase(null);
            setOpenDialog(false);
        });
    }

    const changeBaseValue = (prop) => (event) => {
        setBase({ ...base, [prop]: event.target.value });
    }

    function doOpenStoreDialog(base) {
        setOpenStoreDialog(true);
    }

    function doCloseStoreDialog() {
        setOpenStoreDialog(false);
    }

    const doSetStoreGroupCode = () => {
        if (selectedStore === null) {
            return false;
        }
        else {
            let q = 'mutation {' +
                ' updateStore (id:"' + selectedStore.id + '", groupDiscountCode: "' + bases[selectedGrpIndex].name + '") { id }' +
            '}'
        
            axios({
                "url": API_SERVER_URL,
                "method": "post",
                "data": {
                    query: q
                }
            })
            .then(function (response) {
                loadStoreData(bases[selectedGrpIndex].name)
                .then((response) => {
                    setStores(response.data.data.stores.stores);
                    setBackdrop(false);
                })
                doCloseStoreDialog();
            });
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
                                            <StyledTableCell align="center">티캐시<br/>별칭</StyledTableCell>
                                            <StyledTableCell align="center">설명</StyledTableCell>
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
                                                    <StyledTableCell className={selectedGrpIndex === i ? classes.cellSelected : ""}>{ row.name }</StyledTableCell>
                                                    <StyledTableCell className={selectedGrpIndex === i ? classes.cellSelected : ""}>{ row.opt2 }</StyledTableCell>
                                                    <StyledTableCell className={selectedGrpIndex === i ? classes.cellSelected : ""}>{ row.opt1 }</StyledTableCell>
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
                                                    <StyledTableCell align="right">{ numeral(getOrderTodayPrice(row)).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(getOrderWeeklyPrice(row)).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(getOrderMonthlyPrice(row)).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(getOrderTotalPrice(row)).format('0,0') }</StyledTableCell>
                                                    <StyledTableCell align="right">{ numeral(getOrderTotalCount(row)).format('0,0') }</StyledTableCell>
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
                                            <TextField className={ classes.width100 } label="그룹코드" variant="outlined" defaultValue={ isNull(base.name) }
                                                onBlur={changeBaseValue('name')}/>
                                        </div>
                                        <div className={ classes.divRow }>
                                            <TextField className={ classes.width100 } label="설명" variant="outlined" defaultValue={ isNull(base.opt1) }
                                                onBlur={changeBaseValue('opt1')}/>
                                        </div>
                                        <div className={ classes.divRow }>
                                            <TextField className={ classes.width100 } label="티캐시 별칭" variant="outlined" defaultValue={ isNull(base.opt2) }
                                                onBlur={changeBaseValue('opt2')}/>
                                        </div>
                                        <div className={ [classes.divRow, classes.textRight].join(' ') }>
                                            <Button className={ classes.button } variant="contained" color="primary" onClick={ doSaveDialog }>저장</Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                        </Dialog>
                }
                
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