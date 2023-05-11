import { TextField, Grid } from '@mui/material'
import styles from './PatientProgress.module.css'
import { useState, React, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export default function PatientProgress({ patient, readOnly }) {
    const [problems, setProblems] = useState("");
    const [history, setHistory] = useState("");
    const [plan, setPlan] = useState("");
    const [enableAdd, setEnableAdd] = useState(false);

    useEffect(() => {
        async function getProgress() {
            if (patient.progress) {
                setProblems(patient.progress.problems);
                setHistory(patient.progress.history);
                setPlan(patient.progress.plan);
                setEnableAdd(true);
            }

        }
        getProgress();
    }, []);

    useEffect(() => {
        async function updateProgress() {
            if (!readOnly && enableAdd) {
                const data = {
                    ...patient,
                    progress: {
                        problems: problems,
                        history: history,
                        plan: plan
                    }
                }
                try {
                    const response = await fetch(
                        `${API_BASE_URL}/api/patient/${data._id}`,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        }
                    );
                    if (!response.ok) {
                        throw new Error('Error updating patient progress');
                    }
                } catch (error) {
                    console.error('Error updating patient progress:', error);
                }
            }
        }
        updateProgress();
    }, [readOnly])

    const handleProblemsChange = (event) => {
        setProblems(event.target.value);
    };

    const handleHistoryChange = (event) => {
        setHistory(event.target.value);
    };

    const handlePlanChange = (event) => {
        setPlan(event.target.value);
    };
    if (patient.progress) {
        return (
            <Grid item container spacing={0} className={styles.patientProgress}>
                <Grid item xs={12}>
                    <TextField id='outlined-basic' label='Problems' variant='outlined' margin='dense' value={problems} onChange={handleProblemsChange} disabled={!readOnly} />
                </Grid >
                <Grid item xs={12}>
                    <TextField id='outlined-basic' label='History' variant='outlined' margin='dense' value={history} onChange={handleHistoryChange} disabled={!readOnly} />
                </Grid >
                <Grid item xs={12}>
                    <TextField id='outlined-basic' label='Plan' variant='outlined' margin='dense' value={plan} onChange={handlePlanChange} disabled={!readOnly} />
                </Grid >
            </Grid >
        )
    } else {
        return ("Loading")
    }
}
