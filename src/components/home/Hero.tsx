import Link from "next/link";
import { LuArrowRight, LuCalendarDays, LuHeartHandshake, LuMapPin, LuSearch, LuSprout } from "react-icons/lu";
import { SafeImage } from "@/components/SafeImage";
import { Container } from "@/components/ui/Container";

const HIGHLIGHTS = [
  { icon: LuSearch, text: "Find drives by area and type" },
  { icon: LuHeartHandshake, text: "Join with a single tap" },
  { icon: LuSprout, text: "Keep track of the good you do" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-primary/15 via-base-100 to-secondary/20">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-secondary/25 blur-3xl" />

      <Container className="relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <LuMapPin aria-hidden="true" /> Winter relief drives are open across Dhaka
          </p>

          <h1 className="text-4xl font-semibold leading-[1.1] text-base-content sm:text-5xl lg:text-6xl">
            Show up for your neighbourhood. Change a life this week.
          </h1>

          <p className="mt-5 max-w-xl text-lg text-base-content/75">
            HopeHive helps you find, create and join social service events near you, from winter clothes drives in Mirpur
            to blanket distributions in Mohammadpur.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/events" className="btn btn-primary btn-lg">
              Browse Upcoming Events <LuArrowRight aria-hidden="true" />
            </Link>
            <Link href="/create-event" className="btn btn-outline btn-lg">
              Create an Event
            </Link>
          </div>

          <ul className="mt-10 grid gap-3 text-sm text-base-content/80 sm:grid-cols-3">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-base-100 text-lg text-primary shadow-sm">
                  <Icon aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="aspect-[4/3] overflow-hidden rounded-box border-4 border-base-100 bg-base-200 shadow-2xl">
            <SafeImage
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80"
              alt="Volunteers sorting donated winter clothes into boxes"
              loading="eager"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute -bottom-6 left-4 flex max-w-[16rem] items-center gap-3 rounded-box border border-base-300 bg-base-100 p-3.5 shadow-xl sm:left-[-1.5rem]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-xl text-secondary-content">
              <LuCalendarDays aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Winter Clothes Distribution</p>
              <p className="truncate text-xs text-base-content/65">Mirpur 10, Dhaka</p>
            </div>
          </div>

          <div className="absolute -top-5 right-4 hidden items-center gap-3 rounded-box border border-base-300 bg-base-100 p-3.5 shadow-xl sm:flex">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-xl text-primary-content">
              <LuHeartHandshake aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">Blanket Distribution</p>
              <p className="text-xs text-base-content/65">Mohammadpur, Dhaka</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
