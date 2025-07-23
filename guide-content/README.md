# Blog Posts Markdown System

This directory contains markdown files for blog posts. Posts are automatically imported into the database using the import script.

## Directory Structure

- `published/` - Posts that will be published immediately
- `drafts/` - Posts that will be saved as drafts

## Creating a New Blog Post

1. Create a new `.md` file in either `published/` or `drafts/`
2. Add frontmatter with required fields
3. Write your content in markdown
4. Run the import script

## Required Frontmatter Fields

```yaml
---
title: "Your Post Title"
excerpt: "A brief description of your post"
category: "Category Name"
---
```

## Optional Frontmatter Fields

```yaml
---
tags: ["tag1", "tag2", "tag3"]
featuredImage: "https://example.com/image.jpg"
publishedAt: "2024-01-20"  # YYYY-MM-DD format
isDraft: true  # Overrides directory placement
metaTitle: "SEO Title"
metaDescription: "SEO Description"
metaKeywords: ["keyword1", "keyword2"]
---
```

## Available Categories

- Dosage Calculations
- IV Therapy
- Unit Conversions
- Study Tips
- Clinical Practice
- Critical Care
- Pediatric Dosing

(New categories will be created automatically if they don't exist)

## Importing Posts

Run the import script to add/update posts in the database:

```bash
npm run blog:import
```

The script will:
- Create new posts if they don't exist
- Update existing posts with the same title
- Create categories and tags as needed
- Calculate reading time automatically
- Handle both published and draft states

## Writing Tips

### Use Clear Headings
```markdown
# Main Title
## Section Heading
### Subsection
```

### Add Code Examples
```markdown
```
Dose = Weight (kg) × Dose per kg
```
```

### Create Tables
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Value 1  | Value 2  |
```

### Include Lists
```markdown
1. Numbered item
2. Another item

- Bullet point
- Another point
```

### Emphasize Important Points
```markdown
**Bold text** for emphasis
*Italic text* for subtle emphasis
> Blockquotes for important notes
```

## Example Post

See the example posts in this directory for reference:
- `published/insulin-dosing-guide.md` - Comprehensive clinical guide
- `published/heparin-protocol-calculations.md` - Step-by-step calculations
- `drafts/bsa-calculations.md` - Draft post example

## Best Practices

1. **Use descriptive filenames** - They help identify posts quickly
2. **Keep excerpts concise** - 1-2 sentences maximum
3. **Choose specific tags** - Help users find related content
4. **Include examples** - Practical examples aid understanding
5. **Add images** - Use Unsplash or similar for professional images
6. **Test your markdown** - Preview before importing

## Troubleshooting

- **Import fails**: Check that required fields (title, excerpt, category) are present
- **Duplicate slugs**: Posts with the same title will update, not duplicate
- **Images not showing**: Ensure URLs are valid and use HTTPS
- **Formatting issues**: Test markdown syntax in a preview tool first