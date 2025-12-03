import { useLiveQuery } from "dexie-react-hooks";
import { motion } from "framer-motion";
import { History as HistoryIcon } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { MatchHistoryCard } from "@/components/history/MatchHistoryCard";
import { db } from "@/lib/db";

const History = () => {
  const matches = useLiveQuery(() => 
    db.matches.orderBy('timestamp').reverse().toArray()
  );

  const completedMatches = matches?.filter(m => m.completed) ?? [];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <HistoryIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Match History</h1>
          <p className="text-muted-foreground">
            View past matches and results
          </p>
        </div>

        {completedMatches.length > 0 ? (
          <div className="space-y-4">
            {completedMatches.map((match, index) => (
              <MatchHistoryCard
                key={match.id}
                match={match}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="card-surface rounded-xl p-12 text-center">
            <HistoryIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-display text-xl font-semibold mb-2">No Matches Yet</h3>
            <p className="text-muted-foreground">
              Complete your first match to see it here
            </p>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default History;
