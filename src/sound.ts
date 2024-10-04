import * as Tone from 'tone';
import { unmute } from './unmute';
import { App } from './App';

// db level that sound will play at
const volume = -10;

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Takes in an oscillator and plays a constant sound.
 * @param component The current component.
 * @param osc Oscillator object used to play sound to the system.
 */
export const play_sound = async (component: App, osc: Tone.Oscillator) => {
  osc.volume.value = volume;
  osc.start();
};

/**
 * Stops the sound by stopping the oscillator.
 * @param osc Oscillator object to stop the sound.
 */
export const stop_sound = (osc: Tone.Oscillator) => {
  osc.stop();
};

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

/**
 * plays a constant burst for play_time with sleep_time ms between bursts
 * @param component parent object to check if sound should be playing
 * @param osc oscillator object used to play sound to the system
 * @param play_time amount of time to play constant tone at
 * @param sleep_time amount of time to wait between bursts
 */
export const play_constant_burst = async (component: App, osc: Tone.Oscillator, play_time: number, sleep_time: number) => {
  osc.volume.value = volume;
  while (component.state.sound_playing) {
    await play_burst(osc, play_time);
    await sleep(sleep_time);
  }
}

/**
 * allows ios mobile devices (iphones) to initiailze sound in tone.js
 */
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