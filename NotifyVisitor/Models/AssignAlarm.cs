using System.ComponentModel.DataAnnotations;

namespace NotifyVisitor.Models
{
    public class AssignAlarm
    {
        public int AlarmId { get; set; }
        public Alarm Alarm { get; set; } = null!;      
        public int RoomId { get; set; }
        public Room Room { get; set; } = null!;
        public int NotificationId { get; set; }
        public Notification Notification { get; set; } = null!;
        public DateTime CreatedDateTime { get; set; } = DateTime.Now;
      //  public string UserName { get; set; } = null!;

    }


}
