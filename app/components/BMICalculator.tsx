"use client";

import { useState } from "react";

export default function BMICalculator() {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // 🔴 Frontend validation (Lab 14)
    if (!height || !weight) {
      setError("Please enter both values.");
      return;
    }

    const heightVal = parseFloat(height);
    const weightVal = parseFloat(weight);

    if (isNaN(heightVal) || isNaN(weightVal) || heightVal <= 0 || weightVal <= 0) {
      setError("Please enter valid positive numbers.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

const res = await fetch(`${apiUrl}/api/lionfish-fn-namespace/dynamic-ticket-pricing`, {


        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          basePrice: weightVal,
          demand: 1,
          daysUntilEvent: heightVal,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Request failed");
      }

      const data = await res.json();
      setResult(data.finalPrice);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 p-8 rounded-3xl shadow-xl w-full max-w-md">
      <h1 className="text-3xl font-bold text-center mb-4">
        Dynamic Pricing Demo
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Days Until Event"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-full p-3 border rounded-xl"
        />

        <input
          type="number"
          placeholder="Base Price"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full p-3 border rounded-xl"
        />

        {error && (
          <p className="text-red-600 font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
        >
          {loading ? "Calculating..." : "Calculate Price"}
        </button>
      </form>

      {result !== null && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Final Price</p>
          <p className="text-3xl font-bold text-green-600">
            {result}
          </p>
        </div>
      )}
    </div>
  );
}
