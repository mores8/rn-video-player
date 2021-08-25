import React, { Component } from 'react';
import { View, Easing, StyleSheet, Animated } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  line: {
    height: 5,
    width: 75,
  },
});

export type LoadingProps = {
  theme: string;
  loading?: boolean;
};

class Loading extends Component<LoadingProps> {
  static defaultProps = {
    loading: true,
  };

  anim: { width: Animated.Value; translateX: Animated.Value };

  constructor(props: LoadingProps) {
    super(props);
    this.anim = {
      width: new Animated.Value(10),
      translateX: new Animated.Value(-50),
    };
  }

  componentDidMount() {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(this.anim.width, {
            toValue: 75,
            easing: Easing.back(1),
            duration: 750,
            useNativeDriver: false,
          }),
          Animated.timing(this.anim.width, {
            toValue: 10,
            // easing: Easing.back(2),
            duration: 250,
            useNativeDriver: false,
          }),
          Animated.timing(this.anim.width, {
            toValue: 75,
            easing: Easing.back(1),
            duration: 750,
            useNativeDriver: false,
          }),
          Animated.timing(this.anim.width, {
            toValue: 10,
            // easing: Easing.back(2),
            duration: 250,
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(this.anim.translateX, {
            toValue: 50,
            easing: Easing.back(1),
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(this.anim.translateX, {
            toValue: -50,
            easing: Easing.back(1),
            duration: 1000,
            useNativeDriver: false,
          }),
        ]),
      ])
    ).start();
  }

  render() {
    const { translateX, width } = this.anim;
    if (this.props.loading) {
      return (
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.line,
              {
                backgroundColor: this.props.theme,
                width,
                transform: [{ translateX }],
              },
            ]}
          />
        </View>
      );
    }
    return null;
  }
}

export { Loading };
