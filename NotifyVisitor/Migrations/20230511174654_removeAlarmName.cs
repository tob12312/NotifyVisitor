using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NotifyVisitor.Migrations
{
    /// <inheritdoc />
    public partial class removeAlarmName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlarmName",
                table: "TriggeredAlarm");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDateTime",
                table: "AssignAlarm",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedDateTime",
                table: "AssignAlarm");

            migrationBuilder.AddColumn<string>(
                name: "AlarmName",
                table: "TriggeredAlarm",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
