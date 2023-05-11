import { 
    IconButton, 
    Badge, 
    Menu, 
    MenuItem, 
    Typography, 
    Box, 
    Button } from "@mui/material"
import MailIcon from '@mui/icons-material/Mail';
import { useState, useContext } from 'react';
import { AppContext } from '../utils/AppContextProvider';
import { NavLink } from 'react-router-dom';
import styles from '.././layout/Appbar.module.css'

export default function MessageMenu() {

    const { unreadNotification,loggedIn } = useContext(AppContext);

    const [anchorElNotification, setAnchorElNotification] = useState(null);
    
    const handleNotificationsOpen = (event) => {
        setAnchorElNotification(event.currentTarget);
    }
    const handleNotificationsClose = () => {
        setAnchorElNotification(null);
    }


    function notificationsLabel(count) {
        if (count === 0) {
            return 'no notification';
        }
        if (count > 99) {
            return 'more than 99 notification';
        }
        return `${count} notification`;
    }
    return (
        <>
            { loggedIn ? <IconButton
                aria-label={notificationsLabel(unreadNotification.length)}
                size='large'
                color='inherit'
                onClick={handleNotificationsOpen}>
                <Badge badgeContent={loggedIn ? unreadNotification.length : 0} color="secondary">
                    <MailIcon />
                </Badge>
            </IconButton> : null
            }
            
            <Menu sx={{ mt: '45px' }}

                anchorEl={anchorElNotification}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElNotification)}
                onClose={handleNotificationsClose}
            >
                {unreadNotification.map((unreadNotification, index) => (
                    <MenuItem
                        key={index}
                        onClick={handleNotificationsClose}
                        sx={{ 
                            m: 2, 
                            p: 2, 
                            flexDirection: 'column', 
                            alignItems: 'flex-start', 
                            borderColor: '#9ED0F9', 
                            borderWidth: '2px', 
                            borderStyle: 'solid', 
                            borderRadius: '5px' }}
                            >
                        <Typography >{unreadNotification.entity} {unreadNotification.patient.fname}</Typography>
                        <Box>
                            <NavLink to='/notification' className={styles.link}>
                            <Button size='medium'>CHECK IT OUT</Button>
                            </NavLink>
                            <Button size='medium'>DISMISS</Button>
                        </Box>
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}