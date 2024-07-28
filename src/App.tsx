import React, {Component} from 'react';
import * as Tone from 'tone';
import { stop_sound, play_sound,play_burst } from './sound';
import { FrequencyRecorder } from './FrequencyRecorder';
import { AudioRecorder } from 'react-audio-voice-recorder';

type AppState = {
  osc: Tone.Oscillator,
  play_time: number,
  sound_playing: boolean
}

export class App extends Component<{}, AppState> {

  constructor(args: {}) {
    super(args);

    this.state = {osc: new Tone.Oscillator(440, "square").toDestination(), play_time: 1000, sound_playing: false}
  }

  render(): React.ReactNode {
    return <div>
      <section>
        <header>Play Sound</header>
        <button onClick={this.doToggleSound}>toggle Sound</button>
        <button onClick={this.doOneSecBurst}>One sec burst</button>
      </section>

      <section>
        <header>Recording</header>
        <AudioRecorder 
          onRecordingComplete={this.addAudioElement}
          audioTrackConstraints={{
            noiseSuppression: true,
            echoCancellation: true,
          }} 
          downloadOnSavePress={true}
          downloadFileExtension="wav"
          showVisualizer={true}
        />
        <FrequencyRecorder/>
      </section>
    </div>
  }

  doToggleSound = ():void => {
    if (!this.state.sound_playing) {
      this.setState({sound_playing: true})
      play_sound(this.state.osc)
    }
    else {
      this.setState({sound_playing: false})
      stop_sound(this.state.osc)
    }
  }

  doOneSecBurst = async ():Promise<void> => {
    if (!this.state.sound_playing) {
      this.setState({sound_playing: true})
      await play_burst(this.state.osc, this.state.play_time);
      this.setState({sound_playing: false})
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