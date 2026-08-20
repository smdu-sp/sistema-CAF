# Conventions — salas-reuniao-ui

This is a shadcn/ui-style component set (Radix UI primitives + Tailwind v3 utility classes), built for a Brazilian corporate intranet. There is no wrapper/provider required to use any component — colors, radii, and spacing are already resolved through Tailwind classes backed by CSS custom properties, compiled into the shipped stylesheet. Just import a component and use it; no `<ThemeProvider>` or context setup needed for standard light-mode rendering.

## Styling idiom: Tailwind utility classes over semantic tokens

Every component is styled with Tailwind classes whose color/radius values resolve through CSS variables — never inline styles, never component-scoped CSS files. Compose new layouts the same way: reach for these class names, not raw hex values or `var(--x)`.

| Purpose | Classes |
|---|---|
| Primary action / brand | `bg-primary`, `text-primary`, `text-primary-foreground` |
| Secondary surface | `bg-secondary`, `text-secondary-foreground` |
| Destructive / danger | `bg-destructive`, `text-destructive` (**not** `text-destructive-foreground` for standalone text — see gotcha below) |
| Muted / subdued | `bg-muted`, `text-muted-foreground` |
| Hover / highlight surface | `bg-accent`, `text-accent-foreground` |
| Card / popover surfaces | `bg-card`, `bg-popover`, with matching `-foreground` text |
| Page background/text | `bg-background`, `text-foreground` |
| Borders / inputs / focus ring | `border`, `border-input`, `ring-ring` |
| Corner radius | `rounded-sm` / `rounded-md` / `rounded-lg` (all keyed off one `--radius` variable, so they stay proportional if it changes) |

Buttons, badges, and similar components expose their variants as **props**, not raw classes — use `<Button variant="destructive" size="sm">`, not a hand-built className. Check each component's own `.prompt.md` for its exact variant/size options before composing one manually.

## Gotcha: opacity-modified utilities on these tokens don't render

`<color>/<opacity>` syntax — `bg-primary/10`, `text-destructive/50`, `ring-ring/50`, etc. — **does not compile in this build**. The color tokens are defined as complete `oklch(...)` values, which Tailwind v3's alpha-channel injection can't split. Any class using that syntax silently produces no rule at all — the element renders with no background/color, not a lighter tint. This already causes real, confirmed bugs in the shipped app (`Skeleton`'s entire appearance is `bg-primary/10` and is invisible; several dropdown/form components have unreadable text for the same reason). **Do not use opacity-modified utility classes with these tokens when composing new designs** — use a solid token (`bg-muted`, `bg-secondary`) or a hardcoded Tailwind palette color with opacity (`bg-slate-500/10` compiles fine; only the CSS-variable-backed theme tokens are affected) instead.

## Gotcha: `text-destructive-foreground` is near-white — never use it alone

`--destructive-foreground` is a near-white token meant to sit *on top of* a `bg-destructive` fill (e.g. inside a filled destructive button). Used as standalone text color on a light/white surface, it's invisible. For a plain destructive-colored label or icon, use `text-destructive` instead.

## Where the truth lives

- `styles.css` (and everything it `@import`s, including `_ds_bundle.css`) is the complete compiled stylesheet — every class referenced above is real and defined there.
- Each component's own `<Name>.prompt.md` documents its actual props/variants from the shipped type signature — treat it as the authoritative API reference, more so than this file.
- `lib/utils.ts`'s `cn()` (clsx + tailwind-merge) is what every component uses internally to merge a passed `className` with its own — passing `className="bg-accent"` to override a default predictably wins over the component's own background class.

## Example composition

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "salas-reuniao-ui";

function RoomCard() {
  return (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Sala de Reunião 3</CardTitle>
        <CardDescription>3º andar — Bloco B</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Capacidade para 8 pessoas, com TV e videoconferência.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Reservar</Button>
      </CardFooter>
    </Card>
  );
}
```
