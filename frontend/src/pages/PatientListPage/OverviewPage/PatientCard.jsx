import { useState, React, useContext } from "react"
import FreetextArea from "./FreetextArea"
import PatientDetails from "./PatientDetails"
import PatientProgress from "./PatientProgress"
import PatientTasks from "./PatientTasks"
import {
    Grid,
    Box,
    Paper,
    Button,
    Modal
} from '@mui/material/';
import { AppContext } from "../../../utils/AppContextProvider"
import { useNavigate } from "react-router"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    bolghadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};


export default function PatientCard(props) {
    const { createTask, loggedInUser } = useContext(AppContext)
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [trigger, setTrigger] = useState(0);
    const navigate = useNavigate();

    // Handlers and Modals
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleEdit = () => {
        setIsEditing(!isEditing);
    }

    function RadiologyTestModal(props) {
        const [open, setOpen] = useState(false);
        const handleOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };
        const handleXR = async () => {
            const newTask = {
                name: "XR",
                type: "Radiology",
                patient: props.patient._id,
                clinician: loggedInUser._id,
                priority: 1,
                status: 0,
                result: ""
            };
            await props.createTask(newTask)
            setTrigger((trigger) => trigger + 1);
        };
        const handleUSS = async () => {
            const newTask = {
                name: "USS",
                type: "Radiology",
                patient: props.patient._id,
                clinician: loggedInUser._id,
                priority: 2,
                status: 0,
                result: ""
            };
            await props.createTask(newTask)
            setTrigger((trigger) => trigger + 1);
        };
        const handleCT = async () => {
            const newTask = {
                name: "CT",
                type: "Radiology",
                patient: props.patient._id,
                clinician: loggedInUser._id,
                priority: 3,
                status: 0,
                result: ""
            };
            await props.createTask(newTask)
            setTrigger((trigger) => trigger + 1);
        };
        return (
            < >
                <Button onClick={handleOpen}>Radiology</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ ...style, width: 200 }}>
                        <h2 id="child-modal-title">Radiology</h2>
                        <p id="child-modal-description">
                            Select radiologic test
                        </p>
                        <Button onClick={handleXR}>XR</Button>
                        <Button onClick={handleUSS}>USS</Button>
                        <Button onClick={handleCT}>CT</Button>
                        <Button onClick={handleClose}>Close</Button>
                    </Box>
                </Modal>
            </ >
        );
    }

    function BloodTestModal(props) {
        const [open, setOpen] = useState(false);
        const handleOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };
        const handleFBC = async () => {
            const newTask = {
                name: "FBC",
                type: "Blood-test",
                patient: props.patient._id,
                clinician: loggedInUser._id,
                priority: 1,
                status: 0,
                result: ""
            };
            await props.createTask(newTask)
            setTrigger((trigger) => trigger + 1);
        };
        const handleUE = async () => {
            const newTask = {
                name: "UE",
                type: "Blood-test",
                patient: props.patient._id,
                clinician: loggedInUser._id,
                priority: 1,
                status: 0,
                result: ""
            };
            await props.createTask(newTask)
            setTrigger((trigger) => trigger + 1);
        };
        const handleCOAG = async () => {
            const newTask = {
                name: "COAG",
                type: "Blood-test",
                patient: props.patient._id,
                clinician: loggedInUser._id,
                priority: 1,
                status: 0,
                result: ""
            };
            await props.createTask(newTask)
            setTrigger((trigger) => trigger + 1);
        };
        return (
            < >
                <Button onClick={handleOpen}>Blood Test</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ ...style, width: 200 }}>
                        <h2 id="child-modal-title">Blood Test</h2>
                        <p id="child-modal-description">
                            Select blood test
                        </p>
                        <Button onClick={handleFBC}>FBC</Button>
                        <Button onClick={handleUE}>UE</Button>
                        <Button onClick={handleCOAG}>COAG</Button>
                        <Button onClick={handleClose}>Close</Button>
                    </Box>
                </Modal>
            </ >
        );
    }

    function ReviewModal(props) {
        const [open, setOpen] = useState(false);
        const handleOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };
        const handleCreateTask = async () => {
            const task = {
                name: 'Review',
                type: 'Review',
                patient: props.patient._id,
                clinician: loggedInUser._id,
                priority: 0,
                status: 0,
                result: ""
            }
            await props.createTask(task);
            setTrigger((trigger) => trigger + 1);
        }
        return (
            < >
                <Button onClick={handleOpen}>Review</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ ...style, width: 200 }}>
                        <h2 id="child-modal-title">Review</h2>
                        <p id="child-modal-description">
                            Review patient
                        </p>
                        <Button onClick={handleCreateTask}>Create</Button>
                        <Button onClick={handleClose}>Close</Button>
                    </Box>
                </Modal>
            </ >
        );
    }

    return (
        <Paper elevation={3} style={{
            padding: 8,
            margin: 5
        }}>
            <Box sx={{ flexGrow: 1, maxHeight: { xs: 900, sm: 600, lg: 300 } }}>
                <Grid item container spacing={2}>
                    <Grid item lg={1} sm={3} xs={6} order={{ xs: 1, sm: 1, lg: 1 }}>
                        <Button  onClick={() => navigate(`/patientdetails/${props.patient._id}`)}>
                            <PatientDetails patient={props.patient} />
                        </Button>
                    </Grid>
                    <Grid item lg={4} sm={5} xs={6} order={{ xs: 2, sm: 2, lg: 2 }}>
                        <Box component="div" sx={{ overflowY: "scroll", maxHeight: 200 }}>
                            <PatientProgress patient={props.patient} readOnly={isEditing} />
                        </Box>
                    </Grid>
                    <Grid item lg={4} sm={12} xs={6} order={{ xs: 5, sm: 6, lg: 3 }}>
                        <Box component="div" sx={{ overflowY: "scroll", maxHeight: 200 }}>
                            <PatientTasks patient={props.patient} trigger={trigger} />
                        </Box>
                    </Grid>
                    <Grid item lg={3} sm={4} xs={6} order={{ xs: 6, sm: 3, lg: 4 }}>
                        <Box component="div" sx={{ overflowY: "scroll", maxHeight: 200 }}>
                            <FreetextArea container={props.patient.container} patient_id={props.patient._id} />
                        </Box>
                    </Grid>
                    <Grid item lg={1} sm={3} xs={6} order={{ xs: 3, sm: 4, lg: 5 }}>
                    </Grid>
                    <Grid item lg={4} sm={5} xs={6} order={{ xs: 4, sm: 5, lg: 6 }}>
                        <Button variant="contained" role='Edit' onClick={handleEdit}>{isEditing ? "Add" : "Edit"}</Button>

                    </Grid>
                    <Grid item lg={4} sm={12} xs={6} order={{ xs: 7, sm: 7, lg: 7 }}>
                        <Button variant="contained" role='Add' onClick={handleOpen}>Add</Button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="parent-modal-title"
                            aria-describedby="parent-modal-description"
                        >
                            <Box sx={{ ...style, width: 400 }}>
                                <h2 id="parent-modal-title">Type of Task to Add</h2>
                                <p id="parent-modal-description">
                                    Select from options below
                                </p>
                                <BloodTestModal patient={props.patient} createTask={createTask} />
                                <RadiologyTestModal patient={props.patient} createTask={createTask} />
                                <ReviewModal patient={props.patient} createTask={createTask} />
                            </Box>
                        </Modal>
                    </Grid>
                    <Grid item lg={3} sm={6} xs={6} order={{ xs: 8, sm: 8, lg: 8 }}>
                        
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
};