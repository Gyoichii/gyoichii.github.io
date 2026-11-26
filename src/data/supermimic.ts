import type { Project, SystemGroup } from "./projects";

const groups: SystemGroup[] = [
  {
    id: "training",
    label: "Body & training",
    systems: [
      {
        id: "body",
        label: "Human-strength body",
        headline: "A body with human strength limits",
        summary:
          "The simulated body weighs 70.4 kg and has 16 rigid bodies and 34 joint motors. Each motor has its own torque, speed and power ceiling in each direction. At strength 1× the body matches a lightly trained young man of the same weight, with strength defined per kilogram. Superhuman characters use the same body with one capability factor applied to every motor.",
        paragraphs: [
          "The first version used engineering defaults, roughly a half to a third of human strength. A body that weak produced false limits: for a while it looked as if the controller could only catch itself on a straight leg. I rebuilt the ceilings joint by joint and direction by direction from human figures, with one rule: slightly stronger than a person is acceptable, weaker is not. The ankle may exceed dynamometer values because running moments include tendon elasticity, which this motor model folds in.",
          "The same frozen policy, evaluated on the new body with only the motor ranges changed, went from 93.8% to 98.8% on a sweep of 161 stop commands during walking. Every stretch of commands that had failed on the old body passed.",
        ],
        detail:
          "Each motor command passes through a slew limit, a PD loop, a hyperbolic torque–speed curve, a power limit and shared group limits, evaluated every 1 ms physics substep. The batched GPU motor matches the CPU reference on 6,000 random states to a relative error of 3e-13. The design target is that 1× covers ordinary running up to about 7.5 m/s; the training clips reach 6.5 m/s at the 90th percentile, so 7.5 m/s has not been tested.",
        tags: ["MuJoCo", "Finite joint motors", "Per-kilogram strength"],
        media: [],
      },
      {
        id: "world-model",
        label: "Training through a world model",
        headline: "Training the policy through a learned world model",
        summary:
          "SuperMimic, a published method with public source code, fits a world model to real simulator transitions. The policy then rolls out 32 steps inside that model and backpropagates the return through the rollout. I train it on Colab A100s with 4,096 simulated bodies at once. The checkpoint used on this page had seen 135 million environment samples.",
        paragraphs: [
          "My first adapter called the author’s training step but replaced code around it. A file-by-file comparison with the author’s source showed that the replacements changed what the policy learned. The goal window covered 0.02–0.20 s of the reference instead of 0–0.90 s. The policy also saw root states that the paper reserves for the world model, and clip ends were treated as failures. I aligned the inputs and clip handling with the author’s path and the paper’s settings, including ten frames of sensor history.",
          "A training round, one control step for all 4,096 bodies plus 0.4 model updates, took 1.08 s. Physics was not the slow part: the model updates ran in full FP32 without compilation. With the author’s own execution settings, TF32, torch.compile and CUDA graph capture, a round takes 0.34 s. That is close to the paper’s reported rate once H100 and A100 throughput are taken into account, though I have not run both on the same card. 5,000 rounds take about 28 minutes of training, or 45 minutes with evaluation exports and checkpoints.",
          "The author’s robot setup also uses a 5 ms physics step. I tried it to save time. With my motors the same policy produced non-finite states and joint velocities up to 76,733, because my motor is an explicit PD loop recomputed every substep, while the reference robot uses MuJoCo’s implicit position actuators. I kept 1 ms substeps, which cost 0.04 s per round.",
        ],
        detail:
          "Control runs at 50 Hz over 20 physics substeps of 1 ms. The policy observes ten frames of a 111-value body sensor and a 760-value goal made of ten reference frames, every fifth frame from the current one. It has two modes: follow the reference clip, or stop and hold the idle pose. Training runs in mjlab on MuJoCo Warp. Every result below comes from a separate closed-loop harness that reruns the frozen policy under two physics builds, MuJoCo 3.5 and 3.16.",
        tags: ["SuperMimic", "World model", "PyTorch", "TF32 + torch.compile"],
        media: [],
        diagram: "worldmodel",
      },
      {
        id: "running",
        label: "Catching weight while running",
        headline: "Fixing what the model predicted after touchdown",
        summary:
          "On the new body the controller touched the ground with something other than a foot 0.54–0.66 s into every 5 m/s running test. A search over alternative actions found ones that physically caught the body’s weight, but the world model predicted a fall after each of those catches. Scored on the model’s predictions, the objective ranked the falling action above the catching one. In that state the policy could not learn the catch.",
        paragraphs: [
          "I froze the policy and retrained only the world model and critic for 400 rounds. The model then predicted both recorded catches as recoveries, and both critics ranked the catch above the fall. Peak center-of-mass error after touchdown fell from 54.1 to 11.7 cm and from 40.2 to 7.6 cm. That still missed my 5 cm acceptance line, so I stopped the model-only training there rather than extend it.",
          "Next I unfroze the policy and added 136 GASP run and sprint clips. Within 5,000 rounds, falls on the original running clip went from 93.8% of training episodes to none, and across all running episodes from 80.5% to 2.1%. These are training statistics with exploration on, not tests of a frozen policy. In the next 10,000 rounds the controller stopped falling behind the reference: over 5.2 s it covered 25.8–25.9 m against the reference’s 26.0 m, up from 25.4–25.5 m.",
        ],
        detail:
          "Before the fix, the objective scored the real catches at 1.25 and 1.51 and the real failures at 0.53 and 0.59, but ranked them the other way round when scored on world-model predictions. The vertical impulse implied by the model rose from 0.70 and 0.55 of the real value to 1.02 and 0.94. The 5,000-round curriculum used 2,000 model updates, 2,000 policy updates and 20.48 million new samples. Joint tracking error on the running tests fell 12–20% between checkpoints S18000 and S28000.",
        tags: ["World-model calibration", "Running curriculum", "GASP clips"],
        media: [],
      },
    ],
  },
  {
    id: "behaviour",
    label: "Frozen controller",
    systems: [
      {
        id: "stopping",
        label: "Stopping from a run",
        headline: "Stopping from 5 m/s",
        summary:
          "Two retargeted animation clips and two controller runs brake from 5 m/s, lined up at the moment braking starts. The animation plants one heavy step and its center of mass stops within 0.7 m. The controller brakes about as hard at first, peaking near 15 m/s², then finishes with several short steps. Its center of mass travels a median of 2.53 m.",
        paragraphs: [
          "The frozen test set issues stop commands at 42 points across the running cycle, run twice in each physics build. All 168 runs end in a stable stand. I did not make the animation a target: retargeted to this body, its short braking window needs very high friction, and it is a hand-authored clip, not a measurement.",
          "Just before the test range, a stop command at tick 82 still ends in a fall in three of four runs. The command lands at an unfavourable point in the stride: speed barely drops and the body goes down. I keep this as a known limit rather than train against it.",
        ],
        detail:
          "Speed is the whole-body center of mass averaged over 0.1 s. Braking onset is the last frame before speed drops below 85% of running speed. Over the 42 formal cases the controller takes 3–5 footfalls in total (four in 20 cases). Once below 2 m/s it usually needs two more steps (27 of 42) over a median 0.74 s. Peak trunk lean during braking is 33° against 26–30° in the animation.",
        tags: ["Closed-loop evaluation", "Two physics builds", "Animation comparison"],
        media: ["supermimic/run-stop", "supermimic/run-stop-edge"],
      },
      {
        id: "pushes",
        label: "Push recovery",
        headline: "Choosing a checkpoint for push recovery",
        summary:
          "While walking, the controller takes a 0.1 s, 45 N·s push to the chest from the front or from the side. It answers with a step 0.26–0.34 s after the push and settles with one to three short steps. A sideways push rolls its trunk up to 29° further than in the unpushed walk, the largest change in the clip.",
        paragraphs: [
          "I trained push recovery as a branch from the previous baseline and exported a checkpoint every 2,500 rounds for closed-loop tests. Longer training did not just make it stronger. By S58000 it held some hard pushes better, but 19 of 168 stop tests no longer reached two continuous seconds of stability, mostly because it kept shuffling after it had stopped. Training statistics never showed this: the failure rate of stop episodes in training stayed at zero.",
          "I chose S33000 from the second stage. On 2,072 pushes up to 60 N·s shared with the previous baseline, it completed 2,071 against 1,595 and fell 0 times against 104. No earlier success was lost. At 90 N·s, beyond the training range, it completed 492 of 518 against 295, but 10 earlier successes became failures. S38000 failed three scenarios four times out of four, so a reproducible regression now stops a long run at the first checkpoint that shows it.",
        ],
        detail:
          "The full phase set has 3,188 lanes: 2,432 pushes within the training range, 608 at 90 N·s and 148 unpushed controls. The second training stage used impulses of 10–65 N·s. Known limits are kept on record: one walking push (45 N·s backward, keep walking) ends with forward speed 1.2033 times the control against a 1.2 limit, and a 60 ms swing-foot scuff breaks one step-chain diagnostic.",
        tags: ["Checkpoint gates", "Phase-swept pushes", "Regression tracking"],
        media: ["supermimic/walk-push"],
      },
      {
        id: "human-reference",
        label: "Against human data",
        headline: "Replaying measured human pushes",
        summary:
          "DeCIMo’s unperturbed group has 630 pushes on 21 standing young adults, measured with a force sensor on the push rod. I scaled each recorded force history to the body’s mass and applied it to the chest. None of the 3,150 replays produced a contact other than the feet, and 3,147 met the full stop-and-stand test. Under the hardest pushes the people moved about 0.5–0.6 m and usually stepped; the controller mostly stayed where it was.",
        paragraphs: [
          "Its final center-of-mass displacement exceeded 0.15 m in 7.3% of replays, against 46.3% of the human trials. Pushed from the front, it backs off with two to four steps. In the other directions it braces with ankles, hips and trunk and keeps both feet planted. The replay does not match each person’s push height, posture or inertia, so I read this as a different response, not as a calibrated measure of human recovery.",
          "I recorded the difference and did not train against it. A character that gives way when shoved would be a new design goal for the game, not a bug fix.",
        ],
        detail:
          "Dataset: DeCIMo, Chatagnon et al., Zenodo 10512652, CC BY 4.0; unperturbed group only. Forces are scaled by 70.4 kg over the subject’s mass and applied at the chest center of mass, about 0.08–0.1 m below the human push height, in the five measured directions. The three unfinished replays are one 43 N·s push from the front that was still taking corrective steps when the window ended, in each of the three stop runs.",
        tags: ["DeCIMo", "Human comparison", "Stop and continue intents"],
        media: ["supermimic/stand-push"],
      },
    ],
  },
  {
    id: "landing",
    label: "Superhuman landing",
    systems: [
      {
        id: "capability-scale",
        label: "Scaling strength",
        headline: "Scaling strength without breaking the motors",
        summary:
          "The capability factor first scaled the motor gains along with the ceilings. At 1.5× the body fell over while standing still, with or without the policy. Trunk and hip torques flipped sign on every substep.",
        paragraphs: [
          "The explicit PD loop stays stable only while the factor times the substep stays under about 1 ms, so 8× would need 0.125 ms steps and eight times the physics cost. A single-joint estimate allowed 4.4×. The real limit came from a coupled trunk–hip mode and began at 1.3×, so the 1× body already sits near the edge. Two changes stood at 100% from 1× to 8×: shrinking the substep to 1/s ms, or keeping gains at 1× and scaling only the torque, speed and power ceilings. The second one was adopted.",
          "It has a cost. Position error alone can now request only about the gain times the joint range: roughly 7.6× static strength at the knee, 2.8× at the ankle and 1.3–2× in the trunk. The higher ceilings come into play through damping under fast loading, such as a landing. At 1× nothing changed: three closed-loop test cases end the same way, within 2.5 cm.",
        ],
        detail:
          "Measured with a per-substep torque trace of a still stand. With ceilings-only scaling, 22 of 22 standing tests from 1× to 8× hold at 1 ms, and rerunning the landing grid changed no outcome. Static, weightlifting-style superhuman strength would need this decision revisited.",
        tags: ["Numerical stability", "Explicit PD", "Capability scaling"],
        media: [],
      },
      {
        id: "landing-probe",
        label: "Landing probe",
        headline: "Dropping the untrained controller from height",
        summary:
          "Before any landing training I dropped the frozen controller from 0.5 to 20 m at four strength levels, with forward or sideways speed up to 10 m/s. It has never practised airborne starts and cannot see its strength level. With more strength it caught higher drops: 1 m at 1×, 2 m at 2×, 3 m at 4× and 5 m at 8×.",
        paragraphs: [
          "With the joints locked in a standing pose and no policy, the body caught lower drops at every strength level, so part of the existing balance skill transfers. Any horizontal speed of 6 m/s or more ends in a fall at every height and strength (84 of 84 policy runs), usually within 0.3 s of touchdown: the controller never steps or runs out to shed the speed. At 3 m/s it stops after four to nine steps from drops of 0.5–3 m, depending on strength.",
          "I first read the unused knee torque in the high drops as proof that only skill was missing. That ratio ignores speed and power limits and the moment the peak occurs, so I withdrew it. What remains is a hypothesis to test: training on these touchdown states, with strength as an input, should turn some of these falls into stands.",
        ],
        detail:
          "Each run starts from the idle stand 0.25 m above the ground with the vertical speed of a free fall from the given height; there is no air phase. A stand means no non-foot contact after touchdown and at least 95% stable frames in the final 2 s. The grid has 336 runs under the ceilings-only rule, 168 with the policy and 168 with the locked pose, on MuJoCo C on the CPU (eight processes, about four minutes). Maximum contact penetration was 6.6 cm, in a 20 m drop.",
        tags: ["Zero-training probe", "Capability sweep", "MuJoCo C"],
        media: ["supermimic/landing-3m", "supermimic/landing-high", "supermimic/landing-horizontal"],
      },
      {
        id: "landing-training",
        label: "Landing training (in progress)",
        headline: "Landing training: first round stopped at the model check",
        summary:
          "The first bounded training round gives the policy, world model and critic the strength level as one input, log2 s, starting from the frozen baseline with the new weights at zero. Landing episodes start from touchdown frames of GASP landing clips, checked against foot geometry, up to 3 m and 3 m/s. A quarter of them stay at 1×, and a trained policy must match the baseline on the walking, stopping and push tests before it counts.",
        paragraphs: [
          "Before training the policy, I checked whether the world model could predict landings. After 500 model-only rounds, its median root-position error 32 steps after touchdown stopped improving at 0.17–0.22 m, 10–15 times its error in calm walking at 1×. The policy learns through exactly those 32-step rollouts, so the round saved the updated model and stopped. The policy did not change.",
          "The stopping threshold, 1.5 times the calm-walking error, was my own and is probably too strict, because calm walking has no impacts. A fairer reference would be the model’s error on push-recovery windows, where the policy did learn to recover. I have not measured that yet. A continuation from the saved checkpoint is under way, and this page includes no results from it. No version of the controller has yet landed from 6 m/s of horizontal speed.",
        ],
        detail:
          "With the new starting states, the frozen baseline stood in 960 of 1,392 landings up to 3 m and 3 m/s; its typical failure is sitting or lying down 0.4–0.6 s after touchdown without stepping. On the GPU, the 1,024 landing worlds matched their planned states to 1e-6, and the extended policy matched the original on 250 real inputs to 5.9e-4, a difference that comes from TF32 matrix tiling. A statistics reset that modified a tensor created in inference mode aborted the first attempt; it now reallocates the tensor, and the smoke test covers that path.",
        tags: ["Capability input", "World-model check", "Open problem"],
        media: [],
      },
    ],
  },
  {
    id: "unreal",
    label: "Unreal Engine",
    systems: [
      {
        id: "ue-runtime",
        label: "Running in Unreal",
        headline: "Running the controller inside Unreal Engine",
        summary:
          "In Unreal Engine 5.8 the mannequin walks, takes a 45 N·s push to the chest from the front at 2.0 s, receives a stop command 0.3 s later and settles into a stand. Every bone pose comes from the simulated body. The walk clip is only the policy’s reference input. The hunched walk comes from that LAFAN1 clip, which has the chest tilted 27–39°; the body follows it to within 4°.",
        paragraphs: [
          "The plugin embeds MuJoCo 3.5 on the CPU in double precision, runs the policy as ONNX through NNE, and ports the finite motor to C++. It is a Mover movement mode and the only writer of the pawn’s transform while active. For one character, a 20 ms control step costs about 1.3 ms for the policy and 1.1 ms for physics. Automation tests compare the NNE policy with the original on 250 recorded inputs, to an error below 1e-4. They also replay three 490-tick test cases, each of which must end with the same outcome as the offline evaluation.",
          "The first recordings looked as if the body was being pulled back. I traced four causes. The reference walk surges on every step. Mover’s fixed tick advances 16 ms of simulation per 16.67 ms of real time, so recording at 62.5 fps skipped a tick every 25 frames. The poseable mesh refreshed before the pawn ticked, so it drew the previous pose under the new capsule position. Linear interpolation also bent the velocity at every tick. The pawn now samples its pose snapshots 35 ms behind the simulation’s continuous time along Catmull-Rom Hermite curves, and refreshes the bones after posing.",
        ],
        detail:
          "The plugin is opt-in and not enabled by the project; it is built in a separate host project so open editors keep running. Its scope is one character on flat ground: walking, a stop command and the tested chest pushes. Combat, animation-blueprint hand-back to motion matching, networking and uneven ground are not connected. The slow-motion recording only runs fewer fixed ticks per frame; the physics is unchanged.",
        tags: ["Unreal Engine 5.8", "Mover", "NNE / ONNX Runtime", "MuJoCo C", "C++"],
        media: ["supermimic/ue-walk-push", "supermimic/ue-push-slow"],
        diagram: "bodyruntime",
      },
    ],
  },
];

export const supermimic: Project = {
  slug: "supermimic",
  number: "08",
  title: "SuperMimic Body Control",
  category: "Physics-based character control / Reinforcement learning",
  period: "Oct 2026 — Present",
  role: "Independent developer",
  team: "Project Rivering · personal project",
  intro: "A simulated human body with human strength limits, controlled by a learned policy.",
  cardSummary:
    "A 70.4 kg simulated body with strength-limited motors, trained with a world-model method to walk, run, stop and recover from pushes, now running inside Unreal Engine.",
  deck: "Characters in Project Rivering should stay on their feet when shoved, stop from a run and land from a height, within what their bodies could physically do. I built a simulated human with 34 strength-limited joint motors and trained a policy to drive it with SuperMimic, a published method in which the policy learns by backpropagating through a learned world model. The policy follows reference clips and switches to stopping on command. The frozen controller walks, runs at about 5 m/s, stops and recovers from pushes in closed-loop tests, and runs inside Unreal Engine through a Mover movement mode. Landing with superhuman strength is the current open problem.",
  tags: ["Python", "PyTorch", "MuJoCo", "mjlab", "C++", "Unreal Engine 5", "Mover", "NNE / ONNX Runtime"],
  hero: "supermimic/ue-walk-push",
  groups,
  systems: groups.flatMap((group) => group.systems),
};
