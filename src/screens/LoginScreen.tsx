import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Surface,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { GradientBackground } from '../components/ui/GradientBackground';
import { AnimatedCard } from '../components/ui/AnimatedCard';

const { width, height } = Dimensions.get('window');

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
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
    <GradientBackground variant="primary">
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={[styles.logoCircle, { backgroundColor: theme.colors.surface }]}>
                <MaterialCommunityIcons
                  name="leaf"
                  size={48}
                  color={theme.colors.primary}
                />
              </View>
            </View>
            
            <Text style={[styles.title, { color: theme.colors.surface }]}>
              AyurSutra
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.surface }]}>
              Patient Companion
            </Text>
            <Text style={[styles.description, { color: theme.colors.surface }]}>
              Your personalized wellness journey starts here
            </Text>
          </View>

          {/* Login Form */}
          <AnimatedCard style={styles.loginCard} animated delay={200}>
            <View style={styles.loginHeader}>
              <Text style={[styles.loginTitle, { color: theme.colors.primary }]}>
                Welcome Back
              </Text>
              <Text style={[styles.loginSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                Sign in to access your therapy schedule and wellness guidance
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  left={<TextInput.Icon icon="email" />}
                  style={styles.input}
                  disabled={loading}
                  theme={{
                    colors: {
                      primary: theme.colors.primary,
                    },
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                  style={styles.input}
                  disabled={loading}
                  theme={{
                    colors: {
                      primary: theme.colors.primary,
                    },
                  }}
                />
              </View>

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading || !email.trim() || !password.trim()}
                style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
                contentStyle={styles.loginButtonContent}
                labelStyle={styles.loginButtonLabel}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </View>
          </AnimatedCard>

          {/* Footer */}
          <AnimatedCard style={styles.footerCard} animated delay={400}>
            <View style={styles.footerContent}>
              <MaterialCommunityIcons
                name="information"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
                Having trouble signing in? Contact your practitioner for assistance.
              </Text>
            </View>
          </AnimatedCard>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    minHeight: height,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 60,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
  },
  loginCard: {
    marginBottom: 24,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'transparent',
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 12,
  },
  loginButtonContent: {
    paddingVertical: 12,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  footerCard: {
    marginBottom: 20,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});