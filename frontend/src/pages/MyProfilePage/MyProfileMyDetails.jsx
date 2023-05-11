
import { useState } from 'react';
import { Button, Typography, List, ListItem, ListItemText, Divider, TextField, Container, Box } from '@mui/material';
import ImageAvatars from '../../utils/Avatar.jsx';
import { useForm } from "react-hook-form";
import { useContext } from 'react';
import { AppContext } from '../../utils/AppContextProvider';
import Loading from '../../utils/Loading.jsx'

const style = {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
    margin:'auto'
};


export default function MyProfileMyDetails() {

    const [isEditing, setIsEditing] = useState(false);
    const { userProfile, userProfileLoading, updateUserProfile } = useContext(AppContext);


    return (
        <div>
            {userProfileLoading ? <Loading /> :
                isEditing ?
                    <MyDetailsForm
                        userProfile={userProfile}
                        updateUserProfile={updateUserProfile}
                        setEditOff={() => setIsEditing(false)} />
                    : <MyDetails
                        userProfile={userProfile}
                        setEditOn={() => setIsEditing(true)} />
            }
        </div>
    );
}



function MyDetails({ userProfile, setEditOn }) {



    function hancleEditClick() {
        setEditOn();
    }

    return (
        <div >

            <Box sx={{ mx: 'auto', px: 5 }}>

                <ImageAvatars id={userProfile.avatar} size={'big'} sx={{ width: 56, height: 56 }} />
                <List sx={style} component="nav" aria-label="mailbox folders">

                    <Typography gutterBottom variant="h5" component="div" textAlign="center">
                        Dr. {userProfile.fname} {userProfile.lname}

                    </Typography>
                    <Divider />

                    <ListItem button>
                        <ListItemText
                            primary="Role"
                            secondary={userProfile.role} />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Team"
                            secondary={userProfile.team.name} />
                    </ListItem>
                    <ListItem button>
                        <ListItemText
                            primary="Contact Number"
                            secondary={userProfile.phone} />
                    </ListItem>
                    <ListItem button>
                        <ListItemText
                            primary="Email"
                            secondary={userProfile.email} />
                    </ListItem>


                </List>
                <Button
                    variant="contained"
                    onClick={hancleEditClick}
                    
                >Edit My Details</Button>
            </Box>
        </div>
    )
}

function MyDetailsForm({ userProfile, updateUserProfile, setEditOff }) {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    function onSubmit(data) {
        updateUserProfile(userProfile._id, data);
        setEditOff();
    }

    const handleCancelClick = () => {
        setEditOff();
    }

    return (
        <Container>
            <Typography gutterBottom variant="h5" component="div" textAlign="center">
                Edit My Details
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    <TextField
                        margin='dense'
                        varient="outlined"
                        label="First Name"
                        fullWidth
                        defaultValue={userProfile.fname}
                        {...register("fname", {
                            required: "Required field"
                        })}
                        error={!!errors?.fname}
                        helperText={errors.fname?.message}

                    />
                    <TextField
                        margin='dense'
                        varient="outlined"
                        label="Last Name"
                        fullWidth
                        defaultValue={userProfile.lname}
                        {...register("lname", {
                            required: "Required field"
                        })}
                        error={!!errors?.lname}
                        helperText={errors.lname?.message}
                    />

                    <TextField
                        margin='dense'
                        varient="outlined"
                        label="Phone Number"
                        fullWidth
                        defaultValue={userProfile.phone}
                        {...register("phone", {
                            required: "Required field"
                        })}
                        error={!!errors?.phone}
                        helperText={errors.phone?.message}
                    />
                    <TextField
                        margin='dense'
                        varient="outlined"
                        label="email"
                        fullWidth
                        defaultValue={userProfile.email}
                        {...register("email", {
                            required: "Required field",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                            },
                        })}
                        error={!!errors?.email}
                        helperText={errors?.email ? errors.email.message : null}

                    />
                    <TextField
                        margin='dense'
                        varient="outlined"
                        label="Role"
                        fullWidth
                        defaultValue={userProfile.role}
                        disabled

                    />
                    <TextField
                        margin='dense'
                        varient="outlined"
                        label="Team"
                        fullWidth
                        defaultValue={userProfile.team.name}
                        disabled

                    />

                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', paddingTop: '5px' }}>
                    <Button type='submit' variant='contained' color='primary' >
                        Save
                    </Button>
                    <Button variant='outlined' color='inherit' onClick={handleCancelClick}  sx={{ borderColor: 'primary.main', color: 'primary.main' }}>
                        Cancel
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

