using System.ComponentModel.DataAnnotations;

namespace NotifyVisitor.Models
{
    public class Notification

    {
        public int Id { get; set; }
        [Required]
        [StringLength(25)]
        public string Name { get; set; } = null!;
        [StringLength(70)]
        public string? Text { get; set; }
        public DateTime CreatedDateTime { get; set; } = DateTime.Now;
     //   public string UserName { get; set; } = null!;

    }
}
