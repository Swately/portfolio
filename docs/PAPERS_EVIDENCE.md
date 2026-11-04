# Registro de evidencia: papers y método (/papers)

Este documento respalda lo que afirma la página `/papers`. Cada cifra que la página imprime está escrita aquí
con el comando que la produjo, y `src/content/papers.test.ts` falla si una cifra impresa no figura en este
registro (el tipo `Claim` protege contra la OMISIÓN de evidencia; la prueba, contra la DERIVA entre la página y
su registro; ninguno de los dos sabe si una cifra es falsa: los comandos se ejecutaron de primera mano el
2026-11-04).

Los protocolos de LLM del autor viven en un contenedor de desarrollo que no está publicado. Para que sus
afirmaciones sean comprobables sin publicarlos enteros, la sección «Protocolos» cita aquí fragmentos breves con
su ruta de archivo y la línea donde están, tal como se leyeron el 2026-11-04.

## Paginas de cada PDF

Comando: `python -I -c "import pypdf; print(len(pypdf.PdfReader(<archivo>).pages))"` sobre cada PDF publicado en
`public/papers/`. Los PDF publicados son copias byte a byte de los de `phyriad-papers/<carpeta>/paper_{es,en}.pdf`
(los tamaños coinciden: 370436, 359571, 194162, 190879, 165618, 163540, 141787 y 139975 bytes).

| Paper        | Español    | Inglés     |
| ------------ | ---------- | ---------- |
| Holónico     | 27 páginas | 25 páginas |
| Desconexión  | 15 páginas | 14 páginas |
| Convergencia | 11 páginas | 11 páginas |
| Grano        | 7 páginas  | 7 páginas  |

Fecha: los ocho PDF tienen fecha de modificación 2026-06-22 en el sistema de archivos; los `.tex` llevan
`\date{2026}`. No existe historial de versiones: ninguna de las carpetas tiene `.git` (el contenedor perdió el
suyo el 2026-07-15) y solo queda esa fecha.

## Resumen de cada paper

Texto tomado del `\begin{abstract}` de `paper_en.tex` de cada carpeta, leído el 2026-11-04. La página lo
resume; no añade resultados.

- **Holónico**: marco constitutivo mínimo de tres compromisos (partición en módulos, escala de tiempo y
  contrafactual de contracción), declarados antes de los datos; «necesario, no suficiente»; la demarcación
  sigue como consecuencia; «el universo es el holón principal» se muestra como error de categoría; un apéndice
  informa una autofalsificación de un sistema holónico construido.
- **Desconexión**: marco mínimo de separabilidad de tres compromisos (descomposición, base de superveniencia
  humeana, contrafactual de no-todo-no-separable); el pincer con la no-separabilidad cuántica (Bell); la
  «pared de autorrefutación»; holismo y desconexión como gemelos empíricos en sus lecturas fuertes.
- **Convergencia**: tres movimientos a prueba de comparación (isomorfismo estructural, equivalencia empírica,
  colisión compartida); el eje todo-relacionado ↔ nada-relacionado es una lente, no un hecho; el entrelazamiento
  dice «no» a ambos extremos.
- **Grano**: la decoherencia fija la base de la estructura relacional, pero no la descomposición; el grano que
  maximiza la información efectiva de Hoel es un funcional de la dinámica, no coincide con los sectores
  einseleccionados salvo alineación accidental, puede estar anti-alineado y no es único.

## Estado y limites declarados por los propios papers

Fuente: los `SPINE.md` publicados en `public/papers/` (el holónico no tiene `SPINE.md`).

- Convergencia, «Honesty buckets»: el teorema de los gemelos empíricos es «an analytical result
  (`conjectured`, argued), not a measurement»; la colisión con el entrelazamiento es `measured`/V1.
- Grano, «Honesty buckets»: el motor de información efectiva y el oráculo son `measured` («validated (1e-15 vs
  the KL form) against a published emergent oracle (CE +0.3774)»); la generalización metafísica es
  `conjectured` fuera de las clases de modelos simuladas. No se volvió a ejecutar ese cálculo al publicar
  esta página: la cifra se cita del `SPINE.md`.
- Grano, «The honest ceiling»: «an external human physicist was not viable», así que el corrector fue la
  realidad/cómputo, un revisor de contexto limpio y el propio veto del autor.
- Disconnection y convergencia: «Necessary-only»: «NEVER "exactly when"; NEVER "iff" except stipulative
  definitions».

No se verificó en este trabajo: la corrección de los argumentos de los papers, ni que las referencias
bibliográficas de los PDF conserven los niveles de verificación que declaran.

## Protocolos

Rutas relativas a `F:\Phyriad\protocols\`; líneas leídas el 2026-11-04.

### KAP: Knowledge-Analysis Protocol

`analysis/KNOWLEDGE_ANALYSIS_PROTOCOL.md`.

- Líneas 12 a 16: el protocolo describe «a body of knowledge on _any_ topic is swept, frozen into an identity,
  executed pass-by-pass, and certified at each pass boundary by a **context-clean auditor**».
- Líneas 20 a 28: «It codifies a process that was **run twice** — the holonic paper and its deliberate mirror,
  the disconnection paper — each through the full arc of §3, and found sound by the operator.» Y: «The
  protocol-as-written is `designed`; the practice it records is `exercised`.» Y que si el lazo produce mejor
  análisis que un proceso más simple es una pregunta abierta (`value-indeterminate`).
- Líneas 94 a 123: dos roles que no pueden ser el mismo contexto: SUPERVISOR (ejecuta y es dueño de la
  pasada) y VISTA (auditor de contexto limpio que solo certifica; «forbidden to propose, redesign, or
  improve»).
- Líneas 133 a 175: el embudo de siete pasadas (0 barrido del estado del arte, 1 congelar la identidad, 2
  andamio, 3 contenido, 4 estructural, 5 editorial / revisor hostil, 6 correcciones). La identidad se congela
  en la pasada 1 y de ahí en adelante cada pasada pregunta «does this conform to the frozen plan?».
- Líneas 183 a 185: el arco puede colapsar las pasadas 2 a 4, pero «What is NOT optional is the **freeze**
  (Phase 1) and a **gate** at each pass boundary».
- Líneas 208 a 245: 16 invariantes, INV-1 a INV-16, en cuatro familias (identidad, carga demostrativa,
  evidencia y honestidad, integridad de fronteras). Incluyen «No V3 (speculative) source is presented as fact»
  (INV-10) y «native, not translated» (INV-15).
- Cuántos gates registrados existen para los papers de convergencia y grano: sus `SPINE.md` dicen «Run the
  KAP gate (T2 + T3, clean VISTA)» antes de darlos por terminados; en `phyriad-papers/` no encontré el
  registro de esas auditorías, así que la página no afirma que se hayan completado.

### FDP: Formal Document Protocol

`quality/FORMAL_DOCUMENT_PROTOCOL.md`, líneas 85 a 150.

- «Every reference and every checkable claim in a Phyriad formal document MUST be real and verifiable.»
- Tres niveles de verificación obligatorios para toda referencia externa: V1 (fuente primaria, de primera
  mano), V2 (primaria parcial: resumen o página de entrada) y V3 (secundaria). «Inventing a `[V1]` is the
  cardinal sin restated. When in doubt, mark lower.»
- Obligación «could not verify»: lo no verificado se dice explícitamente.

### CONDUCT: honestidad y anti-recompensa

`core/CONDUCT_PROTOCOL.md`, líneas 27 a 83.

- «Every verifiable assertion MUST be verified **before** being asserted.»
- Verbos calibrados: «"Compiled" ≠ "tests pass" ≠ "validated"»; cubos de estado: `shipping`, `designed`,
  `measured`, `unmeasured`, `conjectured`, `aspirational`, `deflated`.
- «Real numbers or "didn't measure"»; «What was not run is declared.»

### Metacognicion: lo que dirige debe ganarselo

`core/METACOGNITION_PROTOCOL.md` y su resumen en `core/BOOT_PROTOCOL.md`, líneas 124 a 134: un marco o premisa
heredada «is asked to re-earn its steering rights»; cinco disparadores obligan una entrada en el registro de
aprendizaje.

### Delegacion a subordinados

`delegation/SUBAGENT_DELEGATION_PROTOCOL.md`; `core/BOOT_PROTOCOL.md`, líneas 67 a 75: un subordinado es opcional
y su resultado «is a claim to be re-verified, not a fact»; el modelo de cada subordinado se elige por tarea.

## Que no afirma esta pagina

No afirma que los papers hayan sido revisados por pares ni que sus tesis sean ciertas; son análisis del
autor, y varias de sus piezas están declaradas por ellos mismos como argumentadas o conjeturadas. No afirma que
el método KAP produzca mejores papers que otro: el propio protocolo declara esa pregunta abierta. Tampoco
afirma que el método se aplicara completo a los cuatro papers.

<!-- Made with my soul - Swately <3 -->
