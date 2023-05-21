using System.ComponentModel.DataAnnotations;

namespace NotifyVisitor.Dtos.Alarm
{
    public class UpdateAlarmDto
    {
        public int Id { get; set; }
        [Required]
        [StringLength(15)]
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        [Required]
        [StringLength(70)]
        public string AlarmText { get; set; } = null!;
        public int IsActive { get; set; }
        public DateTime CreatedDateTime { get; set; } = DateTime.Now;

        //    public string UserName { get; set; } = null!;
    }
}
