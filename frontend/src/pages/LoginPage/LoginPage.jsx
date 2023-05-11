import { Grid } from '@mui/material';
import LeftBox from './LeftBox';
import LoginBox from './LoginBox';

function LoginPage() {
  return (
    <Grid container component='main' sx={{ height: '100vh' }}>
      <Grid item xs={12} md={8} 
      sx={{ 
        display: 'flex',
        backgroundColor: '#F8FCFD'
        }}>
        <LeftBox />
      </Grid>
      <Grid item xs={12} md={4}>
        <LoginBox />
      </Grid>
    </Grid>
  );
}

export default LoginPage;
