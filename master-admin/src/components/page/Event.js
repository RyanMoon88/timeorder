import React from 'react';
import { useGlobalState } from '../../state';
import { Box,Typography } from '@material-ui/core';

const Event = () => {
    const [login, setLogin] = useGlobalState('login');
    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap>
                Event
                </Typography>
            </Box>
    );
};

export default Event;