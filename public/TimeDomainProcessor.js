
class TimeDomainProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    time_data = inputs[0];
    return true;
  }
}

registerProcessor("time-domain-processor", TimeDomainProcessor);
