using AutoMapper;
using NotifyVisitor.Data;
using NotifyVisitor.Dtos.Alarm;
using NotifyVisitor.Dtos.TriggeredAlarm;
using NotifyVisitor.Models;
using NotifyVisitor.Services.AlarmService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Sms = NotifyVisitor.Models.Sms;

namespace NotifyVisitor.Services.RoomService
{
    public class AlarmService : IAlarmService
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;

        public AlarmService(IMapper mapper, ApplicationDbContext context)
        {
            _context = context;
            _mapper = mapper;
        }

        // Function for adding new Alarm to DB.
        public async Task<ServiceResponse<List<GetAlarmDto>>> AddAlarm(AddAlarmDto newAlarm)
        {
            ServiceResponse<List<GetAlarmDto>> serviceResponse = new ServiceResponse<List<GetAlarmDto>>();
            Alarm alarm = _mapper.Map<Alarm>(newAlarm);

            await _context.Alarm.AddAsync(alarm);
            await _context.SaveChangesAsync();
            serviceResponse.Data = (_context.Alarm.Select(r => _mapper.Map<GetAlarmDto>(r))).ToList();

            return serviceResponse;
        }

        // Function for getting all alarms
        public async Task<ServiceResponse<List<GetAlarmDto>>> GetAllAlarms()
        {
            ServiceResponse<List<GetAlarmDto>> serviceResponse = new ServiceResponse<List<GetAlarmDto>>();
            List<Alarm> dbRooms = await _context.Alarm
                .ToListAsync();
            serviceResponse.Data = dbRooms.Select(r => _mapper.Map<GetAlarmDto>(r)).ToList();
            return serviceResponse;
        }

        // Function for get Alarm by ID.
        public async Task<ServiceResponse<GetAlarmDto>> GetAlarmById(int id)
        {
            ServiceResponse<GetAlarmDto> serviceResponse = new ServiceResponse<GetAlarmDto>();
            Alarm dbAlarm = await _context.Alarm
                .FirstOrDefaultAsync(c => c.Id == id);
   
            serviceResponse.Data = _mapper.Map<GetAlarmDto>(dbAlarm);
            return serviceResponse;
        }

        // Function for getting all Alarms with sort and filter.
        public async Task<ServiceResponse<List<GetAlarmDto>>> Index(
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn)
        {

            ServiceResponse<List<GetAlarmDto>> serviceResponse = new ServiceResponse<List<GetAlarmDto>>();
            List<Alarm> dbAlarms = await _context.Alarm
                .ToListAsync();

            var alarms = from s in dbAlarms
                         select s;

            // search by Id
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "id")
            {
                alarms = alarms.Where(s => s.Id
                .ToString()
                .Contains(searchString));
            }
            // search by RoomName
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "name")
            {
                alarms = alarms.Where(s => s.Name
                .ToUpperInvariant()
                .Contains(searchString
                .ToUpperInvariant()));
            }
            // search by Description
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "description")
            {
                alarms = alarms.Where(s => s.Description
                .ToUpperInvariant()
                .Contains(searchString
                .ToUpperInvariant()));
            }
            // search by alarmText
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "alarmText")
            {
                alarms = alarms.Where(s => s.AlarmText
                .ToUpperInvariant()
                .Contains(searchString
                .ToUpperInvariant()));
            }
            // search by column isActive
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "isactive")
            {
                alarms = alarms.Where(s => s.IsActive
                .ToString()
                .Contains(searchString));
            }
            // Sorting - switching sortOrder and -column
            alarms = (sortColumn, sortOrder)
            switch
            {
                ("name", "desc") => alarms.OrderByDescending(s => s.Name),
                ("name", "asc") => alarms.OrderBy(s => s.Name),
                ("description", "desc") => alarms.OrderByDescending(s => s.Description),
                ("description", "asc") => alarms.OrderBy(s => s.Description),
                ("alarmText", "desc") => alarms.OrderByDescending(s => s.AlarmText),
                ("alarmText", "asc") => alarms.OrderBy(s => s.AlarmText),
                ("isactive", "desc") => alarms.OrderByDescending(s => s.IsActive),
                ("isactive", "asc") => alarms.OrderBy(s => s.IsActive),
                ("id", "desc") => alarms.OrderByDescending(s => s.Id),
                _ => alarms.OrderBy(s => s.Id),
            };
            serviceResponse.Data = alarms.Select(r => _mapper.Map<GetAlarmDto>(r)).ToList();
            return serviceResponse;
        }

        // Updating Alarm to DB
        public async Task<ServiceResponse<GetAlarmDto>> UpdateAlarm(UpdateAlarmDto updatedAlarm)
        {
            ServiceResponse<GetAlarmDto> serviceResponse = new();
            try
            {
                Alarm alarm = await _context.Alarm
                    .FirstOrDefaultAsync(r => r.Id == updatedAlarm.Id);
                if (alarm == null)
                {
                    serviceResponse.Success = false;
                    serviceResponse.Message = "Alarm not found";
                    return serviceResponse;
                }
                alarm.Name = updatedAlarm.Name;
                alarm.Description = updatedAlarm.Description;
                alarm.AlarmText = updatedAlarm.AlarmText;
                alarm.IsActive = updatedAlarm.IsActive;
                alarm.CreatedDateTime = updatedAlarm.CreatedDateTime;
            //    alarm.UserName = updatedAlarm.UserName;
                serviceResponse.Data = _mapper.Map<GetAlarmDto>(alarm);

                _context.Alarm.Update(alarm);
                await _context.SaveChangesAsync();

                // If alarm is triggered - call triggeredAlarm
                if (updatedAlarm.IsActive == 1)
                {
                    await TriggerAlarm(alarm.Id);
                }
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }

        // Create SMS messages to all conserned Visitors based on triggered Alarm. 
        // If Visitors are notified, data are stored in histoy table TriggeredAlarms.
        // If no Visitors are notified (Room not assigned  / no Visitors present), no data is trasfered to hitory.
        public async Task<ServiceResponse<List<Sms>>> TriggerAlarm(int alarmId)
        {
            ServiceResponse<List<Sms>> serviceResponse = new();

            // Find the triggered alarm and assigned objects.
            List<AssignAlarm> dbAssignedAlarms = await _context.AssignAlarm
                .Include(c => c.Alarm)
                .Include(c => c.Room)
                .Include(c => c.Notification)
                .Include(c => c.Room.RoomVisitors)
                    .ThenInclude(rv => rv.Visitor)
                .Where(a => a.AlarmId == alarmId)
                .ToListAsync();

            // Get all Sites for Site name
            List<Site> sites = await _context.Site.ToListAsync();

            // New list for SMS messages
            List<Sms> alarmNotifications = new();

            // Declare object refs.
            Room room = null;
            Alarm alarm = null;
            Notification notification = null;
            Site site = null;            
            Visitor visitor = null;

            // Loop response from DB and select values for each Visitor
            foreach (var assignAlarm in dbAssignedAlarms)
            {
                 room = assignAlarm.Room;
                 alarm = assignAlarm.Alarm;
                 notification = assignAlarm.Notification;
                // Get Site name based on Room.SiteId
                 site = sites.FirstOrDefault(s => s.Id == room.SiteId);

                // Loop Visitors in each Room
                foreach (var roomVisitor in room.RoomVisitors)
                {
                    visitor = roomVisitor.Visitor;
                    // Create SMS message and link to Visitors PhoneNumber
                    string message = "Alarm : "+alarm.Name+", "+site.Name+", "+room.Name+".\r\n"+alarm.AlarmText+" "+notification.Text;
                    Sms sms = new(toPhoneNumber: visitor.Telephone, message: message);
                    // Put SMS in response
                    alarmNotifications.Add(sms);

                    Debug.WriteLine(sms.message);

                    // Loop historic values into TriggeredAlarm if Visitors notified.
                    TriggeredAlarm triggeredAlarm = new()
                    {
                        AlarmId = alarm.Id,
                        RoomId = room.Id,
                        NotificationId = notification.Id,
                        SiteId = site.Id,
                        VisitorId = visitor.Id,
                        Telephone = visitor.Telephone,
                        SMS = sms.message,
                    };
                    // save new TriggeredAlarm to DB
                    await _context.TriggeredAlarm.AddAsync(triggeredAlarm);
                    await _context.SaveChangesAsync();
                }
            }
            // Put response in serviceRespons.Data 
            serviceResponse.Data = alarmNotifications;

            // Post SMS to each Visitor with PostSms.
            foreach (var sms in alarmNotifications)
            {
                Debug.WriteLine(sms);
                PostSms(sms);
            }
            return serviceResponse;
        }

        // Send SMS to Visitors using Twilio
        [HttpPost]
        public async Task<ServiceResponse<Sms>> PostSms(Sms sms)
        {
            ServiceResponse<Sms> serviceResponse = new();

            try { 
                var builder = WebApplication.CreateBuilder();

                string _accountSid = builder.Configuration.GetValue<string>("TwilioAccountDetails:accountSid");
                string _authToken = builder.Configuration.GetValue<string>("TwilioAccountDetails:authToken");
                string _twilioNumber = builder.Configuration.GetValue<string>("TwilioAccountDetails:fromPhoneNumber");
                Debug.WriteLine(_accountSid + " " + _authToken + " " + _twilioNumber);
                Debug.WriteLine("PostSms running " + sms.message + " /pNumber: " + sms.toPhoneNumber);
                string toPhoneNumber = "+47" + sms.toPhoneNumber;

                TwilioClient.Init(_accountSid, _authToken);

                var message = MessageResource.Create(
                    body: sms.message,
                    from: new Twilio.Types.PhoneNumber(_twilioNumber),
                    to: new Twilio.Types.PhoneNumber(toPhoneNumber)
                );
                //          Console.WriteLine(message.Sid);
                
            } 
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            serviceResponse.Data = sms;
            return serviceResponse;
        }

        // Function for getting all Triggered Alarms (History) with sort and filter.
        public async Task<ServiceResponse<List<GetTriggeredAlarmDto>>> TriggeredAlarms(
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn)
        {
            ServiceResponse<List<GetTriggeredAlarmDto>> serviceResponse = new();
            List<TriggeredAlarm> dbAlarms = await _context.TriggeredAlarm
                .ToListAsync();

            var alarms = from s in dbAlarms
                         select s;
            // search by Id
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "id")
            {
                alarms = alarms.Where(s => s.Id
                .ToString()
                .Contains(searchString));
            }
            // search by alarmId
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "alarmId")
            {
                alarms = alarms.Where(s => s.AlarmId
                .ToString()
                .Contains(searchString));
            }
            // search by roomId
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "roomId")
            {
                alarms = alarms.Where(s => s.RoomId
                .ToString()
                .Contains(searchString));
            }
            // search by siteId
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "siteId")
            {
                alarms = alarms.Where(s => s.SiteId
                .ToString()
                .Contains(searchString));
            }
            // search by notificationId
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "NotificationId")
            {
                alarms = alarms.Where(s => s.NotificationId
                .ToString()
                .Contains(searchString));
            }
            // search by visitorId
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "visitorId")
            {
                alarms = alarms.Where(s => s.VisitorId
                .ToString()
                .Contains(searchString));
            }
            // search by telephone
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "telephone")
            {
                alarms = alarms.Where(s => s.Telephone
                .ToString()
                .Contains(searchString));
            }
            // search by SMS
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "SMS")
            {
                alarms = alarms.Where(s => s.SMS
                .ToUpperInvariant()
                .Contains(searchString
                .ToUpperInvariant()));
            }

            // Sorting - switching sortOrder and -column
            alarms = (sortColumn, sortOrder)
            switch
            {
                ("alarmId", "desc") => alarms.OrderByDescending(s => s.AlarmId),
                ("alarmId", "asc") => alarms.OrderBy(s => s.AlarmId),
                ("roomId", "desc") => alarms.OrderByDescending(s => s.RoomId),
                ("roomId", "asc") => alarms.OrderBy(s => s.RoomId),
                ("siteId", "desc") => alarms.OrderByDescending(s => s.SiteId),
                ("siteId", "asc") => alarms.OrderBy(s => s.SiteId),
                ("notificationId", "desc") => alarms.OrderByDescending(s => s.NotificationId),
                ("notificationId", "asc") => alarms.OrderBy(s => s.NotificationId),
                ("visitorId", "desc") => alarms.OrderByDescending(s => s.VisitorId),
                ("visitorId", "asc") => alarms.OrderBy(s => s.VisitorId),
                ("telephone", "desc") => alarms.OrderByDescending(s => s.Telephone),
                ("telephone", "asc") => alarms.OrderBy(s => s.Telephone),
                ("SMS", "desc") => alarms.OrderByDescending(s => s.SMS),
                ("SMS", "asc") => alarms.OrderBy(s => s.SMS),
                ("id", "desc") => alarms.OrderByDescending(s => s.Id),
                _ => alarms.OrderBy(s => s.Id),
            };
            serviceResponse.Data = alarms.Select(r => _mapper.Map<GetTriggeredAlarmDto>(r)).ToList();
            return serviceResponse;
        }

        // Get COUNT all notified Visitors from triggered Alarms TODAY/ 7 DAYS AGO/ 30 DAYS AGO/ 365 DAYS AGO.
        // Using whole days.
        // Returns List of ints representing count for periods.
        public async Task<ServiceResponse<List<int>>> GetCountTriggeredAlarmsPeriods()
        {
            ServiceResponse<List<int>> serviceResponse = new();
            List<int> counts = new()
            {
                // today
                await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= DateTime.Today).CountAsync(),
                // 7 days back
                await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= DateTime.Today.AddDays(-7)).CountAsync(),
                // 30 days back
                await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= DateTime.Today.AddDays(-30)).CountAsync(),
                // 365 days back
                await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= DateTime.Today.AddDays(-365)).CountAsync()
            };
            serviceResponse.Data = counts;
            return serviceResponse;
        }

        // Get COUNT all notified Visitors from triggered Alarms TODAY/ 7 DAYS AGO/ 30 DAYS AGO/ 365 DAYS AGO.
        // Using whole days.
        // Returns List of ints representing count for periods PER PERIOD.
        public async Task<ServiceResponse<List<int>>> GetCountTriggeredAlarmsPeriodsPerSite(int siteId)
        {
            ServiceResponse<List<int>> serviceResponse = new();
            List<int> counts = new()
            {
                // today
                await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= DateTime.Today && s.SiteId == siteId).CountAsync(),
                // 7 days back
                await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= DateTime.Today.AddDays(-7) && s.SiteId == siteId).CountAsync(),
                // 30 days back
                await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= DateTime.Today.AddDays(-30) && s.SiteId == siteId).CountAsync(),
                // 365 days back
                await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= DateTime.Today.AddDays(-365) && s.SiteId == siteId).CountAsync()
            };
            serviceResponse.Data = counts;
            return serviceResponse;
        }

        // Get COUNT all notified Visitors from DISTINCT triggered Alarms TODAY/ 7 DAYS AGO/ 30 DAYS AGO/ 365 DAYS AGO.
        // Using whole days.
        // Returns List of ints representing count for periods.
        public async Task<ServiceResponse<List<int>>> GetCountDistinctTriggeredAlarmsPeriods()
        {
            ServiceResponse<List<int>> serviceResponse = new();
            List<int> counts = new()
            {
                // today
                await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= DateTime.Today)
                .Select(a => a.AlarmId).Distinct().CountAsync(),
                // 7 days back
                await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= DateTime.Today.AddDays(-7))
                .Select(a => a.AlarmId).Distinct().CountAsync(),
                // 30 days back
                await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= DateTime.Today.AddDays(-30))
                .Select(a => a.AlarmId).Distinct().CountAsync(),
                // 365 days back
                await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= DateTime.Today.AddDays(-365))
                .Select(a => a.AlarmId).Distinct().CountAsync()
            };
            serviceResponse.Data = counts;
            return serviceResponse;
        }

        // Get COUNT all notified Visitors from DISTINCT triggered Alarms TODAY/ 7 DAYS AGO/ 30 DAYS AGO/ 365 DAYS AGO.
        // Using whole days.
        // Returns List of ints representing count for periods PER SITE.
        public async Task<ServiceResponse<List<int>>> GetCountDistinctTriggeredAlarmsPeriodsPerSite(int siteId)
        {
            ServiceResponse<List<int>> serviceResponse = new();
            List<int> counts = new()
            {
                // today
                await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= DateTime.Today && s.SiteId == siteId)
                .Select(a => a.AlarmId).Distinct().CountAsync(),
                // 7 days back
                await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= DateTime.Today.AddDays(-7) && s.SiteId == siteId)
                .Select(a => a.AlarmId).Distinct().CountAsync(),
                // 30 days back
                await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= DateTime.Today.AddDays(-30) && s.SiteId == siteId)
                .Select(a => a.AlarmId).Distinct().CountAsync(),
                // 365 days back
                await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= DateTime.Today.AddDays(-365) && s.SiteId == siteId)
                .Select(a => a.AlarmId).Distinct().CountAsync()
            };
            serviceResponse.Data = counts;
            return serviceResponse;
        }

        // Function for getting COUNT all ROWS from TriggeredAlarms (COUNT all generated SMS).
        // Each Alarm notifies all Visitors in all assigned Rooms (multiple rows). Return COUNT rows.
        public async Task<ServiceResponse<int>> GetCountNotifiedVisitors()
        {
            ServiceResponse<int> serviceResponse = new()
            {
                Data = await _context.TriggeredAlarm.CountAsync()
            };
            return serviceResponse;
        }

        // Function for getting COUNT all rows from TriggeredAlarms (COUNT all generated SMS).
        // Each Alarm notifies all Visitors in all assigned Rooms (multiple rows).
        // Return COUNT rows per period.
        public async Task<ServiceResponse<int>> GetCountNotifiedVisitorsPerPeriod(DateTime from, DateTime to)
        {
            ServiceResponse<int> serviceResponse = new()
            {
                Data = await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= from && s.CreatedDateTime <= to.AddDays(1)).CountAsync()
            };
            return serviceResponse;
        }

        // Function for getting COUNT all DISTINCT TriggeredAlarms where Visitors have been notified
        // Each Alarm notifies all Visitors in all assigned Rooms (multiple rows). Return COUNT per DISTINCT Alarm.Id.
        public async Task<ServiceResponse<int>> GetCountDistinctTriggeredAlarms()
        {
            ServiceResponse<int> serviceResponse = new()
            {
                Data = await _context.TriggeredAlarm.Select(a => a.AlarmId).Distinct().CountAsync()
            };
            return serviceResponse;
        }

        // Function for getting COUNT all DISTINCT TriggeredAlarms where Visitors have been notified
        // Each Alarm notifies all Visitors in all assigned Rooms (multiple rows). Return COUNT per DISTINCT Alarm.Id.
        public async Task<ServiceResponse<int>> GetCountDistinctTriggeredAlarmsPerPeriod(DateTime from, DateTime to)
        {
            ServiceResponse<int> serviceResponse = new()
            {
                Data = await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= from && s.CreatedDateTime <= to.AddDays(1))
                .Select(a => a.AlarmId).Distinct().CountAsync()
            };
            return serviceResponse;
        }

        // Function for getting last triggered alarm (last row in TriggeredAlarms)
        public async Task<ServiceResponse<GetTriggeredAlarmDto>> GetLastTriggeredAlarm()
        {
            ServiceResponse<GetTriggeredAlarmDto> serviceResponse = new();
            TriggeredAlarm dbAlarm = await _context.TriggeredAlarm
                .OrderByDescending(a => a.CreatedDateTime).FirstOrDefaultAsync();

            serviceResponse.Data = _mapper.Map<GetTriggeredAlarmDto>(dbAlarm);
            return serviceResponse;
        }

        // Function for getting last triggered alarm PER SITE (last row in TriggeredAlarms)
        public async Task<ServiceResponse<GetTriggeredAlarmDto>> GetLastTriggeredAlarmPerSite(int siteId)
        {
            ServiceResponse<GetTriggeredAlarmDto> serviceResponse = new();
            TriggeredAlarm dbAlarm = await _context.TriggeredAlarm
                .Where(s => s.SiteId == siteId)
                .OrderByDescending(a => a.CreatedDateTime).FirstOrDefaultAsync();

            serviceResponse.Data = _mapper.Map<GetTriggeredAlarmDto>(dbAlarm);
            return serviceResponse;
        }

        // Function for getting all triggered alarms per Site (siteId). Where Visitors are notified.
        public async Task<ServiceResponse<List<GetTriggeredAlarmDto>>> GetAllTriggeredAlarmsPerSite(int siteId)
        {
            ServiceResponse<List<GetTriggeredAlarmDto>> serviceResponse = new();
            List<TriggeredAlarm> dbAlarms = await _context.TriggeredAlarm
                .Where(s => s.SiteId == siteId).ToListAsync();

            serviceResponse.Data = dbAlarms.Select(r => _mapper.Map<GetTriggeredAlarmDto>(r)).ToList();
            return serviceResponse;
        }

        // Function for getting all triggered alarms from - to Date. Where Visitors are notified.
        public async Task<ServiceResponse<List<GetTriggeredAlarmDto>>> GetAllTriggeredAlarmsInPeriod(DateTime from, DateTime to)
        {
            ServiceResponse<List<GetTriggeredAlarmDto>> serviceResponse = new();
            List<TriggeredAlarm> dbAlarms = await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= from && s.CreatedDateTime <= to.AddDays(1)).ToListAsync();
              
            serviceResponse.Data = dbAlarms.Select(r => _mapper.Map<GetTriggeredAlarmDto>(r)).ToList();
            return serviceResponse;
        }

        // Function for getting all triggered alarms from - to Date per Site. Where Visitors are notified.
        public async Task<ServiceResponse<List<GetTriggeredAlarmDto>>> GetAllTriggeredAlarmsInPeriodPerSite(DateTime from, DateTime to, int siteId)
        {
            ServiceResponse<List<GetTriggeredAlarmDto>> serviceResponse = new();
            List<TriggeredAlarm> dbAlarms = await _context.TriggeredAlarm
                .Where(s => s.CreatedDateTime >= from && s.CreatedDateTime <= to.AddDays(1) && s.SiteId == siteId)
                .ToListAsync();

            serviceResponse.Data = dbAlarms.Select(r => _mapper.Map<GetTriggeredAlarmDto>(r)).ToList();
            return serviceResponse;
        }

        // Function for deleting Alarm from DB
        public async Task<ServiceResponse<List<GetAlarmDto>>> DeleteAlarm(int id)
        {
            ServiceResponse<List<GetAlarmDto>> serviceResponse = new();
            try
            {
                Alarm room = await _context.Alarm.FirstAsync(r => r.Id == id);
                _context.Alarm.Remove(room);
                await _context.SaveChangesAsync();

                serviceResponse.Data = (_context.Alarm.Select(r => _mapper.Map<GetAlarmDto>(r))).ToList();
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
