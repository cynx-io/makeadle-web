import { notFound } from "next/navigation";
import { ethGetRisk } from "@/lib/janus/crypto/ethGetRisk";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faReddit,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import EthSearchBar from "@/components/EthSearchBar";
import Image from "next/image";
import RiskFlagSection from "@/components/sections/RiskFlagSection";

export default async function CoinPage({
  params,
}: {
  params: Promise<{ token_id: string }>;
}) {
  const { token_id } = await params;
  const riskResp = await ethGetRisk({ coin_id: token_id });

  if (!riskResp) return notFound();

  const {
    token_info,
    risk_score,
    risk_flags,
    social_info,
    market_info,
    holder_info,
  } = riskResp;

  return (
    <main className="p-6 py-12 space-y-6 max-w-5xl mx-auto">
      {/* Header */}

      <EthSearchBar />

      <div className="flex justify-between w-full px-5">
        <div className="flex items-center gap-4">
          <Image
            src={token_info.logo_url}
            alt={token_info.name}
            className="w-12 h-12 rounded-md"
            width={48}
            height={48}
          />
          <div>
            <h1 className="text-2xl font-bold">
              {token_info.name} <Badge>{token_info.symbol.toUpperCase()}</Badge>
            </h1>
            <a
              href={social_info.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground text-sm"
            >
              {social_info.website}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {social_info.github && (
            <a
              href={social_info.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition"
            >
              <FontAwesomeIcon icon={faGithub} className="w-6" />
            </a>
          )}
          {social_info.twitter && (
            <a
              href={social_info.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-muted-foreground hover:text-foreground transition"
            >
              <FontAwesomeIcon icon={faXTwitter} className="w-6" />
            </a>
          )}
          {social_info.reddit && (
            <a
              href={social_info.reddit}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition"
            >
              <FontAwesomeIcon icon={faReddit} className="w-6" />
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-line text-muted-foreground">
            {social_info.description.replace(/\r\n/g, "\n")}
          </p>
        </CardContent>
      </Card>

      {/* Risk Score */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 flex-col">
            <span className="text-sm font-medium text-left w-full">
              {risk_score.score} – {risk_score.description}
            </span>
            <Progress value={risk_score.score} className="w-full mb-2" />
          </div>
        </CardContent>
      </Card>

      {/* Risk Flags */}
      <RiskFlagSection risk_flags={risk_flags} />

      {/* Holders */}
      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Top Holders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Top 10 Holders Own:{" "}
              {holder_info.top_ten_holder_percentage.toFixed(2)}%
            </p>
            <ul className="text-sm space-y-1">
              {holder_info.holders.map((h, idx) => (
                <li key={idx} className="border-b pb-1">
                  <span className="font-mono">{h.address.slice(0, 20)}...</span>{" "}
                  – {h.percentage.toFixed(2)}% {h.is_locked && "(Locked)"}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top LP Holders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Top 10 LP Holders Own:{" "}
              {holder_info.top_ten_lp_holder_percentage.toFixed(2)}%
            </p>
            <ul className="text-sm space-y-1">
              {holder_info.lp_holders.map((h, idx) => (
                <li key={idx} className="border-b pb-1">
                  <span className="font-mono">{h.address.slice(0, 20)}...</span>{" "}
                  – {h.percentage.toFixed(2)}% {h.is_locked && "(Locked)"}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Market Info */}
      <Card>
        <CardHeader>
          <CardTitle>Market Info</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Price:</span> $
            {market_info.price.toFixed(2)}
          </div>
          <div>
            <span className="font-semibold">24h Change:</span>{" "}
            {market_info.price_change_percentage_24h.toFixed(2)}%
          </div>
          <div>
            <span className="font-semibold">Market Cap:</span> $
            {market_info.market_cap.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Volume (24h):</span> $
            {market_info.volume_24h.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Circulating:</span>{" "}
            {market_info.circulating_supply.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Max Supply:</span>{" "}
            {market_info.max_supply.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
