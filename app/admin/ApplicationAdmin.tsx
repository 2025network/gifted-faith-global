"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, ShieldCheck, Trash2 } from "lucide-react";
import { applicationStatuses } from "@/lib/status";

type Application = {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  destinationCountry: string;
  travelPurpose: string;
  message: string;
  status: string;
  trackingCode: string;
  passportUploadPath: string | null;
  passportPhotoPath: string | null;
  bankStatementPath: string | null;
  supportingDocPath: string | null;
  passportUploadOriginalPath: string | null;
  passportUploadOptimizedPath: string | null;
  passportUploadOriginalSize: number | null;
  passportUploadOptimizedSize: number | null;
  passportPhotoOriginalPath: string | null;
  passportPhotoOptimizedPath: string | null;
  passportPhotoOriginalSize: number | null;
  passportPhotoOptimizedSize: number | null;
  bankStatementOriginalPath: string | null;
  bankStatementOptimizedPath: string | null;
  bankStatementOriginalSize: number | null;
  bankStatementOptimizedSize: number | null;
  supportingDocOriginalPath: string | null;
  supportingDocOptimizedPath: string | null;
  supportingDocOriginalSize: number | null;
  supportingDocOptimizedSize: number | null;
  createdAt: string;
};

const documentFields = [
  {
    legacyKey: "passportUploadPath",
    originalKey: "passportUploadOriginalPath",
    optimizedKey: "passportUploadOptimizedPath",
    originalSizeKey: "passportUploadOriginalSize",
    optimizedSizeKey: "passportUploadOptimizedSize",
    label: "Passport",
  },
  {
    legacyKey: "passportPhotoPath",
    originalKey: "passportPhotoOriginalPath",
    optimizedKey: "passportPhotoOptimizedPath",
    originalSizeKey: "passportPhotoOriginalSize",
    optimizedSizeKey: "passportPhotoOptimizedSize",
    label: "Photo",
  },
  {
    legacyKey: "bankStatementPath",
    originalKey: "bankStatementOriginalPath",
    optimizedKey: "bankStatementOptimizedPath",
    originalSizeKey: "bankStatementOriginalSize",
    optimizedSizeKey: "bankStatementOptimizedSize",
    label: "Bank Statement",
  },
  {
    legacyKey: "supportingDocPath",
    originalKey: "supportingDocOriginalPath",
    optimizedKey: "supportingDocOptimizedPath",
    originalSizeKey: "supportingDocOriginalSize",
    optimizedSizeKey: "supportingDocOptimizedSize",
    label: "Supporting Doc",
  },
] as const;

export function ApplicationAdmin({ applications }: { applications: Application[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function deleteApplication(id: number) {
    const confirmed = window.confirm("Delete this application?");
    if (!confirmed) return;

    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Unable to delete application.");
      }

      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete application.");
    } finally {
      setDeletingId(null);
    }
  }

  function formatFileSize(size: number | null) {
    if (!size) return "Size unavailable";

    if (size < 1024 * 1024) {
      return `${Math.max(1, Math.round(size / 1024))} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }

  function renderDocumentLinks(application: Application) {
    const documents = documentFields
      .map((document) => {
        const originalPath = application[document.originalKey] ?? application[document.legacyKey];
        const optimizedPath = application[document.optimizedKey] ?? application[document.legacyKey];

        return {
          ...document,
          originalPath,
          optimizedPath,
          originalSize: application[document.originalSizeKey],
          optimizedSize: application[document.optimizedSizeKey],
        };
      })
      .filter((document) => document.originalPath || document.optimizedPath);

    if (documents.length === 0) {
      return <p className="text-sm text-slate-500">No documents uploaded</p>;
    }

    return (
      <div className="mt-3 grid gap-3">
        {documents.map((document) => (
          <div key={document.label} className="rounded bg-blue-50 p-3 ring-1 ring-blue-100">
            <p className="text-xs font-bold uppercase tracking-wide text-[#073b7a]">
              {document.label}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {document.originalPath ? (
                <a
                  href={document.originalPath}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded bg-white px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-blue-100 transition hover:bg-blue-100"
                >
                  Original
                </a>
              ) : null}
              {document.optimizedPath ? (
                <a
                  href={document.optimizedPath}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded bg-[#073b7a] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#0b4ea2]"
                >
                  Optimized
                </a>
              ) : null}
              {document.optimizedPath ? (
                <a
                  href={document.optimizedPath}
                  download
                  className="rounded bg-[#d9a441] px-3 py-1.5 text-xs font-bold text-[#102033] transition hover:bg-[#c9942f]"
                >
                  Download optimized
                </a>
              ) : null}
            </div>
            <p className="mt-2 text-xs text-slate-600">
              Original: {formatFileSize(document.originalSize)} · Optimized:{" "}
              {formatFileSize(document.optimizedSize)}
            </p>
          </div>
        ))}
      </div>
    );
  }

  async function logout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });
    router.push("/admin/login");
    router.refresh();
  }

  async function updateStatus(id: number, status: string) {
    setUpdatingId(id);
    setError("");

    try {
      const response = await fetch(`/api/applications/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Unable to update application status.");
      }

      router.refresh();
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Unable to update application status.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (applications.length === 0) {
    return (
      <div className="grid gap-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded bg-[#073b7a] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0b4ea2]"
          >
            <LogOut size={17} aria-hidden="true" />
            Logout
          </button>
        </div>
        <div className="rounded bg-white p-8 text-center shadow-sm ring-1 ring-blue-100 md:p-12">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded bg-blue-50 text-[#0b4ea2]">
            <ShieldCheck size={28} aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-[#073b7a]">No applications yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            New Apply Now submissions, tracking codes, uploaded documents, and status controls will
            appear here automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded bg-[#073b7a] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0b4ea2]"
        >
          <LogOut size={17} aria-hidden="true" />
          Logout
        </button>
      </div>

      {error ? (
        <p className="rounded bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 ring-1 ring-red-200">
          {error}
        </p>
      ) : null}

      <div className="hidden overflow-hidden rounded bg-white shadow-sm ring-1 ring-blue-100 lg:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[#073b7a] text-white">
            <tr>
              <th className="px-4 py-3 font-bold">Applicant</th>
              <th className="px-4 py-3 font-bold">Tracking</th>
              <th className="px-4 py-3 font-bold">Contact</th>
              <th className="px-4 py-3 font-bold">Destination</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Date</th>
              <th className="px-4 py-3 font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id} className="border-t border-blue-100 align-top">
                <td className="px-4 py-4">
                  <p className="font-bold text-slate-900">{application.fullName}</p>
                  <p className="mt-1 max-w-xs text-slate-600">{application.message}</p>
                  {renderDocumentLinks(application)}
                </td>
                <td className="px-4 py-4">
                  <p className="font-bold tracking-wide text-[#073b7a]">{application.trackingCode}</p>
                  <p className="mt-1 text-slate-600">{application.travelPurpose}</p>
                </td>
                <td className="px-4 py-4 text-slate-700">
                  <p>{application.phone}</p>
                  <p className="mt-1">{application.email}</p>
                </td>
                <td className="px-4 py-4 font-semibold text-slate-800">
                  {application.destinationCountry}
                </td>
                <td className="px-4 py-4">
                  <select
                    value={application.status}
                    onChange={(event) => updateStatus(application.id, event.target.value)}
                    disabled={updatingId === application.id}
                    className="w-full min-w-40 rounded border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#0b4ea2] focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    {applicationStatuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {new Date(application.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => deleteApplication(application.id)}
                    disabled={deletingId === application.id}
                    className="inline-flex items-center gap-2 rounded bg-red-50 px-3 py-2 text-sm font-bold text-red-700 ring-1 ring-red-200 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    {deletingId === application.id ? "Deleting" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {applications.map((application) => (
          <article key={application.id} className="rounded bg-white p-5 shadow-sm ring-1 ring-blue-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#073b7a]">{application.fullName}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {new Date(application.createdAt).toLocaleString()}
                </p>
                <p className="mt-2 text-sm font-bold tracking-wide text-[#073b7a]">
                  {application.trackingCode}
                </p>
              </div>
              <button
                type="button"
                onClick={() => deleteApplication(application.id)}
                disabled={deletingId === application.id}
                className="grid h-10 w-10 place-items-center rounded bg-red-50 text-red-700 ring-1 ring-red-200 disabled:opacity-60"
                aria-label={`Delete application from ${application.fullName}`}
              >
                <Trash2 size={18} aria-hidden="true" />
              </button>
            </div>
            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="font-bold text-slate-700">Contact</dt>
                <dd className="mt-1 text-slate-600">{application.phone}</dd>
                <dd className="text-slate-600">{application.email}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-700">Destination</dt>
                <dd className="mt-1 text-slate-600">{application.destinationCountry}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-700">Travel purpose</dt>
                <dd className="mt-1 text-slate-600">{application.travelPurpose}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-700">Status</dt>
                <dd className="mt-2">
                  <select
                    value={application.status}
                    onChange={(event) => updateStatus(application.id, event.target.value)}
                    disabled={updatingId === application.id}
                    className="w-full rounded border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#0b4ea2] focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    {applicationStatuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-700">Message</dt>
                <dd className="mt-1 text-slate-600">{application.message}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-700">Uploaded documents</dt>
                <dd>{renderDocumentLinks(application)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
