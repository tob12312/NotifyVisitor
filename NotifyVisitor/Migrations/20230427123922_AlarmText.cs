using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NotifyVisitor.Migrations
{
    /// <inheritdoc />
    public partial class AlarmText : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Header",
                table: "Notification");

            migrationBuilder.AddColumn<string>(
                name: "AlarmText",
                table: "Alarm",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlarmText",
                table: "Alarm");

            migrationBuilder.AddColumn<string>(
                name: "Header",
                table: "Notification",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
