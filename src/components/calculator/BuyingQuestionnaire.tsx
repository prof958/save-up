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
  onComplete: (answers: boolean[], score: number, recommendation: 'buy' | 'wait' | 'dont_buy', action: 'primary' | 'secondary') => void;
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
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [recommendation, setRecommendation] = useState<'buy' | 'wait' | 'dont_buy'>('wait');

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    // Move to next question or show results
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score and recommendation
      const calculatedScore = newAnswers.filter(a => a === true).length;
      let calculatedRecommendation: 'buy' | 'wait' | 'dont_buy';
      
      if (calculatedScore === 5) {
        calculatedRecommendation = 'buy';
      } else if (calculatedScore >= 3) {
        calculatedRecommendation = 'wait';
      } else {
        calculatedRecommendation = 'dont_buy';
      }

      setScore(calculatedScore);
      setRecommendation(calculatedRecommendation);
      setShowResults(true);
    }
  };

  const handlePrimaryAction = () => {
    onComplete(answers as boolean[], score, recommendation, 'primary');
    resetQuestionnaire();
  };

  const handleSecondaryAction = () => {
    onComplete(answers as boolean[], score, recommendation, 'secondary');
    resetQuestionnaire();
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
    setShowResults(false);
    setScore(0);
    setRecommendation('wait');
  };

  const question = QUESTIONS[currentQuestion];
  const progress = showResults ? 100 : ((currentQuestion + 1) / QUESTIONS.length) * 100;

  // Get result messages based on recommendation
  const getResultContent = () => {
    if (recommendation === 'buy') {
      return {
        icon: 'checkmark-circle',
        iconColor: '#4CAF50',
        title: '✅ Good Choice!',
        message: `Score: ${score}/5\n\nYour answers suggest this is a well-considered purchase. You've thought this through!`,
        primaryButton: 'Good Choice, Let\'s Buy It',
        secondaryButton: 'Okay, It Can Wait',
      };
    } else if (recommendation === 'wait') {
      return {
        icon: 'time',
        iconColor: '#FF9800',
        title: '⏳ Consider Waiting',
        message: `Score: ${score}/5\n\nYou have some uncertainty. It's recommended to wait 48 hours and reassess this purchase.`,
        primaryButton: 'I\'ll Wait 48 Hours',
        secondaryButton: 'I Still Want to Buy It',
      };
    } else {
      return {
        icon: 'alert-circle',
        iconColor: '#F44336',
        title: '❌ Impulse Alert!',
        message: `Score: ${score}/5\n\nStrong signs of impulsivity detected. This purchase may lead to regret.`,
        primaryButton: 'I\'m Still Gonna Buy It',
        secondaryButton: 'Ok, I Won\'t Buy It',
      };
    }
  };

  const resultContent = getResultContent();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent={true}
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
                  {showResults ? 'Complete' : `Question ${currentQuestion + 1} of ${QUESTIONS.length}`}
                </Text>
              </View>

              {/* Question or Results */}
              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {!showResults ? (
                  <>
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
                  </>
                ) : (
                  /* Results View */
                  <View style={styles.resultsContainer}>
                    <View style={styles.resultIconContainer}>
                      <Ionicons name={resultContent.icon as any} size={64} color={resultContent.iconColor} />
                    </View>
                    <Text style={styles.resultTitle}>{resultContent.title}</Text>
                    <Text style={styles.resultMessage}>{resultContent.message}</Text>

                    {/* Action Buttons */}
                    <View style={styles.resultButtonsContainer}>
                      <TouchableOpacity
                        style={[styles.resultButton, styles.primaryResultButton]}
                        onPress={handlePrimaryAction}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.primaryResultButtonText}>{resultContent.primaryButton}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.resultButton, styles.secondaryResultButton]}
                        onPress={handleSecondaryAction}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.secondaryResultButtonText}>{resultContent.secondaryButton}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </ScrollView>

              {/* Navigation */}
              {!showResults && currentQuestion > 0 && (
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
    zIndex: 9999,
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    paddingBottom: spacing.xl,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
  resultsContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  resultIconContainer: {
    marginBottom: spacing.lg,
  },
  resultTitle: {
    fontSize: fontSize.heading2,
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  resultMessage: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  resultButtonsContainer: {
    width: '100%',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  resultButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryResultButton: {
    backgroundColor: colors.accent,
  },
  secondaryResultButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.textMuted,
  },
  primaryResultButtonText: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold as any,
    color: colors.textLight,
  },
  secondaryResultButtonText: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold as any,
    color: colors.textPrimary,
  },
});

export default BuyingQuestionnaire;
