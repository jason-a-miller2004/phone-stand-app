import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { sleep } from './sound';
import { DataRecorder } from './DataRecorder';

// Register necessary Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type RecordState = {
  graphing: boolean,
  microphone: boolean,
  freqData: Uint8Array,
  analyser: AnalyserNode | undefined,
  source: MediaStreamAudioSourceNode | undefined,
  recorder: DataRecorder
};

export class Record extends Component<{}, RecordState> {

  constructor(args: {}) {
    super(args);
    this.state = {
                    microphone: false,
                    graphing: false,
                    freqData: new Uint8Array(128),
                    analyser: undefined,
                    source: undefined,
                    recorder: new DataRecorder()
                  };
  }

  componentDidUpdate(prevProps: {}, prevState: RecordState) {
    if (this.state.microphone && !prevState.microphone) {
      this.startMicrophone();
    }
  }

  startMicrophone = async (): Promise<void> => {
    const constraints = { audio: true };
    const audioCtx = new AudioContext();

    try {
      await audioCtx.audioWorklet.addModule("./TimeDomainProcessor.js");
      const TimeDomainNode = new AudioWorkletNode(
        audioCtx,
        "time-domain-processor",
      );
      const analyser = audioCtx.createAnalyser();
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.connect(TimeDomainNode);
      analyser.fftSize = 1024;
      analyser.minDecibels = -80;
      analyser.smoothingTimeConstant = 0.3;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      this.setState({ analyser, source }, () => this.updateGraph(analyser, dataArray));
    } catch (err) {
      console.error("The following gUM error occurred: " + err);
    }
  }

  updateGraph = async (analyser: AnalyserNode, dataArray: Uint8Array): Promise<void> => {
    while (this.state.graphing) {
      analyser.getByteFrequencyData(dataArray);
      this.setState(() => ({ freqData: new Uint8Array(dataArray) }));
      await sleep(50);
    }
  }

  toggleGraphing = (): void => {
    this.setState((state) => ({ graphing: !state.graphing, microphone: (!this.state.graphing || this.state.recorder.getRecording())}));
  }

  toggleRecording = (): void => {
    const recorder = this.state.recorder;
    const isRecording = recorder.getRecording();

    if (isRecording) {
      recorder.stopRecording();
    } else {
      recorder.startRecording();
    }
  }

  render(): React.ReactNode {
    const data = {
      labels: Array.from({ length: this.state.freqData.length }, (_, i) => i.toString()),
      datasets: [{
        label: 'Frequency Data',
        data: Array.from(this.state.freqData),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      }],
    };

    const options = {
      scales: {
        x: {
          beginAtZero: true,
          display: false, // Hide x-axis labels
        },
        y: {
          beginAtZero: true,
        },
      },
    };

    return (
      <div>
        <Bar data={data} options={options} />
        <button onClick={this.toggleGraphing}>toggle graphing</button>
        <button onClick={this.toggleRecording}>toggle recording</button>
      </div>
    );
  }
}
