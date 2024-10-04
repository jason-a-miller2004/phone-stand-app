import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { sleep } from './sound';

// Register necessary Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type RecordState = {
  graphing: boolean,
  freqData: Uint8Array,
  analyser: AnalyserNode | undefined,
  source: MediaStreamAudioSourceNode | undefined,
};

export class FrequencyRecorder extends Component<{}, RecordState> {

  constructor(args: {}) {
    super(args);
    this.state = {
                    graphing: false,
                    freqData: new Uint8Array(128),
                    analyser: undefined,
                    source: undefined,
                  };
  }

  componentDidUpdate(prevProps: {}, prevState: RecordState) {
    if (this.state.graphing && !prevState.graphing) {
      this.startGraphing();
    }
  }

  startGraphing = async (): Promise<void> => {
    const audioCtx = new AudioContext();

    try {
      const analyser = audioCtx.createAnalyser();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          }
      });
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 1024;
      analyser.minDecibels = -80;
      analyser.smoothingTimeConstant = 0;
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
    this.setState((state) => ({ graphing: !state.graphing}));
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
      </div>
    );
  }
}
