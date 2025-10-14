import Image from "next/image";
import { Check } from "lucide-react";

/**
 * @param {{ docterAgent: any, isSelected?: boolean }} props
 */
const SelectDoctorAgentCard = ({ docterAgent, isSelected }) => {
  return (
    <div
      className={`relative bg-white rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? "border-pink-600 shadow-md"
          : "border-pink-100 hover:border-pink-300"
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center z-10">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
      <div className="relative w-full h-32 bg-gradient-to-br from-pink-50 to-rose-50 rounded-t-lg overflow-hidden">
        <Image
          src={docterAgent.image}
          alt={docterAgent.specialist}
          fill
          className="object-contain p-2"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm mb-1">
          {docterAgent.specialist}
        </h3>
        <p className="text-xs text-gray-600 line-clamp-2">
          {docterAgent.description}
        </p>
      </div>
    </div>
  );
};

export default SelectDoctorAgentCard;