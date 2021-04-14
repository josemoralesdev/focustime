import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { fontSizes, spacing } from '../utils/sizes';
import { colors } from '../utils/colors';

const minutesToMillis = (min) => min * 60 * 1000;
const formatTime = (time) => (time < 10 ? `0${time}` : time);

export const Countdown = ({ minutes = 5, isPaused, onProgress, onEnd }) => {
  const [millis, setMillis] = useState(minutesToMillis(minutes));
  const minutesLeft = Math.floor(millis / 1000 / 60) % 60;
  const secondsLeft = Math.floor(millis / 1000) % 60;

  const interval = React.useRef(null);

  const countDown = () => {
    setMillis((time) => {
      if (time === 0) {
        clearInterval(interval.current);
        return time;
      }
      const timeLeft = time - 1000;
      // Shouldn't update external component inside hooks on a child component. Move function to useEffect.
      //onProgress(timeLeft / minutesToMillis(minutes));
      return timeLeft;
    });
  };
  useEffect(() => {
    onProgress(millis / minutesToMillis(minutes));
    if (millis === 0) onEnd();
  }, [millis]);
  useEffect(() => {
    setMillis(minutesToMillis(minutes));
  }, [minutes]);

  useEffect(() => {
    if (isPaused) {
      if (interval.current) clearInterval(interval.current);
      return;
    }
    interval.current = setInterval(countDown, 1000);
    // On unmount, clear the interval
    return () => clearInterval(interval.current);
  }, [isPaused]);

  return (
    <Text style={styles.text}>
      {formatTime(minutesLeft)}:{formatTime(secondsLeft)}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    backgroundColor: 'rgba(94,132,226,0.3)',
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.white,
    padding: spacing.lg,
  },
});
