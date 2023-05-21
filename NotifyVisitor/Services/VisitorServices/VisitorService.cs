using AutoMapper;
using NotifyVisitor.Data;
using NotifyVisitor.Dtos.Visitor;
using NotifyVisitor.Dtos.VisitorHistory;
using NotifyVisitor.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Collections.Generic;
using System.Diagnostics;

namespace NotifyVisitor.Services.VisitorServices
{
    public class VisitorService : IVisitorService
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;

        public VisitorService(IMapper mapper, ApplicationDbContext context)
        {
            _context = context;
            _mapper = mapper;
        }

        // Add new visitor, including Room Id
        public async Task<ServiceResponse<List<GetVisitorDto>>> AddVisitor(AddVisitorDto newVisitor)
        {
            ServiceResponse<List<GetVisitorDto>> serviceResponse = new();
            Visitor visitor = _mapper.Map<Visitor>(newVisitor);

            await _context.Visitor.AddAsync(visitor);
            await _context.SaveChangesAsync();

            RoomVisitor roomVisitor = new()
            {
                RoomId = visitor.RvId,
                VisitorId = visitor.Id
            };
            await _context.RoomVisitor.AddAsync(roomVisitor);
            await _context.SaveChangesAsync();

            Room room = await _context.Room.FirstOrDefaultAsync(r => r.Id == visitor.RvId);

            // Add current Visitors old data to VisitorHistory in DB
            VisitorHistory visitorHistory = new()
                {
                    VisitorId = visitor.Id,
                    SiteId = room.SiteId, // old Site Id
                    RvId = roomVisitor.RoomId, // old Room Id
                    Telephone = visitor.Telephone,
                };
                _context.VisitorHistory.Add(visitorHistory);
                await _context.SaveChangesAsync();

                serviceResponse.Data = _context.Visitor.Select(r => _mapper.Map<GetVisitorDto>(r)).ToList();
            return serviceResponse;
        }

        // Get Visitors
        public async Task<ServiceResponse<List<GetVisitorDto>>> Get()
        {
            ServiceResponse<List<GetVisitorDto>> serviceResponse = new();
            List<Visitor> dbRooms = await _context.Visitor
                .ToListAsync();
            serviceResponse.Data = dbRooms.Select(r => _mapper.Map<GetVisitorDto>(r)).ToList();
            return serviceResponse;
        }

        // Get Visitor by Id
        public async Task<ServiceResponse<GetVisitorDto>> GetVisitorById(int id)
        {
            ServiceResponse<GetVisitorDto> serviceResponse = new();
            Visitor dbVisitor = await _context.Visitor
                .FirstOrDefaultAsync(c => c.Id == id);
            serviceResponse.Data = _mapper.Map<GetVisitorDto>(dbVisitor);
            return serviceResponse;
        }


        public async Task<ServiceResponse<GetVisitorDto>> UpdateOrCreateVisitor(string telephone, string newRoomId)
        {
            ServiceResponse<GetVisitorDto> serviceResponse = new();

            Room newRoom = await _context.Room.FirstOrDefaultAsync(r => r.Id == int.Parse(newRoomId));
            if (newRoom == null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Room not found";
                serviceResponse.Data = null;
                return serviceResponse;
            }
            // Look for Visitor
            Visitor dbVisitor = await _context.Visitor
                .FirstOrDefaultAsync(c => c.Telephone.Equals(telephone));
            
            // If unregistered Visitor, but Log out QR is scanned
            if (dbVisitor == null && int.Parse(newRoomId) == -1)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Scann a Room QR to register";
            }

            // Create new Visitor and RoomVisitor if Visitor not exists
            if (dbVisitor == null && int.Parse(newRoomId) != -1)
            {
                Visitor visitor = new()
                {
                    Telephone = telephone,
                    RvId = int.Parse(newRoomId)
                };
                await _context.Visitor.AddAsync(visitor);
                await _context.SaveChangesAsync();
                
               
                RoomVisitor roomVisitor = new()
                {
                    VisitorId = visitor.Id,
                    RoomId = int.Parse(newRoomId)
                };
                await _context.RoomVisitor.AddAsync(roomVisitor);
                await _context.SaveChangesAsync();

                Room room = await _context.Room.FirstOrDefaultAsync(r => r.Id == int.Parse(newRoomId));

                // Add current Visitors current data to VisitorHistory in DB
                VisitorHistory visitorHistory = new()
                {
                    VisitorId = visitor.Id,
                    RvId = int.Parse(newRoomId), // Room Id
                    SiteId = room.SiteId, // Site Id
                    Telephone = visitor.Telephone,
                };
                _context.VisitorHistory.Add(visitorHistory);
                await _context.SaveChangesAsync();

                serviceResponse.Data = _mapper.Map<GetVisitorDto>(visitor);
            }
            else // Visitor exists  -> Remove RoomVisitor -> Add RoomVisitor -> Update Visitor
            {
                try
                {
                    // Find old RoomVisitor
                    RoomVisitor roomVisitor = await _context.RoomVisitor.Include(r => r.Room)
                        .FirstOrDefaultAsync(roomVisitor => roomVisitor.VisitorId == dbVisitor.Id && roomVisitor.RoomId == dbVisitor.RvId);

                    // if Log out QR code scanned, delete current Visitor and RoomVisitor
                    if (int.Parse(newRoomId) == -1)
                    {
                        _context.Visitor.Remove(dbVisitor);
                        await _context.SaveChangesAsync();

                        _context.RoomVisitor.Remove(roomVisitor);
                        await _context.SaveChangesAsync();

                        serviceResponse.Message = "Visitor succesfully logged out";
                    }
                    else { 
                        // Find the new Room to get SiteId
                        Room room = await _context.Room.FirstOrDefaultAsync(r => r.Id == int.Parse(newRoomId));
                        // Add current Visitors old data to VisitorHistory in DB
                        VisitorHistory visitorHistory = new()
                        {
                            VisitorId = dbVisitor.Id,
                            RvId = int.Parse(newRoomId), // new Room Id
                            SiteId = room.SiteId, // new Site Id
                            Telephone = dbVisitor.Telephone,
                        };
                        _context.VisitorHistory.Add(visitorHistory);
                        await _context.SaveChangesAsync();

                        // Remove old RoomVisitor
                        _context.RoomVisitor.Remove(roomVisitor);
                        await _context.SaveChangesAsync();

                        // Create new RoomVisitor and Add to DB
                        RoomVisitor newRv = new()
                        {
                            VisitorId = dbVisitor.Id,
                            RoomId = int.Parse(newRoomId)
                        };
                        _context.RoomVisitor.Add(newRv);
                        await _context.SaveChangesAsync();

                        // Update Visitor values
                        dbVisitor.Telephone = telephone;
                        dbVisitor.RvId = int.Parse(newRoomId);

                        // Update Visitor to DB
                        serviceResponse.Data = _mapper.Map<GetVisitorDto>(dbVisitor);
                        _context.Visitor.Update(dbVisitor);
                        await _context.SaveChangesAsync();
                    }
                }
                catch (Exception ex)
                {
                    serviceResponse.Success = false;
                    serviceResponse.Message = ex.Message;
                }               
            }
            return serviceResponse;
        }
        
        // Get all Visitors sorted/ filtered
        public async Task<ServiceResponse<List<GetVisitorDto>>> Index(
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn)
        {

            ServiceResponse<List<GetVisitorDto>> serviceResponse = new();
            List<Visitor> dbVisitors = await _context.Visitor
                .ToListAsync();

            var visitors = from s in dbVisitors
                        select s;

            // search by Id
            if (!string.IsNullOrEmpty(searchString) &&
                searchColumn == "id")
            {
                visitors = visitors.Where(s => s.Id
                .ToString()
                .Contains(searchString));
            }
            // search by Telephone
            if (!string.IsNullOrEmpty(searchString) &&
                searchColumn == "telephone")
            {
                visitors = visitors.Where(s => s.Telephone
                .ToUpperInvariant()
                .Contains(searchString
                .ToUpperInvariant()));
            }
            // search by RvId (Room Id)
            if (!string.IsNullOrEmpty(searchString) &&
                searchColumn == "rvId")
            {
                visitors = visitors.Where(s => s.RvId
               .ToString()
               .Contains(searchString));
            }

            // Sorting - switching sortOrder and -column
            visitors = (sortColumn, sortOrder)
            switch
            {
                ("rvId", "desc") => visitors.OrderByDescending(s => s.RvId),
                ("rvId", "asc") => visitors.OrderBy(s => s.RvId),
                ("telephone", "desc") => visitors.OrderByDescending(s => s.Telephone),
                ("telephone", "asc") => visitors.OrderBy(s => s.Telephone),
                ("id", "desc") => visitors.OrderByDescending(s => s.Id),
                _ => visitors.OrderBy(s => s.Id),
            };
            serviceResponse.Data = visitors.Select(r => _mapper.Map<GetVisitorDto>(r)).ToList();
            return serviceResponse;
        }

        // Update Visitor and Room relationship
        public async Task<ServiceResponse<GetVisitorDto>> UpdateVisitor(UpdateVisitorDto updatedRoom)
        {
            ServiceResponse<GetVisitorDto> serviceResponse = new();
            try
            {
                // Find the Visitor
                Visitor visitor = await _context.Visitor.FirstOrDefaultAsync(r => r.Id == updatedRoom.Id);
                if (visitor == null)
                {
                    serviceResponse.Success = false;
                    serviceResponse.Message = "Visitor not found";

                }
                // Find the relationship (current Room)
                RoomVisitor roomVisitor = await _context.RoomVisitor.Include(r => r.Room)
                    .FirstOrDefaultAsync(roomVisitor => roomVisitor.VisitorId == updatedRoom.Id && roomVisitor.RoomId == visitor.RvId);         
                if (roomVisitor == null)
                {
                    serviceResponse.Success = false;
                    serviceResponse.Message = "RoomVisitor not found";
                }

                // If the Visitor has changed Room
                if (roomVisitor.RoomId != updatedRoom.RvId)
                {
                    // Find the new Room to get the SiteId
                    Room room = await _context.Room.FirstOrDefaultAsync(r => r.Id == updatedRoom.RvId);
                    // Add current Visitors data to VisitorHistory in DB
                    VisitorHistory visitorHistory = new()
                    {
                        VisitorId = updatedRoom.Id,
                        SiteId = room.SiteId, // new Site Id
                        RvId = updatedRoom.RvId, // new Room Id
                        Telephone = updatedRoom.Telephone,
                    };
                    _context.VisitorHistory.Add(visitorHistory);
                    await _context.SaveChangesAsync();

                    // Remove the old relationship from DB
                    _context.RoomVisitor.Remove(roomVisitor);
                    await _context.SaveChangesAsync();

                    // Create new relationship in DB
                    RoomVisitor newRv = new()
                    {
                        VisitorId = visitor.Id,
                        RoomId = updatedRoom.RvId
                    };
                    _context.RoomVisitor.Add(newRv);
                    await _context.SaveChangesAsync();
                }
               
                // Update current Visitor in DB
                visitor.Telephone = updatedRoom.Telephone;
                visitor.RvId = updatedRoom.RvId;

                serviceResponse.Data = _mapper.Map<GetVisitorDto>(visitor);
                _context.Visitor.Update(visitor);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }
    
        // Delete Visitor by Id
        public async Task<ServiceResponse<List<GetVisitorDto>>> DeleteVisitor(int id)
        {
            ServiceResponse<List<GetVisitorDto>> serviceResponse = new();
            try
            {
                Visitor room = await _context.Visitor.FirstAsync(r => r.Id == id);
                _context.Visitor.Remove(room);
                await _context.SaveChangesAsync();

                serviceResponse.Data = _context.Visitor.Select(r => _mapper.Map<GetVisitorDto>(r)).ToList();
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }


        // Get Visitor History sorted/ filtered
        public async Task<ServiceResponse<List<GetVisitorHistoryDto>>> VisitorHistory(
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn)
        {

            ServiceResponse<List<GetVisitorHistoryDto>> serviceResponse = new();
            List<VisitorHistory> dbVisitors = await _context.VisitorHistory
                .ToListAsync();

            var visitors = from s in dbVisitors
                           select s;

            // search by Id
            if (!string.IsNullOrEmpty(searchString) &&
                searchColumn == "id")
            {
                visitors = visitors.Where(s => s.Id
                .ToString()
                .Contains(searchString));
            }
            // search by VisitorId (old id from Visitor)
            if (!string.IsNullOrEmpty(searchString) &&
                searchColumn == "visitorId")
            {
                visitors = visitors.Where(s => s.VisitorId
                .ToString()
                .Contains(searchString));
            }
            // search by column RoomName
            if (!string.IsNullOrEmpty(searchString) &&
                searchColumn == "telephone")
            {
                visitors = visitors.Where(s => s.Telephone
                .ToUpperInvariant()
                .Contains(searchString
                .ToUpperInvariant()));
            }
            // search by column RoomVisitorId
            if (!string.IsNullOrEmpty(searchString) &&
                searchColumn == "rvId")
            {
                visitors = visitors.Where(s => s.RvId
               .ToString()
               .Contains(searchString));
            }

            // Sorting - switching sortOrder and -column
            visitors = (sortColumn, sortOrder)
            switch
            {
                ("visitorId", "desc") => visitors.OrderByDescending(s => s.VisitorId),
                ("visitorId", "asc") => visitors.OrderBy(s => s.VisitorId),
                ("rvId", "desc") => visitors.OrderByDescending(s => s.RvId),
                ("rvId", "asc") => visitors.OrderBy(s => s.RvId),
                ("telephone", "desc") => visitors.OrderByDescending(s => s.Telephone),
                ("telephone", "asc") => visitors.OrderBy(s => s.Telephone),
                ("id", "desc") => visitors.OrderByDescending(s => s.Id),
                _ => visitors.OrderBy(s => s.Id),
            };
            serviceResponse.Data = visitors.Select(r => _mapper.Map<GetVisitorHistoryDto>(r)).ToList();

            return serviceResponse;
        }

        // Get COUNT all historical Visitors TODAY/ 7 DAYS AGO/ 30 DAYS AGO/ 365 DAYS AGO.
        // Using whole days.
        // Returns List of ints representing count for periods.
        public async Task<ServiceResponse<List<int>>> GetCountVisitorHistoryPeriods()
        {
            ServiceResponse<List<int>> serviceResponse = new();
            List<int> counts = new()
            {
                // today
                await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= DateTime.Today).CountAsync(),
                // 7 days back
                await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= DateTime.Today.AddDays(-7)).CountAsync(),
                // 30 days back
                await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= DateTime.Today.AddDays(-30)).CountAsync(),
                // 365 days back
                await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= DateTime.Today.AddDays(-365)).CountAsync()
            };

            serviceResponse.Data = counts;
            return serviceResponse;
        }

        // Get COUNT all UNIQUE historical Visitors TODAY/ 7 DAYS AGO/ 30 DAYS AGO/ 365 DAYS AGO.
        // Using whole days.
        // Returns List of ints representing count for periods.
        public async Task<ServiceResponse<List<int>>> GetCountDistinctVisitorHistoryPeriods()
        {
            ServiceResponse<List<int>> serviceResponse = new();
            List<int> counts = new()
            {
                // today
                await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= DateTime.Today)
                .Select(vh => vh.Telephone).Distinct().CountAsync(),
                // 7 days back
                await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= DateTime.Today.AddDays(-7))
                .Select(vh => vh.Telephone).Distinct().CountAsync(),
                // 30 days back
                await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= DateTime.Today.AddDays(-30))
                .Select(vh => vh.Telephone).Distinct().CountAsync(),
                // 365 days back
                await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= DateTime.Today.AddDays(-365))
                .Select(vh => vh.Telephone).Distinct().CountAsync(),
            };

            serviceResponse.Data = counts;
            return serviceResponse;
        }

        // Get COUNT all historical Visitors TODAY/ 7 DAYS AGO/ 30 DAYS AGO/ 365 DAYS AGO.
        // Using whole days.
        // Returns List of ints representing count for periods PER SITE.
        public async Task<ServiceResponse<List<int>>> GetCountVisitorHistoryPeriodsPerSite(int siteId)
        {
            ServiceResponse<List<int>> serviceResponse = new();
            List<int> counts = new()
            {
                // today
                await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= DateTime.Today && s.SiteId == siteId).CountAsync(),
                // 7 days back
                await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= DateTime.Today.AddDays(-7) && s.SiteId == siteId)
                .CountAsync(),
                // 30 days back
                await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= DateTime.Today.AddDays(-30) && s.SiteId == siteId)
                .CountAsync(),
                // 365 days back
                await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= DateTime.Today.AddDays(-365) && s.SiteId == siteId)
                .CountAsync()
            };

            serviceResponse.Data = counts;
            return serviceResponse;
        }

        // Get COUNT all UNIQUE historical Visitors TODAY/ 7 DAYS AGO/ 30 DAYS AGO/ 365 DAYS AGO.
        // Using whole days.
        // Returns List of ints representing count for periods PER SITE.
        public async Task<ServiceResponse<List<int>>> GetCountDistinctVisitorHistoryPeriodsPerSite(int siteId)
        {
            ServiceResponse<List<int>> serviceResponse = new();
            List<int> counts = new()
            {
                // today
                await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= DateTime.Today && s.SiteId == siteId)
                .Select(vh => vh.Telephone).Distinct().CountAsync(),
                // 7 days back
                await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= DateTime.Today.AddDays(-7) && s.SiteId == siteId)
                .Select(vh => vh.Telephone).Distinct().CountAsync(),
                // 30 days back
                await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= DateTime.Today.AddDays(-30) && s.SiteId == siteId)
                .Select(vh => vh.Telephone).Distinct().CountAsync(),
                // 365 days back
                await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= DateTime.Today.AddDays(-365) && s.SiteId == siteId)
                .Select(vh => vh.Telephone).Distinct().CountAsync(),
            };

            serviceResponse.Data = counts;
            return serviceResponse;
        }

        // Get COUNT all historical Visitors per Site
        public async Task<ServiceResponse<int>> GetCountVisitorHistoryPerSite(int siteId)
        {
            ServiceResponse<int> serviceResponse = new();
            serviceResponse.Data = await _context.VisitorHistory
                .Where(a => a.SiteId == siteId).Distinct().CountAsync();

            return serviceResponse;
        }

        // Get List of all historical Visitors per Site
        public async Task<ServiceResponse<List<GetVisitorHistoryDto>>> GetAllVisitorHistoryPerSite(int siteId)
        {
            ServiceResponse<List<GetVisitorHistoryDto>> serviceResponse = new();
            List<VisitorHistory> dbVisitors = await _context.VisitorHistory
                .Where(vh => vh.SiteId == siteId).ToListAsync();
            serviceResponse.Data = dbVisitors.Select(r => _mapper.Map<GetVisitorHistoryDto>(r)).ToList();

            return serviceResponse;
        }

        // get COUNT all historical visitors per site per period
        public async Task<ServiceResponse<int>> GetCountVisitorHistoryPerSitePerPeriod(DateTime from, DateTime to, int siteId)
        {
            ServiceResponse<int> serviceResponse = new();
            serviceResponse.Data = await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= from && s.RegisteredDateTime <= to.AddDays(1) 
                    && s.SiteId == siteId).CountAsync();

            return serviceResponse;
        }

        // Get all historical visitors per site per period
        public async Task<ServiceResponse<List<GetVisitorHistoryDto>>> GetAllVisitorHistoryPerSitePerPeriod(DateTime from, DateTime to, int siteId)
        {
            ServiceResponse<List<GetVisitorHistoryDto>> serviceResponse = new();
            List<VisitorHistory> dbVisitorH = await _context.VisitorHistory.ToListAsync();
            var alarms = from s in dbVisitorH
                         select s;
            // Comparing DateTime from query with CreatedDateTime from DB (+ one day). 
            alarms = alarms.Where(s => s.RegisteredDateTime >= from && s.RegisteredDateTime <= to.AddDays(1) 
                && s.SiteId == siteId).ToList();
            serviceResponse.Data = alarms.Select(r => _mapper.Map<GetVisitorHistoryDto>(r)).ToList();

            return serviceResponse;
        }

        // Get COUNT historical visitors per period
        public async Task<ServiceResponse<int>> GetCountVisitorHistoryPerPeriod(DateTime from, DateTime to)
        {
            ServiceResponse<int> serviceResponse = new();
            serviceResponse.Data = await _context.VisitorHistory
                .Where(s => s.RegisteredDateTime >= from && s.RegisteredDateTime <= to.AddDays(1)).CountAsync();

            return serviceResponse;
        }

        // Get all historical Visitors per period
        public async Task<ServiceResponse<List<GetVisitorHistoryDto>>> GetAllVisitorHistoryPerPeriod(DateTime from, DateTime to)
        {
            ServiceResponse<List<GetVisitorHistoryDto>> serviceResponse = new();
            List<VisitorHistory> dbVisitorH = await _context.VisitorHistory.ToListAsync();
            var alarms = from s in dbVisitorH
                         select s;
            // Comparing DateTime from query with CreatedDateTime from DB (+ one day). 
            alarms = alarms.Where(s => s.RegisteredDateTime >= from && s.RegisteredDateTime <= to.AddDays(1)).ToList();               
            serviceResponse.Data = alarms.Select(r => _mapper.Map<GetVisitorHistoryDto>(r)).ToList();

            return serviceResponse;
        }

    }
}
