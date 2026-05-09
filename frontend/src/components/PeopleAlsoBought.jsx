import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { useEffect } from "react";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("/products/recomendations");
        setRecommendations(res.data);
        console.log(res.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "An error occured while fetching recommendations!",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  return (
    <div className=" mt-8">
      <h3 className=" text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className=" mt-6 grid grid-cols1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
