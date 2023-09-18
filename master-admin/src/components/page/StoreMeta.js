import React from 'react';
import { API_HOST, API_CAL_URL } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import { Box,Typography, Grid, Button, Paper } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import JSONInput from 'react-json-editor-ajrm';
import writeJsonFile from 'write-json-file';


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

    tableTopInfo: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },

    input: {
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(2)
    },

    table: {
        minWidth: 700,
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
}));


// 깊은 복사
function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}


const StoreMeta = ({ match }) => {
    const [login, setLogin] = useGlobalState('login');
    const classes = useStyles();

    const [storeName, setStoreName] = React.useState("");
    const [list, setList] = React.useState([]);
    const [listIndex, setListIndex] = React.useState(-1);
    const [json, setJson] = React.useState();
    const [result, setResult] = React.useState({});

    const doLoadData = () => {
        return new Promise((resolve, reject) => {
            axios({
                "url": API_HOST + "/master/loadStoreMeta",
                "method": "post",
                "params": {
                    storeId:match.params.id,
                }
            })
            .then(function (response) {
                console.log(response);
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    const doSaveData = () => {
        axios({
            "url": API_HOST + "/master/updateStoreMeta",
            "method": "post",
            "data": {
                id:list[listIndex].id,
                value:encodeURI(JSON.stringify(result.value)),
                key:list[listIndex].key,
                store:list[listIndex].store,
                // query: 'mutation {' + 
                //         ' updateStoreMeta (id: "' + list[listIndex].id + '", value: """' + JSON.stringify(result.value) + '""") { id }' +
                //     '}'
            }
        })
        .then(function (response) {
            let l = cloneObject(list);
            l[listIndex].value = JSON.striginfy(result.value);
            console.log(l);
            setList(l);
        })
        .catch((error) => {
        });
    }

    React.useEffect(() => {
        doLoadData()
        .then(response => {
            console.log(response);
            setStoreName(response.data.stores.name);
            setList(response.data.storeMetas);
            doChangeIndex(response.data.storeMetas, 0);
        });
    }, []);


    const doChangeIndex = (list, index) => {
        setListIndex(index);

        let json = {
            value: JSON.parse(list[index].value)
        }
        setJson(json);
        setResult(json);
    }
    
    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h5" noWrap>
                    메타정보 관리 - { storeName } { list.length > 0 && <Button variant="contained" color="primary" onClick={ doSaveData }>저장</Button> }
                </Typography>
                <div className={classes.divRow}>value 키는 지우면 안됩니다</div>

                <div className={classes.divRow}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Paper square>
                                {
                                    list.map((row, index) => (
                                        <Box
                                            key={index}
                                            p={2}
                                            style={{ background: index === listIndex ? '#ffdfda' : '#ffffff' }}
                                            onClick={ () => doChangeIndex(list, index) }>
                                            { row.key }
                                        </Box>
                                    ))
                                }
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <JSONInput
                                id = 'a_unique_id'
                                placeholder = { json }
                                colors = {{ background: "#ffffff", default: "#575757", keys: "#234ec7", string: "#c75023", number: "#2d820a" }}
                                width = '100%'
                                height = '80vh'
                                onBlur = { (e) => { setResult(e.jsObject) }}
                            />
                        </Grid>
                    </Grid>
                </div>
            </Box>
    );
};

export default StoreMeta;