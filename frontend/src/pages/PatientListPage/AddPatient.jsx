import { useState, React, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormControl, FormGroup, FormLabel,FormControlLabel,Radio, RadioGroup, Switch, Button, Select, MenuItem, InputLabel, Checkbox} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import axios from 'axios';
import { AppContext } from "../../utils/AppContextProvider"
import dayjs from 'dayjs';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export default function AddPatient(){
  const { loggedInUser } = useContext(AppContext);
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [dob, setDob] = useState(dayjs());
  const [clinicians, setClinicians] = useState([]);
  

  const { addPatientProvider } = useContext(AppContext);

  // retrieve supervisors when page first loaded
  useEffect(() => {
    async function getClinicians() {
      const { data } = await axios.get(`${API_BASE_URL}/api/patient/supervisors/${loggedInUser._id}`);
      let renderClinicians = [];
      let count = 0;
      for(const c of data) {
        const name = `${c.fname} ${c.lname}`
        renderClinicians.push( <FormControlLabel key={c.id} value={c.id} control={<Radio />} label={name} name="responsibleClinicians" checked={count == 0 ? true : false}/>)
        count ++;
      }
      setClinicians(renderClinicians);
    
    }
   getClinicians();
  }, [loggedInUser]);

  // submit new patient
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      fname: formData.get('fname'),
      lname: formData.get('lname'),
      location: location,
      description: formData.get('description'),
      responsibleClinicians: formData.get('responsibleClinicians'), 
      quickAdd: formData.get('blood-test') && formData.get('radiology') ? 'blood-test, radiology' : formData.get('blood-test') ? 'blood-test' : formData.get('radiology') ? 'radiology' : null ,
      notification: formData.get('notification'),
      birth_date: dob,
      gender: gender,
    };
    addPatientProvider(data)
  }
  
  function onGenderChange(e) {
    setGender(e.target.value);
  }
  function onLocationChange(e) {
    setLocation(e.target.value);
  }

    return(
        <Box sx={{'& .MuiTextField-root': { my: 1}}}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <TextField multiline fullWidth label="First name" name="fname" sx={{mr: 1}} required/>
            <TextField multiline fullWidth label="Last name" name="lname" sx={{ml: 1}} required/>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row',alignItems:'center', justifyContent: 'space-between'}}>
              <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DateField sx={{ width: '100%' }} format="DD-MM-YYYY" label="Date of Birth" value={dob} onChange={(e) => setDob(e)} required/>
              </LocalizationProvider>
              <FormControl fullWidth sx={{ml: 2, textAlign:'left'}} >
                <InputLabel id="select-gender" required >Gender</InputLabel>
                  <Select labelId="select-gender" value={gender} label="Gender" onChange={onGenderChange} required>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              <FormControl fullWidth sx={{ml: 2, textAlign:'left'}} >
                <InputLabel id="select-location" required>Location</InputLabel>
                  <Select labelId="select-location" value={location} label="Location" onChange={onLocationChange}>
                    <MenuItem value="Ward 1">Ward 1</MenuItem>
                    <MenuItem value="Ward 2">Ward 2</MenuItem>
                    <MenuItem value="Ward 3">Ward 3</MenuItem>
                    <MenuItem value="Ward 4">Ward 4</MenuItem>
                  </Select>
              </FormControl>
            </Box>
          <TextField multiline fullWidth label="Description" rows={4} name="description"/>
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard" style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <FormLabel style={{textAlign: "left"}} component="label">Responsible Clinician</FormLabel>
            <RadioGroup>
              {clinicians}
            </RadioGroup>
          </FormControl>
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard" style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <FormLabel style={{textAlign: "left"}} component="label">Quick add</FormLabel>
            <FormControlLabel value="blood test" control={<Checkbox />} label="Blood Test" name="blood-test"/>
            <FormControlLabel value="radiology" control={<Checkbox />} label="Radiology" name="radiology"/>
          </FormControl>
          <FormGroup>
            <FormControlLabel control={<Switch defaultChecked />} label="Notification" name="notification" />
         </FormGroup>
         <Button style={{display: 'flex'}} variant="contained" type="submit" role="Add">Add</Button>
         </form>
      </Box>
    )
    
}