import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/**
 * Upload voice message file to storage
 * @returns relative file path (e.g., "userId/messageId.mp4")
 */
export async function uploadVoiceMessage(
  audioBlob: Blob,
  messageId: string,
  senderId: string,
  mimeType: string = 'audio/webm'
): Promise<string> {
  // Determine file extension based on MIME type
  const extension = mimeType.includes('mp4') ? 'mp4' 
                  : mimeType.includes('aac') ? 'aac'
                  : mimeType.includes('wav') ? 'wav'
                  : 'webm';
  
  const filename = `${senderId}/${messageId}.${extension}`;

  logger.info('[VoiceUpload] Uploading voice message', {
    filename,
    size: audioBlob.size,
    mimeType
  });

  const { data, error } = await supabase.storage
    .from('message-attachments')
    .upload(filename, audioBlob, {
      contentType: mimeType,
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    logger.error('[VoiceUpload] Upload failed', error);
    throw new Error('Failed to upload voice message');
  }

  logger.info('[VoiceUpload] Upload successful', { path: filename });
  return filename;
}

/**
 * Record voice message attachment metadata in database
 * Call this AFTER message creation with the real message ID
 */
export async function recordVoiceAttachment(
  messageId: string,
  filePath: string,
  mimeType: string,
  fileSize: number,
  senderId: string
): Promise<void> {
  const extension = filePath.split('.').pop() || 'webm';
  
  logger.info('[VoiceUpload] Recording attachment metadata', {
    messageId,
    filePath,
    fileSize
  });

  const { error } = await supabase
    .from('message_attachments')
    .insert({
      message_id: messageId,
      file_name: `voice_${Date.now()}.${extension}`,
      file_url: filePath,
      file_type: 'voice',
      mime_type: mimeType,
      file_size: fileSize,
      uploaded_by: senderId
    });

  if (error) {
    logger.error('[VoiceUpload] Failed to record attachment metadata', error);
    throw new Error('Failed to record voice message metadata');
  }
}
