import OpenAI from 'openai';
import Constants from 'expo-constants';

let _client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!_client) {
    const apiKey = Constants.expoConfig?.extra?.openaiApiKey as string;
    const baseURL = Constants.expoConfig?.extra?.openaiBaseUrl as string;
    _client = new OpenAI({ apiKey, baseURL, dangerouslyAllowBrowser: true });
  }
  return _client;
}
