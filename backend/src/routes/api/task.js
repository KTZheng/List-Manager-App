import { retrieveTask, retrieveTasks, updateTask, deleteTask, createTask, retrieveTasksByPatientId,retrieveCompletedTasks } from "../../dao/task-dao"
import express from 'express';
import { authenticate } from '../../middleware/authMiddleware';

const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const HTTP_NO_CONTENT = 204;

const router = express.Router();

//Retrieve all tasks
router.get('/', async (req, res) => {
   res.json(await retrieveTasks())
});

//Retrieve task by task id
router.get('/:id', async (req, res) => {
   const { id } = req.params;
   const task = await retrieveTask(id);
   if (task) {
      res.json(task);
   }
   else {
      res.sendStatus(HTTP_NOT_FOUND);
   }
});

//Retrieve completed tasks by clinician id
router.get('/completed/:clinicianId', authenticate, async (req, res) => {
   const { clinicianId } = req.params;
   const task = await retrieveCompletedTasks(clinicianId);
   if (task) {
      res.json(task);
   }  else {
      res.sendStatus(HTTP_NOT_FOUND);
   }
});

// router.get('/completed/:clinicianId', async (req, res) => {
//    const { clinicianId } = req.params;
//    const task = await retrieveCompletedTasks(clinicianId);
//    if (task) {
//       res.json(task);
//    }  else {
//       res.sendStatus(HTTP_NOT_FOUND);
//    }
// });


//retrieve patient's tasks by patient id
router.get('/patienttasks/:id', async (req, res) => {
   const { id } = req.params;
   const tasks = await retrieveTasksByPatientId(id);
   if (tasks) {
       res.json(tasks);
   } else {
       res.sendStatus(HTTP_NOT_FOUND);
   }
});

//retrieve patient's incomplete tasks by patient id
router.get('/incompletetasks/:id', async (req, res) => {
   const { id } = req.params;
   const tasks = await retrieveTasksByPatientId(id);
   const filteredTasks = tasks.filter(task => task.status !== 2);
   if (filteredTasks) {
       res.json(filteredTasks);
   } else {
       res.sendStatus(HTTP_NOT_FOUND);
   }
});

//Delete task by task id
router.delete('/:id', async (req, res) => {
   const { id } = req.params;
   await deleteTask(id);
   res.sendStatus(HTTP_NO_CONTENT);
});

//Create task
router.post('/createtask', async (req, res) => {
   const task = req.body;
   const success = await createTask(task)
   res.sendStatus(success ? HTTP_CREATED : HTTP_NOT_FOUND);
});

//Update task
router.put('/updatetask/:id', async (req, res) => {
   const { id } = req.params;
   const data = req.body;
   const result = await updateTask(id, data);
   if (result) {
       res.json(result);
   } else {
       res.status(HTTP_NOT_FOUND).send('Not found');
   }
});


export default router;