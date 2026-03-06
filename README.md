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

### 4.1 Resolución de ejercicios
En primer lugar, se procede a detallar la derivación de las siguientes frases, junto con su respectivo árbol de análisis sintáctica (_parse tree_). Se han añadido los valores numericos en el árbol con el objetivo de ilustrar con mayor claridad el orden de ejecución de las operaciones.
- 4.0-2.0*3.0
- 2\*\*3\*\*2
- 7-4/2

#### Frase número 1: `4.0-2.0*3.0`
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

#### Frase número 2: `2**3**2`
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

#### Frase número 3: `7-4/2`
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

### 4.2 Adición de Tests
Se añadió un nuevo fichero en el directorio `__tests__` con pruebas de precedencia y asociatividad que fallaron, confirmando que nuestra gramática no funcionaba de la forma que esperábamos.

### 4.3 Modificación y mejora de la gramática
La gramática se reestructuró, creando distintos niveles para forzar el orden de ejecución de las operaciones matemáticas:
- Las variables sintáticas `E` y `T` se asocian por la izquierda (por lo que son recursivas por la izquierda), teniendo `T` una mayor precedencia (al generar árboles se encontrará más cerca de los nodos hoja, si no se usan paréntesis).
- La variable `R`, apodada como _Right_ se asocia por la derecha mediante recursividad por la derecha y se utiliza para las potencias.
- La variable `F` es la que tiene mayor precedencia, pues corresponde a los números terminales.

Las reglas que se implementaron fueron:
```bison
L -> E eof       { $$ = $1; }
E -> E opad T    { $$ = operate($2, $1, $3); }
   | T           { $$ = $1; }
T -> T opmu R    { $$ = operate($2, $1, $3); }
   | R           { $$ = $1; }
R -> F opow R    { $$ = operate($2, $1, $3); }
   | F           { $$ = $1; }
F -> NUMBER      { $$ = convert($1); }
```

### 4.4 Incorporación de expresiones entre paréntesis
Se incluyeron los tokens `(` y `)` junto a la regla `F -> ( E )       { $$ = $2; }` para asegurar que cualquier expresión contenida entre paréntesis sea evaluada antes de interactuar con operadores que estén fuera del paréntesis. 

---

## 5. Resultados
- Se ha entendido por qué era necesario modificar la gramática y en que casos el resultado no era el esperado.
- Se ha logrado mejorar la gramática incluyendo reglas de producción que corregían la precedencia y la asociatividad.
- Se ha añadido la capacidad de utilizar paréntesis.
- Se han superado todas las pruebas implementadas que verificaban el correcto funcionamiento de la gramática.