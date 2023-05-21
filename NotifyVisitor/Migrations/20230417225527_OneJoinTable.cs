using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NotifyVisitor.Migrations
{
    /// <inheritdoc />
    public partial class OneJoinTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AssignNotification");

            migrationBuilder.DropTable(
                name: "AssignRoom");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AssignNotification",
                columns: table => new
                {
                    AlarmId = table.Column<int>(type: "int", nullable: false),
                    RoomId = table.Column<int>(type: "int", nullable: false),
                    NotificationId = table.Column<int>(type: "int", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssignNotification", x => new { x.AlarmId, x.RoomId, x.NotificationId });
                    table.ForeignKey(
                        name: "FK_AssignNotification_Alarm_AlarmId",
                        column: x => x.AlarmId,
                        principalTable: "Alarm",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AssignNotification_Notification_NotificationId",
                        column: x => x.NotificationId,
                        principalTable: "Notification",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AssignNotification_Room_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Room",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AssignRoom",
                columns: table => new
                {
                    AlarmId = table.Column<int>(type: "int", nullable: false),
                    RoomId = table.Column<int>(type: "int", nullable: false),
                    NotificationId = table.Column<int>(type: "int", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssignRoom", x => new { x.AlarmId, x.RoomId, x.NotificationId });
                    table.ForeignKey(
                        name: "FK_AssignRoom_Alarm_AlarmId",
                        column: x => x.AlarmId,
                        principalTable: "Alarm",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AssignRoom_Notification_NotificationId",
                        column: x => x.NotificationId,
                        principalTable: "Notification",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AssignRoom_Room_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Room",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AssignNotification_NotificationId",
                table: "AssignNotification",
                column: "NotificationId");

            migrationBuilder.CreateIndex(
                name: "IX_AssignNotification_RoomId",
                table: "AssignNotification",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_AssignRoom_NotificationId",
                table: "AssignRoom",
                column: "NotificationId");

            migrationBuilder.CreateIndex(
                name: "IX_AssignRoom_RoomId",
                table: "AssignRoom",
                column: "RoomId");
        }
    }
}
