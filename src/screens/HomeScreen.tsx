import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useProfile } from '../contexts/ProfileContext';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../constants/theme';
import { getActiveReminders, updateDecision, loadDecisions, syncStatsToSupabase } from '../utils/decisionStorage';
import { SpendingDecision } from '../config/supabase';
import { SAVING_TIPS, SavingTip } from '../constants/savingTips';
import { formatCurrency, formatHours, formatCompactCurrency, formatCompactHours } from '../utils/calculations';
import { formatCurrencyWithCode, formatCompactCurrencyWithCode } from '../utils/currency';
import Logo from '../components/shared/Logo';

const HomeScreen: React.FC = () => {
  const { profile, loading: profileLoading, refreshProfile } = useProfile();
  const [reminders, setReminders] = useState<SpendingDecision[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedReminder, setSelectedReminder] = useState<SpendingDecision | null>(null);
  const [isProcessingDecision, setIsProcessingDecision] = useState(false);

  const loadData = async () => {
    try {
      // Only load reminders, stats come from profile (Supabase)
      const remindersData = await getActiveReminders();
      setReminders(remindersData);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Refresh data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  // Refresh reminders every minute to update timer display
  useEffect(() => {
    const interval = setInterval(() => {
      getActiveReminders().then(setReminders).catch(err => 
        console.error('Error refreshing reminders:', err)
      );
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getTimeRemaining = (remindAt: string): string => {
    const now = new Date();
    const reminderTime = new Date(remindAt);
    const diff = reminderTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''}`;
    }
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    
    return `${minutes}m`;
  };

  const handleReminderDecision = async (decision: 'save' | 'bought') => {
    if (!selectedReminder) return;
    setIsProcessingDecision(true);

    try {
      const updatedDecision: Partial<SpendingDecision> = {
        decision_type: decision === 'save' ? 'save' : 'buy',
      };

      await updateDecision(selectedReminder.id, updatedDecision);
      
      const decisions = await loadDecisions();
      await syncStatsToSupabase(decisions);
      await refreshProfile();
      
      // Reload reminders and close modal
      const newReminders = await getActiveReminders();
      setReminders(newReminders);
      setSelectedReminder(null);
    } catch (error) {
      console.error('Error updating reminder decision:', error);
      alert('Failed to save decision');
    } finally {
      setIsProcessingDecision(false);
    }
  };

  if (profileLoading || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  // Use stats from profile (Supabase source of truth)
  const hasStats = profile && profile.total_decisions > 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.accent]} />
      }
    >
      {/* App Header with Logo */}
      <View style={styles.appHeader}>
        <Logo size="medium" showText={true} />
      </View>

      {/* User Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {profile?.questionnaire_score !== undefined && profile.questionnaire_score <= 2
            ? 'Mindful Spender'
            : profile?.questionnaire_score === 3
            ? 'Thoughtful Buyer'
            : 'Building Better Habits'}
        </Text>
        <Text style={styles.subtitle}>Your saving journey</Text>
      </View>

      {/* Stats Cards - Horizontal Scroll */}
      {hasStats ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.scrollContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
            <View style={[styles.card, styles.statCard]}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>💰</Text>
              </View>
              <Text style={styles.statValue}>{formatCompactCurrencyWithCode(profile.total_money_saved, profile?.currency || 'USD')}</Text>
              <Text style={styles.statLabel}>Money Saved</Text>
            </View>
            
            <View style={[styles.card, styles.statCard]}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>⏱</Text>
              </View>
              <Text style={styles.statValue}>{formatCompactHours(profile.total_hours_saved)}</Text>
              <Text style={styles.statLabel}>Time Saved</Text>
            </View>

            <View style={[styles.card, styles.statCard]}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>✓</Text>
              </View>
              <Text style={styles.statValue}>{profile.save_count + profile.dont_buy_count}</Text>
              <Text style={styles.statLabel}>Smart Choices</Text>
            </View>
            
            <View style={[styles.card, styles.statCard]}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>📊</Text>
              </View>
              <Text style={styles.statValue}>{profile.total_decisions}</Text>
              <Text style={styles.statLabel}>Total Decisions</Text>
            </View>
          </ScrollView>
          <View style={styles.scrollIndicator}><Text style={styles.scrollArrow}>›</Text></View>
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          <View style={[styles.card, styles.emptyCard]}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>🎯</Text>
            </View>
            <Text style={styles.emptyStateTitle}>Start Your Journey</Text>
            <Text style={styles.emptyStateText}>
              Use the calculator to evaluate purchases and see your savings grow
            </Text>
          </View>
        </View>
      )}

      {/* Let Me Think Reminders */}
      {reminders.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Decisions</Text>
          <View style={styles.scrollContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
            {reminders.map((reminder) => (
              <TouchableOpacity 
                key={reminder.id} 
                onPress={() => setSelectedReminder(reminder)}
                activeOpacity={0.7}
              >
                <View style={[styles.card, styles.reminderCard]}>
                  <View style={styles.reminderBadge}>
                    <Text style={styles.reminderBadgeText}>{getTimeRemaining(reminder.remind_at!)}</Text>
                  </View>
                  <Text style={styles.reminderTitle} numberOfLines={2} ellipsizeMode="tail">
                    {reminder.item_name || 'Item'}
                  </Text>
                  <View style={styles.reminderDetails}>
                    <Text style={styles.reminderPrice}>{formatCompactCurrencyWithCode(reminder.item_price, profile?.currency || 'USD')}</Text>
                    <Text style={styles.reminderHours}>{formatHours(reminder.work_hours)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {reminders.length > 1 && <View style={styles.scrollIndicator}><Text style={styles.scrollArrow}>›</Text></View>}
          </View>
        </View>
      )}

      {/* Saving Tips Carousel */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Money Tips</Text>
        <View style={styles.scrollContainer}>
          <View style={styles.carouselContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
            pagingEnabled={false}
            decelerationRate="fast"
            snapToInterval={280 + spacing.md}
            snapToAlignment="start"
          >
            {SAVING_TIPS.slice(0, 10).map((tip) => (
              <View key={tip.id} style={[styles.card, styles.tipCard]}>
                <View style={styles.tipHeader}>
                  <View style={styles.tipIconContainer}>
                    <Text style={styles.tipIcon}>{tip.emoji}</Text>
                  </View>
                  <Text style={styles.tipTitle} numberOfLines={2}>{tip.title}</Text>
                </View>
                <Text style={styles.tipText} numberOfLines={3}>{tip.tip}</Text>
              </View>
            ))}
          </ScrollView>
          </View>
          {SAVING_TIPS.length > 3 && <View style={styles.scrollIndicator}><Text style={styles.scrollArrow}>›</Text></View>}
        </View>
      </View>

      {/* Reminder Detail Modal */}
      <Modal
        visible={!!selectedReminder}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedReminder(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedReminder(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.reminderModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Decision Summary</Text>
              <TouchableOpacity onPress={() => setSelectedReminder(null)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={true}>
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Item:</Text>
                  <Text style={styles.summaryValue}>{selectedReminder?.item_name || 'Unknown'}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Price:</Text>
                  <Text style={styles.summaryValue}>{formatCurrencyWithCode(selectedReminder?.item_price || 0, profile?.currency || 'USD')}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Work hours:</Text>
                  <Text style={styles.summaryValue}>{formatHours(selectedReminder?.work_hours || 0)}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Remind me in:</Text>
                  <Text style={styles.summaryValue}>{selectedReminder?.remind_at ? getTimeRemaining(selectedReminder.remind_at) : 'N/A'}</Text>
                </View>

                {selectedReminder?.categories && selectedReminder.categories.length > 0 && (
                  <View style={[styles.summaryRow, styles.summaryRowLast]}>
                    <Text style={styles.summaryLabel}>Categories:</Text>
                    <View style={styles.categoriesWrap}>
                      {selectedReminder.categories.map((cat, index) => (
                        <View key={index} style={styles.categoryBadge}>
                          <Text style={styles.categoryBadgeText}>{cat}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.boughtButton, isProcessingDecision && { opacity: 0.6 }]}
                onPress={() => handleReminderDecision('bought')}
                disabled={isProcessingDecision}
              >
                <Text style={styles.boughtButtonText}>{isProcessingDecision ? 'Saving...' : 'I Bought It'}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.wontBuyButton, isProcessingDecision && { opacity: 0.6 }]}
                onPress={() => handleReminderDecision('save')}
                disabled={isProcessingDecision}
              >
                <Text style={styles.wontBuyButtonText}>{isProcessingDecision ? 'Saving...' : 'I Won\'t Buy It'}</Text>
              </TouchableOpacity>
            </View>
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
  content: {
    padding: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  appHeader: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: fontSize.heading3,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  scrollContainer: {
    position: 'relative',
  },
  scrollIndicator: {
    position: 'absolute',
    right: -4,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    backgroundColor: 'rgba(253,255,252,0.95)',
    borderRadius: 16,
  },
  scrollArrow: {
    fontSize: 32,
    fontWeight: 'bold' as any,
    color: colors.accent,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  carouselContainer: {
    height: 180,
  },
  horizontalScroll: {
    paddingLeft: spacing.xs,
    paddingRight: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statCard: {
    width: 140,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.accent}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: fontSize.heading3,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyCard: {
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.accent}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyStateTitle: {
    fontSize: fontSize.heading3,
    fontWeight: fontWeight.semibold as any,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  reminderCard: {
    width: 180,
  },
  reminderBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderBadgeText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold as any,
    color: '#fff',
    textAlign: 'center',
  },
  reminderTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    minHeight: 44,
    paddingRight: 68, // Increased padding to prevent overlap with time badge (was spacing.xl = 32)
  },
  reminderDetails: {
    gap: spacing.xs,
  },
  reminderPrice: {
    fontSize: fontSize.heading3,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
  },
  reminderHours: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  tipCard: {
    width: 280,
    height: 170,
    justifyContent: 'space-between',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  tipIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.accent}15`,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  tipIcon: {
    fontSize: 18,
  },
  tipTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold as any,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  tipText: {
    fontSize: fontSize.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderModalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    width: '85%',
    maxHeight: '80%',
    paddingHorizontal: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.textMuted,
  },
  modalTitle: {
    fontSize: fontSize.heading3,
    fontWeight: fontWeight.semibold as any,
    color: colors.textPrimary,
  },
  modalCloseButton: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  modalBody: {
    paddingVertical: spacing.lg,
  },
  summaryBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.textMuted,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.textMuted,
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  summaryLabel: {
    fontSize: fontSize.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  summaryValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold as any,
    color: colors.accent,
    flex: 1,
    textAlign: 'right',
  },
  categoriesWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    justifyContent: 'flex-end',
  },
  categoryBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: fontSize.caption,
    color: '#fff',
    fontWeight: fontWeight.medium as any,
  },
  modalButtonContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.textMuted,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  boughtButton: {
    backgroundColor: colors.accent,
  },
  boughtButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold as any,
    color: colors.textLight,
  },
  wontBuyButton: {
    backgroundColor: colors.alert,
  },
  wontBuyButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold as any,
    color: colors.textLight,
  },
  modalCloseButton2: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold as any,
  },
});

export default HomeScreen;
