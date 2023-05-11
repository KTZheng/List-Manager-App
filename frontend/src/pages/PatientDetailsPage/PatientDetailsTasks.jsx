import {
    Divider,
    List,
    ListItem,
    ListItemText,
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';


import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import useGet from '../../hooks/useGet';

const TASK_ICONS = {
    0: <CircleOutlinedIcon />,
    1: <ChangeCircleOutlinedIcon />,
    2: <CheckCircleOutlineOutlinedIcon />
};

const style = {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
    position: 'relative',
    left: '300px',
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
export default function PateintDetailsTasks() {
    const { patientId } = useParams();
    const tasksArray = useGet(
        `${API_BASE_URL}/api/task/patienttasks/${patientId}`,
        []
    );

    const [selectedTask, setSelectedTask] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
  
    const handleTaskClick = (task) => {
      setSelectedTask(task);
      setOpenDialog(true);
    };
  
    const handleClose = () => {
      setOpenDialog(false);
    };

    return (
        <Card >
            <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                    Tasks
                </Typography>

                <List component="nav" aria-label="mailbox folders" sx={{overflowY:'scroll', component:'div', maxHeight: 500}}>
                {tasksArray.data.map((task, index) => (
                    <React.Fragment key={index}>
                    <ListItem button onClick={() => handleTaskClick(task)}>
                        <ListItemText primary={task.name} />
                        {TASK_ICONS[task.status]}
                    </ListItem>
                    <Divider />
                    </React.Fragment>
                ))}
                </List>

                <Dialog open={openDialog} 
                        onClose={handleClose}
                        sx={{
                            "& .MuiDialog-container": {
                              "& .MuiPaper-root": {
                                width: "100%",
                                maxWidth: "500px",  
                              },
                            },
                        }}>
                    <DialogTitle>{selectedTask && selectedTask.name}</DialogTitle>
                    <DialogContent>
                    {selectedTask && selectedTask.status === 0 ? (
                        <DialogContentText>Task not started</DialogContentText>
                    ) : selectedTask && selectedTask.status === 1 ? (
                        <DialogContentText>Task in progress</DialogContentText>
                    ) : (
                        <DialogContentText>
                            {selectedTask && selectedTask.result}
                        </DialogContentText>
                    )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            </CardContent>
        </Card>
    );
}
