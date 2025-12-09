# Criteria for Generating HTML and JSON Files from Language Course DOCX Documents

## Overview
This document describes the exact structure and methodology used to convert a language curriculum DOCX document into a set of HTML lesson files and JSON practice question files for the Learning Management System.

---

## File Structure & Organization

### Directory Structure
```
templates/{language}/{level}/module-{number}/
├── intro.html                          (Module introduction - no questions)
├── 1.html, 2.html, 3.html, ... n.html (Numbered lesson files)
├── questions/
│   ├── 1.json, 2.json, ... n.json     (Practice questions for specific lessons)
│   └── CAT.json                        (Continuous Assessment Test)
```

### File Naming Conventions
1. **HTML Files**:
   - `intro.html` - Module introduction/overview
   - `{number}.html` - Sequential numbering (1, 2, 3, 4, 5, etc.)
   - Numbers correspond to topics/subtopics in the curriculum

2. **JSON Files**:
   - `{number}.json` - Only created for lessons that have practice questions
   - Numbering matches the corresponding HTML file
   - `CAT.json` - Module-level assessment (always present)
   - **Note**: Not every HTML file requires a corresponding JSON file

---

## HTML File Structure

### 1. Standard HTML5 Template
Every HTML file must follow this exact structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Descriptive Title Based on Content]</title>
    <style>
        /* CSS styles - see section below */
    </style>
</head>
<body>
    <div class="container">
        <!-- Content goes here -->
    </div>
</body>
</html>
```

### 2. Required CSS Styles (Exact Copy)
All HTML files must include this exact CSS in the `<style>` block:

```css
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    margin: 0;
    padding: 0;
    background-color: #f8f8f8;
}

.container {
    width: 90%;
    max-width: 1200px;
    margin-left: 5%;
    margin-right: 5%;
    padding: 20px;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2, h3, h4 {
    color: #008080;
    margin-top: 20px;
}

h2 {
    font-size: 24px;
    border-left: 4px solid #008080;
    padding-left: 10px;
}

h3 {
    font-size: 20px;
}

h4 {
    font-size: 18px;
}

p {
    margin-bottom: 15px;
}

blockquote {
    border-left: 4px solid #008080;
    padding-left: 15px;
    margin-left: 0;
    color: #555;
}

ul, ol {
    margin-bottom: 20px;
}

li {
    margin-bottom: 5px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

th, td {
    border: 1px solid #ddd;
    padding: 8px 12px;
    text-align: left;
}

th {
    background-color: #008080;
    color: white;
}

tr:nth-child(even) {
    background-color: #f2f2f2;
}

.example {
    background-color: #e6f3f3;
    padding: 10px;
    border-left: 3px solid #008080;
    margin-bottom: 15px;
}

.phoneme-table {
    margin: 20px 0;
}
```

**Key CSS Features:**
- Teal color scheme (#008080) for headings and accents
- Responsive container (90% width, max 1200px)
- Striped tables (even rows have gray background)
- Special `.example` class for highlighted content boxes
- Consistent spacing and typography

### 3. Content Structure Hierarchy

#### Heading Levels
Use semantic HTML headings in this hierarchy:
- **`<h2>`**: Main section titles (e.g., "3.1 Adjectives", "3.4.1 Introduction to Verbs")
- **`<h3>`**: Subsections (e.g., "1. Definition", "2. Morphological Structure")
- **`<h4>`**: Sub-subsections (e.g., "Core Feature:", "Examples:")

**Rules:**
- Always start with `<h2>` for the main topic
- Use sequential numbering in headings (3.1, 3.1.1, 3.2, etc.)
- Include descriptive text after numbers

#### Content Elements

1. **Paragraphs (`<p>`)**
   - Use for explanatory text
   - Wrap `<strong>` tags around key terms and labels
   - Example: `<p><strong>Agreement:</strong> Adjectives must agree with noun class...</p>`

2. **Lists (`<ul>` or `<ol>`)**
   - **Unordered lists**: For examples, categories, features
   - **Ordered lists**: For step-by-step instructions or numbered rules
   - Use `<strong>` for emphasis within list items
   - Example:
     ```html
     <ul>
         <li><strong>kũrĩa</strong> → to eat</li>
         <li><strong>kũhoya</strong> → to pray</li>
     </ul>
     ```

3. **Tables**
   - Used for structured comparative data
   - Always include `<thead>` and `<tbody>`
   - Headers use `<th>` tags
   - Data uses `<td>` tags
   - Common table types:
     - Morphological paradigms (singular/plural forms)
     - Verb conjugation tables
     - Vocabulary with translations
     - Examples with glosses

   **Example:**
   ```html
   <table>
       <thead>
           <tr>
               <th>Adjective root</th>
               <th>Example form</th>
               <th>English meaning</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>-nene</td>
               <td>Mũndũ mũnene</td>
               <td>big person</td>
           </tr>
       </tbody>
   </table>
   ```

4. **Blockquotes (`<blockquote>`)**
   - Use for special notes, mnemonics, or pedagogical tips
   - Often contains emojis (📌) for emphasis
   - Example:
     ```html
     <blockquote>📌 <strong>Mnemonic:</strong> Think of kũ- as the "key that unlocks action."</blockquote>
     ```

5. **Example Boxes (`.example` class)**
   - Use `<div class="example">` for highlighted examples
   - Contains illustrative sentences with translations
   - Example:
     ```html
     <div class="example">
         <p><strong>Kũhanda mbembe igũrũ gĩcigo kĩa mũgũnda ũcio wa gĩthaka.</strong></p>
         <p>→ "Planting maize in the upper part of the fertile farm."</p>
     </div>
     ```

### 4. Content Organization Patterns

Each lesson typically follows this structure:

1. **Main Topic Title** (h2)
2. **Definition/Introduction** (h3)
   - Core definition paragraph
   - Function/role explanation
3. **Morphological/Structural Analysis** (h3)
   - Morphological markers
   - Syntactic patterns
   - Tables showing forms
4. **Semantic Categories** (h3)
   - Categorized lists (A, B, C, D, E)
   - Examples for each category
5. **Formation Rules** (h3)
   - Derivation patterns
   - Tables with examples
6. **Examples in Context** (h3)
   - Tables or lists of full examples
   - Translations and glosses
7. **Cultural/Linguistic Insights** (h3)
   - Cultural notes
   - Pragmatic information
   - Pedagogical tips

---

## JSON File Structure

### 1. Practice Questions (1.json, 2.json, etc.)

**Structure:**
```json
{
  "practiceQuestions": [
    {
      "question": "Question text here?",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of the correct answer."
    }
  ]
}
```

**Requirements:**
- **Exactly 10 questions** per practice question file
- **Four options** for each question (array indices 0-3)
- **`correctAnswer`**: 0-indexed integer (0, 1, 2, or 3)
- **Question Types:**
  - Morphological analysis
  - Translation tasks
  - Grammatical pattern identification
  - Semantic categorization
  - Application/usage questions
  - Cultural/pragmatic understanding

**Question Writing Guidelines:**
- Questions must directly relate to content in the corresponding HTML file
- Use academic/linguistic terminology when appropriate
- Include the target language in options when testing translation
- Explanations should be comprehensive (1-2 sentences)
- Avoid ambiguous wording
- Balance difficulty levels (easy, medium, hard)

**Question Distribution:**
- 2-3 definition/concept questions
- 3-4 application/example questions
- 2-3 analysis/comparison questions
- 1-2 cultural/pragmatic questions

### 2. CAT.json (Continuous Assessment Test)

**Structure:**
```json
{
  "title": "Continuous Assessment Test [Number] (End of Week [N])",
  "description": "Brief description of what the test evaluates",
  "duration": 60,
  "passingScore": 50,
  "maxAttempts": 3,
  "questions": [
    {
      "question": "[Section Tag] Question text?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": 0
    }
  ]
}
```

**Requirements:**
- **Metadata fields:**
  - `title`: Descriptive title with module/week reference
  - `description`: 1-2 sentence summary of test scope
  - `duration`: Time in minutes (typically 60)
  - `passingScore`: Percentage required to pass (typically 50)
  - `maxAttempts`: Maximum number of attempts allowed (typically 3)

- **Questions:**
  - **30-40 questions** covering all topics in the module
  - Each question tagged with section reference (e.g., "[Adjectives & Verbs Part 01]")
  - No `explanation` field (unlike practice questions)
  - Four options per question
  - 0-indexed `correctAnswer`

**CAT Question Guidelines:**
- Comprehensive coverage of all module topics
- Balanced distribution across lessons
- Progressive difficulty
- Mix of question types
- Questions tagged by topic for student feedback

---

## Content Extraction & Transformation Rules

### From DOCX to HTML

#### 1. Identify Content Boundaries
- Look for section headers with numbering (3.1, 3.1.1, 3.2.1, etc.)
- Each numbered section typically becomes one HTML file
- Subsections (3.1.1, 3.1.2) may be combined into one HTML file

#### 2. Heading Transformation
- **DOCX Heading 1** → `<h2>` with section number
- **DOCX Heading 2** → `<h3>` with subsection number
- **DOCX Heading 3** → `<h4>` with sub-subsection title
- Preserve numbering system from DOCX

#### 3. Text Formatting
- **Bold text** → `<strong>` tags
- **Italic text** → `<em>` tags (if used for emphasis)
- **Example phrases** in target language → `<strong>` tags
- **Translations** → Regular text or arrow notation (→)

#### 4. List Transformation
- Bulleted lists → `<ul>` with `<li>`
- Numbered lists → `<ol>` with `<li>`
- Nested lists → Maintain nesting structure

#### 5. Table Transformation
- DOCX tables → HTML `<table>` with proper structure
- First row with headers → `<thead>` with `<th>`
- Data rows → `<tbody>` with `<td>`
- Maintain column structure and content

#### 6. Special Content
- **Notes/Tips** → `<blockquote>` with emoji if appropriate
- **Highlighted examples** → `<div class="example">`
- **Mnemonic devices** → `<blockquote>` with 📌 emoji

### Question Generation from Content

#### Practice Questions (10 per lesson)
1. **Read the HTML content thoroughly**
2. **Identify key concepts:**
   - Definitions
   - Grammatical patterns
   - Morphological rules
   - Examples
   - Cultural notes

3. **Generate question types:**
   - **Definition questions**: Test understanding of terminology
   - **Pattern recognition**: Identify correct grammatical structures
   - **Translation/Application**: Apply rules to examples
   - **Analysis**: Break down morphological structures
   - **Comparison**: Contrast features or forms
   - **Cultural understanding**: Test pragmatic/cultural insights

4. **Write options:**
   - Make distractors plausible but clearly wrong
   - Use parallel structure in all options
   - Avoid "all of the above" or "none of the above"
   - Vary the position of the correct answer

5. **Write explanations:**
   - Reference specific content from the lesson
   - Explain why the correct answer is right
   - Clarify common misconceptions if relevant

#### CAT Questions (30-40 per module)
1. **Cover all lessons** in the module
2. **Distribute questions proportionally:**
   - More questions for complex topics
   - At least 2-3 questions per lesson
3. **Tag each question** with topic reference: `[Topic Name]`
4. **Progressive difficulty:**
   - Start with basic recall/recognition
   - Move to application
   - End with synthesis/analysis
5. **No explanations** (formative vs. summative assessment)

---

## Quality Control Checklist

### HTML Files
- [ ] Proper HTML5 structure with DOCTYPE
- [ ] Exact CSS styles included
- [ ] Teal color scheme (#008080) applied correctly
- [ ] Semantic heading hierarchy (h2 → h3 → h4)
- [ ] All tables have thead and tbody
- [ ] Special characters rendered correctly (ũ, ĩ, etc.)
- [ ] Consistent spacing and formatting
- [ ] `.container` div wraps all content
- [ ] Examples use `.example` class where appropriate
- [ ] No inline styles (all styling in CSS block)

### JSON Files
- [ ] Valid JSON syntax (no trailing commas)
- [ ] Correct number of questions (10 for practice, 30-40 for CAT)
- [ ] All questions have exactly 4 options
- [ ] `correctAnswer` is 0-indexed integer (0-3)
- [ ] Practice questions include explanations
- [ ] CAT includes all metadata fields
- [ ] CAT questions tagged with topic references
- [ ] Questions directly relate to HTML content
- [ ] No duplicate questions
- [ ] Balanced difficulty distribution

### Content Accuracy
- [ ] Target language text has correct diacritics
- [ ] Translations are accurate
- [ ] Linguistic terminology is correct
- [ ] Examples match the patterns being taught
- [ ] Tables are complete and accurate
- [ ] Cultural notes are appropriate and relevant
- [ ] Numbering system is consistent

### File Organization
- [ ] File names follow convention ({number}.html, {number}.json)
- [ ] intro.html exists for module introduction
- [ ] JSON files only for lessons with practice content
- [ ] CAT.json exists in questions directory
- [ ] All files in correct directory structure

---

## Example Workflow

### Step-by-Step Process for Converting a DOCX Document

1. **Analyze the DOCX structure**
   - Identify main sections and subsections
   - Note the numbering system
   - Identify content that requires practice questions

2. **Create intro.html**
   - Extract module overview/introduction
   - Format with standard HTML template
   - No corresponding JSON file

3. **For each numbered section:**
   - **Create HTML file** (e.g., `1.html`)
     - Copy HTML template
     - Set appropriate title
     - Convert headings to h2/h3/h4
     - Transform lists, tables, and text
     - Apply formatting (strong, blockquote, .example)

   - **Decide if practice questions needed**
     - Content-rich lessons → YES
     - Summary/review sections → MAYBE
     - Introduction sections → NO

   - **If YES, create JSON file** (e.g., `1.json`)
     - Generate 10 questions from content
     - Include all required fields
     - Write clear explanations

4. **Create CAT.json**
   - Review all lessons in module
   - Generate 30-40 comprehensive questions
   - Tag questions by topic
   - Include metadata
   - No explanations

5. **Quality assurance**
   - Validate all HTML files render correctly
   - Test all JSON files parse without errors
   - Verify question accuracy
   - Check for consistency across files

---

## Key Principles

1. **Consistency is paramount**: Use exact same CSS, structure, and formatting patterns across all files

2. **Semantic HTML**: Use proper heading hierarchy and semantic elements

3. **Linguistic accuracy**: Preserve special characters, diacritics, and tone marks

4. **Pedagogical soundness**: Questions should test understanding, not memorization

5. **Cultural sensitivity**: Include cultural context where relevant

6. **Accessibility**: Use proper table structure, alt text, and semantic markup

7. **Maintainability**: Clear structure makes updates easier

8. **Assessment alignment**: Practice questions prepare for CAT questions

---

## Common Patterns by Topic Type

### Grammar Topics
- Definition section
- Morphological structure with tables
- Examples with glosses
- Formation rules
- Exceptions and special cases

### Vocabulary Topics
- Semantic categories (lists)
- Tables with translations
- Usage examples
- Cultural notes

### Verb Topics
- Conjugation tables
- Tense/aspect distinctions
- Subject agreement tables
- Examples in context

### Adjective Topics
- Agreement patterns
- Semantic categories
- Formation from verbs
- Pluralization tables

### Phonology Topics
- Phoneme inventories (tables)
- Articulation descriptions
- Minimal pairs
- Pronunciation rules

---

## Technical Notes

### Character Encoding
- Always use UTF-8 (`<meta charset="UTF-8">`)
- Ensure special characters render correctly
- Common characters: ũ, ĩ, ĩ, ũ, etc.

### Responsive Design
- Container is responsive (90% width, max 1200px)
- Tables should be readable on mobile (consider scrolling)
- Font sizes are relative for accessibility

### Browser Compatibility
- Standard HTML5 and CSS3
- No JavaScript required
- Should work in all modern browsers

---

## Summary: Quick Reference

**HTML File Must Have:**
- Standard HTML5 structure
- Exact CSS styles (teal theme)
- h2 → h3 → h4 hierarchy
- Tables with thead/tbody
- .example class for highlighted boxes
- .container div wrapper

**Practice JSON Must Have:**
- `practiceQuestions` array
- Exactly 10 questions
- 4 options per question
- `correctAnswer` (0-3)
- `explanation` for each

**CAT JSON Must Have:**
- Metadata (title, description, duration, passingScore, maxAttempts)
- `questions` array
- 30-40 questions
- Tagged questions `[Topic Name]`
- No explanations

**File Naming:**
- `intro.html` (no JSON)
- `{number}.html` (sequential)
- `{number}.json` (only if has practice questions)
- `CAT.json` (always present)

---

## Prompt Template for Claude Code

Use this template to instruct Claude Code to generate files from a new DOCX:

```
I have a language curriculum document in DOCX format. Please convert it into HTML lesson files and JSON practice question files following the exact criteria documented in DOCX_TO_HTML_JSON_GENERATION_CRITERIA.md.

Source document: [path to DOCX]
Target directory: templates/{language}/{level}/module-{number}/

Requirements:
1. Generate numbered HTML files (1.html, 2.html, etc.) for each lesson section
2. Create intro.html for module introduction
3. Generate corresponding JSON files with 10 practice questions for content-rich lessons
4. Create CAT.json with 30-40 comprehensive questions covering all topics
5. Follow exact HTML template and CSS styling
6. Use teal color scheme (#008080)
7. Maintain proper heading hierarchy (h2 > h3 > h4)
8. Ensure all special characters and diacritics are correct
9. Questions must test understanding and application, not just memorization

Please read the criteria document carefully and ask for clarification before starting if anything is unclear.
```

---

## MODULE JSON STRUCTURE GENERATION

This section describes how HTML files and question JSON files from a module folder are assembled into the final module JSON structure (like `test.json`).

### Overview of Module JSON

The module JSON brings together:
- Module metadata (title, description, order)
- Topics (container or standalone types)
- Subtopics (within container topics)
- Practice questions (embedded from question JSON files)
- CAT (Continuous Assessment Test)

### 1. Module Root Structure

```json
{
  "title": "MODULE 03",
  "description": "Everyday Conversations and Cultural Context",
  "order": 3,
  "_id": { "$oid": "6891d48461021d79403e5e35" },
  "topics": [...],
  "cat": {...}
}
```

**Rules:**
- `title`: Format as "MODULE XX" (zero-padded, e.g., MODULE 03)
- `description`: Brief description of module theme/focus
- `order`: Numeric order of module in course (1, 2, 3, etc.)
- `_id`: MongoDB ObjectId (unique 24-character hex string)
- `topics`: Array of topic objects
- `cat`: CAT object (appears after topics array)

### 2. Topic Types: Container vs Standalone

There are two distinct topic types:

#### A. Container Topics

Topics with multiple subtopics underneath them.

**Structure:**
```json
{
  "title": "3.1 Adjectives",
  "type": "container",
  "order": 1,
  "_id": { "$oid": "..." },
  "subtopics": [...]
}
```

**Rules:**
- Use when the topic has numbered subsections (e.g., 3.1.1, 3.1.2, 3.1.3)
- `type` must be `"container"`
- Must have `subtopics` array
- No `htmlContent` field at topic level
- No `practiceQuestions` at topic level
- Each subtopic is an HTML file with optional questions

**Identification Criteria:**
- Look for topics with hierarchical numbering (X.Y.Z pattern)
- Multiple related HTML files belong to the same major topic
- Example: "3.1 Adjectives" contains 3.1.1, 3.1.2, 3.1.3, 3.1.4

#### B. Standalone Topics

Topics without subtopics, typically review or practice sections.

**Structure:**
```json
{
  "title": "3.7 Review & Practice",
  "type": "standalone",
  "order": 7,
  "_id": { "$oid": "..." },
  "htmlContent": "kikuyu/beginner/module-three/14.html",
  "passingScore": 50
}
```

**Rules:**
- Use for topics without subsections
- `type` must be `"standalone"`
- Must have `htmlContent` (path to single HTML file)
- Has `passingScore` field (typically 50)
- Usually no `practiceQuestions` (review sections are self-directed)
- No `subtopics` array

**Identification Criteria:**
- Topics titled "Review & Practice" or similar
- Self-contained content in a single HTML file
- No numbered subsections

### 3. Subtopic Structure (within Container Topics)

```json
{
  "title": "3.1.1 Adjectives & Adjective Clauses",
  "htmlContent": "kikuyu/beginner/module-three/1.html",
  "order": 1,
  "_id": { "$oid": "..." },
  "practiceQuestions": [...],
  "passingScore": 50
}
```

**Rules:**
- `title`: Follows hierarchical numbering (X.Y.Z format) with descriptive text
- `htmlContent`: Relative path from templates directory
  - Format: `{language}/{level}/module-{name}/{filename}.html`
  - Example: `kikuyu/beginner/module-three/1.html`
- `order`: Sequential order within parent topic (1, 2, 3, etc.)
- `_id`: Unique MongoDB ObjectId
- `practiceQuestions`: Array of question objects (see below)
- `passingScore`: Typically 50 (representing 50%)

**Optional/Conditional Fields:**
- `practiceQuestions`: Can be omitted OR set to empty string `""` if no questions exist
  - Empty string used when subtopic is introductory/transitional content

### 4. HTML Content Path Mapping

**Mapping Rules:**

| HTML File | Maps To | Type | Has Questions? |
|-----------|---------|------|----------------|
| intro.html | First subtopic of a major section (e.g., 3.4.1) | Subtopic | Usually No |
| 1.html | 3.1.1 | Subtopic | Usually Yes |
| 2.html | 3.1.2 | Subtopic | Usually Yes |
| 14.html | 3.7 | Standalone Topic | No |
| 22.html | 3.9 | Standalone Topic | No |

**Key Principles:**
- HTML files are mapped sequentially to subtopics/topics
- File numbering doesn't necessarily match subtopic numbering
- `intro.html` typically maps to first subtopic (X.Y.1) of major sections
- Higher-numbered HTML files often used for standalone review topics
- Not all HTML files have corresponding question JSON files

**File Presence Analysis (Module 3 Example):**
- **HTML files present:** 1-22, intro (23 total)
- **Question JSON present:** 1,2,3,4,6,7,8,9,11,12,13,16,17,18,19,20,21,CAT (18 files)
- **Missing question JSON:** 5,10,14,15,22,intro (6 files without questions)
- **Interpretation:** HTML files without questions are introductory, transitional, or review content

### 5. Practice Questions Embedding

Questions from `questions/{number}.json` are embedded into subtopics.

**Source File Format:**
```json
{
  "practiceQuestions": [
    {
      "question": "Which of the following best describes...",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": 1,
      "explanation": "Detailed explanation..."
    }
  ]
}
```

**Embedded Format (in module JSON):**
```json
"subtopics": [
  {
    "title": "3.1.1 Adjectives & Adjective Clauses",
    "htmlContent": "kikuyu/beginner/module-three/1.html",
    "order": 1,
    "_id": { "$oid": "..." },
    "practiceQuestions": [
      {
        "question": "Which of the following best describes...",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": 1,
        "explanation": "Detailed explanation..."
      }
    ],
    "passingScore": 50
  }
]
```

**Rules:**
- Extract the `practiceQuestions` array from source JSON
- Embed directly into the subtopic object
- Maintain exact structure (question, options, correctAnswer, explanation)
- **If no question file exists:** Either omit `practiceQuestions` field OR set to empty string `""`

### 6. CAT (Continuous Assessment Test) Structure

CAT appears at module level, after all topics.

**Source: `questions/CAT.json`**
```json
{
  "title": "Continuous Assessment Test 03 (End of Week 12)",
  "description": "This Continuous Assessment Test evaluates...",
  "duration": 60,
  "passingScore": 50,
  "maxAttempts": 3,
  "questions": [...]
}
```

**Embedded in Module JSON:**
```json
{
  "title": "MODULE 03",
  "topics": [...],
  "cat": {
    "title": "Continuous Assessment Test 03 (End of Week 12)",
    "description": "This Continuous Assessment Test evaluates...",
    "duration": 60,
    "passingScore": 50,
    "maxAttempts": 3,
    "_id": { "$oid": "..." },
    "questions": [...]
  }
}
```

**Rules:**
- CAT is a direct property of the module object (not in topics array)
- All fields from CAT.json are copied directly
- Add `_id` field with unique ObjectId
- Questions maintain original structure (no modifications)
- **Critical difference from practice questions:** CAT questions have NO `explanation` field

**CAT Question Format:**
```json
{
  "question": "[Adjectives & Verbs Part 01] Which of the following...",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": 0
}
```

**Note the category tag:** `[Adjectives & Verbs Part 01]` prefix in question text

### 7. Hierarchical Numbering System

**Module Level:**
- Format: `MODULE XX` (zero-padded: 01, 02, 03)

**Topic Level:**
- Format: `X.Y` (e.g., 3.1, 3.2, 3.3)
- First digit matches module number
- Second digit increments sequentially

**Subtopic Level:**
- Format: `X.Y.Z` (e.g., 3.1.1, 3.1.2, 3.1.3)
- Nested under parent topic
- Third digit increments sequentially within topic

**Example Hierarchy (Module 3):**
```
MODULE 03
├── 3.1 Adjectives (container)
│   ├── 3.1.1 Adjectives & Adjective Clauses
│   ├── 3.1.2 Adjective of Quality and Quantity
│   ├── 3.1.3 Adjective of Color
│   └── 3.1.4 Adjectives & their Plural
├── 3.2 Adjective Clauses (container)
│   └── 3.2.1 Relative pronouns
├── 3.3 Demonstratives (container)
│   ├── 3.3.1 [...]
│   └── 3.3.2 [...]
├── 3.4 Verbs (container)
│   ├── 3.4.1 Introduction to Verbs in Kikuyu
│   └── 3.4.2 Infinitive verbs
├── 3.5 [...]
├── 3.6 [...]
├── 3.7 Review & Practice (standalone)
├── 3.8 Tenses (container)
│   ├── 3.8.1 Introduction to Kikuyu Tenses
│   ├── 3.8.2 Present Tense
│   └── [...]
└── 3.9 Review & Practice (standalone)
```

### 8. MongoDB ObjectId Generation

**Format:** `{ "$oid": "6891d48461021d79403e5e35" }`

**Rules:**
- Every structural element gets unique ObjectId:
  - Module
  - Each topic
  - Each subtopic
  - CAT
- 24-character hexadecimal string
- MongoDB BSON ObjectId format
- Generated sequentially during JSON creation

**Where ObjectIds Appear:**
- Module: `"_id": { "$oid": "..." }`
- Topic: `"_id": { "$oid": "..." }`
- Subtopic: `"_id": { "$oid": "..." }`
- CAT: `"_id": { "$oid": "..." }`

**Do NOT add ObjectIds to:**
- Individual questions (practice or CAT)
- Question options
- Explanations

### 9. Order Fields

Every topic and subtopic has an `order` field indicating sequence.

**Rules:**
- `order` is an integer starting from 1
- Increments sequentially (1, 2, 3, 4, ...)
- Determines display/navigation order in LMS
- Critical for sequential learning enforcement

**Examples:**
```json
{
  "topics": [
    { "title": "3.1 Adjectives", "order": 1, ... },
    { "title": "3.2 Adjective Clauses", "order": 2, ... },
    { "title": "3.3 Demonstratives", "order": 3, ... }
  ]
}
```

```json
{
  "subtopics": [
    { "title": "3.1.1 ...", "order": 1, ... },
    { "title": "3.1.2 ...", "order": 2, ... },
    { "title": "3.1.3 ...", "order": 3, ... }
  ]
}
```

### 10. Decision Tree: Container vs Standalone

**When analyzing content, use this decision tree:**

```
Does the topic have numbered subsections (X.Y.Z)?
├── YES → Container Topic
│   ├── Create topic object with type: "container"
│   ├── Add subtopics array
│   ├── Map HTML files to subtopics
│   └── Embed questions from JSON files
│
└── NO → Standalone Topic
    ├── Is it a Review/Practice section?
    │   ├── YES → Standalone Topic (no questions)
    │   └── NO → Evaluate content
    │       ├── Single cohesive topic → Standalone
    │       └── Multiple concepts → Consider splitting
    ├── Create topic object with type: "standalone"
    ├── Add htmlContent field (single HTML file)
    └── Usually no practiceQuestions
```

### 11. Step-by-Step Module JSON Generation

**Process:**

1. **Create module root object**
   - Set title (MODULE XX format)
   - Set description
   - Set order
   - Generate ObjectId
   - Initialize empty topics array

2. **Analyze content structure**
   - Review all HTML files
   - Identify major topics (X.Y numbering)
   - Identify subtopics (X.Y.Z numbering)
   - Identify standalone sections (Review, etc.)

3. **For each major topic:**
   - **If has subtopics (X.Y.Z present):**
     - Create container topic object
     - Set type to "container"
     - Generate ObjectId
     - Create subtopics array
     - For each subtopic:
       - Create subtopic object
       - Map to corresponding HTML file
       - Check if question JSON exists
       - If yes: embed practiceQuestions array
       - If no: omit or set to empty string
       - Set order within parent
       - Generate ObjectId
       - Set passingScore to 50

   - **If no subtopics (standalone):**
     - Create standalone topic object
     - Set type to "standalone"
     - Map to corresponding HTML file
     - Set htmlContent
     - Generate ObjectId
     - Set passingScore to 50
     - Usually no practiceQuestions

4. **Add CAT section**
   - Read questions/CAT.json
   - Create cat object at module level
   - Copy all fields from CAT.json
   - Generate ObjectId for CAT
   - Verify questions have NO explanation field

5. **Validate structure**
   - All topics have order field (sequential)
   - All subtopics have order field (sequential within parent)
   - All htmlContent paths are valid
   - All ObjectIds are unique
   - correctAnswer indices are valid (0-3)
   - Practice questions have explanation field
   - CAT questions do NOT have explanation field
   - JSON is valid (no trailing commas, proper quotes)

### 12. Module JSON Statistics (Module 3 Example)

**File Counts:**
- HTML files: 23 (1-22 + intro.html)
- Question JSON files: 18 (17 practice + 1 CAT)
- Container topics: 7
- Standalone topics: 2
- Total subtopics: ~22
- Practice questions: ~220 (average 10 per subtopic with questions)
- CAT questions: 37

**Structure Breakdown:**
- Module: 1 object
- Topics: 9 objects (7 container + 2 standalone)
- Subtopics: ~22 objects (nested in containers)
- CAT: 1 object
- Total ObjectIds: ~33

### 13. Common Pitfalls to Avoid

**❌ Don't:**
- Add practiceQuestions to container topics (only subtopics)
- Add htmlContent to container topics (only subtopics and standalone)
- Include explanation field in CAT questions
- Use relative paths starting with "/" (use relative paths from templates/)
- Duplicate ObjectIds
- Use non-sequential order numbers
- Mix up container and standalone structures

**✅ Do:**
- Use consistent ObjectId format
- Maintain hierarchical numbering (X.Y.Z)
- Set passingScore to 50 for all
- Use empty string "" for subtopics without questions (if needed)
- Validate JSON syntax before saving
- Cross-reference HTML files with question JSON files
- Test correctAnswer indices (must be 0-3)

### 14. Validation Checklist

Before finalizing module JSON:

- [ ] Module has title, description, order, _id
- [ ] All topics have type specified (container or standalone)
- [ ] Container topics have subtopics array (not htmlContent)
- [ ] Standalone topics have htmlContent (not subtopics)
- [ ] All subtopics have htmlContent, order, _id, passingScore
- [ ] All referenced HTML files exist in folder
- [ ] Practice questions have explanation field
- [ ] CAT questions do NOT have explanation field
- [ ] All order fields are sequential (1, 2, 3...)
- [ ] All ObjectIds are unique 24-char hex strings
- [ ] All correctAnswer values are 0-3
- [ ] JSON is valid (test with JSON validator)
- [ ] Paths use forward slashes and are relative to templates/

### 15. Example: Building a Container Topic

**Given:**
- HTML files: 1.html, 2.html, 3.html, 4.html
- Question files: 1.json, 2.json, 3.json, 4.json
- Topic: "3.1 Adjectives"

**Build:**
```json
{
  "title": "3.1 Adjectives",
  "type": "container",
  "order": 1,
  "_id": { "$oid": "6891d48461021d79403e5e36" },
  "subtopics": [
    {
      "title": "3.1.1 Adjectives & Adjective Clauses",
      "htmlContent": "kikuyu/beginner/module-three/1.html",
      "order": 1,
      "_id": { "$oid": "6891d48461021d79403e5e37" },
      "practiceQuestions": [ /* from 1.json */ ],
      "passingScore": 50
    },
    {
      "title": "3.1.2 Adjective of Quality and Quantity",
      "htmlContent": "kikuyu/beginner/module-three/2.html",
      "order": 2,
      "_id": { "$oid": "6891d48461021d79403e5e38" },
      "practiceQuestions": [ /* from 2.json */ ],
      "passingScore": 50
    },
    {
      "title": "3.1.3 Adjective of Color",
      "htmlContent": "kikuyu/beginner/module-three/3.html",
      "order": 3,
      "_id": { "$oid": "6891d48461021d79403e5e39" },
      "practiceQuestions": [ /* from 3.json */ ],
      "passingScore": 50
    },
    {
      "title": "3.1.4 Adjectives & their Plural",
      "htmlContent": "kikuyu/beginner/module-three/4.html",
      "order": 4,
      "_id": { "$oid": "6891d48461021d79403e5e3a" },
      "practiceQuestions": [ /* from 4.json */ ],
      "passingScore": 50
    }
  ]
}
```

### 16. Example: Building a Standalone Topic

**Given:**
- HTML file: 14.html
- No question file (review section)
- Topic: "3.7 Review & Practice"

**Build:**
```json
{
  "title": "3.7 Review & Practice",
  "type": "standalone",
  "order": 7,
  "_id": { "$oid": "6891d48461021d79403e5e48" },
  "htmlContent": "kikuyu/beginner/module-three/14.html",
  "passingScore": 50
}
```

---

## Summary: Module JSON Generation Quick Reference

**Module Structure:**
```
Module
├── title, description, order, _id
├── topics[] (array of container or standalone topics)
│   ├── Container Topic
│   │   ├── title, type: "container", order, _id
│   │   └── subtopics[]
│   │       └── Subtopic
│   │           ├── title, htmlContent, order, _id
│   │           ├── practiceQuestions[] (optional)
│   │           └── passingScore
│   └── Standalone Topic
│       ├── title, type: "standalone", order, _id
│       ├── htmlContent
│       └── passingScore
└── cat
    ├── title, description, duration, passingScore, maxAttempts, _id
    └── questions[] (no explanation field)
```

**Key Rules:**
1. Container topics → have subtopics array
2. Standalone topics → have htmlContent directly
3. Subtopics → always have htmlContent, optional practiceQuestions
4. Practice questions → have explanation field
5. CAT questions → NO explanation field
6. All structural elements → unique ObjectId
7. All topics/subtopics → order field (sequential)
8. All subtopics/standalone → passingScore (typically 50)
9. HTML paths → relative from templates/ directory
10. Hierarchical numbering → X.Y for topics, X.Y.Z for subtopics
