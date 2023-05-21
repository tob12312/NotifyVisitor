using AutoMapper;
using NotifyVisitor.Data;
using NotifyVisitor.Dtos.Room;
using NotifyVisitor.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Collections.Generic;

namespace NotifyVisitor.Services.RoomService
{
    /// <summary>
    /// Service class for Entity Room, CRUD API.
    ///
    /// </summary>
    public class RoomService : IRoomService
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;

        public RoomService(IMapper mapper, ApplicationDbContext context)
        {
            _context = context;
            _mapper = mapper;
        }

        // Add Room to DB.
        public async Task<ServiceResponse<List<GetRoomDto>>> AddRoom(AddRoomDto newRoom)
        {
            ServiceResponse<List<GetRoomDto>> serviceResponse = new();
            Room room = _mapper.Map<Room>(newRoom);

            await _context.Room.AddAsync(room);
            await _context.SaveChangesAsync();
            serviceResponse.Data = (_context.Room.Select(r => _mapper.Map<GetRoomDto>(r))).ToList();
            return serviceResponse;
        }

        // Get all Rooms and current Visitors.
        public async Task<ServiceResponse<List<GetRoomDto>>> GetAllRooms()
        {
            ServiceResponse<List<GetRoomDto>> serviceResponse = new();
            List<Room> dbRooms = await _context.Room
                .Include(c => c.RoomVisitors).ThenInclude(cs => cs.Visitor)
                .ToListAsync();   
        
            serviceResponse.Data = dbRooms.Select(r => _mapper.Map<GetRoomDto>(r)).ToList();
            return serviceResponse;
        }

        // Get all Rooms per Site
        public async Task<ServiceResponse<List<GetRoomDto>>> GetAllRoomsPerSite(int siteId)
        {
            ServiceResponse<List<GetRoomDto>> serviceResponse = new();
            List<Room> dbRooms = await _context.Room
                .Include(c => c.RoomVisitors).ThenInclude(cs => cs.Visitor)
                .Where(vh => vh.SiteId == siteId)
                .ToListAsync();

            serviceResponse.Data = dbRooms.Select(r => _mapper.Map<GetRoomDto>(r)).ToList();
            return serviceResponse;
        }

        // Get single Room by Id.
        public async Task<ServiceResponse<GetRoomDto>> GetRoomById(int id)
        {
            ServiceResponse<GetRoomDto> serviceResponse = new();
            Room dbRoom = await _context.Room               
                .Include(c => c.RoomVisitors).ThenInclude(cs => cs.Visitor)
                .FirstOrDefaultAsync(c => c.Id == id);
            serviceResponse.Data = _mapper.Map<GetRoomDto>(dbRoom);
            return serviceResponse;
        }

        // Get all Rooms with sort and filter.
        public async Task<ServiceResponse<List<GetRoomDto>>> Index(
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn)
        {
            ServiceResponse<List<GetRoomDto>> serviceResponse = new();
            List<Room> dbRooms = await _context.Room
                .ToListAsync();
   
            var rooms = from s in dbRooms
                        select s;

            // search by Id
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "id")
            {
                rooms = rooms.Where(s => s.Id
                .ToString()
                .Contains(searchString));
            }
            // search by RoomName
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "name")
            {
                rooms = rooms.Where(s => s.Name
                .ToUpperInvariant()
                .Contains(searchString
                .ToUpperInvariant()));
            }
            // search by Floor
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "floor")
            {
                rooms = rooms.Where(s => s.Floor
                .ToUpperInvariant()
                .Contains(searchString
                .ToUpperInvariant()));
            }
            // search by Building
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "building")
            {
                rooms = rooms.Where(s => s.Building
                .ToUpperInvariant()
                .Contains(searchString
                .ToUpperInvariant()));
            }
            // search by Site
            if (!String.IsNullOrEmpty(searchString) &&
                searchColumn == "siteId")
            {
                rooms = rooms.Where(s => s.SiteId
                .ToString()
                .Contains(searchString));
            }
            // Sorting - switching sortOrder and -column
            rooms = (sortColumn, sortOrder)
            switch
            {
                ("name", "desc") => rooms.OrderByDescending(s => s.Name),
                ("name", "asc") => rooms.OrderBy(s => s.Name),
                ("floor", "desc") => rooms.OrderByDescending(s => s.Floor),
                ("floor", "asc") => rooms.OrderBy(s => s.Floor),
                ("building", "desc") => rooms.OrderByDescending(s => s.Building),
                ("building", "asc") => rooms.OrderBy(s => s.Building),
                ("siteId", "desc") => rooms.OrderByDescending(s => s.SiteId),
                ("siteId", "asc") => rooms.OrderBy(s => s.SiteId),
                ("id", "desc") => rooms.OrderByDescending(s => s.Id),
                _ => rooms.OrderBy(s => s.Id),
            };
            serviceResponse.Data = rooms.Select(r => _mapper.Map<GetRoomDto>(r)).ToList();
            return serviceResponse;
        }

        // Update Room in DB.
        public async Task<ServiceResponse<GetRoomDto>> UpdateRoom(UpdateRoomDto updatedRoom)
        {
            ServiceResponse<GetRoomDto> serviceResponse = new();
            try
            {
                Room room = await _context.Room.FirstOrDefaultAsync(r => r.Id == updatedRoom.Id);
                room.Name = updatedRoom.Name;
                room.Floor = updatedRoom.Floor;
                room.Building = updatedRoom.Building;
                room.SiteId = updatedRoom.SiteId;
                room.CreatedDateTime = updatedRoom.CreatedDateTime;

                serviceResponse.Data = _mapper.Map<GetRoomDto>(room);
                _context.Room.Update(room);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex) 
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }

        // Delete Room from DB.
        public async Task<ServiceResponse<List<GetRoomDto>>> DeleteRoom(int id)
        {
            ServiceResponse<List<GetRoomDto>> serviceResponse = new();
            try
            {
                Room room = await _context.Room.FirstAsync(r => r.Id == id);
                _context.Room.Remove(room);
                await _context.SaveChangesAsync();
                serviceResponse.Data = (_context.Room.Select(r => _mapper.Map<GetRoomDto>(r))).ToList();
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
