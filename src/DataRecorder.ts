
export class DataRecorder {
  private data: Array<number>;
  private recording: boolean;

  constructor() {
    this.data = [];
    this.recording = false;
  }

  getRecording() {
    return this.recording;
  }

  startRecording () {
    this.data = [];
    this.recording = true;
  }

  stopRecording () {
    this.recording = false;
    this.downloadFile();
  }

  push (value: number): boolean {
    if (this.recording) {
      this.data.push(value);
      return true;
    } else {
      return false;
    }
  }

  downloadFile (): void {
    let csvContent = "data:text/csv;charset=utf-8,";
    for(const val in this.data) {
      csvContent += `${val},\r\n`
    }

    const blob = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = blob;
    link.setAttribute('download', "phone_stand_recording");
    document.body.appendChild(link);
    link.click();
    // always returns true
    if (link.parentNode != null) {
      link.parentNode.removeChild(link);
    }
  }
}