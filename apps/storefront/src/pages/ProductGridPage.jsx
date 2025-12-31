import ProductGrid from "../components/ProductGrid";
import { useParams } from "react-router-dom";

export default function ProductGridPage() {
  const { slug } = useParams();
  return <ProductGrid initialCategory={slug} />;
}
