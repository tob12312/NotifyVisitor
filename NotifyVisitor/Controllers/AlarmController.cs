using NotifyVisitor.Models;
using Microsoft.AspNetCore.Mvc;
using NotifyVisitor.Services.AlarmService;
using NotifyVisitor.Services;
using NotifyVisitor.Dtos.Alarm;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web.Resource;

namespace NotifyVisitor.Controllers
{
    /// <summary>
    /// Controller class for entity Alarm.
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    [RequiredScope(RequiredScopesConfigurationKey = "AzureAd:scopes")]
    [Authorize]
    public class AlarmController : Controller
    {
        private readonly IAlarmService _alarmService;

        public AlarmController(IAlarmService alarmService)
        {
            _alarmService = alarmService;
        }

        // Get all Alarms
        [HttpGet("GetAll")]
        public async Task<IActionResult> Get()
        {
            return Ok(await _alarmService.GetAllAlarms());
        }

        // Get all Alarms sort and filter
        [HttpGet]
        public async Task<IActionResult> Index(
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn
            )
        {
            return Ok(await _alarmService.Index(sortColumn, sortOrder, searchString, searchColumn));
        }

        // Get all triggered Alarms where Visitor is notified, sort and filter
        [HttpGet("triggeredAlarms")]
        public async Task<IActionResult> TriggeredAlarms(
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn
            )
        {
            return Ok(await _alarmService.TriggeredAlarms(sortColumn, sortOrder, searchString, searchColumn));
        }
        
        // Get COUNT Notifications/ SMS sent to Visitors PER DAY /WEEK/ MONTH/ YEAR
        [HttpGet("getCountDistinctTriggeredAlarmsPeriods")]
        public async Task<IActionResult> GetCountDistinctTriggeredAlarmsPeriods()
        {
            return Ok(await _alarmService.GetCountDistinctTriggeredAlarmsPeriods());
        }

        // Get COUNT Notifications/ SMS sent to Visitors PER DAY /WEEK/ MONTH/ YEAR - PER SITE
        [HttpGet("getCountDistinctTriggeredAlarmsPeriodsPerSite/{siteId}")]
        public async Task<IActionResult> GetCountDistinctTriggeredAlarmsPeriodsPerSite(int siteId)
        {
            return Ok(await _alarmService.GetCountDistinctTriggeredAlarmsPeriodsPerSite(siteId));
        }

        // Get COUNT Notifications/ SMS sent to Visitors PER DAY /WEEK/ MONTH/ YEAR
        [HttpGet("getCountTriggeredAlarmsPeriods")]
        public async Task<IActionResult> GetCountTriggeredAlarmsPeriods()
        {
            return Ok(await _alarmService.GetCountTriggeredAlarmsPeriods());
        }

        // Get COUNT Notifications/ SMS sent to Visitors PER DAY /WEEK/ MONTH/ YEAR
        [HttpGet("getCountTriggeredAlarmsPeriodsPerSite/{siteId}")]
        public async Task<IActionResult> GetCountTriggeredAlarmsPeriodsPerSite(int siteId)
        {
            return Ok(await _alarmService.GetCountTriggeredAlarmsPeriodsPerSite(siteId));
        }

        // Function for getting COUNT all rows from TriggeredAlarms (COUNT all generated SMS).
        // Each Alarm notifies all Visitors in all assigned Rooms (multiple rows). Return COUNT rows.
        [HttpGet("getCountNotifiedVisitors")]
        public async Task<IActionResult> GetCountNotifiedVisitors()
        {
            return Ok(await _alarmService.GetCountNotifiedVisitors());
        }

        // Function for getting COUNT all rows from TriggeredAlarms (COUNT all generated SMS).
        // Each Alarm notifies all Visitors in all assigned Rooms (multiple rows).
        // Return COUNT rows per period.
        [HttpGet("getCountNotifiedVisitorsPerPeriod/{from}/{to}")]
        public async Task<IActionResult> GetCountNotifiedVisitorsPerPeriod(DateTime from, DateTime to)
        {
            return Ok(await _alarmService.GetCountNotifiedVisitorsPerPeriod(from, to));
        }

        // Function for getting COUNT all DISTINCT TriggeredAlarms where Visitors have been notified
        // Each Alarm notifies all Visitors in all assigned Rooms (multiple rows). Return COUNT per DISTINCT Alarm.Id.
        [HttpGet("getCountDistinctTriggeredAlarms")]
        public async Task<IActionResult> GetCountDistinctTriggeredAlarms()
        {
            return Ok(await _alarmService.GetCountDistinctTriggeredAlarms());
        }

        // Function for getting COUNT all DISTINCT TriggeredAlarms where Visitors have been notified
        // Each Alarm notifies all Visitors in all assigned Rooms (multiple rows).
        // Return COUNT per DISTINCT Alarm.Id per period.
        [HttpGet("getCountDistinctTriggeredAlarmsPerPeriod/{from}/{to}")]
        public async Task<IActionResult> GetCountDistinctTriggeredAlarmsPerPeriod(DateTime from, DateTime to)
        {
            return Ok(await _alarmService.GetCountDistinctTriggeredAlarmsPerPeriod(from, to));
        }

        // Function for getting last triggered alarm (last row in TriggeredAlarms) where Visitors are notified.
        [HttpGet("getLastTriggeredAlarm")]
        public async Task<IActionResult> GetLastTriggeredAlarm()
        {
            return Ok(await _alarmService.GetLastTriggeredAlarm());
        }

        // Function for getting last triggered alarm (last row in TriggeredAlarms) where Visitors are notified.
        [HttpGet("getLastTriggeredAlarmPerSite/{siteId}")]
        public async Task<IActionResult> GetLastTriggeredAlarmPerSite(int siteId)
        {
            return Ok(await _alarmService.GetLastTriggeredAlarmPerSite(siteId));
        }

        // Function for getting all triggered alarms per Site (siteId) where Visitors are notified.
        [HttpGet("getAllTriggeredAlarmsPerSite/{siteId}")]
        public async Task<IActionResult> GetAllTriggeredAlarmsPerSite(int siteId)
        {
            return Ok(await _alarmService.GetAllTriggeredAlarmsPerSite(siteId));
        }

        // Function for getting all triggered alarms from - to Date. Where Visitors are notified.
        [HttpGet("getAllTriggeredAlarmsInPeriod/{fromDate}/{toDate}")]
        public async Task<IActionResult> GetAllTriggeredAlarmsInPeriod(DateTime fromDate, DateTime toDate)
        {
            return Ok(await _alarmService.GetAllTriggeredAlarmsInPeriod(fromDate, toDate));
        }

        // Function for getting all triggered alarms from - to Date per Site. Where Visitors are notified.
        [HttpGet("getAllTriggeredAlarmsInPeriodPerSite/{fromDate}/{toDate}/{siteId}")]
        public async Task<IActionResult> GetAllTriggeredAlarmsInPeriodPerSite(DateTime fromDate, DateTime toDate, int siteId)
        {
            return Ok(await _alarmService.GetAllTriggeredAlarmsInPeriodPerSite(fromDate, toDate, siteId));
        }

        // Get Alarm by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAlarmById(int id)
        {
            return Ok(await _alarmService.GetAlarmById(id));
        }

        // Add new Alarm to DB
        [HttpPost]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> AddAlarm(AddAlarmDto newAlarm)
        {
            return Ok(await _alarmService.AddAlarm(newAlarm));
        }

        // Generate confirmation SMS to Visitor, confirm telephone and DSA
        [HttpPost("visitorConfirmSms")]
        [AllowAnonymous]
        public async Task<IActionResult> PostSms(Sms sms)
        {
            return Ok(await _alarmService.PostSms(sms));
        }

        // Update Alarm in DB
        [HttpPut("{id}")]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> UpdateAlarm(UpdateAlarmDto updatedAlarm)
        {
            ServiceResponse<GetAlarmDto> response = await _alarmService.UpdateAlarm(updatedAlarm);
            if (response.Data == null)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        // Delete Alarm in DB
        [HttpDelete("{id}")]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> DeleteAlarm(int id)
        {
            ServiceResponse<List<GetAlarmDto>> response = await _alarmService.DeleteAlarm(id);
            if (response.Data == null)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        // Trigger alarm by Alarm Id
        [HttpGet("triggerAlarm/{alarmId}")]
        public async Task<IActionResult> TriggerAlarm(int alarmId)
        {
            return Ok(await _alarmService.TriggerAlarm(alarmId));
        }

    }
}

