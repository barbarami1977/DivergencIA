# divergencIA · Bárbara Menéndez

Web de Música y Primaria. Incluye recursos descargables, herramientas docentes, ritmogramas, banco de imágenes y Mentoría SEM por comunidades.

## Estructura

- `public/`: páginas, estilos, imágenes, PDF y archivos descargables.
- `src/worker.js`: servidor y API de contadores.
- `src/resource-urls.js`: recursos autorizados para los contadores.
- `migrations/`: estructura de la base de datos de contadores.

## Estado de esta copia

Incluye los últimos cambios publicados, con Cataluña y doce comunidades de Mentoría SEM. No contiene el historial Git ni las credenciales del alojamiento anterior. Repositorio: https://github.com/barbarami1977/DivergencIA. Dominio previsto: divergencia.org, registrado en DonDominio. El dominio todavía no está conectado a este proyecto. La carpeta existente `Simon-MusicAl/` conserva la app de Simón y su estructura anterior.

## Publicar con Cloudflare Workers

1. Instalar las dependencias con `npm install` e iniciar sesión con `npx wrangler login`.
2. Crear la base de datos con `npx wrangler d1 create divergencia-contadores`.
3. Copiar `wrangler.example.json` a `wrangler.json` y sustituir el identificador de la base de datos por el obtenido en el paso anterior. No utilizar el texto de ejemplo como identificador real.
4. Ejecutar `npm run db:migrate` y `npm run deploy`.
5. Conectar este repositorio desde Cloudflare Workers Builds para las actualizaciones.
6. Añadir divergencia.org al alojamiento y configurar en DonDominio los registros o servidores DNS que indique Cloudflare. Revisar antes si el dominio ya tiene correo u otros servicios. No transferir el registro del dominio para este paso.

La configuración real `wrangler.json` se mantiene fuera de Git por defecto; antes de activar las publicaciones automáticas debe configurarse el identificador real de la base de datos en el entorno de publicación.

La migración `0001_initial_counts.sql` conserva una instantánea de los contadores del 12 de noviembre de 2026. Antes del cambio definitivo conviene renovar esta instantánea para incluir las visitas más recientes.

## Autorías

Se conservan las firmas, licencias y créditos de los materiales. La copia del repositorio no concede licencias adicionales sobre sus contenidos. No se ha añadido una licencia general que sustituya las de cada recurso.
