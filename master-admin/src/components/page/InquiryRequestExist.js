import React from 'react';
import { useGlobalState } from '../../state';
import { Box,Typography } from '@material-ui/core';

const InquiryRequestExist = () => {
    const [login, setLogin] = useGlobalState('login');
    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap>
                    InquiryRequestExist
                </Typography>
            </Box>
    );
};

export default InquiryRequestExist;