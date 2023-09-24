"use client";

import React from "react";
import { X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadThing";
import "@uploadthing/react/styles.css";

interface FileUploaderProps {
  endpoint: "messageFile" | "serverImage";
  value: string;
  onChange: (url?: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  value,
  onChange,
  endpoint,
}) => {
  const fileType = value.split(".").pop();

  if (fileType !== "pdf" && value) {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Uploader" className="rounded-full" />
        <button
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
          onClick={() => {
            onChange("")
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.debug("FileUpload ::", error.message);
      }}
    />
  );
};

export default FileUploader;
