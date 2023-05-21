using System.ComponentModel.DataAnnotations;

namespace NotifyVisitor.Models
{
    /// <summary>
    /// TriggeredAlarm contains historical data about triggered alarms and SMS to Visitors.
    /// If the triggered alarm generates SMS to Visitors, the data is stored in TriggeredAlarms.
    /// If no Visitors are notified (Room not assigned or Visitor not present), the triggered Alarm is not saved!
    /// </summary>
    public class TriggeredAlarm
    {
        [Key]
        public int Id { get; set; } // id for each row
        public DateTime CreatedDateTime { get; set; } = DateTime.Now; // dateTime triggered
      //  public string UserName { get; set; } = null!;   
        public int AlarmId { get; set; } // Id of triggered alarm
        public int RoomId { get; set; } // id of triggered room
        public int SiteId { get; set; } // id of triggered site
        public int NotificationId { get; set; } // id of triggred notification
        public int? VisitorId { get; set; } // Visitor Id
        public string? Telephone { get; set; }  // Visitor telephone
        public string? SMS { get; set; } // SMS to Visitor, all fields     
    }
}
