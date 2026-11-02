import os, sys
sys.stdout.reconfigure(encoding='utf-8')

for f in os.listdir('.'):
    if f.endswith(('.html', '.js', '.css')):
        with open(f, 'r', encoding='utf-8') as file:
            c = file.read()
        if '#onboarding-cta' in c:
            print(f"Found #onboarding-cta in {f}")
