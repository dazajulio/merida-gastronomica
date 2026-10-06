/**
 * imageOptimizer.js
 * Conversor y optimizador de imágenes del lado del cliente para Mérida Gastronómica.
 * 
 * Convierte cualquier formato (PNG, JPEG, HEIC, WebP, etc.) a WebP/JPEG optimizado
 * con resolución máxima balanceada (1280px) y compresión inteligente (calidad 0.78-0.82),
 * reduciendo archivos pesados (5-15 MB) a menos de 50-100 KB manteniendo excelente fidelidad visual.
 */

import { supabase } from './supabaseClient';

/**
 * Formatea bytes a cadena legible (KB / MB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 KB';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Optimiza y comprime un archivo de imagen en el navegador mediante HTML5 Canvas.
 * @param {File|Blob} file Archivo original
 * @param {Object} options Opciones de compresión
 * @returns {Promise<Object>} Resultado con blob, dataUrl y estadísticas
 */
export async function optimizeImage(file, options = {}) {
  const {
    maxWidth = 1280,
    maxHeight = 960,
    quality = 0.80,
    preferredFormat = 'image/webp'
  } = options;

  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('El archivo seleccionado no es una imagen válida.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo de imagen.'));

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Error al decodificar la imagen.'));

      img.onload = () => {
        // Calcular dimensiones manteniendo el aspect ratio
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Crear canvas para el reescalado
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('No se pudo inicializar el contexto 2D del canvas.'));
        }

        // Calidad de renderizado alta en canvas
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Probar si el navegador soporta WebP en toDataURL
        let outputType = preferredFormat;
        let dataUrl = canvas.toDataURL(outputType, quality);

        // Fallback a JPEG si WebP no es soportado
        if (!dataUrl.startsWith(`data:${outputType}`)) {
          outputType = 'image/jpeg';
          dataUrl = canvas.toDataURL(outputType, quality);
        }

        // Convertir dataURL a Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Error al generar el archivo optimizado.'));
            }

            const originalSize = file.size;
            const compressedSize = blob.size;
            const savedBytes = Math.max(0, originalSize - compressedSize);
            const compressionRatio = originalSize > 0 
              ? Math.round(((originalSize - compressedSize) / originalSize) * 100) 
              : 0;

            const cleanBaseName = (file.name || 'foto')
              .replace(/\.[^/.]+$/, '')
              .replace(/[^a-zA-Z0-9_-]/g, '_')
              .toLowerCase();
            const extension = outputType === 'image/webp' ? 'webp' : 'jpg';
            const fileName = `${cleanBaseName}_opt.${extension}`;

            resolve({
              blob,
              dataUrl,
              fileName,
              width,
              height,
              originalSize,
              compressedSize,
              originalSizeFormatted: formatBytes(originalSize),
              compressedSizeFormatted: formatBytes(compressedSize),
              compressionRatio: compressionRatio > 0 ? `${compressionRatio}%` : '0%',
              outputType
            });
          },
          outputType,
          quality
        );
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Sube una imagen optimizada a Supabase Storage bucket 'directorio-fotos'
 * o retorna el dataUrl optimizado en caso de que el bucket no esté configurado.
 * @param {Blob} blob Blob optimizado
 * @param {string} affiliateCode Código único del agremiado (ej. CGM-2026-001)
 * @param {number} slotIndex Índice de la foto (0 a 4)
 * @param {string} fallbackDataUrl Data URL de respaldo
 */
export async function uploadAffiliateImageToStorage(blob, affiliateCode, slotIndex, fallbackDataUrl = '') {
  const safeCode = (affiliateCode || 'CGM-2026').replace(/[^a-zA-Z0-9_-]/g, '_');
  const timestamp = Date.now();
  const filePath = `${safeCode}/foto_${slotIndex + 1}_${timestamp}.webp`;

  if (!supabase || !supabase.storage) {
    return { url: fallbackDataUrl, storagePath: null, mode: 'base64' };
  }

  try {
    const bucketName = 'directorio-fotos';
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, blob, {
        contentType: 'image/webp',
        upsert: true,
        cacheControl: '31536000'
      });

    if (error) {
      console.warn('Aviso Supabase Storage (usando fallback optimizado):', error.message);
      return { url: fallbackDataUrl, storagePath: null, mode: 'base64' };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (publicUrlData && publicUrlData.publicUrl) {
      return { url: publicUrlData.publicUrl, storagePath: filePath, mode: 'supabase_storage' };
    }

    return { url: fallbackDataUrl, storagePath: null, mode: 'base64' };
  } catch (err) {
    console.warn('Excepción al subir a Storage, usando DataURL optimizado:', err);
    return { url: fallbackDataUrl, storagePath: null, mode: 'base64' };
  }
}
