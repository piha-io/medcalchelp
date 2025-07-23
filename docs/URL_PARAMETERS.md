# URL Parameters Documentation

## Practice Page URL Parameters

The practice page now supports URL parameters to enable direct linking to specific question categories.

### Usage

You can access specific practice categories directly using the `category` query parameter:

```
/practice?category=CATEGORY_ID
```

### Supported Categories

- `ALL` - Mix of all question types
- `DOSAGE_CALCULATION` - Oral, IM, SubQ medications
- `IV_DRIP_RATE` - mL/hr, gtt/min, pump settings
- `UNIT_CONVERSION` - Metric, household, apothecary
- `PEDIATRIC_DOSING` - Weight-based calculations
- `CRITICAL_CARE` - Vasoactive drips, titrations
- `INSULIN_DOSING` - Sliding scale, corrections
- `HEPARIN_PROTOCOL` - Bolus and infusion rates
- `RECONSTITUTION` - Powder to liquid calculations
- `DIMENSIONAL_ANALYSIS` - Unit conversion chains
- `CONCENTRATION` - mg/mL, percentages, ratios
- `DILUTION` - Stock solutions, dilution ratios

### Examples

```
# Direct link to IV Drip Rate questions
https://yoursite.com/practice?category=IV_DRIP_RATE

# Direct link to all categories mixed
https://yoursite.com/practice?category=ALL

# No category parameter - shows category selection screen
https://yoursite.com/practice
```

### Implementation Details

1. **URL Sync**: The selected category is synchronized with the URL parameter
2. **Validation**: Invalid categories are automatically cleared from the URL
3. **Navigation**: Browser back/forward buttons work correctly with URL state
4. **Bookmarking**: Users can bookmark specific practice categories
5. **Sharing**: Direct links can be shared to specific question types

### Technical Implementation

The feature is implemented using:
- TanStack Router's search params validation with Zod schema
- React state synchronized with URL parameters
- Automatic validation of category IDs against available categories
- Navigation updates when categories are selected or cleared

### Benefits

1. **Deep Linking**: Share direct links to specific practice categories
2. **Better UX**: Browser history navigation works naturally
3. **Bookmarking**: Users can save links to their favorite practice categories
4. **Analytics**: Track which categories are accessed via direct links
5. **SEO**: Better indexing of practice content by category