using AutoMapper;
using NotifyVisitor.Data;
using NotifyVisitor.Dtos.Notification;
using NotifyVisitor.Models;
using NotifyVisitor.Services.NotificationService;
using Microsoft.EntityFrameworkCore;

namespace NotifyVisitor.Services.RoomService
{
    /// <summary>
    /// Service class for Entity Notification. CRUD API.
    /// 
    /// A Notification is a text attachment that is included in the Alarm SMS.
    /// Notifications can be aimed at each Room/ Floor/ Building/ Site and can be edited by User.
    /// User can create and edit Assignment Notifications for all Rooms in Site or single Room.
    /// </summary>
    public class NotificationService : INotificationService
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;

        public NotificationService(IMapper mapper, ApplicationDbContext context)
        {
            _context = context;
            _mapper = mapper;
        }

        // Add Notification to DB.
        public async Task<ServiceResponse<List<GetNotificationDto>>> AddNotification(AddNotificationDto newNotification)
        {
            ServiceResponse<List<GetNotificationDto>> serviceResponse = new();
            Notification notification = _mapper.Map<Notification>(newNotification);

            await _context.Notification.AddAsync(notification);
            await _context.SaveChangesAsync();
            serviceResponse.Data = (_context.Notification.Select(r => _mapper.Map<GetNotificationDto>(r))).ToList();

            return serviceResponse;
        }

        // Get all Notifications
        public async Task<ServiceResponse<List<GetNotificationDto>>> GetAllNotifications()
        {
            ServiceResponse<List<GetNotificationDto>> serviceResponse = new();
            List<Notification> dbNotifications= await _context.Notification.ToListAsync();

            serviceResponse.Data = dbNotifications.Select(r => _mapper.Map<GetNotificationDto>(r)).ToList();
            return serviceResponse;
        }

        // Get single Notification.
        public async Task<ServiceResponse<GetNotificationDto>> GetNotificationById(int id)
        {
            ServiceResponse<GetNotificationDto> serviceResponse = new();
            Notification dbNotification = await _context.Notification
                .FirstOrDefaultAsync(c => c.Id == id);

            serviceResponse.Data = _mapper.Map<GetNotificationDto>(dbNotification);
            return serviceResponse;
        }

        // Get all Notifications with sort and filter.
        public async Task<ServiceResponse<List<GetNotificationDto>>> Index(
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn)
        {

            ServiceResponse<List<GetNotificationDto>> serviceResponse = new();
            List<Notification> dbNotifications = await _context.Notification
                .ToListAsync();

            var notifications = from s in dbNotifications
                         select s;

            // search by Id
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "id")
            {
                notifications = notifications.Where(s => s.Id
                .ToString()
                .Contains(searchString));
            }
            // search by column Name
            if (!String.IsNullOrEmpty(searchString) &&

                searchColumn == "name")
            {
                notifications = notifications.Where(s => s.Name
                .ToUpperInvariant()
                .Contains(searchString
                .ToUpperInvariant()));
            } 
            // search by column Text
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "text")
            {
                notifications = notifications.Where(s => s.Text
                .ToUpperInvariant()
                .Contains(searchString
                .ToUpperInvariant()));
            }
            // Sorting - switching sortOrder and -column
            notifications = (sortColumn, sortOrder)
            switch
            {
                ("name", "desc") => notifications.OrderByDescending(s => s.Name),
                ("name", "asc") => notifications.OrderBy(s => s.Name),
                ("text", "desc") => notifications.OrderByDescending(s => s.Text),
                ("text", "asc") => notifications.OrderBy(s => s.Text),
                ("id", "desc") => notifications.OrderByDescending(s => s.Id),
                _ => notifications.OrderBy(s => s.Id),
            };
            serviceResponse.Data = notifications.Select(r => _mapper.Map<GetNotificationDto>(r)).ToList();
            return serviceResponse;
        }

        // Update Notification to DB.
        public async Task<ServiceResponse<GetNotificationDto>> UpdateNotification(UpdateNotificationDto updatedNotification)
        {
            ServiceResponse<GetNotificationDto> serviceResponse = new();
            try
            {
                Notification notification = await _context.Notification
                    .FirstOrDefaultAsync(r => r.Id == updatedNotification.Id);
                notification.Name = updatedNotification.Name;
                notification.Text = updatedNotification.Text;
                notification.CreatedDateTime = updatedNotification.CreatedDateTime;
                serviceResponse.Data = _mapper.Map<GetNotificationDto>(notification);

                _context.Notification.Update(notification);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }
        
        // Delete Notification from DB.
        public async Task<ServiceResponse<List<GetNotificationDto>>> DeleteNotification(int id)
        {
            ServiceResponse<List<GetNotificationDto>> serviceResponse = new();
            try
            {
                Notification notification = await _context.Notification.FirstAsync(r => r.Id == id);
                _context.Notification.Remove(notification);
                await _context.SaveChangesAsync();

                serviceResponse.Data = (_context.Notification
                    .Select(r => _mapper.Map<GetNotificationDto>(r))).ToList();
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }
    }
}
