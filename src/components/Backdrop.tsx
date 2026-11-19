/**
 * Fixed paper backdrop — deliberately flat, so that paper-coloured foreground layers
 * (the hero dune, sheets) can melt into it without a visible seam. Texture comes from
 * the global grain layer instead.
 */
export default function Backdrop() {
  return <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-paper" />;
}
