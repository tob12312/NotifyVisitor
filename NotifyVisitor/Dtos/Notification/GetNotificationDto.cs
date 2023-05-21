using System.ComponentModel.DataAnnotations;

namespace NotifyVisitor.Dtos.Notification
{
    public class GetNotificationDto
    {
        public int Id { get; set; }
        [Required]
        [StringLength(25)]
        public string Name { get; set; } = null!;
        [StringLength(70)]
        public string? Text { get; set; }
        public DateTime CreatedDateTime { get; set; } = DateTime.Now;

        //  public string UserName { get; set; } = null!;
    }
}
