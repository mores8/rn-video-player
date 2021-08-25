import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';

const backgroundColor = 'transparent';

const styles = StyleSheet.create({
  playButton: {
    opacity: 0.9,
  },
  playContainer: {
    alignItems: 'center',
    backgroundColor,
    flex: 1,
    justifyContent: 'center',
  },
});

type PlayButtonProps = {
  onPress: () => void;
  paused: boolean;
  theme: string;
};

const PlayButton = (props: PlayButtonProps) => (
  <View style={styles.playContainer}>
    <TouchableOpacity
      onPress={() => {
        props.onPress();
      }}
    >
      <Icons
        style={styles.playButton}
        name={props.paused ? 'play-circle-outline' : 'pause-circle-outline'}
        color={props.theme}
        size={100}
      />
    </TouchableOpacity>
  </View>
);

export { PlayButton };
