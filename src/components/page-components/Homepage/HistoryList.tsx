import { useHistoryStore } from "@/store/historyStore";
import { useRef, useState } from "react";
import moment from "moment";

const HistoryList = () => {
  const historyData = useHistoryStore((state) => state.history);

  const [openItem, setOpenItem] = useState<number | null>(null);
  const [playingItem, setPlayingItem] = useState<number | null>(null);
  const contentRefs = useRef<{
    [key: number]: HTMLDivElement | undefined | null;
  }>({});

  const toggleItem = (id: number) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  const handleReplay = (item: any) => {
    // Stop any currently playing speech
    window.speechSynthesis.cancel();

    // Check if browser supports speech synthesis
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support text-to-speech.");
      return;
    }

    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(item.fullText);

    // Set voice if available
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(
      (voice) =>
        voice.name.toLowerCase().includes(item.voice.toLowerCase()) ||
        voice.lang === item.language
    );
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Apply audio settings
    utterance.rate = parseFloat(item.speed) || 1.0; // Speed (0.1 to 10)
    utterance.pitch = parseFloat(item.pitch) || 1.0; // Pitch (0 to 2)
    utterance.volume = parseFloat(item.volume) / 100 || 1.0; // Volume (0 to 1)

    // Set language
    utterance.lang = item.language;

    // Event handlers
    utterance.onstart = () => {
      setPlayingItem(item.id);
    };

    utterance.onend = () => {
      setPlayingItem(null);
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setPlayingItem(null);
      alert("An error occurred during text-to-speech playback.");
    };

    // Start speech
    window.speechSynthesis.speak(utterance);
  };

  const stopReplay = () => {
    window.speechSynthesis.cancel();
    setPlayingItem(null);
  };

  // Helper function to calculate progress bar width based on value and range
  const getProgressWidth = (
    value: string,
    type: "speed" | "pitch" | "volume"
  ) => {
    const numValue = parseFloat(value);
    let percentage = 0;

    switch (type) {
      case "speed":
        // Speed range: 0 to 2.0
        percentage = Math.min(Math.max((numValue / 2.0) * 100, 0), 100);
        break;
      case "pitch":
        // Pitch range: 0 to 2.0
        percentage = Math.min(Math.max((numValue / 2.0) * 100, 0), 100);
        break;
      case "volume":
        // Volume range: 0 to 100
        percentage = Math.min(Math.max(numValue, 0), 100);
        break;
    }

    return `${percentage}%`;
  };

  return (
    <div id="history-section" className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Conversion History
          </h3>
        </div>

        <div className="space-y-3 max-h-screen overflow-y-auto scroll-container">
          {historyData?.map((item, idx) => {
            const isOpen = openItem === item.id;
            const isPlaying = playingItem === item.id;
            const height = isOpen
              ? `${contentRefs.current[item.id]?.scrollHeight || 0}px`
              : "0px";

            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* HEADER */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-sm text-gray-800 line-clamp-2 flex-1 pr-2">
                      {item.fullText}
                    </p>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="currentColor"
                      viewBox="0 0 512 512"
                    >
                      <path
                        d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 
                        12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 
                        338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 
                        0s-12.5 32.8 0 45.3l192 192z"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        <svg
                          className="size-3"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="globe"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          data-fa-i2svg=""
                        >
                          <path
                            fill="currentColor"
                            d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"
                          ></path>
                        </svg>
                        <span className="font-normal uppercase">
                          {item?.language}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 font-semibold">
                        {item.voice}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-semibold">
                      {" "}
                      {moment(item?.date).format("lll")}
                    </span>
                  </div>
                </div>

                {/* DETAILS with height animation */}
                <div
                  ref={(el) => {
                    contentRefs.current[item.id] = el;
                  }}
                  style={{
                    height,
                    transition: "height 0.5s ease",
                    overflow: "hidden",
                  }}
                >
                  <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                      <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Full Text
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item?.fullText}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <p className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                          Voice
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            <svg
                              className="size-3"
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="globe"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                              data-fa-i2svg=""
                            >
                              <path
                                fill="currentColor"
                                d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"
                              ></path>
                            </svg>
                            <span className="font-normal uppercase">
                              {item?.language}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 font-semibold">
                            {item.voice}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <p className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                          Date &amp; Time
                        </p>
                        <p className="text-sm text-gray-800 font-medium">
                          {moment(item?.date).format("lll")}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Audio Settings
                        </p>
                        <div className="flex items-center space-x-2">
                          {isPlaying && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                stopReplay();
                              }}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm"
                            >
                              <svg
                                className="size-3"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M6 6h12v12H6z" />
                              </svg>
                              <span>Stop</span>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReplay(item);
                            }}
                            disabled={isPlaying}
                            className={`${
                              isPlaying
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                            } text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 text-sm`}
                          >
                            <svg
                              className="size-3"
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="repeat"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                              data-fa-i2svg=""
                            >
                              <path
                                fill="currentColor"
                                d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z"
                              ></path>
                            </svg>
                            <span>{isPlaying ? "Playing..." : "Replay"}</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-2 font-medium">
                            Speed
                          </p>
                          <div className="bg-gray-100 h-2 rounded-full mb-2">
                            <div
                              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: getProgressWidth(item.speed, "speed"),
                              }}
                            ></div>
                          </div>
                          <p className="text-xs font-semibold text-gray-800">
                            {item.speed}x
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-2 font-medium">
                            Pitch
                          </p>
                          <div className="bg-gray-100 h-2 rounded-full mb-2">
                            <div
                              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: getProgressWidth(item.pitch, "pitch"),
                              }}
                            ></div>
                          </div>
                          <p className="text-xs font-semibold text-gray-800">
                            {item.pitch}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-2 font-medium">
                            Volume
                          </p>
                          <div className="bg-gray-100 h-2 rounded-full mb-2">
                            <div
                              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: getProgressWidth(item.volume, "volume"),
                              }}
                            ></div>
                          </div>
                          <p className="text-xs font-semibold text-gray-800">
                            {item.volume}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HistoryList;
