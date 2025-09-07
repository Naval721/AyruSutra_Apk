import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Surface,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useTherapies } from '../hooks/useSupabase';
import { callGeminiAPI, generateTherapyContext } from '../utils/gemini';
import { ChatMessage } from '../types';

export const ChatScreen: React.FC = () => {
  const { patient } = useAuth();
  const { data: therapies } = useTherapies();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Add welcome message
    if (patient && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        text: `Hello ${patient.name}! I'm your AI Wellness Assistant. I'm here to help you with questions about your Ayurvedic treatment, dosha-specific guidance, and preparation for your upcoming therapies. How can I assist you today?`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [patient, messages.length]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading || !patient) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await callGeminiAPI({
        message: inputText.trim(),
        patientId: patient.id,
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessageContainer : styles.aiMessageContainer
    ]}>
      <Card style={[
        styles.messageCard,
        item.isUser ? styles.userMessageCard : styles.aiMessageCard
      ]}>
        <Card.Content style={styles.messageContent}>
          <Text variant="bodyMedium" style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : styles.aiMessageText
          ]}>
            {item.text}
          </Text>
          <Text variant="bodySmall" style={[
            styles.timestamp,
            item.isUser ? styles.userTimestamp : styles.aiTimestamp
          ]}>
            {item.timestamp.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );

  const suggestedQuestions = [
    "What should I eat before my next therapy?",
    "How can I prepare for my upcoming session?",
    "What are some dosha-specific lifestyle tips?",
    "What precautions should I take today?",
    "How can I support my healing process?",
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          AI Wellness Assistant
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Your personalized Ayurvedic guide
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <Surface style={styles.suggestionsContainer}>
            <Text variant="bodyMedium" style={styles.suggestionsTitle}>
              Try asking:
            </Text>
            <View style={styles.suggestionsList}>
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  mode="outlined"
                  onPress={() => handleSuggestedQuestion(question)}
                  style={styles.suggestionButton}
                  compact
                >
                  {question}
                </Button>
              ))}
            </View>
          </Surface>
        )}

        {/* Input Area */}
        <Surface style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me anything about your treatment..."
              mode="outlined"
              multiline
              style={styles.textInput}
              disabled={isLoading}
              onSubmitEditing={sendMessage}
            />
            <IconButton
              icon="send"
              mode="contained"
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
              style={styles.sendButton}
            />
          </View>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#2E7D32" />
              <Text variant="bodySmall" style={styles.loadingText}>
                AI is thinking...
              </Text>
            </View>
          )}
        </Surface>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageCard: {
    maxWidth: '80%',
    elevation: 1,
  },
  userMessageCard: {
    backgroundColor: '#2E7D32',
  },
  aiMessageCard: {
    backgroundColor: '#FFFFFF',
  },
  messageContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  messageText: {
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#333333',
  },
  timestamp: {
    marginTop: 4,
    fontSize: 11,
  },
  userTimestamp: {
    color: '#E8F5E8',
  },
  aiTimestamp: {
    color: '#999999',
  },
  suggestionsContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  suggestionsTitle: {
    color: '#666',
    marginBottom: 12,
    fontWeight: '600',
  },
  suggestionsList: {
    gap: 8,
  },
  suggestionButton: {
    alignSelf: 'flex-start',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
  },
  sendButton: {
    margin: 0,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
  },
  loadingText: {
    color: '#666',
  },
});