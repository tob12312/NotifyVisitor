using NotifyVisitor.Dtos.Room;

namespace NotifyVisitor.Services.RoomService
{
    /// <summary>
    /// Interface for Entity Room
    /// </summary>
    public interface IRoomService
    {
        // Get all Rooms.
        Task<ServiceResponse<List<GetRoomDto>>> GetAllRooms();

        // Get all Rooms with sort and filter.
        Task<ServiceResponse<List<GetRoomDto>>> Index
            (
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn
            );

        // Get single Room by Id.
        Task<ServiceResponse<GetRoomDto>> GetRoomById(int Id);

        // Add Room to DB.
        Task<ServiceResponse<List<GetRoomDto>>> AddRoom(AddRoomDto newRoom);

        // Update Room to DB.
        Task<ServiceResponse<GetRoomDto>> UpdateRoom(UpdateRoomDto updatedRoom);

        // Delete Room from DB.
        Task<ServiceResponse<List<GetRoomDto>>> DeleteRoom(int id);

        // Get all Rooms per Site Id.
        Task<ServiceResponse<List<GetRoomDto>>> GetAllRoomsPerSite(int siteId);
    }
}
