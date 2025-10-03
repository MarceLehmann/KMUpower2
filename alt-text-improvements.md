# Alt-Text Verbesserungen für KMUpower

## Aktuelle problematische Alt-Texte:

### Logo-Wall Bilder (Zeile 512-516 in index.html):
❌ SCHLECHT: `alt="Kunden Logo 1"`
✅ BESSER: `alt="Firmenlogo des Kunden XYZ AG"`

### Founder-Image (Zeile 543 in index.html):
❌ SCHLECHT: `alt="Portrait of Marcel Lehmann"`  
✅ BESSER: `alt="Marcel Lehmann, Microsoft MVP und Gründer von KMUpower"`

## Verbesserungsvorschläge:

1. **Ersetzen Sie generische Alt-Texte durch beschreibende:**
   - `alt="Kunden Logo 1"` → `alt="Logo eines zufriedenen KMU-Kunden"`
   - `alt="Microsoft MVP banner"` → `alt="Microsoft MVP Logo - Auszeichnung für Marcel Lehmann"`

2. **Für Service-Icons verwenden Sie:**
   - Aktuelle SVG-Icons sind dekorativ, fügen Sie `aria-hidden="true"` hinzu
   - Beschreibung gehört in den Text, nicht ins Alt-Attribut

3. **Für Produktbilder:**
   - Beschreiben Sie konkret was zu sehen ist
   - Fokus auf Nutzen für den Betrachter