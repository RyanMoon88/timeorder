import React from 'react';
import { useGlobalState } from '../../state';
import { Box,Typography } from '@material-ui/core';

const StatsChart = () => {
    const [login, setLogin] = useGlobalState('login');
    return (
        login !== null &&
            <Box className="base-container page-box" height="100%">
                <Typography variant="h6" noWrap>
                    최근 7일 요약 통계 (전일까지 기록)
                </Typography>
                <div>
                    유저 구매 순위 (금액, 건수, 수량)
                </div>
                <div>
                    가맹점 판매 순위 (금액, 건수, 수량)
                </div>
            </Box>
    );
};

export default StatsChart;