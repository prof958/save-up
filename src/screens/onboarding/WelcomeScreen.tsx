import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../constants/theme';

interface WelcomeScreenProps {
  onContinue: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>💰</Text>
        <Text style={styles.title}>Welcome to Save Up</Text>
        <Text style={styles.subtitle}>
          Make smarter spending decisions by understanding the true cost of your purchases
        </Text>

        <View style={styles.features}>
          <Feature emoji="⏰" text="See purchases in work hours" />
          <Feature emoji="📈" text="Calculate investment potential" />
          <Feature emoji="🎯" text="Make mindful decisions" />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}>Let's Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const Feature: React.FC<{ emoji: string; text: string }> = ({ emoji, text }) => (
  <View style={styles.feature}>
    <Text style={styles.featureEmoji}>{emoji}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.heading1,
    fontWeight: fontWeight.bold as any,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.md,
  },
  features: {
    width: '100%',
    marginTop: spacing.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  featureEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  featureText: {
    fontSize: fontSize.bodyLarge,
    color: colors.textPrimary,
    flex: 1,
  },
  button: {
    backgroundColor: colors.primaryButton,
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.textLight,
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold as any,
  },
});

export default WelcomeScreen;
