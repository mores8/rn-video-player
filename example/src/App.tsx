import * as React from 'react';

import { StyleSheet, View, useWindowDimensions } from 'react-native';
import VideoPlayer from '@mores8/rn-video-player';

const sampleUrl =
  'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';

export default function App() {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const onBack = React.useCallback(() => {
    console.log('onBack');
  }, []);
  const onLoad = React.useCallback(() => {
    console.log('onLoad');
  }, []);
  const onPlay = React.useCallback((playing: boolean) => {
    console.log('onPlay', playing);
  }, []);
  const onError = React.useCallback(() => {
    console.log('onError');
  }, []);
  const onEnd = React.useCallback(() => {
    console.log('onEnd');
  }, []);

  const containerStyle = {
    flex: 1,
    height: windowHeight,
    width: windowWidth,
  };

  return (
    <View style={containerStyle}>
      <VideoPlayer
        autoPlay
        // fullScreenOnly={true}
        style={styles.videoPlayer}
        url={sampleUrl}
        title={'Example Video'}
        // logo={logo}
        // cover={coverImg}
        // placeholder={placeholderImg}
        hideFullScreenControl={false}
        rotateToFullScreen={true}
        onBackFromFS={onBack}
        // playerProps={playerProps}
        onLoadStart={() => {
          console.log('onLoadStart');
        }}
        onLoad={onLoad}
        onPlay={onPlay}
        onError={onError}
        onEnd={onEnd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlayer: {
    height: '100%',
    width: '100%',
  },
});
