import React from "react";
import DocumentTemplate from "@/components/common/document-template/document-template";

const TestTemplatePage = () => {
  return (
    <DocumentTemplate>
      <div className="flex flex-col gap-6 p-8 border-2 border-dashed border-gray-200 rounded-lg h-96 items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-800">
          محتوى التقرير
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          هذا النص هو مثال لمحتوى يمكن وضعه داخل قالب
          المستند. يمكنك وضع الجداول، الرسوم البيانية، أو أي
          محتوى آخر هنا.
        </p>
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="h-20 bg-gray-100 rounded flex items-center justify-center">
            صندوق 1
          </div>
          <div className="h-20 bg-gray-100 rounded flex items-center justify-center">
            صندوق 2
          </div>
          <div className="h-20 bg-gray-100 rounded flex items-center justify-center">
            صندوق 3
          </div>
        </div>
      </div>
    </DocumentTemplate>
  );
};

export default TestTemplatePage;
