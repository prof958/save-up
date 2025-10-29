import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SpendingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending Calculator</Text>
      <Text style={styles.subtitle}>Calculate the true cost of your purchases</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SpendingScreen;
