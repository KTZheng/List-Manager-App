import { Notification, User, Patient } from "../patientlist-db/schema.js";

// Get all notifications
async function retrieveNotificationList() {

    const notifications= await Notification.find();
    return notifications;
}

// Get the notification for current login user
async function retrieveUserOfNotification(id) {

    const user = await User.findOne({ _id:id });

    const notificationsOfUser = await User.populate(user, 'notification');

    const notifications = notificationsOfUser.notification;

    await Notification.populate(notifications, 'patient');

    return notificationsOfUser.notification;
}

// Get unread notification for curret login user
async function retrieveUnreadNotification(id) {
    
    const user = await User.findOne({ _id: id });
    const unReadNotification = await Notification.find({ isRead: false, recipient: user._id }).populate('patient').populate('entity');
    return unReadNotification;

}

// Delete the notification with the object ID
async function deleteNotification(id) {
    await Notification.deleteOne({ _id: id })
    await User.updateOne(
        {},
        { $pull: { notification: id } }
    )
    await Patient.updateOne(
        {},
        { $pull: { notification: id } }
    )
}

// Unread notification update to isRead
async function updateNotificationSatus(id) {

    const notification = await Notification.findOne({ _id: id });

    if (notification) {
        notification.isRead = true;
        await notification.save();

        return true;
    }
    return false;

}


export {
    retrieveNotificationList,
    retrieveUserOfNotification,
    retrieveUnreadNotification,
    deleteNotification,
    updateNotificationSatus
};