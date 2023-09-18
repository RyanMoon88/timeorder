import React from 'react';
import { useGlobalState } from '../../state';
import { Box,Typography } from '@material-ui/core';

const Dashboard = () => {
    const [login, setLogin] = useGlobalState('login');
    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap>
                    Dashboard
                </Typography>
            </Box>
    );
};

export default Dashboard;