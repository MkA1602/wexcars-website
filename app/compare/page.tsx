import type { Metadata } from "next"
import CompareContent from "@/components/compare-content"

export const metadata: Metadata = {
  title: "Compare Cars | AutoWex",
  description: "Compare different vehicles side by side to help make your decision.",
}

export default function ComparePage() {
  return (
    <>
      <section className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">Compare Vehicles</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Compare different vehicles side by side to help make your decision.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom">
          <CompareContent />
        </div>
      </section>
    </>
  )
}
