import { Box, useTheme, Typography } from '@mui/material';
import LeftImg from '../../assets/10132.jpeg'

function LeftBox() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        mx: "auto",
      }}
    >
      <Box
        sx={{
          width: 500,
          height: 300,
          position: "relative",
        }}
      >
        <img
          src={LeftImg}
          alt="left"
          style={{
            maxWidth: "100%",
            height: "auto",
            margin: "auto",
          }}
        />
      </Box>
      <Typography
        variant="h4"
        sx={{
          mt: 1,
          textAlign: "center",
          color: theme.palette.info.dark,
        }}
      >
        Patient List Manager
      </Typography>
      <Typography
        variant="h6"
        sx={{
          mt: 1,
          textAlign: "center",
          color: theme.palette.info.dark,
        }}
      >
        Work together, anywhere
      </Typography>
    </Box>
  );
}

export default LeftBox;
