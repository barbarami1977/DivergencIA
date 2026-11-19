# Revisión inicial de accesibilidad · 20 de noviembre de 2026

Referencia: WCAG 2.2 AA (https://www.w3.org/WAI/WCAG22/quickref/).

Alcance: inspección del código de las cinco páginas principales y cuatro aplicaciones. No es una certificación de conformidad ni una auditoría completa. No se dispuso de navegador de pruebas ni lector de pantalla conectado; no se verificaron visualmente los cambios de esta revisión.

## Comprobado en el código
- Idioma español y viewport sin bloquear el zoom en las páginas inspeccionadas.
- Las imágenes HTML inspeccionadas incluyen atributo alt; pendiente evaluar manualmente la calidad de cada descripción.
- Los filtros del catálogo usan etiquetas contenedoras y anuncian el número de resultados con aria-live.
- Los círculos DUA son botones, tienen nombres accesibles y admiten teclado, clic y Escape.
- El carrusel tiene pausa, navegación por teclado y detención al enfocar o activar movimiento reducido.
- Simón conserva un indicador circular de foco con teclado, aunque no muestra cuadrados al tocarlo.

## Correcciones realizadas
- Enlace «Saltar al contenido» en nueve páginas, con destino enfocable.
- Contorno explícito de foco en los controles de las páginas principales.
- Movimiento reducido: sin desplazamiento suave ni transiciones; la ampliación de la infografía se desactiva con esta preferencia.
- Verde de los sellos DUA oscurecido de #448b48 a #3d7c40 para mejorar el contraste de números blancos; conservada la gama del principio.
- Navegación móvil permite varias filas.
- Infografía con instrucciones equivalentes en texto y ampliación mediante enlace accesible con teclado y móvil.

## Pendiente para poder evaluar conformidad
- Recorrer en navegador real los flujos con teclado, VoiceOver/NVDA, zoom al 200/400 %, ancho de 320 CSS px y estilos de espaciado del usuario.
- Medir todos los contrastes computados, tamaños táctiles, estados de foco y estados de los controles de las apps; este pase solo comprueba colores concretos de DUA.
- Revisar y probar nombres/roles de diálogos y controles dinámicos; arrastre, grabación, juegos y alternativas de entrada.
- Auditar PDF por PDF: etiquetado, orden de lectura, texto seleccionable, imágenes, tablas y formularios. No se ha declarado accesible el banco de PDF.
- Revisar subtítulos y alternativas de los vídeos y dependencias de Genially/Gemini. La accesibilidad de plataformas externas no queda garantizada por estos cambios.
- Pruebas con personas usuarias y registro de incidencias.
