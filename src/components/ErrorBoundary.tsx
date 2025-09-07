import React, { Component, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Card style={styles.errorCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.errorTitle}>
                Oops! Something went wrong
              </Text>
              <Text variant="bodyMedium" style={styles.errorMessage}>
                We're sorry, but something unexpected happened. Please try again.
              </Text>
              {__DEV__ && this.state.error && (
                <Text variant="bodySmall" style={styles.errorDetails}>
                  {this.state.error.message}
                </Text>
              )}
              <Button
                mode="contained"
                onPress={this.handleRetry}
                style={styles.retryButton}
              >
                Try Again
              </Button>
            </Card.Content>
          </Card>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  errorCard: {
    maxWidth: 400,
    elevation: 4,
  },
  errorTitle: {
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorMessage: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  errorDetails: {
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  retryButton: {
    alignSelf: 'center',
  },
});