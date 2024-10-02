import { asmaulHusna, AsmaulHusnaType } from "@/utils/asmaulHusna";

const AsmaulHusna = () => {
  return (
    <div className="mx-12">
      <h1 className="text-2xl font-bold">Daftar Asmaul Husna</h1>
      <div className="">
        <ul className="my-8 grid grid-cols-3 gap-5 text-center text-white font-semibold">
          {asmaulHusna.map((item: AsmaulHusnaType) => (
            <li
              key={item.urutan}
              className="bg-[#3daa25] p-2 border rounded-lg"
            >
              <span className="flex gap-1 flex-col items-center text-center flex-start">
                <h2 className="text-xl text-slate-900">{item.urutan}.</h2>
                <span className="flex gap-1">
                  <p>{item.latin}</p>
                  <p className="arab-font">( {item.arab} )</p>
                </span>
                <p>{item.arti}</p>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AsmaulHusna;
