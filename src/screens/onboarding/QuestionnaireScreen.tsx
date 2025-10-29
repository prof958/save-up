import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../constants/theme';
import { QUESTIONNAIRE_QUESTIONS } from '../../constants/questionnaire';
import type { QuestionnaireAnswers } from '../../config/supabase';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface QuestionnaireScreenProps {
  onComplete: (answers: QuestionnaireAnswers) => void;
  onSkip: () => void;
}

const QuestionnaireScreen: React.FC<QuestionnaireScreenProps> = ({ onComplete, onSkip }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({});
  const position = useRef(new Animated.ValueXY()).current;
  const questionOpacity = useRef(new Animated.Value(0)).current;
  const questionScale = useRef(new Animated.Value(0.9)).current;
  const introOpacity = useRef(new Animated.Value(0)).current;
  const loadingDots = useRef(new Animated.Value(0)).current;
  
  // Use refs to track current values for PanResponder
  const currentIndexRef = useRef(currentIndex);
  const answersRef = useRef(answers);
  
  // Keep refs in sync with state
  React.useEffect(() => {
    currentIndexRef.current = currentIndex;
    answersRef.current = answers;
  }, [currentIndex, answers]);

  // Intro animation
  React.useEffect(() => {
    // Fade in intro
    Animated.timing(introOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Animate loading dots
    Animated.loop(
      Animated.sequence([
        Animated.timing(loadingDots, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(loadingDots, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Hide intro after 2.5 seconds
    const timer = setTimeout(() => {
      Animated.timing(introOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowIntro(false);
        // Start first question animation
        animateQuestionIn();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const animateQuestionIn = () => {
    questionOpacity.setValue(0);
    questionScale.setValue(0.9);
    
    Animated.parallel([
      Animated.timing(questionOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(questionScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Animate question when index changes (skip first render)
  React.useEffect(() => {
    if (!showIntro && currentIndex > 0) {
      animateQuestionIn();
    }
  }, [currentIndex]);

  const swipeCard = (answer: 'yes' | 'no') => {
    const direction = answer === 'yes' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;

    Animated.timing(position, {
      toValue: { x: direction, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      const currentQuestion = QUESTIONNAIRE_QUESTIONS[currentIndexRef.current];
      const newAnswers = {
        ...answersRef.current,
        [currentQuestion.key]: answer === 'yes',
      };
      setAnswers(newAnswers);

      if (currentIndexRef.current < QUESTIONNAIRE_QUESTIONS.length - 1) {
        setCurrentIndex(currentIndexRef.current + 1);
        position.setValue({ x: 0, y: 0 });
      } else {
        onComplete(newAnswers as QuestionnaireAnswers);
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          // Swipe right = Yes
          swipeCard('yes');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          // Swipe left = No
          swipeCard('no');
        } else {
          // Return to center
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleButtonPress = (answer: 'yes' | 'no') => {
    swipeCard(answer);
  };

  const cardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [0.5, 1, 0.5],
  });

  const yesTextOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const noTextOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const currentQuestion = QUESTIONNAIRE_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONNAIRE_QUESTIONS.length) * 100;

  const dotOpacity1 = loadingDots.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: [0.3, 1, 0.3, 0.3],
  });
  const dotOpacity2 = loadingDots.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: [0.3, 0.3, 1, 0.3],
  });
  const dotOpacity3 = loadingDots.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: [0.3, 0.3, 0.3, 1],
  });

  if (showIntro) {
    return (
      <Animated.View style={[styles.container, styles.introContainer, { opacity: introOpacity }]}>
        <Text style={styles.introEmoji}>🤔</Text>
        <Text style={styles.introTitle}>Let's see your spending type</Text>
        <View style={styles.loadingDotsContainer}>
          <Animated.View style={[styles.loadingDot, { opacity: dotOpacity1 }]} />
          <Animated.View style={[styles.loadingDot, { opacity: dotOpacity2 }]} />
          <Animated.View style={[styles.loadingDot, { opacity: dotOpacity3 }]} />
        </View>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {QUESTIONNAIRE_QUESTIONS.length}
        </Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <View style={styles.cardContainer}>
        {/* Background overlay indicators */}
        <Animated.View style={[styles.overlayContainer, styles.noOverlay, { opacity: noTextOpacity }]}>
          <Text style={styles.overlayLabel}>NO</Text>
        </Animated.View>
        <Animated.View style={[styles.overlayContainer, styles.yesOverlay, { opacity: yesTextOpacity }]}>
          <Text style={styles.overlayLabel}>YES</Text>
        </Animated.View>

        {/* Card */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: position.getTranslateTransform(),
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Animated.View 
            style={{
              opacity: questionOpacity,
              transform: [{ scale: questionScale }],
            }}
          >
            <Text style={styles.questionNumber}>Question {currentIndex + 1}</Text>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
          </Animated.View>
        </Animated.View>
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>Swipe or tap to answer</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.noButton]}
          onPress={() => handleButtonPress('no')}
        >
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.yesButton]}
          onPress={() => handleButtonPress('yes')}
        >
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  introContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  introEmoji: {
    fontSize: 80,
    marginBottom: spacing.xl,
  },
  introTitle: {
    fontSize: fontSize.heading1,
    fontWeight: fontWeight.bold as any,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  loadingDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  skipText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium as any,
  },
  progressText: {
    fontSize: fontSize.body,
    color: colors.textPrimary,
    fontWeight: fontWeight.semibold as any,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.inactive,
    borderRadius: 2,
    marginBottom: spacing.xxl,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH - spacing.lg * 2,
    zIndex: 0,
  },
  noOverlay: {
    left: 0,
    backgroundColor: 'rgba(231, 29, 54, 0.1)',
    borderRadius: borderRadius.large,
  },
  yesOverlay: {
    right: 0,
    backgroundColor: 'rgba(46, 196, 182, 0.1)',
    borderRadius: borderRadius.large,
  },
  overlayLabel: {
    fontSize: 72,
    fontWeight: fontWeight.bold as any,
    color: colors.textMuted,
  },
  card: {
    width: SCREEN_WIDTH - spacing.lg * 2,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.large,
    padding: spacing.xxl,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 280,
    justifyContent: 'center',
    zIndex: 1,
  },
  questionNumber: {
    fontSize: fontSize.bodySmall,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  questionText: {
    fontSize: fontSize.heading3,
    color: colors.textPrimary,
    fontWeight: fontWeight.semibold as any,
    lineHeight: fontSize.heading3 * 1.5,
    textAlign: 'center',
  },
  instructionsContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  instructionsText: {
    fontSize: fontSize.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
  },
  noButton: {
    backgroundColor: colors.alert,
  },
  yesButton: {
    backgroundColor: colors.accent,
  },
  buttonText: {
    color: colors.textLight,
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold as any,
  },
});

export default QuestionnaireScreen;
