import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../constants/theme';

interface Question {
  id: number;
  question: string;
  basis: string;
  yesHint: string;
  noHint: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Did I plan to buy this before today?',
    basis: 'Unplanned purchases are the definition of impulse buying.',
    yesHint: 'Good sign - you\'ve thought about this',
    noHint: '⚠️ Impulse alert - consider waiting',
  },
  {
    id: 2,
    question: 'Will this purchase clearly improve my life or solve a real problem?',
    basis: 'Meaningful purchases align with personal goals or problem-solving.',
    yesHint: 'Likely a meaningful purchase',
    noHint: '⚠️ Reassess your motivation',
  },
  {
    id: 3,
    question: 'Would I still want this if I had to wait 48 hours?',
    basis: 'Impulsivity decreases when forced to delay reward.',
    yesHint: 'Your desire is stable',
    noHint: '⚠️ Re-evaluate later',
  },
  {
    id: 4,
    question: 'Can I easily afford it without affecting my budget or priorities?',
    basis: 'Financial strain triggers regret and stress.',
    yesHint: 'Financially viable',
    noHint: '❌ Risk to financial stability',
  },
  {
    id: 5,
    question: 'Am I emotionally neutral right now (not stressed, sad, or bored)?',
    basis: 'Strong emotions distort perceived value and lead to regret.',
    yesHint: 'You\'re in a rational state',
    noHint: '⚠️ Emotion-driven urge detected',
  },
];

interface BuyingQuestionnaireProps {
  visible: boolean;
  itemName: string;
  itemPrice: number;
  currency: string;
  onComplete: (answers: boolean[], score: number, recommendation: 'buy' | 'wait' | 'dont_buy') => void;
  onCancel: () => void;
}

const BuyingQuestionnaire: React.FC<BuyingQuestionnaireProps> = ({
  visible,
  itemName,
  itemPrice,
  currency,
  onComplete,
  onCancel,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(QUESTIONS.length).fill(null));

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    // Move to next question or show results
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score and recommendation
      const score = newAnswers.filter(a => a === true).length;
      let recommendation: 'buy' | 'wait' | 'dont_buy';
      
      if (score === 5) {
        recommendation = 'buy';
      } else if (score >= 3) {
        recommendation = 'wait';
      } else {
        recommendation = 'dont_buy';
      }

      onComplete(newAnswers as boolean[], score, recommendation);
      resetQuestionnaire();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleClose = () => {
    onCancel();
    resetQuestionnaire();
  };

  const resetQuestionnaire = () => {
    setCurrentQuestion(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
  };

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTop}>
                  <Text style={styles.title}>Smart Purchase Check</Text>
                  <TouchableOpacity onPress={handleClose}>
                    <Ionicons name="close" size={24} color={colors.textPrimary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemInfo}>
                  {itemName} • {currency} {itemPrice.toFixed(2)}
                </Text>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  Question {currentQuestion + 1} of {QUESTIONS.length}
                </Text>
              </View>

              {/* Question */}
              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.questionContainer}>
                  <Text style={styles.questionNumber}>#{question.id}</Text>
                  <Text style={styles.questionText}>{question.question}</Text>
                  <View style={styles.basisContainer}>
                    <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.basisText}>{question.basis}</Text>
                  </View>
                </View>

                {/* Answer Buttons */}
                <View style={styles.answersContainer}>
                  <TouchableOpacity
                    style={[styles.answerButton, styles.yesButton]}
                    onPress={() => handleAnswer(true)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="checkmark-circle" size={28} color="#fff" />
                    <View style={styles.answerContent}>
                      <Text style={styles.answerButtonText}>Yes</Text>
                      <Text style={styles.answerHint}>{question.yesHint}</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.answerButton, styles.noButton]}
                    onPress={() => handleAnswer(false)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-circle" size={28} color="#fff" />
                    <View style={styles.answerContent}>
                      <Text style={styles.answerButtonText}>No</Text>
                      <Text style={styles.answerHint}>{question.noHint}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              {/* Navigation */}
              {currentQuestion > 0 && (
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <Ionicons name="arrow-back" size={20} color={colors.accent} />
                  <Text style={styles.backButtonText}>Previous Question</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: spacing.xl,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.inactive + '30',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSize.heading3,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
  },
  itemInfo: {
    fontSize: fontSize.bodySmall,
    color: colors.textSecondary,
  },
  progressContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.inactive + '30',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  progressText: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  questionContainer: {
    marginBottom: spacing.xl,
  },
  questionNumber: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold as any,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  questionText: {
    fontSize: fontSize.heading3,
    fontWeight: fontWeight.semibold as any,
    color: colors.textPrimary,
    lineHeight: 32,
    marginBottom: spacing.md,
  },
  basisContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.accent + '10',
    padding: spacing.md,
    borderRadius: borderRadius.medium,
    gap: spacing.sm,
  },
  basisText: {
    flex: 1,
    fontSize: fontSize.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  answersContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.large,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  yesButton: {
    backgroundColor: '#10b981', // Green for positive
  },
  noButton: {
    backgroundColor: colors.alert,
  },
  answerContent: {
    flex: 1,
  },
  answerButtonText: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold as any,
    color: '#fff',
    marginBottom: 4,
  },
  answerHint: {
    fontSize: fontSize.bodySmall,
    color: '#fff',
    opacity: 0.9,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  backButtonText: {
    fontSize: fontSize.body,
    color: colors.accent,
    fontWeight: fontWeight.medium as any,
  },
});

export default BuyingQuestionnaire;
