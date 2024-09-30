import * as Tone from 'tone';
import { unmute } from './unmute';
const volume = -10;
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * takes in a oscillator and plays a constant sound
 * @param osc oscillator object used to play sound to the system
 */
export const play_sound = (osc: Tone.Oscillator) => {
    initSound()
    Tone.start()
    osc.volume.value = volume;
    osc.start();
}

/**
 * stops an oscillator object from playing sound
 * @param osc oscillator object to stop
 */
export const stop_sound = (osc: Tone.Oscillator) => {
  osc.stop();
}

/**
 * plays a constant sound for play_time length (ms) from osc object
 * @param osc oscillator object used to play sound to the system
 * @param play_time amount of time to play burst of sound for
 */
export const play_burst = async (osc: Tone.Oscillator, play_time: number) => {
  osc.volume.value = volume;
  osc.start();
  await sleep(play_time)
  osc.stop();
}

export const initSound = () => {
  let context = (window.AudioContext) ?
    new (window.AudioContext)() : null;

  // Decide on some parameters
  let allowBackgroundPlayback = false; // default false, recommended false
  let forceIOSBehavior = false; // default false, recommended false
  // Pass it to unmute if the context exists... ie WebAudio is supported
  if (context)
  {
    // If you need to be able to disable unmute at a later time, you can use the returned handle's dispose() method
    // if you don't need to do that (most folks won't) then you can simply ignore the return value
    unmute(context, allowBackgroundPlayback, forceIOSBehavior);
  }
}