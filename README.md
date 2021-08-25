# rn-video-player

React Native video player & controls UI

![Demo](https://github.com/mores8/rn-video-player/raw/main/doc/screenshot.gif)

## Installation

1. Install the required packages in your React Native project:

    ```sh
    npm install react-native-video react-native-linear-gradient react-native-orientation-locker react-native-safe-area-context react-native-vector-icons @react-native-community/slider @sayem314/react-native-keep-awake 
    ```

    From React Native 0.60 and higher, [linking is automatic](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md). So you don't need to run react-native link.

    For iOS, install pods to complete the linking.

    ```sh
    npx pod-install ios
    ```

    Note: *react-native-vector-icons* requires [additional steps](https://github.com/oblador/react-native-vector-icons#installation) for installation.

2. Install rn-video-player

    ```sh
    npm install @mores8/rn-video-player
    ```

## Usage

```jsx
import VideoPlayer from "@mores8/rn-video-player";

<VideoPlayer
    style={{height: ,width: 320}}
    url={sampleUrl}
/>
```

Check out the [example project](https://github.com/mores8/rn-video-player/tree/main/example) for more examples.

## Props

Prop                  | Type     | Required | Default                   | Description
--------------------- | -------- | -------- | ------------------------- | -----------
url                   | string, number | Yes |                          | A URL string (or number for local) is required.
autoPlay              | bool     | No       | false                     | Autoplays the video as soon as it's loaded
loop                  | bool     | No       | false                     | Allows the video to continuously loop
title                 | string   | No       | ''                        | Adds a title of your video at the top of the player
placeholder           | string   | No       | undefined                 | Adds an image placeholder while it's loading and stopped at the beginning
logo                  | string   | No       | undefined                 | Adds an image logo at the top left corner of the video
theme                 | string   | No       | 'white'                   | Adds an optional theme colour to the players controls
hideFullScreenControl | bool     | No       | false                     | This hides the full screen control
style                 | View.style | No     | undefined                        | Apply styles directly to the Video player (ignored in fullscreen mode)
resizeMode            | string   | No       | 'contain'                 | Fills the whole screen at aspect ratio. contain, cover etc
rotateToFullScreen    | bool     | No       | false                     | Tapping the fullscreen button will rotate the screen. Also rotating the screen will automatically switch to fullscreen mode
fullScreenOnly        | bool     | No       | false                     | This will play only in fullscreen mode
inlineOnly            | bool     | No       | false                     | This hides the fullscreen button and only plays the video in inline mode
playInBackground      | bool     | No       | false                     | Audio continues to play when app enters background.
playWhenInactive      | bool     | No       | false                     | [iOS] Video continues to play when control or notification center are shown.
rate                  | number   | No       | 1                         | Adjusts the speed of the video. 0 = stopped, 1.0 = normal
volume                | number   | No       | 1                         | Adjusts the volume of the video. 0 = mute, 1.0 = full volume
onMorePress           | function | No       | undefined                 | Adds an action button at the top right of the player. Use this callback function for your own use. e.g share link
onFullScreen          | function | No       | (value) => {}             | Returns the fullscreen status whenever it toggles. Useful for situations like react navigation.
lockPortraitOnFsExit  | bool     | No       | false                     | Keep Portrait mode locked after Exiting from Fullscreen mode
lockRatio             | number   | No       | undefined                 | Force a specific ratio to the Video player. e.g. lockRatio={16 / 9}
onLoad                | function | No       | (data) => {}              | Returns data once video is loaded
onProgress            | function | No       | (progress) => {}          | Returns progress data
onEnd                 | function | No       | () => {}                  | Invoked when video finishes playing  
onError               | function | No       | (error) => {}             | Returns an error message argument
onPlay                | function | No       | (playing) => {}           | Returns a boolean during playback
controlDuration       | number   | No       | 3                         | Set the visibility time of the pause button and the progress bar after the video was started

## Example

```jsx
import * as React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import VideoPlayer from "@mores8/rn-video-player";

const sampleUrl = 'url to video content';
function App() {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const containerStyle = {
    flex: 1,
    height: windowHeight,
    width: windowWidth,
  };

  return (
    <View style={containerStyle}>
      <VideoPlayer
        autoPlay
        style={{height: '100%',width: '100%'}}
        url={sampleUrl}
        hideFullScreenControl={false}
        rotateToFullScreen={true}
      />
    </View>
  );
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
