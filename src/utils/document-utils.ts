import mammoth from 'mammoth';
import { renderAsync } from 'docx-preview';
import { saveAs } from 'file-saver';

/**
 * Тип документа
 */
export enum DocumentType {
  DOCX = 'docx',
  DOC = 'doc',
  PDF = 'pdf',
  UNKNOWN = 'unknown'
}

/**
 * Определяет тип документа по имени файла
 * @param fileName - имя файла документа
 * @returns тип документа
 */
export const getDocumentType = (fileName: string): DocumentType => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'docx':
      return DocumentType.DOCX;
    case 'doc':
      return DocumentType.DOC;
    case 'pdf':
      return DocumentType.PDF;
    default:
      return DocumentType.UNKNOWN;
  }
};

/**
 * Конвертирует base64 строку в Blob
 * @param base64 - строка в формате base64
 * @param contentType - тип содержимого (MIME)
 * @returns Blob с данными
 */
export const base64ToBlob = (base64: string, contentType = ''): Blob => {
  // Если строка содержит data:application, извлекаем только данные
  const base64Data = base64.includes('data:') 
    ? base64.split(',')[1] 
    : base64;
  
  // Определяем MIME тип из data URL, если он там есть
  let mimeType = contentType;
  if (base64.includes('data:') && !contentType) {
    mimeType = base64.split(',')[0].split(':')[1].split(';')[0];
  }
  
  // Преобразование base64 в массив байтов
  const byteCharacters = atob(base64Data);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: mimeType });
};

/**
 * Превью документа формата DOCX
 * @param blob - документ в формате Blob
 * @param container - DOM элемент для рендеринга
 * @returns Promise, разрешающийся после завершения рендеринга с текстовым содержимым
 */
export const previewDocx = async (blob: Blob, container: HTMLElement): Promise<string> => {
  try {
    // Рендерим документ
    await renderAsync(blob, container);
    console.log('DOCX документ успешно отрендерен');
    
    // Ждем немного, чтобы убедиться, что документ отрендерился
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Извлекаем текстовое содержимое для редактирования
    const textContent = container.innerText || '';
    if (!textContent) {
      throw new Error('Не удалось извлечь текст из DOCX документа');
    }
    
    return textContent;
  } catch (error) {
    console.error('Ошибка при рендеринге DOCX:', error);
    throw error;
  }
};

/**
 * Превью документа формата DOC через преобразование в HTML
 * @param blob - документ в формате Blob
 * @param container - DOM элемент для рендеринга
 * @returns Promise, разрешающийся после завершения рендеринга с текстовым содержимым
 */
export const previewDoc = async (blob: Blob, container: HTMLElement): Promise<string> => {
  try {
    // Для DOC формата используем mammoth для преобразования в HTML
    const arrayBuffer = await blob.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    
    if (!result.value) {
      throw new Error('Не удалось преобразовать DOC документ в HTML');
    }
    
    container.innerHTML = result.value;
    console.log('DOC документ успешно преобразован в HTML');
    
    // Ждем немного, чтобы убедиться, что документ отрендерился
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Извлекаем текстовое содержимое для редактирования
    const textContent = container.innerText || '';
    if (!textContent) {
      throw new Error('Не удалось извлечь текст из DOC документа');
    }
    
    return textContent;
  } catch (error) {
    console.error('Ошибка при рендеринге DOC:', error);
    throw error;
  }
};

/**
 * Скачивает документ
 * @param content - содержимое документа (base64 или Blob)
 * @param fileName - имя файла для сохранения
 */
export const downloadDocument = (content: string | Blob, fileName: string): void => {
  try {
    let blob: Blob;
    
    if (typeof content === 'string') {
      const documentType = getDocumentType(fileName);
      let mimeType = 'application/octet-stream';
      
      switch (documentType) {
        case DocumentType.DOCX:
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case DocumentType.DOC:
          mimeType = 'application/msword';
          break;
        case DocumentType.PDF:
          mimeType = 'application/pdf';
          break;
      }
      
      blob = base64ToBlob(content, mimeType);
    } else {
      blob = content;
    }
    
    saveAs(blob, fileName);
    console.log(`Документ ${fileName} подготовлен для скачивания`);
  } catch (error) {
    console.error('Ошибка при скачивании документа:', error);
    throw error;
  }
}; 