// src/utils/imageLoader.js

// 1. Mapa de traducción de colores (BD -> Archivo)
const colorTranslations = {
  'negro': 'black',
  'azul': 'blue',
  'rojo': 'red',
  'verde': 'green',
  'blanco': 'white',
  'rosado': 'pink',
  'gris': 'grey',
};

// Cargamos todas las imágenes
const images = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,svg}', { eager: true });

export const getProductGallery = (productName, color) => {
  if (!productName || !color) return [];

  // --- PASO 1: LIMPIEZA DE DATOS ---
  // Limpieza del nombre: "Playera Algorithm (New Design)" -> ["playera", "algorithm"]
  const nameParts = productName.toLowerCase()
    .replace(/\(.*\)/, '') 
    .trim()
    .split(' ')
    .filter(part => part.length > 3) // Filtramos palabras muy cortas para evitar ruido
    .slice(0, 2); 

  const colorSpanish = color.toLowerCase().trim();
  const colorEnglish = colorTranslations[colorSpanish] || colorSpanish;

  // --- PASO 2: FILTRADO (Encontrar archivos que coincidan) ---
  const matchingPaths = Object.keys(images).filter((path) => {
    const fileName = path.toLowerCase();
    
    // Coincidencia de nombre (debe tener las palabras clave)
    const matchesName = nameParts.every(part => fileName.includes(part));
    
    // Coincidencia de color (en inglés o español)
    const matchesColor = fileName.includes(colorEnglish) || fileName.includes(colorSpanish);
    
    return matchesName && matchesColor;
  });

  // --- PASO 3: ORDENAMIENTO (LA PARTE QUE PEDISTE) ---
  matchingPaths.sort((a, b) => {
    const pathA = a.toLowerCase();
    const pathB = b.toLowerCase();

    // Función para dar prioridad (Menor número = Sale primero)
    const getPriority = (path) => {
      // 1. Prioridad Máxima: Si tiene "front" Y "back" juntos (ej. "front-back")
      if (path.includes('front') && path.includes('back')) return 10;
      
      // 2. Segunda Prioridad: Si solo tiene "front"
      if (path.includes('front')) return 20;
      
      // 3. Tercera Prioridad: Si solo tiene "back"
      if (path.includes('back')) return 30;
      
      // 4. Lo demás (zoom, detalles, etc.) al final
      return 100;
    };

    const priorityA = getPriority(pathA);
    const priorityB = getPriority(pathB);

    // Si tienen diferente prioridad, gana el número menor
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // Si tienen la misma prioridad (ej. front1 vs front2), orden alfabético normal
    return pathA.localeCompare(pathB);
  });

  // --- PASO 4: DEVOLVER LAS IMÁGENES REALES ---
  return matchingPaths.map((path) => images[path].default);
};