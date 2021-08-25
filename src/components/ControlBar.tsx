import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ToggleIcon, Time, Scrubber, ScrubberTheme } from '.';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: 60,
    justifyContent: 'flex-end',
  },
});

export type ControlBarTheme = ScrubberTheme & {
  seconds: string;
  duration: string;
  volume?: string;
  fullscreen?: string;
};

type ControlBarProps = {
  toggleFS: () => void;
  onSeek: (val: number) => void;
  onSeekRelease: (val: number) => void;
  fullscreen: boolean;
  inlineOnly: boolean;
  hideFullScreenControl?: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  theme: ControlBarTheme;
  liveMode: boolean;
};

const ControlBar = (props: ControlBarProps) => {
  const {
    onSeek,
    onSeekRelease,
    progress,
    currentTime,
    duration,
    fullscreen,
    theme,
    inlineOnly,
    hideFullScreenControl,
    liveMode,
  } = props;

  return (
    <LinearGradient
      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.75)']}
      style={styles.container}
    >
      <Time
        time={currentTime}
        theme={theme.seconds}
        mode={liveMode ? 'minute' : 'second'}
      />
      <Scrubber
        onSeek={(pos) => onSeek(pos)}
        onSeekRelease={(pos) => onSeekRelease(pos)}
        progress={progress}
        theme={{
          scrubberThumb: theme.scrubberThumb,
          scrubberBar: theme.scrubberBar,
        }}
        dragDisabled={liveMode}
      />
      <Time
        time={duration}
        theme={theme.duration}
        mode={liveMode ? 'minute' : 'second'}
      />
      {!inlineOnly && !hideFullScreenControl && !fullscreen && (
        <ToggleIcon
          paddingRight
          onPress={() => props.toggleFS()}
          iconOff="fullscreen"
          iconOn="fullscreen-exit"
          isOn={fullscreen}
          theme={theme.fullscreen}
        />
      )}
    </LinearGradient>
  );
};

export { ControlBar };
