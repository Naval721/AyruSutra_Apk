import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Surface,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email.trim(), password);
      
      if (error) {
        Alert.alert('Login Failed', error.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.title}>
            AyurSutra
          </Text>
          <Text variant="headlineSmall" style={styles.subtitle}>
            Patient Companion
          </Text>
          <Text variant="bodyLarge" style={styles.description}>
            Your personalized wellness journey starts here
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.cardTitle}>
              Welcome Back
            </Text>
            <Text variant="bodyMedium" style={styles.cardSubtitle}>
              Sign in to access your therapy schedule and wellness guidance
            </Text>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.input}
              disabled={loading}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              autoComplete="password"
              style={styles.input}
              disabled={loading}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Sign In
            </Button>
          </Card.Content>
        </Card>

        <Surface style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            Having trouble signing in?{'\n'}
            Contact your practitioner for assistance.
          </Text>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  title: {
    color: '#2E7D32',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#8D6E63',
    marginTop: 8,
    textAlign: 'center',
  },
  description: {
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
    maxWidth: 300,
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  cardTitle: {
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  footerText: {
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});