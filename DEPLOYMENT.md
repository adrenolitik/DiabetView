# 🚀 DiabetView - Инструкции по развертыванию

## ✅ Текущий статус

**Дата**: 2026-02-09  
**Версия**: 1.1.0 (Feature: Improved Visualization)  
**Статус**: Готово к развертыванию ✅

---

## 📦 Что было сделано

### 1. ✅ Код улучшен и протестирован
- Все изменения закоммичены
- TypeScript компиляция без ошибок
- Production build успешен

### 2. ✅ Git репозиторий обновлен
- **Ветка**: `feature/improved-visualization`
- **Remote**: https://github.com/adrenolitik/DiabetView.git
- **Коммитов**: 3
  - feat: Улучшена визуализация DiabetView
  - docs: Добавлен CHANGELOG с описанием всех улучшений
  - chore: Добавлен .env.example и обновлен .gitignore

### 3. ✅ Pull Request создан
- **URL**: https://github.com/adrenolitik/DiabetView/pull/1
- **Название**: feat: Улучшена визуализация и контрфактическое моделирование
- **Статус**: Открыт, готов к ревью
- **Изменений**: ~4800 строк добавлено

### 4. ✅ API ключ Gemini настроен
- Создан файл `.env` с вашим API ключом
- Создан `.env.example` для других разработчиков
- `.gitignore` обновлен для защиты секретов

---

## 🔧 Локальная разработка

### Установка зависимостей
```bash
npm install
```

### Настройка API ключа
1. Скопируйте `.env.example` в `.env`:
   ```bash
   cp .env.example .env
   ```

2. Добавьте ваш API ключ в `.env`:
   ```env
   VITE_GOOGLE_API_KEY=your_api_key_here
   ```

### Запуск dev сервера
```bash
npm run dev
```

Сервер запустится на: http://localhost:5173

### Сборка для production
```bash
npm run build
```

Результат в директории `dist/`

---

## 🌐 Деплой на production

### Вариант 1: Vercel (Рекомендуется)

1. Установите Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Залогиньтесь:
   ```bash
   vercel login
   ```

3. Деплой:
   ```bash
   vercel
   ```

4. Добавьте environment variable на Vercel:
   - Зайдите в Project Settings → Environment Variables
   - Добавьте: `VITE_GOOGLE_API_KEY` = ваш_ключ

### Вариант 2: Netlify

1. Установите Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Залогиньтесь:
   ```bash
   netlify login
   ```

3. Деплой:
   ```bash
   netlify deploy --prod
   ```

4. Добавьте environment variable:
   ```bash
   netlify env:set VITE_GOOGLE_API_KEY ваш_ключ
   ```

### Вариант 3: GitHub Pages

1. Установите gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Добавьте в `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. Деплой:
   ```bash
   npm run deploy
   ```

**Важно**: API ключ нужно будет хардкодить или использовать GitHub Secrets

---

## 🔐 Безопасность API ключа

### ⚠️ Важно!

1. **Никогда не коммитьте .env файлы**
   - `.env` уже в `.gitignore`
   - Проверяйте перед каждым коммитом

2. **Используйте environment variables на production**
   - Vercel/Netlify: добавьте через UI
   - Docker: используйте `-e` флаги или `.env` файлы

3. **Ротация ключей**
   - Регулярно меняйте API ключи
   - Используйте разные ключи для dev и prod

4. **Ограничения API ключа**
   - Настройте ограничения по домену в Google Cloud Console
   - Добавьте квоты и лимиты

---

## 📋 Чеклист перед деплоем

- [ ] `.env` файл настроен
- [ ] `npm run build` выполняется без ошибок
- [ ] Все тесты проходят
- [ ] API ключ работает
- [ ] Проверено в локальном окружении
- [ ] Pull Request ревью завершен
- [ ] Environment variables настроены на production
- [ ] Домены/CORS настроены правильно

---

## 🔗 Полезные ссылки

- **Репозиторий**: https://github.com/adrenolitik/DiabetView
- **Pull Request**: https://github.com/adrenolitik/DiabetView/pull/1
- **Google Gemini API**: https://aistudio.google.com/app/apikey
- **Документация Vite**: https://vitejs.dev/guide/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 📞 Поддержка

Если возникли вопросы или проблемы:
1. Проверьте CHANGELOG.md для деталей изменений
2. Проверьте console браузера на ошибки
3. Убедитесь, что API ключ валиден
4. Проверьте network tab для API запросов

---

**Готово к развертыванию!** 🚀✨
