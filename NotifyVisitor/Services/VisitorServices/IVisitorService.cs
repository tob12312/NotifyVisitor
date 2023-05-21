using NotifyVisitor.Dtos.Visitor;
using NotifyVisitor.Dtos.VisitorHistory;

namespace NotifyVisitor.Services.VisitorServices
{
    /// <summary>
    /// Interface for Entity Visitor. CRUD API.
    /// </summary>
    public interface IVisitorService
    {

        // Get all Visitors.
        Task<ServiceResponse<List<GetVisitorDto>>> Get();

        // Get all Visitors with sort and filter.
        Task<ServiceResponse<List<GetVisitorDto>>> Index
            (
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn
            );

        // Get single Visitor by Id.
        Task<ServiceResponse<GetVisitorDto>> GetVisitorById(int Id);

        // Add Visitor to DB.
        Task<ServiceResponse<List<GetVisitorDto>>> AddVisitor(AddVisitorDto newRoom);

        // Update Visitor in DB.
        Task<ServiceResponse<GetVisitorDto>> UpdateVisitor(UpdateVisitorDto updateVisitor);

        // Delete Visitor from DB.
        Task<ServiceResponse<List<GetVisitorDto>>> DeleteVisitor(int id);
        
        // Visitor Scan QR Code. Add new Visitor or change Room - by telephoneNumber.
        Task<ServiceResponse<GetVisitorDto>> UpdateOrCreateVisitor(string telephone, string newRoomId);

        // Get full Visitor History with sort and filter.
        Task<ServiceResponse<List<GetVisitorHistoryDto>>> VisitorHistory
            (
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn
            );

        // Get count Visitors per day/ 7 days/ 30 days/ 365 days
        Task<ServiceResponse<List<int>>> GetCountVisitorHistoryPeriods();

        // Get count DISTINCT Visitors per day/ 7 days/ 30 days/ 365 days
        Task<ServiceResponse<List<int>>> GetCountDistinctVisitorHistoryPeriods();

        // Get count Visitors PER SITE per day/ 7 days/ 30 days/ 365 days
        Task<ServiceResponse<List<int>>> GetCountVisitorHistoryPeriodsPerSite(int siteId);

        // Get count DISTINCT Visitors PER SITE per day/ 7 days/ 30 days/ 365 days
        Task<ServiceResponse<List<int>>> GetCountDistinctVisitorHistoryPeriodsPerSite(int siteId);

        // Get count Visitors per Site
        Task<ServiceResponse<int>> GetCountVisitorHistoryPerSite(int siteId); // All time

        // Get full Visitor History per Site
        Task<ServiceResponse<List<GetVisitorHistoryDto>>> GetAllVisitorHistoryPerSite(int siteId);

        // Get count Visitor History per Site per period
        Task<ServiceResponse<int>> GetCountVisitorHistoryPerSitePerPeriod(DateTime from, DateTime to, int siteId);

        // Get full Visitor History per Site per period
        Task<ServiceResponse<List<GetVisitorHistoryDto>>> GetAllVisitorHistoryPerSitePerPeriod(DateTime from, DateTime to, int siteId);

        // Get count Visitor History per period
        Task<ServiceResponse<int>> GetCountVisitorHistoryPerPeriod(DateTime from, DateTime to);

        // Get full Visitor History per period
        Task<ServiceResponse<List<GetVisitorHistoryDto>>> GetAllVisitorHistoryPerPeriod(DateTime from, DateTime to); 
    }
}
