// import QrCodeRedirect from "./QrCodeRedirect";
import type { stepObject } from "../../types/session";
import StartIcon from "../icons/StartIcon";

const StartSession = ({ stepObject }: { stepObject: stepObject }) => {
  const { setStep } = stepObject;

  return (
    <div className="relative flex flex-wrap content-between items-center w-[600px] h-[600px] overflow-hidden">
      {/* {showQrCode ? (
        <QrCodeRedirect
          handleNext={handleQrNext}
          setShowQrCode={setShowQrCode}
          sessionId={sessionId}
        />
      ) : ( */}
      <div className="flex flex-col items-center justify-center w-full h-full px-6 sm:px-12 overflow-hidden">
        {/* Top section */}
        <div className="flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] sm:static sm:translate-x-0 sm:translate-y-0">
          <StartIcon className="w-[230px] h-[230px]" />
          <h1 className="text-[#3C3C40] text-center text-[32px] font-bold leading-[110%] w-[400px] mt-10 mb-[18px]">
            Vérifions vos documents
          </h1>
          <p className="text-[#3C3C40] text-center text-[12px] font-semibold leading-[120%] w-[400px] mb-[82px] sm:mb-[80px] sm:px-[78px]">
            Pour réduire le risque de fraude, nous devons vérifier vos documents
          </p>
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[345px] sm:static sm:w-[345px] sm:translate-x-0">
          <p className="text-[#3C3C40B3] text-center text-[12px] font-semibold leading-[120%] mb-[18px]">
            En cliquant sur commencer, j’accepte les&nbsp;
            <a
              href="https://www.datakeen.co/conditions-generales-dutilisation/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              conditions d’utilisation
            </a>{" "}
            de Datakeen et je déclare avoir lu la&nbsp;
            <a
              href="https://www.datakeen.co/regles-de-confidentialite/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              déclaration de protection des données.
            </a>
          </p>

          <button
            onClick={() => {
              setStep(1);
            }}
            id="start-button"
            className="w-[322px] sm:w-[137px] h-[48px] sm:h-[36px] bg-[#3C3C40] border border-[#3C3C40] text-white text-[14px] font-semibold rounded-[32px] sm:rounded-[6px] mx-auto flex justify-center items-center cursor-pointer hover:bg-[#4C4C50] transition-colors duration-200"
          >
            Commencer
          </button>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default StartSession;
