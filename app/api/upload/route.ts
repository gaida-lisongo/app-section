import { NextRequest, NextResponse } from 'next/server';
import config from '@/app/services/config';

const API_URL = config.base_url;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validation du fichier
    if (file.size === 0) {
      return NextResponse.json({ error: 'Empty file provided' }, { status: 400 });
    }

    // Validation de la taille du fichier (max 10MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Taille maximum autorisée: 100MB.' },
        { status: 400 }
      );
    }

    console.log(`Uploading file: ${file.name || 'unnamed'}, size: ${file.size}, type: ${file.type}`);

    // Créer un FormData pour envoyer le fichier au serveur
    const serverFormData = new FormData();
    serverFormData.append('file', file);

    // Envoyer le fichier au serveur backend
    const uploadUrl = `${API_URL}/uploads/`;
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: serverFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server upload failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to upload file to server' },
        { status: response.status }
      );
    }

    const responseData = await response.json();

    if (responseData.success) {
      const { data } = responseData;
      console.log('Upload successful:', data);
      return NextResponse.json({
        url: data.url
      });
    }

    return NextResponse.json({
      error: responseData.message || 'Upload failed'
    }, { status: 400 });
  } catch (error) {
    console.error('Error uploading file:', error);
    
    // Retourner des détails d'erreur plus spécifiques en développement
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}