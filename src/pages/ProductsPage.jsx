import { useSearchParams } from "react-router-dom";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { axiosInstance } from "../services/http-request";

const limit = 5;

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  const debounced = useDebouncedCallback(
    (e) => {
      setSearchParams((prev) => {
        prev.set("title", e);
        return prev;
      });
    },

    1000
  );

  const fetchProducts = async (pageParam = 0, search = "") => {
    const response = await axiosInstance.get(`/products?search=${search}`, {
      params: {
        _page: pageParam,
        _limit: limit,
      },
    });

    return response;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["products", searchTerm],
      queryFn: fetchProducts,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPage, lastPageParam, allPageParams) => {
        console.log(lastPage, "lastPage");
        console.log(allPage, "allPage");
        console.log(lastPageParam, "lastPageParam");
        console.log(allPageParams, "allPageParams");
      },
      placeholderData: keepPreviousData,
    });
  // const { pages } = data;
  // console.log(pages);

  if (isLoading) {
    return "loading....";
  }
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
        Our Products
      </h1>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => debounced(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.pages?.map((page) =>
          page?.results?.map((product) => (
            <li
              key={product.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-700 mb-4">{product.description}</p>
                <p className="text-xl font-bold text-green-600">
                  ${product.price}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
      <button
        onClick={fetchNextPage}
        disabled={!hasNextPage || isFetchingNextPage}
        className="mt-8 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Load More"
          : "Nothing more to load"}
      </button>
    </div>
  );
};

export default ProductsPage;
