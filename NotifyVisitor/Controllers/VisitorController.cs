using Microsoft.AspNetCore.Mvc;
using NotifyVisitor.Services;
using NotifyVisitor.Dtos.Visitor;
using NotifyVisitor.Services.VisitorServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web.Resource;

namespace NotifyVisitor.Controllers
{
    /// <summary>
    /// Controller class for Entity Visitor
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class VisitorController : Controller
    {
        private readonly IVisitorService _visitorService;

        public VisitorController(IVisitorService visitorService)
        {
            _visitorService = visitorService;
        }

        // Get all Visitors.
        [HttpGet("GetAll")]
        public async Task<IActionResult> Get()
        {
            return Ok(await _visitorService.Get());
        }

        // Get all Visitors sort and filter.
        [HttpGet]
        public async Task<IActionResult> Index(
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn
            )
        {
            return Ok(await _visitorService.Index(sortColumn, sortOrder, searchString, searchColumn));
        }

        // Get Visitor by id.
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVisitorById(int id)
        {
            return Ok(await _visitorService.GetVisitorById(id));
        }

        // Create or Update Visitor - check for telephone.
        // This method is dedicated to Visitor scanning QR code.
        // Seperates New Visitors from Visitors changing Room.
        // If Visitor Telephone exists in DB, update Visitor.
        // If not exist, Add new Visitor to DB.
        [HttpGet("telephone/{telephone}/{newRoomId}")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateOrCreateVisitor(string telephone, string newRoomId)
        {
            return Ok(await _visitorService.UpdateOrCreateVisitor(telephone, newRoomId));
        }

        // Add new Visitor to DB
        [HttpPost]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> AddVisitor(AddVisitorDto newVisitor)
        {
            return Ok(await _visitorService.AddVisitor(newVisitor));
        }

        // Update Visitor in DB
        [HttpPut("{id}")]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> UpdateAlarm(UpdateVisitorDto updatedVisitor)
        {
            ServiceResponse<GetVisitorDto> response = await _visitorService.UpdateVisitor(updatedVisitor);
            if (response.Data == null)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        // Delete Visitor in DB
        [HttpDelete("{id}")]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> DeleteVisitor(int id)
        {
            ServiceResponse<List<GetVisitorDto>> response = await _visitorService.DeleteVisitor(id);
            if (response.Data == null)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        // Get all historical Visitors sort and filter
        [HttpGet("visitorHistory")]
        public async Task<IActionResult> VisitorHistory(
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn
            )
        {
            return Ok(await _visitorService.VisitorHistory(sortColumn, sortOrder, searchString, searchColumn));
        }

        // Get COUNT historical Visitors PER DAY /WEEK/ MONTH/ YEAR
        // Returns List with int values.
        [HttpGet("getCountVisitorHistoryPeriods")]
        public async Task<IActionResult> GetCountVisitorHistoryPeriods()
        {
            return Ok(await _visitorService.GetCountVisitorHistoryPeriods());
        }

        // Get COUNT DISTINCT (telephone) historical Visitors PER DAY /WEEK/ MONTH/ YEAR
        // Returns List with int values.
        [HttpGet("getCountDistinctVisitorHistoryPeriods")]
        public async Task<IActionResult> GetCountDistinctVisitorHistoryPeriods()
        {
            return Ok(await _visitorService.GetCountDistinctVisitorHistoryPeriods());
        }

        // Get COUNT historical Visitors PER DAY /WEEK/ MONTH/ YEAR PER SITE
        // Returns List with int values.
        [HttpGet("getCountVisitorHistoryPeriodsPerSite/{siteId}")]
        public async Task<IActionResult> GetCountVisitorHistoryPeriodsPerSite(int siteId)
        {
            return Ok(await _visitorService.GetCountVisitorHistoryPeriodsPerSite(siteId));
        }

        // Get COUNT DISTINCT (telephone) historical Visitors PER DAY /WEEK/ MONTH/ YEAR PER SITE
        // Returns List with int values.
        [HttpGet("getCountDistinctVisitorHistoryPeriodsPerSite/{siteId}")]
        public async Task<IActionResult> GetCountDistinctVisitorHistoryPeriodsPerSite(int siteId)
        {
            return Ok(await _visitorService.GetCountDistinctVisitorHistoryPeriodsPerSite(siteId));
        }

        // Get COUNT historical Visitors ALL TIME - PER SITE
        [HttpGet("getCountVisitorHistoryPerSite/{siteId}")]
        public async Task<IActionResult> GetCountVisitorHistoryPerSite(int siteId)
        {
            return Ok(await _visitorService.GetCountVisitorHistoryPerSite(siteId));
        }

        // Get LIST of all historical Visitors PER SITE
        [HttpGet("getAllVisitorHistoryPerSite/{siteId}")]
        public async Task<IActionResult> GetAllVisitorHistoryPerSite(int siteId)
        {
            return Ok(await _visitorService.GetAllVisitorHistoryPerSite(siteId));
        }

        // Get COUNT historical Visitors PER SITE PER PERIOD
        [HttpGet("getCountVisitorHistoryPerSitePerPeriod/{from}/{to}/{siteId}")]
        public async Task<IActionResult> GetCountVisitorHistoryPerSitePerPeriod(DateTime from, DateTime to, int siteId)
        {
            return Ok(await _visitorService.GetCountVisitorHistoryPerSitePerPeriod(from, to, siteId));
        }

        // Get LIST of all historical Visitors PER SITE PER PERIOD
        [HttpGet("getAllVisitorHistoryPerSitePerPeriod/{from}/{to}/{siteId}")]
        public async Task<IActionResult> GetAllVisitorHistoryPerSitePerPeriod(DateTime from, DateTime to, int siteId)
        {
            return Ok(await _visitorService.GetAllVisitorHistoryPerSitePerPeriod(from, to, siteId));
        }

        // Get COUNT historical Visitors PER PERIOD
        [HttpGet("getCountVisitorHistoryPerPeriod/{from}/{to}")]
        public async Task<IActionResult> GetCountVisitorHistoryPerPeriod(DateTime from, DateTime to)
        {
            return Ok(await _visitorService.GetCountVisitorHistoryPerPeriod(from, to));
        }

        // Get LIST of all historical Visitors PER PERIOD
        [HttpGet("getAllVisitorHistoryPerPeriod/{from}/{to}")]
        public async Task<IActionResult> GetAllVisitorHistoryPerPeriod(DateTime from, DateTime to)
        {
            return Ok(await _visitorService.GetAllVisitorHistoryPerPeriod(from, to));
        }

    }
}

