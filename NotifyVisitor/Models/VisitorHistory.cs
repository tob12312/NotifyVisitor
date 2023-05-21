using System.ComponentModel.DataAnnotations;

namespace NotifyVisitor.Models
{
    public class VisitorHistory
    {
        [Key]
        public int Id { get; set; }
        public int VisitorId { get; set; }
        public string? Telephone { get; set; }
        public int RvId { get; set; }
        public int SiteId { get; set; }
        public DateTime RegisteredDateTime { get; set; } = DateTime.Now;
    }
}
