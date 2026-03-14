/**
 * Google Drive Integration
 * 
 * Provides file storage, auto-folder creation, and file picker functionality.
 * Requires: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.
 * 
 * Status: SCAFFOLD — not active until OAuth credentials are configured.
 */

interface DriveConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  thumbnailLink?: string;
  size: number;
  createdTime: string;
}

function getDriveConfig(): DriveConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return {
    clientId,
    clientSecret,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/v1/auth/google/callback`,
  };
}

export function isDriveConfigured(): boolean {
  return getDriveConfig() !== null;
}

export function getOAuthUrl(): string {
  const config = getDriveConfig();
  if (!config) throw new Error('Google Drive not configured — set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET');
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/drive.file',
    access_type: 'offline',
    prompt: 'consent',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeCode(code: string): Promise<{ access_token: string; refresh_token: string }> {
  const config = getDriveConfig();
  if (!config) throw new Error('Google Drive not configured');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  if (!res.ok) throw new Error('Failed to exchange OAuth code');
  return res.json();
}

export async function createFolder(accessToken: string, name: string, parentId?: string): Promise<string> {
  const metadata: Record<string, unknown> = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
  };
  if (parentId) metadata.parents = [parentId];
  const res = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });
  if (!res.ok) throw new Error('Failed to create Drive folder');
  const data = await res.json();
  return data.id;
}

export async function listFiles(accessToken: string, folderId: string): Promise<DriveFile[]> {
  const query = `'${folderId}' in parents and trashed = false`;
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,webViewLink,thumbnailLink,size,createdTime)`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error('Failed to list Drive files');
  const data = await res.json();
  return data.files || [];
}

export async function uploadFile(
  accessToken: string,
  file: Buffer,
  name: string,
  mimeType: string,
  folderId: string
): Promise<DriveFile> {
  const metadata = JSON.stringify({ name, parents: [folderId] });
  const boundary = 'studioflow_upload';
  const body = [
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`,
    `--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`,
  ].join('');

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,size,createdTime', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: body + file.toString('base64') + `\r\n--${boundary}--`,
  });
  if (!res.ok) throw new Error('Failed to upload file to Drive');
  return res.json();
}
