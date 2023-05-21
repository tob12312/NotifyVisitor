using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NotifyVisitor.Migrations
{
    /// <inheritdoc />
    public partial class Site : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "User",
                table: "Site");

            migrationBuilder.DropColumn(
                name: "Site",
                table: "Room");

            migrationBuilder.AlterColumn<string>(
                name: "Telephone",
                table: "Visitor",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Site",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "SiteId",
                table: "Room",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Room_SiteId",
                table: "Room",
                column: "SiteId");

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

            migrationBuilder.DropIndex(
                name: "IX_Room_SiteId",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "SiteId",
                table: "Room");

            migrationBuilder.AlterColumn<string>(
                name: "Telephone",
                table: "Visitor",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Site",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "User",
                table: "Site",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Site",
                table: "Room",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
