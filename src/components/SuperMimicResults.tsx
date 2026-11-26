import { ResultsTable } from "./MaterialResults";

export function SuperMimicResults({ section }: { section: string }) {
  switch (section) {
    case "porting":
      return <ResultsTable id="supermimic-speed" caption="Seconds per training round on one A100 (4,096 bodies)"
        columns={["Configuration", "Collect", "World model", "Policy", "Per round"]}
        rows={[
          ["FP32, not compiled, 1 ms × 20", "0.229", "0.564", "1.573", "≈1.08"],
          ["TF32 + torch.compile, 1 ms × 20", "0.155", "0.153", "0.300", "≈0.34"],
          ["Same, robot physics 5 ms × 4", "0.115", "0.153", "0.300", "≈0.30 · diverges"],
        ]}>
        <p className="material-note">Per round = collection + 0.4 × (world-model update + policy update), the paper’s definition of a round. Update times are steady-state replays of the captured CUDA graphs.</p>
      </ResultsTable>;
    case "pushes":
      return <ResultsTable id="supermimic-stations" caption="Closed-loop results for three push-branch checkpoints"
        columns={["Checkpoint", "Stop tests passed / 168", "Unfinished pushes ≤ 60 N·s / 2,432", "Unfinished at 90 N·s / 608"]}
        rows={[
          ["S33000, stage two (chosen)", "168", "1", "41"],
          ["S38000", "168", "12", "87"],
          ["S58000", "149", "35", "27"],
        ]}>
        <p className="material-note">Pushes last 0.1 s and are swept across the walking and running cycle. An unfinished push either falls or fails to recover the requested walk or stop.</p>
      </ResultsTable>;
    case "landing-probe":
      return <ResultsTable id="supermimic-landing" caption="Highest drop held standing, before any landing training"
        columns={["Strength", "Policy, vertical", "Policy, 3 m/s forward", "Locked pose, vertical", "Policy runs standing / 42"]}
        rows={[
          ["1×", "1 m (4.4 m/s)", "0.5 m", "0.5 m", "4"],
          ["2×", "2 m", "1 m", "1 m", "7"],
          ["4×", "3 m (7.7 m/s)", "2 m", "1–2 m", "10"],
          ["8×", "5 m (9.9 m/s)", "3 m", "2 m", "12"],
        ]}>
        <p className="material-note">Speeds in brackets are touchdown speeds. Heights tested: 0.5, 1, 2, 3, 5, 10 and 20 m, so the real limit at 8× lies somewhere between 5 and 10 m. Every run at 6 or 10 m/s of horizontal speed fell.</p>
      </ResultsTable>;
    default:
      return null;
  }
}
