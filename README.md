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

***

## Базовый код
Включает в себя низкоуровневые утилиты, сервисы и конфигурации, которые яаляются фундаментом приложения.

### 1. Брокер событий (EventEmitter)
Класс который обеспечивает управление событиями в приложении. Он позволяет подписываться на события, генерировать события и управлять обработчиками.  
`constructor()` - создает новый экземпляр брокера событий.
Методы:
- ***on / off*** : Подписывает обработчик на событие / Удаляет обработчик события с указанным именем.
- ***emit*** : Генерирует событие с указанным именем и данными для всех подписанных обработчиков событий.
- ***onAll / offAll*** : Подписывает / Удаляет обработчик на все события.
- *trigger* : Создает 'триггер' для события с указанным именем и контекстом, который можно вызвать для генерации события.

### 2. Api
Класс представляет собой инструмент для взаимодействия с удаленным веб-сервером посредством HTTP запросов.  
*constructor(baseUrl: string, options: RequestInit = {})* - создает новый экземпляр класса с указанным URL-адрессом и настраивает объект опций.
Методы :
- *handleResponse* : Метод отвечающий за обработку ответа от сервера после отправки HTTP запроса.
- *get* : Метод для выполнения HTTP GET запроса к Api.
- *post* : Метод для выполнения HTTP POST запроса к Api.

### 3. Component<T>
Абстрактный класс для создания компонентов пользовательского интерфейса. Представляет общие методы и утилиты для работы с DOM элементами и является основой для всех компонентов.  
*constructor(container: HTMLElement)* - Принимает HTML элемент, который будет использоваться как контейнер для компонента.
Методы : 
- *render* : Отрисовывает компонент, применяя переданные данные. Возвращает корневой элемент коммпонента.
- *toggleClass* : Переключает класс у заданного элемента.
- *setText* : Устанавливает текстовое содержимое для элемента.
- *setDisabled* : Устанавливает или снимает блокировку элемента.
- *setHidden / setVisible* : Скрывает / Показывает элемент.
- *setImage* : Устанавливает изображение и альтернативный текст для элемента img.

### 4. Model<T>
Служит основой для всех моделей данных. Он предоставляет методы для управления состоянием взаимодействия с другими компонентами через систему событий.
*constructor(data: Partial<T>, events: IEvents)* - Принимает объект данных и объект событий. Инициализирует модель, присваивая ей предоставленные данные.
Методы :
- *emitChanges* : Оповещает о изменениях в модели, отправляя событие через систему событий.

***

