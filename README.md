# divergencIA · Bárbara Menéndez

Web de Música y Primaria. Incluye recursos descargables, herramientas docentes, ritmogramas, banco de imágenes y Mentoría SEM por comunidades.

## Estructura

- `public/`: páginas, estilos, imágenes, PDF y archivos descargables.
- `src/worker.js`: servidor y API de contadores.
- `src/resource-urls.js`: recursos autorizados para los contadores.
- `migrations/`: estructura de la base de datos de contadores.

## Estado de esta copia

Incluye los últimos cambios publicados, con Cataluña y doce comunidades de Mentoría SEM. No contiene el historial Git ni las credenciales del alojamiento anterior. Repositorio: https://github.com/barbarami1977/DivergencIA. Dominio previsto: divergencia.org, registrado en DonDominio. El dominio está añadido a Cloudflare y pendiente del cambio de servidores DNS en DonDominio. Servidores asignados: `leland.ns.cloudflare.com` y `vida.ns.cloudflare.com`. La carpeta existente `Simon-MusicAl/` conserva la app de Simón y su estructura anterior.

## Publicar con Cloudflare Workers

La web está desplegada en https://divergencia.divergencia.workers.dev.

1. Instalar las dependencias con `pnpm install --frozen-lockfile` e iniciar sesión con `pnpm exec wrangler login`.
2. La base de datos `divergencia-contadores` ya está creada y vinculada en `wrangler.json`. Su identificador es configuración pública, no una credencial.
3. Ejecutar `pnpm db:migrate` si hay nuevas migraciones y `pnpm deploy` para publicar.
4. Cloudflare Workers Builds está conectado a la rama `main` de este repositorio; cada cambio en esa rama inicia una publicación automática. Comando: `pnpm exec wrangler deploy`.
5. Añadir divergencia.org al alojamiento y configurar en DonDominio los registros o servidores DNS que indique Cloudflare. Revisar antes si el dominio ya tiene correo u otros servicios. No transferir el registro del dominio para este paso.

Las credenciales de publicación se guardan fuera del repositorio.

La migración `0001_initial_counts.sql` conserva una instantánea de los contadores del 12 de noviembre de 2026. Antes del cambio definitivo conviene renovar esta instantánea para incluir las visitas más recientes.

## Autorías

Se conservan las firmas, licencias y créditos de los materiales. La copia del repositorio no concede licencias adicionales sobre sus contenidos. No se ha añadido una licencia general que sustituya las de cada recurso.
