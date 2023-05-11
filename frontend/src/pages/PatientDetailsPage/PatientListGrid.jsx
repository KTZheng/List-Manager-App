import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom';
import PatientDetailsInfo from './PatientDetailsInfo';
import PatientDetailsTasks from './PatientDetailsTasks';
import PatientDetailsExtra from './PatientDetailsExtra';
import useGet from '../../hooks/useGet';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function PatientListGrid() {
    const { patientId } = useParams();
    const patientData = useGet(`${API_BASE_URL}/api/patient/${patientId}`, []);
    return (
        <Box sx={{ flexGrow: 1, mt: 3 }}>
            <Grid container spacing={8}>
                <Grid container item spacing={3} xs={12} md={12}>
                    <Grid item xs={12} md={6}>
                        <div>
                            <PatientDetailsInfo 
                                patientData={patientData}
                                API_BASE_URL={API_BASE_URL}
                            />
                        </div>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <div>
                            <PatientDetailsTasks patientData={patientData} />
                        </div>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={12}>
                    <div>
                        <PatientDetailsExtra
                            patientData={patientData}
                            API_BASE_URL={API_BASE_URL}
                        />
                    </div>
                </Grid>
            </Grid>
        </Box>
    );
}
