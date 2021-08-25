import React from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  slider: {
    marginHorizontal: -10,
  },
  // thumbStyle: {
  //   height: 15,
  //   width: 15,
  // },
  // disabledThumbStyle: {
  //   height: 1,
  //   width: 1,
  // },
  // trackStyle: {
  //   borderRadius: 1,
  // },
});

export type ScrubberTheme = {
  scrubberThumb?: string;
  scrubberBar?: string;
};

type ScrubberProps = {
  onSeek: (val: number) => void;
  onSeekRelease: (val: number) => void;
  progress: number;
  theme: ScrubberTheme;
  dragDisabled?: boolean;
};

const Scrubber = (props: ScrubberProps) => {
  const trackColor = 'rgba(255,255,255,0.5)';
  const { progress, theme, onSeek, onSeekRelease, dragDisabled } = props;
  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        onValueChange={(val) => onSeek(val)}
        onSlidingComplete={(val) => onSeekRelease(val)}
        value={progress}
        // thumbTintColor={theme.scrubberThumb}
        minimumTrackTintColor={theme.scrubberBar}
        maximumTrackTintColor={trackColor}
        disabled={dragDisabled}
        thumbImage={require('./assets/slider27.png')}
      />
    </View>
  );
};

Scrubber.defaultProps = {
  dragDisabled: false,
};

export { Scrubber };
