import os

spfx_nm = os.path.join(os.path.dirname(__file__), "node_modules", "@microsoft")
patched = 0

for root, dirs, files in os.walk(spfx_nm):
    for f in files:
        if f.endswith(".js"):
            fpath = os.path.join(root, f)
            try:
                with open(fpath, "r", encoding="utf-8") as file:
                    content = file.read()
                if "Your dev environment is running NodeJS version" in content:
                    modified = content.replace("throw new Error(`Your dev environment is running NodeJS version", "console.warn(`[Bypassed] NodeJS version")
                    modified = modified.replace("throw new Error(\"Your dev environment is running NodeJS version", "console.warn(\"[Bypassed] NodeJS version")
                    with open(fpath, "w", encoding="utf-8") as file:
                        file.write(modified)
                    patched += 1
                    print(f"Patched node check in: {fpath}")
            except Exception as e:
                pass

print(f"Total files patched: {patched}")

