import { Router } from 'express';
import { handleRagChat } from './chat.controller.js';

export const chatRouter = Router();

chatRouter.post('/chat', handleRagChat);
