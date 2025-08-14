import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

interface VoiceOption {
  name: string;
  lang: string;
}

const TextToSpeechForm = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.8);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const queryClient = useQueryClient();

  const handlePlayPause = () => {
    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    } else {
      if (!utteranceRef.current) {
        const utterance = new SpeechSynthesisUtterance(text);
        const voiceObj = voices.find(
          (v) =>
            v.name === selectedVoice?.name && v.lang === selectedVoice?.lang
        );
        if (voiceObj) {
          const synthVoices = window.speechSynthesis.getVoices();
          utterance.voice =
            synthVoices.find(
              (sv) => sv.name === voiceObj.name && sv.lang === voiceObj.lang
            ) || null;
        }

        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        utterance.onend = () => {
          setIsSpeaking(false);
          utteranceRef.current = null;
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } else {
        window.speechSynthesis.resume();
      }
      setIsSpeaking(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    utteranceRef.current = null;
  };

  const saveAudio = useCustomMutation({
    onSuccess: () => {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ["conversion-list"] });
    },
    onError: (err) => {
      console.error("Error saving audio:", err);
      setIsLoading(false);
    },
  });

  const handleSave = () => {
    if (!text.trim()) return;

    setIsLoading(true);

    saveAudio.mutate({
      path: "/conversion",
      method: "post",
      payload: {
        text: text,
        language: `${selectedVoice?.lang || ""}`,
        voice: `${selectedVoice?.name || ""}`,
        rate: rate,
        pitch: pitch,
        volume: Math.round(volume * 100),
      },
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Text to Speech Converter
      </h2>

      <textarea
        id="text-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none mb-6"
        placeholder="Enter your text here to convert to speech..."
      ></textarea>

      <div className="mb-6">
        <VoiceDropDown
          voices={voices}
          selectedVoice={selectedVoice}
          setVoices={setVoices}
          setSelectedVoice={setSelectedVoice}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rate
          </label>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-xs text-gray-500 mt-1">
            {rate.toFixed(1)}x
          </div>
        </div>

        {/* Pitch */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pitch
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-xs text-gray-500 mt-1">
            {" "}
            {pitch.toFixed(1)}x
          </div>
        </div>

        {/* Volume */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Volume
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-xs text-gray-500 mt-1">
            {Math.round(volume * 100)}%
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePlayPause}
              disabled={isLoading || text == ""}
              className={`${
                text == "" || isLoading
                  ? "bg-gray-400 cursor-not-allowed "
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors`}
            >
              {isSpeaking ? (
                // Pause icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                // Play icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            <button
              onClick={handleStop}
              className={`${
                isLoading || text == ""
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 "
              }  text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors`}
            >
              <svg
                className="size-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 384 512"
              >
                <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"></path>
              </svg>
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={isLoading || text == ""}
            className={`${
              isLoading || text == ""
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 cursor-pointer"
            }  text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2`}
          >
            <svg
              className="size-5 pb-1"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="download"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              data-fa-i2svg=""
            >
              <path
                fill="currentColor"
                d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"
              ></path>
            </svg>
            <span>{isLoading ? "Saving Audio..." : "Save Audio"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface VoiceDropDownProps {
  voices: VoiceOption[];
  selectedVoice: VoiceOption | null;
  setVoices: React.Dispatch<React.SetStateAction<VoiceOption[]>>;
  setSelectedVoice: React.Dispatch<React.SetStateAction<VoiceOption | null>>;
}

const VoiceDropDown: React.FC<VoiceDropDownProps> = ({
  voices,
  selectedVoice,
  setVoices,
  setSelectedVoice,
}) => {
  useEffect(() => {
    const loadVoices = () => {
      const synthVoices = window.speechSynthesis.getVoices();
      const voiceList = synthVoices.map((v) => ({
        name: v.name,
        lang: v.lang,
      }));
      setVoices(voiceList);

      if (voiceList.length > 0 && !selectedVoice) {
        setSelectedVoice(voiceList[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoice, setVoices, setSelectedVoice]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voice = voices.find((v) => v.name === e.target.value);
    if (voice) {
      setSelectedVoice(voice);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Voice
      </label>
      <select
        id="voice-select"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        value={selectedVoice?.name || ""}
        onChange={handleChange}
      >
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
    </div>
  );
};

export default TextToSpeechForm;
