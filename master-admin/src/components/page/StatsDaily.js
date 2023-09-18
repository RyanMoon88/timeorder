import React from 'react';
import { useGlobalState } from '../../state';
import { Box,Typography } from '@material-ui/core';

const StatsDaily = () => {
    const [login, setLogin] = useGlobalState('login');
    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap>
                    일별 통계
                </Typography>
            </Box>
    );
};

export default StatsDaily;