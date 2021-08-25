import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  // BackHandler,
  // Animated,
  Image,
  // Alert,
  AppState,
  AppStateStatus,
  ScaledSize,
} from 'react-native';
import VideoPlayer, {
  LoadError,
  OnLoadData,
  OnProgressData,
} from 'react-native-video';
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import { Controls } from './Controls';
import { checkSource } from './utils';
import { PlayerContainer, VideoPlayerContainerProps } from './PlayerContainer';
import type {
  PlayerContainerFullScreenMode,
  PlayerState,
  SelectedTextTrack,
  TextTrack,
} from './types';

const Win = Dimensions.get('window');

const offset = new Date().getTimezoneOffset();
const timeDiff = offset * 60000; // in milliseconds

export const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    height: undefined,
    width: undefined,
    zIndex: 99,
  },
});

const defaultTheme = {
  title: '#FFF',
  more: '#FFF',
  center: '#FFF',
  fullscreen: '#FFF',
  back: '#FFF',
  volume: '#FFF',
  scrubberThumb: '#FFF',
  scrubberBar: '#FFF',
  seconds: '#FFF',
  duration: '#FFF',
  progress: '#FFF',
  loading: '#FFF',
};

type VideoTheme = {
  title: string;
  more: string;
  center: string;
  fullscreen: string;
  back: string;
  volume: string;
  scrubberThumb: string;
  scrubberBar: string;
  seconds: string;
  duration: string;
  progress: string;
  loading: string;
};

export type PlayerProps = {
  textTracks?: Array<TextTrack>;
  selectedTextTrack?: SelectedTextTrack;
};

export type LiveInfo = {
  startTime: number;
  duration: number;
};

export type VideoProps = VideoPlayerContainerProps & {
  url: string;
  placeholder: string | number;
  cover: string;
  loop?: boolean;
  autoPlay?: boolean;
  hideFullScreenControl: boolean;
  playInBackground?: boolean;
  playWhenInactive?: boolean;
  onEnd: () => void;
  onLoadStart: () => void;
  onLoad: (data: OnLoadData) => void;
  onPlay: (playing: boolean) => void;
  onError: (err: LoadError) => void;
  onProgress: (data: OnProgressData) => void;
  onMorePress: () => void;
  onBackFromFS: () => void;
  onFullScreen: (fs: boolean) => void;
  // onTimedMetadata?: () => void;
  rate?: number;
  volume?: number;
  logo?: string;
  title: string;
  theme: VideoTheme;
  resizeMode?: 'stretch' | 'contain' | 'cover' | 'none';
  controlDuration: number;
  playerProps: PlayerProps;
  liveMode: boolean;
  liveInfo?: LiveInfo;
};

type VideoState = {
  playerState: PlayerState;
  fullScreen: boolean;
  fulllScreenMode: PlayerContainerFullScreenMode;
  inlineWidth: number;
  inlineHeight: number;
  paused: boolean;
  muted: boolean;
  loading: boolean;
  duration: number;
  progress: number;
  currentTime: number;
  seeking: boolean;
  renderError: boolean;
};

class Video extends Component<VideoProps, VideoState> {
  static defaultProps = {
    placeholder: undefined,
    cover: undefined,
    style: {},
    // error: true,
    loop: false,
    autoPlay: false,
    inlineOnly: false,
    fullScreenOnly: false,
    playInBackground: false,
    playWhenInactive: false,
    rotateToFullScreen: false,
    lockPortraitOnFsExit: false,
    onEnd: () => {},
    onLoadStart: () => {},
    onLoad: () => {},
    onPlay: () => {},
    onError: () => {},
    onProgress: () => {},
    onMorePress: undefined,
    onBackFromFS: undefined,
    onFullScreen: () => {},
    // onTimedMetadata: () => { },
    rate: 1,
    volume: 1,
    lockRatio: undefined,
    logo: undefined,
    title: '',
    theme: defaultTheme,
    resizeMode: 'contain',
    controlDuration: 3,
    playerProps: {},
    liveMode: false,
  };

  player: VideoPlayer | null;
  liveTimer: ReturnType<typeof setInterval> | null = null;

  constructor(props: VideoProps) {
    super(props);
    this.state = {
      playerState: 'init',
      paused: !props.autoPlay,
      muted: false,
      fullScreen: !!props.fullScreenOnly,
      fulllScreenMode: 'auto',
      inlineWidth: Win.width,
      inlineHeight: Win.width * 0.5625,
      loading: false,
      duration: 0,
      progress: 0,
      currentTime: 0,
      seeking: false,
      renderError: false,
    };

    this.player = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps: VideoProps) {
    if (this.props.url && this.props.url !== nextProps.url) {
      this.setState({ renderError: false });
    }
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.onRotated);
    // BackHandler.addEventListener('hardwareBackPress', this.onBackKeyPress);
    AppState.addEventListener('change', this.onAppStateChanged);

    if (this.props.liveMode) {
      setInterval(() => {
        this.updateLiveProgress();
      }, 1000);
    }
  }

  componentWillUnmount() {
    deactivateKeepAwake();

    Dimensions.removeEventListener('change', this.onRotated);
    // BackHandler.removeEventListener('hardwareBackPress', this.onBackKeyPress);
    AppState.removeEventListener('change', this.onAppStateChanged);

    if (this.props.liveMode && this.liveTimer) {
      clearInterval(this.liveTimer);
    }
  }

  onAppStateChanged = (state: AppStateStatus) => {
    if (state !== 'active') {
      this.setState({ paused: true });
    }
  };

  onLoadStart() {
    this.props.onLoadStart();
    this.setState({ paused: true, loading: true, playerState: 'loading' });
  }

  onLoad(data: OnLoadData) {
    if (!this.state.loading) {
      return;
    }
    this.props.onLoad(data);

    const toPause = !(
      this.props.autoPlay && AppState.currentState === 'active'
    );
    this.setState(
      {
        paused: toPause,
        loading: false,
        playerState: 'loaded',
      },
      () => {
        // maybe not right....
        this.props.onPlay(!this.state.paused);
        if (!this.state.paused) {
          activateKeepAwake();
        }
        // TODO: check video natrual ratio and update display
      }
    );
    if (!this.props.liveMode) {
      this.setState({
        duration: data.duration,
      });
    }
  }

  // onBuffer() {
  //   // console.log('buffering')
  //   this.setState({ loading: true, paused: true })
  // }

  onEnd() {
    this.props.onEnd();
    const { loop } = this.props;
    if (!loop) {
      this.pause();
    }
    this.onSeekRelease(0);
    this.setState({ currentTime: 0 });
  }

  onRotated = (dim: { window: ScaledSize; screen: ScaledSize }) => {
    console.debug('Video.onRotated', dim);
    const { height, width } = dim.screen;
    // Add this condition incase if inline and fullscreen options are turned on
    if (this.props.inlineOnly) {
      return;
    }
    const orientation = width > height ? 'LANDSCAPE' : 'PORTRAIT';
    if (this.props.rotateToFullScreen) {
      if (orientation === 'PORTRAIT') {
        this.setState(
          { paused: this.props.fullScreenOnly || this.state.paused },
          () => {
            if (this.props.fullScreenOnly) {
              this.props.onPlay(!this.state.paused);
            }
          }
        );
      } else {
        this.setState({ fulllScreenMode: 'auto' });
      }
    }
  };

  onSeekRelease(percent: number) {
    if (this.props.liveMode) return;
    const seconds = percent * this.state.duration;
    this.setState({ progress: percent, seeking: false }, () => {
      if (this.player) this.player.seek(seconds);
    });
  }

  onError(msg: LoadError) {
    this.props.onError(msg);
    this.setState({ renderError: true });
  }

  onBackFromFS() {
    const { onBackFromFS } = this.props;
    if (onBackFromFS) {
      onBackFromFS();
    }
  }

  // onBackKeyPress = () => {
  //   if (this.state.fullScreen && !this.props.fullScreenOnly) {
  //     this.setState({ fullScreen: false }, () => {
  //       if (this.props.fullScreenOnly && !this.state.paused) {
  //         this.togglePlay();
  //       }
  //     });
  //     return true;
  //   }
  //   return false;
  // };

  pause() {
    if (!this.state.paused) {
      this.togglePlay();
    }
  }

  play() {
    if (this.state.paused) {
      this.togglePlay();
    }
  }

  togglePlay() {
    this.setState({ paused: !this.state.paused }, () => {
      this.props.onPlay(!this.state.paused);
      if (!this.state.paused) {
        activateKeepAwake();
      } else {
        deactivateKeepAwake();
      }
    });
  }

  setFullScreen() {
    if (this.state.fulllScreenMode === 'forceInline') return;
    this.setState({ fulllScreenMode: 'forceFS' });
  }

  toggleMute() {
    this.setState({ muted: !this.state.muted });
  }

  seek(percent: number) {
    if (this.props.liveMode) return;
    const currentTime = percent * this.state.duration;
    this.setState({ seeking: true, currentTime });
  }

  seekTo(seconds: number) {
    if (this.props.liveMode) return;
    const percent = seconds / this.state.duration;
    if (seconds > this.state.duration) {
      console.warn(
        `Current time (${seconds}) exceeded the duration ${this.state.duration}`
      );
      return false;
    }
    return this.onSeekRelease(percent);
  }

  progress(time: OnProgressData) {
    if (this.props.liveMode) return;

    const { currentTime } = time;
    const progress = currentTime / this.state.duration;
    if (!this.state.seeking) {
      this.setState({ progress, currentTime }, () => {
        this.props.onProgress(time);
      });
    }
  }

  updateLiveProgress = () => {
    const { liveInfo, liveMode } = this.props;
    if (liveMode && liveInfo) {
      const { startTime, duration } = liveInfo;
      const n = Date.now();
      const progress = (n - startTime) / duration;
      this.setState({
        progress,
        currentTime: (n - timeDiff) / 1000,
        duration: duration / 1000,
      });
    } else {
      const n = (Date.now() - timeDiff) / 1000;
      this.setState({ progress: 0, currentTime: n, duration: 0 });
    }
  };

  onFullScreen = (fullScreen: boolean) => {
    console.debug('onFullScreen', fullScreen);
    this.setState({ fullScreen });
    if (!fullScreen && this.props.fullScreenOnly) {
      this.setState({ paused: true }, () =>
        this.props.onPlay(!this.state.paused)
      );
    }

    this.props.onFullScreen(fullScreen);
  };

  renderError() {
    const { style, inlineOnly, fullScreenOnly, lockPortraitOnFsExit } =
      this.props;
    const { fulllScreenMode, playerState } = this.state;
    const textStyle = { color: 'white', padding: 10 };
    return (
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (
          <PlayerContainer
            style={style}
            playerState={playerState}
            inlineOnly={inlineOnly}
            fullScreenOnly={fullScreenOnly}
            fulllScreenMode={fulllScreenMode}
            lockPortraitOnFsExit={lockPortraitOnFsExit}
            insets={insets}
            onFullScreen={this.onFullScreen}
          >
            <Text style={textStyle}>Retry</Text>
            <Icons
              name="replay"
              size={60}
              color={this.props.theme.title}
              onPress={() => this.setState({ renderError: false })}
            />
          </PlayerContainer>
        )}
      </SafeAreaInsetsContext.Consumer>
    );
  }

  renderPlayer() {
    const {
      fullScreen,
      fulllScreenMode,
      paused,
      muted,
      loading,
      progress,
      duration,
      inlineHeight,
      inlineWidth,
      currentTime,
      playerState,
    } = this.state;

    const {
      url,
      loop,
      title,
      logo,
      rate,
      style,
      volume,
      placeholder,
      // cover,
      theme,
      // onTimedMetadata,
      resizeMode,
      onMorePress,
      // onBackPress,
      inlineOnly,
      fullScreenOnly,
      rotateToFullScreen,
      playInBackground,
      playWhenInactive,
      controlDuration,
      hideFullScreenControl,
      playerProps,
      liveMode,
      lockPortraitOnFsExit,
    } = this.props;

    const setTheme = {
      ...defaultTheme,
      ...theme,
    };

    return (
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (
          <PlayerContainer
            style={style}
            playerState={playerState}
            inlineOnly={inlineOnly}
            fullScreenOnly={fullScreenOnly}
            fulllScreenMode={fulllScreenMode}
            onFullScreen={this.onFullScreen}
            rotateToFullScreen={rotateToFullScreen}
            lockPortraitOnFsExit={lockPortraitOnFsExit}
            insets={insets}
          >
            <StatusBar hidden={fullScreen} />
            {((loading && placeholder) || currentTime < 0.01) && (
              <Image
                resizeMode="contain"
                style={styles.image}
                {...checkSource(placeholder)}
              />
            )}
            <VideoPlayer
              source={{ uri: url }}
              paused={paused}
              resizeMode={resizeMode}
              repeat={loop}
              style={
                fullScreen
                  ? styles.fullScreen
                  : {
                      height: inlineHeight,
                      width: inlineWidth,
                      alignSelf: 'stretch',
                    }
              }
              ref={(ref) => {
                this.player = ref;
              }}
              rate={rate}
              volume={volume}
              muted={muted}
              playInBackground={playInBackground} // Audio continues to play when app entering background.
              playWhenInactive={playWhenInactive} // [iOS] Video continues to play when control or notification center are shown.
              // progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms)
              onLoadStart={() => this.onLoadStart()} // Callback when video starts to load
              onLoad={(e) => this.onLoad(e)} // Callback when video loads
              onProgress={(e) => this.progress(e)} // Callback every ~250ms with currentTime
              onEnd={() => this.onEnd()}
              onError={(e) => this.onError(e)}
              // onBuffer={() => this.onBuffer()} // Callback when remote video is buffering
              // onTimedMetadata={(e) => onTimedMetadata(e)} // Callback when the stream receive some metadata
              ignoreSilentSwitch="ignore"
              {...playerProps}
            />
            <Controls
              playerState={playerState}
              toggleFS={() => this.setFullScreen()}
              togglePlay={() => this.togglePlay()}
              paused={paused}
              fullscreen={fullScreen}
              loading={loading}
              onSeek={(val) => this.seek(val)}
              onSeekRelease={(pos) => this.onSeekRelease(pos)}
              progress={progress}
              currentTime={currentTime}
              duration={duration}
              logo={logo}
              title={title}
              more={!!onMorePress}
              onMorePress={() => onMorePress()}
              onBackPress={() => this.onBackFromFS()}
              theme={setTheme}
              inlineOnly={inlineOnly}
              controlDuration={controlDuration}
              hideFullScreenControl={hideFullScreenControl}
              liveMode={liveMode}
            />
          </PlayerContainer>
        )}
      </SafeAreaInsetsContext.Consumer>
    );
  }

  render() {
    if (this.state.renderError) {
      return this.renderError();
    }
    return this.renderPlayer();
  }
}

export default Video;
