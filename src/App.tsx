import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  Code2,
  Coins,
  Gamepad2,
  GraduationCap,
  Laptop,
  Layers3,
  LogOut,
  MapPin,
  MonitorSmartphone,
  Phone,
  Presentation,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  UserPlus,
  UsersRound,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

import {
  fetchCoinStudents,
  deleteCoinStudent,
  insertCoinStudent,
  updateCoinStudent,
  type CoinStudent,
} from "./coinStudentsApi";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type Course = {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: string;
};

type Advantage = {
  title: string;
  text: string;
  icon: LucideIcon;
};

type TeacherCredential = {
  login: string;
  password: string;
  name: string;
};

type CoinRole = "teacher" | "student";

type TeacherSession = {
  login: string;
  name: string;
  createdAt: number;
  provider?: "local" | "supabase";
};

type StudentFieldType = "text" | "number" | "select" | "date";

const studentFormFields: Array<[keyof CoinStudent, string, StudentFieldType]> =
  [
    ["firstName", "Ism", "text"],
    ["lastName", "Familiya", "text"],
    ["age", "Yosh", "number"],
    ["phone", "Telefon", "text"],
    ["direction", "Yo'nalish", "select"],
    ["level", "Level", "select"],
    ["joinedAt", "Qabul qilingan", "date"],
    ["coins", "Coin ball", "number"],
    ["progress", "Progress", "number"],
  ];

function TelegramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path d="M21.94 4.18a1.45 1.45 0 0 0-1.52-.22L2.92 10.72a1.28 1.28 0 0 0 .1 2.44l4.47 1.38 1.72 5.52a1.3 1.3 0 0 0 2.24.47l2.5-2.55 4.44 3.27a1.46 1.46 0 0 0 2.29-.9l2.16-14.78a1.45 1.45 0 0 0-.9-1.39ZM9.46 13.96l8.73-5.5-6.78 7.06-.28 3.1-1.67-4.66Z" />
    </svg>
  );
}

function CoinWatermark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 160 160"
    >
      <circle cx="80" cy="80" r="58" fill="currentColor" opacity="0.16" />
      <circle
        cx="80"
        cy="80"
        r="43"
        stroke="currentColor"
        strokeWidth="9"
        opacity="0.34"
      />
      <path
        d="M96 58H72c-9 0-16 7-16 16s7 16 16 16h16c6 0 10 4 10 10s-4 10-10 10H61"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="10"
        opacity="0.48"
      />
      <path
        d="M80 43v75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="10"
        opacity="0.48"
      />
    </svg>
  );
}

const navItems: NavItem[] = [
  { label: "Kurslar", href: "/#courses", icon: BookOpenCheck },
  { label: "Afzallik", href: "/#advantages", icon: BadgeCheck },
  { label: "Natijalar", href: "/#results", icon: Star },
  { label: "Aloqa", href: "/#contact", icon: Phone },
];

const courses: Course[] = [
  {
    title: "Web dasturlash",
    description:
      "HTML, CSS, JavaScript va React orqali sayt va web ilovalar yaratish.",
    icon: MonitorSmartphone,
    tone: "text-cyan-200 bg-cyan-300/10 border-cyan-200/20",
  },
  {
    title: "Backend dasturlash",
    description:
      "Server, ma'lumotlar bazasi va API bilan ishlash asoslarini o'rganish.",
    icon: Layers3,
    tone: "text-emerald-200 bg-emerald-300/10 border-emerald-200/20",
  },
  {
    title: "IT Kids",
    description:
      "Bolalar uchun kompyuter savodxonligi, mantiq va qiziqarli kodlash.",
    icon: Gamepad2,
    tone: "text-amber-200 bg-amber-300/10 border-amber-200/20",
  },
  {
    title: "Robototexnika",
    description:
      "Robot qurilmalari, sensorlar va elektronika bilan amaliy mashg'ulotlar.",
    icon: Bot,
    tone: "text-rose-200 bg-rose-300/10 border-rose-200/20",
  },
];

const advantages: Advantage[] = [
  {
    title: "Amaliy dars formati",
    text: "Har bir mavzu mashq, topshiriq va real loyihalar orqali mustahkamlanadi.",
    icon: Code2,
  },
  {
    title: "Kichik guruhlar",
    text: "Ustoz har bir o'quvchining savoli va rivojlanishiga alohida e'tibor beradi.",
    icon: UsersRound,
  },
  {
    title: "Natijaga yo'naltirilgan ta'lim",
    text: "O'quvchi bosqichma-bosqich bilim oladi va o'z ishlarini portfolio qilib yig'adi.",
    icon: BriefcaseBusiness,
  },
];

const results = [
  {
    value: "12+",
    label: "amaliy modul",
    description: "Har bir bosqich yakunida kichik loyiha va topshiriqlar.",
    icon: BookOpenCheck,
    tone: "text-sky-200 bg-sky-300/10 border-sky-300/20",
  },
  {
    value: "4.9",
    label: "o'quvchilar bahosi",
    description: "Dars sifati, ustoz yordami va muhit bo'yicha fikrlar.",
    icon: Star,
    tone: "text-amber-200 bg-amber-300/10 border-amber-300/20",
  },
  {
    value: "80%",
    label: "darsda amaliyot",
    description:
      "Darsning asosiy qismi mashq, kod yozish va tahlilga ajratiladi.",
    icon: Code2,
    tone: "text-emerald-200 bg-emerald-300/10 border-emerald-300/20",
  },
];

const academyLocation = {
  label: "Bizning manzil",
  coordinates: "Sergeli Filiali",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=41.228333,69.210106",
};

const STUDENTS_STORAGE_KEY = "codetime_coin_students";
const AUTH_SESSION_STORAGE_KEY = "codetime_teacher_session";
const directionOptions = [
  "Web dasturlash",
  "IT Kids",
  "Robototexnika",
  "Kiberxavfsizlik",
];
const levelOptions = ["Starter", "Bronze", "Silver", "Gold", "Platinum"];

const teacherCredentials: TeacherCredential[] = [
  {
    login: "Anvar",
    password: "901234567",
    name: "Anvar",
  },
  {
    login: "Sarik",
    password: "501",
    name: "Sarik",
  },
];

function getStoredTeacherSession(): TeacherSession | null {
  if (isSupabaseConfigured) {
    return null;
  }

  const savedSession = window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!savedSession) {
    return null;
  }

  try {
    const session = JSON.parse(savedSession) as TeacherSession;
    const hasKnownTeacher = teacherCredentials.some(
      (teacher) =>
        teacher.login === session.login && teacher.name === session.name,
    );

    if (
      !hasKnownTeacher ||
      typeof session.createdAt !== "number" ||
      Number.isNaN(session.createdAt)
    ) {
      window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
      return null;
    }

    return session;
  } catch {
    window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }
}

function saveTeacherSession(teacher: TeacherCredential) {
  const session: TeacherSession = {
    login: teacher.login,
    name: teacher.name,
    createdAt: Date.now(),
    provider: "local",
  };

  window.sessionStorage.setItem(
    AUTH_SESSION_STORAGE_KEY,
    JSON.stringify(session),
  );

  return session;
}

function clearTeacherSession() {
  window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

function getTeacherEmail(login: string) {
  const normalizedLogin = login.trim().toLowerCase();

  return normalizedLogin.includes("@")
    ? normalizedLogin
    : `${normalizedLogin}@codetime.local`;
}

function getTeacherName(loginOrEmail: string) {
  const login = loginOrEmail.split("@")[0] || "Ustoz";

  return login.charAt(0).toUpperCase() + login.slice(1);
}

function getCurrentJoinedAt() {
  return new Date().toISOString().slice(0, 10);
}

function getDateInputValue(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const yearMatch = value.match(/\d{4}/);

  return yearMatch ? `${yearMatch[0]}-01-01` : getCurrentJoinedAt();
}

function createEmptyStudent(): CoinStudent {
  return {
    id: "",
    firstName: "",
    lastName: "",
    age: 10,
    phone: "",
    direction: "Web dasturlash",
    coins: 0,
    level: "Starter",
    progress: 0,
    joinedAt: getCurrentJoinedAt(),
  };
}

function createStudentId(
  student: CoinStudent,
  existingStudents: CoinStudent[],
) {
  const baseId =
    `${student.firstName}-${student.lastName}`
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "student";
  let nextId = baseId;
  let index = 2;

  while (
    existingStudents.some((existingStudent) => existingStudent.id === nextId)
  ) {
    nextId = `${baseId}-${index}`;
    index += 1;
  }

  return nextId;
}

function normalizeStudent(student: CoinStudent): CoinStudent {
  const normalizedDirection = directionOptions.includes(student.direction)
    ? student.direction
    : directionOptions[0];
  const normalizedLevel = levelOptions.includes(student.level)
    ? student.level
    : levelOptions[0];

  return {
    ...student,
    firstName: student.firstName.trim(),
    lastName: student.lastName.trim(),
    phone: student.phone.trim(),
    direction: normalizedDirection,
    level: normalizedLevel,
    joinedAt: getDateInputValue(student.joinedAt.trim()),
    age: Math.max(1, Number(student.age) || 1),
    coins: Math.max(0, Number(student.coins) || 0),
    progress: Math.min(100, Math.max(0, Number(student.progress) || 0)),
  };
}

const coinStudents: CoinStudent[] = [
  {
    id: "azizbek-karimov",
    firstName: "Azizbek",
    lastName: "Karimov",
    age: 16,
    phone: "+998 90 123 45 67",
    direction: "Web dasturlash",
    coins: 1280,
    level: "Gold",
    progress: 86,
    joinedAt: "2026-01-10",
  },
  {
    id: "jasurbek-rasulov",
    firstName: "Jasurbek",
    lastName: "Rasulov",
    age: 15,
    phone: "+998 91 234 56 78",
    direction: "Robototexnika",
    coins: 1110,
    level: "Gold",
    progress: 81,
    joinedAt: "2026-02-12",
  },
  {
    id: "madina-tursunova",
    firstName: "Madina",
    lastName: "Tursunova",
    age: 17,
    phone: "+998 93 345 67 89",
    direction: "Kiberxavfsizlik",
    coins: 1045,
    level: "Silver",
    progress: 74,
    joinedAt: "2026-01-18",
  },
  {
    id: "imrona-qodirova",
    firstName: "Imrona",
    lastName: "Qodirova",
    age: 14,
    phone: "+998 94 456 78 90",
    direction: "Robototexnika",
    coins: 940,
    level: "Silver",
    progress: 69,
    joinedAt: "2026-03-08",
  },
  {
    id: "javohir-sobirov",
    firstName: "Javohir",
    lastName: "Sobirov",
    age: 16,
    phone: "+998 95 567 89 01",
    direction: "Web dasturlash",
    coins: 920,
    level: "Silver",
    progress: 68,
    joinedAt: "2026-02-21",
  },
  {
    id: "sardor-olimov",
    firstName: "Sardor",
    lastName: "Olimov",
    age: 15,
    phone: "+998 97 678 90 12",
    direction: "Web dasturlash",
    coins: 870,
    level: "Silver",
    progress: 63,
    joinedAt: "2026-04-05",
  },
  {
    id: "diyorbek-hakimov",
    firstName: "Diyorbek",
    lastName: "Hakimov",
    age: 17,
    phone: "+998 88 789 01 23",
    direction: "Kiberxavfsizlik",
    coins: 830,
    level: "Bronze",
    progress: 61,
    joinedAt: "2026-03-16",
  },
  {
    id: "sevinch-akmalova",
    firstName: "Sevinch",
    lastName: "Akmalova",
    age: 12,
    phone: "+998 99 890 12 34",
    direction: "IT Kids",
    coins: 760,
    level: "Bronze",
    progress: 55,
    joinedAt: "2026-01-25",
  },
  {
    id: "muhammadali-ergashev",
    firstName: "Muhammadali",
    lastName: "Ergashev",
    age: 11,
    phone: "+998 90 901 23 45",
    direction: "IT Kids",
    coins: 690,
    level: "Bronze",
    progress: 48,
    joinedAt: "2026-04-13",
  },
  {
    id: "malika-nurmatova",
    firstName: "Malika",
    lastName: "Nurmatova",
    age: 10,
    phone: "+998 91 012 34 56",
    direction: "IT Kids",
    coins: 620,
    level: "Starter",
    progress: 42,
    joinedAt: "2026-05-09",
  },
];

function Header() {
  const [isCoursesMenuOpen, setIsCoursesMenuOpen] = useState(false);
  const coursesMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isCoursesMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        coursesMenuRef.current &&
        !coursesMenuRef.current.contains(event.target as Node)
      ) {
        setIsCoursesMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isCoursesMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.12),transparent_34%),linear-gradient(90deg,rgba(11,15,18,0.94),rgba(11,15,18,0.88))] backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-[min(1328px,calc(100%-32px))] items-center gap-4 md:h-20 md:w-[min(1328px,calc(100%-48px))] md:gap-5">
        <a
          href="/"
          className="flex items-center gap-3 font-semibold text-white"
        >
          <span className="grid size-11 place-items-center rounded-xl bg-[#2dd4bf] text-[#07100f] shadow-[0_12px_30px_rgba(45,212,191,0.18)]">
            <Code2 size={23} />
          </span>
          <span className="text-xl">CodeTime</span>
        </a>

        <nav className="mx-auto hidden items-center gap-1 rounded-2xl border border-white/8 bg-white/[0.03] p-1.5 lg:flex">
          {navItems.map((item) => {
            if (item.label === "Kurslar") {
              return (
                <div key={item.href} ref={coursesMenuRef}>
                  <button
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
                    type="button"
                    aria-expanded={isCoursesMenuOpen}
                    onClick={() => setIsCoursesMenuOpen((isOpen) => !isOpen)}
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`transition duration-200 ${
                        isCoursesMenuOpen
                          ? "rotate-180 text-[#2dd4bf]"
                          : "text-zinc-500"
                      }`}
                    />
                  </button>

                  <div
                    className={`fixed left-0 right-0 top-20 h-[40svh] min-h-[330px] border-y border-white/10 bg-[#101719]/98 shadow-2xl shadow-black/45 backdrop-blur-xl transition duration-200 ${
                      isCoursesMenuOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-[-8px] opacity-0"
                    }`}
                  >
                    <div className="mx-auto grid h-full w-[min(1328px,calc(100%-48px))] gap-6 py-6 lg:grid-cols-[1fr_360px]">
                      <div className="min-h-0">
                        <span className="text-xs font-black uppercase text-[#2dd4bf]">
                          Kurslar
                        </span>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {courses.map((course) => {
                            const Icon = course.icon;

                            return (
                              <a
                                key={course.title}
                                href="#courses"
                                className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.035] p-4 transition hover:border-[#2dd4bf]/30 hover:bg-white/[0.07]"
                              >
                                <span
                                  className={`grid size-13 shrink-0 place-items-center rounded-2xl border ${course.tone}`}
                                >
                                  <Icon size={24} />
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-base font-black text-white">
                                    {course.title}
                                  </span>
                                  <span className="mt-1 line-clamp-2 block text-sm leading-6 text-zinc-500">
                                    {course.description}
                                  </span>
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="w-full rounded-2xl border border-white/10 bg-[#151d1f] p-5">
                          <span className="grid size-12 place-items-center rounded-xl bg-[#2dd4bf]/10 text-[#2dd4bf]">
                            <Phone size={23} />
                          </span>
                          <h3 className="mt-5 text-2xl font-black text-white">
                            Bepul konsultatsiya
                          </h3>
                          <p className="mt-3 text-sm leading-6 text-zinc-400">
                            Telefon raqamingizni yozib qoldiring, biz sizga
                            qo'ng'iroq qilamiz va savollaringizga javob beramiz.
                          </p>

                          <div className="mt-5 grid gap-2">
                            <input
                              className="h-11 rounded-xl border border-white/10 bg-[#0c1214] px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#2dd4bf] focus:ring-4 focus:ring-[#2dd4bf]/10"
                              placeholder="Ismingiz"
                              type="text"
                            />
                            <input
                              className="h-11 rounded-xl border border-white/10 bg-[#0c1214] px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#2dd4bf] focus:ring-4 focus:ring-[#2dd4bf]/10"
                              placeholder="+998 90 123 45 67"
                              type="tel"
                            />
                            <button
                              className="h-11 rounded-xl bg-[#0f9f8e] px-4 text-sm font-black text-white transition hover:bg-[#14b8a6]"
                              type="button"
                            >
                              Yuborish
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <a
          href="https://t.me/codetime_admin"
          target="_blank"
          className="ml-auto inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-white transition hover:border-[#2dd4bf]/45 hover:bg-white/[0.09] sm:h-12 sm:px-4"
        >
          <span className="text-[#2dd4bf]">
            <TelegramIcon size={18} />
          </span>
          Online ta'lim
        </a>
      </div>
    </header>
  );
}

function SectionHeading({
  kicker,
  title,
  text,
  align = "center",
}: {
  kicker: string;
  title: string;
  text?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={
        align === "center" ? "mx-auto mb-10 max-w-2xl text-center" : "max-w-xl"
      }
    >
      <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase text-[#2dd4bf]">
        <Zap size={15} />
        {kicker}
      </span>
      <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
        {title}
      </h2>
      {text ? (
        <p className="mt-4 text-base leading-7 text-zinc-400">{text}</p>
      ) : null}
    </div>
  );
}

function Hero({ onOpenCoinLogin }: { onOpenCoinLogin: () => void }) {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.13),transparent_36%),radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.08),transparent_30%)]"
    >
      <div className="mx-auto grid min-h-[calc(100svh-72px)] w-[min(1328px,calc(100%-32px))] items-center gap-8 py-10 md:min-h-[calc(100svh-80px)] md:w-[min(1328px,calc(100%-48px))] md:gap-10 md:py-14 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#2dd4bf]/25 bg-[#2dd4bf]/10 px-4 py-2 text-sm font-bold text-[#67e8f9]">
            <Sparkles size={17} />
            Zamonaviy IT ta'lim markazi
          </span>

          <h1 className="max-w-3xl text-4xl font-black leading-[1.05] text-white sm:text-5xl md:text-6xl">
            Dasturlashni amaliy tarzda o'rganing
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            CodeTime IT Academy bolalar va kattalar uchun zamonaviy IT
            ko'nikmalarini sodda, tushunarli va amaliy darslar orqali o'rgatadi.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row md:mt-8">
            <a
              href="#contact"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-[#5eead4]/25 bg-[#0f9f8e] px-6 font-bold text-white shadow-[0_14px_28px_rgba(20,184,166,0.16)] transition duration-300 hover:-translate-y-0.5 hover:border-[#99f6e4]/45 hover:bg-[#14b8a6] hover:shadow-[0_18px_38px_rgba(20,184,166,0.22)]"
            >
              Kursga yozilish
              <ArrowRight
                size={19}
                className="transition duration-300 group-hover:translate-x-1"
              />
            </a>
            <button
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-6 font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:border-amber-300/30 hover:bg-white/[0.07]"
              type="button"
              onClick={onOpenCoinLogin}
            >
              <Coins
                size={19}
                className="text-amber-300 transition duration-300 group-hover:rotate-12"
              />
              Coinlarni ko'rish
            </button>
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-2 sm:gap-3 md:mt-9">
            {[
              ["450+", "bitiruvchi"],
              ["4", "yo'nalish"],
              ["100%", "amaliy dars"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.055] p-3 sm:p-4"
              >
                <strong className="block text-xl font-black leading-none text-[#2dd4bf] sm:text-2xl">
                  {value}
                </strong>
                <span className="mt-2 block text-sm font-medium text-zinc-400">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40">
            <img
              className="h-[280px] w-full object-cover sm:h-[360px] md:h-[480px]"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85"
              alt="Kompyuterda birga dars qilayotgan talabalar"
            />
          </div>
          <div className="absolute bottom-3 left-3 right-3 grid gap-2 rounded-2xl border border-white/10 bg-[#101719]/92 p-3 shadow-2xl backdrop-blur sm:bottom-4 sm:left-4 sm:right-4 sm:gap-3 sm:p-4 md:left-auto md:w-72">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase text-[#2dd4bf]">
              <CalendarDays size={15} />
              Qabul ochiq
            </span>
            <strong className="text-xl leading-tight text-white">
              Birinchi sinov darsi bepul
            </strong>
            <p className="text-sm leading-6 text-zinc-400">
              Mos yo'nalishni tanlang, administrator siz bilan bog'lanadi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CoursesSection() {
  return (
    <section id="courses" className="py-14 md:py-24">
      <div className="mx-auto w-[min(1328px,calc(100%-32px))] md:w-[min(1328px,calc(100%-48px))]">
        <SectionHeading
          kicker="Yo'nalishlar"
          title="O'zingizga mos IT yo'nalishini tanlang"
          text="Har bir kursda nazariya qisqa tushuntiriladi, asosiy vaqt esa amaliy mashg'ulot va mustaqil ishlarga ajratiladi."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {courses.map((course) => {
            const Icon = course.icon;

            return (
              <article
                key={course.title}
                className="group rounded-2xl border border-white/10 bg-[#151d1f] p-5 transition hover:-translate-y-1 hover:border-[#2dd4bf]/35 hover:bg-[#1b2426] sm:p-6"
              >
                <div
                  className={`mb-6 grid size-14 place-items-center rounded-2xl border ${course.tone}`}
                >
                  <Icon size={27} />
                </div>
                <div className="mb-3">
                  <h3 className="text-xl font-bold leading-snug text-white">
                    {course.title}
                  </h3>
                </div>
                <p className="text-sm leading-7 text-zinc-400">
                  {course.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AdvantagesSection() {
  return (
    <section
      id="advantages"
      className="border-y border-white/8 bg-[#111719] py-14 md:py-24"
    >
      <div className="mx-auto grid w-[min(1328px,calc(100%-32px))] gap-8 md:w-[min(1328px,calc(100%-48px))] lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <SectionHeading
          align="left"
          kicker="Nega CodeTime?"
          title="O'quvchi tushunishi va natija qilishi uchun qulay muhit"
          text="Darslar kichik guruhlarda olib boriladi, ustozlar mavzuni sodda tushuntiradi va har bir topshiriq bo'yicha fikr beradi."
        />

        <div className="grid gap-4">
          {advantages.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="grid gap-4 rounded-2xl border border-white/10 bg-[#151d1f] p-5 transition hover:border-[#2dd4bf]/25 hover:bg-[#1b2426] sm:grid-cols-[56px_1fr]"
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-[#2dd4bf]/10 text-[#2dd4bf]">
                  <Icon size={26} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">
                    {item.text}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ResultsSection() {
  return (
    <section id="results" className="py-14 md:py-24">
      <div className="mx-auto w-[min(1328px,calc(100%-32px))] md:w-[min(1328px,calc(100%-48px))]">
        <div className="grid gap-4 md:grid-cols-3">
          {results.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#151d1f] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#2dd4bf]/25 hover:bg-[#1b2426] hover:shadow-[0_20px_42px_rgba(0,0,0,0.28)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`grid size-13 place-items-center rounded-2xl border ${item.tone}`}
                  >
                    <Icon size={25} />
                  </span>
                  <strong className="text-right text-4xl font-black leading-none text-white">
                    {item.value}
                  </strong>
                </div>

                <h3 className="mt-6 text-xl font-black text-white">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {item.description}
                </p>
                <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full w-2/3 rounded-full bg-[#2dd4bf] transition duration-300 group-hover:w-full" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MentorsSection() {
  return (
    <section className="border-y border-white/8 bg-[#111719] py-14 md:py-24">
      <div className="mx-auto grid w-[min(1328px,calc(100%-32px))] gap-8 md:w-[min(1328px,calc(100%-48px))] lg:grid-cols-[1fr_380px] lg:items-center">
        <SectionHeading
          align="left"
          kicker="Mentorlar"
          title="Ustozlar bilan amaliy mashg'ulotlar"
          text="O'quvchi dars davomida kod yozadi, savol beradi va xatolarini ustoz bilan birga tahlil qiladi."
        />

        <article className="rounded-2xl border border-white/10 bg-[#151d1f] p-6 sm:p-7">
          <span className="grid size-15 place-items-center rounded-2xl bg-[#2dd4bf]/10 text-[#2dd4bf]">
            <Presentation size={30} />
          </span>
          <h3 className="mt-6 text-2xl font-bold text-white">
            Doimiy tekshiruv va fikr-mulohaza
          </h3>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            Topshiriqlar tekshiriladi, qiyin mavzular qayta tushuntiriladi va
            keyingi o'sish uchun aniq tavsiyalar beriladi.
          </p>
        </article>
      </div>
    </section>
  );
}

function ContactSection() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isCourseMenuOpen, setIsCourseMenuOpen] = useState(false);
  const selectedCourseLabel = selectedCourse || "Kursni tanlang";

  return (
    <section id="contact" className="py-14 pb-28 md:py-24">
      <div className="mx-auto grid w-[min(1328px,calc(100%-32px))] gap-8 md:w-[min(1328px,calc(100%-48px))] lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <SectionHeading
            align="left"
            kicker="Qabul ochiq"
            title="Sinov darsi uchun bog'laning"
            text="Ismingiz va telefon raqamingizni qoldiring yoki Telegram orqali yozing. Administrator sizga yo'nalish va dars vaqti bo'yicha yordam beradi."
          />

          <div className="mt-7 grid gap-3">
            <a
              href="tel:+998771867766"
              target="_blank"
              className="inline-flex items-center gap-3 font-semibold text-white"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-[#2dd4bf]/10 text-[#2dd4bf]">
                <Phone size={20} />
              </span>
              +998 77 186 77 66
            </a>
            <a
              href="https://t.me/codetime_admin"
              target="_blank"
              className="inline-flex items-center gap-3 font-semibold text-white"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-[#2dd4bf]/10 text-[#2dd4bf]">
                <TelegramIcon size={20} />
              </span>
              Telegram admin
            </a>
          </div>

          <a
            href={academyLocation.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="group mt-6 grid gap-4 rounded-2xl border border-white/10 bg-[#151d1f] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#2dd4bf]/35 hover:bg-[#1b2426] hover:shadow-[0_18px_38px_rgba(0,0,0,0.24)] sm:grid-cols-[56px_1fr_auto] sm:items-center"
            aria-label={`${academyLocation.label} Google Mapsda ochish`}
          >
            <span className="grid size-14 place-items-center rounded-2xl border border-[#2dd4bf]/20 bg-[#2dd4bf]/10 text-[#2dd4bf] transition duration-300 group-hover:bg-[#2dd4bf]/15">
              <MapPin size={26} />
            </span>
            <span className="min-w-0">
              <span className="block text-lg font-black text-white">
                {academyLocation.label}
              </span>
              <span className="mt-1 block text-sm leading-6 text-zinc-400">
                Google Maps orqali manzilni ochish
              </span>
              <span className="mt-2 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-zinc-300">
                {academyLocation.coordinates}
              </span>
            </span>
            <span className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2dd4bf] px-4 text-sm font-black text-[#07100f] transition group-hover:bg-[#5eead4]">
              Ochish
              <ArrowRight size={17} />
            </span>
          </a>
        </div>

        <form className="grid gap-4 rounded-2xl border border-white/10 bg-[#151d1f] p-5 shadow-2xl shadow-black/35 sm:p-6">
          <label className="grid gap-2 text-sm font-semibold text-white">
            Ismingiz
            <input
              className="h-12 rounded-xl border border-white/10 bg-[#0c1214] px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#2dd4bf] focus:ring-4 focus:ring-[#2dd4bf]/10"
              placeholder="Masalan: Azizbek"
              type="text"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-white">
            Telefon raqamingiz
            <input
              className="h-12 rounded-xl border border-white/10 bg-[#0c1214] px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#2dd4bf] focus:ring-4 focus:ring-[#2dd4bf]/10"
              placeholder="+998 90 123 45 67"
              type="tel"
            />
          </label>

          <div className="relative grid gap-2 text-sm font-semibold text-white">
            Qiziqqan kurs
            <button
              className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0c1214] px-4 text-left text-white outline-none transition hover:border-white/18 focus:border-[#2dd4bf] focus:ring-4 focus:ring-[#2dd4bf]/10"
              type="button"
              aria-expanded={isCourseMenuOpen}
              onClick={() => setIsCourseMenuOpen((isOpen) => !isOpen)}
            >
              <span
                className={
                  selectedCourse ? "font-semibold text-white" : "text-zinc-600"
                }
              >
                {selectedCourseLabel}
              </span>
              <ArrowRight
                size={18}
                className={`text-[#2dd4bf] transition duration-300 ${
                  isCourseMenuOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            {isCourseMenuOpen ? (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-xl border border-white/10 bg-[#0c1214] p-2 shadow-2xl shadow-black/45">
                {courses.map((course) => {
                  const Icon = course.icon;
                  const isSelected = selectedCourse === course.title;

                  return (
                    <button
                      key={course.title}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                        isSelected
                          ? "bg-[#2dd4bf]/10 text-white"
                          : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                      }`}
                      type="button"
                      onClick={() => {
                        setSelectedCourse(course.title);
                        setIsCourseMenuOpen(false);
                      }}
                    >
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-lg border ${course.tone}`}
                      >
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold">
                          {course.title}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-zinc-500">
                          {course.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <button
            className="mt-2 inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-[#2dd4bf] px-6 font-bold text-[#07100f] transition hover:bg-[#5eead4]"
            type="button"
          >
            Ariza yuborish
            <ArrowRight size={19} />
          </button>
        </form>
      </div>
    </section>
  );
}

function BottomNavigation() {
  const [activeHref, setActiveHref] = useState(navItems[0].href);

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.replace("/#", ""));

    function updateActiveSection() {
      const scrollAnchor = window.scrollY + window.innerHeight * 0.42;
      let nextActiveHref = navItems[0].href;

      sectionIds.forEach((sectionId, index) => {
        const section = document.getElementById(sectionId);

        if (section && section.offsetTop <= scrollAnchor) {
          nextActiveHref = navItems[index].href;
        }
      });

      setActiveHref(nextActiveHref);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, []);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-white/10 bg-[#0b0f12]/95 px-2 pb-[calc(6px+env(safe-area-inset-bottom))] pt-2 shadow-[0_-16px_36px_rgba(0,0,0,0.34)] backdrop-blur-xl md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeHref === item.href;

        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`grid min-w-0 place-items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-bold transition ${
              isActive
                ? "bg-[#2dd4bf]/12 text-[#67e8f9] shadow-[inset_0_0_0_1px_rgba(103,232,249,0.18)]"
                : "text-zinc-500 hover:text-[#2dd4bf]"
            }`}
          >
            <Icon size={21} />
            <span className="max-w-full truncate">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

function TeacherLoginForm({
  onCancel,
  onLogin,
}: {
  onCancel?: () => void;
  onLogin: (login: string, password: string) => Promise<string | null>;
}) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleTeacherLogin() {
    setIsSubmitting(true);
    setError("");

    try {
      const loginError = await onLogin(login, password);

      if (loginError) {
        setError(loginError);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="relative mt-6 grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        handleTeacherLogin();
      }}
    >
      <label className="grid gap-2 text-sm font-semibold text-white">
        Login
        <input
          autoComplete="username"
          className="h-12 rounded-xl border border-white/10 bg-[#0c1214] px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#2dd4bf] focus:ring-4 focus:ring-[#2dd4bf]/10"
          placeholder="Login kiriting"
          value={login}
          onChange={(event) => {
            setLogin(event.target.value);
            setError("");
          }}
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-white">
        Parol
        <input
          autoComplete="current-password"
          className="h-12 rounded-xl border border-white/10 bg-[#0c1214] px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#2dd4bf] focus:ring-4 focus:ring-[#2dd4bf]/10"
          placeholder="Parol kiriting"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError("");
          }}
        />
      </label>

      {error ? (
        <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-200">
          {error}
        </p>
      ) : null}

      <div
        className={
          onCancel ? "grid gap-2 sm:grid-cols-[120px_1fr]" : "grid gap-2"
        }
      >
        {onCancel ? (
          <button
            className="h-12 rounded-xl border border-white/10 bg-white/[0.04] font-bold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
            type="button"
            onClick={onCancel}
          >
            Orqaga
          </button>
        ) : null}
        <button
          className="h-12 rounded-xl bg-[#0f9f8e] font-black text-white transition hover:bg-[#14b8a6] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Tekshirilmoqda..." : "Kirish"}
        </button>
      </div>
    </form>
  );
}

function AuthModal({
  onClose,
  onLogin,
  onStudentEnter,
}: {
  onClose: () => void;
  onLogin: (login: string, password: string) => Promise<string | null>;
  onStudentEnter: () => void;
}) {
  const [mode, setMode] = useState<"choice" | "teacher">("choice");

  return (
    <div
      className="coin-modal-backdrop fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="coin-modal-panel relative w-[min(520px,100%)] overflow-hidden rounded-2xl border border-white/10 bg-[#101719] p-6 shadow-2xl shadow-black/60"
        onClick={(event) => event.stopPropagation()}
      >
        <CoinWatermark className="pointer-events-none absolute -bottom-24 -right-20 size-72 text-amber-200 opacity-[0.055]" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-black uppercase text-amber-200">
              <Coins size={15} />
              Coin panel
            </span>
            <h2 className="mt-4 text-2xl font-black text-white">
              Kirish turini tanlang
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              O'quvchi faqat ko'radi, ustoz esa login-parol bilan tahrirlaydi.
            </p>
          </div>
          <button
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
            type="button"
            aria-label="Oynani yopish"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {mode === "choice" ? (
          <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
            <button
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left transition hover:border-amber-300/30 hover:bg-white/[0.07]"
              type="button"
              onClick={onStudentEnter}
            >
              <span className="grid size-12 place-items-center rounded-xl bg-amber-300/10 text-amber-200">
                <UsersRound size={24} />
              </span>
              <strong className="mt-4 block text-lg font-black text-white">
                O'quvchi sifatida
              </strong>
              <span className="mt-2 block text-sm leading-6 text-zinc-500">
                Coin ballar va o'quvchi ma'lumotlarini faqat ko'radi.
              </span>
            </button>

            <button
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left transition hover:border-[#2dd4bf]/30 hover:bg-white/[0.07]"
              type="button"
              onClick={() => setMode("teacher")}
            >
              <span className="grid size-12 place-items-center rounded-xl bg-[#2dd4bf]/10 text-[#2dd4bf]">
                <Presentation size={24} />
              </span>
              <strong className="mt-4 block text-lg font-black text-white">
                Ustoz sifatida
              </strong>
              <span className="mt-2 block text-sm leading-6 text-zinc-500">
                Login va parol bilan kirib, o'quvchilarni edit qiladi.
              </span>
            </button>
          </div>
        ) : (
          <TeacherLoginForm
            onCancel={() => setMode("choice")}
            onLogin={onLogin}
          />
        )}
      </div>
    </div>
  );
}

function LoginPage({
  onLogin,
}: {
  onLogin: (login: string, password: string) => Promise<string | null>;
}) {
  return (
    <section className="relative min-h-[calc(100svh-80px)] overflow-hidden py-10 md:py-16">
      <CoinWatermark className="pointer-events-none absolute -right-16 top-12 size-72 rotate-12 text-amber-200 opacity-[0.045] md:size-96" />
      <CoinWatermark className="pointer-events-none absolute -left-24 bottom-20 size-80 -rotate-12 text-[#2dd4bf] opacity-[0.035] md:size-[30rem]" />

      <div className="relative mx-auto grid min-h-[calc(100svh-180px)] w-[min(560px,calc(100%-48px))] place-items-center">
        <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#101719] p-6 shadow-2xl shadow-black/50">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-black uppercase text-amber-200">
            <ShieldCheck size={15} />
            Himoyalangan panel
          </span>
          <h1 className="mt-4 text-3xl font-black text-white">
            Ustoz login-paroli
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            O'quvchilar ma'lumotlarini tahrirlash uchun maxsus login va parolni
            kiriting.
          </p>

          <TeacherLoginForm onLogin={onLogin} />

          <a
            href="/"
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            <ArrowLeft size={18} />
            Bosh sahifa
          </a>
        </div>
      </div>
    </section>
  );
}

function StudentFormControl({
  field,
  inputType,
  value,
  onChange,
}: {
  field: keyof CoinStudent;
  inputType: StudentFieldType;
  value: string | number;
  onChange: (value: string | number) => void;
}) {
  const baseClassName =
    "h-11 w-full rounded-xl border border-white/10 bg-[#0c1214] px-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300/45 focus:ring-4 focus:ring-amber-300/10";

  if (field === "direction" || field === "level") {
    const options = field === "direction" ? directionOptions : levelOptions;

    return (
      <div className="relative">
        <select
          className={`${baseClassName} cursor-pointer appearance-none pr-11 font-semibold text-zinc-100 hover:border-white/20 hover:bg-[#141820]`}
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-[#101719] text-white"
            >
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-lg bg-white/[0.05] text-amber-200">
          <ChevronDown size={16} />
        </span>
      </div>
    );
  }

  return (
    <input
      className={baseClassName}
      min={inputType === "number" ? 0 : undefined}
      max={field === "progress" ? 100 : undefined}
      placeholder={field === "phone" ? "+998 90 123 45 67" : undefined}
      type={inputType === "date" ? "date" : inputType}
      value={inputType === "date" ? getDateInputValue(String(value)) : value}
      onChange={(event) =>
        onChange(
          inputType === "number"
            ? Number(event.target.value)
            : event.target.value,
        )
      }
    />
  );
}

function CoinsPage({
  role,
  teacherName,
  onLogout,
  onTeacherLoginClick,
}: {
  role: CoinRole;
  teacherName?: string;
  onLogout: () => void | Promise<void>;
  onTeacherLoginClick: () => void;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [students, setStudents] = useState<CoinStudent[]>(() => {
    const savedStudents = window.localStorage.getItem(STUDENTS_STORAGE_KEY);

    if (!savedStudents) {
      return coinStudents;
    }

    try {
      return JSON.parse(savedStudents) as CoinStudent[];
    } catch {
      return coinStudents;
    }
  });
  const [selectedStudent, setSelectedStudent] = useState<CoinStudent | null>(
    null,
  );
  const [editingStudent, setEditingStudent] = useState<CoinStudent | null>(
    null,
  );
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<CoinStudent>(() =>
    createEmptyStudent(),
  );
  const [addStudentError, setAddStudentError] = useState("");
  const [studentsError, setStudentsError] = useState("");
  const [isStudentsLoading, setIsStudentsLoading] =
    useState(isSupabaseConfigured);
  const isTeacher = role === "teacher";
  const rankedStudents = [...students].sort(
    (studentA, studentB) => studentB.coins - studentA.coins,
  );
  const filteredStudents = rankedStudents.filter((student) =>
    `${student.firstName} ${student.lastName} ${student.direction}`
      .toLowerCase()
      .includes(searchValue.trim().toLowerCase()),
  );
  const studentGroups = directionOptions.map((direction) => {
    const directionStudents = filteredStudents.filter(
      (student) => student.direction === direction,
    );
    const directionCoins = directionStudents.reduce(
      (sum, student) => sum + student.coins,
      0,
    );

    return {
      direction,
      students: directionStudents,
      totalCoins: directionCoins,
      averageProgress: directionStudents.length
        ? Math.round(
            directionStudents.reduce(
              (sum, student) => sum + student.progress,
              0,
            ) / directionStudents.length,
          )
        : 0,
    };
  });
  const totalCoins = students.reduce((sum, student) => sum + student.coins, 0);
  const averageCoins = students.length
    ? Math.round(totalCoins / students.length)
    : 0;
  const directionsCount = new Set(students.map((student) => student.direction))
    .size;

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    let isMounted = true;

    async function loadStudents() {
      setIsStudentsLoading(true);
      setStudentsError("");

      try {
        const remoteStudents = await fetchCoinStudents();

        if (isMounted) {
          setStudents(remoteStudents);
        }
      } catch {
        if (isMounted) {
          setStudentsError(
            "Database bilan ulanishda xatolik. Supabase sozlamalarini tekshiring.",
          );
        }
      } finally {
        if (isMounted) {
          setIsStudentsLoading(false);
        }
      }
    }

    loadStudents();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSaveStudent() {
    if (!isTeacher || !editingStudent) {
      return;
    }

    const normalizedStudent = normalizeStudent(editingStudent);
    setStudentsError("");

    try {
      const savedStudent = isSupabaseConfigured
        ? await updateCoinStudent(normalizedStudent)
        : normalizedStudent;
      const updatedStudents = students.map((student) =>
        student.id === savedStudent.id ? savedStudent : student,
      );

      setStudents(updatedStudents);

      if (!isSupabaseConfigured) {
        window.localStorage.setItem(
          STUDENTS_STORAGE_KEY,
          JSON.stringify(updatedStudents),
        );
      }

      setSelectedStudent(savedStudent);
      setEditingStudent(null);
    } catch {
      setStudentsError("O'quvchi ma'lumotlarini saqlashda xatolik yuz berdi.");
    }
  }

  function handleOpenAddStudent() {
    if (!isTeacher) {
      return;
    }

    setNewStudent(createEmptyStudent());
    setAddStudentError("");
    setIsAddStudentOpen(true);
  }

  async function handleAddStudent() {
    if (!isTeacher) {
      return;
    }

    const normalizedStudent = normalizeStudent({
      ...newStudent,
      id: createStudentId(newStudent, students),
    });

    if (
      !normalizedStudent.firstName ||
      !normalizedStudent.lastName ||
      !normalizedStudent.phone ||
      !normalizedStudent.direction
    ) {
      setAddStudentError(
        "Ism, familiya, telefon va yo'nalish maydonlarini to'ldiring.",
      );
      return;
    }

    try {
      const savedStudent = isSupabaseConfigured
        ? await insertCoinStudent(normalizedStudent)
        : normalizedStudent;
      const updatedStudents = [...students, savedStudent];

      setStudents(updatedStudents);

      if (!isSupabaseConfigured) {
        window.localStorage.setItem(
          STUDENTS_STORAGE_KEY,
          JSON.stringify(updatedStudents),
        );
      }

      setSearchValue("");
      setSelectedStudent(savedStudent);
      setEditingStudent(null);
      setIsAddStudentOpen(false);
      setNewStudent(createEmptyStudent());
      setAddStudentError("");
      setStudentsError("");
    } catch {
      setAddStudentError(
        "O'quvchini database'ga qo'shishda xatolik. Login yoki Supabase RLS sozlamasini tekshiring.",
      );
    }
  }

  async function handleDeleteStudent() {
    if (!isTeacher || !selectedStudent) {
      return;
    }

    const shouldDelete = window.confirm(
      `${selectedStudent.firstName} ${selectedStudent.lastName} o'chirilsinmi?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      if (isSupabaseConfigured) {
        await deleteCoinStudent(selectedStudent.id);
      }

      const updatedStudents = students.filter(
        (student) => student.id !== selectedStudent.id,
      );

      setStudents(updatedStudents);

      if (!isSupabaseConfigured) {
        window.localStorage.setItem(
          STUDENTS_STORAGE_KEY,
          JSON.stringify(updatedStudents),
        );
      }

      setSelectedStudent(null);
      setEditingStudent(null);
      setStudentsError("");
    } catch {
      setStudentsError("O'quvchini o'chirishda xatolik yuz berdi.");
    }
  }

  return (
    <>
      <section className="relative min-h-[calc(100svh-80px)] overflow-hidden py-10 md:py-16">
        <CoinWatermark className="pointer-events-none absolute -right-16 top-12 size-72 rotate-12 text-amber-200 opacity-[0.045] md:size-96" />
        <CoinWatermark className="pointer-events-none absolute -left-24 bottom-28 size-80 -rotate-12 text-[#2dd4bf] opacity-[0.035] md:size-[30rem]" />

        <div className="relative mx-auto w-[min(1328px,calc(100%-48px))]">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <a
              href="/"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft size={18} />
              Bosh sahifa
            </a>
            {isTeacher ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#2dd4bf]/20 bg-[#2dd4bf]/10 px-4 text-sm font-bold text-[#2dd4bf] transition hover:bg-[#2dd4bf]/15"
                  type="button"
                  onClick={handleOpenAddStudent}
                >
                  <UserPlus size={18} />
                  O'quvchi qo'shish
                </button>
                <button
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-red-300/20 bg-red-400/10 px-4 text-sm font-bold text-red-100 transition hover:bg-red-400/15"
                  type="button"
                  onClick={onLogout}
                >
                  <LogOut size={18} />
                  Chiqish
                </button>
              </div>
            ) : (
              <button
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#2dd4bf]/20 bg-[#2dd4bf]/10 px-4 text-sm font-bold text-[#2dd4bf] transition hover:bg-[#2dd4bf]/15"
                type="button"
                onClick={onTeacherLoginClick}
              >
                <Presentation size={18} />
                Ustoz sifatida
              </button>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-200">
                <Coins size={17} />
                CodeTime coin reytingi
              </span>
              <h1 className="max-w-3xl text-4xl font-black leading-tight text-white md:text-5xl">
                O'quvchilar coin ballari
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
                Har bir o'quvchi kartasiga bosing va uning to'liq ma'lumotlarini
                ko'ring.
              </p>
              <span
                className={`mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black ${
                  isTeacher
                    ? "border-[#2dd4bf]/25 bg-[#2dd4bf]/10 text-[#2dd4bf]"
                    : "border-white/10 bg-white/[0.04] text-zinc-400"
                }`}
              >
                {isTeacher
                  ? `O'qituvchi rejimi: ${teacherName}`
                  : "O'quvchi rejimi"}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  value: students.length,
                  label: "o'quvchi",
                  icon: UsersRound,
                },
                {
                  value: totalCoins.toLocaleString("en-US"),
                  label: "jami coin",
                  icon: Coins,
                },
                {
                  value: averageCoins.toLocaleString("en-US"),
                  label: "o'rtacha coin",
                  icon: Star,
                },
              ].map((stat) => {
                const Icon = stat.icon;

                return (
                  <article
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-[#151d1f] p-5"
                  >
                    <span className="grid size-11 place-items-center rounded-xl bg-amber-300/10 text-amber-200">
                      <Icon size={21} />
                    </span>
                    <strong className="mt-4 block text-3xl font-black text-white">
                      {stat.value}
                    </strong>
                    <span className="mt-2 block text-sm font-semibold text-zinc-500">
                      {stat.label}
                    </span>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-[#111719] p-4 sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-center">
              <div>
                <span className="text-sm font-bold uppercase text-amber-200">
                  Umumiy ro'yxat
                </span>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {directionsCount} ta yo'nalish bo'yicha barcha o'quvchilar
                  tartiblangan.
                </p>
              </div>
              <label className="relative block">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={20}
                />
                <input
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#0b0d11] pl-12 pr-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300/45 focus:ring-4 focus:ring-amber-300/10"
                  placeholder="Ism, familiya yoki yo'nalish"
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                />
              </label>
            </div>
          </div>

          {isStudentsLoading ? (
            <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm font-bold text-amber-100">
              Database'dan o'quvchilar yuklanmoqda...
            </div>
          ) : null}

          {studentsError ? (
            <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-sm font-semibold text-red-100">
              {studentsError}
            </div>
          ) : null}

          {isTeacher ? (
            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              {studentGroups.map((group) => (
                <article
                  key={group.direction}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#151d1f]"
                >
                  <div className="relative overflow-hidden border-b border-white/10 p-5">
                    <CoinWatermark className="pointer-events-none absolute -right-10 -top-14 size-44 text-amber-200 opacity-[0.05]" />
                    <div className="relative flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-black uppercase text-amber-200">
                          Yo'nalish
                        </span>
                        <h2 className="mt-2 text-2xl font-black text-white">
                          {group.direction}
                        </h2>
                      </div>
                      <span className="rounded-full border border-[#2dd4bf]/20 bg-[#2dd4bf]/10 px-3 py-1 text-sm font-black text-[#2dd4bf]">
                        {group.students.length} o'quvchi
                      </span>
                    </div>

                    <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <span className="text-xs font-bold uppercase text-zinc-500">
                          Jami coin
                        </span>
                        <strong className="mt-1 block text-xl font-black text-amber-200">
                          {group.totalCoins.toLocaleString("en-US")}
                        </strong>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <span className="text-xs font-bold uppercase text-zinc-500">
                          O'rtacha progress
                        </span>
                        <strong className="mt-1 block text-xl font-black text-white">
                          {group.averageProgress}%
                        </strong>
                      </div>
                    </div>
                  </div>

                  {group.students.length ? (
                    <div className="divide-y divide-white/10">
                      {group.students.map((student) => {
                        const rank =
                          rankedStudents.findIndex(
                            (rankedStudent) => rankedStudent.id === student.id,
                          ) + 1;

                        return (
                          <button
                            key={student.id}
                            className="group grid w-full gap-4 p-4 text-left transition hover:bg-white/[0.04] md:grid-cols-[44px_1fr_130px]"
                            type="button"
                            onClick={() => {
                              setSelectedStudent(student);
                              setEditingStudent(null);
                            }}
                          >
                            <span className="grid size-11 place-items-center rounded-xl border border-amber-300/20 bg-amber-300/10 text-sm font-black text-amber-200">
                              {rank}
                            </span>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-black text-white">
                                  {student.firstName} {student.lastName}
                                </h3>
                                <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-bold text-zinc-300">
                                  {student.level}
                                </span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-2 text-sm font-semibold text-zinc-500">
                                <span>{student.age} yosh</span>
                                <span className="text-zinc-700">/</span>
                                <span>{student.progress}% progress</span>
                              </div>
                              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                                <div
                                  className="h-full rounded-full bg-amber-300"
                                  style={{ width: `${student.progress}%` }}
                                />
                              </div>
                            </div>

                            <div className="md:text-right">
                              <strong className="block text-2xl font-black leading-none text-amber-200">
                                {student.coins.toLocaleString("en-US")}
                              </strong>
                              <span className="mt-1 block text-xs font-bold text-zinc-500">
                                coin ball
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="font-bold text-white">
                        {searchValue.trim()
                          ? "Mos o'quvchi yo'q"
                          : "Hozircha o'quvchi yo'q"}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-500">
                        Yangi o'quvchi qo'shilsa, tanlangan yo'nalish kartasida
                        ko'rinadi.
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {filteredStudents.map((student, index) => (
                <button
                  key={`${student.firstName}-${student.lastName}`}
                  className="group relative grid overflow-hidden gap-5 rounded-2xl border border-white/10 bg-[#151d1f] p-5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-amber-300/30 hover:bg-[#1b2426] md:grid-cols-[56px_1fr_160px]"
                  type="button"
                  onClick={() => {
                    setSelectedStudent(student);
                    setEditingStudent(null);
                  }}
                >
                  <CoinWatermark className="pointer-events-none absolute -right-8 -top-10 size-36 text-amber-200 opacity-[0.055] transition duration-300 group-hover:opacity-[0.09]" />
                  <span className="relative grid size-14 place-items-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-lg font-black text-amber-200">
                    {index + 1}
                  </span>

                  <div className="relative">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-black text-white">
                        {student.firstName} {student.lastName}
                      </h2>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-zinc-300">
                        {student.level}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm font-semibold text-zinc-500">
                      <span>{student.direction}</span>
                      <span className="text-zinc-700">•</span>
                      <span>{student.age} yosh</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-amber-300"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="relative md:text-right">
                    <strong className="block text-3xl font-black leading-none text-amber-200">
                      {student.coins.toLocaleString("en-US")}
                    </strong>
                    <span className="mt-2 block text-sm font-bold text-zinc-500">
                      coin ball
                    </span>
                  </div>
                </button>
              ))}

              {filteredStudents.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.03] p-8 text-center">
                  <p className="font-bold text-white">O'quvchi topilmadi</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Ism, familiya yoki yo'nalishni boshqacha yozib ko'ring.
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {isAddStudentOpen ? (
        <div
          className="coin-modal-backdrop fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setIsAddStudentOpen(false)}
        >
          <div
            className="coin-modal-panel relative max-h-[calc(100svh-32px)] w-[min(760px,100%)] overflow-y-auto rounded-2xl border border-white/10 bg-[#101719] shadow-2xl shadow-black/60"
            onClick={(event) => event.stopPropagation()}
          >
            <CoinWatermark className="pointer-events-none absolute -bottom-24 -right-20 size-80 text-[#2dd4bf] opacity-[0.055]" />
            <div className="relative flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#2dd4bf]/20 bg-[#2dd4bf]/10 px-3 py-1 text-xs font-black uppercase text-[#2dd4bf]">
                  <UserPlus size={15} />
                  Yangi o'quvchi
                </span>
                <h2 className="mt-4 text-2xl font-black text-white">
                  O'quvchi ma'lumotlari
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Saqlangandan keyin o'quvchi umumiy coin ro'yxatiga qo'shiladi.
                </p>
              </div>

              <button
                className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
                type="button"
                aria-label="Oynani yopish"
                onClick={() => setIsAddStudentOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative grid gap-4 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {studentFormFields.map(([field, label, inputType]) => (
                  <label
                    key={field}
                    className="grid gap-2 text-sm font-semibold text-white"
                  >
                    {label}
                    <StudentFormControl
                      field={field}
                      inputType={inputType}
                      value={newStudent[field] as string | number}
                      onChange={(value) => {
                        setNewStudent({
                          ...newStudent,
                          [field]: value,
                        });
                        setAddStudentError("");
                      }}
                    />
                  </label>
                ))}
              </div>

              {addStudentError ? (
                <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-200">
                  {addStudentError}
                </p>
              ) : null}

              <div className="grid gap-2 sm:grid-cols-[1fr_1fr]">
                <button
                  className="h-12 rounded-xl border border-white/10 bg-white/[0.04] font-bold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                >
                  Bekor qilish
                </button>
                <button
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0f9f8e] font-black text-white transition hover:bg-[#14b8a6]"
                  type="button"
                  onClick={handleAddStudent}
                >
                  <UserPlus size={19} />
                  Qo'shish
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedStudent ? (
        <div
          className="coin-modal-backdrop fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="coin-modal-panel relative w-[min(720px,100%)] overflow-hidden rounded-2xl border border-white/10 bg-[#101719] shadow-2xl shadow-black/60"
            onClick={(event) => event.stopPropagation()}
          >
            <CoinWatermark className="pointer-events-none absolute -bottom-24 -right-20 size-80 text-amber-200 opacity-[0.06]" />
            <CoinWatermark className="pointer-events-none absolute bottom-12 right-28 size-44 -rotate-12 text-[#2dd4bf] opacity-[0.04]" />
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-lg font-black text-amber-200">
                  {selectedStudent.firstName.charAt(0)}
                  {selectedStudent.lastName.charAt(0)}
                </span>
                <div>
                  <h2 className="text-2xl font-black text-white">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    {selectedStudent.direction} yo'nalishi o'quvchisi
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {isTeacher ? (
                  <>
                    <button
                      className="grid h-10 place-items-center rounded-xl border border-red-300/20 bg-red-400/10 px-3 text-sm font-black text-red-100 transition hover:bg-red-400/15"
                      type="button"
                      aria-label="O'quvchini o'chirish"
                      onClick={handleDeleteStudent}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      className="h-10 rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 text-sm font-black text-amber-100 transition hover:bg-amber-300/15"
                      type="button"
                      onClick={() => setEditingStudent(selectedStudent)}
                    >
                      Tahrirlash
                    </button>
                  </>
                ) : null}
                <button
                  className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
                  type="button"
                  aria-label="Oynani yopish"
                  onClick={() => {
                    setSelectedStudent(null);
                    setEditingStudent(null);
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {editingStudent ? (
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {studentFormFields.map(([field, label, inputType]) => (
                      <label
                        key={field}
                        className="grid gap-2 text-sm font-semibold text-white"
                      >
                        {label}
                        <StudentFormControl
                          field={field}
                          inputType={inputType}
                          value={editingStudent[field] as string | number}
                          onChange={(value) =>
                            setEditingStudent({
                              ...editingStudent,
                              [field]: value,
                            })
                          }
                        />
                      </label>
                    ))}
                  </div>

                  <div className="grid gap-2 sm:grid-cols-[1fr_1fr]">
                    <button
                      className="h-12 rounded-xl border border-white/10 bg-white/[0.04] font-bold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                      type="button"
                      onClick={() => setEditingStudent(null)}
                    >
                      Bekor qilish
                    </button>
                    <button
                      className="h-12 rounded-xl bg-[#0f9f8e] font-black text-white transition hover:bg-[#14b8a6]"
                      type="button"
                      onClick={handleSaveStudent}
                    >
                      Saqlash
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["Ism", selectedStudent.firstName],
                    ["Familiya", selectedStudent.lastName],
                    ["Yosh", `${selectedStudent.age} yosh`],
                    ["Telefon", selectedStudent.phone],
                    ["Yo'nalish", selectedStudent.direction],
                    ["Level", selectedStudent.level],
                    ["Qabul qilingan", selectedStudent.joinedAt],
                    [
                      "Coin ball",
                      selectedStudent.coins.toLocaleString("en-US"),
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <span className="text-xs font-bold uppercase text-zinc-500">
                        {label}
                      </span>
                      <strong className="mt-2 block text-base font-black text-white">
                        {value}
                      </strong>
                    </div>
                  ))}
                </div>
              )}

              {!editingStudent ? (
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-zinc-400">
                      Progress
                    </span>
                    <span className="text-sm font-black text-amber-200">
                      {selectedStudent.progress}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className="h-full rounded-full bg-amber-300"
                      style={{ width: `${selectedStudent.progress}%` }}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#111719] py-8">
      <div className="mx-auto flex w-[min(1328px,calc(100%-48px))] flex-col gap-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>В©2026 CodeTime IT Academy. Barcha huquqlar ximoyalangan</p>
        <div className="flex gap-2">
          {[Laptop, ShieldCheck, GraduationCap].map((Icon, index) => (
            <span
              key={index}
              className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400"
            >
              <Icon size={19} />
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

function App() {
  const isCoinsPage = window.location.pathname === "/coins";
  const isLoginPage = window.location.pathname === "/login";
  const isProtectedPage = isCoinsPage || isLoginPage;
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [teacherSession, setTeacherSession] = useState<TeacherSession | null>(
    () => getStoredTeacherSession(),
  );

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;

      if (user?.email) {
        setTeacherSession({
          login: user.email,
          name:
            typeof user.user_metadata.name === "string"
              ? user.user_metadata.name
              : getTeacherName(user.email),
          createdAt: Date.now(),
          provider: "supabase",
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;

      if (user?.email) {
        setTeacherSession({
          login: user.email,
          name:
            typeof user.user_metadata.name === "string"
              ? user.user_metadata.name
              : getTeacherName(user.email),
          createdAt: Date.now(),
          provider: "supabase",
        });
      } else {
        setTeacherSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleTeacherLogin(login: string, password: string) {
    if (isSupabaseConfigured && supabase) {
      const email = getTeacherEmail(login);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password.trim(),
      });

      if (error || !data.user?.email) {
        return "Login yoki parol noto'g'ri.";
      }

      setTeacherSession({
        login: data.user.email,
        name:
          typeof data.user.user_metadata.name === "string"
            ? data.user.user_metadata.name
            : getTeacherName(data.user.email),
        createdAt: Date.now(),
        provider: "supabase",
      });
      setIsAuthModalOpen(false);
      window.location.href = "/coins";

      return null;
    }

    const teacher = teacherCredentials.find(
      (credential) =>
        credential.login.toLowerCase() === login.trim().toLowerCase() &&
        credential.password === password.trim(),
    );

    if (!teacher) {
      return "Login yoki parol noto'g'ri.";
    }

    const session = saveTeacherSession(teacher);

    setTeacherSession(session);
    setIsAuthModalOpen(false);
    window.location.href = "/coins";

    return null;
  }

  async function handleTeacherLogout() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }

    clearTeacherSession();
    setTeacherSession(null);
    window.location.href = "/coins";
  }

  function handleStudentEnter() {
    setIsAuthModalOpen(false);
    window.location.href = "/coins";
  }

  return (
    <div className="min-h-screen bg-[#0b0f12] text-zinc-100">
      <Header />
      <main>
        {isCoinsPage ? (
          <CoinsPage
            role={teacherSession ? "teacher" : "student"}
            teacherName={teacherSession?.name}
            onLogout={handleTeacherLogout}
            onTeacherLoginClick={() => setIsAuthModalOpen(true)}
          />
        ) : isLoginPage ? (
          <LoginPage onLogin={handleTeacherLogin} />
        ) : (
          <>
            <Hero onOpenCoinLogin={() => setIsAuthModalOpen(true)} />
            <CoursesSection />
            <AdvantagesSection />
            <ResultsSection />
            <MentorsSection />
            <ContactSection />
          </>
        )}
      </main>
      <footer className="border-t border-white/10 bg-[#111719] py-8">
        <div className="mx-auto flex w-[min(1328px,calc(100%-48px))] flex-col gap-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>©2026 CodeTime IT Academy. Barcha huquqlar ximoyalangan</p>
          <div className="flex gap-2">
            {[Laptop, ShieldCheck, GraduationCap].map((Icon, index) => (
              <span
                key={index}
                className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400"
              >
                <Icon size={19} />
              </span>
            ))}
          </div>
        </div>
      </footer>
      {isProtectedPage ? null : <BottomNavigation />}
      {isAuthModalOpen ? (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleTeacherLogin}
          onStudentEnter={handleStudentEnter}
        />
      ) : null}
    </div>
  );
}

export default App;
