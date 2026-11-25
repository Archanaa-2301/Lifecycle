import React from 'react';

export type ComponentInfo = {
  id: string;
  name: string;
  group: 'CORE COMPONENT' | 'APPLICATION COMPONENT';
  purpose: string;
  operation: string;
  engineering: string[];
  interfaces: string[];
  checks: string[];
  documents: { title: string; type: string; relevance: string; status: string }[];
};

export const COMPONENTS: ComponentInfo[] = [
  {
    id: 'rebound-bumper', name: 'Rebound Bumper', group: 'CORE COMPONENT',
    purpose: 'Provides a progressive cushion near the shock absorber’s full-extension limit and helps manage end-of-travel impact.',
    operation: 'As the damper approaches maximum rebound travel, the bumper engages and progressively absorbs energy to reduce harsh contact loads.',
    engineering: ['Progressive compression curve and energy absorption', 'Bumper height, profile and engagement position', 'Material hardness, resilience and compression set', 'Durability over repeated rebound cycles'],
    interfaces: ['Piston rod / rebound-side stack', 'Rod guide and damper upper package', 'Available rebound travel envelope'],
    checks: ['Engagement point across tolerance stack', 'Compression force versus deflection', 'Temperature and ageing durability'],
    documents: [
      { title: 'Rebound Bumper — Part Specification', type: 'Component specification', relevance: 'Material, hardness, geometry and acceptance criteria', status: 'Reference template' },
      { title: 'Rebound Stop — Load / Deflection Validation', type: 'Validation report', relevance: 'Progressive compression and end-stop performance', status: 'Reference template' },
      { title: 'Rebound Bumper — Material & Durability Review', type: 'Material report', relevance: 'Compression set, ageing and cyclic durability', status: 'Reference template' },
    ],
  },
  {
    id: 'rod-guide', name: 'Rod Guide', group: 'CORE COMPONENT',
    purpose: 'Guides the piston rod concentrically through the upper damper assembly and supports the rod-sealing arrangement.',
    operation: 'Maintains rod alignment as the suspension moves while providing the bearing and sealing interfaces required at the damper opening.',
    engineering: ['Bore diameter, concentricity and running clearance', 'Bearing material and wear behaviour', 'Seal groove and surface interface geometry', 'Press-fit / retention and housing interface'],
    interfaces: ['Piston rod running surface', 'Damper tube / upper housing', 'Oil seal and guide retention features'],
    checks: ['Rod side-load and friction behaviour', 'Leakage and sealing performance', 'Wear, pull-out and dimensional capability'],
    documents: [
      { title: 'Rod Guide — Dimensional & GD&T Specification', type: '2D drawing / specification', relevance: 'Bore, concentricity, datum scheme and tolerances', status: 'Reference template' },
      { title: 'Rod Guide — Seal Interface Validation', type: 'Test report', relevance: 'Seal compatibility, friction and leakage', status: 'Reference template' },
      { title: 'Rod Guide — Wear & Retention Assessment', type: 'Engineering report', relevance: 'Bearing wear and guide retention capability', status: 'Reference template' },
    ],
  },
  {
    id: 'rod', name: 'Rod', group: 'CORE COMPONENT',
    purpose: 'Transfers suspension movement to the damper piston and provides the mechanical connection to the upper attachment.',
    operation: 'Moves axially through the rod guide as the suspension articulates, driving piston movement within the damper tube.',
    engineering: ['Rod diameter, straightness and run-out', 'Surface finish and coating / corrosion protection', 'Tensile strength, fatigue and buckling margin', 'Thread form and attachment interface'],
    interfaces: ['Piston attachment / internal stack', 'Rod guide and seal contact surface', 'Upper mount or vehicle-side connection'],
    checks: ['Hardness and tensile properties', 'Surface roughness and coating integrity', 'Fatigue, bending and corrosion resistance'],
    documents: [
      { title: 'Piston Rod — Material & Heat Treatment Specification', type: 'Material specification', relevance: 'Steel grade, strength, hardness and process controls', status: 'Reference template' },
      { title: 'Piston Rod — Surface Finish / Coating Drawing', type: '2D drawing', relevance: 'Seal-running surface, coating and roughness limits', status: 'Reference template' },
      { title: 'Piston Rod — Fatigue & Corrosion Validation', type: 'Validation report', relevance: 'Durability under axial and bending loads', status: 'Reference template' },
    ],
  },
  {
    id: 'spring-seat', name: 'Spring Seat', group: 'APPLICATION COMPONENT',
    purpose: 'Locates and supports the coil spring at the intended position in the vehicle-specific suspension package.',
    operation: 'Receives spring reaction load and transfers it into the damper or suspension structure while maintaining the spring’s seating position.',
    engineering: ['Spring contact profile and seating diameter', 'Load capacity, stiffness and local stress', 'Weld / attachment features where applicable', 'Corrosion protection and drainage'],
    interfaces: ['Coil spring end form', 'Damper body or support bracket', 'Wheelhouse and package clearances'],
    checks: ['Spring seating and clocking', 'Static / fatigue load capability', 'Clearance through full suspension travel'],
    documents: [
      { title: 'Spring Seat — Application 2D Drawing', type: '2D application drawing', relevance: 'Spring profile, mounting datums and package dimensions', status: 'Reference template' },
      { title: 'Spring Seat — Load Path & Strength Analysis', type: 'CAE report', relevance: 'Spring reaction load and local stress margins', status: 'Reference template' },
      { title: 'Spring Seat — Corrosion / Coating Specification', type: 'Process specification', relevance: 'Surface protection for vehicle environment', status: 'Reference template' },
    ],
  },
  {
    id: 'top-mount', name: 'Top Mount', group: 'APPLICATION COMPONENT',
    purpose: 'Connects the upper end of the suspension assembly to the vehicle body and manages structural and vibration interfaces.',
    operation: 'Carries damper and vehicle-side loads through the body attachment; elastomeric features, where used, help isolate noise and vibration.',
    engineering: ['Bolt pattern, interface geometry and stack height', 'Axial / radial stiffness and isolation behaviour', 'Load capacity, durability and retention', 'Body-side packaging and service access'],
    interfaces: ['Vehicle body tower / mounting studs', 'Damper rod upper attachment', 'Spring seat and surrounding package'],
    checks: ['Mounting pattern and torque access', 'Stiffness and NVH performance', 'Durability under multi-axis loading'],
    documents: [
      { title: 'Top Mount — Vehicle Interface Control Drawing', type: 'Interface drawing', relevance: 'Body bolt pattern, stack height and datums', status: 'Reference template' },
      { title: 'Top Mount — Stiffness & NVH Characterisation', type: 'Test report', relevance: 'Axial / radial stiffness and isolation response', status: 'Reference template' },
      { title: 'Top Mount — Multi-Axis Durability Plan', type: 'Validation plan', relevance: 'Vehicle load cases and endurance sequence', status: 'Reference template' },
    ],
  },
  {
    id: 'bumper-cap', name: 'Bumper Cap', group: 'APPLICATION COMPONENT',
    purpose: 'Provides a protective cover or interface around the bump-stop region within the vehicle-specific assembly.',
    operation: 'Shields the associated bumper area from environmental exposure and helps maintain the intended fit and clearance to adjacent parts.',
    engineering: ['Coverage, retention and assembly orientation', 'Clearance to bumper, rod and body-side features', 'Polymer durability and temperature resistance', 'Water, dust and debris management'],
    interfaces: ['Rebound / jounce bumper region', 'Rod or upper damper package', 'Adjacent body-side covers and clearances'],
    checks: ['Retention under vibration and handling', 'Full-travel interference check', 'Environmental and thermal ageing'],
    documents: [
      { title: 'Bumper Cap — Part & Retention Specification', type: 'Component specification', relevance: 'Geometry, material and retention requirements', status: 'Reference template' },
      { title: 'Bumper Cap — Assembly Clearance Study', type: 'Packaging report', relevance: 'Interference and full-travel clearance checks', status: 'Reference template' },
      { title: 'Bumper Cap — Environmental Durability Test', type: 'Validation report', relevance: 'Temperature, moisture, dust and vibration exposure', status: 'Reference template' },
    ],
  },
];

export function ComponentVisual({ index, className = '' }: { index: number; className?: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return <svg viewBox="0 0 240 170" role="img" aria-label={`${COMPONENTS[index].name} illustrative engineering view`} className={`h-full w-full text-cyan-300 ${className}`}>
    <defs><linearGradient id={`metal-${index}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a5f3fc" stopOpacity=".75"/><stop offset=".55" stopColor="#155e75" stopOpacity=".55"/><stop offset="1" stopColor="#0e2938" stopOpacity=".95"/></linearGradient></defs>
    <g {...common}>
      {index===0 && <><path d="M92 24h56v18l-7 8v56l7 9v22H92v-22l7-9V50l-7-8z" fill={`url(#metal-${index})`}/>{[52,63,74,85,96].map(y=><path key={y} d={`M100 ${y}h40`} opacity=".8"/>)}<path d="M75 34h90M75 130h90" strokeDasharray="4 5" opacity=".55"/></>}
      {index===1 && <><path d="M86 30h68l10 18v75l-10 18H86l-10-18V48z" fill={`url(#metal-${index})`}/><circle cx="120" cy="85" r="26"/><circle cx="120" cy="85" r="13"/><path d="M76 57h-18M76 112H58M164 57h18M164 112h18M94 39h52M94 132h52"/></>}
      {index===2 && <><rect x="111" y="18" width="18" height="132" rx="7" fill={`url(#metal-${index})`}/><path d="M104 35h32M104 45h32M104 126h32M88 18h24M128 18h24" strokeDasharray="3 4"/></>}
      {index===3 && <><path d="M63 93h114l-12 34H75z" fill={`url(#metal-${index})`}/><path d="M76 91c0-18 14-32 44-32s44 14 44 32M84 57c10-12 62-12 72 0M91 48c10-9 48-9 58 0"/><path d="M73 135h94M120 20v20" strokeDasharray="4 5"/></>}
      {index===4 && <><path d="M76 48h88l-8 22H84z" fill={`url(#metal-${index})`}/><path d="M87 70v42c0 18 14 30 33 30s33-12 33-30V70M100 83h40M100 96h40M100 109h40"/><circle cx="120" cy="42" r="8"/></>}
      {index===5 && <><path d="M78 45h84l-7 73-16 18h-38l-16-18z" fill={`url(#metal-${index})`}/><path d="M78 57h84M85 68h70M92 80h56M96 136v10M144 136v10M120 20v18"/></>}
    </g>
    <g fill="#67e8f9" opacity=".8"><circle cx="25" cy="28" r="2"/><circle cx="211" cy="42" r="2"/><circle cx="37" cy="137" r="1.5"/><circle cx="202" cy="132" r="1.5"/></g>
    <path d="M20 155H220" stroke="#164e63" strokeWidth="1"/><text x="120" y="166" textAnchor="middle" fill="#67e8f9" fontSize="7" letterSpacing="2">ILLUSTRATIVE ENGINEERING VIEW</text>
  </svg>;
}
