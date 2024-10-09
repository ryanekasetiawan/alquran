import React from "react";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";

type AyatItemProps = {
  ayat: {
    nomorAyat: number;
    teksArab: string;
    teksLatin: string;
    teksIndonesia: string;
  };
  index: number;
  currentAyatIndex: number;
  isPlaying: boolean;
  handleAudioControl: (
    action: "play" | "pause" | "stop",
    index?: number,
  ) => void;
  handleOpenTafsir: (nomorAyat: number) => void;
  displayMode: "full" | "ayat";
  ayatRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
};

const AyatItem = ({
  ayat,
  index,
  currentAyatIndex,
  isPlaying,
  handleAudioControl,
  handleOpenTafsir,
  displayMode,
  ayatRefs,
}: AyatItemProps) => {
  return (
    <div
      key={ayat.nomorAyat}
      ref={(el) => (ayatRefs.current[index] = el)}
      style={{
        scrollMarginTop:
          currentAyatIndex === index && isPlaying ? "12rem" : "0",
      }}
      className="flex flex-col mb-5 border-b py-2 text-right"
    >
      <div className="flex gap-3 justify-end">
        <p
          className={`text-2xl arab-font leading-loose ${
            currentAyatIndex === index && isPlaying ? "font-semibold" : ""
          } `}
        >
          {ayat.teksArab}
        </p>
        <p className="border p-2 rounded-full w-10 h-10 flex items-center justify-center bg-gray-200 font-semibold">
          {ayat.nomorAyat}.
        </p>
      </div>
      {displayMode === "full" && (
        <div>
          <p className="text-md italic text-[#D946EF]">{ayat.teksLatin}</p>
          <p>{ayat.teksIndonesia}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                if (isPlaying && currentAyatIndex === index) {
                  handleAudioControl("pause");
                } else {
                  handleAudioControl("play", index);
                }
              }}
              className={`flex items-center px-3 py-2 rounded ${
                isPlaying && currentAyatIndex === index
                  ? "bg-yellow-500"
                  : "bg-green-500"
              } text-white`}
            >
              {isPlaying && currentAyatIndex === index ? (
                <FaPause />
              ) : (
                <FaPlay />
              )}
            </button>
            <button
              onClick={() => handleAudioControl("stop")}
              className="flex items-center bg-red-500 text-white px-3 py-2 rounded"
            >
              <FaStop />
            </button>
            <button
              onClick={() => handleOpenTafsir(ayat.nomorAyat)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Tafsir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AyatItem;
