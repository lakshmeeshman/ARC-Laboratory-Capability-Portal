import os

spbuild_file = os.path.join(os.path.dirname(__file__), "node_modules", "@microsoft", "sp-build-web", "lib", "SPBuildRig.js")
print(f"Targeting: {spbuild_file}")

if os.path.exists(spbuild_file):
    with open(spbuild_file, "r") as f:
        content = f.read()
    
    # Bypass node version check throw
    modified = content.replace("throw new Error(`Your dev environment is running NodeJS version ${nodeVersion}", "console.warn(`[Node Check Bypassed] Dev environment NodeJS version ${nodeVersion}")
    with open(spbuild_file, "w") as f:
        f.write(modified)
    print("Successfully patched SPBuildRig.js for Node 22 compatibility!")
else:
    print("SPBuildRig.js file not found.")

