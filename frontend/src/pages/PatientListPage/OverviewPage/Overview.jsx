import PatientCard from './PatientCard'
import { AppContext } from '../../../utils/AppContextProvider'
import { useContext, useState, useEffect } from 'react'
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import Loading from '../../../utils/Loading';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export default function Overview() {

    const { team } = useContext(AppContext);
    const [patients, setPatients] = useState(team.patients);

    useEffect(() => {
            setPatients(team.patients);
        },[team])


    const SelectLabels = () => {
        const [name, setName] = useState('');
        const [identifier, setIdentifier] = useState('')
        const [location, setLocation] = useState('');

        const handleChange = (event) => {
            if (event.target.name === 'name') {
                setName(event.target.value);
                const sortedPatients = patients.slice().sort((a, b) => {
                    if (event.target.value === 'a-z') {
                        return a.fname.localeCompare(b.fname);
                    } else if (event.target.value === 'z-a') {
                        return b.fname.localeCompare(a.fname);
                    } else {
                        return 0;
                    }
                });
                setPatients(sortedPatients);
            } else if (event.target.name === 'identifier') {
                setIdentifier(event.target.value);
                const sortedPatients = patients.slice().sort((a, b) => {
                    if (event.target.value === 'a-z') {
                        return a.identifier.localeCompare(b.identifier);
                    } else if (event.target.value === 'z-a') {
                        return b.identifier.localeCompare(a.identifier);
                    } else {
                        return 0;
                    }
                });
                setPatients(sortedPatients);
            } else if (event.target.name === 'location') {
                setLocation(event.target.value);
                const sortedPatients = patients.slice().sort((a, b) => {
                    if (event.target.value === 'a-z') {
                        return a.location.localeCompare(b.location);
                    } else if (event.target.value === 'z-a') {
                        return b.location.localeCompare(a.location);
                    } else {
                        return 0;
                    }
                });
                setPatients(sortedPatients);
            }
        };
        return (
            <div>
                <FormControl sx={{ m: 1, minWidth: 150 }}>
                    <InputLabel id="name-label">Name</InputLabel>
                    <Select
                        labelId="name-label"
                        id="name-select"
                        name="name"
                        value={name}
                        label="Name"
                        onChange={handleChange}
                    >
                        <MenuItem value="a-z">A-Z</MenuItem>
                        <MenuItem value="z-a">Z-A</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 150 }}>
                    <InputLabel id="identifier-label">Identifier</InputLabel>
                    <Select
                        labelId="identifier-label"
                        id="identifier-select"
                        name="identifier"
                        value={identifier}
                        label="identifier"
                        onChange={handleChange}
                    >
                        <MenuItem value="a-z">A-Z</MenuItem>
                        <MenuItem value="z-a">Z-A</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 150 }}>
                    <InputLabel id="location-label">Location</InputLabel>
                    <Select
                        labelId="location-label"
                        id="location-select"
                        name="location"
                        value={location}
                        label="Location"
                        onChange={handleChange}
                    >
                        <MenuItem value="a-z">A-Z</MenuItem>
                        <MenuItem value="z-a">Z-A</MenuItem>
                    </Select>
                </FormControl>
            </div>
        );
    }



    if (patients) {
        return (
            <Box>
                <SelectLabels />
                {patients.map(patient => <PatientCard key={patient._id} patient={patient} />)}
            </Box>
        )
    } else {
        return (<Loading />)
    }
};