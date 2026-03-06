/* Lexer */
%lex
entero \d+
mantisa \.[0-9]+
exponente [eE][+-]?[0-9]+
%%
\s+                                   { /* skip whitespace */;        }
\/\/[^\n]*                            { /* skip one line comments*/;  }
\/\*(.|\n)*?(\*\/)                    { /* skip multiline comments */ }
{entero}{mantisa}?{exponente}?        { return 'NUMBER';              }
"**"                                  { return 'OPOW';                }
[-+]                                  { return 'OPAD';                }
[*/]                                  { return 'OPMU';                }
<<EOF>>                               { return 'EOF';                 }
.                                     { return 'INVALID';             }
/lex

/* Parser */
%start expressions
%token NUMBER
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
    : NUMBER
        { $$ = Number(yytext); }
    ;
%%

function operate(op, left, right) {
    switch (op) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return left / right;
        case '**': return Math.pow(left, right);
    }
}
