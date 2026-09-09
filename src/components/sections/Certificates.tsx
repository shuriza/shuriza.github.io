import { FaAward, FaBookOpen, FaExternalLinkAlt } from "react-icons/fa";
import { certifications, trainings, type Credential } from "@/lib/certificates";

function EvidenceLink({ credential }: { credential: Credential }) {
  return (
    <a
      href={credential.evidenceUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Lihat bukti ${credential.name} (buka di tab baru)`}
      className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300"
    >
      <span>Lihat Bukti</span>
      <FaExternalLinkAlt aria-hidden="true" size={11} />
    </a>
  );
}

function CredentialMeta({ credential }: { credential: Credential }) {
  return (
    <dl className="mt-4 space-y-2 text-sm">
      <div className="flex flex-wrap gap-x-2">
        <dt className="text-slate-500">Penerbit:</dt>
        <dd className="text-slate-300">{credential.issuer}</dd>
      </div>
      <div className="flex flex-wrap gap-x-2">
        <dt className="text-slate-500">Tanggal:</dt>
        <dd className="text-slate-300">{credential.date}</dd>
      </div>
      {credential.duration && (
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-slate-500">Durasi:</dt>
          <dd className="text-slate-300">{credential.duration}</dd>
        </div>
      )}
      {credential.credential && (
        <div className="flex min-w-0 flex-wrap gap-x-2">
          <dt className="text-slate-500">Credential:</dt>
          <dd className="break-all font-mono text-xs text-slate-300">
            {credential.credential}
          </dd>
        </div>
      )}
    </dl>
  );
}

function CertificationCard({ credential }: { credential: Credential }) {
  return (
    <article
      className={`group h-full overflow-hidden rounded-xl border bg-[#1e293b]/50 transition-colors hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] ${
        credential.featured
          ? "border-cyan-500/40 md:col-span-2 lg:col-span-3"
          : "border-[#334155]"
      }`}
    >
      <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500" aria-hidden="true" />
      <div className={credential.featured ? "p-6 md:p-8" : "p-6"}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-3 py-1 text-xs font-medium text-cyan-300">
            <FaAward aria-hidden="true" />
            {credential.featured ? "Sertifikasi Kompetensi" : "Sertifikasi"}
          </span>
          {credential.featured && (
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-400">
              BNSP Certified
            </span>
          )}
        </div>
        <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-cyan-400">
          {credential.name}
        </h3>
        <p className="mt-3 leading-relaxed text-slate-400">{credential.description}</p>
        <CredentialMeta credential={credential} />
        <div className="mt-6">
          <EvidenceLink credential={credential} />
        </div>
      </div>
    </article>
  );
}

function TrainingCard({ credential }: { credential: Credential }) {
  return (
    <article className="h-full rounded-xl border border-[#334155] bg-[#0f172a]/70 p-5 transition-colors hover:border-cyan-500/40">
      <span className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
        <FaBookOpen aria-hidden="true" />
        Pelatihan
      </span>
      <h4 className="font-semibold text-white">{credential.name}</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{credential.description}</p>
      <CredentialMeta credential={credential} />
      <div className="mt-5">
        <EvidenceLink credential={credential} />
      </div>
    </article>
  );
}

export default function Certificates() {
  return (
    <section id="certificates" className="relative px-6 py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.025] to-transparent"
      />
      <div className="relative mx-auto max-w-6xl">
        <header className="mb-14 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
            Bukti Kompetensi
          </p>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Sertifikasi &amp; Pembelajaran
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            Sertifikasi hasil asesmen dipisahkan dari bukti penyelesaian pelatihan agar
            tingkat validasinya tetap jelas.
          </p>
        </header>

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((credential) => (
            <li key={credential.id} className={credential.featured ? "md:col-span-2 lg:col-span-3" : ""}>
              <CertificationCard credential={credential} />
            </li>
          ))}
        </ul>

        <details className="group mt-10 rounded-2xl border border-[#334155] bg-[#1e293b]/30 open:bg-[#1e293b]/45">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left marker:content-none">
            <span>
              <span className="block text-lg font-semibold text-white">Pelatihan Terpilih</span>
              <span className="mt-1 block text-sm text-slate-400">
                {trainings.length} course completion dari DataCamp dan Cisco Networking Academy
              </span>
            </span>
            <span
              aria-hidden="true"
              className="text-2xl text-cyan-400 transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="border-t border-[#334155] p-6">
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {trainings.map((credential) => (
                <li key={credential.id}>
                  <TrainingCard credential={credential} />
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>
    </section>
  );
}
