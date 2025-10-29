import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Platform,
} from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../constants/theme';
import { saveDecision, syncStatsToSupabase, loadDecisions } from '../../utils/decisionStorage';
import { useProfile } from '../../contexts/ProfileContext';
import { formatCurrencyWithCode } from '../../utils/currency';

interface RemindersModalProps {
  visible: boolean;
  itemName: string;
  itemPrice: number;
  onClose: () => void;
  onSave: () => void;
}

const TIMER_OPTIONS = [
  { id: '24h', label: '24 hours', hours: 24 },
  { id: '48h', label: '48 hours', hours: 48 },
  { id: '72h', label: '72 hours', hours: 72 },
  { id: '1w', label: '1 week', hours: 168 },
];

const SHOPPING_CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports & Outdoors',
  'Books',
  'Beauty & Personal Care',
  'Food & Grocery',
  'Entertainment',
  'Toys & Games',
  'Automotive',
  'Health & Wellness',
  'Office Supplies',
];

const RemindersModal: React.FC<RemindersModalProps> = ({
  visible,
  itemName,
  itemPrice,
  onClose,
  onSave,
}) => {
  const { profile, refreshProfile } = useProfile();
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

    // Categories are optional, no need to validate
    setSaving(true);

    try {
      const timerOption = TIMER_OPTIONS.find((t) => t.id === selectedTimer);
      if (!timerOption) return;

      const remindAt = new Date(Date.now() + timerOption.hours * 60 * 60 * 1000).toISOString();

      await saveDecision({
        item_name: thinkingAbout,
        item_price: itemPrice,
        work_hours: 0, // Will be calculated later if needed
        investment_value: 0, // Will be calculated later if needed
        decision_type: 'let_me_think',
        remind_at: remindAt,
        categories: selectedTags.length > 0 ? selectedTags : undefined, // Optional categories
      });

      // Sync stats to Supabase in background
      const decisions = await loadDecisions();
      await syncStatsToSupabase(decisions);
      await refreshProfile();

      setSaving(false);
      onSave();
    } catch (error) {
      console.error('Error saving reminder:', error);
      alert('Failed to save reminder. Please try again.');
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Let Me Think</Text>
            <TouchableOpacity onPress={onClose} disabled={saving}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={true}
            scrollIndicatorInsets={{ right: 1 }}
          >
            {/* Timer Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🕐 Think for a</Text>
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
              <Text style={styles.sectionTitle}>💭 Thinking on</Text>
              <TextInput
                style={styles.input}
                placeholder="What are you thinking to buy?"
                placeholderTextColor={colors.textMuted}
                value={thinkingAbout}
                onChangeText={setThinkingAbout}
                editable={!saving}
              />
              <Text style={styles.helperText}>
                Be specific to help you remember (e.g., "Apple AirPods Pro")
              </Text>
            </View>

            {/* Shopping Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏷️ Tag the item</Text>
              <Text style={styles.helperText}>Select one or more categories</Text>
              <View style={styles.tagsGrid}>
                {SHOPPING_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.tagChip,
                      selectedTags.includes(category) && styles.tagChipActive,
                    ]}
                    onPress={() => toggleTag(category)}
                    disabled={saving}
                  >
                    <Text
                      style={[
                        styles.tagChipText,
                        selectedTags.includes(category) && styles.tagChipTextActive,
                      ]}
                    >
                      {category}
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
              onPress={onClose}
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.large,
    borderTopRightRadius: borderRadius.large,
    maxHeight: '90%',
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.textMuted,
  },
  headerTitle: {
    fontSize: fontSize.heading2,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  closeButton: {
    fontSize: fontSize.heading2,
    color: colors.textSecondary,
    padding: spacing.sm,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.bodyLarge,
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.textMuted,
    backgroundColor: colors.surface,
  },
  tagChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  tagChipText: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
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
    gap: spacing.sm,
    flexDirection: 'row',
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

export default RemindersModal;
