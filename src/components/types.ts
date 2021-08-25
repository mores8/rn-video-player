export type PlayerContainerFullScreenMode = 'forceFS' | 'forceInline' | 'auto';

export type PlayerState =
  | 'init'
  | 'loading'
  | 'loaded'
  | 'buffering'
  | 'playing'
  | 'paused'
  | 'stopped'
  | 'error';

export interface TextTrack {
  title?: string;
  language?: string;
  type: 'application/x-subrip' | 'application/ttml+xml' | 'text/vtt';
  uri: string;
}

export type SelectedTextTrack = {
  type: 'system' | 'disabled' | 'title' | 'language' | 'index';
  value?: string | number;
};

export interface VideoTextTrack {
  index: number;
  title: string;
  language: string;
  type: string;
}
