import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchDoa } from "@/hooks/useFetchDoa";
import Button from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { webTitle } from "@/utils/webTitle";
import FormattedText from "@/utils/formattedText";
import { formatUrl } from "@/utils/formatUrl";
import html2canvas from "html2canvas";

const DoaDetail = () => {
  const { id: doaId } = useParams<{ id: string }>();
  const { doas, loading } = useFetchDoa();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const doaRef = useRef<HTMLDivElement>(null);

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

  const handleSaveDoa = async () => {
    if (doaRef.current) {
      const width = doaRef.current.scrollWidth;
      const height = doaRef.current.scrollHeight;

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = width + 80;
        canvas.height = height + 80;

        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const wrapText = (
          context: CanvasRenderingContext2D,
          text: string,
          x: number,
          y: number,
          maxWidth: number,
          lineHeight: number,
        ): number => {
          const words = text.split(" ");
          let line = "";
          const lines = [];

          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + " ";
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && n > 0) {
              lines.push(line);
              line = words[n] + " ";
            } else {
              line = testLine;
            }
          }
          lines.push(line);

          for (let i = 0; i < lines.length; i++) {
            context.fillText(lines[i], x, y + i * lineHeight);
          }

          return lines.length;
        };

        context.font = "bold 24px sans-serif";
        context.fillStyle = "#000000";
        const titleX = 40;
        const titleY = 40;
        const maxTitleWidth = canvas.width - 80;
        const lineHeight = 30;
        const titleLineCount = wrapText(
          context,
          doa?.nama || "Doa",
          titleX,
          titleY,
          maxTitleWidth,
          lineHeight,
        );

        const contentYPosition = titleLineCount * lineHeight;

        const originalCanvas = await html2canvas(doaRef.current, {
          x: -15,
          y: -20,
          width: width + 80,
          height: height + 60,
          backgroundColor: null,
        });

        context.drawImage(originalCanvas, 20, contentYPosition);

        const imgData = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = imgData;
        link.download = `${doa?.nama || "doa"}.png`;
        link.click();
      }
    }
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
        <Button className="bg-green-500 ml-2" onClick={handleSaveDoa}>
          Simpan Doa
        </Button>
      </div>

      {doa ? (
        <div ref={doaRef} className="flex flex-col gap-3 mt-4">
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
