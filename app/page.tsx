import EthSearchBar from "@/components/EthSearchBar";
import { topicClient } from "@/lib/janus/plato/plato";

export default function Home() {
  topicClient.paginateTopic({
      keyword: "a"
  }).catch((err) => {
    console.error("Error fetching topics:", err);
  });

  return (
    <div className="relative min-h-screen p-8 sm:p-20">
      <div className="grid place-items-center gap-8 relative z-10">
        <EthSearchBar />
        tes
      </div>
    </div>
  );
}
