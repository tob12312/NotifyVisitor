using NotifyVisitor.Dtos.Room;
using System.ComponentModel.DataAnnotations;

namespace NotifyVisitor.Dtos.Site
{
    public class AddSiteDto
    {
        [Required]
        [StringLength(15)]
        public string Name { get; set; } = null!;
        public DateTime CreatedDateTime { get; set; } = DateTime.Now;
        public List<GetRoomDto> Rooms { get; set; } = new List<GetRoomDto>();
   //     public string UserName { get; set; } = null!;
    }
}
