import bcrypt from "bcrypt";
import { User } from "../patientlist-db/schema.js";

// Retrieve a user's information from the database by email
async function getUserByEmail(email) {
  return await User.findOne({ email: email });
}

// Retrieve a user's information from the database by id
async function getUserById(userId) {
  return await User.findById(userId).populate("team");

}

// Update the user's profile data in the database.
async function updateUserProfile(userProfile) {
  const dbUserProfile = await User.findByIdAndUpdate(
    userProfile._id,
    userProfile,
    { new: true }
  );
  return dbUserProfile !== undefined;
}

// Hash and update the user password in the database.
async function updateUserPassword(userId, newPassword) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const result = await User.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } }
    );
    
    return result.matchedCount > 0 || result.modifiedCount > 0;
  } catch (err) {
    console.error('Error updating user password:', error);
    throw error;
  }
}

// Get all supervisors' data from the database
async function retrieveAllSupervisors() {
  return await User.find({ "isSupervisor": true });
}


// -----------------Create a new entry for a user in the database with hashed password
async function createUser(data) {
  const password = await bcrypt.hash(data.password, 10);

  const user = new User({
    ...data,
    password: password,
  });
  return await user.save();
}

// -----------------Delete a user from the database
async function deleteUser(userId) {
  return await User.findByIdAndDelete(userId);
}

// async function updateUser(userId, data) {
//   return await User.findByIdAndUpdate(userId, data, { new: true });
// }

export {
  getUserByEmail,
  getUserById,
  updateUserProfile,
  updateUserPassword,
  retrieveAllSupervisors,
  createUser,
  deleteUser,
  // updateUser,
};
