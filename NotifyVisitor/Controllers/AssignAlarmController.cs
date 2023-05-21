using NotifyVisitor.Dtos.AssignAlarm;
using NotifyVisitor.Services;
using NotifyVisitor.Services.RoomAlarmService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;

namespace NotifyVisitor.Controllers
{
    /// <summary>
    /// Controller class for entity AssignAlarm.
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
    [ApiController]
    [Route("[controller]")]
    [RequiredScope(RequiredScopesConfigurationKey = "AzureAd:scopes")]
    [Authorize]
    public class AssignAlarmController : Controller
    {
        private readonly IAssignAlarmService _assignAlarmService;

        public AssignAlarmController(IAssignAlarmService assignAlarmService)
        {
            _assignAlarmService = assignAlarmService;
        }

        // Add new assigment to DB
        [HttpPost]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> AddAssignAlarm(AddAssignAlarmDto newAssignAlarm)
        {
            return Ok(await _assignAlarmService.AddAssignedAlarm(newAssignAlarm));
        }

        // Get all assignments
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAssignedAlarms()
        {
            return Ok(await _assignAlarmService.GetAssignedAlarms());
        }

        // Get all assignments with sort and filter
        [HttpGet]
        public async Task<IActionResult> Index(
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn
            )
        {
            return Ok(await _assignAlarmService.Index(sortColumn, sortOrder, searchString, searchColumn));
        }

        // Get single assignment by Alarm Id
        [HttpGet("getAssignedAlarmsPerAlarm/{alarmId}")]
        public async Task<IActionResult> GetAssignedAlarmsPerAlarm(int alarmId)
        {
            return Ok(await _assignAlarmService.GetAssignedAlarmsPerAlarm(alarmId));
        }

        // Get single assignment by object Ids
        [HttpGet("{alarmId}/{roomId}/{notificationId}")]
        public async Task<IActionResult> GetSingle(int alarmId, int roomId, int notificationId)
        {
            return Ok(await _assignAlarmService.GetSingle(alarmId, roomId, notificationId));
        }

        // Update assignment Notification by new Notification Id
        // Only Notification can be updated
        [HttpPut("{alarmId}/{roomId}/{notificationId}/{newNotificationId}")]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> UpdateAssignAlarm(int alarmId, int roomId, int notificationId, int newNotificationId)
        {
            ServiceResponse<GetAssignAlarmDtocs> response = await _assignAlarmService.UpdateAssignAlarm(alarmId, roomId, notificationId, newNotificationId);
            if (response.Data == null)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        // Delete one assignment by object Ids
        [HttpDelete("{alarmId}/{roomId}/{notificationId}")]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> Delete(int alarmId, int roomId, int notificationId)
        {
            ServiceResponse<List<GetAssignAlarmDtocs>> response = await _assignAlarmService.Delete(alarmId, roomId, notificationId);
            if (response.Data == null)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        // Delete assignments for ONE spesific Alarm assigned to ALL Rooms in one Site.
        // Can be looped for deleting ONE spesific Alarm for ALL assigned Sites.
        [HttpDelete("site/{alarmId}/{siteId}")]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> DeleteAssignedSite(int alarmId, int siteId)
        {
            ServiceResponse<List<GetAssignAlarmDtocs>> response = await _assignAlarmService.DeleteAssignedSite(alarmId, siteId);
            if (response.Data == null)
            {
                return NotFound(response);
            }
            return Ok(response);
        }
    }
}
