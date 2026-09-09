export interface Credential {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credential?: string;
  duration?: string;
  evidenceUrl: string;
  description: string;
  featured?: boolean;
  showOnCv?: boolean;
}

export const certifications: Credential[] = [
  {
    id: "bnsp-pemrograman-software-komputer",
    name: "Pemrograman Software Komputer",
    issuer: "BNSP",
    date: "Oktober 2025 - Oktober 2028",
    credential: "TIK.383.13851.2025",
    evidenceUrl: "/certificates/bnsp-pemrograman-software-komputer.jpeg",
    description:
      "Sertifikat kompetensi bidang Teknologi Informasi melalui LSP Politeknik Negeri Malang.",
    featured: true,
    showOnCv: true,
  },
  {
    id: "ai-engineer-for-developers-associate",
    name: "AI Engineer for Developers Associate",
    issuer: "DataCamp Certified",
    date: "14 Agustus 2026",
    credential: "AIEDA0017981166978",
    evidenceUrl: "/certificates/datacamp-ai-engineer-developers.pdf",
    description: "Sertifikasi associate untuk pengembangan aplikasi dan solusi berbasis AI.",
    showOnCv: true,
  },
  {
    id: "ai-engineer-for-data-scientists-associate",
    name: "AI Engineer for Data Scientists Associate",
    issuer: "DataCamp Certified",
    date: "14 Agustus 2026",
    credential: "AEDS0014904938096",
    evidenceUrl: "/certificates/datacamp-ai-engineer-data-scientists.pdf",
    description: "Sertifikasi associate untuk penerapan AI dalam alur kerja data science.",
    showOnCv: true,
  },
  {
    id: "data-governance-fundamentals",
    name: "Data Governance Fundamentals",
    issuer: "DataCamp Certified",
    date: "10 Agustus 2026",
    credential: "DG0029290758063",
    evidenceUrl: "/certificates/datacamp-data-governance-fundamentals.pdf",
    description: "Validasi fundamental tata kelola, kualitas, dan tanggung jawab data.",
  },
  {
    id: "ai-fundamentals",
    name: "AI Fundamentals",
    issuer: "DataCamp Certified",
    date: "9 Agustus 2026",
    credential: "AIF0024253008942",
    evidenceUrl: "/certificates/datacamp-ai-fundamentals.pdf",
    description: "Validasi konsep inti artificial intelligence dan penerapannya.",
  },
  {
    id: "data-literacy",
    name: "Data Literacy",
    issuer: "DataCamp Certified",
    date: "9 Agustus 2026",
    credential: "DL0036029469439",
    evidenceUrl: "/certificates/datacamp-data-literacy.pdf",
    description: "Validasi kemampuan memahami, menginterpretasi, dan mengomunikasikan data.",
  },
];

export const trainings: Credential[] = [
  {
    id: "database-design",
    name: "Database Design",
    issuer: "DataCamp",
    date: "14 Agustus 2026",
    credential: "49,261,115",
    duration: "4 jam",
    evidenceUrl: "/certificates/datacamp-database-design.pdf",
    description: "Statement of accomplishment untuk pelatihan perancangan basis data.",
  },
  {
    id: "github-foundations",
    name: "GitHub Foundations",
    issuer: "DataCamp",
    date: "10 Agustus 2026",
    credential: "910,456",
    duration: "9 jam",
    evidenceUrl: "/certificates/datacamp-github-foundations.pdf",
    description: "Statement of accomplishment untuk dasar penggunaan GitHub.",
  },
  {
    id: "intermediate-git",
    name: "Intermediate Git",
    issuer: "DataCamp",
    date: "10 Agustus 2026",
    credential: "49,200,731",
    duration: "2 jam",
    evidenceUrl: "/certificates/datacamp-intermediate-git.pdf",
    description: "Statement of accomplishment untuk penggunaan Git tingkat menengah.",
  },
  {
    id: "introduction-to-git",
    name: "Introduction to Git",
    issuer: "DataCamp",
    date: "9 Agustus 2026",
    credential: "49,191,909",
    duration: "2 jam",
    evidenceUrl: "/certificates/datacamp-introduction-to-git.pdf",
    description: "Statement of accomplishment untuk dasar version control dengan Git.",
  },
  {
    id: "python-essentials-1",
    name: "Python Essentials 1",
    issuer: "Cisco Networking Academy",
    date: "29 Agustus 2024",
    credential: "838bcce0-df03-44ff-9392-a570c53c6cb5",
    evidenceUrl: "/certificates/cisco-python-essentials-1.pdf",
    description: "Certificate of course completion untuk fundamental pemrograman Python.",
  },
  {
    id: "operating-systems-basics",
    name: "Operating Systems Basics",
    issuer: "Cisco Networking Academy",
    date: "5 Juni 2024",
    credential: "e963f05b-b684-4a77-9f48-f30df12dcac9",
    evidenceUrl: "/certificates/cisco-operating-systems-basics.pdf",
    description: "Certificate of course completion untuk dasar sistem operasi.",
  },
  {
    id: "computer-hardware-basics",
    name: "Computer Hardware Basics",
    issuer: "Cisco Networking Academy",
    date: "5 Juni 2024",
    credential: "af26116d-ccf9-4b01-8201-66a87c74a3ba",
    evidenceUrl: "/certificates/cisco-computer-hardware-basics.pdf",
    description: "Certificate of course completion untuk dasar perangkat keras komputer.",
  },
];
