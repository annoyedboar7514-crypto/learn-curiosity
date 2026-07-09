// Era atmosphere wrapper — a tinted sky gradient behind the content plus the
// era's decorative motif at 8% opacity. Atmosphere, not decoration.
// Eras 1–3 are live content; 4–5 are reserved themes (flight / space age).

import type { ReactNode } from "react";
import "./child-kit.css";

export interface EraAtmosphereProps {
  era: 1 | 2 | 3 | 4 | 5;
  children?: ReactNode;
  className?: string;
}

export function EraAtmosphere({ era, children, className = "" }: EraAtmosphereProps) {
  return <div className={`ck-era ck-era-${era} ${className}`}>{children}</div>;
}
