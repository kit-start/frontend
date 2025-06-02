import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  try {
    console.log('Получен запрос:', req.body);
    
    if (!process.env.YANDEX_API_KEY) {
      console.error('YANDEX_API_KEY не найден в .env файле');
      return res.status(500).json({
        error: 'API ключ не настроен'
      });
    }

    if (!process.env.YANDEX_FOLDER_ID) {
      console.error('YANDEX_FOLDER_ID не найден в .env файле');
      return res.status(500).json({
        error: 'ID папки не настроен'
      });
    }

    const { prompt, model, temperature, max_tokens } = req.body;

    console.log('Отправляем запрос к YandexGPT:', {
      model: model || 'yandexgpt-lite',
      prompt,
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 1000
    });

    const response = await axios.post(
      'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
      {
        modelUri: `gpt://${process.env.YANDEX_FOLDER_ID}/yandexgpt-lite`,
        completionOptions: {
          stream: false,
          temperature: temperature || 0.7,
          maxTokens: max_tokens || 1000
        },
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Authorization': `Api-Key ${process.env.YANDEX_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Получен ответ от YandexGPT:', response.data);

    if (!response.data || !response.data.result || !response.data.result.alternatives || !response.data.result.alternatives[0]) {
      throw new Error('Неверный формат ответа от YandexGPT');
    }

    res.json({
      text: response.data.result.alternatives[0].message.text
    });
  } catch (error) {
    console.error('Детальная ошибка:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    res.status(500).json({
      error: 'Ошибка при генерации текста',
      details: error.response?.data || error.message
    });
  }
});

// Добавляем обработчик для проверки статуса сервера
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    apiKey: !!process.env.YANDEX_API_KEY,
    folderId: !!process.env.YANDEX_FOLDER_ID
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('YANDEX_API_KEY настроен:', !!process.env.YANDEX_API_KEY);
  console.log('YANDEX_FOLDER_ID:', process.env.YANDEX_FOLDER_ID);
}); 