import { useState } from 'react';
import { Container, Typography, TextField, List, ListItem, ListItemText, Button, styled, Box, Paper, Grid, IconButton, InputAdornment } from '@mui/material';
import { useForm } from "react-hook-form";
import { useContext } from 'react';
import { AppContext } from '../../utils/AppContextProvider';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';



const style = {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
    margin:'auto'
};


export default function LoginDetails() {

    const [isEditing, setIsEditing] = useState(false);

    return (
        isEditing ?
            <LoginDetailsForm setEditOff={() => setIsEditing(false)} />
            : <LoginDetailsList setEditOn={() => setIsEditing(true)} />

    );
}



function LoginDetailsList({ setEditOn }) {

    const { userProfile } = useContext(AppContext);

    function hancleEditClick() {
        setEditOn();
    }

    return (
        <div >

            <Box sx={{ mx: 'auto', px: 5 }}>


                <List sx={style} component="nav" aria-label="mailbox folders">

                    <ListItem button>
                        <ListItemText
                            primary="Password"
                            secondary="********" />

                    </ListItem>
                </List>
                <Button
                    variant="contained"
                    onClick={hancleEditClick}
                    // fullWidth
                > Change Password</Button>
            </Box>
        </div>
    )

}

function LoginDetailsForm({ setEditOff }) {
    const { register,
        handleSubmit,
        formState: { errors },
        watch } = useForm();

    const { userProfile, updateUserPassword } = useContext(AppContext);

    const [showPassword, setShowPassword] = useState(false);

    function onSubmit(data) {
        updateUserPassword(userProfile._id, data.password);
        setEditOff();
    }

    const handleCancelClick = () => {
        setEditOff();
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      }

    return (
        <Container>
            <Typography gutterBottom variant="h5" component="div" textAlign="center">
                Change Password
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box>

                    <TextField
                        margin='dense'
                        varient="outlined"
                        label="Password"
                        fullWidth
                        type={showPassword ? "text" : "password"}

                        {...register("password", {
                            required: "password is required",
                            minLength: {
                                value: 8,
                                message: "password must be at least 8 characters"
                            },
                            maxLength: {
                                value: 30,
                                message: "Username must be atmost 30 characters long",
                            }

                        })}
                        error={!!errors?.password}
                        helperText={errors.password?.message}
                        InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility} onMouseDown={(e) => e.preventDefault()}>
                                  {showPassword ? <VisibilityOffIcon /> : <VisibilityOutlinedIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                    />

                    <TextField
                        margin='dense'
                        varient="outlined"
                        label="Confirm Password"
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        {
                        ...register("confirm_password", {
                            required: "comfirm password is required",
                            validate: (value) => {
                                if (value !== watch("password")) {
                                    return "your password does not match";
                                }
                            }
                        })
                        }
                        error={!!errors?.confirm_password}
                        helperText={errors.confirm_password?.message}
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

