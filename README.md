# 🚀 Portfolio Full-Stack — Frontend

Frontend de un portafolio profesional dinámico construido con **Next.js 16**, **React 19**, **TypeScript** y **Tailwind CSS**. Se conecta a un backend **FastAPI** que gestiona todo el contenido de forma dinámica, con soporte completo de internacionalización (i18n), panel de administración, analíticas en tiempo real y modo oscuro/claro.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tech Stack](#-tech-stack)
- [Arquitectura](#-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)
- [Landing Page](#-landing-page)
- [Dashboard de Administración](#-dashboard-de-administración)
- [Autenticación](#-autenticación)
- [Internacionalización (i18n)](#-internacionalización-i18n)
- [Sistema de Temas](#-sistema-de-temas)
- [Analíticas](#-analíticas)
- [API Proxy](#-api-proxy)

---

## ✨ Características

- **Landing page completa** con 11 secciones dinámicas (Hero, About, Skills, Experience, Education, Certificaciones, Blog, Proyectos, Contacto, etc.)
- **Panel de administración** con CRUD completo para todo el contenido
- **SSR (Server-Side Rendering)** para la landing page con fetch paralelo de datos
- **Internacionalización** con soporte para Español e Inglés (next-intl + traducciones dinámicas del backend vía IA)
- **Modo oscuro/claro** automático con CSS variables y Material-UI
- **Analíticas en tiempo real** con Socket.IO + REST API
- **Autenticación JWT** con refresh automático de tokens y protección CSRF
- **Formulario de contacto** conectado al backend para envío de emails
- **Galería de imágenes** con lightbox en la página de detalle de proyectos
- **Animaciones fluidas** con Framer Motion en toda la aplicación
- **Loading animado** con anillos orbitantes y puntos con gradiente
- **Responsive design** optimizado para móvil, tablet y escritorio

---

## 🛠 Tech Stack

| Categoría | Tecnología |
|-----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Lenguaje** | TypeScript 5 |
| **Estilos** | Tailwind CSS 4 + CSS Variables |
| **UI Components** | Material-UI 7 (dashboard) |
| **Animaciones** | Framer Motion 12 |
| **Forms** | React Hook Form + Zod 4 |
| **HTTP Client** | Axios (client) + fetch (SSR) |
| **i18n** | next-intl 4 |
| **Realtime** | Socket.IO Client |
| **Icons** | Lucide React + MUI Icons |
| **Backend** | FastAPI (Python) — repositorio separado |

---

## 🏗 Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│                                                         │
│  Landing Page (SSR)          Dashboard (CSR)             │
│  ┌──────────────┐            ┌──────────────────┐       │
│  │ [locale]/    │            │ /dashboard/      │       │
│  │  page.tsx    │            │  blog/projects/  │       │
│  │  (Server     │            │  skills/...      │       │
│  │   Component) │            │  (Client Comps)  │       │
│  └──────┬───────┘            └────────┬─────────┘       │
│         │ fetch() directo            │ axios            │
│         │ con ?lang=locale           │ + CSRF token     │
│         ▼                            ▼                  │
│  ┌──────────────────────────────────────────────┐       │
│  │        Next.js API Routes (/api/*)           │       │
│  │        Proxy con cookies + CSRF              │       │
│  │        Forwarding de ?lang= param            │       │
│  └──────────────────┬───────────────────────────┘       │
└─────────────────────┼───────────────────────────────────┘
                      │
                      ▼
          ┌───────────────────────┐
          │   FastAPI Backend     │
          │   localhost:5003      │
          │   /api/v1/*           │
          └───────────────────────┘
```

**Flujo de datos:**

- **Landing page (SSR):** Server Components hacen `fetch()` directo al backend con `?lang=locale` para obtener contenido traducido.
- **Dashboard (CSR):** Componentes cliente usan Axios → Next.js API routes (proxy) → Backend. El interceptor de Axios agrega automáticamente `?lang=` basado en el locale de la URL.

---

## 📁 Estructura del Proyecto

```
my-portfolio/
├── app/
│   ├── [locale]/               # Páginas con soporte i18n
│   │   ├── page.tsx            # Landing page principal (SSR)
│   │   └── projects/[slug]/    # Detalle de proyecto
│   ├── api/                    # Rutas proxy al backend
│   │   ├── auth/               # Login, register, refresh, logout
│   │   ├── blog/               # CRUD blog
│   │   ├── projects/           # CRUD proyectos
│   │   ├── skills/             # CRUD skills
│   │   ├── experience/         # CRUD experiencia
│   │   ├── education/          # CRUD educación
│   │   ├── courses/            # CRUD cursos
│   │   ├── personal-info/      # CRUD info personal
│   │   ├── contact/            # Envío de emails
│   │   └── analytics/          # Tracking y métricas
│   ├── components/
│   │   ├── shared/             # Componentes de la landing page
│   │   ├── forms/              # Formularios (Login, Register)
│   │   └── ui/                 # Componentes reutilizables (Section, Card)
│   ├── dashboard/              # Panel de administración
│   │   ├── _components/        # Componentes compartidos del dashboard
│   │   ├── analytics/          # Analíticas y métricas
│   │   ├── blog/               # Gestión de blog
│   │   ├── projects/           # Gestión de proyectos
│   │   ├── skills/             # Gestión de skills
│   │   ├── experience/         # Gestión de experiencia
│   │   ├── education/          # Gestión de educación
│   │   ├── courses/            # Gestión de cursos
│   │   ├── personal-info/      # Gestión de info personal
│   │   ├── users/              # Gestión de usuarios
│   │   └── welcome/            # Página de bienvenida
│   ├── i18n/                   # Configuración de internacionalización
│   ├── lib/                    # Utilidades de fetch SSR
│   ├── login/                  # Página de login
│   ├── register/               # Página de registro
│   ├── password-reset/         # Recuperación de contraseña
│   └── theme/                  # Configuración de Material-UI
├── hooks/                      # Custom React hooks (useAuth)
├── messages/                   # Traducciones estáticas de UI
│   ├── es.json                 # Español (default)
│   └── en.json                 # Inglés
├── services/                   # Servicios de API (Axios)
├── types/                      # Tipos TypeScript
└── public/                     # Assets estáticos
```

---

## 📋 Requisitos Previos

- **Node.js** 18.17 o superior
- **npm** 9+ (o yarn / pnpm)
- **Backend FastAPI** corriendo en `http://localhost:5003` (repositorio separado)

---

## ⚙ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd my-portfolio
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
# URL del backend FastAPI (obligatorio)
REACT_API_HOST=http://localhost:5003/api/v1

# Analíticas en tiempo real (opcional)
NEXT_PUBLIC_ANALYTICS_SOCKET_URL=http://localhost:5003
NEXT_PUBLIC_ANALYTICS_SOCKET_PATH=/ws/socket.io
NEXT_PUBLIC_ANALYTICS_NAMESPACE=/analytics
NEXT_PUBLIC_ANALYTICS_ROOM=dashboard
NEXT_PUBLIC_ANALYTICS_REALTIME_DAYS=7

# URL pública del backend (opcional)
NEXT_PUBLIC_BACKEND_URL=http://localhost:5003
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

> **Nota:** El backend FastAPI debe estar corriendo antes de iniciar el frontend para que la landing page cargue datos reales. Sin backend, se muestran datos de fallback.

---

## 🔑 Variables de Entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `REACT_API_HOST` | ✅ | URL base del backend FastAPI (ej: `http://localhost:5003/api/v1`) |
| `NEXT_PUBLIC_ANALYTICS_SOCKET_URL` | ❌ | URL del servidor WebSocket para analíticas en tiempo real |
| `NEXT_PUBLIC_ANALYTICS_SOCKET_PATH` | ❌ | Path del socket para Socket.IO |
| `NEXT_PUBLIC_ANALYTICS_NAMESPACE` | ❌ | Namespace de Socket.IO para analíticas |
| `NEXT_PUBLIC_ANALYTICS_ROOM` | ❌ | Room de Socket.IO para el dashboard |
| `NEXT_PUBLIC_ANALYTICS_REALTIME_DAYS` | ❌ | Días de datos en tiempo real (default: 7) |
| `NEXT_PUBLIC_BACKEND_URL` | ❌ | URL pública del backend |

---

## 📜 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| **dev** | `npm run dev` | Inicia el servidor de desarrollo con hot-reload |
| **build** | `npm run build` | Compila la aplicación para producción |
| **start** | `npm start` | Inicia el servidor de producción |
| **lint** | `npm run lint` | Ejecuta ESLint para verificar el código |

---

## 🌐 Landing Page

La landing page se renderiza con **Server-Side Rendering (SSR)**. Todos los datos se obtienen en paralelo del backend antes de enviar el HTML al cliente.

### Secciones

| Sección | Descripción | Datos |
|---------|-------------|-------|
| **Header** | Navegación principal + selector de idioma | Personal Info |
| **Hero** | Presentación con nombre, título y CTAs | Personal Info |
| **About** | Biografía profesional y resumen | Personal Info |
| **Skills** | Skills técnicos agrupados por categoría con barras de progreso y emojis | Skills API |
| **Experience** | Timeline de experiencia laboral | Experience API |
| **Education** | Formación académica | Education API |
| **Certifications** | Cursos y certificaciones completados | Courses + Blog API |
| **Blog** | Posts recientes del blog | Blog API |
| **Projects** | Grid de proyectos con imagen principal y enlace a detalle | Projects API |
| **Contact** | Formulario de contacto + información de redes sociales | Contact + Personal Info API |
| **Footer** | Pie de página con links | Personal Info |

### Página de Detalle de Proyecto

Ruta: `/[locale]/projects/[slug]`

- Imagen principal del proyecto
- Galería de imágenes con lightbox (click para ampliar)
- Descripción completa y contenido
- Tecnologías utilizadas
- Links al repositorio y demo

---

## 🔧 Dashboard de Administración

Ruta: `/dashboard`

Panel completo de administración con Material-UI para gestionar todo el contenido del portafolio.

### Módulos

| Módulo | Ruta | Operaciones |
|--------|------|-------------|
| **Welcome** | `/dashboard/welcome` | Vista de bienvenida |
| **Blog** | `/dashboard/blog` | Crear, editar, eliminar, restaurar, publicar/despublicar |
| **Projects** | `/dashboard/projects` | Crear, editar, eliminar, restaurar, toggle visibilidad |
| **Skills** | `/dashboard/skills` | Crear, editar, eliminar, restaurar con picker de emojis categorizado |
| **Experience** | `/dashboard/experience` | Crear, editar, eliminar, restaurar posiciones laborales |
| **Education** | `/dashboard/education` | Crear, editar, eliminar entradas educativas |
| **Courses** | `/dashboard/courses` | Crear, editar, eliminar cursos/certificaciones |
| **Personal Info** | `/dashboard/personal-info` | Gestionar información personal, bio, redes sociales |
| **Users** | `/dashboard/users` | Gestión de usuarios del sistema |
| **Analytics** | `/dashboard/analytics` | Métricas, vistas, eventos, referrers, países |

### Funcionalidades del Dashboard

- **Drawer lateral** para formularios de creación/edición con efecto glassmorphism
- **Vistas en tabla y grid** con toggle
- **Búsqueda y filtros** en todos los módulos
- **Soft delete** con posibilidad de restaurar registros
- **Animaciones** con Framer Motion en transiciones de tabla
- **Validación de formularios** con React Hook Form + Zod

---

## 🔐 Autenticación

### Flujo

1. **Login** (`/login`) — Email + contraseña → JWT access token + refresh token en cookies httpOnly
2. **Register** (`/register`) — Registro de nuevos usuarios con validación
3. **Password Reset** (`/password-reset`) — Proceso en 2 pasos:
   - Enviar email de recuperación
   - Ingresar código OTP + nueva contraseña
4. **Refresh automático** — Interceptor de Axios detecta 401 y refresca el token automáticamente
5. **CSRF Protection** — Token CSRF en cookie, enviado como header en cada mutación

### Auth Context

```tsx
const { user, isAuthenticated, login, logout, loading } = useAuth();
```

El hook `useAuth()` provee el estado de autenticación a toda la aplicación mediante React Context.

---

## 🌍 Internacionalización (i18n)

### Dos niveles de traducción

1. **UI estática (next-intl):** Textos de interfaz como botones, labels, títulos de sección. Definidos en `messages/es.json` y `messages/en.json`.

2. **Contenido dinámico (backend):** Títulos, descripciones y contenido de blog, proyectos, skills, etc. El backend almacena traducciones en una columna `translations` (JSONB) y resuelve el idioma con el query param `?lang=`.

### Cómo funciona

- La URL determina el locale: `/es/...` → español, `/en/...` → inglés
- **SSR:** El Server Component pasa el `locale` a las funciones de fetch → `?lang=en` al backend
- **CSR:** El interceptor de Axios detecta el locale de la URL y agrega `?lang=` automáticamente
- **Selector de idioma:** Componente `LanguageSelector` en el header para cambiar entre ES/EN

### Campos traducidos por modelo

| Modelo | Campos que se traducen |
|--------|----------------------|
| **Project** | `title`, `description`, `content` |
| **Blog** | `title`, `description`, `content` |
| **Experience** | `title`, `description`, `content` |
| **Course** | `description`, `content` |
| **Education** | `description`, `content` |
| **Skill** | `description` |
| **Personal Info** | `headline`, `bio` |

> Los campos como `slug`, `images`, `metadata`, `order`, `visible` nunca se traducen.

---

## 🎨 Sistema de Temas

### Modo Oscuro / Claro

El tema se detecta automáticamente según las preferencias del sistema operativo (`prefers-color-scheme`).

### Colores principales

| Token | Light | Dark |
|-------|-------|------|
| Primary | `#6366f1` (Indigo) | `#818cf8` |
| Secondary | `#ec4899` (Pink) | `#f472b6` |
| Background | `#f8fafc` | `#0b0f1a` |
| Card | `#ffffff` | `#111827` |
| Accent | `#8b5cf6` | `#a78bfa` |

### Diseño

- **Glassmorphism** en el dashboard (superficies semi-transparentes con blur)
- **Gradientes** en acentos: `#3b82f6 → #8b5cf6 → #ec4899`
- **CSS Variables** para consistencia entre Tailwind y Material-UI
- **Animaciones** con Framer Motion (fade-in, slide-up, scale)

---

## 📊 Analíticas

Ruta: `/dashboard/analytics`

### Métricas disponibles

- **Resumen general** — Total de vistas y tendencias
- **Top contenido** — Páginas y secciones más visitadas
- **Vistas por fecha** — Gráficos con granularidad por hora, día, semana o mes
- **Eventos recientes** — Stream de eventos en tiempo real
- **Top referrers** — Fuentes de tráfico
- **Top países** — Distribución geográfica de visitantes
- **Estado en vivo** — Indicador de conexión en tiempo real

### Implementación

- **REST API** para datos históricos (`services/analytics.service.ts`)
- **WebSocket (Socket.IO)** para eventos en tiempo real (`services/analyticsRealtimeClient.ts`)
- **PageViewTracker** en la landing page para tracking automático de vistas

---

## 🔀 API Proxy

Todas las llamadas al backend pasan por **Next.js API Routes** como proxy. Esto permite:

- **Ocultar** la URL del backend del cliente
- **Reenviar cookies** de autenticación (httpOnly)
- **Incluir CSRF token** en mutaciones
- **Forwarding de `?lang=`** para traducciones

### Rutas proxy disponibles

| Ruta Frontend | Backend |
|---------------|---------|
| `/api/blog` | `/api/v1/blog` |
| `/api/projects` | `/api/v1/projects` |
| `/api/skills` | `/api/v1/skills` |
| `/api/experience` | `/api/v1/experience` |
| `/api/education` | `/api/v1/education` |
| `/api/courses` | `/api/v1/courses` |
| `/api/personal-info` | `/api/v1/personal-info` |
| `/api/contact` | `/api/v1/contact` |
| `/api/auth/*` | `/api/v1/auth/*` |
| `/api/analytics/*` | `/api/v1/analytics/*` |

Cada recurso tiene rutas adicionales para operaciones admin (`/api/*/admin/*`) con GET por ID, PUT, DELETE y restore.

---

## 📄 Licencia

Proyecto privado. Todos los derechos reservados.
