import React from 'react';
import { View, Text, Pressable } from 'react-native';

type ErrorBoundaryState = { hasError: boolean; error?: Error };

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('Root ErrorBoundary caught error', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Something went wrong</Text>
          <Text style={{ color: '#bbb', textAlign: 'center', marginBottom: 20 }}>
            {this.state.error?.message}
          </Text>
          <Pressable
            onPress={this.handleReset}
            style={{ backgroundColor: '#7c3aed', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Try Again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
