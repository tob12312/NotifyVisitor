using NotifyVisitor.Dtos.Room;
using System.ComponentModel.DataAnnotations;

namespace NotifyVisitor.Dtos.Site
{
    public class UpdateSiteDto
    {
        public int Id { get; set; } // Org. no or other unique identifier can be used
        [Required]
        [StringLength(15)]
        public string Name { get; set; } = null!;
        public DateTime CreatedDateTime { get; set; } = DateTime.Now;
        public List<GetRoomDto> Rooms { get; set; } = new List<GetRoomDto>();
   //     public string UserName { get; set; } = null!;
    }
}
