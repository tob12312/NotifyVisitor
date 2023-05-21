using NotifyVisitor.Dtos.Site;

namespace NotifyVisitor.Services.SiteServices
{
    /// <summary>
    /// Interface for Entity Site. CRUD API.
    /// </summary>
    public interface ISiteService
    {
        // Get all Sites.
        Task<ServiceResponse<List<GetSiteDto>>> GetAllSites();

        // Get all Sites with sort and filter.
        Task<ServiceResponse<List<GetSiteDto>>> Index
            (
            string? sortColumn,
            string? sortOrder,
            string? searchString,
            string? searchColumn
            );

        // Get single Site by Id.
        Task<ServiceResponse<GetSiteDto>> GetSiteById(int Id);

        // Add Site to DB.
        Task<ServiceResponse<List<GetSiteDto>>> AddSite(AddSiteDto newSite);

        // Update Site to DB.
        Task<ServiceResponse<GetSiteDto>> UpdateSite(UpdateSiteDto updatedSite);

        // Delete Site from DB.
        Task<ServiceResponse<List<GetSiteDto>>> DeleteSite(int id);
    }
}

