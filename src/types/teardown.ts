export interface TeardownIdea {
  id: string;
  title: string;
  description: string;
  potentialCostReductionPercent: number;
  potentialWeightReductionPercent: number;
  feasibilityScore: number; // 1-10
  riskLevel: 'Low' | 'Medium' | 'High';
  category: 'Material Substitution' | 'Process Optimization' | 'Design Simplification' | 'Supplier Localization';
  status: 'Proposed' | 'Under Review' | 'Approved' | 'Rejected';
  author: string;
  date: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  author: string;
  action: string;
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
}

export interface TeardownPart {
  id: number; // 1 to 17
  slug: string;
  name: string;
  assembly: string;
  vehicle: string;
  engineer: string;
  status: 'TEARDOWN' | 'IN_REVIEW' | 'COMPLETED' | 'BENCHMARKED';
  partNo: string;
  partDescription: string;
  photoUrl: string;
  primaryFunction: string;
  probableCostINR: number;
  weightKg: number;
  material: string;
  manufacturingProcess: string;
  // Extended benchmarking fields
  dimensions?: {
    outerDiameterMm?: number;
    innerDiameterMm?: number;
    lengthMm?: number;
    thicknessMm?: number;
    tolerance?: string;
  };
  supplier?: string;
  quantityPerEngine?: number;
  wearNotes?: string;
  ideas: TeardownIdea[];
  history: HistoryEntry[];
  lastUpdated: string;
}
