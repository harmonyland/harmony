echo "-> Installing Deno"
if test -f "/home/codespace/.deno/bin/deno"; then
  echo "Deno already installed."
else
  curl -fsSL https://deno.land/x/install/install.sh | sh
  echo "-> Add Deno to PATH"
  echo "export DENO_INSTALL=\"/home/codespace/.deno/bin\"
export PATH=\"\$DENO_INSTALL:\$PATH\"" >> ~/.bashrc
fi

echo "-> Setup VS Code Config"
if test -f "./.vscode/settings.json"; then
  echo "Skipping VS Code Config, .vscode/settings.json already exists."
else
  mkdir .vscode
  echo "{
  \"deno.path\": \"/home/codespace/.deno/bin/deno\",
  \"deno.enable\": true,
  \"deno.config\": \"./deno.json\",
  \"deno.lint\": true,
  \"editor.tabSize\": 2,
  \"editor.defaultFormatter\": \"denoland.vscode-deno\",
  \"editor.formatOnSave\": true
}" > .vscode/settings.json
fi
