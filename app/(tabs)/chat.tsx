import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';
import OpenAI from 'openai';
import { Colors } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '0',
    role: 'ai',
    text: "Hi! I'm your AI Mentor powered by GPT.\n\nAsk me anything about your learning roadmap, career growth, or business strategy!",
    time: 'Now',
  },
];

const now = () => {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export default function ChatScreen() {
  const { selectedCategory, userName } = useApp();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const historyRef = useRef<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const openaiRef = useRef<OpenAI | null>(null);

  const getClient = () => {
    if (!openaiRef.current) {
      const apiKey = Constants.expoConfig?.extra?.openaiApiKey as string;
      const baseURL = Constants.expoConfig?.extra?.openaiBaseUrl as string;
      openaiRef.current = new OpenAI({ apiKey, baseURL, dangerouslyAllowBrowser: true });
    }
    return openaiRef.current;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || typing) return;
    Haptics.selectionAsync();

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      time: now(),
    };
    setMessages((prev) => [userMsg, ...prev]);
    setInput('');
    setTyping(true);

    historyRef.current.push({ role: 'user', content: text });

    try {
      const systemPrompt = `You are PathPilot AI Mentor — a knowledgeable, motivating career and business coach. The user's name is ${userName || 'there'} and they are focused on: ${selectedCategory || 'personal and professional growth'}. Give concise, actionable advice. Use numbered lists when explaining steps. Keep responses under 200 words.`;

      const completion = await getClient().chat.completions.create({
        model: 'gpt-5.4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...historyRef.current,
        ],
        max_completion_tokens: 400,
      });

      const aiText = completion.choices[0]?.message?.content || "I'm here to help — could you rephrase that?";
      historyRef.current.push({ role: 'assistant', content: aiText });

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: aiText,
        time: now(),
      };
      setMessages((prev) => [aiMsg, ...prev]);
    } catch (err: any) {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        time: now(),
      };
      setMessages((prev) => [errMsg, ...prev]);
    } finally {
      setTyping(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.msgRow, item.role === 'user' && styles.msgRowUser]}>
      {item.role === 'ai' && (
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="robot-excited" size={18} color={Colors.primary} />
        </View>
      )}
      <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.bubbleText, item.role === 'user' && styles.userBubbleText]}>
          {item.text}
        </Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <MaterialCommunityIcons name="robot-excited" size={24} color={Colors.primary} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>AI Mentor</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Powered by GPT · Online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            typing ? (
              <View style={styles.typingRow}>
                <View style={styles.avatar}>
                  <MaterialCommunityIcons name="robot-excited" size={18} color={Colors.primary} />
                </View>
                <View style={styles.typingBubble}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              </View>
            ) : null
          }
        />

        <View style={[styles.inputRow, { paddingBottom: insets.bottom + 8 }]}>
          <TextInput
            style={styles.input}
            placeholder="Ask anything..."
            placeholderTextColor={Colors.textMuted}
            value={input}
            onChangeText={setInput}
            selectionColor={Colors.primary}
            multiline
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || typing) && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!input.trim() || typing}
          >
            <Ionicons name="send" size={18} color={input.trim() && !typing ? '#0A0E1A' : Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  avatarLarge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryBg,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.text },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.primary },
  onlineText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.primary },
  moreBtn: { padding: 4 },
  list: { paddingHorizontal: 16, paddingVertical: 12 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 12 },
  msgRowUser: { flexDirection: 'row-reverse' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryBg,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 12,
    gap: 6,
  },
  aiBubble: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.text, lineHeight: 21 },
  userBubbleText: { color: '#0A0E1A', fontFamily: 'Inter_500Medium' },
  timeText: { fontSize: 10, color: Colors.textMuted, alignSelf: 'flex-end' },
  typingRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 12 },
  typingBubble: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.card },
});
