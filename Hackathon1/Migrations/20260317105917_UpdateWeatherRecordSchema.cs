using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hackathon1.Migrations
{
    /// <inheritdoc />
    public partial class UpdateWeatherRecordSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "Humidity",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "TemperatureCelsius",
                table: "WeatherRecords");

            migrationBuilder.RenameColumn(
                name: "Timestamp",
                table: "WeatherRecords",
                newName: "Fecha");

            migrationBuilder.AddColumn<int>(
                name: "Altitud",
                table: "WeatherRecords",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Dir",
                table: "WeatherRecords",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HoraHrMax",
                table: "WeatherRecords",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HoraHrMin",
                table: "WeatherRecords",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HoraPresMax",
                table: "WeatherRecords",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HoraPresMin",
                table: "WeatherRecords",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HoraTmax",
                table: "WeatherRecords",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HoraTmin",
                table: "WeatherRecords",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Horaracha",
                table: "WeatherRecords",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "HrMax",
                table: "WeatherRecords",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HrMedia",
                table: "WeatherRecords",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HrMin",
                table: "WeatherRecords",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Indicativo",
                table: "WeatherRecords",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Nombre",
                table: "WeatherRecords",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Prec",
                table: "WeatherRecords",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PresMax",
                table: "WeatherRecords",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PresMin",
                table: "WeatherRecords",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Provincia",
                table: "WeatherRecords",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Racha",
                table: "WeatherRecords",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Sol",
                table: "WeatherRecords",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Tmax",
                table: "WeatherRecords",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Tmed",
                table: "WeatherRecords",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Tmin",
                table: "WeatherRecords",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Velmedia",
                table: "WeatherRecords",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Altitud",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "Dir",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "HoraHrMax",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "HoraHrMin",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "HoraPresMax",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "HoraPresMin",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "HoraTmax",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "HoraTmin",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "Horaracha",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "HrMax",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "HrMedia",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "HrMin",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "Indicativo",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "Nombre",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "Prec",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "PresMax",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "PresMin",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "Provincia",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "Racha",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "Sol",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "Tmax",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "Tmed",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "Tmin",
                table: "WeatherRecords");

            migrationBuilder.DropColumn(
                name: "Velmedia",
                table: "WeatherRecords");

            migrationBuilder.RenameColumn(
                name: "Fecha",
                table: "WeatherRecords",
                newName: "Timestamp");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "WeatherRecords",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Humidity",
                table: "WeatherRecords",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "WeatherRecords",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "TemperatureCelsius",
                table: "WeatherRecords",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
