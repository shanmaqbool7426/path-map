import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Platform, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

const AI_RESPONSES: Record<string, string> = {
  default: "Great question! Let me break that down for you step by step.\n\n1. First, focus on understanding your niche and target audience\n2. Research your competitors to identify gaps in the market\n3. Start small and validate your idea before scaling\n4. Track your metrics weekly and adjust your strategy\n\nWould you like me to go deeper into any of these areas?",
  shopify: "After creating your Shopify store, here's what you should focus on:\n\n1. Finding winning products using tools like Minea or AdsLibrary\n2. Setting up essential apps (Oberlo, Loox reviews, PageFly)\n3. Designing your homepage and product pages for conversion\n4. Configuring payments and shipping settings\n5. Running test orders to ensure checkout works\n\nWant me to explain any step in detail?",
  product: "For product research, I recommend:\n\n1. Use AliExpress, CJDropshipping to find trending items\n2. Check winning products on Minea or AdSpy\n3. Look for products with 3x markup potential\n4. Validate with Facebook/TikTok ad spy tools\n5. Test 5-10 products before scaling any one\n\nWould you like specific product research strategies for your niche?",
};

function getAIResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('shopify') || lower.includes('store')) return AI_RESPONSES.shopify;
  if (lower.includes('product') || lower.includes('research')) return AI_RESPONSES.product;
  return AI_RESPONSES.default;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '0',
    role: 'ai',
    text: "Hi! I'm your AI mentor.\n\nHow can I help you today?",
    time: 'Now',
  },
];

const now = () => {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
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

    const response = getAIResponse(text);
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: response,
        time: now(),
      };
      setMessages((prev) => [aiMsg, ...prev]);
      setTyping(false);
    }, 1200);
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
            <Text style={styles.onlineText}>Online</Text>
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
                  <View style={styles.typingDots}>
                    {[0, 1, 2].map((i) => (
                      <View key={i} style={styles.typingDot} />
                    ))}
                  </View>
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
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!input.trim()}
          >
            <Ionicons name="send" size={18} color={input.trim() ? '#0A0E1A' : Colors.textMuted} />
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
  typingDots: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.textMuted },
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
