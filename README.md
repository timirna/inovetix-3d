# Inovetix frontend clone

Static frontend mirror of the Inovetix Digital Agency site (Next.js + Payload) originally at `http://178.128.208.167:3030`.

- Frontend only: UI pages, JS/CSS, images, fonts, videos, and Payload `/api/media` files downloaded as static assets.
- Backend APIs (forms, CMS admin, auth) are not included; those calls will fail or no-op.
- No public sourcemaps were found on the origin (`.js.map` → 404).
- Built for GitHub Pages at `https://timirna.github.io/inovetix-3d/` (asset paths prefixed with `/inovetix-3d`).

## Local preview

```bash
cd docs-or-root
python3 -m http.server 8080
# open http://localhost:8080/inovetix-3d/  (or serve parent with correct base)
```

For local root serving without base path, search-replace `/inovetix-3d` → `` in HTML/CSS.
