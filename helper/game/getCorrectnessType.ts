import { CorrectnessType } from "@/types/game/correctnessType";

export default function getCorrectnessType(
  categoryType: string,
  correctness: number,
): CorrectnessType {
  let correctnessType = CorrectnessType.UNKNOWN;
  if (categoryType == "string") {
    switch (correctness) {
      case -1:
        correctnessType = CorrectnessType.NONE;
        break;
      case 0:
        correctnessType = CorrectnessType.WRONG;
        break;
      case 1:
        correctnessType = CorrectnessType.PARTIAL;
        break;
      case 2:
        correctnessType = CorrectnessType.CORRECT;
        break;
    }
  } else if (categoryType == "number") {
    switch (correctness) {
      case -1:
        correctnessType = CorrectnessType.NONE;
        break;
      case 0:
        correctnessType = CorrectnessType.HIGHER;
        break;
      case 1:
        correctnessType = CorrectnessType.CORRECT;
        break;
      case 2:
        correctnessType = CorrectnessType.LOWER;
        break;
    }
  }
  return correctnessType;
}
