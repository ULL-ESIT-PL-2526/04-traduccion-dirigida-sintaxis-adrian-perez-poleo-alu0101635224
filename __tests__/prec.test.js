/**
 * Jest tests for the Jison parser
 * 
 */
const parse = require("../src/parser.js").parse;

describe('Parser Failing Tests', () => {

  test('should handle multiplication and division before addition and subtraction', () => {
    expect(parse("2 + 3 * 4")).toBe(14);         // 2 + (3 * 4) = 14
    expect(parse("10 - 6 / 2")).toBe(7);         // 10 - (6 / 2) = 7
    expect(parse("5 * 2 + 3")).toBe(13);         // (5 * 2) + 3 = 13
    expect(parse("20 / 4 - 2")).toBe(3);         // (20 / 4) - 2 = 3
  });

  test('should handle exponentiation with highest precedence', () => {
    expect(parse("2 + 3 ** 2")).toBe(11);        // 2 + (3 ** 2) = 11
    expect(parse("2 * 3 ** 2")).toBe(18);        // 2 * (3 ** 2) = 18
    expect(parse("10 - 2 ** 3")).toBe(2);        // 10 - (2 ** 3) = 2
  });

  test('should handle right associativity for exponentiation', () => {
    expect(parse("2 ** 3 ** 2")).toBe(512);      // 2 ** (3 ** 2) = 2 ** 9 = 512
    expect(parse("3 ** 2 ** 2")).toBe(81);       // 3 ** (2 ** 2) = 3 ** 4 = 81
  });

  test('should handle mixed operations with correct precedence', () => {
    expect(parse("1 + 2 * 3 - 4")).toBe(3);      // 1 + (2 * 3) - 4 = 3
    expect(parse("15 / 3 + 2 * 4")).toBe(13);    // (15 / 3) + (2 * 4) = 13
    expect(parse("10 - 3 * 2 + 1")).toBe(5);     // 10 - (3 * 2) + 1 = 5
  });

  test('should handle expressions with exponentiation precedence', () => {
    expect(parse("2 ** 3 + 1")).toBe(9);         // (2 ** 3) + 1 = 9
    expect(parse("3 + 2 ** 4")).toBe(19);        // 3 + (2 ** 4) = 19
    expect(parse("2 * 3 ** 2 + 1")).toBe(19);    // 2 * (3 ** 2) + 1 = 19
  });

  test('should handle various realistic calculations with correct precedence', () => {
    expect(parse("1 + 2 * 3")).toBe(7);          // 1 + (2 * 3) = 7
    expect(parse("6 / 2 + 4")).toBe(7);          // (6 / 2) + 4 = 7
    expect(parse("2 ** 2 + 1")).toBe(5);         // (2 ** 2) + 1 = 5
    expect(parse("10 / 2 / 5")).toBe(1);         // (10 / 2) / 5 = 1
    expect(parse("100 - 50 + 25")).toBe(75);     // (100 - 50) + 25 = 75
    expect(parse("2 * 3 + 4 * 5")).toBe(26);     // (2 * 3) + (4 * 5) = 26
  });

});

describe('Floating Point precedence and error Tests', () => {

  describe('Precedence and associativity tests with floating-point numbers', () => {
    test('should calculate multiplication and division before addition and subtraction', () => {
      expect(parse("2.5 + 3.0 * 4.2")).toBeCloseTo(15.1);   // 2.5 + 3.0 * 4.2 = 15.1
      expect(parse("10.5 - 6.0 / 2.0")).toBeCloseTo(7.5);   // 10.5 - 6.0 / 2.0 = 7.5
      expect(parse("5.2 * 2.0 + 3.1")).toBeCloseTo(13.5);   // 5.2 * 2.0 + 3.1 = 13.5
    });

    test('should evaluate exponentiation with the highest precedence', () => {
      expect(parse("2.5 + 3.0 ** 2.0")).toBeCloseTo(11.5);  // 2.5 + 3.0 ** 2.0 = 11.5
      expect(parse("2.5 * 2.0 ** 3.0")).toBeCloseTo(20.0);  // 2.5 * 2.0 ** 3.0 = 20.0
      expect(parse("10.5 - 2.0 ** 3.0")).toBeCloseTo(2.5);  // 10.5 - 2.0 ** 3.0 = 2.5
    });

    test('should maintain right associativity for exponentiation', () => {
      expect(parse("2.0 ** 3.0 ** 2.0")).toBeCloseTo(512.0);  // 2.0 ** 3.0 ** 2.0 = 512.0
      expect(parse("1.5 ** 2.0 ** 2.0")).toBeCloseTo(5.0625); // 1.5 ** 2.0 ** 2.0 = 5.0625
    });

    test('should maintain left associativity for subtraction and division', () => {
      expect(parse("10.0 - 5.0 - 2.0")).toBeCloseTo(3.0);         // 10.0 - 5.0 - 2.0 = 3.0
      expect(parse("20.0 / 2.0 / 2.0")).toBeCloseTo(5.0);         // 20.0 / 2.0 / 2.0 = 5.0
      expect(parse("10.0 + 5.0 - 3.0 + 2.0")).toBeCloseTo(14.0);  // 10.0 + 5.0 - 3.0 + 2.0 = 14.0
    });

    test('should handle mixed expressions', () => {
      expect(parse("1.5 + 2.0 * 3.5 - 4.0")).toBeCloseTo(4.5);   // 1.5 + 2.0 * 3.5 - 4.0 = 4.5
      expect(parse("15.0 / 3.0 + 2.5 * 4.0")).toBeCloseTo(15.0); // 15.0 / 3.0 + 2.5 * 4.0 = 15.0
      expect(parse("2.0 ** 3.0 + 1.5")).toBeCloseTo(9.5);        // 2.0 ** 3.0 + 1.5 = 9.5
    });
  });

  describe('Error handling tests (invalid cases)', () => {
    test('should throw an error with invalid characters (lexical errors)', () => {
      expect(() => parse("2.5 + a")).toThrow();   // Should throw an error (letter 'a')
      expect(() => parse("10 @ 2")).toThrow();    // Should throw an error (symbol '@')
      expect(() => parse("3.0 & 4.0")).toThrow(); // Should throw an error (symbol '&')
    });

    test('should throw an error with misplaced or consecutive operators', () => {
      expect(() => parse("2.0 + * 3.0")).toThrow();     // Should throw an error (+ *)
      expect(() => parse("2.0 + + 3.0")).toThrow();     // Should throw an error (+ +)
      expect(() => parse("2.5 +")).toThrow();           // Should throw an error (missing final number)
    });
  });

});

describe('Parentheses Tests', () => {

  describe('Correct use of parentheses', () => {
    test('should prioritize addition/subtraction inside parentheses', () => {
      expect(parse("( 2.0 + 3.0 ) * 4.0")).toBeCloseTo(20.0);    // (5.0) * 4.0 = 20.0
      expect(parse("10.0 / ( 2.0 + 3.0 )")).toBeCloseTo(2.0);    // 10.0 / 5.0 = 2.0
      expect(parse("( 10.5 - 5.5 ) * 2.0")).toBeCloseTo(10.0);   // 5.0 * 2.0 = 10.0
    });
  
    test('should handle nested parentheses correctly', () => {
      expect(parse("(( 2 + 3 ) * 2 ) ** 2.0")).toBeCloseTo(100.0);      // ((2 + 3) * 2) ** 2 = (5 * 2) ** 2 = 10 ** 2 = 100
      expect(parse("50.0 / ( 2.0 * ( 2.0 + 3.0 ) )")).toBeCloseTo(5.0); // 50 / (2 * (2 + 3)) = 50 / (2 * 5) = 50 / 10 = 5
    });
  
    test('should handle parentheses combined with exponentiation', () => {
      expect(parse("( 2.0 ** 3.0 ) ** 2.0")).toBeCloseTo(64.0);        // (2 ** 3) ** 2 = 8 ** 2 = 64
      expect(parse("2.0 ** 3.0 ** 2.0")).toBeCloseTo(512.0);           //  2 ** (3 ** 2) = 512
    });
  
    test('should work with floating point and complex grouping', () => {
      expect(parse("( 1.5 + 0.5 ) * ( 10.0 / ( 2.0 ** 2.0 ) )")).toBeCloseTo(5.0);   // (1.5 + 0.5) * (10.0 / (2.0 ** 2.0)) = 2.0 * (10.0 / 4.0) = 2.0 * 2.5 = 5.0
    });
  
    test('should ignore comments around parentheses', () => {
      const input = "( 2.0 + 3.0 ) // Adding numbers \n * 2.0 /* Multiplier */";
      expect(parse(input)).toBeCloseTo(10.0); // (5.0) * 2.0 = 10.0
    });
  })

  describe('Parentheses Order and Balance Errors', () => {

    test('should throw error for unbalanced or mismatched parentheses', () => {
      expect(() => parse(") 2.0 + 3.0 (")).toThrow();  // Should throw error: invalid order
      expect(() => parse("5.0 + ( )")).toThrow();      // Should throw error: empty parentheses
    });
  
    test('should throw error for incorrect nesting or missing parts', () => {
      expect(() => parse("( 2.0 * ( 3.0 + 1.0 )) )")).toThrow(); // Should throw error: extra closing paren
      expect(() => parse("2.0 + ( 3.0 * 4.0")).toThrow();        // Should throw error: missing closing paren
    });
});
});


describe('Factorial Tests', () => {

  test('Factorial correctly detected', () => {
    expect(parse("3!")).toBe(6);
  })

})