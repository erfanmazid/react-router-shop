import { useLoaderData, useSearchParams } from "react-router-dom";

import productService from "../services/products-services";
import { useDebouncedCallback } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/http-request";

export async function loader({ request }) {
  // console.log(request);
  const url = new URL(request.url);
  const products = await productService.readProducts(
    url.searchParams.get("title"),
    url.searchParams.get("available")
  );
  return { products };
}

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const debounced = useDebouncedCallback(
    (e) => {
      setSearchParams((prev) => {
        prev.set("title", e);
        return prev;
      });
    },

    1000
  );

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await axiosInstance.get("/products"),
  });
  console.log(data);

  const { products } = useLoaderData();

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <input
        type="text"
        placeholder="search here..."
        className="p-2 mb-2 border w-1/2"
        onChange={(e) => {
          debounced(e.target.value);
        }}
      />
      <h1 className="text-3xl font-bold mb-6 text-center">Products</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data.map((product) => (
          <li
            key={product.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-700 mt-2">{product.description}</p>
              <p className="text-lg font-bold mt-4">${product.price}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsPage;
