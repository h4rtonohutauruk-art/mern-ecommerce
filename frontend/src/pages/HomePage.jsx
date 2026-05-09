import React, { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProduct from "../components/FeaturedProduct";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/tshirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Glases", imageUrl: "/glasses.png" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];

{
  /* <button
          onClick={prevSlide}
          disabled={isStartDisabled}
          className={`absolute top-[85%] left-1 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${isStartDisabled ? " bg-gray-400 cursor-not-allowed" : " bg-emerald-600 hover:bg-emerald-500"}`}
        > */
}
const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
    // console.log("this is featured product", fetchFeaturedProducts);
  }, [fetchFeaturedProducts]);

  return (
    <div className=" relative min-h-screen text-white overflow-hidden">
      <div className=" relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
        <h1 className=" text-center text-xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Explore Our Category
        </h1>
        <p className=" text-center text-xl text-gray-300 mb-12">
          Discover the latest trends in eco-friendly fashion
        </p>

        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
        {!isLoading && products.length > 0 && (
          <FeaturedProduct featuredProducts={products} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
