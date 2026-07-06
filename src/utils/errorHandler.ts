import * as Sentry from '@sentry/react-native';

// Configurar tratamento global de erros
export const setupErrorHandling = () => {
    // Captura erros não capturados
    const originalWarn = console.warn;
    const originalError = console.error;

    console.warn = (...args: any[]) => {
        console.log('⚠️ WARN:', ...args);
        originalWarn(...args);
    };

    console.error = (...args: any[]) => {
        console.log('❌ ERROR:', ...args);
        originalError(...args);
    };

    // Tratador global para promessas rejeitadas
    if (typeof global !== 'undefined') {
        global.addEventListener?.('unhandledrejection', (event: any) => {
            console.log('❌ Unhandled Promise Rejection:', event.reason);
        });
    }
};

export const logInitStatus = (status: string, details?: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const message = `[${timestamp}] ${status}${details ? `: ${details}` : ''}`;
    console.log(message);
};
