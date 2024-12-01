import * as Tone from 'tone';
import { unmute } from './unmute';
import { App } from './App';

// db level that sound will play at
const volume = -10;

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
 * loads a file and plays it as sound_playing is true
 * @param component parent object to check if sound should be playing
 */
export const play_constant_burst = (component: App) => {
  const player = new Tone.Player("/sound_generator/chirp_tx.wav").toDestination();
  player.autostart = true;
  const itvl = setInterval(() => {
    if (!component.state.sound_playing) {
      player.stop()
      clearInterval(itvl);
    }
  }, 50);
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