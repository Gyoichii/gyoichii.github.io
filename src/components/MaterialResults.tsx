import type { ReactNode } from "react";

type ResultsTableProps = {
  id: string;
  caption: string;
  columns: string[];
  rows: string[][];
  children?: ReactNode;
};

function ResultsTable({ id, caption, columns, rows, children }: ResultsTableProps) {
  return <div className="material-results">
    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Keyboard users can scroll wide tables within this named region. */}
    <div className="material-table-scroll" role="region" aria-labelledby={id} tabIndex={0}>
      <table className="case-table">
        <caption id={id}>{caption}</caption>
        <thead><tr>{columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
        <tbody>{rows.map(([label, ...values]) => <tr key={label}>
          <th scope="row">{label}</th>
          {values.map((value, index) => <td key={columns[index + 1]}>{value}</td>)}
        </tr>)}</tbody>
      </table>
    </div>
    {children}
  </div>;
}

export function MaterialResults({ section }: { section: string }) {
  switch (section) {
    case "model-comparison":
      return <ResultsTable id="baseline-scores" caption="MINC-2500 classifier results"
        columns={["Model", "Evaluation", "Top-1 accuracy", "Macro-F1"]}
        rows={[
          ["Logistic regression (C = 1)", "Test", "62.59%", "0.6250"],
          ["Logistic regression (C = 0.01)", "Test", "63.70%", "0.6360"],
          ["MLP (128 hidden units)", "Team model sweep¹", "Unreported", "0.6296"],
          ["ResNet18 CNN", "Test", "78.07%", "0.7809"],
          ["DeiT-Small vision transformer", "Test", "86.38%", "0.8637"],
        ]}>
        <p>DeiT labeled 4,967 test images correctly. ResNet18 got 4,489 right on the same images, a difference of 478.</p>
        <p className="material-note">¹ The team selected MLP checkpoints by validation accuracy. Its results table gives macro-F1 for 12 configurations and leaves the final scoring split and exact top-1 accuracy unspecified.</p>
      </ResultsTable>;
    case "target-point":
      return <ResultsTable id="refinement-scores" caption="Center crops on 2,875 MINC validation images"
        columns={["DeiT configuration", "Correct", "Top-1", "Fixed", "New errors"]}
        rows={[
          ["336 px, full image", "2,504", "87.10%", "—", "—"],
          ["Full image + center patch classifier", "2,512", "87.37%", "34", "26"],
          ["Full image + magnified center crop", "2,537", "88.24%", "43", "18"],
        ]}>
        <p className="material-note">Fixes and new errors compare each row with the row above it.</p>
        <p>I reviewed 105 images where the correct material had ranked fourth or lower. In 43 of them, other materials, occlusion or a nearby object made the target hard to pick out. The magnified crop alone identified 16 of the 105. After combining it with the full image, the model kept only one of those correct answers.</p>
        <p>I also tried replacing the fixed crop with a YOLO26n object box and kept the classifier frozen. That fixed 5 images and introduced 17 errors, dropping the total from 2,537 to 2,525. A box around a bowl can still include both the ceramic rim and the food inside.</p>
      </ResultsTable>;
    case "selective-segmentation":
      return <ResultsTable id="mask-scores" caption="Segmenting every image or only low-confidence images"
        columns={["Policy", "Calls / 2,875", "Correct", "Top-1", "Fixed", "New errors"]}
        rows={[
          ["Full image + center crop", "0", "2,537", "88.24%", "—", "—"],
          ["10% budget", "293", "2,550", "88.70%", "33", "20"],
          ["20% budget", "572", "2,548", "88.63%", "38", "27"],
          ["Always segment", "2,875", "2,548", "88.63%", "38", "27"],
        ]}>
        <p>I used the model’s highest class probability to decide whether to run segmentation. At the planned 20% budget, 572 images fell below the threshold. That saved 2,303 mask computations (80.10%) and gave the same label as always segmenting on every image.</p>
        <p>The 10% budget scored highest on validation. It missed five corrections that always segmenting made, but also avoided seven new errors. On the 105 difficult images from the crop experiment, segmentation raised the number correct from one to three.</p>
        <p className="material-note">Fixes and new errors in this table are relative to the full-image and center-crop model. The later tuning and segmentation results are development validation scores. The held-out MINC test score is for the original DeiT-Small.</p>
      </ResultsTable>;
    case "runtime":
      return <ResultsTable id="runtime-scores" caption="One image to one label, milliseconds per image"
        columns={["Inference path", "Mean", "P50", "P95", "P99"]}
        rows={[
          ["ResNet18 · 224 px", "4.71", "3.23", "9.99", "20.14"],
          ["DeiT-Small · 224 px", "6.36", "4.68", "12.93", "21.25"],
          ["Full image + center crop", "13.17", "9.49", "25.60", "34.65"],
          ["10% segmentation budget", "17.78", "10.12", "43.75", "107.65"],
          ["20% segmentation budget", "22.18", "11.82", "53.96", "115.73"],
          ["Always segment", "58.59", "42.13", "115.44", "131.03"],
        ]}>
        <p>Each path processed the same 959 validation images from fold 0 after 24 separate warm-up images. I rotated the six paths’ execution order per image and measured elapsed wall time with CUDA synchronized at both ends. The 20% policy requested 204 masks and matched all 959 always-on labels. Each of the six paths reproduced its archived predictions on every image.</p>
        <p>An earlier run alternating only the two segmentation policies gave a lower P99 for both, at 99.54 ms always-on and 56.35 ms selective. Both runs used the same images, RTX 4080 SUPER, PyTorch 2.11.0 with CUDA 12.8, and batch size 1. Absolute tail latency varied between runs.</p>
        <p className="material-note">The timer includes preprocessing, transfers to the GPU, all requested model passes and the final decision. Camera capture, image decoding, disk I/O, model loading and object detection are outside the measurement. LR and MLP have no comparable image-to-label timing here.</p>
        <p className="material-downloads"><a href="/data/material-recognition/six-path-timings.csv" download>Six-path timings (CSV)</a><a href="/data/material-recognition/paired-timings.csv" download>Two-policy timings (CSV)</a></p>
      </ResultsTable>;
    case "second-view":
      return <ResultsTable id="object-scores" caption="Conditional second views on 320 held-out pairs"
        columns={["Model", "First view correct", "Second views used", "Fixed", "New errors", "Final correct"]}
        rows={[
          ["ResNet18", "120", "112", "13", "10", "123"],
          ["DeiT-Small", "201", "30", "5", "3", "203"],
        ]}>
        <p>DeiT gained two correct decisions from looking again, compared with three for ResNet18. Its larger advantage was identifying the material on the first view. Each pair comes from one of 20 objects, so the counts include correlated views of the same physical item.</p>
      </ResultsTable>;
    default:
      return null;
  }
}
