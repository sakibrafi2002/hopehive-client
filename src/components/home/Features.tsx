import { LuCalendarPlus, LuClipboardList, LuHeartHandshake, LuLayoutDashboard } from "react-icons/lu";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const FEATURES = [
  {
    icon: LuCalendarPlus,
    title: "Create events in minutes",
    text: "Describe the drive, pick a type, set the place and the date. Your event goes live for the whole community right away.",
  },
  {
    icon: LuHeartHandshake,
    title: "Join with one tap",
    text: "Found something worth showing up for? Join in a single click and the organizer knows you are on your way.",
  },
  {
    icon: LuClipboardList,
    title: "Track everything you join",
    text: "Your Joined Events page lists every drive you signed up for, sorted by date, so you never miss one.",
  },
  {
    icon: LuLayoutDashboard,
    title: "Manage what you organize",
    text: "Fix a location, move a date or remove an event. Only you can change the events you created.",
  },
];

export function Features() {
  return (
    <Section tone="alt">
      <SectionHeading
        eyebrow="How it works"
        title="Everything a neighbourhood drive needs"
        subtitle="From the first idea to the last box handed over, HopeHive keeps organizers and volunteers on the same page."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="flex h-full flex-col rounded-box border border-base-300 bg-base-100 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
              <Icon aria-hidden="true" />
            </span>
            <h3 className="text-xl font-semibold leading-snug">{title}</h3>
            <p className="mt-2 text-base-content/70">{text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
