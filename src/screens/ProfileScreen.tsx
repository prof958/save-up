import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../constants/theme';
import { formatCurrencyWithCode } from '../utils/currency';
import { getCurrencyByCode, CURRENCIES, Currency } from '../constants/regions';
import { calculateHourlyWage } from '../utils/calculations';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { profile, loading, updateProfile, refreshProfile } = useProfile();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  
  // Edit form state
  const [editSalary, setEditSalary] = useState('');
  const [editSalaryType, setEditSalaryType] = useState<'monthly' | 'annual'>('monthly');
  const [editCurrency, setEditCurrency] = useState('USD');
  const [currencyPickerVisible, setCurrencyPickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const openEditModal = () => {
    if (profile) {
      // Format salary with commas for display
      const formattedSalary = profile.salary_amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setEditSalary(formattedSalary);
      setEditSalaryType(profile.salary_type);
      setEditCurrency(profile.currency);
      setEditModalVisible(true);
    }
  };

  const handleSalaryChange = (text: string) => {
    // Remove commas for processing
    const numericValue = text.replace(/,/g, '');
    
    // Allow only numbers and decimal point
    if (numericValue === '' || /^\d*\.?\d*$/.test(numericValue)) {
      // Format with commas for display
      const parts = numericValue.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setEditSalary(parts.join('.'));
    }
  };

  const handleSaveProfile = async () => {
    // Remove commas before parsing
    const cleanedSalary = editSalary.replace(/,/g, '');
    const salaryAmount = parseFloat(cleanedSalary);
    
    if (!cleanedSalary || isNaN(salaryAmount) || salaryAmount <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid salary amount');
      return;
    }

    setSaving(true);
    try {
      // Note: hourly_wage is a generated column in Supabase, don't include it in update
      await updateProfile({
        salary_amount: salaryAmount,
        salary_type: editSalaryType,
        currency: editCurrency,
      });
      
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
      </View>
    );
  }

  const currencySymbol = getCurrencyByCode(profile.currency)?.symbol || '$';
  const spendingPersonality = 
    profile.questionnaire_score <= 2 ? 'Mindful Spender' :
    profile.questionnaire_score === 3 ? 'Occasional Impulse Buyer' :
    'Impulsive Spender';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Profile Info Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Salary Information</Text>
          <TouchableOpacity onPress={openEditModal}>
            <Ionicons name="pencil" size={20} color={colors.accent} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Salary</Text>
          <Text style={styles.infoValue}>
            {formatCurrencyWithCode(profile.salary_amount, profile.currency)}/{profile.salary_type}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hourly Wage</Text>
          <Text style={styles.infoValue}>
            {formatCurrencyWithCode(profile.hourly_wage, profile.currency)}/hr
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Currency</Text>
          <Text style={styles.infoValue}>{getCurrencyByCode(profile.currency)?.name || profile.currency}</Text>
        </View>
        
        {profile.region && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Region</Text>
            <Text style={styles.infoValue}>{profile.region}</Text>
          </View>
        )}
      </View>

      {/* Spending Personality Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Spending Personality</Text>
          <TouchableOpacity 
            onPress={() => (navigation as any).navigate('Questionnaire')}
            style={styles.retakeButton}
          >
            <Ionicons name="refresh" size={18} color={colors.accent} />
            <Text style={styles.retakeButtonText}>Retake</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.personalityContainer}>
          <Text style={styles.personalityType}>{spendingPersonality}</Text>
          <Text style={styles.personalityScore}>Score: {profile.questionnaire_score}/7</Text>
        </View>
      </View>

      {/* Lifetime Stats Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Lifetime Stats</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>💰 Money Saved</Text>
          <Text style={styles.statValue}>
            {formatCurrencyWithCode(profile.total_money_saved, profile.currency)}
          </Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>⏱ Time Saved</Text>
          <Text style={styles.statValue}>{profile.total_hours_saved.toFixed(1)} hrs</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>📊 Total Decisions</Text>
          <Text style={styles.statValue}>{profile.total_decisions}</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>{profile.buy_count}</Text>
            <Text style={styles.miniStatLabel}>Bought</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>{profile.dont_buy_count}</Text>
            <Text style={styles.miniStatLabel}>Didn't Buy</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>{profile.save_count}</Text>
            <Text style={styles.miniStatLabel}>Saved</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>{profile.let_me_think_count}</Text>
            <Text style={styles.miniStatLabel}>Thinking</Text>
          </View>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        {/* Buying Questionnaire Toggle */}
        <View style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color={colors.textSecondary} />
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Buying Questionnaire</Text>
            <Text style={styles.menuSubtext}>Get guidance before purchases</Text>
          </View>
          <Switch
            value={profile.show_buying_questionnaire}
            onValueChange={async (value) => {
              try {
                await updateProfile({ show_buying_questionnaire: value });
              } catch (error) {
                Alert.alert('Error', 'Failed to update setting');
              }
            }}
            trackColor={{ false: colors.inactive, true: colors.accent + '50' }}
            thumbColor={profile.show_buying_questionnaire ? colors.accent : '#f4f3f4'}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={async () => {
            Alert.alert(
              'Resync Data',
              'This will recalculate your statistics from local data. Only use this if your stats appear incorrect.',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Resync', 
                  onPress: async () => {
                    try {
                      const { loadDecisions, syncStatsToSupabase } = await import('../utils/decisionStorage');
                      const decisions = await loadDecisions();
                      await syncStatsToSupabase(decisions);
                      await refreshProfile();
                      Alert.alert('Success', 'Your statistics have been resynced.');
                    } catch (error) {
                      Alert.alert('Error', 'Failed to resync data. Please try again.');
                    }
                  }
                }
              ]
            );
          }}
        >
          <Ionicons name="sync-outline" size={24} color={colors.textSecondary} />
          <Text style={styles.menuText}>Resync Data</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.inactive} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => setPrivacyModalVisible(true)}>
          <Ionicons name="shield-checkmark-outline" size={24} color={colors.textSecondary} />
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.inactive} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => setAboutModalVisible(true)}>
          <Ionicons name="information-circle-outline" size={24} color={colors.textSecondary} />
          <Text style={styles.menuText}>About Save Up</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.inactive} />
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
              <Text style={styles.inputLabel}>Salary Amount</Text>
              <TextInput
                style={styles.input}
                value={editSalary}
                onChangeText={handleSalaryChange}
                keyboardType="decimal-pad"
                placeholder="Enter salary (e.g., 5,000.00)"
              />

              <Text style={styles.inputLabel}>Salary Type</Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleButton, editSalaryType === 'monthly' && styles.toggleButtonActive]}
                  onPress={() => setEditSalaryType('monthly')}
                >
                  <Text style={[styles.toggleText, editSalaryType === 'monthly' && styles.toggleTextActive]}>
                    Monthly
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, editSalaryType === 'annual' && styles.toggleButtonActive]}
                  onPress={() => setEditSalaryType('annual')}
                >
                  <Text style={[styles.toggleText, editSalaryType === 'annual' && styles.toggleTextActive]}>
                    Annual
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Currency</Text>
              <TouchableOpacity
                style={styles.currencySelector}
                onPress={() => setCurrencyPickerVisible(!currencyPickerVisible)}
              >
                <Text style={styles.currencyText}>
                  {getCurrencyByCode(editCurrency)?.symbol} {getCurrencyByCode(editCurrency)?.name}
                </Text>
                <Ionicons name={currencyPickerVisible ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {currencyPickerVisible && (
                <View style={styles.currencyListContainer}>
                  <ScrollView style={styles.currencyList} nestedScrollEnabled={true}>
                    {CURRENCIES.map((currency) => (
                      <TouchableOpacity
                        key={currency.code}
                        style={styles.currencyOption}
                        onPress={() => {
                          setEditCurrency(currency.code);
                          setCurrencyPickerVisible(false);
                        }}
                      >
                        <Text style={styles.currencyOptionText}>
                          {currency.symbol} {currency.name}
                        </Text>
                        {editCurrency === currency.code && (
                          <Ionicons name="checkmark" size={20} color={colors.accent} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={aboutModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAboutModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setAboutModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About Save Up</Text>
              <TouchableOpacity onPress={() => setAboutModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.aboutText}>
                <Text style={styles.aboutBold}>Save Up</Text> helps you make mindful spending decisions by visualizing purchases in terms of work hours and investment opportunity costs.
              </Text>
              <Text style={styles.aboutText}>
                Every time you consider a purchase, we show you how many hours of work it would take to afford it, and what that money could grow to if invested instead.
              </Text>
              <Text style={styles.aboutText}>
                <Text style={styles.aboutBold}>Version:</Text> 1.0.0
              </Text>
              <Text style={styles.aboutText}>
                <Text style={styles.aboutBold}>Made with ❤️</Text> to help you build better financial habits.
              </Text>
            </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        visible={privacyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPrivacyModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
              <TouchableOpacity onPress={() => setPrivacyModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.privacyText}>
                <Text style={styles.aboutBold}>Your Privacy Matters</Text>
              </Text>
              <Text style={styles.privacyText}>
                Save Up is designed with your privacy in mind. Here's what you need to know:
              </Text>
              <Text style={styles.privacyText}>
                <Text style={styles.aboutBold}>• Local Storage:</Text> Your individual spending decisions are stored locally on your device and never leave your phone.
              </Text>
              <Text style={styles.privacyText}>
                <Text style={styles.aboutBold}>• Cloud Sync:</Text> Only aggregate statistics (total money saved, decision counts) are synced to our secure servers for backup purposes.
              </Text>
              <Text style={styles.privacyText}>
                <Text style={styles.aboutBold}>• Account Data:</Text> We store your email, salary information, and preferences securely using Supabase.
              </Text>
              <Text style={styles.privacyText}>
                <Text style={styles.aboutBold}>• No Selling:</Text> We never sell your data to third parties.
              </Text>
              <Text style={styles.privacyText}>
                <Text style={styles.aboutBold}>• Data Deletion:</Text> You can delete your account and all associated data at any time by contacting support.
              </Text>
            </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: fontSize.body,
    color: colors.error,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.heading3,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.inactive + '20',
  },
  infoLabel: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold as any,
    color: colors.textPrimary,
  },
  personalityContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  personalityType: {
    fontSize: fontSize.heading2,
    fontWeight: fontWeight.bold as any,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  personalityScore: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  retakeButtonText: {
    fontSize: fontSize.bodySmall,
    color: colors.accent,
    fontWeight: fontWeight.semibold as any,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.inactive + '20',
  },
  statLabel: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.inactive + '20',
  },
  miniStat: {
    alignItems: 'center',
  },
  miniStatValue: {
    fontSize: fontSize.heading2,
    fontWeight: fontWeight.bold as any,
    color: colors.accent,
  },
  miniStatLabel: {
    fontSize: fontSize.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.heading3,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: spacing.md,
    borderRadius: borderRadius.medium,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuText: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.inactive + '20',
  },
  modalTitle: {
    fontSize: fontSize.heading2,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
  },
  modalBody: {
    padding: spacing.lg,
  },
  inputLabel: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inactive,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    padding: 4,
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
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: fontWeight.semibold as any,
  },
  currencySelector: {
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
  currencyText: {
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  currencyListContainer: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  currencyList: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.inactive,
    maxHeight: 240,
  },
  currencyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.inactive + '20',
  },
  currencyOptionText: {
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold as any,
  },
  aboutText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  aboutBold: {
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
  },
  privacyText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  menuSubtext: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default ProfileScreen;
