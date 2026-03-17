# Setup del Proyecto - Next Digital

## Requisitos Previos

- **Node.js**: v18.17 o superior (recomendado v20+)
- **npm**: v9+ (incluido con Node.js)
- **Git**: Para clonar el repositorio
- **PostgreSQL**: Acceso a base de datos (Neon o local)

## Instalación Rápida

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd next-digital
```

### 2. Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias listadas en `package.json`:

**Dependencias de Producción:**
- `next@16.1.7` - Framework React
- `react@19.2.3` & `react-dom@19.2.3` - React
- `@prisma/client@7.5.0` - ORM para PostgreSQL
- `next-auth@5.0.0-beta.30` - Autenticación
- `@auth/prisma-adapter@2.11.1` - Adaptador Auth para Prisma
- `zod@4.3.6` - Validación de esquemas
- `react-hook-form@7.71.2` - Manejo de formularios
- `@hookform/resolvers@5.2.2` - Resolvers para RHF + Zod
- `bcryptjs@3.0.3` - Hash de contraseñas
- `tailwind-merge@3.5.0` & `clsx@2.1.1` - Utilidades CSS
- `class-variance-authority@0.7.1` - Variantes de componentes
- `lucide-react@0.577.0` - Iconos
- `date-fns@4.1.0` - Manejo de fechas
- `shadcn@4.0.8` - Librería de componentes UI
- `@base-ui/react@1.3.0` - Componentes base
- `@neondatabase/serverless@1.0.2` - Cliente Neon
- `pg@8.20.0` - Driver PostgreSQL

**Dependencias de Desarrollo:**
- `typescript@5` - TypeScript
- `@types/node`, `@types/react`, `@types/react-dom` - Tipos
- `tailwindcss@4` & `@tailwindcss/postcss@4` - Estilos
- `prisma@7.5.0` - CLI de Prisma
- `eslint@9` & `eslint-config-next@16.1.7` - Linting
- `tsx@4.21.0` - TypeScript executor
- `dotenv@17.3.1` - Variables de entorno

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

O crea manualmente `.env` con el siguiente contenido:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-super-seguro-generado-aqui"

# Hackathon API
HACKATHON_API_URL="http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com"
HACKATHON_NICKNAME="tu-nickname"
HACKATHON_TEAM="tu-equipo"
HACKATHON_PASSWORD="tu-password"
```

**Importante:**
- Pide las credenciales de la base de datos al equipo
- Genera un `NEXTAUTH_SECRET` único ejecutando:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```

### 4. Configurar la Base de Datos

```bash
# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones (crea las tablas)
npm run db:migrate

# Sembrar datos iniciales (usuario admin, etc.)
npm run db:seed
```

### 5. Ejecutar el Proyecto

```bash
# Modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 6. Credenciales Iniciales

Después del seed, puedes usar:

```
Email: admin@hackathon.upm
Password: admin123
Rol: ADMIN
```

## Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Ejecutar ESLint

# Base de datos
npm run db:generate  # Generar cliente Prisma
npm run db:migrate   # Ejecutar migraciones
npm run db:push      # Push schema sin migraciones
npm run db:seed      # Sembrar datos iniciales
npm run db:studio    # Abrir Prisma Studio (GUI)
```

## Estructura del Proyecto

```
next-digital/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (auth)/            # Rutas de autenticación
│   │   ├── (backoffice)/      # Panel admin
│   │   └── (citizen)/         # Dashboard ciudadano
│   ├── actions/               # Server Actions
│   ├── components/            # Componentes React
│   ├── lib/                   # Utilidades y helpers
│   ├── types/                 # Tipos TypeScript
│   ├── generated/             # Código generado (Prisma)
│   └── middleware.ts          # Middleware de Next.js
├── prisma/
│   ├── schema.prisma          # Schema de base de datos
│   └── seed.ts                # Script de seed
├── public/                    # Archivos estáticos
└── ...archivos de config
```

## Resolución de Problemas

### Error: "Can't reach database server"
- Verifica que `DATABASE_URL` sea correcto
- Comprueba conexión a internet (Neon requiere conexión)
- Verifica que la IP esté permitida en Neon Dashboard

### Error: "Prisma Client not generated"
```bash
npm run db:generate
```

### Error al ejecutar seed
```bash
# Resetea la base de datos (¡CUIDADO: borra todos los datos!)
npx prisma migrate reset --force
npm run db:seed
```

### Puerto 3000 en uso
```bash
# Usa otro puerto
PORT=3001 npm run dev
```

### Problemas con TypeScript
```bash
# Limpia y reinstala
rm -rf node_modules .next
npm install
npm run dev
```

## Siguiente Paso

Lee el archivo `plan.md` para entender la arquitectura y el roadmap del proyecto.

## Soporte

Si tienes problemas, contacta con el equipo o revisa:
- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Prisma](https://www.prisma.io/docs)
- [Documentación NextAuth](https://next-auth.js.org)
