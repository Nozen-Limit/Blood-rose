import { pageMetadata } from "@/lib/metadata";
import { getPrices } from "@/lib/data";
import PriceSections from "@/components/PriceSections";

export const metadata = pageMetadata({
  title: "Item Prices",
  description:
    "Reference pricing for basic gear, end-game gear sets, and gold loot sets in Arcane Legends.",
  path: "/prices",
});

export default async function PricesPage() {
  const sections = await getPrices();

  return (
    <>
      <section className="page-hero">
        <h1>Item Prices</h1>
      </section>
      <PriceSections sections={sections} />
    </>
  );
}
