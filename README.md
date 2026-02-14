# Gaffete Digital Admin Panel

Este es un sistema profesional para la gestión de gaffetes digitales, integrado con **Supabase** para persistencia de datos y listo para ser desplegado en **Render**.

## 🚀 Características
- **Login Seguro**: Acceso administrativo protegido.
- **Gestión de Personal**: Crear, editar y eliminar perfiles.
- **Gaffete Digital**: Vista pública optimizada para dispositivos móviles con QR y datos verificados.
- **Sincronización en Tiempo Real**: Los datos se guardan en la nube usando Supabase.

## 🛠️ Requisitos e Instalación

1. **Clonar/Descargar** el proyecto.
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Configurar Supabase**:
   - Crea un proyecto en [Supabase](https://supabase.com/).
   - Ejecuta el contenido de `SUPABASE_SETUP.sql` en el Editor SQL de tu proyecto.
   - Copia tu **URL** y **Anon Key**.
4. **Variables de Entorno**:
   - Crea un archivo `.env` en la raíz del proyecto.
   - Copia el contenido de `.env.example` y pega tus credenciales:
     ```env
     VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
     VITE_SUPABASE_ANON_KEY=tu-clave-anon
     ```
5. **Ejecutar Localmente**:
   ```bash
   npm run dev
   ```

## 🌐 Despliegue en Render

Para subirlo a [Render](https://render.com/):
1. Sube este código a un repositorio de GitHub.
2. Crea un nuevo **Static Site** en Render.
3. Configura:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. **IMPORTANTE**: En la sección de "Environment", agrega las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

## 🔑 Acceso Demo
- **Clave**: `admin`
