# Frontend Lab

Entorno especializado para probar y validar las últimas versiones de dependencias frontend antes de integrarlas en proyectos de producción.

## Objetivo

Este repositorio funciona como un laboratorio de pruebas: permite experimentar con versiones bleeding-edge de librerías, verificar compatibilidades y correr tests de integración (E2E con Cypress) sobre la combinación de dependencias actualizada.

## Stack

| Categoría | Dependencia | Versión |
|---|---|---|
| Framework | React | ^19 |
| Build | Vite | ^8 |
| Lenguaje | TypeScript | ^6 |
| UI | MUI v9 + Emotion | ^9 |
| Data fetching | TanStack Query | ^5 |
| Formularios | React Hook Form | ^7 |
| Routing | React Router | ^7 |
| HTTP | Axios | ^1 |
| Fechas | Day.js | ^1 |
| Testing E2E | Cypress | ^15 |
| Linting | ESLint + typescript-eslint | ^10 / ^8 |

## Comandos

```bash
# Instalar dependencias
npm install

# Levantar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa del build
npm run preview

# Linting
npm run lint

# Cypress (UI interactiva)
npx cypress open

# Cypress (headless)
npx cypress run
```

## Estructura

```
src/
├── components/   # Componentes reutilizables
├── contexts/     # React Contexts
├── layouts/      # Layouts de página
├── lib/          # Utilidades y configuración de librerías
├── pages/        # Vistas por ruta
├── providers/    # Providers globales (Query, Theme, Router)
└── theme.ts      # Configuración de tema MUI

cypress/
├── e2e/          # Tests E2E
├── fixtures/     # Datos de prueba
└── support/      # Comandos y configuración de Cypress
```

## Flujo de trabajo

1. Actualizar versiones en `package.json`
2. Correr `npm install` y resolver conflictos de tipos o APIs rotas
3. Verificar que la app levanta correctamente con `npm run dev`
4. Ejecutar la suite E2E con `npx cypress run`
5. Si todo pasa, las versiones están validadas para usar en producción
