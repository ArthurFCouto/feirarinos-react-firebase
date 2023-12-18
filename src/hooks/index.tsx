import { useCallback } from 'react';

export function useClipboard() {
    const copyToClipboard = useCallback(async (data: string) => {
        try {
            await navigator.clipboard.writeText(data);
        } catch (err) {
            console.log('Falha ao copiar dado para área de transferência.', err);
        }
    }, []);
    return copyToClipboard;
}