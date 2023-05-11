import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import ImageAvatars from '../../utils/Avatar.jsx';

import { useContext } from 'react';
import { AppContext } from '../../utils/AppContextProvider';

function createData(avatar, name, role, isSuperVisor) {
  return { avatar, name, role, isSuperVisor };
}



export default function TeamMemgerTable({clinicianList}) {
  
  // map users to rows
  let rows = [];
  if (clinicianList) {
    clinicianList.map((user) => {
      rows.push(createData(user.avatar, "Dr. " + user.fname + " " + user.lname, user.role, user.isSupervisor ? "Yes" : "No"));
    });
  }




  if (clinicianList) {
    return (
      <Box>


        <TableContainer component={Paper} >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Photo </TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Role</TableCell>
                <TableCell align="left">Is Supervisor</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.avatar}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <ImageAvatars id={row.avatar} />
                  </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.role}</TableCell>
                  <TableCell align="left">{row.isSuperVisor}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
}