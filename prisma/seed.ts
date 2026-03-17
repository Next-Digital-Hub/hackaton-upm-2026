// prisma/seed.ts
// Run with: npx ts-node --compiler-options '{"module":"commonjs"}' prisma/seed.ts
// Or: npx prisma db seed

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
      province: 'Madrid',
      housingType: 'Piso alto',
      specialNeeds: null,
      campusRole: 'Administrador',
    },
  })

  console.log('✅ Admin user created successfully:')
  console.log(`   Username: admin`)
  console.log(`   Password: admin123`)
  console.log(`   Role: ${admin.role}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
