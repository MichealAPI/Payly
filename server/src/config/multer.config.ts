import { memoryStorage } from 'multer';

export const multerConfig = {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // e.g. 5MB
};