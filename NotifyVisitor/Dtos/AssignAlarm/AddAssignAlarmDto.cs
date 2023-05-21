using NotifyVisitor.Dtos.Alarm;
using NotifyVisitor.Dtos.Notification;
using NotifyVisitor.Dtos.Room;

namespace NotifyVisitor.Dtos.AssignAlarm
{
    public class AddAssignAlarmDto
    {
        public int RoomId { get; set; }
        public int NotificationId { get; set; }
        public int AlarmId { get; set; }
        public GetAlarmDto? Alarm { get; set; }
        public GetRoomDto? Room { get; set; }
        public GetNotificationDto? Notification { get; set; }
        public DateTime CreatedDateTime { get; set; } = DateTime.Now;
        //   public string UserName { get; set; } = null!;
    }
}
