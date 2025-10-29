import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../constants/theme';
import { getQuestionnaireResult } from '../../constants/questionnaire';

interface ResultsScreenProps {
  score: number;
  onContinue: () => void;
  isLoading?: boolean;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, onContinue, isLoading = false }) => {
  const result = getQuestionnaireResult(score);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{result.emoji}</Text>
        <Text style={styles.score}>Your Score: {score} / 7</Text>
        <Text style={styles.title}>{result.title}</Text>
        <Text style={styles.message}>{result.message}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What's Next?</Text>
          <Text style={styles.infoText}>
            Use the Spending Calculator whenever you're considering a purchase. 
            You'll see how much work time it costs and what it could be worth if invested instead.
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={onContinue}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.textLight} />
        ) : (
          <Text style={styles.buttonText}>Start Saving Smart</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

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
  score: {
    fontSize: fontSize.heading3,
    fontWeight: fontWeight.bold as any,
    color: colors.accent,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.heading2,
    fontWeight: fontWeight.bold as any,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  message: {
    fontSize: fontSize.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.md,
    lineHeight: fontSize.bodyLarge * 1.5,
  },
  infoBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  infoTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold as any,
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    lineHeight: fontSize.body * 1.5,
  },
  button: {
    backgroundColor: colors.primaryButton,
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.textLight,
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold as any,
  },
});

export default ResultsScreen;
