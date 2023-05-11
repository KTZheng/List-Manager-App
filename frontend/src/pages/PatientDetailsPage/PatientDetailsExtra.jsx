import {
    Card,
    TableContainer,
    TableCell,
    TableBody,
    Table,
    CardContent,
    TableRow,
    TextField,
    Button,
    IconButton,
    Typography,
} from '@mui/material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import props from 'prop-types';
import { AppContext } from '../../utils/AppContextProvider';



const EditableTableCell = ({ value, onChange, onSubmit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputText, setInputText] = useState(value);
    

    useEffect(() => {
        setInputText(value);
    }, [isEditing]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (event) => {
        setInputText(event.target.value);
        if (onChange) {
            onChange(event.target.value);
        }
    };

    const handleSubmit = () => {
        setIsEditing(false);
        if (onChange) {
            onChange(inputText);
        }
        if (onSubmit) {
            onSubmit(inputText);
        }
    };

    return isEditing ? (
        <>
            <TextField
                value={inputText}
                onChange={handleInputChange}
                fullWidth
            />
            <Button onClick={handleSubmit} variant='contained'>
                <DoneIcon />
            </Button>
        </>
    ) : (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                {value}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={handleEditClick}>
                    <EditIcon />
                </IconButton>
            </div>
        </div>
    );
};



const style = {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
    position: 'relative',
    left: '300px',
};

export default function PateintDetailsExtra(props) {
    const { patientId } = useParams();
    const { patientData, API_BASE_URL } = props;

    const [description, setDescription] = useState('');
    const [problems, setProblems] = useState('');
    const [plan, setPlan] = useState('');
    const [history, setHistory] = useState('');
    const { refreshTeam } = useContext(AppContext);

    const updatePatientData = async (
        patientId,
        API_BASE_URL,
        patientDetailsExtra
    ) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/patient/${patientId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(patientDetailsExtra),
                }
            );
    
            if (!response.ok) {
                throw new Error('Error updating patient data');
            }
            refreshTeam();
        } catch (error) {
            console.error('Error updating patient data:', error);
        }
    };

    const handleDescriptionSubmit = async (value) => {
        setDescription(value);
        await updatePatientData(patientId, API_BASE_URL, patientDetailsExtra);
    };

    const handleProblemSubmit = async (value) => {
        setProblems(value);
        await updatePatientData(patientId, API_BASE_URL, patientDetailsExtra);
    };

    const handlePlanSubmit = async (value) => {
        setPlan(value);
        await updatePatientData(patientId, API_BASE_URL, patientDetailsExtra);
    };
    const handleHistorySubmit = async (value) => {
        setHistory(value);
        await updatePatientData(patientId, API_BASE_URL, patientDetailsExtra);
    };

    useEffect(() => {
        const getPatientData = async () => {
            if (patientData.data && patientData.data.progress) {
                const patient = patientData.data;
                setDescription(patient.description);
                setPlan(patient.progress.plan);
                setHistory(patient.progress.history);
                setProblems(patient.progress.problems);
            }
        };
        getPatientData();
    }, [patientData]);

    const patientDetailsExtra = {
        description: description,
        progress: {
            problems: problems,
            history: history,
            plan: plan,
        },
    };

    return (
        <Card>
            <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                    Extra Information
                </Typography>

                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Description:</TableCell>
                                <TableCell>
                                    <EditableTableCell
                                        value={description}
                                        onChange={setDescription}
                                        onSubmit={handleDescriptionSubmit}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Problems:</TableCell>
                                <TableCell>
                                    <EditableTableCell
                                        value={problems}
                                        onChange={setProblems}
                                        onSubmit={handleProblemSubmit}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>History:</TableCell>
                                <TableCell>
                                    <EditableTableCell
                                        value={history}
                                        onChange={setHistory}
                                        onSubmit={handleHistorySubmit}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Plan:</TableCell>
                                <TableCell>
                                    <EditableTableCell
                                        value={plan}
                                        onChange={setPlan}
                                        onSubmit={handlePlanSubmit}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}
