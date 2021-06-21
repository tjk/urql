import { App } from 'vue';
import { Client, ClientOptions } from '@urql/core';
export declare function provideClient(opts: ClientOptions | Client): Client;
export declare function install(app: App, opts: ClientOptions | Client): void;
export declare function useClient(): Client;
