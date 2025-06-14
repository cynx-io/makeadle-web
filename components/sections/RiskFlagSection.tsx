"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EthGetRiskResp } from "@/lib/janus/crypto/ethGetRisk";

export default function RiskFlagSection({
  risk_flags,
}: {
  risk_flags: EthGetRiskResp["risk_flags"];
}) {
  const [showPassed, setShowPassed] = useState(false);
  const passedRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  const failedFunctions = Object.entries(risk_flags.functions).filter(
    ([, val]) => val?.value,
  );
  const passedFunctions = Object.entries(risk_flags.functions).filter(
    ([, val]) => !val?.value,
  );

  // Update maxHeight on toggle for animation
  useEffect(() => {
    if (passedRef.current) {
      setMaxHeight(showPassed ? `${passedRef.current.scrollHeight}px` : "0px");
    }
  }, [showPassed]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Flags</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4">
        {/* Failed flags */}
        {failedFunctions.map(([key, val]) => (
          <div key={key}>
            <Badge variant="destructive">{key}</Badge>
            <p className="text-sm text-muted-foreground">{val?.reason}</p>
          </div>
        ))}

        {!risk_flags.ownership_renounced?.value && (
          <div>
            <Badge variant="destructive">Ownership not renounced</Badge>
            <p className="text-sm text-muted-foreground">
              {risk_flags.ownership_renounced.reason}
            </p>
          </div>
        )}
        {risk_flags.liquidity_locked?.severity > 5 && (
          <div>
            <Badge variant="destructive">Liquidity Risk</Badge>
            <p className="text-sm text-muted-foreground">
              {risk_flags.liquidity_locked.reason}
            </p>
          </div>
        )}

        {/* Passed toggle button */}
        <div
          className="col-span-2 mt-4 flex items-center cursor-pointer select-none"
          onClick={() => setShowPassed(!showPassed)}
        >
          <span
            className={`inline-block mr-2 transition-transform duration-200 ${
              showPassed ? "rotate-180" : "rotate-0"
            }`}
          >
            ▼
          </span>
          <span className="font-semibold text-muted-foreground">
            Show Passed Risk Flags
          </span>
        </div>

        {/* Passed flags with animated collapse */}
        <div
          ref={passedRef}
          style={{
            maxHeight,
            transition: "max-height 0.3s ease",
            overflow: "hidden",
            opacity: showPassed ? 1 : 0,
            transitionProperty: "max-height, opacity",
            transitionDuration: "300ms",
            transitionTimingFunction: "ease",
          }}
          className="col-span-2"
          aria-hidden={!showPassed}
        >
          {passedFunctions.map(([key, val]) => (
            <div key={key} className="mt-2">
              <Badge variant="secondary">{key}</Badge>
              <p className="text-sm text-muted-foreground">{val?.reason}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
