using System.ComponentModel.DataAnnotations;

namespace NotifyVisitor.Dtos.Visitor
{
    public class AddVisitorDto
    {
        [Required]
        public string Telephone { get; set; } = null!;
        public int RvId { get; set; }
        public DateTime RegisteredDateTime { get; set; } = DateTime.Now;
    }
}
