using NotifyVisitor.Dtos.Notification;

namespace NotifyVisitor.Services.NotificationService
{
    /// <summary>
    /// Interface for Entity Notification. CRUD API.
    /// 
    /// A Notification is a text attachment that is included in the Alarm SMS.
    /// Notifications can be aimed at each Room/ Floor/ Building/ Site and can be edited by User.
    /// User can create and edit Assignment Notifications for all Rooms in Site or single Room.
    /// </summary>
    public interface INotificationService
    {
        // Get all Notifications.
        Task<ServiceResponse<List<GetNotificationDto>>> GetAllNotifications();

        // Get all Notifications sort and filter.
        Task<ServiceResponse<List<GetNotificationDto>>> Index
            (
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn
            );

        // Get single Notification by Id.
        Task<ServiceResponse<GetNotificationDto>> GetNotificationById(int Id);

        // Add Notification to DB.
        Task<ServiceResponse<List<GetNotificationDto>>> AddNotification(AddNotificationDto newNotification);

        // Update Notification to DB.
        Task<ServiceResponse<GetNotificationDto>> UpdateNotification(UpdateNotificationDto updatedNotification);

        // Delete Notification from DB.
        Task<ServiceResponse<List<GetNotificationDto>>> DeleteNotification(int id);
    }
}