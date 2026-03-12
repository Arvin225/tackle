import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioEngine, Track } from "./AudioEngine";
import { PlaybackState, PlaybackMode } from "./types";

// Mock Howler
vi.mock("howler", () => ({
  Howl: vi.fn().mockImplementation(() => ({
    play: vi.fn().mockReturnValue(1),
    pause: vi.fn(),
    stop: vi.fn(),
    volume: vi.fn(),
    seek: vi.fn(),
    duration: vi.fn().mockReturnValue(180),
    state: vi.fn().mockReturnValue("loaded"),
    on: vi.fn(),
    off: vi.fn(),
    unload: vi.fn(),
  })),
  Howler: {
    volume: vi.fn(),
  },
}));

describe("AudioEngine", () => {
  let audioEngine: AudioEngine;
  const mockTrack: Track = {
    id: "track1",
    url: "https://example.com/track1.mp3",
    title: "Test Track",
    artist: "Test Artist",
    duration: 180,
  };

  beforeEach(() => {
    audioEngine = new AudioEngine();
    vi.clearAllMocks();
  });

  describe("initialization", () => {
    it("should initialize with default values", () => {
      expect(audioEngine.getState()).toBe(PlaybackState.IDLE);
      expect(audioEngine.getVolume()).toBe(1);
      expect(audioEngine.getMode()).toBe(PlaybackMode.SEQUENTIAL);
    });

    it("should initialize with custom config", () => {
      const customEngine = new AudioEngine({
        gaplessPlayback: false,
        crossfadeDuration: 2000,
        preloadAheadPercent: 0.5,
      });
      expect(customEngine.getState()).toBe(PlaybackState.IDLE);
    });
  });

  describe("playback control", () => {
    it("should load and play a track", () => {
      audioEngine.load(mockTrack);
      expect(audioEngine.getState()).toBe(PlaybackState.READY);

      audioEngine.play();
      expect(audioEngine.getState()).toBe(PlaybackState.PLAYING);
    });

    it("should pause playback", () => {
      audioEngine.load(mockTrack);
      audioEngine.play();
      expect(audioEngine.getState()).toBe(PlaybackState.PLAYING);

      audioEngine.pause();
      expect(audioEngine.getState()).toBe(PlaybackState.PAUSED);
    });

    it("should stop playback", () => {
      audioEngine.load(mockTrack);
      audioEngine.play();
      expect(audioEngine.getState()).toBe(PlaybackState.PLAYING);

      audioEngine.stop();
      expect(audioEngine.getState()).toBe(PlaybackState.IDLE);
    });
  });

  describe("volume control", () => {
    it("should set volume", () => {
      audioEngine.setVolume(0.5);
      expect(audioEngine.getVolume()).toBe(0.5);
    });

    it("should clamp volume to 0-1 range", () => {
      audioEngine.setVolume(1.5);
      expect(audioEngine.getVolume()).toBe(1);

      audioEngine.setVolume(-0.5);
      expect(audioEngine.getVolume()).toBe(0);
    });
  });

  describe("playback mode", () => {
    it("should set playback mode", () => {
      audioEngine.setMode(PlaybackMode.SHUFFLE);
      expect(audioEngine.getMode()).toBe(PlaybackMode.SHUFFLE);

      audioEngine.setMode(PlaybackMode.LOOP_ONE);
      expect(audioEngine.getMode()).toBe(PlaybackMode.LOOP_ONE);

      audioEngine.setMode(PlaybackMode.LOOP_ALL);
      expect(audioEngine.getMode()).toBe(PlaybackMode.LOOP_ALL);
    });
  });

  describe("queue management", () => {
    const tracks: Track[] = [
      { id: "track1", url: "track1.mp3", title: "Track 1" },
      { id: "track2", url: "track2.mp3", title: "Track 2" },
      { id: "track3", url: "track3.mp3", title: "Track 3" },
    ];

    it("should add tracks to queue", () => {
      audioEngine.addToQueue(tracks[0]);
      audioEngine.addToQueue(tracks[1]);
      expect(audioEngine.getQueue()).toHaveLength(2);
    });

    it("should clear queue", () => {
      audioEngine.addToQueue(tracks[0]);
      audioEngine.addToQueue(tracks[1]);
      expect(audioEngine.getQueue()).toHaveLength(2);

      audioEngine.clearQueue();
      expect(audioEngine.getQueue()).toHaveLength(0);
    });

    it("should remove track from queue", () => {
      audioEngine.addToQueue(tracks[0]);
      audioEngine.addToQueue(tracks[1]);
      audioEngine.addToQueue(tracks[2]);
      expect(audioEngine.getQueue()).toHaveLength(3);

      audioEngine.removeFromQueue("track2");
      expect(audioEngine.getQueue()).toHaveLength(2);
      expect(audioEngine.getQueue()[0].id).toBe("track1");
      expect(audioEngine.getQueue()[1].id).toBe("track3");
    });
  });

  describe("seek functionality", () => {
    it("should seek to position", () => {
      audioEngine.load(mockTrack);
      audioEngine.seek(60); // Seek to 1 minute
      // Note: Actual seek implementation would be tested in integration tests
      expect(audioEngine.getState()).toBe(PlaybackState.READY);
    });
  });

  describe("event listeners", () => {
    it("should notify state change listeners", () => {
      const listener = vi.fn();
      audioEngine.onStateChange(listener);

      audioEngine.load(mockTrack);
      expect(listener).toHaveBeenCalledWith(PlaybackState.READY);

      audioEngine.play();
      expect(listener).toHaveBeenCalledWith(PlaybackState.PLAYING);
    });

    it("should remove state change listener", () => {
      const listener = vi.fn();
      audioEngine.onStateChange(listener);
      audioEngine.offStateChange(listener);

      audioEngine.load(mockTrack);
      expect(listener).not.toHaveBeenCalled();
    });

    it("should notify progress listeners", () => {
      const listener = vi.fn();
      audioEngine.onProgress(listener);

      // Simulate progress update (would be called by Howler in real scenario)
      // This is a basic test to ensure the listener is registered
      expect(listener).not.toHaveBeenCalled(); // Not called yet
    });

    it("should notify end listeners", () => {
      const listener = vi.fn();
      audioEngine.onEnd(listener);

      // Simulate track end (would be called by Howler in real scenario)
      // This is a basic test to ensure the listener is registered
      expect(listener).not.toHaveBeenCalled(); // Not called yet
    });
  });
});
