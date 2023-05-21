namespace NotifyVisitor.Dtos.VisitorHistory
{
    public class GetVisitorHistoryDto
    {
        public int Id { get; set; }
        public int VisitorId { get; set; } // id from Entity Visitor
        public string Telephone { get; set; } = null!;
        public int RvId { get; set; }
        public int SiteId { get; set; }
        public DateTime RegisteredDateTime { get; set; } = DateTime.Now;
    }
}

