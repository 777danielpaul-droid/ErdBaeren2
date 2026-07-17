// Subtiles Milchstraßen-Hologramm als fixer, vollflächiger Hintergrund
// (z-index:-10, pointer-events:none -> liegt hinter allem Content).
export default function MilkyWay() {
  return (
    <div className="milkyway" aria-hidden="true">
      <div className="milkyway__band" />
      <div className="milkyway__stars" />
    </div>
  )
}
