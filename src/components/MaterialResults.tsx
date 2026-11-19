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
        <p>DeiT correctly labeled 4,967 of 5,750 test images, up from 4,489 with ResNet18. That adds 478 correct answers and 8.31 percentage points of accuracy.</p>
        <p className="material-note">¹ The team selected MLP checkpoints by validation accuracy. Its results table gives macro-F1 for 12 configurations and leaves the final scoring split and exact top-1 accuracy unspecified.</p>
      </ResultsTable>;
    case "target-point":
      return <ResultsTable id="refinement-scores" caption="Fine-tuning on the same 2,875 validation images"
        columns={["DeiT configuration", "Correct", "Top-1", "Fixed", "New errors"]}
        rows={[
          ["224 px, full image", "2,484", "86.40%", "—", "—"],
          ["336 px, confusion-directed training", "2,504", "87.10%", "114", "94"],
          ["Center patch head", "2,512", "87.37%", "34", "26"],
          ["Full image + learned center crop fusion", "2,537", "88.24%", "43", "18"],
        ]}>
        <p className="material-note">Each row compares individual predictions with the previous row. The first checkpoint also ran on the held-out test set. Later experiments used validation for error analysis and model selection.</p>
        <p>I also replaced the fixed crop with a YOLO object box while keeping the classifier frozen. It corrected 5 images and introduced 17 errors, leaving 2,525 correct. An object box could contain several surfaces, so I next trained the classifier to use features inside a surface mask.</p>
      </ResultsTable>;
    case "selective-segmentation":
      return <ResultsTable id="mask-scores" caption="Segmentation calls and their effect on the same validation predictions"
        columns={["Policy", "Calls / 2,875", "Correct", "Top-1", "Fixed", "New errors"]}
        rows={[
          ["Full image + center crop", "0", "2,537", "88.24%", "—", "—"],
          ["10% budget", "293", "2,550", "88.70%", "33", "20"],
          ["20% budget", "572", "2,548", "88.63%", "38", "27"],
          ["Always segment", "2,875", "2,548", "88.63%", "38", "27"],
        ]}>
        <p>The last three rows use the same score fusion. Fixes and new errors are measured against the full-image and center-crop prediction. The 20% policy skipped 80.10% of segmentation calls and matched the always-on label on all 2,875 images.</p>
        <p>Among the 105 images whose true material originally ranked fourth or lower at 336 px, the center-crop model got one right. Adding segmentation raised that count to three. Most of the overall improvement came from other images.</p>
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
