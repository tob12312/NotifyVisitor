using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NotifyVisitor.Migrations
{
    /// <inheritdoc />
    public partial class Revver : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Room_Site_SiteId",
                table: "Room");

            migrationBuilder.AlterColumn<int>(
                name: "SiteId",
                table: "Room",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Room_Site_SiteId",
                table: "Room",
                column: "SiteId",
                principalTable: "Site",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Room_Site_SiteId",
                table: "Room");

            migrationBuilder.AlterColumn<int>(
                name: "SiteId",
                table: "Room",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Room_Site_SiteId",
                table: "Room",
                column: "SiteId",
                principalTable: "Site",
                principalColumn: "Id");
        }
    }
}
