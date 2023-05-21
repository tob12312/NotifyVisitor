using AutoMapper;
using NotifyVisitor.Data;
using NotifyVisitor.Models;
using Microsoft.EntityFrameworkCore;
using NotifyVisitor.Dtos.AssignAlarm;

namespace NotifyVisitor.Services.RoomAlarmService
{
    /// <summary>
    /// Service class for entity AssignAlarm. CRUD API.
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
    public class AssignAlarmService : IAssignAlarmService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public AssignAlarmService(ApplicationDbContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        // Add new assignment to DB.
        public async Task<ServiceResponse<GetAssignAlarmDtocs>> AddAssignedAlarm(AddAssignAlarmDto newAssignAlarm)
        {
            ServiceResponse<GetAssignAlarmDtocs> response = new();
            try
            {
                // Look for involved objects
                Alarm alarm = await _context.Alarm
                    .FirstOrDefaultAsync(r => r.Id == newAssignAlarm.AlarmId);
                if (alarm == null)
                {
                    response.Success = false;
                    response.Message = "Alarm not found.";
                    return response;
                }
                Room room = await _context.Room
                    .FirstOrDefaultAsync(a => a.Id == newAssignAlarm.RoomId);
                if (room == null)
                {
                    response.Success = false;
                    response.Message = "Room not found.";
                    return response;
                }
                Notification notification = await _context.Notification
                    .FirstOrDefaultAsync(a => a.Id == newAssignAlarm.NotificationId);
                if (notification == null)
                {
                    response.Success = false;
                    response.Message = "Notification not found.";
                    return response;
                }
                // New AssignAlarm. Only one unique Alarm allowed per Room.
                AssignAlarm assignAlarm = new()
                {
                    Room = room,
                    Alarm = alarm,
                    Notification = notification
                };

                await _context.AssignAlarm.AddAsync(assignAlarm);
                await _context.SaveChangesAsync();
                response.Data = _mapper.Map<GetAssignAlarmDtocs>(alarm);
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        // Delete one unique Assignment from DB.
        public async Task<ServiceResponse<List<GetAssignAlarmDtocs>>> Delete(int alarmId, int roomId, int notificationId)
        {
            ServiceResponse<List<GetAssignAlarmDtocs>> serviceResponse = new();
            try
            {
                AssignAlarm roomAlarm = await _context.AssignAlarm
                    .FirstAsync(r => r.AlarmId == alarmId && r.RoomId == roomId && r.NotificationId == notificationId);
                _context.AssignAlarm.Remove(roomAlarm);
                await _context.SaveChangesAsync();
                serviceResponse.Data = (_context.AssignAlarm.Select(r => _mapper.Map<GetAssignAlarmDtocs>(r))).ToList();
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }

        //Delete all Assignments for one unique Alarm for all Rooms in one unique Site - all Notification variations.
        public async Task<ServiceResponse<List<GetAssignAlarmDtocs>>> DeleteAssignedSite(int alarmId, int siteId)
        {
            ServiceResponse<List<GetAssignAlarmDtocs>> serviceResponse = new();
            try
            {
                // Find and delete all Rooms in Site assigned to the unique Alarm.
                List<AssignAlarm> assignedAlarms = await _context.AssignAlarm.Include(aa => aa.Room)
                    .Where(aa => aa.AlarmId == alarmId && aa.Room.SiteId == siteId)
                    .ToListAsync();
                if (assignedAlarms != null)
                {
                    foreach (AssignAlarm alarm in assignedAlarms) 
                    { 
                        _context.AssignAlarm.Remove(alarm); 
                    }
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            // returns updated list. Ignors Not Found.
            serviceResponse.Data = (_context.AssignAlarm.Select(r => _mapper.Map<GetAssignAlarmDtocs>(r))).ToList();
            return serviceResponse;
        }


        // Get all assignments, including alarm, notification, room + roomVisitors.
        // Includes all involved objects.
        public async Task<ServiceResponse<List<GetAssignAlarmDtocs>>> GetAssignedAlarms()
        {
            ServiceResponse<List<GetAssignAlarmDtocs>> serviceResponse = new();
            List<AssignAlarm> dbAssignedAlarms = await _context.AssignAlarm
                .Include(aa => aa.Alarm)
                .Include(aa => aa.Room).Include(r => r.Room.RoomVisitors).ThenInclude(v => v.Visitor)
                .Include(aa => aa.Notification)
                .ToListAsync();

            serviceResponse.Data = dbAssignedAlarms.Select(r => _mapper.Map<GetAssignAlarmDtocs>(r)).ToList();
            return serviceResponse;
        }

        // Get all Assignements involving one unique Alarm.
        // Includes all involved objects.
        public async Task<ServiceResponse<List<GetAssignAlarmDtocs>>> GetAssignedAlarmsPerAlarm(int alarmId)
        {
            ServiceResponse<List<GetAssignAlarmDtocs>> serviceResponse = new();
            List<AssignAlarm> dbAssignedAlarms = await _context.AssignAlarm
                .Include(aa => aa.Alarm).Where(aa => aa.AlarmId == alarmId)
                .Include(aa => aa.Room).Include(r => r.Room.RoomVisitors).ThenInclude(v => v.Visitor)
                .Include(aa=> aa.Notification)
                .Where(aa => aa.AlarmId == alarmId)
                .ToListAsync();

            serviceResponse.Data = dbAssignedAlarms.Select(r => _mapper.Map<GetAssignAlarmDtocs>(r)).ToList();
            return serviceResponse;
        }


        // Gets one AssignAlarm + Alarm, Room, Notification
        public async Task<ServiceResponse<GetAssignAlarmDtocs>> GetSingle(int alarmId, int roomId, int notificationId)
        {
            ServiceResponse<GetAssignAlarmDtocs> serviceResponse = new();
            AssignAlarm dbAssignedAlarm = await _context.AssignAlarm
                .Include(aa => aa.Alarm)
                .Include(aa => aa.Room).Include(r => r.Room.RoomVisitors).ThenInclude(v => v.Visitor)
                .Include(aa => aa.Notification)
                .FirstOrDefaultAsync(aa => aa.AlarmId == alarmId && aa.RoomId == roomId && aa.NotificationId == notificationId);

            serviceResponse.Data = _mapper.Map<GetAssignAlarmDtocs>(dbAssignedAlarm);
            return serviceResponse;
        }


        // Update the Assignments Notification
        public async Task<ServiceResponse<GetAssignAlarmDtocs>> UpdateAssignAlarm(
            int alarmId, int roomId, int notificationId, int newNotificationId)
        {
            ServiceResponse<GetAssignAlarmDtocs> response = new();
            try
            {
                // Find the old relation.
                AssignAlarm aa = await _context.AssignAlarm
                .FirstOrDefaultAsync(r => r.AlarmId == alarmId &&
                r.RoomId == roomId && r.NotificationId == notificationId);
                if (aa == null)
                {
                    response.Success = false;
                    response.Message = "Assigment not found.";
                    return response;
                }
                // delete old relation.
                _context.AssignAlarm.Remove(aa);
                await _context.SaveChangesAsync();

                // Find the involved objects.
                Alarm alarm = await _context.Alarm
                   .FirstOrDefaultAsync(r => r.Id == alarmId);
                if (alarm == null)
                {
                    response.Success = false;
                    response.Message = "Alarm not found.";
                    return response;
                }
                Room room = await _context.Room
                    .FirstOrDefaultAsync(a => a.Id == roomId);
                if (room == null)
                {
                    response.Success = false;
                    response.Message = "Room not found.";
                    return response;
                }
                Notification notification = await _context.Notification
                    .FirstOrDefaultAsync(a => a.Id == notificationId);
                if (notification == null)
                {
                    response.Success = false;
                    response.Message = "Notification not found.";
                    return response;
                }
                Notification newNote = await _context.Notification
                        .FirstOrDefaultAsync(a => a.Id == newNotificationId);
                if (newNote == null)
                {
                    response.Success = false;
                    response.Message = "New Notification not found.";
                    return response;
                }
                // new relation
                AssignAlarm assignAlarm = new()
                {
                    Room = room,
                    Alarm = alarm,
                    Notification = newNote
                };
                await _context.AssignAlarm.AddAsync(assignAlarm);
                await _context.SaveChangesAsync();
                response.Data = _mapper.Map<GetAssignAlarmDtocs>(assignAlarm);
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }
  
        // Get all Assignments with sort and filter.
        public async Task<ServiceResponse<List<GetAssignAlarmDtocs>>> Index(
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn)
        {
            // Including involved objects.
            ServiceResponse<List<GetAssignAlarmDtocs>> serviceResponse = new();
            List<AssignAlarm> dbAssignedAlarms = await _context.AssignAlarm
                .Include(aa => aa.Alarm)
                .Include(aa => aa.Room).Include(r => r.Room.RoomVisitors).ThenInclude(v => v.Visitor)
                .Include(aa => aa.Notification)
                .ToListAsync();

            var assigned = from s in dbAssignedAlarms
                        select s;

            // search by SiteId
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "siteId")
            {
                assigned = assigned.Where(s => s.Room.SiteId
                .ToString()
                .Contains(searchString));
            }
            // search by RoomName
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "room")
            {
                assigned = assigned.Where(s => s.Room.Name
                .ToUpperInvariant()
                .Contains(searchString
                .ToUpperInvariant()));
            }
            // search by AlarmName
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "alarm")
            {
                assigned = assigned.Where(s => s.Alarm.Name
                .ToUpperInvariant()
                .Contains(searchString
                .ToUpperInvariant()));
            }
            // search by AlarmText
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "alarmText")
            {
                assigned = assigned.Where(s => s.Alarm.AlarmText
                .ToUpperInvariant()
                .Contains(searchString
                .ToUpperInvariant()));
            }
            // search by NotificationName
            if (!String.IsNullOrEmpty(searchString) &&
            searchColumn == "notification")
            {
                assigned = assigned.Where(s => s.Notification.Name
                .ToUpperInvariant()
                .Contains(searchString
                .ToUpperInvariant()));
            }
            // search by Notification Text
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "attachment")
            {
                assigned = assigned.Where(s => s.Notification.Text
                .ToUpperInvariant()
                .Contains(searchString
                .ToUpperInvariant()));
            }
            // sort column/ attribute, ascending/ descending
                assigned = (sortColumn, sortOrder)
            switch
            {
                ("notification", "desc") => assigned.OrderByDescending(s => s.Notification.Name),
                ("notification", "asc") => assigned.OrderBy(s => s.Notification.Name),
                ("room", "desc") => assigned.OrderByDescending(s => s.Room.Name),
                ("room", "asc") => assigned.OrderBy(s => s.Room.Name),
                ("alarm", "desc") => assigned.OrderByDescending(s => s.Alarm.Name),
                ("alarm", "asc") => assigned.OrderBy(s => s.Alarm.Name),
                ("attachment", "desc") => assigned.OrderByDescending(s => s.Notification.Text),
                ("attachment", "asc") => assigned.OrderBy(s => s.Notification.Text),
                ("alarmText", "desc") => assigned.OrderByDescending(s => s.Alarm.AlarmText),
                ("alarmText", "asc") => assigned.OrderBy(s => s.Alarm.AlarmText),
                ("siteId", "desc") => assigned.OrderByDescending(s => s.Room.SiteId),
                _ => assigned.OrderBy(s => s.Room.SiteId),
            };

            serviceResponse.Data = assigned.Select(r => _mapper.Map<GetAssignAlarmDtocs>(r)).ToList();
            return serviceResponse;
        }

    }
}
