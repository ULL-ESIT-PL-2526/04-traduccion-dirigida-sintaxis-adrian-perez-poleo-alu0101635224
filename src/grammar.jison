/* Lexer */
%lex
entero \d+
mantisa \.[0-9]+
exponente [eE][+-]?[0-9]+
%%
\s+                                   { /* skip whitespace */;        }
\/\/[^\n]*                            { /* skip one line comments*/;  }
\/\*(.|\n)*?(\*\/)                    { /* skip multiline comments */ }
"!"                                     { return 'OPFAC';               }
{entero}{mantisa}?{exponente}?        { return 'NUMBER';              }
"**"                                  { return 'OPOW';                }
[-+]                                  { return 'OPAD';                }
[*/]                                  { return 'OPMU';                }
"("                                   { return '(';                   }
")"                                   { return ')';                   }
<<EOF>>                               { return 'EOF';                 }
.                                     { return 'INVALID';             }
/lex

/* Parser */
%start expressions
%token NUMBER OPOW OPAD OPMU ( ) OPFAC EOF INVALID
%%

expressions
    : expression EOF
        { return $expression; }
    ;

expression
    : expression OPAD term
        { $$ = operate($OPAD, $expression, $term); }
    | term
        { $$ = $term; }
    ;

term
    : term OPMU right
        { $$ = operate($OPMU, $term, $right); }
    | right
        { $$ = $right; }
    ;
    
right
    : factor OPOW right
        { $$ = operate($OPOW, $factor, $right); }
    | factor
        { $$ = $factor; }
    ;

factor
    : expression OPFAC
        { $$ = factorial($expression); }
    | NUMBER
        { $$ = Number(yytext); }
    | '(' expression ')'
        { $$ = $expression; }
    ;
%%

function operate(op, left, right) {
  switch (op) {
    case '+': 
      return left + right;
    case '-': 
      return left - right;
    case '*': 
      return left * right;
    case '/': 
      return left / right;
    case '**':
      return Math.pow(left, right);
    default: 
      // Unexpected operator
  }
}

function factorial(number) {
  if (number === 0) return 1;
  return number * factorial(number - 1);
}


function unaryOperate(op, operand) {
  switch(op) {
    case '!': 
      return  factorial(operand);
    default:
      // Unexpeccted operator
  }
}