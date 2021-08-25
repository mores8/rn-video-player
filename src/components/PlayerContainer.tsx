import React, { Component } from 'react';
import {
  Dimensions,
  Animated,
  StyleProp,
  ViewStyle,
  StyleSheet,
  StatusBar,
  Platform,
  // BackHandler,
  ScaledSize,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import type { EdgeInsets } from 'react-native-safe-area-context';
import type { PlayerState, PlayerContainerFullScreenMode } from './types';

const backgroundColor = '#000';

export const styles = StyleSheet.create({
  background: {
    alignItems: 'center',
    backgroundColor,
    justifyContent: 'center',
    zIndex: 98,
  },
  // fullScreen: {
  //   ...StyleSheet.absoluteFillObject,
  // },
});

const Win = Dimensions.get('window');

const DEVICE_HEIGHT = Dimensions.get('screen').height;
const STATUS_BAR = StatusBar.currentHeight || 24;
const WINDOW_HEIGHT = Win.height;
const NAVBAR_HEIGHT = DEVICE_HEIGHT - STATUS_BAR - WINDOW_HEIGHT;
const extraFSWidth = Platform.OS === 'android' ? NAVBAR_HEIGHT : 0;

export type VideoPlayerContainerProps = {
  fullScreenOnly?: boolean;
  inlineOnly: boolean;
  rotateToFullScreen?: boolean;
  lockPortraitOnFsExit?: boolean;
  lockRatio?: number;
  style?: StyleProp<ViewStyle>;
};

type PlayerContainerProps = VideoPlayerContainerProps & {
  children: React.ReactNode;
  playerState: PlayerState;
  insets: EdgeInsets | null;
  fulllScreenMode: PlayerContainerFullScreenMode;
  onFullScreen: (fullscreen: boolean) => void;
};

type Dim = {
  width: number;
  height: number;
};

type PlayerContainerState = {
  inlineDim: Dim;
  dim: Dim;
  fullScreen: boolean;
};

export class PlayerContainer extends Component<
  PlayerContainerProps,
  PlayerContainerState
> {
  static defaultProps = {
    fullScreenOnly: false,
    inlineOnly: false,
    rotateToFullScreen: false,
    lockPortraitOnFsExit: false,
    lockRatio: undefined,
  };

  animHeight: Animated.Value;
  animWidth: Animated.Value;

  constructor(props: PlayerContainerProps) {
    super(props);
    const initDim = { width: Win.width, height: Win.width * 0.5625 };
    this.state = {
      // 16: 9
      dim: initDim,
      inlineDim: initDim,
      fullScreen: false,
    };

    this.animHeight = new Animated.Value(initDim.height);
    this.animWidth = new Animated.Value(initDim.width);
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.onRotated);
    // BackHandler.addEventListener('hardwareBackPress', this.onBack);

    if (this.props.fullScreenOnly) {
      this.setState({ fullScreen: true }, () => {
        // const { height, width } = this.getInitFSDim();
        // this.gotoFS(height, width, false, 0);
      });
    }
  }

  componentWillUnmount() {
    // BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    Dimensions.removeEventListener('change', this.onRotated);
  }

  componentDidUpdate(
    prevProps: PlayerContainerProps,
    prevState: PlayerContainerState
  ) {
    const { playerState, fulllScreenMode, insets, onFullScreen } = this.props;
    const { fullScreen } = this.state;
    if (playerState !== prevProps.playerState) {
      switch (playerState) {
        case 'loading':
          this.onLoadStart();
          return;
        case 'loaded':
          // TODO:
          return;
        case 'playing':
          this.onPlay(true);
          return;
        case 'paused':
          this.onPlay(false);
          return;
      }
    }
    if (fulllScreenMode !== prevProps.fulllScreenMode) {
      if (fulllScreenMode === 'forceFS') {
        // Note: the parent of video should reset to auto mode after rotation
        Orientation.lockToLandscape();
        this.setState({ fullScreen: true });
      } else if (fulllScreenMode === 'forceInline') {
        // Note: the parent of video should reset to auto mode after rotation
        Orientation.lockToPortrait();
        this.setState({ fullScreen: false });
      }
    }
    if (insets !== prevProps.insets) {
      console.debug('insets changed', insets);
    }
    if (fullScreen !== prevState.fullScreen) {
      // kick off animation after state changed.
      console.debug('fullScreen: ', fullScreen);
      if (fullScreen) {
        this.gotoFullScreen();
        // this.gotoFS(height, width - this.getFSHorizontalPadding();
      } else {
        this.gotoInline();
      }
      onFullScreen(fullScreen);
    }
  }

  getFSHorizontalPadding() {
    const { insets, rotateToFullScreen } = this.props;
    if (rotateToFullScreen) {
      const padding = insets ? insets.left + insets.right : 0;
      return padding;
    }
    return 0;
  }

  getFSVerticalPadding() {
    const { insets, rotateToFullScreen } = this.props;
    if (rotateToFullScreen) {
      return 0;
    }
    const padding = insets ? insets.top + insets.bottom : 0;
    return padding;
  }

  getInitFSDim = () => {
    if (this.props.rotateToFullScreen) {
      const height = Win.height > Win.width ? Win.width : Win.height;
      const width =
        (Win.height > Win.width ? Win.height : Win.width) -
        this.getFSHorizontalPadding();
      return { height, width };
    }
    return {
      height: Win.height - this.getFSVerticalPadding(),
      width: Win.width,
    };
  };

  onLoadStart() {
    if (this.props.fullScreenOnly) {
      if (this.props.rotateToFullScreen) {
        Orientation.lockToLandscape();
      } else {
        Orientation.lockToPortrait();
      }
    }
  }

  onRotated = (dim: { window: ScaledSize; screen: ScaledSize }) => {
    console.debug(
      'PlayerContainer.onRotated',
      dim,
      this.props.inlineOnly,
      this.props.rotateToFullScreen
    );
    const { height, width } = dim.window;
    // Add this condition incase if inline and fullscreen options are turned on
    if (this.props.inlineOnly) {
      return;
    }
    const orientation = width > height ? 'LANDSCAPE' : 'PORTRAIT';
    if (this.props.rotateToFullScreen) {
      if (orientation === 'LANDSCAPE' && !this.state.fullScreen) {
        this.setState({ fullScreen: true }, () => {
          // this.gotoFS(height, width - this.getFSHorizontalPadding());
        });
        return;
      }
      if (orientation === 'PORTRAIT' && this.state.fullScreen) {
        this.setState({ fullScreen: false }, () => {
          // this.gotoInline();
        });
      }
    } else {
      // this.animToInline();
    }
    // if (this.state.fullScreen) {
    //   this.gotoFS(height - this.getFSVerticalPadding(), width);
    // }
  };

  // onBack = () => {
  //   this.gotoInline(this.props.rotateToFullScreen);
  //   // setTimeout(() => {
  //   //   if (!this.props.lockPortraitOnFsExit) {
  //   //     Orientation.unlockAllOrientations();
  //   //   }
  //   // }, 1500);
  //   return false;
  // }

  onPlay = (paused: boolean) => {
    if (this.props.inlineOnly) {
      return;
    }
    if (!paused) {
      if (this.props.fullScreenOnly && !this.state.fullScreen) {
        this.setState({ fullScreen: true });
      }
    }
  };

  animToInline(newHeight?: number, newWidth?: number) {
    const { height, width } = this.state.inlineDim;
    const _height = newHeight || height;
    const _width = newWidth || width;
    // console.log('animToInline', height, width);
    Animated.parallel([
      Animated.timing(this.animHeight, {
        toValue: _height,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(this.animWidth, {
        toValue: _width,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  }

  animToFullscreen(height: number, width: number, duration: number) {
    // console.log('animToFullscreen', height, width);
    Animated.parallel([
      Animated.timing(this.animHeight, {
        toValue: height,
        duration: duration,
        useNativeDriver: false,
      }),
      Animated.timing(this.animWidth, {
        toValue: width,
        duration: duration,
        useNativeDriver: false,
      }),
    ]).start();
  }

  gotoFullScreen = () => {
    Orientation.getOrientation((orientation) => {
      const initialOrient = Orientation.getInitialOrientation();
      if (orientation !== initialOrient) {
        this.gotoFS(
          Win.width,
          Win.height - this.getFSHorizontalPadding() + extraFSWidth,
          this.props.rotateToFullScreen
        );
      } else {
        this.gotoFS(
          Win.height - this.getFSVerticalPadding(),
          Win.width,
          this.props.rotateToFullScreen
        );
      }
    });
  };

  gotoFS = (height: number, width: number, lock?: boolean, delay = 200) => {
    console.debug('gotoFS', height, width, lock, delay);
    this.animToFullscreen(height, width, delay);
    // if (lock) Orientation.lockToLandscape();
  };

  gotoInline = (lock?: boolean) => {
    console.debug('gotoInline', lock);
    this.animToInline();
    this.props.onFullScreen(false);
    if (lock) Orientation.lockToPortrait();
  };

  render() {
    const { style } = this.props;
    const { fullScreen } = this.state;
    return (
      <Animated.View
        style={[
          styles.background,
          {
            height: this.animHeight,
            width: this.animWidth,
          },
          fullScreen ? null : style,
        ]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
