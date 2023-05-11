import * as React from 'react';
import { Box, Paper, Grid, styled, Typography, Divider, Button } from '@mui/material';
import PatientList from './PatientList';
import TeamPerformance from './TeamPerformance';
import Users from './Users';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../utils/AppContextProvider';
import TeamMemgerTable from './TeamMemberTable.jsx';
import Loading from '../../utils/Loading';



export default function MyTeamGrid() {

    const { team, teamLoading, allTeams, allTeamsLoading, tasks, tasksLoading, loggedInUser } = useContext(AppContext);


    const [pageLoading, setPageLoading] = React.useState(false);
    const [teamOnDisplay, setTeamOnDisplay] = React.useState(null);
    const [completedTasks, setCompletedTasks] = React.useState(null);
    const [clinicianList, setClinicianList] = React.useState(null);
    const [patientList, setPatientList] = React.useState(null);

    //toggle page loading
    useEffect(() => {

        if (teamLoading || allTeamsLoading || tasksLoading) {
            setPageLoading(true);
        } else {
            setPageLoading(false);
        }

    }, [teamLoading, allTeamsLoading, tasksLoading]);

    //set team on display  
    if (tasks && team) {
        const tempTasks = tasks.filter(task => task.status === 2 && task.clinician.team === team._id);
        useEffect(() => {
            setClinicianList(team.clinicians);
            setPatientList(team.patients);
            setTeamOnDisplay(team);
            setCompletedTasks(tempTasks);
        }, [tasks, team])

    }

    return (
        <div>
            {pageLoading ? <Loading /> :
                <MyTeamPage
                    teamOnDisplay={teamOnDisplay}
                    setTeamOnDisplay={setTeamOnDisplay}
                    allTeams={allTeams}
                    clinicianList={clinicianList}
                    setClinicianList={setClinicianList}
                    patientList={patientList}
                    setPatientList={setPatientList}
                    completedTasks={completedTasks}
                    setCompletedTasks={setCompletedTasks}
                    tasks={tasks}
                    loggedInUser={loggedInUser}
                />
            }
        </div>
    )
}



function MyTeamPage({ teamOnDisplay, setTeamOnDisplay, allTeams, clinicianList, setClinicianList, patientList, setPatientList, completedTasks, setCompletedTasks, tasks, loggedInUser }) {


    if (teamOnDisplay) {
        return (

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={8}>

                    {loggedInUser.isAdmin && allTeams ?
                        < ShowAllTeams
                            teamOnDisplay={teamOnDisplay}
                            setTeamOnDisplay={setTeamOnDisplay}
                            allTeams={allTeams}
                            setClinicianList={setClinicianList}
                            setPatientList={setPatientList}
                            setCompletedTasks={setCompletedTasks}
                            tasks={tasks}
                        /> :
                        null}


                    <Grid container item xs={12} md={4} spacing={3} mt={0}>

                        <Grid item xs={12} md={12} >
                            <PatientList patientList={patientList} />
                        </Grid>

                    </Grid>
                    <Grid container item xs={12} md={8} spacing={3} mt={0}   >

                        <Grid item xs={12} md={12}>

                            <Typography gutterBottom variant="h5" component="div">
                                {teamOnDisplay.name} Team Details
                            </Typography>
                            <Divider />

                            <TeamMemgerTable clinicianList={clinicianList} />

                        </Grid>

                        <Grid item xs={12} md={12}>
                            <TeamPerformance completedTasks={completedTasks} />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Users completedTasks={completedTasks} clinicianList={clinicianList} />
                        </Grid>

                    </Grid>



                </Grid>
            </Box>
        );
    }
}


function ShowAllTeams({ teamOnDisplay, setTeamOnDisplay, allTeams, setClinicianList, setPatientList, tasks, setCompletedTasks }) {


    return (
        <Grid item xs={12} md={12} mt={2} >

            {allTeams.map((team) => (

                <Button variant={teamOnDisplay._id == team._id ? "contained" : "outlined"} key={team._id} sx={{m: 2, mt: 3}}
                    onClick={() => {

                        setTeamOnDisplay(team);
                        setClinicianList(team.clinicians);
                        setPatientList(team.patients);

                        const tempTasks = tasks.filter(task => task.status === 2 && task.clinician.team === team._id);
                        setCompletedTasks(tempTasks);

                    }}
                >
                    {team.name}
                </Button>
            ))}

        </Grid>
    )

}


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

