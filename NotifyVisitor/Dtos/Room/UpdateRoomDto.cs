using NotifyVisitor.Dtos.Visitor;
using System.ComponentModel.DataAnnotations;

namespace NotifyVisitor.Dtos.Room
{
    public class UpdateRoomDto
    {
        public int Id { get; set; }
        [Required]
        [StringLength(15)]
        public string Name { get; set; } = null!;
        public string? Floor { get; set; }
        public string? Building { get; set; }
        [Required]
        public int SiteId { get; set; }
        public DateTime CreatedDateTime { get; set; } = DateTime.Now;
        public List<GetVisitorDto> Visitors { get; set; } = new List<GetVisitorDto>();
        //   public string UserName { get; set; } = null!;
    }
}
