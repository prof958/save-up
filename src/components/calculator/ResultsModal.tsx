import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../constants/theme';
import { formatCurrency, formatHours } from '../../utils/calculations';
import { saveDecision, syncStatsToSupabase, loadDecisions } from '../../utils/decisionStorage';
import { useProfile } from '../../contexts/ProfileContext';
import { formatCurrencyWithCode } from '../../utils/currency';
import BuyingQuestionnaire from './BuyingQuestionnaire';

interface ResultsModalProps {
  visible: boolean;
  calculation: {
    price: number;
    workHours: number;
    investmentValue: number;
    itemName: string;
  };
  profile: any;
  onClose: () => void;
  onLetMeThink: () => void;
  onClear: () => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({
  visible,
  calculation,
  profile,
  onClose,
  onLetMeThink,
  onClear,
}) => {
  const navigation = useNavigation();
  const { refreshProfile } = useProfile();
  const [isProcessingBuy, setIsProcessingBuy] = useState(false);
  const [isProcessingDontBuy, setIsProcessingDontBuy] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const handleBuyClick = () => {
    // Check if user wants questionnaire
    if (profile?.show_buying_questionnaire) {
      setShowQuestionnaire(true);
    } else {
      // Proceed directly to buy
      handleBuy();
    }
  };

  const handleQuestionnaireComplete = async (
    answers: boolean[],
    score: number,
    recommendation: 'buy' | 'wait' | 'dont_buy'
  ) => {
    setShowQuestionnaire(false);

    // Show recommendation alert
    const messages = {
      buy: {
        title: '✅ Good Decision!',
        message: `Score: ${score}/5\n\nYour purchase appears well-planned and aligned with your goals. Go ahead with confidence!`,
        action: 'Confirm Purchase',
      },
      wait: {
        title: '⏳ Consider Waiting',
        message: `Score: ${score}/5\n\nYou have some uncertainty. It's recommended to wait 48 hours and reassess this purchase.`,
        action: 'Save for Later',
      },
      dont_buy: {
        title: '❌ Reconsider This Purchase',
        message: `Score: ${score}/5\n\nStrong signs of impulsivity detected. This purchase may lead to regret. Consider not buying.`,
        action: 'Don\'t Buy',
      },
    };

    const rec = messages[recommendation];

    Alert.alert(rec.title, rec.message, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: rec.action,
        onPress: async () => {
          if (recommendation === 'buy') {
            await handleBuy();
          } else if (recommendation === 'wait') {
            onLetMeThink();
          } else {
            await handleDontBuy();
          }
        },
      },
    ]);
  };

  const handleBuy = async () => {
    setIsProcessingBuy(true);
    try {
      await saveDecision({
        item_name: calculation.itemName,
        item_price: calculation.price,
        work_hours: calculation.workHours,
        investment_value: calculation.investmentValue,
        decision_type: 'buy',
        remind_at: null,
      });

      const decisions = await loadDecisions();
      await syncStatsToSupabase(decisions);
      await refreshProfile();

      onClear();
      onClose();
      navigation.navigate('Home' as never);
    } catch (error) {
      console.error('Error saving buy decision:', error);
      alert('Failed to save decision');
    } finally {
      setIsProcessingBuy(false);
    }
  };

  const handleDontBuy = async () => {
    setIsProcessingDontBuy(true);
    try {
      await saveDecision({
        item_name: calculation.itemName,
        item_price: calculation.price,
        work_hours: calculation.workHours,
        investment_value: calculation.investmentValue,
        decision_type: 'dont_buy',
        remind_at: null,
      });

      const decisions = await loadDecisions();
      await syncStatsToSupabase(decisions);
      await refreshProfile();

      onClear();
      onClose();
      navigation.navigate('Home' as never);
    } catch (error) {
      console.error('Error saving dont_buy decision:', error);
      alert('Failed to save decision');
    } finally {
      setIsProcessingDontBuy(false);
    }
  };

  const handleLetMeThink = () => {
    onLetMeThink();
    (navigation as any).navigate('LetMeThink', {
      itemName: calculation.itemName,
      itemPrice: calculation.price,
      workHours: calculation.workHours,
    });
  };

  return (
    <>
      {/* Buying Questionnaire Modal */}
      <BuyingQuestionnaire
        visible={showQuestionnaire}
        itemName={calculation.itemName}
        itemPrice={calculation.price}
        currency={profile?.currency || 'USD'}
        onComplete={handleQuestionnaireComplete}
        onCancel={() => setShowQuestionnaire(false)}
      />

      {/* Results Modal */}
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
            <Text style={styles.headerTitle}>Here's the Real Cost</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Item Info */}
            <View style={styles.section}>
              <Text style={styles.itemName}>{calculation.itemName}</Text>
              <Text style={styles.price}>{formatCurrencyWithCode(calculation.price, profile?.currency || 'USD')}</Text>
            </View>

            {/* Work Hours Card */}
            <View style={[styles.card, styles.workHoursCard]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardIcon}>⏱</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Work Hours Required</Text>
                <Text style={styles.cardValue}>{formatHours(calculation.workHours)}</Text>
                <Text style={styles.cardDescription}>
                  That's {Math.round(calculation.workHours * 60)} minutes of your life
                </Text>
              </View>
            </View>

            {/* Investment Value Card */}
            <View style={[styles.card, styles.investmentCard]}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardIcon}>📈</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>If You Invested Instead</Text>
                <Text style={styles.cardValue}>{formatCurrencyWithCode(calculation.investmentValue, profile?.currency || 'USD')}</Text>
                <Text style={styles.cardDescription}>
                  Worth in 10 years at 7% annual return
                </Text>
              </View>
            </View>

          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buyButton, isProcessingBuy && { opacity: 0.6 }]}
              onPress={handleBuyClick}
              activeOpacity={0.8}
              disabled={isProcessingBuy || isProcessingDontBuy}
            >
              <Text style={styles.buyButtonText}>{isProcessingBuy ? 'Saving...' : 'Buy'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.dontBuyButton, isProcessingDontBuy && { opacity: 0.6 }]}
              onPress={handleDontBuy}
              activeOpacity={0.8}
              disabled={isProcessingBuy || isProcessingDontBuy}
            >
              <Text style={styles.dontBuyButtonText}>{isProcessingDontBuy ? 'Saving...' : 'Don\'t Buy'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.letMeThinkButton, (isProcessingBuy || isProcessingDontBuy) && { opacity: 0.6 }]}
              onPress={handleLetMeThink}
              activeOpacity={0.8}
              disabled={isProcessingBuy || isProcessingDontBuy}
            >
              <Text style={styles.letMeThinkButtonText}>Let Me Think</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </>
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
    maxHeight: '85%',
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
    alignItems: 'center',
  },
  itemName: {
    fontSize: fontSize.heading3,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: fontSize.heading2,
    fontWeight: fontWeight.bold,
    color: colors.accent,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
  },
  workHoursCard: {
    borderLeftColor: colors.alert,
  },
  investmentCard: {
    borderLeftColor: colors.accent,
  },
  cardIconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardIcon: {
    fontSize: fontSize.heading1,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: fontSize.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  cardValue: {
    fontSize: fontSize.heading3,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    fontSize: fontSize.bodySmall,
    color: colors.textMuted,
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  buyButton: {
    backgroundColor: colors.accent,
  },
  buyButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.textLight,
  },
  dontBuyButton: {
    backgroundColor: colors.alert,
  },
  dontBuyButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.textLight,
  },
  letMeThinkButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  letMeThinkButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.accent,
  },
});

export default ResultsModal;
