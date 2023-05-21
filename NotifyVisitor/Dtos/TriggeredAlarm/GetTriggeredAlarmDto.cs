namespace NotifyVisitor.Dtos.TriggeredAlarm
{
    public class GetTriggeredAlarmDto
    {
        public int Id { get; set; } // id for each row
        public DateTime CreatedDateTime { get; set; } = DateTime.Now; // dateTime triggered
    //    public string UserName { get; set; } = null!;
        public int AlarmId { get; set; } // Id of triggered alarm
        public int RoomId { get; set; } // id of triggered room
        public int SiteId { get; set; } // id of triggered site
        public int NotificationId { get; set; } // id of triggred notification
        public int? VisitorId { get; set; } // Visitor Id (might be null)
        public string? Telephone { get; set; }  // Visitor telephone (might be null)
        public string? SMS { get; set; } // SMS to Visitor, all fields (might be null)     
    }
}
