import { buildGlobalSchemaGraph } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export function LocalBusinessSchema() {
  return <JsonLd data={buildGlobalSchemaGraph()} />;
}
