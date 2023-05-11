import express from 'express';
import {
    retrieveTeam,
    retrieveAllTeams,
    retrievePatientList,
    retrieveClinicianList,
    retrieveTeamByPatientId,
    transferTeam
} from '../../dao/team-dao.js'

const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const HTTP_NO_CONTENT = 204;

const router = express.Router();

router.get('/:teamId', async (req, res) => {
    const { teamId } = req.params;

    const team = await retrieveTeam(teamId);

    if (team) {
        return res.json(team);
    }
    return res.sendStatus(HTTP_NOT_FOUND);

});

// get all teams
router.get('/', async (req, res) => {
    const teams = await retrieveAllTeams();
    if (teams) {
        return res.json(teams);
    }
    return res.sendStatus(HTTP_NOT_FOUND);
});

router.get('/:teamId/patient_list', async (req, res) => {
    const { teamId } = req.params;

    const patientList =await retrievePatientList(teamId);

    if(patientList) {
        return res.json(patientList);

    }
    return res.sendStatus(HTTP_NOT_FOUND);

});

router.get('/:teamId/clinician_list', async (req, res) => {
    const { teamId } = req.params;


    const clinicianList = await retrieveClinicianList(teamId);

    if (clinicianList) {
        return res.json(clinicianList);
    }
    return res.sendStatus(HTTP_NOT_FOUND);

});

router.get('/retrieveTeamByPatientId/:id', async (req, res) => {
    const { id } = req.params;

    const result = await retrieveTeamByPatientId(id);

    if (result) {
        res.json(result);
    } else {
        res.status(404).send('Not found');
    }
});

router.put('/transferTeam', async (req, res) => {
    const data = req.body;
    const patientId = data.patientId
    const supervisorId = data.supervisorId

    const result = await transferTeam(patientId, supervisorId);

    if (result) {
        res.json(result);
    } else {
        res.status(404).send('Not found');
    }
});

export default router;