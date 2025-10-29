import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../constants/theme';
import { SALARY_TYPE, SalaryType } from '../../constants';
import { REGIONS, CURRENCIES, getDefaultCurrencyForRegion } from '../../constants/regions';

interface SalaryInputScreenProps {
  onContinue: (data: { salary: number; salaryType: SalaryType; region: string; currency: string }) => void;
}

const SalaryInputScreen: React.FC<SalaryInputScreenProps> = ({ onContinue }) => {
  const [salary, setSalary] = useState('');
  const [salaryType, setSalaryType] = useState<SalaryType>(SALARY_TYPE.ANNUAL);
  const [region, setRegion] = useState('US');
  const [currency, setCurrency] = useState('USD');
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const calculationOpacity = useRef(new Animated.Value(0)).current;
  const calculationHeight = useRef(new Animated.Value(0)).current;

  const handleRegionSelect = (regionCode: string) => {
    setRegion(regionCode);
    const defaultCurrency = getDefaultCurrencyForRegion(regionCode);
    setCurrency(defaultCurrency);
    setShowRegionPicker(false);
  };

  const handleContinue = () => {
    const salaryNum = parseFloat(salary);
    if (isNaN(salaryNum) || salaryNum <= 0) {
      return;
    }
    onContinue({ salary: salaryNum, salaryType, region, currency });
  };

  // Calculate hourly wage in real-time
  const calculateHourlyWage = (): number | null => {
    const salaryNum = parseFloat(salary);
    if (isNaN(salaryNum) || salaryNum <= 0) {
      return null;
    }

    // Assuming 40 hours per week, 52 weeks per year
    const hoursPerYear = 52 * 40;
    
    if (salaryType === SALARY_TYPE.MONTHLY) {
      const annualSalary = salaryNum * 12;
      return annualSalary / hoursPerYear;
    } else {
      return salaryNum / hoursPerYear;
    }
  };

  const hourlyWage = calculateHourlyWage();
  const isValid = salary && parseFloat(salary) > 0;
  const selectedRegionName = REGIONS.find((r) => r.code === region)?.name || 'Select Region';
  const selectedCurrencyInfo = CURRENCIES.find((c) => c.code === currency);

  // Animate calculation box appearance/disappearance
  useEffect(() => {
    if (hourlyWage !== null) {
      // Animate in
      Animated.parallel([
        Animated.timing(calculationOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.spring(calculationHeight, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: false,
        }),
      ]).start();

      // Auto-scroll to show the calculation (reduced for compact version)
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 100, animated: true });
      }, 100);
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(calculationOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(calculationHeight, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [hourlyWage]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Let's set up your profile</Text>
          <Text style={styles.subtitle}>
            We'll use this to calculate how many work hours your purchases cost
          </Text>

          {/* Region Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Where do you live?</Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowRegionPicker(true)}
            >
              <Text style={styles.pickerText}>{selectedRegionName}</Text>
              <Text style={styles.pickerArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Currency Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Currency</Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowCurrencyPicker(true)}
            >
              <Text style={styles.pickerText}>
                {selectedCurrencyInfo?.symbol} {selectedCurrencyInfo?.name}
              </Text>
              <Text style={styles.pickerArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Salary Type Toggle */}
          <View style={styles.section}>
            <Text style={styles.label}>Salary Period</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  salaryType === SALARY_TYPE.MONTHLY && styles.toggleButtonActive,
                ]}
                onPress={() => setSalaryType(SALARY_TYPE.MONTHLY)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    salaryType === SALARY_TYPE.MONTHLY && styles.toggleTextActive,
                  ]}
                >
                  Monthly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  salaryType === SALARY_TYPE.ANNUAL && styles.toggleButtonActive,
                ]}
                onPress={() => setSalaryType(SALARY_TYPE.ANNUAL)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    salaryType === SALARY_TYPE.ANNUAL && styles.toggleTextActive,
                  ]}
                >
                  Annual
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Salary Input */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Your {salaryType === SALARY_TYPE.MONTHLY ? 'Monthly' : 'Annual'} Salary
            </Text>
            <View style={styles.salaryInputContainer}>
              <Text style={styles.currencySymbol}>{selectedCurrencyInfo?.symbol}</Text>
              <TextInput
                style={styles.salaryInput}
                placeholder="Enter amount"
                placeholderTextColor={colors.textMuted}
                value={salary}
                onChangeText={setSalary}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Hourly Wage Display - Compact version */}
          {hourlyWage !== null && (
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => setShowInfoModal(true)}
            >
              <Animated.View 
                style={[
                  styles.calculationBox,
                  {
                    opacity: calculationOpacity,
                    transform: [
                      {
                        scaleY: calculationHeight,
                      },
                      {
                        translateY: calculationHeight.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-10, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.calculationRow}>
                  <Text style={styles.calculationLabel}>Hourly Wage: </Text>
                  <Text style={styles.calculationValueCompact}>
                    {selectedCurrencyInfo?.symbol}{hourlyWage.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/hr
                  </Text>
                  <Text style={styles.infoIcon}> ⓘ</Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          )}

          <Text style={styles.hint}>
            💡 This information is private and only used for calculations
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      {/* Region Picker Modal */}
      <Modal visible={showRegionPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Your Region</Text>
            <ScrollView style={styles.modalList}>
              {REGIONS.map((r) => (
                <TouchableOpacity
                  key={r.code}
                  style={styles.modalItem}
                  onPress={() => handleRegionSelect(r.code)}
                >
                  <Text style={styles.modalItemText}>{r.name}</Text>
                  {region === r.code && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowRegionPicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Currency Picker Modal */}
      <Modal visible={showCurrencyPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <ScrollView style={styles.modalList}>
              {CURRENCIES.map((c) => (
                <TouchableOpacity
                  key={c.code}
                  style={styles.modalItem}
                  onPress={() => {
                    setCurrency(c.code);
                    setShowCurrencyPicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>
                    {c.symbol} {c.name}
                  </Text>
                  {currency === c.code && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowCurrencyPicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Info Modal */}
      <Modal visible={showInfoModal} transparent animationType="fade">
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalContent}>
            <Text style={styles.infoModalTitle}>How is this calculated?</Text>
            <Text style={styles.infoModalText}>
              Your hourly wage is calculated based on a standard work schedule:
            </Text>
            <Text style={styles.infoModalFormula}>
              {salaryType === SALARY_TYPE.MONTHLY 
                ? '(Monthly Salary × 12) ÷ 2,080 hours' 
                : 'Annual Salary ÷ 2,080 hours'}
            </Text>
            <Text style={styles.infoModalSubtext}>
              (40 hours/week × 52 weeks/year = 2,080 hours/year)
            </Text>
            <Text style={styles.infoModalNote}>
              💡 You can adjust these settings later in your profile.
            </Text>
            <TouchableOpacity
              style={styles.infoModalButton}
              onPress={() => setShowInfoModal(false)}
            >
              <Text style={styles.infoModalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: fontSize.heading2,
    fontWeight: fontWeight.bold as any,
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: fontSize.body * 1.5,
  },
  section: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inactive,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  pickerText: {
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  pickerArrow: {
    fontSize: fontSize.bodySmall,
    color: colors.textSecondary,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.inactive,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.small,
  },
  toggleButtonActive: {
    backgroundColor: colors.accent,
  },
  toggleText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium as any,
  },
  toggleTextActive: {
    color: colors.textLight,
    fontWeight: fontWeight.semibold as any,
  },
  salaryInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inactive,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.md,
  },
  currencySymbol: {
    fontSize: fontSize.bodyLarge,
    color: colors.textPrimary,
    marginRight: spacing.sm,
    fontWeight: fontWeight.semibold as any,
  },
  salaryInput: {
    flex: 1,
    fontSize: fontSize.bodyLarge,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  hint: {
    fontSize: fontSize.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
  calculationBox: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calculationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculationLabel: {
    fontSize: fontSize.body,
    color: colors.textLight,
    fontWeight: fontWeight.medium as any,
  },
  calculationValueCompact: {
    fontSize: fontSize.heading3,
    color: colors.textLight,
    fontWeight: fontWeight.bold as any,
  },
  calculationValue: {
    fontSize: fontSize.heading1,
    color: colors.textLight,
    fontWeight: fontWeight.bold as any,
    marginBottom: spacing.xs,
  },
  calculationSubtext: {
    fontSize: fontSize.bodySmall,
    color: colors.textLight,
    opacity: 0.9,
    textAlign: 'center',
  },
  infoIcon: {
    fontSize: fontSize.bodyLarge,
    color: colors.textLight,
    opacity: 0.9,
  },
  button: {
    backgroundColor: colors.primaryButton,
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.textLight,
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold as any,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.large,
    borderTopRightRadius: borderRadius.large,
    paddingTop: spacing.lg,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: fontSize.heading3,
    fontWeight: fontWeight.bold as any,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.inactive,
  },
  modalItemText: {
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  checkmark: {
    fontSize: fontSize.bodyLarge,
    color: colors.accent,
    fontWeight: fontWeight.bold as any,
  },
  modalClose: {
    padding: spacing.lg,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.inactive,
  },
  modalCloseText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold as any,
  },
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  infoModalContent: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.large,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  infoModalTitle: {
    fontSize: fontSize.heading2,
    fontWeight: fontWeight.bold as any,
    color: colors.dark,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  infoModalText: {
    fontSize: fontSize.body,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    lineHeight: fontSize.body * 1.5,
  },
  infoModalFormula: {
    fontSize: fontSize.bodyLarge,
    color: colors.accent,
    fontWeight: fontWeight.bold as any,
    textAlign: 'center',
    marginBottom: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.small,
  },
  infoModalSubtext: {
    fontSize: fontSize.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  infoModalNote: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  infoModalButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  infoModalButtonText: {
    color: colors.textLight,
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold as any,
  },
});

export default SalaryInputScreen;
