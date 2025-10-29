import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../constants/theme';
import { saveDecision, syncStatsToSupabase, loadDecisions } from '../utils/decisionStorage';
import { useProfile } from '../contexts/ProfileContext';
import { formatCurrencyWithCode } from '../utils/currency';

interface LetMeThinkScreenProps {
  route: {
    params: {
      itemName: string;
      itemPrice: number;
      workHours: number;
    };
  };
}

const TIMER_OPTIONS = [
  { id: '24h', label: '24 hours', hours: 24, icon: 'time' },
  { id: '48h', label: '48 hours', hours: 48, icon: 'time' },
  { id: '72h', label: '72 hours', hours: 72, icon: 'time' },
  { id: '1w', label: '1 week', hours: 168, icon: 'calendar' },
];

const SHOPPING_CATEGORIES = [
  { name: 'Electronics', icon: 'phone-portrait' },
  { name: 'Fashion', icon: 'shirt' },
  { name: 'Home & Garden', icon: 'home' },
  { name: 'Sports & Outdoors', icon: 'basketball' },
  { name: 'Books', icon: 'book' },
  { name: 'Beauty & Personal Care', icon: 'star' },
  { name: 'Food & Grocery', icon: 'cart' },
  { name: 'Entertainment', icon: 'film' },
  { name: 'Toys & Games', icon: 'game-controller' },
  { name: 'Automotive', icon: 'car' },
  { name: 'Health & Wellness', icon: 'heart' },
  { name: 'Office Supplies', icon: 'document' },
];

const LetMeThinkScreen: React.FC<LetMeThinkScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { profile, refreshProfile } = useProfile();
  const { itemName = '', itemPrice = 0, workHours = 0 } = route.params || {};

  const [selectedTimer, setSelectedTimer] = useState<string>('24h');
  const [thinkingAbout, setThinkingAbout] = useState(itemName);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (!thinkingAbout.trim()) {
      alert('Please enter what you are thinking about');
      return;
    }

    // Categories are optional, no validation needed
    setSaving(true);

    try {
      const timerOption = TIMER_OPTIONS.find((t) => t.id === selectedTimer);
      if (!timerOption) return;

      const remindAt = new Date(Date.now() + timerOption.hours * 60 * 60 * 1000).toISOString();

      await saveDecision({
        item_name: thinkingAbout,
        item_price: itemPrice,
        work_hours: workHours,
        investment_value: 0,
        decision_type: 'let_me_think',
        remind_at: remindAt,
        categories: selectedTags.length > 0 ? selectedTags : undefined, // Optional categories
      });

      // Sync stats to Supabase in background
      const decisions = await loadDecisions();
      await syncStatsToSupabase(decisions);
      await refreshProfile();

      setSaving(false);
      // Navigate back to Home
      (navigation as any).navigate('Tabs', { screen: 'Home' });
    } catch (error) {
      console.error('Error saving reminder:', error);
      alert('Failed to save reminder. Please try again.');
      setSaving(false);
    }
  };

  const handleCancel = () => {
    (navigation as any).navigate('Tabs', { screen: 'Home' });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={true}
          scrollIndicatorInsets={{ right: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
        {/* Timer Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Think for a</Text>
          <View style={styles.chipsContainer}>
            {TIMER_OPTIONS.map((timer) => (
              <TouchableOpacity
                key={timer.id}
                style={[
                  styles.chip,
                  selectedTimer === timer.id && styles.chipActive,
                ]}
                onPress={() => setSelectedTimer(timer.id)}
                disabled={saving}
              >
                <Ionicons
                  name={timer.icon as any}
                  size={16}
                  color={selectedTimer === timer.id ? '#fff' : colors.textPrimary}
                  style={styles.chipIcon}
                />
                <Text
                  style={[
                    styles.chipText,
                    selectedTimer === timer.id && styles.chipTextActive,
                  ]}
                >
                  {timer.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Item Name Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thinking on</Text>
          <TextInput
            style={styles.input}
            placeholder="What are you thinking to buy?"
            placeholderTextColor={colors.textMuted}
            value={thinkingAbout}
            onChangeText={setThinkingAbout}
            editable={!saving}
            maxLength={15}
          />
          <Text style={styles.helperText}>
            Keep it short and simple • {thinkingAbout.length}/15
          </Text>
        </View>

        {/* Shopping Categories with Icons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tag the item (optional)</Text>
          <Text style={styles.helperText}>Select one or more categories if you want</Text>
          <View style={styles.tagsGrid}>
            {SHOPPING_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.tagChip,
                  selectedTags.includes(category.name) && styles.tagChipActive,
                ]}
                onPress={() => toggleTag(category.name)}
                disabled={saving}
              >
                <Ionicons
                  name={category.icon as any}
                  size={20}
                  color={selectedTags.includes(category.name) ? '#fff' : colors.accent}
                  style={styles.tagIcon}
                />
                <Text
                  style={[
                    styles.tagChipText,
                    selectedTags.includes(category.name) && styles.tagChipTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Item:</Text>
            <Text style={styles.summaryValue}>{thinkingAbout || 'Not specified'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Price:</Text>
            <Text style={styles.summaryValue}>{formatCurrencyWithCode(itemPrice, profile?.currency || 'USD')}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Work hours:</Text>
            <Text style={styles.summaryValue}>{workHours.toFixed(1)}h</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Remind me in:</Text>
            <Text style={styles.summaryValue}>
              {TIMER_OPTIONS.find((t) => t.id === selectedTimer)?.label}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Categories:</Text>
            <Text style={styles.summaryValue}>
              {selectedTags.length > 0 ? selectedTags.join(', ') : 'None selected'}
            </Text>
          </View>
        </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Reminder'}
          </Text>
        </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.heading2,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 2,
    borderColor: colors.textMuted,
    backgroundColor: colors.surface,
  },
  chipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  chipIcon: {
    marginRight: spacing.xs,
  },
  chipText: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  chipTextActive: {
    color: colors.textLight,
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
    marginBottom: spacing.sm,
  },
  helperText: {
    fontSize: fontSize.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  tagChip: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.medium,
    borderWidth: 2,
    borderColor: colors.textMuted,
    backgroundColor: colors.surface,
    width: '48%',
    minHeight: 80,
  },
  tagChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  tagIcon: {
    marginBottom: spacing.xs,
  },
  tagChipText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  tagChipTextActive: {
    color: colors.textLight,
  },
  summaryBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.textMuted,
  },
  summaryTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.textMuted,
  },
  summaryLabel: {
    fontSize: fontSize.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  summaryValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.accent,
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.textMuted,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.textMuted,
  },
  cancelButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  saveButton: {
    backgroundColor: colors.accent,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.textLight,
  },
});

export default LetMeThinkScreen;
