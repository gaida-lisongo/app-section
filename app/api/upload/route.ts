import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Vérifier si le token est présent
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadata = formData.get('metadata') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validation du fichier
    if (file.size === 0) {
      return NextResponse.json({ error: 'Empty file provided' }, { status: 400 });
    }

    // Validation de la taille du fichier (max 10MB)
    const maxSize = 100 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Taille maximum autorisée: 10MB.' },
        { status: 400 }
      );
    }

    console.log(`Uploading file: ${file.name || 'unnamed'}, size: ${file.size}, type: ${file.type}`);

    // Générer un nom de fichier approprié
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    
    // Gérer le cas où file.name pourrait être undefined
    let fileExtension = 'bin'; // Extension par défaut
    if (file.name && typeof file.name === 'string') {
      const nameParts = file.name.split('.');
      if (nameParts.length > 1) {
        fileExtension = nameParts.pop() || 'bin';
      }
    }
    
    const fileName = `uploads/${timestamp}-${randomSuffix}.${fileExtension}`;

    const blob = await put(fileName, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    console.log('Upload successful:', blob.pathname);

    return NextResponse.json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      contentType: blob.contentType,
      metadata: metadata ? JSON.parse(metadata) : {},
    });
  } catch (error) {
    console.error('Error uploading blob:', error);
    
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