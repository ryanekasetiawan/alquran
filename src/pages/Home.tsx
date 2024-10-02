import { useEffect } from "react";
import { webTitle } from "@/utils/webTitle";

const Home = () => {
  useEffect(() => {
    document.title = `Home - ${webTitle}`;
  }, []);
  return (
    <div className="container mx-12">
      <div>Home Page</div>
      <div className="arab-font">
        <p>السلام عليكم</p> {/* Teks dalam bahasa Arab */}
      </div>
    </div>
  );
};

export default Home;
