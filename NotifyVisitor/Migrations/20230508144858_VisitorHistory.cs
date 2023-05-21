using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NotifyVisitor.Migrations
{
    /// <inheritdoc />
    public partial class VisitorHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VisitorHistory",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RvId = table.Column<int>(type: "int", nullable: false),
                    RegisteredDateTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VisitorHistory", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VisitorHistory");
        }
    }
}
