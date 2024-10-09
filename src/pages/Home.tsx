import { webTitle } from "@/utils/webTitle";
import salamImage from "@/assets/images/salam.webp";

const Home = () => {
  document.title = `Home - ${webTitle}`;

  return (
    <div className="w-full min-h-[100vh]">
      <div className="arab-font">{/*<p>السلام عليكم</p>*/}</div>
      <div className="flex justify-center items-center py-5 bg-[#3daa25]">
        <img src={salamImage} alt="alquran" className="w-48 lg:w-72" />
      </div>
    </div>
  );
};

export default Home;
