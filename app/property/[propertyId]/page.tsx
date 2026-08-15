import { notFound } from "next/navigation";
import { fetchProperty, fetchProperties, daysSince } from "@/lib/properties";
import { PropertyDetailView } from "@/components/site/PropertyDetailView";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const properties = await fetchProperties();
    return properties.slice(0, 20).map((p) => ({ propertyId: p.id }));
  } catch {
    return [];
  }
}

type Props = {
  params: Promise<{ propertyId: string }>;
};

export default async function PropertyDetailPage({ params }: Props) {
  const { propertyId } = await params;

  const p = await fetchProperty(propertyId, { next: { revalidate: 60 } });

  if (!p) {
    notFound();
  }

  const postedDays = daysSince(p.createdAt);

  return <PropertyDetailView property={p} postedDays={postedDays} />;
}
