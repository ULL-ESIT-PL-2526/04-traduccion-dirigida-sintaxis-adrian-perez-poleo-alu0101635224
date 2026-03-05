# Práctica 05: Traducción didirigida por la sintaxis con Jison

## Objetivos
- **Analizar Derivaciones y Árboles Sintácticos:** Comprender cómo la gramática original evalúa las expresiones estrictamente de izquierda a derecha.

- **Implementar Precedencia y Asociatividad:** Modificar la Definición Dirigida por la Sintaxis (SDD) para respetar el orden matemático de los operadores (`+`, `-`, `*`, `/`, `**`).

- **Soporte de Paréntesis:** Extender el analizador léxico y sintáctico para reconocer y dar máxima prioridad a las expresiones agrupadas `( E )`.

- **Validación por Pruebas (TDD):** Utilizar Jest para demostrar los fallos de la gramática inicial y verificar la corrección de las nuevas reglas semánticas con números enteros y de punto flotante.

---
## 2. CONTEXTO

Esta práctica se enmarca dentro de la asignatura Procesadores de Lenguajes. Su propósito es profundizar en la implementación de una Definición Dirigida por la Sintaxis (SDD) utilizando la herramienta `Jison`. A diferencia de la práctica anterior, el enfoque central es la corrección de la precedencia y asociatividad de los operadores matemáticos, mostrando cómo el diseño de la gramática impacta en el orden de evaluación de las acciones semánticas.

---
## 3. METODOLOGÍA

1. **Análisis:** Trazado manual de las derivaciones y árboles de análisis sintáctico de la gramática base para evidenciar su comportamiento estrictamente asociativo por la izquierda.

2. **Desarrollo Guiado por Pruebas (TDD):** Inclusión de un conjunto de pruebas en Jest (prec.test.js) diseñado específicamente para fallar bajo la gramática original y servir como criterio de aceptación para las modificaciones.

3. **Refactorización de la Gramática:** Modificación del archivo `grammar.jison` para introducir nuevos símbolos no terminales (`E`, `T`, `R`, `F`) y separar los operadores según su jerarquía (`opad`, `opmu`, `opow`).

4. **Expansión del Analizador Léxico:** Adición de los tokens `(` y `)` para permitir la agrupación de subexpresiones.

---
## 4. DESARROLLO

En primer lugar, se procede a detallar la derivación de las siguientes frases, junto con su respectivo árbol de análisis sintáctica (_parse tree_). Se han añadido los valores numericos en el árbol con el objetivo de ilustrar con mayor claridad el orden de ejecución de las operaciones.
- 4.0-2.0*3.0
- 2\*\*3\*\*2
- 7-4/2

### Frase número 1: `4.0-2.0*3.0`
$ L \Rightarrow E \text{ eof } \Rightarrow E_1 \text{ op } T \text{ eof } \Rightarrow E_1 \text{ op } T \text{ op } T \text{ eof } \Rightarrow T \text{ op } T \text{ op } T \text{ eof } \Rightarrow number \text{ op } T \text{ op } T \text{ eof } \Rightarrow number \text{ op } number \text{ op } T \text{ eof } \Rightarrow number \text{ op } number \text{ op } number \text{ eof } $

```text
           L
         /   \
        E     eof
      / | \
     E  op  T
   / | \    |
  E  op  T  number
  |      |      \
  T    number   3.0
  |       \
number     2.0
  |
 4.0

```

Primero se calcula `4.0 - 2.0` y al resultado, que es `2.0` se le multiplica el `3.0` dando como resultado `6.0`. Vemos que esto es incorrecto, pues el resultado debería ser `-2.0`. 

### Frase número 2: `2**3**2`
$ L \Rightarrow E \text{ eof } \Rightarrow E_1 \text{ op } T \text{ eof } \Rightarrow E_1 \text{ op } T \text{ op } T \text{ eof } \Rightarrow T \text{ op } T \text{ op } T \text{ eof } \Rightarrow number \text{ op } T \text{ op } T \text{ eof } \Rightarrow number \text{ op } number \text{ op } T \text{ eof } \Rightarrow number \text{ op } number \text{ op } number \text{ eof } $

```text
           L
         /   \
        E     eof
      / | \
     E  op  T
   / | \    |
  E  op  T  number
  |      |      \
  T    number    2
  |       \
number     3
  |
  2

```
Una vez más, evaluamos de izquierda a derecha de forma ascendente. Primero se realiza `2**3` para posteriormente, operar `8**2` que es `64`. Sin embargo, la operación debería haber sido primero `3**2` para luego elevarlo a `2` resutando en `512`.

### Frase número 3: `7-4/2`
$ L \Rightarrow E \text{ eof } \Rightarrow E_1 \text{ op } T \text{ eof } \Rightarrow E_1 \text{ op } T \text{ op } T \text{ eof } \Rightarrow T \text{ op } T \text{ op } T \text{ eof } \Rightarrow number \text{ op } T \text{ op } T \text{ eof } \Rightarrow number \text{ op } number \text{ op } T \text{ eof } \Rightarrow number \text{ op } number \text{ op } number \text{ eof } $

```text
           L
         /   \
        E     eof
      / | \
     E  op  T
   / | \    |
  E  op  T  number
  |      |      \
  T    number    2
  |       \
number     4
  |
  7

```

Como en los dos casos anteriores, comenzamos en orden ascendente de izquierda a derecha, realizando la resta `7-4` (que da como resultado `3`) para posteriormente realizar la división `3/2`. Esto es igual a `1.5`. Sin embargo, el resultado correcto, aplicando precedencia y asociatividad debería ser `7-2 = 5`.

---

## 5. Resultados
- El proyecto se ha configurado correctamente
- Se ha respondido de forma satisfactoria a las preguntas planteadas sobre el fragmento de código.
- Se ha añadido la capacidad de ignorar comentarios de una sola línea al analizador sintáctico (el analizador léxico no devuelve token)
- Se ha añadido la posibilidad de realizar operaciones con números en punto flotante.
- Se han implementado numerosas pruebas que verifican el correcto funcionamiento de lo ya mencionado.