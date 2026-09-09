import { unstable_cache } from "next/cache";
import { createAnonymousSupabaseClient, isMissingRelationError } from "@/lib/supabase/anonymous";

export const PROJECTS_CACHE_TAG = "public-projects";

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string | null;
  demo: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
}

const fallbackProjects: Project[] = [
  {
    id: "todo-ai",
    title: "Todo AI",
    description:
      "Aplikasi manajemen tugas Laravel dengan Matriks Eisenhower, Google Classroom, Gemini AI, Google OAuth, Telegram Bot dua arah, kalender, dan laporan analitik.",
    tech: ["Laravel 12", "PHP", "MySQL", "Gemini API", "Google Classroom API", "Telegram Bot"],
    github: "https://github.com/shuriza/todos",
    demo: null,
    featured: true,
    published: true,
    sort_order: 0,
  },
  {
    id: "rekap-absensi-dpmptsp",
    title: "Sistem Rekap Absensi DPMPTSP",
    description:
      "Sistem Laravel untuk impor dan validasi data absensi, pengelolaan izin, dashboard analitik, serta laporan bulanan dan tahunan dalam format Excel dan PDF.",
    tech: ["Laravel 12", "PHP", "MySQL", "Alpine.js", "Laravel Excel", "DomPDF"],
    github: "https://github.com/shuriza/rekap_absensi",
    demo: null,
    featured: false,
    published: true,
    sort_order: 1,
  },
  {
    id: "kandangan-fresh",
    title: "Kandangan Fresh",
    description:
      "Marketplace Laravel untuk petani bawang merah dengan katalog, role admin dan pelanggan, Google OAuth, pembayaran Midtrans, invoice PDF, dan laporan penjualan.",
    tech: ["Laravel 11", "PHP", "MySQL", "Midtrans", "Laravel Socialite", "DomPDF"],
    github: "https://github.com/shuriza/bawang",
    demo: null,
    featured: false,
    published: true,
    sort_order: 2,
  },
  {
    id: "shuriza-store",
    title: "Shuriza Store",
    description:
      "Platform e-commerce Laravel 12 untuk produk digital dengan checkout guest, pembayaran multi-gateway, sinkronisasi stok supplier, alokasi kredensial, dan otomasi fulfillment melalui bot WhatsApp serta Telegram.",
    tech: [
      "Laravel 12",
      "MySQL",
      "Blade",
      "Tailwind CSS",
      "Payment Gateway",
      "Bot Automation",
    ],
    github: "https://github.com/shuriza/shuriza-store",
    demo: "https://shurizastore.biz.id/",
    featured: false,
    published: true,
    sort_order: 3,
  },
  {
    id: "cosplaynesia",
    title: "CosplayNesia",
    description:
      "Masih dalam pengembangan — marketplace penyewaan dan pembelian kostum cosplay dengan checkout atomik, reservasi sewa, fulfillment multi-penjual, dan ulasan pembeli terverifikasi.",
    tech: ["Laravel 13", "PHP", "SQLite", "Blade", "JavaScript"],
    github: "https://github.com/shuriza/CosplayNesia",
    demo: null,
    featured: false,
    published: true,
    sort_order: 4,
  },
  {
    id: "focus-tracker",
    title: "Focus Tracker",
    description:
      "Masih dalam pengembangan — pencatat durasi browsing dan pemblokir distraksi melalui ekstensi Chrome, sinkronisasi Supabase, aturan kuota domain, dan dashboard analitik tujuh hari.",
    tech: ["Next.js 16", "TypeScript", "Supabase", "Chrome Extension MV3", "Recharts"],
    github: "https://github.com/shuriza/focus-tracker",
    demo: null,
    featured: false,
    published: true,
    sort_order: 5,
  },
];

const getCachedPublishedProjects = unstable_cache(async (): Promise<Project[]> => {
  const supabase = createAnonymousSupabaseClient();
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

  const response = await supabase
    .from("portfolio_projects")
    .select("id, title, description, tech, github, demo, featured, published, sort_order")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });
  const { data, error } = isMissingRelationError(response.error, "portfolio_projects")
    ? await supabase
        .from("projects")
        .select("id, title, description, tech, github, demo, featured, published, sort_order")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
    : response;

  if (error) {
    console.error("[projects] gagal memuat data publik:", error);
    return fallbackProjects;
  }

  return (data ?? []) as unknown as Project[];
}, [PROJECTS_CACHE_TAG], { tags: [PROJECTS_CACHE_TAG], revalidate: 300 });

export async function getPublishedProjects(): Promise<Project[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return fallbackProjects;
  }

  return getCachedPublishedProjects();
}
