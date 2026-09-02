import React from "react";
import { AlertCircle, ArrowRight } from "lucide-react";

interface Props {
  districtName?: string;
  nearestRegion?: string;
  onNavigateToRegion?: () => void;
}

export const DistrictUnavailableBanner: React.FC<Props> = ({
  districtName = "Selected Sub-district",
  nearestRegion = "Division / Regional Level",
  onNavigateToRegion,
}) => {
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4 text-amber-200">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1 text-sm">
          <div className="font-semibold text-amber-300">
            District-Level Micro Data Unavailable
          </div>
          <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
            Official statistical reporting does not publish disaggregated econometric indicators for{" "}
            <span className="font-semibold text-amber-100">{districtName}</span> for this time horizon.
            To prevent statistical fabrication or interpolation bias, EconoSphere AI defaults to the nearest reliable geographic aggregate:{" "}
            <span className="font-semibold text-amber-100">{nearestRegion}</span>.
          </p>
          {onNavigateToRegion && (
            <button
              onClick={onNavigateToRegion}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>View Regional Data ({nearestRegion})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
