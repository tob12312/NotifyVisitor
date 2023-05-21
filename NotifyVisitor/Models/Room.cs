using System.ComponentModel.DataAnnotations;

namespace NotifyVisitor.Models
{
    public class Room
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
     //   public string UserName { get; set; } = null!;
        public List<RoomVisitor> RoomVisitors { get; set; } = new List<RoomVisitor>();
    }
}
