using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NotifyVisitor.Migrations
{
    /// <inheritdoc />
    public partial class ConstraintRoomNameAndSiteId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Room_Id_SiteId",
                table: "Room");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Room",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Room_Name_SiteId",
                table: "Room",
                columns: new[] { "Name", "SiteId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Room_Name_SiteId",
                table: "Room");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Room",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_Room_Id_SiteId",
                table: "Room",
                columns: new[] { "Id", "SiteId" },
                unique: true);
        }
    }
}
