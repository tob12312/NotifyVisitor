using AutoMapper;
using NotifyVisitor.Data;
using NotifyVisitor.Dtos.Site;
using NotifyVisitor.Models;
using Microsoft.EntityFrameworkCore;

namespace NotifyVisitor.Services.SiteServices
{
    /// <summary>
    /// Service class for Entity Site.
    /// </summary>
    public class SiteService : ISiteService
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;

        public SiteService(IMapper mapper, ApplicationDbContext context)
        {
            _context = context;
            _mapper = mapper;
        }

        // Add Site to DB.
        public async Task<ServiceResponse<List<GetSiteDto>>> AddSite(AddSiteDto newSite)
        {
            ServiceResponse<List<GetSiteDto>> serviceResponse = new();
            Site site = _mapper.Map<Site>(newSite);

            await _context.Site.AddAsync(site);
            await _context.SaveChangesAsync();

            serviceResponse.Data = _context.Site.Select(r => _mapper.Map<GetSiteDto>(r)).ToList();
            return serviceResponse;
        }

        // Get all Sites
        public async Task<ServiceResponse<List<GetSiteDto>>> GetAllSites()
        {
            ServiceResponse<List<GetSiteDto>> serviceResponse = new();
            List<Site> dbRooms = await _context.Site
                .Include(c => c.Rooms)
                .ToListAsync();
            serviceResponse.Data = dbRooms.Select(r => _mapper.Map<GetSiteDto>(r)).ToList();
            return serviceResponse;
        }

        // Get Site by Id
        public async Task<ServiceResponse<GetSiteDto>> GetSiteById(int id)
        {
            ServiceResponse<GetSiteDto> serviceResponse = new();
            Site dbRoom = await _context.Site
                .FirstOrDefaultAsync(c => c.Id == id);
            serviceResponse.Data = _mapper.Map<GetSiteDto>(dbRoom);
            return serviceResponse;
        }
        
        // Get all Sites with sort and filter.
        public async Task<ServiceResponse<List<GetSiteDto>>> Index(
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn)
        {
            ServiceResponse<List<GetSiteDto>> serviceResponse = new();
            List<Site> dbRooms = await _context.Site.ToListAsync();

            var rooms = from s in dbRooms
                        select s;

            // search by Id
            if (!string.IsNullOrEmpty(searchString) &&
                searchColumn == "id")
            {
                rooms = rooms.Where(s => s.Id
                .ToString()
                .Contains(searchString));
            }
            // search by column RoomName
            if (!string.IsNullOrEmpty(searchString) &&
                searchColumn == "name")
            {
                rooms = rooms.Where(s => s.Name
                .ToUpperInvariant()
                .Contains(searchString
                .ToUpperInvariant()));
            }
            // Sorting - switching sortOrder and -column
            rooms = (sortColumn, sortOrder)
            switch
            {
                ("name", "desc") => rooms.OrderByDescending(s => s.Name),
                ("name", "asc") => rooms.OrderBy(s => s.Name),
                ("id", "desc") => rooms.OrderByDescending(s => s.Id),
                _ => rooms.OrderBy(s => s.Id),
            };
            serviceResponse.Data = rooms.Select(r => _mapper.Map<GetSiteDto>(r)).ToList();

            return serviceResponse;
        }
        
        // Update Site to DB.
        public async Task<ServiceResponse<GetSiteDto>> UpdateSite(UpdateSiteDto updatedSite)
        {
            ServiceResponse<GetSiteDto> serviceResponse = new();
            try
            {
                Site site = await _context.Site.FirstOrDefaultAsync(r => r.Id == updatedSite.Id);
                site.Name = updatedSite.Name;
                site.CreatedDateTime = updatedSite.CreatedDateTime;

                serviceResponse.Data = _mapper.Map<GetSiteDto>(site);
                _context.Site.Update(site);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }

        // Delete Site from DB.
        public async Task<ServiceResponse<List<GetSiteDto>>> DeleteSite(int id)
        {
            ServiceResponse<List<GetSiteDto>> serviceResponse = new();
            try
            {
                Site site = await _context.Site.FirstAsync(r => r.Id == id);
                _context.Site.Remove(site);
                await _context.SaveChangesAsync();
                serviceResponse.Data = _context.Site.Select(r => _mapper.Map<GetSiteDto>(r)).ToList();
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
