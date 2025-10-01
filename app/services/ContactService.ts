import Service from './Service';
import config from './config';
import { Message } from '@/types/contact';

class ContactService extends Service {
  constructor() {
    super();
  }

  async sendMessage(message: Message): Promise<Message | null> {
    try {
        const res = await fetch(`${config.base_url}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
        const response = await res.json();
        console.log('Message sent successfully:', response);
        return response as Message || null;

    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
  }
}

export default new ContactService();
