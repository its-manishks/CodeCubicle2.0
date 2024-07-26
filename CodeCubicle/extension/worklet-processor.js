class AudioProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
      const input = inputs[0];
      const output = outputs[0];
      
      // Forward the audio data to the port for recognition
      if (input[0]) {
          this.port.postMessage(input[0]);
      }

      // Pass the audio data through to the output unchanged
      for (let channel = 0; channel < input.length; channel++) {
          output[channel].set(input[channel]);
      }

      return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);

  
