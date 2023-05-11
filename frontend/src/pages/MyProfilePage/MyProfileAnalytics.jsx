
import * as React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import styles from './MyProfileAnalytics.module.css'
// import { useContext } from 'react';
// import { AppContext } from '../../utils/AppContextProvider';

import MyProfileAnalyticsBarChart from './MyProfileAnalyticsBarChart';
const style = {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
};


export default function MyProfileAnalytics() {

    return (
        <div >
            <Card >
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        My Analytics
                    </Typography>
                    <div className={styles.bar_chart} >

                        <MyProfileAnalyticsBarChart />
                    </div>

                </CardContent>

            </Card>
        </div>
    );
}
