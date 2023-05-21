using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NotifyVisitor.Migrations
{
    /// <inheritdoc />
    public partial class separatePK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_AssignAlarm",
                table: "AssignAlarm");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AssignAlarm",
                table: "AssignAlarm",
                columns: new[] { "Id", "AlarmId", "RoomId", "NotificationId" });

            migrationBuilder.CreateIndex(
                name: "IX_AssignAlarm_AlarmId",
                table: "AssignAlarm",
                column: "AlarmId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_AssignAlarm",
                table: "AssignAlarm");

            migrationBuilder.DropIndex(
                name: "IX_AssignAlarm_AlarmId",
                table: "AssignAlarm");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AssignAlarm",
                table: "AssignAlarm",
                columns: new[] { "AlarmId", "RoomId", "NotificationId" });
        }
    }
}
