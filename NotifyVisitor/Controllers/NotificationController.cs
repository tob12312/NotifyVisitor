using NotifyVisitor.Services;
using Microsoft.AspNetCore.Mvc;
using NotifyVisitor.Services.NotificationService;
using NotifyVisitor.Dtos.Notification;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web.Resource;

namespace NotifyVisitor.Controllers
{
    /// <summary>
    /// Controller class for entity Notification (additional message to Visitors).
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    [RequiredScope(RequiredScopesConfigurationKey = "AzureAd:scopes")]
    [Authorize]
    public class NotificationController : Controller
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // Get all Notifications.
        [HttpGet("GetAll")]
        public async Task<IActionResult> Get()
        {
            return Ok(await _notificationService.GetAllNotifications());
        }

        // Get all Notifications sort and filter.
        [HttpGet]
        public async Task<IActionResult> Index(
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn
            )
        {
            return Ok(await _notificationService.Index(sortColumn, sortOrder, searchString, searchColumn));
        }

        // Get one Notification by Id.
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSingle(int id)
        {
            return Ok(await _notificationService.GetNotificationById(id));
        }

        // Add new Notification to DB.
        [HttpPost]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> AddNotification(AddNotificationDto newNotification)
        {
            return Ok(await _notificationService.AddNotification(newNotification));
        }

        // Update Notification in DB.
        [HttpPut("{id}")]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> UpdateNotification(UpdateNotificationDto updatedNotification)
        {
            ServiceResponse<GetNotificationDto> response = await _notificationService
                .UpdateNotification(updatedNotification);
            if (response.Data == null)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        // Delete one Notification by Id.
        [HttpDelete("{id}")]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> Delete(int id)
        {
            ServiceResponse<List<GetNotificationDto>> response = await _notificationService
                .DeleteNotification(id);
            if (response.Data == null)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

    }
}
