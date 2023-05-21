using Microsoft.AspNetCore.Mvc;
using NotifyVisitor.Services;
using NotifyVisitor.Dtos.Site;
using NotifyVisitor.Services.SiteServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web.Resource;

namespace NotifyVisitor.Controllers
{
    /// <summary>
    /// Controller class for Entity Site.
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    [RequiredScope(RequiredScopesConfigurationKey = "AzureAd:scopes")]
    [Authorize]
    public class SiteController : Controller
    {

        private readonly ISiteService _siteService;

        public SiteController(ISiteService siteService)
        {
            _siteService = siteService;
        }

        // Get all Sites.
        [HttpGet("GetAll")]
        public async Task<IActionResult> Get()
        {
            return Ok(await _siteService.GetAllSites());
        }

        // Get all Sites sort and filter.
        [HttpGet]
        public async Task<IActionResult> Index(
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn
            )
        {
            return Ok(await _siteService.Index(sortColumn, sortOrder, searchString, searchColumn));
        }

        // Get one Site by Id.
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSiteById(int id)
        {
            return Ok(await _siteService.GetSiteById(id));
        }


        // Add new Site to DB.
        [HttpPost]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> AddVisitor(AddSiteDto newVisitor)
        {
            return Ok(await _siteService.AddSite(newVisitor));
        }

        // Update Site in DB.
        [HttpPut("{id}")]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> UpdateAlarm(UpdateSiteDto updatedVisitor)
        {
            ServiceResponse<GetSiteDto> response = await _siteService.UpdateSite(updatedVisitor);
            if (response.Data == null)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        // Delete one Site from DB.
        [HttpDelete("{id}")]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> DeleteVisitor(int id)
        {
            ServiceResponse<List<GetSiteDto>> response = await _siteService.DeleteSite(id);
            if (response.Data == null)
            {
                return NotFound(response);
            }
            return Ok(response);
        }
    }
}


