import { SafeImage } from "@/components/SafeImage";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

// Static on purpose: moments from drives like the ones HopeHive volunteers organize.
const PHOTOS = [
  { src: photo("photo-1593113598332-cd288d649433"), alt: "Volunteers packing winter clothes", caption: "Winter clothes drive" },
  { src: photo("photo-1559027615-cd4628902d4a"), alt: "Hands passing a warm blanket to a family", caption: "Blanket distribution night" },
  { src: photo("photo-1532629345422-7515f3d16bb6"), alt: "Volunteers cleaning up a lakeside path", caption: "Lakeside cleanup crew" },
  { src: photo("photo-1618477461853-cf6ed80faba5"), alt: "Hands planting a young sapling", caption: "Saplings going into the ground" },
  { src: photo("photo-1582213782179-e0d53f98f2ca"), alt: "A blood donation camp in progress", caption: "Blood donation camp" },
  { src: photo("photo-1488521787991-ed7bbaae773c"), alt: "Children learning together outdoors", caption: "Evening classes for children" },
];

export function Gallery() {
  return (
    <Section tone="alt">
      <SectionHeading
        eyebrow="Gallery"
        title="Moments from the field"
        subtitle="Small groups, big difference. Here is what showing up looks like."
      />

      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {PHOTOS.map((item) => (
          <li key={item.caption} className="group relative aspect-[4/3] overflow-hidden rounded-box bg-base-300">
            <SafeImage
              src={item.src}
              alt={item.alt}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent p-3 pt-10 sm:p-4 sm:pt-12">
              <p className="text-sm font-medium text-white sm:text-base">{item.caption}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
