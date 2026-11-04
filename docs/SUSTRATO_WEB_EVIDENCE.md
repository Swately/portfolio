# Sustrato web — registro de evidencia (2026-11-04)

> **Qué es esto.** El respaldo de cada cifra que la página del proyecto (`/proyecto/sustrato-web`; la ruta antigua `/sustrato-web` redirige ahí) imprime. Cada sección dice **qué
> comando se ejecutó**, **qué salió** y **dónde se ejecutó**. La página enlaza aquí cada afirmación
> (`src/content/substrate.ts`), y una prueba (`src/content/substrate.test.ts`) falla si una cifra de la página
> no está escrita en este documento. Eso protege contra que página y registro se separen; no puede saber si una
> cifra es falsa, por eso los comandos se ejecutaron primero (2026-11-04, Windows 11, Node 24).
>
> **Sobre los nombres.** Los comandos del catálogo recorren los proyectos del contenedor de desarrollo. En una
> salida, el nombre y la ruta de un proyecto privado se sustituyeron por `(panel de monitoreo)` y `(ruta
omitida)`; es lo único que se editó de ellas.
>
> **Dónde está el catálogo.** `catalog/web/` vive en el contenedor de desarrollo del autor y no está en este
> repositorio; este repositorio contiene **la copia** del sustrato (`src/phyriad-react/`), que es justamente de
> lo que trata la página. Por eso los comandos del catálogo solo se pueden repetir en ese contenedor.

## fleet-check

Un sitio lleva una copia del sustrato; este comando recorre todas las copias de los proyectos, lee la versión que
cada una declara (`@version` en los archivos de tokens, desde la 2.1.1) y dice si coincide con el catálogo.

```text
$ node catalog/web/fleet-check.mjs
phyriad web substrate — catalog tokens 2.1.1

  ok      deadlock-skin-phyxer   2.1.1    sync.mjs   (ruta omitida)
          in sync — 120 files match catalog\web\react\src
  BEHIND  PhyriadFG              ≈1.6.0   hand copy  (ruta omitida)
          tokens differ; base differs
  ok      (panel de monitoreo)   2.1.1    hand copy  (ruta omitida)
          both files match the catalog
  ok      portfolio              2.1.1    sync.mjs   (ruta omitida)
          in sync — 120 files match catalog\web\react\src
  ok      test-page              2.1.1    sync.mjs   (ruta omitida)
          in sync — 120 files match catalog\web\react\src

5 copies, 1 behind the catalog.
```

Resumen: **5 copias, 1 atrasada**. La atrasada es PhyriadFG (una copia a mano de la 1.6.0; el símbolo `≈` marca
una versión deducida por el contenido, porque las copias anteriores a la 2.1.1 no la declaran).

## Testbench de tokens

```text
$ node catalog/web/tokens/testbench.mjs
PASS — 237 checks passed, 0 failed
```

Resumen: **237 de 237 comprobaciones**. Entre ellas, por paleta y esquema: el contraste WCAG de cada par de
colores (texto 4,5:1), que el acento no caiga en la franja violeta de las plantillas, que la tipografía fluida
conserve un término en `rem` (el zoom del lector, WCAG 1.4.4) y que no exista ninguna sombra.

## Testbench de react

```text
$ node catalog/web/react/gen-api.mjs --check
API.md is current (108 exports)
$ node catalog/web/react/testbench.mjs
PASS — 16 checks passed, 0 failed
```

Resumen: **108 exportaciones · 16 comprobaciones**. `API.md` lo genera una herramienta leyendo el código y la
comprobación falla si algo exportado queda sin documentar. Entre las 16: que ningún CSS de componente use un
umbral de ancho fuera de un vocabulario único, y que las posiciones fuera de flujo estén en una lista permitida
con su motivo.

**Sobre las versiones.** La versión de phyriad-tokens (2.1.1) la declaran los propios archivos copiados y una
prueba de este sitio la comprueba. La de phyriad-react (1.4.0) **no** la lleva la copia; se cita del catálogo:

```text
catalog/web/react/CHANGELOG.md:14:## [1.4.0] — 2026-10-20
catalog/web/react/README.md:1:# phyriad-react — 1.4.0 (stable)
catalog/web/tokens/README.md:1:# phyriad-tokens — 2.1.1 (stable)
```

## Paletas y temas

Tres paletas y tres temas tipográficos, cada uno un atributo del elemento raíz (`data-palette`, `data-type`).
Lo que cambió y cuándo, del registro de cambios de phyriad-tokens:

| Versión | Fecha      | Qué                                                                                                       |
| ------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| 1.6.0   | 2026-10-20 | la paleta `showcase` (Vitrina), el rol `--phy-paper-3`, el radio por paleta, `.phy-surface`               |
| 2.0.0   | 2026-10-20 | **MAJOR**: la paleta por defecto pasa a ser Vitrina; Óxido se conserva exacta como `data-palette="oxide"` |
| 2.1.0   | 2026-10-20 | roles de familia, temas `data-type` (Editorial, Neutral, Técnica), escala calculada                       |
| 2.1.1   | 2026-10-21 | `@version` en los archivos copiados                                                                       |

La entrada 2.0.0 es un MAJOR porque un sitio que sincroniza sin tocar nada cambia de aspecto. Un panel de
monitoreo lo absorbió con una línea (`data-palette="oxide"`): sus 558 elementos quedaron iguales (posición,
tamaño y estilo calculado, con tolerancia de 0,01 px) antes y después, en claro y oscuro, a 1280 px, medido en un
navegador sobre datos simulados.

## Escala tipográfica

La escala se calcula con `pow()` a partir de unos pocos números, con los tamaños fijos de siempre como respaldo
para un navegador sin esa función. Se comparó, en cada motor, el tamaño calculado con el fijo de cada uno de los
seis pasos originales.

Instrumento: una página de prueba que lee, en cada motor, el tamaño calculado y el fijo de cada paso.

| Motor                                    | Ventana                      | Mayor diferencia |
| ---------------------------------------- | ---------------------------- | ---------------- |
| Chromium (panel del navegador integrado) | 1280 y 1024 px               | 0,001 px         |
| Firefox 157.0.1                          | 1366 px (pasos en su máximo) | 0,000 px         |
| Firefox 157.0.1                          | 800 px (pasos interpolando)  | 0,031 px         |

Resumen: **0,001 px en Chromium · 0,031 px en Firefox 157**. Los 0,031 px de Firefox son su redondeo de los
tamaños de letra a 1/64 de píxel (por ejemplo 12,484 = 12 + 31/64), no la fórmula. Con el multiplicador de
tamaño en 1,25 el tamaño base pasó de 17 a 21,25 px, y con 3 se limitó a 1,5 (25,5 px). **Safari no se
probó.** Mediciones hechas el 2026-10-20 y 2026-10-21; el detalle está en el registro de cambios y en el estudio
del sistema tipográfico del catálogo.

## Copia de este sitio

`npm run substrate:check` ejecuta `sync.mjs src --check`, que compara cada archivo copiado con el catálogo y con
el hash que guardó la última sincronización.

```text
$ npm run substrate:check
in sync — 120 files match ..\..\catalog\web\react\src
```

Resumen: **120 archivos coinciden**. El registro de hashes que `sync.mjs` guarda está en este repositorio:
`src/phyriad-react/.sync-manifest.json`.

## Presupuesto de tamaño

`npm run size:budget` suma **todos** los fragmentos de JavaScript y de CSS del build (comprimidos con gzip) y
falla si pasan del presupuesto. Este proyecto lo subió de 115 a 135 kB de JS y de 7 a 9 kB de CSS
(`package.json`), de forma deliberada y con el costo medido:

|                                   | Antes de la sección | Con la sección |
| --------------------------------- | ------------------- | -------------- |
| JS, suma de todos los fragmentos  | 112,0 kB            | 132,3 kB       |
| CSS, suma de todos los fragmentos | 6,7 kB              | 8,3 kB         |

```text
$ npm run size:budget
  ok   js  132.29 kB of 135 kB budget (98%)
  ok   css 8.34 kB of 9 kB budget (93%)

PASS — within budget
```

Resumen (en español, con coma decimal):

**JS 132,3 de 135 kB · CSS 8,3 de 9 kB**

(Con un decimal a propósito: la propia página imprime esta cifra y su tamaño comprimido cambia una centésima
cada vez que se reescribe, de modo que 129,73 y 129,74 salieron (en una construcción anterior a la del dossier) en dos construcciones seguidas sin otro
cambio. La salida literal de arriba es la de una de ellas.)

**Costo para la página de inicio (medido).** La entrada del proyecto en la lista, más el dossier con su matriz comparativa y su gráfica, suman el resto; el laboratorio del
sustrato es la parte evitable. Ese laboratorio **no debería** cargarse en el inicio, pero se carga: la barrera de exportaciones del
sustrato (`src/phyriad-react/index.ts`) reexporta `StandardsLab`, y mientras lo haga el empaquetador mezcla el
laboratorio con las piezas comunes y lo precarga desde la entrada en todas las páginas. Lo que descarga el inicio
(entrada, precargas y hojas de estilo, comprimido con gzip, calculado con un script propio, no con la
herramienta del presupuesto):

|                | Antes    | Después                 |
| -------------- | -------- | ----------------------- |
| JS del inicio  | 83,96 kB | 95,25 kB (**+11,3 kB**) |
| CSS del inicio | 6,68 kB  | 8,04 kB (**+1,36 kB**)  |

**Causa aislada** con una copia del proyecto: quitar de esa barrera las tres líneas que reexportan el
laboratorio lo separa del inicio (que pasa a +2,5 kB de JS y +1,2 kB de CSS). Ni cargar el laboratorio con una
importación dinámica, ni importarlo directamente desde su archivo, ni un grupo de fragmentos en la configuración
del empaquetador cambió el resultado. **Arreglarlo es un cambio del catálogo, no del sitio**: quitar esas
exportaciones de la barrera es un cambio MAJOR de phyriad-react. Está pendiente.

## Accesibilidad

Instrumento: axe-core 4.13.0 en el navegador, tema claro y oscuro, a 1280 y a 390 px, con la comprobación de
contraste activa. Rutas: `/proyecto/sustrato-web` (analizada junto con su caja de demostración), `/sustrato-web/laboratorio`
y `/sustrato-web/demo` (la demostración sola).

Resumen: **0 violaciones** en todas las combinaciones (3 rutas × 2 temas × 2 anchos), sin desplazamiento
horizontal de la página.

**Un defecto que la primera medición no vio.** Analizando la página _junto con_ su caja, axe dio
`landmark-unique` sobre el `<main>` de la página: la demostración es otro documento con su propio `<main>` y las
dos regiones sin nombre chocaban (reproducido en 4 de 4 pasadas con la caja analizada). Las ocho pasadas
anteriores no analizaban la caja y daban 0. La demostración ahora nombra su región (`aria-label`), y con ella
analizada la violación desapareció.

## Límites de este registro

- Safari no se probó (necesita un Mac o un iPhone).
- Los colores forzados (alto contraste de Windows) no se midieron.
- La versión de phyriad-react se cita del catálogo; la copia no la declara.
- La escala tipográfica se midió en Chromium y en Firefox 157 (en este, a 1366 y 800 px).
- axe-core no encuentra defectos que dependen de cómo lee un lector de pantalla; no se probó con uno.
- Las cifras del catálogo (testbenches, `fleet-check`) se ejecutaron en el contenedor de desarrollo del autor.

<!-- Made with my soul - Swately <3 -->
