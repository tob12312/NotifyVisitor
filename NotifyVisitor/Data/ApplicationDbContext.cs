using NotifyVisitor.Models;
using Microsoft.EntityFrameworkCore;

namespace NotifyVisitor.Data
{
    /// <summary>
    /// Database definitions, Entities and joins. 
    /// Using EntityFrameworkCore for object mapping to SQL.
    /// Setting keys in DB.
    /// Setting indexes in DB, unique names etc.
    /// </summary>
    public class ApplicationDbContext :DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {           
        }

        public DbSet<Alarm> Alarm { get; set; }

        public DbSet<Room> Room { get; set; }

        public DbSet<Notification> Notification { get; set; }

        public DbSet<AssignAlarm> AssignAlarm { get; set; }

        public DbSet<RoomVisitor> RoomVisitor{ get; set; }

        public DbSet<Visitor> Visitor { get; set; }
    
        public DbSet<Site> Site { get; set; }

        public DbSet<TriggeredAlarm> TriggeredAlarm { get; set; }

        public DbSet<VisitorHistory> VisitorHistory { get; set; }


        // Overrides OnModelCreating for additional keys/ indexes/ constraints.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // joins on alarm, room and notification
            modelBuilder.Entity<AssignAlarm>()
                .HasKey(aa => new { aa.AlarmId, aa.RoomId, aa.NotificationId });

            // only one combination of unique alarm and room allowed
            modelBuilder.Entity<AssignAlarm>()
                .HasIndex(aa => new { aa.AlarmId, aa.RoomId }).IsUnique();

            // visitor in room
            modelBuilder.Entity<RoomVisitor>()
                .HasKey(rv => new { rv.RoomId, rv.VisitorId });

            // only one combination of unique SiteId and RoomName allowed in Room
            modelBuilder.Entity<Room>()
                .HasIndex(r => new { r.Name, r.SiteId }).IsUnique();

            // only unique names allowed - Alarm
            modelBuilder.Entity<Alarm>()
                .HasIndex(a => a.Name).IsUnique();

            // only unique names allowed - Site
            modelBuilder.Entity<Site>()
                .HasIndex(a => a.Name).IsUnique();

            // only unique names allowed - Notification
            modelBuilder.Entity<Notification>()
                .HasIndex(a => a.Name).IsUnique();
        }
    }
}
