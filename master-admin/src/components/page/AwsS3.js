import React from 'react';
import { API_HOST, API_CAL_URL } from '../../constants';
import { useGlobalState } from '../../state';
import axios from 'axios';
import { Box,Typography, Grid, Button } from '@material-ui/core';
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


const AwsS3 = () => {
    const [login, setLogin] = useGlobalState('login');
    const classes = useStyles();

    const [json, setJson] = React.useState({});
    const [result, setResult] = React.useState({});

    const doLoadData = () => {
        return new Promise((resolve, reject) => {
            axios({
                "url": API_HOST + "/master/loadSetting",
                "method": "post",
                "params": {
                    code:"AWS_S3_JSON"
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

    React.useEffect(() => {
        doLoadData()
        .then(response => {
            console.log(JSON.stringify(result));

            let json = {
                array: JSON.parse(response.data.value)
            }
            setJson(json);
            setResult(json);
        });
    }, []);

    const saveJson = () => {
        axios({
            "url": API_HOST + "/master/updateSetting",
            "method": "post",
            "params": {
                code: "AWS_S3_JSON",
                value: encodeURI(JSON.stringify(result.array)),
                // query: 'mutation { ' + 
                //         ' updateSetting (' +
                //             'code: "AWS_S3_JSON" ' +
                //             'value: """' + JSON.stringify(result.array) + '"""' +
                //         ') {' +
                //             'id ' +
                //         '}' + 
                //     '}'
            }
        })
        .then(function (response) {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h5" noWrap>
                    S3 이미지 관리 <Button variant="contained" color="primary" onClick={ saveJson }>저장</Button>
                </Typography>
                <div className={classes.divRow}>array 키는 지우면 안됩니다</div>

                <div className={classes.divRow}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <JSONInput
                                id = 'a_unique_id'
                                placeholder = { json }
                                colors = {{ background: "#ffffff", default: "#575757", keys: "#234ec7", string: "#c75023", number: "#2d820a" }}
                                width = '80vw'
                                height = '80vh'
                                onBlur = { (e) => { setResult(e.jsObject) }}
                            />
                        </Grid>
                    </Grid>
                </div>
            </Box>
    );
};

export default AwsS3;