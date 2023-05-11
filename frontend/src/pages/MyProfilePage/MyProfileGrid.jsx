import * as React from 'react';
import { Box, Grid } from '@mui/material';
import MyProfileMyDetails from './MyProfileMyDetails';
import MyProfileAnalytics from './MyProfileAnalytics';
import LoginDetails from './LoginDetails';




export default function MyProfileGrid() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={8} mt={10}>
                <Grid container item spacing={3} xs={12} md={4}>

                    <Grid item xs={12} md={12}>
                        <div><MyProfileMyDetails /></div>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <LoginDetails />
                    </Grid>
                </Grid>

                <Grid item xs={12} md={8}>

                    <div ><MyProfileAnalytics /></div>

                </Grid>

            </Grid>
        </Box>
    );
}
