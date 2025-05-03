import axios from 'axios';

const TELEGRAM_API_KEY = process.env.EXPO_PUBLIC_TELEGRAM_API_KEY ?? '';
const tgUpdatesUrl: string = `https://api.telegram.org/bot${TELEGRAM_API_KEY}/getUpdates`;

export async function getLastMessagesAsync(count?: number): Promise<string[]> {
  const response = await axios.post(tgUpdatesUrl, {
    data: {
      allowed_updates: ['channel_post'],
      limit: count ?? 100,
    },
  });

  const messages: any[] = (response.data.result as any[])
    .filter((update) => 'channel_post' in update)
    .reverse();
  return messages.map((message) => message.channel_post.text);
}
