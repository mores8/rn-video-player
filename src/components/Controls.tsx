import React, { Component } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback as Touchable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  PlayButton,
  ControlBar,
  Loading,
  TopBar,
  ProgressBar,
  ControlBarTheme,
} from '.';
import type { PlayerState } from './types';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
  },
  flex: {
    flex: 1,
  },
});

type ControlsTheme = ControlBarTheme & {
  progress: string;
  title?: string;
  more: string;
  loading: string;
  center: string;
};

type ControlsProps = {
  toggleFS: () => void;
  togglePlay: () => void;
  onSeek: (val: number) => void;
  onSeekRelease: (val: number) => void;
  onMorePress: () => void;
  onBackPress: () => void;
  playerState: PlayerState;
  paused: boolean;
  inlineOnly: boolean;
  hideFullScreenControl?: boolean;
  fullscreen: boolean;
  more: boolean;
  loading: boolean;
  progress: number;
  currentTime: number;
  controlDuration: number; // ?
  duration: number;
  title: string;
  logo?: string;
  theme: ControlsTheme;
  liveMode: boolean;
};

type ControlsState = {
  hideControls: boolean;
  seconds: number;
  seeking: boolean;
};

class Controls extends Component<ControlsProps, ControlsState> {
  animControls: Animated.Value;
  scale: Animated.Value;
  progressbar: Animated.Value;
  timer?: ReturnType<typeof setInterval>;

  constructor(props: ControlsProps) {
    super(props);
    this.state = {
      hideControls: false,
      seconds: 0,
      seeking: false,
    };
    this.animControls = new Animated.Value(1);
    this.scale = new Animated.Value(1);
    this.progressbar = new Animated.Value(2);
  }

  componentDidMount() {
    this.setTimer();
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  componentDidUpdate(prevProps: ControlsProps) {
    if (this.props.playerState !== prevProps.playerState) {
      switch (this.props.playerState) {
        case 'stopped':
        case 'paused':
          this.showControls();
      }
    }
  }

  onSeek = (pos: number) => {
    this.props.onSeek(pos);
    if (!this.state.seeking) {
      this.setState({ seeking: true });
    }
  };

  onSeekRelease = (pos: number) => {
    this.props.onSeekRelease(pos);
    this.setState({ seeking: false, seconds: 0 });
  };

  setTimer() {
    this.timer = setInterval(() => {
      switch (true) {
        case this.state.seeking:
          // do nothing
          break;
        case this.props.paused:
          if (this.state.seconds > 0) {
            this.setState({ seconds: 0 });
          }
          break;
        case this.state.hideControls:
          break;
        case this.state.seconds > this.props.controlDuration:
          this.hideControls();
          break;
        default:
          this.setState({ seconds: this.state.seconds + 1 });
      }
    }, 1000);
  }

  showControls = () => {
    this.setState({ hideControls: false }, () => {
      this.progressbar.setValue(2);
      Animated.parallel([
        Animated.timing(this.animControls, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(this.scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    });
  };

  hideControls() {
    Animated.parallel([
      Animated.timing(this.animControls, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(this.scale, {
        toValue: 0.25,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => this.setState({ hideControls: true, seconds: 0 }));
  }

  hiddenControls() {
    Animated.timing(this.progressbar, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    return (
      <SafeAreaView style={styles.container}>
        <Touchable style={styles.container} onPress={this.showControls}>
          <Animated.View
            style={[styles.container, { paddingBottom: this.progressbar }]}
          >
            <ProgressBar
              theme={this.props.theme.progress}
              progress={this.props.progress}
            />
          </Animated.View>
        </Touchable>
      </SafeAreaView>
    );
  }

  loading() {
    const { logo, more, onMorePress, onBackPress, title, theme, liveMode } =
      this.props;
    return (
      <SafeAreaView style={styles.container}>
        {!liveMode && (
          <TopBar
            title={title}
            logo={logo}
            more={more}
            onMorePress={() => onMorePress()}
            theme={{ title: theme.title, more: theme.more }}
            onBackPress={() => onBackPress()}
          />
        )}
        <Loading theme={theme.loading} />
      </SafeAreaView>
    );
  }

  displayedControls() {
    const {
      paused,
      fullscreen,
      logo,
      more,
      onMorePress,
      onBackPress,
      title,
      progress,
      currentTime,
      duration,
      theme,
      inlineOnly,
      hideFullScreenControl,
      liveMode,
    } = this.props;

    const { center, ...controlBar } = theme;

    return (
      <SafeAreaView
        style={styles.container}
        edges={['right', 'bottom', 'left', 'top']}
      >
        <Touchable
          onPress={() => this.hideControls()}
          style={{ borderColor: 'red', borderWidth: 1 }}
        >
          <Animated.View
            style={[
              styles.container,
              { opacity: this.animControls },
              // fullscreen ? { marginLeft: 20, marginRight: 50 } : {},
            ]}
          >
            {fullscreen && (
              <TopBar
                title={title}
                logo={logo}
                more={more}
                onMorePress={() => onMorePress()}
                theme={{ title: theme.title, more: theme.more }}
                onBackPress={() => onBackPress()}
              />
            )}
            <View style={[styles.flex, { flexDirection: 'row' }]}>
              {/* <Animated.View
              style={[styles.flex, { transform: [{ scale: this.scale }] }]}> */}
              {liveMode ? (
                <View style={{ flex: 1 }} />
              ) : (
                <PlayButton
                  onPress={() => this.props.togglePlay()}
                  paused={paused}
                  theme={center}
                />
              )}
              {/* </Animated.View> */}
            </View>
            <ControlBar
              toggleFS={() => this.props.toggleFS()}
              // paused={paused}
              fullscreen={fullscreen}
              onSeek={this.onSeek}
              onSeekRelease={this.onSeekRelease}
              progress={progress}
              currentTime={currentTime}
              duration={duration}
              theme={controlBar}
              inlineOnly={inlineOnly}
              hideFullScreenControl={hideFullScreenControl}
              liveMode={liveMode}
            />
          </Animated.View>
        </Touchable>
      </SafeAreaView>
    );
  }

  render() {
    if (this.props.loading) {
      return this.loading();
    }
    // if (this.props.liveMode) {
    //   return null;
    // }
    if (this.state.hideControls) {
      return this.hiddenControls();
    }
    return this.displayedControls();
  }
}

export { Controls };
