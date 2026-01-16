/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tu paleta personalizada Algorithm
        'algo-bg': '#FCFAFA',      // Fondo blanco humo
        'algo-text': '#000000',    // Texto negro
        'algo-blue': '#276591',    // Botones principales
        'algo-green': '#1C7C54',   // Éxito / Comprar
        'algo-orange': '#E8871E',  // Alertas / Ofertas
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'], // Fuente limpia para textos
        'mono': ['Fira Code', 'monospace'], // Fuente "hacker" para códigos
      }
    },
  },
  plugins: [],
}