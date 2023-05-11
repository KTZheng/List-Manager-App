import Task from "./Task"
import { Grid } from '@mui/material'
import styles from './PatientTasks.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export default function PatientTasks(props) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        async function getTasks() {
            const { data } = await axios.get(`${API_BASE_URL}/api/task/patienttasks/${props.patient._id}`);
            setTasks(data);
        }
        getTasks();

    }, [props.trigger]);

    return (
        <Grid item container spacing={2} className={styles.patientTasks}>
            {tasks.map(task => <Task key={task._id} task={task} />)}
        </Grid >
    )
}