using System.ComponentModel.DataAnnotations;

namespace NotifyVisitor.Models
{
    public class Site
    {
        // Site are defined as in (Alarm) zones, and are areas that can span over multiple buildings etc.
        // User should be able to set one Alarm, one Notification for all Rooms in Site.
        // User should be able to set and trigger Alarm across Sites.
        //
        // One User (Site Manager) can have access to one or many Sites, depending on group/grants.
        // Site contains many Rooms, and Room can only have one Site.
        // Room have attributes floor, building, and siteId.
        //
        // User is data owner, and can Assign Alarms to Rooms (Sites) and Notifications across Sites.
        //
        // If Customer entity/class -> One DB per customer/ customer identifier for many customers per DB.
        [Key]
        public int Id { get; set; } // Org. no or other unique identifier can be used
        [Required]
        [StringLength(15)]
        public string Name { get; set; } = null!;
        public DateTime CreatedDateTime { get; set; } = DateTime.Now;
        public List<Room> Rooms { get; set; } = new List<Room>();
      //  public string UserName { get; set; } = null!;
    }
}
