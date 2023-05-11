// import {User, Task} from '../patientlist-db/schema.js';

// //find user by id
// async function findUserById(userId) {
//     const user = await User.find({_id: userId});
//     return user;
// }

// //update user 
// async function updateUser(user) { 

//     const bdUser = await User.findById(user._id);
//     if(bdUser){
//         bdUser.fname = user.fname;
//         bdUser.lname = user.lname;
//         bdUser.email = user.email;
//         bdUser.phone = user.phone;
//         bdUser.password = user.password;
//         bdUser.role = user.role;
//         bdUser.avatar = user.avatar;
//         bdUser.isSupervisor = user.isSupervisor;
//         bdUser.isAdmin = user.isAdmin;
//         await bdUser.save();
//         return true;
//     }
//     return false;
// }



// // find all done tasks by a user within seven days of current data
// async function findSevenDayDoneTasksByUser(userId) {
//     //find all tasks for each clinician 
//     const tasks = await Task.find({clinician: userId, finished_at: {$gte: new Date(Date.now() - 7*24*60*60*1000)}});
//     return tasks;

// }


