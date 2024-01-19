# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Архитектура проекта

## Базовый код
Включает в себя низкоуровневые утилиты, сервисы и конфигурации, которые яаляются фундаментом приложения.

### 1. Брокер событий (EventEmitter)
Класс который обеспечивает управление событиями в приложении. Он позволяет подписываться на события, генерировать события и управлять обработчиками.
constructor() - создает новый экземпляр брокера событий.
Методы:
-on / off : Подписывает обработчик на событие / Удаляет обработчик события с указанным именем.
-emit : Генерирует событие с указанным именем и данными для всех подписанных обработчиков событий.
-onAll / offAll : Подписывает / Удаляет обработчик на все события.
-trigger : Создает 'триггер' для события с указанным именем и контекстом, который можно вызвать для генерации события.

### 2. Api
Класс представляет собой инструмент для взаимодействия с удаленным веб-сервером посредством HTTP запросов.
Методы :
-handleResponse : Метод отвечающий за обработку ответа от сервера после отправки HTTP запроса.
-get : Метод для выполнения HTTP GET запроса к Api.
-post : Метод для выполнения HTTP POST запроса к Api.

### 3. Component<T>
Универсальный класс представляющий собой общие методы и утилиты для работы с DOM элементами и является основой для всех компонентов пользовательского интерфейса в приложении. Наследуется от брокера событий EventEmitter.
Методы : 
-render : Возвращает HTML элемент, который связан с объектом HTMLItem.
-trigger/bindEvent/emit : Генерирует/привязывает/инициирует событие.
-on/off : Добавляет/удаляет обработчик события.
-remove : Удаляет элемент из DOM.
-show/hide : Отображает/скрывает элемент.
-setText/setLink : Устанавливает текст/ссылку или источник элемента.
-setValue/getValue : Устанавливает/возвращает значение элемента.
-enable/disable : Активирует/деактивирует элемент.
-toggleDisabled : Переключает активность элемента.
-isValid : Проверяет валидность элемента.
-getValidationMessage : Возвращает сообщение валидации.
-toggleClass : Переключает класс элемента.
-addClass/removeClass : Добавляет/удаляет класс элемента.
-hasClass : Проверяет наличие класса у элемента.
-setContent : Устанавливает содержимое элемента.
-clear : Очищает содержимое элемента.
-append/prepend : Добавляет содержимое в элемент/в начало элемента.
-replace : Заменяет содержимое элемента.

### Model<T>

