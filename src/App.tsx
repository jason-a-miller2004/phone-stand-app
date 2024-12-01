import React, {Component} from 'react';
import * as Tone from 'tone';
import { play_sound, stop_sound, play_constant_burst, initSound } from './sound';
import { FrequencyRecorder } from './FrequencyRecorder';
import { AudioRecorder } from 'react-audio-voice-recorder';

type AppState = {
  osc: Tone.Oscillator,
  sound_playing: boolean
}

export class App extends Component<{}, AppState> {
  constructor(args: {}) {
    super(args);

    this.state = {osc: new Tone.Oscillator(18000, "square").toDestination(), sound_playing: false}
  }

  render(): React.ReactNode {
    initSound()

    return <div>
      
      <section>
        <header>Play Sound</header>
        <button onClick={this.doToggleSound}>toggle Sound</button>
        <button onClick={this.doConstantBurst}>const burst</button>
      </section>

      <section>
        <header>Recording</header>
        <AudioRecorder 
          onRecordingComplete={this.addAudioElement}
          audioTrackConstraints={{
            noiseSuppression: false,
            echoCancellation: false,
          }} 
          downloadOnSavePress={true}
          downloadFileExtension="wav"
          showVisualizer={true}
        />
        <FrequencyRecorder/>
      </section>
    </div>
  }

  doToggleSound = (): void => {
    // First, toggle sound_playing to true if it isn't already
    if (!this.state.sound_playing) {
      this.setState({ sound_playing: true }, () => {
        play_sound(this, this.state.osc);
      });
    } else {
      // If sound is playing, toggle it off
      this.setState({ sound_playing: false }, () => {
        stop_sound(this.state.osc);
      });
    }
  };


  doConstantBurst = () => {
    // First, toggle sound_playing to true if it isn't already
    if (!this.state.sound_playing) {
      this.setState({ sound_playing: true }, () => {
        play_constant_burst(this);
      });
    } else {
      // If sound is playing, toggle it off
      this.setState({ sound_playing: false });
    }
  }

  addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  };
}