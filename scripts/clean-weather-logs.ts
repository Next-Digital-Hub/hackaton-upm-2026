import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

async function cleanWeatherLogs() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log("🧹 Limpiando registros meteorológicos duplicados...\n");

  try {
    // Contar registros antes
    const countBefore = await pool.query(
      'SELECT COUNT(*) FROM "weather_records"'
    );
    console.log(
      `📊 Registros actuales: ${countBefore.rows[0].count}`
    );

    // Eliminar TODOS los registros meteorológicos
    const deleted = await pool.query('DELETE FROM "weather_records"');
    console.log(`✅ Eliminados: ${deleted.rowCount} registros`);

    // Contar registros después
    const countAfter = await pool.query(
      'SELECT COUNT(*) FROM "weather_records"'
    );
    console.log(
      `📊 Registros restantes: ${countAfter.rows[0].count}\n`
    );

    console.log(
      "✨ Base de datos limpia. Los nuevos registros se crearán automáticamente."
    );
    console.log(
      "💡 Ahora solo se guardará un registro cada minuto (deduplicación activada).\n"
    );
  } catch (error) {
    console.error("❌ Error al limpiar registros:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

cleanWeatherLogs();
