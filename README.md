# Práctica 04: Traducción didirigida por la sintaxis con Jison

## Objetivos
- **Implementar una SDD:** Desarrollar una calculadora funcional basada en una Definición Dirigida por la Sintaxis que asocie reglas semánticas a la gramática.
- **Gestión de Atributos:** Utilizar el atributo `value` para almacenar y procesar los resultados de las operaciones aritméticas.
- **Generación del Parser:** Emplear la herramienta **Jison** para transformar la especificación de la gramática en un analizador sintáctico ejecutable.
- **Extensión del Lexer:** Modificar el bloque `%lex` para ignorar comentarios de una línea (`//`) y reconocer números en punto flotante y notación científica.
- **Validación por Pruebas:** Asegurar la integridad del traductor mediante el framework **Jest**, añadiendo casos de prueba para las nuevas reglas léxicas.

---
## 2. CONTEXTO

Esta práctica se enmarca dentro de la asignatura Procesadores de Lenguajes, en el tercer curso de Ingeniería Informática en la Universidad de La Laguna.
Pretende ser una introducción a la implementación de una definición dirigida a la sintaxis (_SDD_) utilizando `Jison`. Además, también se introduce la generación de test unitarios para verificar nuestro programa.

---
## 3. METODOLOGÍA

1. **Configuración del Entorno:** Instalación de las dependencias necesarias mediante `npm i` y generación inicial del parser con el comando `npx jison src/grammar.jison -o src/parser.js`.
2. **Análisis y Modificación Léxica:** Edición del archivo `grammar.jison` para actualizar las expresiones regulares del lexer, permitiendo la detección de comentarios iniciados por `//` y formatos numéricos complejos (ej. `2.35e-3`).
3. **Aplicación de Reglas Semánticas:** Vinculación de los tokens reconocidos con las funciones `convert` (para cadenas numéricas) y `operate` (para la ejecución de operaciones `+`, `-`, `*`, `/`, `**`).
4. **Ciclo de Desarrollo y Testeo:** Ejecución recurrente de `npm test` para verificar la secuencia de tokens producidos y la validez de los resultados calculados frente a los cambios realizados.

---
## 4. DESARROLLO
En primer lugar se ejecutaron las instrucciones básicas para compilar el programa y poder ejecutarlo:
### Compilación
```bash
➜  jison git:(main) ✗ npx jison grammar.jison -o parser.js
```
### Ejecución
```bash
➜  jison git:(main) ✗ node                                
Welcome to Node.js v25.6.0.
Type ".help" for more information.
> p = require("./parser.js")
{
  parser: { yy: {} },
  Parser: [Function: Parser],
  parse: [Function (anonymous)],
  main: [Function: commonjsMain]
}
> p.parse("2*3")
6
```

A continuación se da respuesta a las preguntas planteadas en el ejercicio número 2 de la práctica. Para una mayor comprensión, se muestra un fragmento del fichero `grammar.jison`:
```jison
/* Lexer */
%lex
%%
\s+                   { /* skip whitespace */; }
[0-9]+                { return 'NUMBER';       }
"**"                  { return 'OP';           }
[-+*/]                { return 'OP';           }
<<EOF>>               { return 'EOF';          }
.                     { return 'INVALID';      }
/lex
```
### 1. Describa la diferencia entre `/* skip whitespace */` y devolver un *token*
Una de las acciones que realiza el analizador léxico (lexer) es ignorar los espacios en blanco. Por ese motivo, cuando detecta el patrón \s+ no devuelve ningún token, simplemente pasa a analizar el siguiente. Por el contrario, en el resto de definiciones regulares, se identifica un lexema y se devuelve un token, que el analizador sintáctico utilizará.   

### 2. Escriba la secuencia exacta de tokens producidos para la entrada `123**45+@`.
NUMBER - OP - NUMBER - OP - INVALID - EOF

### 3. Indique por qué `**` debe aparecer antes que [-+*/].
Cuando el analizador léxico comprueba un caracter, verifica cada una de las definiciones regulares de forma secuencial. Si la definición [-+*/], que indica que si se encuentra cualquiera de los caracteres entre corchetes se devuelva el token OP, estuviera primero, cada vez que se encontrara un asterisco el lexer lo interpretaría como dicho operando y no analizaría si luego hay otro asterisco (que indica la presencia de un operador diferente).

Esta es una característica del lexer de Jison, donde el estado de aceptación es el de la expresión que [aparece primero](https://gerhobbelt.github.io/jison/docs/#lexical-analysis) en el fichero. En otros lexers se utiliza la regla de la cadena más larga (se puede configurar en Jison) que en este caso haría que el orden fuera indiferente.

### 4. Explique cuándo se devuelve `EOF`.
El token EOF se devuelve cuando se detecta el final de la entrada, esto es, que ya no se deben analizar más lexemas. Esto ayuda al lexer a conocer el final de un archivo, devolviendo al analizador sintáctico el token de fin de archivo. Además, ayuda al analizador sintáctico a saber que ya la entrada que se esperaba finalizó.

### 5. Explique por qué existe la regla `.` que devuelve **INVALID**
La regla `.` es necesaria para asegurarnos de que todos los caracteres que no son los que nosotros esperamos sean considerados como inválidos. Esto es esencial en la gestión de errores, pues son caracteres que no pertenecen al alfabeto de nuestra gramática y por lo tanto no encajan en ninguna de nuestras definiciones regulares. 

---

## 5. Resultados
- El proyecto se ha configurado correctamente
- Se ha respondido de forma satisfactoria a las preguntas planteadas sobre el fragmento de código.
- Se ha añadido la capacidad de ignorar comentarios de una sola línea al analizador sintáctico (el analizador léxico no devuelve token)
- Se ha añadido la posibilidad de realizar operaciones con números en punto flotante.
- Se han implementado numerosas pruebas que verifican el correcto funcionamiento de lo ya mencionado.