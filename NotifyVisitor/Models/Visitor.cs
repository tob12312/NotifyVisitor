using System.ComponentModel.DataAnnotations;

namespace NotifyVisitor.Models
{
    public class Visitor
    {
        public int Id { get; set; }
        [Required]
        public string Telephone { get; set; } = null!;
        public int RvId { get; set; }
        public DateTime RegisteredDateTime { get; set; } = DateTime.Now;
        public List<RoomVisitor>? RoomVisitors { get; set; } = new();
    }
}
