 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index 4b0f1eb6f93810067a3d3500602e5d4470905d70..0b07d529260697c742e64c1466b0825c67d0c80e 100644
--- a/README.md
+++ b/README.md
@@ -1 +1,22 @@
-# repo-exercise
\ No newline at end of file
+# NexaTrade
+
+NexaTrade is a fully interactive front-end crypto trading platform prototype with:
+- live-simulated market prices
+- instant buy/sell execution logic
+- real-time portfolio valuation and P/L
+- AI-style trading signal panel
+- modern responsive UI
+
+## Run locally
+
+1. Open `index.html` directly in your browser, or
+2. Serve with a local server:
+   ```bash
+   python -m http.server 8080
+   ```
+
+Then open `http://localhost:8080`.
+
+## Important
+
+This build runs entirely in-browser and uses simulated market data (paper trading behavior).
 
EOF
)
