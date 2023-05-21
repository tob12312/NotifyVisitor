namespace NotifyVisitor.Models
{
    public class RoomVisitor
    {
        public int RoomId { get; set; }
        public Room Room { get; set; } = null!;
        public int VisitorId { get; set; }
        public Visitor Visitor { get; set; } = null!;
    }
}
