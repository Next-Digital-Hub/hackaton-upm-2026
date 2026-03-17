<div align="center">

# Next Digital

### Sistema de Alertas Meteorológicas · Version 1.0

![Version](https://img.shields.io/badge/version-1.0-orange)
![Release](https://img.shields.io/badge/release-GitHub%20Ready-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)

Aplicación web de alertas meteorológicas para la Hackathon UPM 2026.

</div>

---

# Next Digital - Sistema de Alertas Meteorológicas

Aplicación web de alertas meteorológicas para la Hackathon UPM 2026.

## 👥 Equipo

- **Sandra Qiao Martínez**
- **Guillermo España Jiménez**

## Tecnologías

- Next.js 15 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- NextAuth.js v5
- Tailwind CSS + shadcn/ui
- AWS Bedrock (LLM)

## Requisitos

- Node.js 18+
- PostgreSQL (o cuenta en Neon)
- Cuenta AWS con acceso a Bedrock

## Configuración

1. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales (ver `SETUP.md` para más detalles).

2. **Configurar base de datos**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```
