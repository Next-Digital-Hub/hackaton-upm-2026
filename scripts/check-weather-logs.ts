import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

async function checkWeatherRecords() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const result = await pool.query(`
      SELECT 
        id, 
        disaster, 
        province,
        to_char("fetched_at", 'YYYY-MM-DD HH24:MI:SS.MS') as fetched_at
      FROM weather_records 
      ORDER BY "fetched_at" DESC 
      LIMIT 20
    `);

    console.log("\n📊 Últimos 20 registros meteorológicos:\n");
    console.log("Disaster | Provincia | Fetched At");
    console.log("---------|-----------|---------------------------");
    
    result.rows.forEach((row) => {
      const disasterLabel = row.disaster ? "✅ SÍ   " : "❌ NO   ";
      console.log(`${disasterLabel} | ${row.province?.padEnd(9) || "N/A      "} | ${row.fetched_at}`);
    });

    console.log(`\n📈 Total registros: ${result.rows.length}\n`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
  }
}

checkWeatherRecords();
