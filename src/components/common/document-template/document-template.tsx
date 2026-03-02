import React from "react";
import Image from "next/image";

interface DocumentTemplateProps {
  children: React.ReactNode;
}

const DocumentTemplate: React.FC<DocumentTemplateProps> = ({
  children,
}) => {
  return (
    <div
      className="min-h-screen bg-white flex flex-col font-sans p-0 m-0"
      dir="rtl"
    >
      {/* Header */}
      <header className="px-12 py-8 flex items-center justify-start gap-4">
        <div className="relative w-16 h-16">
          <Image
            src="https://res.cloudinary.com/doxyvufkz/image/upload/v1772428106/ChatGPT_Image_Mar_2_2026_07_08_05_AM_ccmhaf.png"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col text-black">
          <h1 className="text-2xl font-bold leading-tight">
            شركة استقرار الجودة
          </h1>
          <p className="text-xl font-medium leading-tight">
            Quality Stability CO.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow px-12 pb-16 pt-8">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="fixed bottom-0 h-14 mt-6 w-full flex items-center overflow-hidden text-white text-[9px] md:text-[11px] font-medium"
        dir="ltr"
      >
        {/* Background Layers */}
        <div className="absolute inset-0 flex">
          <div
            className="bg-[#2D2E2E] w-[75%]"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 97% 100%, 0% 100%)",
            }}
          ></div>
          <div
            className="bg-[#E30613] grow -ml-[3%]"
            style={{
              clipPath:
                "polygon(3% 0, 100% 0, 100% 100%, 0% 100%)",
            }}
          ></div>
        </div>

        {/* Footer Content */}
        <div className="relative z-10 w-full px-8 flex justify-between items-center h-full">
          {/* Gray Section Content (Left aligned in LTR) */}
          <div className="flex items-center gap-2 md:gap-4 flex-nowrap shrink-0 overflow-hidden">
            <div className="flex items-center gap-1">
              <span className="font-bold text-gray-200">
                المملكة العربية السعودية - جدة
              </span>
              <span>
                حي المروة شارع عبدالرحمن الخزاعي 5431
              </span>
            </div>
            <span className="opacity-40">|</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-gray-200">
                الهاتف
              </span>
              <span>920032492</span>
            </div>
            <span className="opacity-40">|</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-gray-200">
                عضوية رقم
              </span>
              <span>655805</span>
            </div>
            <span className="opacity-40">|</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-gray-200">
                الرقم الموحد
              </span>
              <span>7051390529</span>
            </div>
          </div>

          {/* Red Section Content (Right aligned in LTR) */}
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <span className="font-bold">www.qsc.sa</span>
            <span className="opacity-40">|</span>
            <span className="font-bold">Info@qsc.sa</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DocumentTemplate;
