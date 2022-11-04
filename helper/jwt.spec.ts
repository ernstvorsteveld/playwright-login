import { expect } from '@playwright/test';

export class Jwt {
    readonly token: string;

    constructor(token: string) {
        this.token = token;
    }

    async getPayloadAsJson() {
        let dot = this.token['access_token'].indexOf(".");
        let payload = this.token['access_token'].substring(dot + 1);
        dot = payload.indexOf(".");
        payload = payload.substring(0, dot);
        return JSON.stringify(JSON.parse(Buffer.from(payload, 'base64').toString()),null,2); 
    }
}


