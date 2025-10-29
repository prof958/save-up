import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../constants/theme';
import { calculateWorkHours, calculateInvestmentValue, formatCurrency, formatHours, formatNumberInput, parseNumberInput } from '../utils/calculations';
import { useProfile } from '../contexts/ProfileContext';
import { ResultsModal } from '../components/calculator';
import { saveDecision, loadDecisions, syncStatsToSupabase } from '../utils/decisionStorage';
import { formatCurrencyWithCode, getCurrencySymbol } from '../utils/currency';
import { getCurrencyByCode } from '../constants/regions';

interface CalculationResult {
  price: number;
  workHours: number;
  investmentValue: number;
  itemName: string;
}

const SpendingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { profile, loading, refreshProfile } = useProfile();
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePriceChange = (text: string) => {
    const formatted = formatNumberInput(text);
    setPrice(formatted);
  };

  const handleCalculate = () => {
    const priceNum = parseNumberInput(price);
    if (!priceNum || priceNum <= 0) {
      alert('Please enter a valid price');
      return;
    }

    if (!profile?.hourly_wage || profile.hourly_wage <= 0) {
      alert('Please complete your profile setup first');
      return;
    }

    const workHours = calculateWorkHours(priceNum, profile.hourly_wage);
    const investmentValue = calculateInvestmentValue(priceNum);

    setCalculationResult({
      price: priceNum,
      workHours,
      investmentValue,
      itemName: itemName || 'Item',
    });

    setShowResults(true);
  };

  const handleClearForm = () => {
    setItemName('');
    setPrice('');
    setCalculationResult(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Spending Calculator</Text>
          <Text style={styles.subtitle}>
            See how much work this purchase really costs
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Your hourly wage:</Text>
          <Text style={styles.infoValue}>
            {formatCurrencyWithCode(profile?.hourly_wage || 0, profile?.currency || 'USD')}/hour
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Item Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Item Name (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Coffee, Laptop"
              placeholderTextColor={colors.textMuted}
              value={itemName}
              onChangeText={setItemName}
              maxLength={15}
            />
            <Text style={styles.helperText}>{itemName.length}/15 characters</Text>
          </View>

          {/* Price Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>{getCurrencyByCode(profile?.currency || 'USD')?.symbol || '$'}</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                value={price}
                onChangeText={handlePriceChange}
              />
            </View>
          </View>

          {/* Calculate Button */}
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={handleCalculate}
            activeOpacity={0.7}
          >
            <Text style={styles.calculateButtonText}>Calculate</Text>
          </TouchableOpacity>

          {/* Clear Button - visible when form has content */}
          {(price || itemName) && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearForm}
              activeOpacity={0.7}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Results Modal */}
      {calculationResult && (
        <ResultsModal
          visible={showResults}
          calculation={calculationResult}
          profile={profile}
          onClose={() => setShowResults(false)}
          onLetMeThink={() => {
            setShowResults(false);
            (navigation as any).navigate('LetMeThink', {
              itemName: calculationResult.itemName,
              itemPrice: calculationResult.price,
              workHours: calculationResult.workHours,
            });
          }}
          onClear={handleClearForm}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.heading2,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  infoLabel: {
    fontSize: fontSize.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  infoValue: {
    fontSize: fontSize.heading3,
    fontWeight: fontWeight.bold,
    color: colors.accent,
  },
  formSection: {
    marginBottom: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.textMuted,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  helperText: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.textMuted,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.md,
  },
  currencySymbol: {
    fontSize: fontSize.heading3,
    fontWeight: fontWeight.bold,
    color: colors.accent,
    marginRight: spacing.sm,
  },
  priceInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  calculateButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  calculateButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.textLight,
  },
  clearButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.textMuted,
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  clearButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
});

export default SpendingScreen;
