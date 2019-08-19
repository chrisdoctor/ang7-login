import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '@/models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${config.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get(`${config.apiUrl}/users/${id}`);
    }

    signup(user: User) {
        return this.http.post(`${config.apiUrl}/users/signup`, user);
    }

    update(id: Number, user: User) {
        return this.http.post(`${config.apiUrl}/users/${id}`, user);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/${id}`);
    }
}