import type { Project } from "./projects";

export const material: Project = {
  slug: "material-recognition",
  number: "06",
  title: "Visual Material Recognition",
  category: "Machine learning / Computer vision",
  period: "Fall 2026",
  role: "Data preprocessing, transformer training & evaluation",
  team: "Georgia Tech CS 4641 · Group 66",
  intro: "I fine-tuned DeiT-Small to recognize 23 materials in photographs.",
  cardSummary: "DeiT-Small reached 86.38% on the MINC test set. I then tested center crops and surface masks on images where the model confused nearby materials.",
  deck: "Our ResNet18 scored 78.07% on the MINC test set. DeiT-Small reached 86.38%. I reviewed its validation errors, adjusted the loss for common mix-ups, and tested crops and masks around the labeled surface.",
  tags: ["PyTorch", "scikit-learn", "DeiT-Small", "EfficientSAM"],
  hero: "material-recognition/review-budget",
  systems: [
    {
      id: "model-comparison", label: "1. DeiT-Small vs. ResNet18",
      headline: "1. Fine-tuned DeiT-Small and compared it with ResNet18",
      summary: "I prepared the MINC-2500 data for our team. My teammates trained the logistic regression, MLP and ResNet18 baselines. I started with ImageNet weights for DeiT-Small, replaced its classifier with a 23-class head and fine-tuned the whole network. We used the official split of 48,875 training, 2,875 validation and 5,750 test images.",
      detail: "Training at 224 × 224 pixels took 27 min 36 s for 20 epochs on my RTX 4080 SUPER, including validation after each epoch. Epoch 18 was the first to reach 86.40% validation accuracy. The logistic regression and MLP used frozen ResNet18 features. The best MLP configuration used 512 input features and one 128-unit sigmoid layer.",
      tags: ["MINC-2500 split 1", "ImageNet initialization", "Macro-F1"], media: [],
    },
    {
      id: "confusion-matrix", label: "2. Confusion matrix",
      headline: "2. Used the confusion matrix to guide fine-tuning",
      summary: "I counted how often DeiT mistook one material for another in either direction. Seven pairs accounted for 91 mix-ups. I continued training on all 23 classes at 336 × 336 pixels, with an extra loss term for those seven pairs. Their mix-ups fell to 72. Across the validation set, 114 predictions became correct and 94 became wrong, raising accuracy from 86.40% to 87.10%.",
      paragraphs: [
        "Glass and mirror went from 19 mix-ups to 12. Fabric and leather went from 18 to 16. I tried a separate rule for the 57 images where fabric and leather ranked first and second in either order. All five validation folds kept the original threshold. Adding a center crop for those 57 images fixed one prediction and introduced three errors.",
      ],
      detail: "I selected pairs with at least ten mix-ups between them. The extra pairwise loss had a weight of 0.35. I also changed the augmentation and crop scale. Running the original checkpoint at 336 pixels gave 85.36%. With the new training settings, epoch 4 of 6 gave the best validation score. All subsequent MINC experiments used this same validation set for development.",
      tags: ["Confusion matrix", "Pairwise loss", "Threshold tuning"], media: [],
    },
    {
      id: "target-point", label: "3. Center crops and boxes",
      headline: "3. Tested center crops and object boxes",
      summary: "MINC labels the material at the center of a photo patch. A patch can include a ceramic bowl, food and the table beneath it. I first trained a classifier on the center 5 × 5 patches from DeiT’s ninth layer. Then I gave the model a second input, a magnified 128-pixel crop of the same photo, and trained it to combine the two predictions.",
      detail: "Of the 371 mistakes at 87.10%, the correct material ranked second in 206 images, third in 60 and lower in 105. The center classifier fixed 33 of the second-place cases and one third-place case. In the two-input model I kept the full-image branch frozen, fine-tuned the last four transformer blocks of the crop branch, and used each branch’s top-two score gap to learn how much weight to give the crop.",
      tags: ["Center patches", "Two-view fusion", "YOLO26n"], media: [],
    },
    {
      id: "selective-segmentation", label: "4. Surface masks",
      headline: "4. Used surface masks to select image patches",
      summary: "I gave EfficientSAM-Ti the labeled center point to get a mask of the surface. A small classifier pooled the DeiT patches inside the mask and in a narrow ring around it, then added its material scores to the existing prediction. This changed a bowl from metal to ceramic and a sofa from paper to leather. It also changed a correctly classified brick floor to “other.”",
      detail: "I froze EfficientSAM and both DeiT backbones and trained 17,687 parameters in the surface classifier. A separately trained version that pooled patches inside the mask’s bounding rectangle got 2,547 images right, one fewer than the mask. For selective segmentation, I set a confidence threshold using two validation folds and applied it to the third, rotating until each image had been evaluated once. I tested budgets of 5%, 10%, 20% and 40%.",
      tags: ["EfficientSAM-Ti", "Mask pooling", "Confidence threshold"], media: [],
    },
    {
      id: "runtime", label: "Inference time and P99",
      headline: "Inference time on an RTX 4080 SUPER",
      summary: "I timed six ways to classify the same 959 images. Segmenting only low-confidence images at the 20% budget cut median latency from 42.13 to 11.82 ms. P99 fell from 131.03 to 115.73 ms.",
      detail: "The policy for these 959 images was calibrated on the other 1,916 validation images. I decoded each image once before running the six paths. Each percentile uses all 959 timings for that path, including images that triggered segmentation.",
      tags: ["Batch 1", "CUDA synchronization", "P99 latency"], media: [],
    },
    {
      id: "second-view", label: "Second camera view",
      headline: "Tested a second camera view on ObjectFolder Real",
      summary: "I also tested both models on 20 held-out physical objects, with 16 pairs of camera views per object. ResNet18 classified all 64 first views of four ceramic vases as plastic. DeiT classified all 64 as ceramic, but missed all 32 first views of glass objects.",
      detail: "For each model, I set the threshold at the 30th percentile of first-view confidence on separate validation objects. When confidence fell below that threshold, I averaged the class probabilities from both camera views. The 320 test pairs include repeated views of the same 20 objects.",
      tags: ["Object-disjoint evaluation", "Paired camera views"], media: [],
    },
  ],
};
