import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, fontSize, fontWeight } from '../../constants/theme';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {
  const dimensions = {
    small: 32,
    medium: 48,
    large: 80,
  };

  const textSize = {
    small: fontSize.body,
    medium: fontSize.heading3,
    large: fontSize.heading1,
  };

  // TODO: Replace with actual logo image when provided
  // Uncomment the Image component below and comment out the placeholder View
  // after adding your logo.png file to assets/

  return (
    <View style={styles.container}>
      {/* Logo Image */}
      <Image 
        source={require('../../../assets/logo.png')}
        style={{ width: dimensions[size], height: dimensions[size] }}
        resizeMode="contain"
      />
      
      {showText && (
        <Text style={[styles.text, { fontSize: textSize[size] }]}>
          Save Up
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    fontWeight: fontWeight.bold as any,
    color: colors.textPrimary,
  },
});

export default Logo;
