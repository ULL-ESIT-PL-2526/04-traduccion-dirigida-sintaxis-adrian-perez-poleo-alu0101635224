// jest.config.js
module.exports = {
  // Indica que queremos recolectar la cobertura
  collectCoverage: true,

  // Define qué archivos debe analizar (y cuáles ignorar)
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}", // Analiza todo en la carpeta src
    "!src/**/*.d.ts",           // Ignora archivos de definiciones de TypeScript
    "!src/index.js",            // Ignora puntos de entrada si no tienen lógica
  ],

  // Directorio donde se guardarán los informes
  coverageDirectory: "coverage",

  // Formatos de salida del reporte
  coverageReporters: ["text", "lcov", "clover", "json"],

  // (Opcional) Umbrales mínimos para que los tests "fallen" si no hay suficiente cobertura
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};