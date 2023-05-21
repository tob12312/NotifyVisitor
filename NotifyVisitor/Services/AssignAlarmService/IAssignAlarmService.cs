using NotifyVisitor.Dtos.AssignAlarm;
using NotifyVisitor.Dtos.Visitor;
using NotifyVisitor.Models;
using Microsoft.AspNetCore.Mvc;


namespace NotifyVisitor.Services.RoomAlarmService
{
    /// <summary>
    /// Interface for entity AssignAlarm. CRUD API.
    /// 
    /// Alarms are assigned to Rooms and contains an alarmText and a default empty Notification.
    /// A Notification is a text attachment that is included in the Alarm SMS.
    /// Notifications can be aimed at each Room/ Floor/ Building/ Site and can be edited by User.
    ///
    /// User can create and delete Assignments for all Rooms in Site or for single Room.
    /// User can create and edit Assignment Notifications for all Rooms in Site or single Room.
    /// Created Notifications are added as new Notifications to DB.
    ///
    /// Deleting Site Assignment deletes all Notification variations of same Assignment.
    /// Deleting Assignments does not delete the involved entities, only the relation.
    /// </summary>
    public interface IAssignAlarmService
    {
        // Get single Assignment by Ids
        Task<ServiceResponse<GetAssignAlarmDtocs>> GetSingle(int alarmId, int roomId, int notificationId);

        // Get all Assignments
        Task<ServiceResponse<List<GetAssignAlarmDtocs>>> GetAssignedAlarms();

        // Get all Assignments with sort and filter
        Task<ServiceResponse<List<GetAssignAlarmDtocs>>> Index
            (
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn
            );

        // Get all Assignments tied to one unique Alarm.
        Task<ServiceResponse<List<GetAssignAlarmDtocs>>> GetAssignedAlarmsPerAlarm(int alarmId);

        // Add Assignment to DB.
        Task<ServiceResponse<GetAssignAlarmDtocs>> AddAssignedAlarm(AddAssignAlarmDto newAssignedAlarm);

        // Update Assignment Notification.
        Task<ServiceResponse<GetAssignAlarmDtocs>> UpdateAssignAlarm(
           int alarmId, int roomId, int notificationId, int newNotificationId);

        // Delete one Assignment.
        Task<ServiceResponse<List<GetAssignAlarmDtocs>>> Delete(int alarmId, int roomId, int notificationId);

        // Delete all Assignments per Alarm per Site (delete for all Rooms in Site)
        Task<ServiceResponse<List<GetAssignAlarmDtocs>>> DeleteAssignedSite(int alarmId, int siteId);
    }

}
