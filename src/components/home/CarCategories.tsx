"use client";

import Link from "next/link";

interface CarCategoriesProps {
  messages: Record<string, any>;
  locale: string;
}

const collections = [
  {
    title: "Premium ve konforlu",
    desc: "Is toplantisi, ozel gun veya uzun yol icin daha ust segment araclar.",
    href: "vehicleType=premium",
    className: "md:col-span-2",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtHlx0dfHlLDHNXrPG6JtBT4AP1Yd1Eu3lzDn_wPmbsvWIRCrmjTJUMIe_W4Q381fIiHW7RpLV0ippCCRNZyJO_39YnQB8mKM-dGEyKvexkzeLZntCM4c5NcH0jjCgJuyHKzsk3iUwh7NeUGa1yTNkIe9jl9i-j7fjt_CO7omADiEMKTLmFg-DBlws4xwPyYZV1s4GrGMVpx3_tEUZk22wcyZvu_dG45Hmb9vCs3rF0-sLj8vkbw9R",
  },
  {
    title: "Elektrikli",
    desc: "Sessiz, ekonomik ve sehir ici icin akilli secim.",
    href: "fuelType=ELECTRIC",
    className: "",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZjU6191kuNdlDLvJKxHJ7oL2KpnOhZm-FmycQehgep_2zHtctJWCRmxMdrImCHi7da-7KhS94blyHP9ul3Sd6AxjDuJkxDGWtxTbj1zcxXeVOmp1g0McmPW8YwTRwyr8V4RvIEYZoMOW7RRUFA28QAk2WNnw-49aMZM8M7Xtepi1WamC4NwS_Z_SKa2J6dl17JTV4WptWeEs4jHAaukIMlwnw4DwYu1MJfaOb3Y69rDBiaJVfxxt_",
  },
  {
    title: "Uzun yol ve aile",
    desc: "Bagaj, koltuk ve rota rahatligi oncelikse bu koleksiyonla basla.",
    href: "seats=5",
    className: "md:col-span-3 h-[220px]",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhzf5rVgFvPlULkVJftZk5ZvBlKVc-HqSJ3RQieZFFArQnomCmJXJdA86_BBiR6XeznEr9SwboYvXcbT_Fbr0-IjjYAAOJ2KQhxh0RAanmj1j6jtytJFQQSNQuRHspst54G6K_PCRkyBYWiZpGBQeOhCo0ot6RFDjGftwrmUbvwEG2IA4OVs47G1O-9Nrgr8Rr2AssYvno2SfQj_85cXz3Pg76FidHH_tVpdFcdgq5QAi410wFSrpL",
  },
];

function ArrowIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CarCategories({ locale }: CarCategoriesProps) {
  return (
    <section id="categories" className="bg-[#fcf9f8] px-5 pb-20 text-[#1b1b1c] dark:bg-[#121212] dark:text-white md:px-16">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="mb-8 font-[var(--font-heading)] text-2xl font-semibold leading-8 tracking-[-0.01em] md:text-[32px] md:leading-10">
          One cikan koleksiyonlar
        </h2>

        <div className="grid auto-rows-[250px] grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.title}
              href={`/${locale}/search?${collection.href}`}
              className={`group relative overflow-hidden rounded-[20px] bg-[#f0eded] shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] ${collection.className}`}
            >
              <img src={collection.image} alt={collection.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 z-10 flex w-full items-end justify-between gap-5 p-6">
                <div>
                  <h3 className="font-[var(--font-heading)] text-2xl font-semibold leading-8 text-white">{collection.title}</h3>
                  <p className="mt-2 max-w-lg font-[var(--font-body)] text-base leading-6 text-[#e5e2e1]">{collection.desc}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition group-hover:bg-[#653496]">
                  <ArrowIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
