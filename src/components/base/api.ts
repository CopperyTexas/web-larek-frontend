import { ApiPostMethods } from "../../types";
import { ApiResponse } from "../../types";

// Класс Api обеспечивает базовую функциональность для выполнения HTTP-запросов.
export class Api {
    readonly baseUrl: string; // Базовый URL API
    protected options: RequestInit; // Настройки запроса

    // Конструктор принимает базовый URL и необязательные настройки запроса
    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    // handleResponse обрабатывает ответы от API и возвращает данные или генерирует ошибку
    private async handleResponse<T>(response: Response): ApiResponse<T> {
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error ?? response.statusText);
        }
    }

    // Метод get для выполнения GET-запросов
    // uri - путь ресурса относительно baseUrl
    get<T>(uri: string): ApiResponse<T> {
        if (!uri.trim()) {
            throw new Error('URI cannot be empty');
        }
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(response => this.handleResponse<T>(response));
    }

    // Метод post для выполнения POST-запросов
    // uri - путь ресурса относительно baseUrl
    // data - тело запроса
    // method - HTTP-метод, по умолчанию 'POST'
    post<T>(uri: string, data: object, method: ApiPostMethods = 'POST'): ApiResponse<T> {
        if (!uri.trim()) {
            throw new Error('URI cannot be empty');
        }
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(response => this.handleResponse<T>(response));
    }

}