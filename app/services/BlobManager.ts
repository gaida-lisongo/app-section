interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

type ProgressCallback = (progress: UploadProgress) => void;

class BlobManager {
    private apiUrl: string;

    constructor() {
        this.apiUrl = '/api'; // Utilise les API routes locales
    }

    async createBlob(
        fileBlob: File, 
        metadata?: Record<string, any>,
        onProgress?: ProgressCallback
    ): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append('file', fileBlob);
        if (metadata) {
            formData.append('metadata', JSON.stringify(metadata));
        }

        // Si un callback de progression est fourni, utiliser XMLHttpRequest
        if (onProgress) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentage = Math.round((e.loaded / e.total) * 100);
                        onProgress({
                            loaded: e.loaded,
                            total: e.total,
                            percentage,
                        });
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            resolve(response);
                        } catch (e) {
                            reject(new Error('Invalid response from server'));
                        }
                    } else {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                });

                xhr.addEventListener('error', () => {
                    reject(new Error('Network error during upload'));
                });

                xhr.addEventListener('abort', () => {
                    reject(new Error('Upload cancelled'));
                });

                xhr.open('POST', `${this.apiUrl}/upload`);
                xhr.send(formData);
            });
        }

        // Sinon, utiliser fetch classique
        const response = await fetch(`${this.apiUrl}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'upload du blob');
        }

        return await response.json();
    }

    async getBlob(pathname: string) {
        // Pour récupérer un blob, on utilise directement son URL
        const response = await fetch(pathname);
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du blob');
        }
        
        return {
            blob: await response.blob(),
            url: pathname,
        };
    }

    async deleteBlob(pathname: string) {
        const response = await fetch(`${this.apiUrl}/blob?pathname=${encodeURIComponent(pathname)}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du blob');
        }

        return await response.json();
    }
}

export default new BlobManager();