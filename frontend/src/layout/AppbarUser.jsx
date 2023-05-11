import { IconButton } from "@mui/material"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function UserIcon() {
    return (
        <IconButton
            size='large'
            aria-label='user'
            color='inherit'>
            <AccountCircleIcon />
        </IconButton>
    )
}