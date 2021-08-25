import React, { Component } from 'react';
import { StyleSheet, Animated, View } from 'react-native';

const backgroundColor = 'rgba(255,255,255,0.25)';

const styles = StyleSheet.create({
  completed: {
    height: 3,
  },
  incomplete: {
    backgroundColor,
    height: 3,
  },
  outerBar: {
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'row',
  },
});

type ProgressBarProps = {
  progress: number;
  theme: string;
};

class ProgressBar extends Component<ProgressBarProps> {
  complete: Animated.Value;
  incomplete: Animated.Value;

  constructor(props: ProgressBarProps) {
    super(props);
    this.complete = new Animated.Value(0);
    this.incomplete = new Animated.Value(1);
  }

  render() {
    const { progress, theme } = this.props;
    const incomplete = 1 - progress;
    Animated.parallel([
      Animated.timing(this.complete, {
        toValue: progress,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(this.incomplete, {
        toValue: incomplete,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
    return (
      <View style={styles.outerBar}>
        <Animated.View
          style={[
            { flex: this.complete, backgroundColor: theme },
            styles.completed,
          ]}
        />
        <Animated.View style={[{ flex: this.incomplete }, styles.incomplete]} />
      </View>
    );
  }
}

export { ProgressBar };
