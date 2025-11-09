import { NextRequest, NextResponse } from 'next/server';
import config from '@/app/services/config';

const API_URL = 'https://server-gr.he-section.site/api/v1' //config.base_url;
const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB par chunk (pour éviter 413 nginx)
const LARGE_FILE_THRESHOLD = 1 * 1024 * 1024; // Utiliser chunks pour fichiers > 1MB

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

    // Validation de la taille du fichier (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Taille maximum autorisée: 100MB.' },
        { status: 400 }
      );
    }

    console.log(`Uploading file: ${file.name || 'unnamed'}, size: ${file.size}, type: ${file.type}`);

    // Décider si on utilise l'upload par chunks ou direct
    if (file.size > LARGE_FILE_THRESHOLD) {
      console.log('Using chunked upload for large file');
      return await uploadFileInChunks(file);
    } else {
      console.log('Using direct upload for small file');
      return await uploadFileDirect(file);
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    
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

// Upload direct pour petits fichiers
async function uploadFileDirect(file: File) {
  const serverFormData = new FormData();
  serverFormData.append('file', file);

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
}

// Upload par chunks pour gros fichiers
async function uploadFileInChunks(file: File) {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const uploadId = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  
  console.log(`Uploading ${file.name} in ${totalChunks} chunks`);

  // Convertir le fichier en ArrayBuffer pour le découper
  const fileBuffer = await file.arrayBuffer();

  // Envoyer chaque chunk
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = fileBuffer.slice(start, end);

    const chunkFormData = new FormData();
    const chunkBlob = new Blob([chunk], { type: file.type });
    chunkFormData.append('chunk', chunkBlob);
    chunkFormData.append('uploadId', uploadId);
    chunkFormData.append('chunkIndex', chunkIndex.toString());
    chunkFormData.append('totalChunks', totalChunks.toString());
    chunkFormData.append('fileName', file.name);
    chunkFormData.append('fileType', file.type);

    const chunkUrl = `${API_URL}/uploads/chunk`;
    const response = await fetch(chunkUrl, {
      method: 'POST',
      body: chunkFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Chunk ${chunkIndex + 1}/${totalChunks} upload failed:`, errorText);
      return NextResponse.json(
        { error: `Failed to upload chunk ${chunkIndex + 1}/${totalChunks}` },
        { status: response.status }
      );
    }

    const chunkResponse = await response.json();
    console.log(`Chunk ${chunkIndex + 1}/${totalChunks} uploaded successfully`);

    // Si c'est le dernier chunk, le serveur devrait retourner l'URL finale
    if (chunkIndex === totalChunks - 1 && chunkResponse.success) {
      return NextResponse.json({
        url: chunkResponse.data.url
      });
    }
  }

  return NextResponse.json({
    error: 'Upload completed but no URL returned'
  }, { status: 500 });
}