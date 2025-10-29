import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useProfile } from '../contexts/ProfileContext';
import { colors, spacing, fontSize, fontWeight } from '../constants/theme';
import { getStats, getActiveReminders, DecisionStats } from '../utils/decisionStorage';
import { SpendingDecision } from '../config/supabase';
import { SAVING_TIPS, SavingTip } from '../constants/savingTips';
import { formatCurrency, formatHours } from '../utils/calculations';

const HomeScreen: React.FC = () => {
  const { profile, loading: profileLoading } = useProfile();
  const [stats, setStats] = useState<DecisionStats | null>(null);
  const [reminders, setReminders] = useState<SpendingDecision[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [statsData, remindersData] = await Promise.all([
        getStats(),
        getActiveReminders(),
      ]);
      
      setStats(statsData);
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

  if (profileLoading || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const hasStats = stats && stats.totalDecisions > 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.accent]} />
      }
    >
      {/* Header */}
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
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            <View style={[styles.card, styles.statCard]}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>💰</Text>
              </View>
              <Text style={styles.statValue}>{formatCurrency(stats.totalMoneySaved)}</Text>
              <Text style={styles.statLabel}>Money Saved</Text>
            </View>
            
            <View style={[styles.card, styles.statCard]}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>⏱</Text>
              </View>
              <Text style={styles.statValue}>{formatHours(stats.totalHoursSaved)}</Text>
              <Text style={styles.statLabel}>Time Saved</Text>
            </View>

            <View style={[styles.card, styles.statCard]}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>✓</Text>
              </View>
              <Text style={styles.statValue}>{stats.saveCount + stats.dontBuyCount}</Text>
              <Text style={styles.statLabel}>Smart Choices</Text>
            </View>
            
            <View style={[styles.card, styles.statCard]}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>📊</Text>
              </View>
              <Text style={styles.statValue}>{stats.totalDecisions}</Text>
              <Text style={styles.statLabel}>Total Decisions</Text>
            </View>
          </ScrollView>
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
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {reminders.map((reminder) => (
              <View key={reminder.id} style={[styles.card, styles.reminderCard]}>
                <View style={styles.reminderBadge}>
                  <Text style={styles.reminderBadgeText}>{getTimeRemaining(reminder.remind_at!)}</Text>
                </View>
                <Text style={styles.reminderTitle} numberOfLines={2}>
                  {reminder.item_name || 'Item'}
                </Text>
                <View style={styles.reminderDetails}>
                  <Text style={styles.reminderPrice}>{formatCurrency(reminder.item_price)}</Text>
                  <Text style={styles.reminderHours}>{formatHours(reminder.work_hours)}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Saving Tips Carousel */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Money Tips</Text>
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
      </View>
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
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: fontSize.heading2,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.bodySmall,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  carouselContainer: {
    height: 180,
  },
  horizontalScroll: {
    paddingLeft: spacing.xs,
    paddingRight: spacing.lg,
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
  },
  reminderBadgeText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold as any,
    color: '#fff',
  },
  reminderTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    minHeight: 44,
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
});

export default HomeScreen;
