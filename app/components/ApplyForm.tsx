"use client";

import { FormEvent, useState } from "react";

const inputClass =
  "w-full rounded border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#0b4ea2] focus:ring-4 focus:ring-blue-100";
const fileClass =
  "w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-bold file:text-[#073b7a] focus:border-[#0b4ea2] focus:ring-4 focus:ring-blue-100";
const maxFileSize = 15 * 1024 * 1024;
const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];
const fileFields = [
  { name: "passportUpload", label: "Passport Upload" },
  { name: "passportPhoto", label: "Passport Photograph" },
  { name: "bankStatement", label: "Bank Statement" },
  { name: "supportingDocument", label: "Additional Supporting Document" },
] as const;

export function ApplyForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [notice, setNotice] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  function validateFiles(formData: FormData) {
    for (const field of fileFields) {
      const file = formData.get(field.name);

      if (!(file instanceof File) || file.size === 0) {
        continue;
      }

      const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        return `${field.label} must be PDF, JPG, JPEG, PNG, WEBP, or supported HEIC.`;
      }

      if (file.size > maxFileSize) {
        return `${field.label} must be 15MB or smaller before optimization.`;
      }
    }

    return "";
  }

  function submitApplication(formData: FormData) {
    return new Promise<{ application: { trackingCode: string } }>((resolve, reject) => {
      const request = new XMLHttpRequest();

      request.open("POST", "/api/applications");
      request.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      request.onload = () => {
        const data = request.responseText ? JSON.parse(request.responseText) : {};

        if (request.status >= 200 && request.status < 300) {
          resolve(data);
          return;
        }

        reject(new Error(data.error ?? "Unable to submit application."));
      };
      request.onerror = () => reject(new Error("Unable to submit application."));
      request.send(formData);
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setNotice("");
    setTrackingCode("");
    setUploadProgress(0);

    const formData = new FormData(event.currentTarget);
    const validationError = validateFiles(formData);

    if (validationError) {
      setStatus("error");
      setNotice(validationError);
      return;
    }

    try {
      const data = await submitApplication(formData);

      event.currentTarget.reset();
      setStatus("success");
      setUploadProgress(100);
      setTrackingCode(data.application.trackingCode);
      setNotice("Your application has been submitted successfully. Save your tracking code.");
    } catch (error) {
      setStatus("error");
      setNotice(error instanceof Error ? error.message : "Unable to submit application.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded bg-white p-5 shadow-xl shadow-blue-900/10 ring-1 ring-blue-100 md:p-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-[#073b7a]">Application details</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Complete the required fields and attach any available supporting documents.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Full name
          <input className={inputClass} name="fullName" type="text" placeholder="Your full name" required />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Phone number
          <input className={inputClass} name="phone" type="tel" placeholder="+234 000 000 0000" required />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Email
        <input className={inputClass} name="email" type="email" placeholder="you@example.com" required />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Destination country
          <input
            className={inputClass}
            name="destinationCountry"
            type="text"
            placeholder="United Kingdom"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Travel purpose
          <select className={inputClass} name="travelPurpose" defaultValue="" required>
            <option value="" disabled>
              Select purpose
            </option>
            <option>Tourism</option>
            <option>Study</option>
            <option>Business</option>
            <option>Medical</option>
            <option>Family Visit</option>
            <option>Other</option>
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Message
        <textarea
          className={`${inputClass} min-h-36 resize-y`}
          name="message"
          placeholder="Tell us about your travel plans or the support you need."
          required
        />
      </label>
      <div className="rounded border border-blue-100 bg-blue-50 p-4 md:p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#073b7a]">
          Document uploads
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Upload your document or photo. We will automatically optimize it for review.
        </p>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          PDF, JPG, JPEG, PNG, WEBP, and safely supported HEIC files. Maximum 15MB per file.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {fileFields.map((field) => (
            <label key={field.name} className="grid gap-2 text-sm font-semibold text-slate-700">
              {field.label}
              <input
                className={fileClass}
                name={field.name}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif,application/pdf,image/jpeg,image/png,image/webp,image/heic,image/heif"
              />
            </label>
          ))}
        </div>
      </div>
      {status === "submitting" ? (
        <div className="rounded bg-blue-50 p-4 ring-1 ring-blue-100">
          <div className="flex items-center justify-between text-sm font-semibold text-[#073b7a]">
            <span>Saving application and uploading documents</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded bg-white">
            <div
              className="h-full rounded bg-[#d9a441] transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      ) : null}
      {notice ? (
        <div
          className={`rounded px-4 py-3 text-sm font-semibold ${
            status === "success"
              ? "bg-green-50 text-green-800 ring-1 ring-green-200"
              : "bg-red-50 text-red-800 ring-1 ring-red-200"
          }`}
        >
          <p>{notice}</p>
          {trackingCode ? (
            <p className="mt-2 rounded bg-white px-3 py-2 font-bold tracking-wide text-[#073b7a] ring-1 ring-green-200">
              Tracking code: {trackingCode}
            </p>
          ) : null}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded bg-[#0b4ea2] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#073b7a] focus-visible:focus-ring disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {status === "submitting" ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
