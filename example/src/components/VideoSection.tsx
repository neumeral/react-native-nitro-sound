import { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Video, { type VideoRef } from 'react-native-video';

type Props = {
  mountVideo: boolean;
  paused: boolean;
  onPausedChange: (p: boolean) => void;
  disableAudioSessionManagement: boolean;
};

const mmssss = (milisecs: number) => {
  const totalSeconds = Math.floor(milisecs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centis = Math.floor((milisecs % 1000) / 10);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}:${pad(centis)}`;
};

export default function VideoSection({
  mountVideo,
  paused,
  onPausedChange,
  disableAudioSessionManagement,
}: Props) {
  const videoRef = useRef<VideoRef | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoPosition, setVideoPosition] = useState(0);

  if (!mountVideo) return null;

  return (
    <View style={styles.videoWrap}>
      <Video
        ref={(r) => {
          videoRef.current = r;
        }}
        source={require('../../public/veo.mp4')}
        style={styles.video}
        resizeMode="contain"
        paused={paused}
        repeat={false}
        disableFocus={false}
        disableAudioSessionManagement={disableAudioSessionManagement}
        controls
        onLoad={(meta) => {
          setVideoDuration(meta.duration ?? 0);
        }}
        onProgress={(p) => {
          setVideoPosition(p.currentTime ?? 0);
        }}
        onEnd={() => {
          onPausedChange(true);
        }}
      />

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, !paused && styles.btnDisabled]}
          onPress={() => onPausedChange(false)}
          disabled={!paused}
        >
          <Text style={styles.btnTxt}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, paused && styles.btnDisabled]}
          onPress={() => onPausedChange(true)}
          disabled={paused}
        >
          <Text style={styles.btnTxt}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            videoRef.current?.seek(0);
            onPausedChange(false);
          }}
        >
          <Text style={styles.btnTxt}>Restart</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.small}>
        {mmssss(Math.floor(videoPosition * 1000))} /{' '}
        {mmssss(Math.floor(videoDuration * 1000))}
      </Text>
      <Text style={styles.note}>
        To reproduce the iOS session issue, keep this mode on
        (react-native-video) and try recording.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  videoWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 },
  btn: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  btnDisabled: { opacity: 0.6 },
  btnTxt: { color: 'white' },
  small: { fontSize: 12, color: '#555', marginTop: 6 },
  note: { fontSize: 12, color: '#666', marginTop: 8 },
});
