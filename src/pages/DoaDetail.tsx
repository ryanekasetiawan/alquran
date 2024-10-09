import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchDoa } from "@/hooks/useFetchDoa";
import Button from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { webTitle } from "@/utils/webTitle";
import FormattedText from "@/utils/formattedText";
import { formatUrl } from "@/utils/formatUrl";

const DoaDetail = () => {
  const { id: doaId } = useParams<{ id: string }>();
  const { doas, loading } = useFetchDoa();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      const doaFound = doas.find((doa) => formatUrl(doa.nama) === doaId);

      if (!doaFound) {
        navigate("/404", { replace: true });
      } else {
        setIsChecking(false);
      }
    }
  }, [doaId, doas, loading, navigate]);

  const handleChangeDoa = () => {
    navigate("/doa", { replace: true });
  };

  if (isChecking || loading) {
    return <LoadingSpinner />;
  }

  const doa = doas.find((doa) => formatUrl(doa.nama) === doaId);
  const title = doa?.nama || "Doa";

  document.title = `${title} - ${webTitle}`;

  return (
    <div className="mt-2 md:mt-5 px-5 md:px-12 min-h-[100vh]">
      <div className="sticky top-16 bg-white pb-2">
        <h1 className="text-xl md:text-2xl font-bold mb-2">
          {loading ? <span>Loading...</span> : doa?.nama || "Tidak ditemukan"}
        </h1>

        <Button className="bg-blue-500" onClick={handleChangeDoa}>
          Ganti Doa
        </Button>
      </div>

      {doa ? (
        <div className="flex flex-col gap-3 mt-4">
          <p className="arab-font text-2xl leading-loose">{doa.ar}</p>
          <p>{doa.idn}</p>
          <p>
            <FormattedText text={doa.tentang} nonArabicClassName="italic" />
          </p>
        </div>
      ) : (
        <p>Doa tidak ditemukan.</p>
      )}
    </div>
  );
};

export default DoaDetail;
