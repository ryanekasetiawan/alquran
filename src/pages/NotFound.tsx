import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-5 mx-5 md:mx-12 items-center justify-center text-center min-h-screen">
      <h1 className="text-3xl font-bold">Halaman Tidak Ditemukan</h1>
      <Button onClick={() => navigate("/")}>Kembali ke home</Button>
    </div>
  );
};

export default NotFound;
