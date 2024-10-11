import { webTitle } from "@/utils/webTitle";
// import salamImage from "@/assets/images/salam.webp";
import quranRead from "@/assets/images/quran-read.webp";
import TypingEffect from "@/components/ui/typingEffect";

const Home = () => {
  document.title = `Home - ${webTitle}`;

  return (
    <div className="w-full min-h-[100vh]">
      <div className="arab-font">{/*<p>السلام عليكم</p>*/}</div>
      <div className="flex flex-col md:grid md:grid-cols-3 justify-center items-center py-5 px-5 md:px-12 bg-[#3daa25]">
        {/*<img src={salamImage} alt="alquran" className="w-48 lg:w-72" />*/}
        <div className="">
          <img src={quranRead} alt="alquran" className="w-48 lg:w-72" />
        </div>
        <div className="md:col-span-2">
          <TypingEffect
            text="“Bacalah Al-Qur’an, karena sesungguhnya ia akan menjadi syafaat bagi para pembacanya di hari kiamat.” (HR. Muslim)"
            speed={100}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
