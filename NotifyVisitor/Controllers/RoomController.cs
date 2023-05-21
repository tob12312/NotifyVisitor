using Microsoft.AspNetCore.Mvc;
using NotifyVisitor.Services.RoomService;
using NotifyVisitor.Services;
using NotifyVisitor.Dtos.Room;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web.Resource;

namespace NotifyVisitor.Controllers
{
    /// <summary>
    /// Controller class for entity Room.
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    [RequiredScope(RequiredScopesConfigurationKey = "AzureAd:scopes")]
    [Authorize]
    public class RoomController : Controller
    {

        private readonly IRoomService _roomService;

        public RoomController(IRoomService roomService)
        {
            _roomService = roomService;
        }

        // Get all Rooms.
        [HttpGet("GetAll")]
        public async Task<IActionResult> Get()
        {
            return Ok(await _roomService.GetAllRooms());
        }

        // Get all Rooms per Site.
        [HttpGet("getAllRoomsPerSite/{siteId}")]
        public async Task<IActionResult> GetAllRoomsPerSite(int siteId)
        {
            return Ok(await _roomService.GetAllRoomsPerSite(siteId));
        }

        // Get all Rooms sort and filter.
        [HttpGet]
        public async Task<IActionResult> Index(
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn
            )
        {
            return Ok(await _roomService.Index(sortColumn, sortOrder, searchString, searchColumn));
        }

        // Get one Room by Id.
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSingle(int id)
        {
            return Ok(await _roomService.GetRoomById(id));
        }

        // Add new Room to DB.
        [HttpPost]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> AddRoom(AddRoomDto newRoom)
        {
            return Ok(await _roomService.AddRoom(newRoom));
        }

        // Update Room in DB.
        [HttpPut("{id}")]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> UpdateRoom(UpdateRoomDto updatedRoom)
        {
            ServiceResponse<GetRoomDto> response = await _roomService.UpdateRoom(updatedRoom);
            if (response.Data == null)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        // Delete one Room by Id.
        [HttpDelete("{id}")]
        [Authorize(Roles = "SiteAdmin")]
        public async Task<IActionResult> Delete(int id)
        {
            ServiceResponse<List<GetRoomDto>> response = await _roomService.DeleteRoom(id);
            if (response.Data == null)
            {
                return NotFound(response);
            }
            return Ok(response);
        }
    }
}